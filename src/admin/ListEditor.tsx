import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ArrowUp, ArrowDown, Trash2, Plus, Save, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Row } from '../lib/content'
import { Button, Card, Field, SectionHeader, TextArea, TextInput, Toggle, errorText, useToast } from './ui'

export interface ListField<T> {
  key: keyof T & string
  label: string
  type: 'text' | 'textarea' | 'rating'
  placeholder?: string
  required?: boolean
  wide?: boolean
}

interface ListEditorProps<T extends Row> {
  table: string
  title: string
  description: string
  itemName: string
  fields: ListField<T>[]
  newItem: Omit<T, keyof Row>
  /** Extra controls above the list (e.g. an upload button) */
  toolbar?: (reload: () => Promise<void>, nextOrder: number) => ReactNode
  /** Shown at the start of each row (e.g. an image preview) */
  preview?: (row: T) => ReactNode
  /** Called before a row is deleted (e.g. to remove its photo) */
  onDelete?: (row: T) => Promise<void>
  hideAdd?: boolean
}

export function ListEditor<T extends Row>({ table, title, description, itemName, fields, newItem, toolbar, preview, onDelete, hideAdd }: ListEditorProps<T>) {
  const toast = useToast()
  const [rows, setRows] = useState<T[] | null>(null)
  const [drafts, setDrafts] = useState<Record<string, T>>({})
  const [busy, setBusy] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    if (error) { toast('error', errorText(error)); return }
    setRows(data as T[])
    setDrafts({})
  }, [table, toast])

  useEffect(() => { reload() }, [reload])

  if (!rows) return <p className="text-smoke">Loading…</p>
  const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 1
  const current = (r: T) => drafts[r.id] ?? r
  const isDirty = (r: T) => !!drafts[r.id] && JSON.stringify(drafts[r.id]) !== JSON.stringify(r)
  const edit = (r: T, key: string, value: unknown) => setDrafts((d) => ({ ...d, [r.id]: { ...current(r), [key]: value } }))

  const run = async (id: string, fn: () => Promise<void>, ok?: string) => {
    setBusy(id)
    try {
      await fn()
      if (ok) toast('ok', ok)
    } catch (e) {
      toast('error', errorText(e))
    } finally {
      setBusy(null)
    }
  }

  const add = () =>
    run('add', async () => {
      const { data, error } = await supabase.from(table).insert({ ...newItem, sort_order: nextOrder }).select().single()
      if (error) throw error
      setRows([...rows, data as T])
      setTimeout(() => document.getElementById(`row-${(data as T).id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    }, `New ${itemName} added. Fill it in and click Save.`)

  const save = (r: T) =>
    run(r.id, async () => {
      const d = current(r)
      const missing = fields.find((f) => f.required && !String(d[f.key] ?? '').trim())
      if (missing) throw new Error(`${missing.label} can't be empty.`)
      const patch = Object.fromEntries(fields.map((f) => [f.key, d[f.key]]))
      const { data, error } = await supabase.from(table).update(patch).eq('id', r.id).select().single()
      if (error) throw error
      setRows(rows.map((x) => (x.id === r.id ? (data as T) : x)))
      setDrafts(({ [r.id]: _, ...rest }) => rest)
    }, 'Saved.')

  const remove = (r: T) => {
    if (!window.confirm(`Delete this ${itemName}? This can't be undone.`)) return
    run(r.id, async () => {
      if (onDelete) await onDelete(r)
      const { error } = await supabase.from(table).delete().eq('id', r.id)
      if (error) throw error
      setRows(rows.filter((x) => x.id !== r.id))
    }, `${itemName[0].toUpperCase()}${itemName.slice(1)} deleted.`)
  }

  const setVisible = (r: T, v: boolean) =>
    run(r.id, async () => {
      const { error } = await supabase.from(table).update({ visible: v }).eq('id', r.id)
      if (error) throw error
      setRows(rows.map((x) => (x.id === r.id ? { ...x, visible: v } : x)))
    }, v ? 'Shown on the website.' : 'Hidden from the website.')

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= rows.length) return
    const reordered = [...rows]
    ;[reordered[i], reordered[j]] = [reordered[j], reordered[i]]
    const withOrder = reordered.map((r, k) => ({ ...r, sort_order: k + 1 }))
    run(rows[i].id, async () => {
      const changed = withOrder.filter((r) => rows.find((x) => x.id === r.id)?.sort_order !== r.sort_order)
      const results = await Promise.all(changed.map((r) => supabase.from(table).update({ sort_order: r.sort_order }).eq('id', r.id)))
      const err = results.find((x) => x.error)?.error
      if (err) throw err
      setRows(withOrder)
    })
  }

  return (
    <div>
      <SectionHeader
        title={title}
        description={description}
        action={!hideAdd && <Button variant="primary" onClick={add} busy={busy === 'add'}><Plus className="w-4 h-4" aria-hidden="true" /> Add {itemName}</Button>}
      />
      {toolbar?.(reload, nextOrder)}
      {rows.length === 0 && <Card><p className="text-smoke">Nothing here yet.</p></Card>}
      <ul className="space-y-4">
        {rows.map((r, i) => {
          const d = current(r)
          const dirty = isDirty(r)
          return (
            <li key={r.id} id={`row-${r.id}`}>
              <Card className={`${!r.visible ? 'opacity-70' : ''} ${dirty ? 'border-gold/60' : ''}`}>
                <div className="flex flex-col lg:flex-row gap-5">
                  {preview && <div className="shrink-0">{preview(r)}</div>}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((f) => {
                      const id = `${r.id}-${f.key}`
                      const val = d[f.key] as unknown
                      return (
                        <div key={f.key} className={f.wide || f.type === 'textarea' ? 'md:col-span-2' : ''}>
                          <Field label={f.label} htmlFor={id}>
                            {f.type === 'text' && <TextInput id={id} value={String(val ?? '')} placeholder={f.placeholder} onChange={(e) => edit(r, f.key, e.target.value)} />}
                            {f.type === 'textarea' && <TextArea id={id} value={String(val ?? '')} placeholder={f.placeholder} onChange={(e) => edit(r, f.key, e.target.value)} />}
                            {f.type === 'rating' && (
                              <div className="flex gap-1" role="radiogroup" aria-label={f.label}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <button
                                    key={n}
                                    type="button"
                                    role="radio"
                                    aria-checked={val === n}
                                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                                    onClick={() => edit(r, f.key, n)}
                                    className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-graphite cursor-pointer"
                                  >
                                    <Star className={`w-6 h-6 ${n <= Number(val) ? 'text-gold fill-gold' : 'text-smoke'}`} />
                                  </button>
                                ))}
                              </div>
                            )}
                          </Field>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" aria-label="Move up" disabled={i === 0 || !!busy} onClick={() => move(i, -1)}><ArrowUp className="w-4 h-4" /></Button>
                    <Button variant="ghost" aria-label="Move down" disabled={i === rows.length - 1 || !!busy} onClick={() => move(i, 1)}><ArrowDown className="w-4 h-4" /></Button>
                    <Toggle checked={r.visible} onChange={(v) => setVisible(r, v)} label={r.visible ? 'Shown' : 'Hidden'} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="danger" onClick={() => remove(r)} disabled={!!busy}><Trash2 className="w-4 h-4" aria-hidden="true" /> Delete</Button>
                    {dirty && <Button onClick={() => setDrafts(({ [r.id]: _, ...rest }) => rest)}>Undo</Button>}
                    <Button variant="primary" onClick={() => save(r)} busy={busy === r.id} disabled={!dirty}><Save className="w-4 h-4" aria-hidden="true" /> Save</Button>
                  </div>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
