import { useEffect, useState } from 'react'
import { Upload, Trash2, Plus, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { DEFAULT_SETTINGS, type Settings } from '../lib/content'
import { Button, Card, Field, SectionHeader, TextArea, TextInput, errorText, useToast } from './ui'
import { uploadMedia, pathFromUrl, removeMedia } from './upload'

export type SettingField =
  | { key: keyof Settings; label: string; type: 'text' | 'textarea'; hint?: string; placeholder?: string }
  | { key: 'heroChips'; label: string; type: 'list'; hint?: string }
  | { key: 'logoUrl' | 'heroMediaUrl'; label: string; type: 'media'; accept: string; hint?: string }

export interface SettingGroup {
  title: string
  fields: SettingField[]
}

export async function loadSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('site_settings').select('data').eq('id', 'site').maybeSingle()
  if (error) throw error
  return { ...DEFAULT_SETTINGS, ...((data?.data as Partial<Settings>) ?? {}) }
}

function MediaField({ value, onChange, accept }: { value: string; onChange: (v: string) => void; accept: string }) {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(value)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      const { url } = await uploadMedia(file, 'branding')
      onChange(url)
      toast('ok', 'Uploaded. Click "Save changes" to publish it.')
    } catch (e) {
      toast('error', errorText(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-32 h-24 rounded-xl border border-line bg-ink overflow-hidden flex items-center justify-center text-xs text-smoke">
        {value ? (isVideo ? <video src={value} muted className="w-full h-full object-cover" /> : <img src={value} alt="" className="w-full h-full object-contain" />) : 'Using default'}
      </div>
      <label className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-xl border border-line bg-graphite text-sm font-semibold text-cream hover:border-gold/60 cursor-pointer ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
        <Upload className="w-4 h-4" aria-hidden="true" /> {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
        <input type="file" accept={accept} className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
      </label>
      {value && (
        <Button variant="danger" type="button" onClick={() => onChange('')}>
          <Trash2 className="w-4 h-4" aria-hidden="true" /> Remove
        </Button>
      )}
    </div>
  )
}

function ListField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <TextInput value={item} onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))} aria-label={`Item ${i + 1}`} />
          <Button type="button" variant="ghost" aria-label="Remove item" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => onChange([...value, ''])}>
        <Plus className="w-4 h-4" aria-hidden="true" /> Add item
      </Button>
    </div>
  )
}

export function SettingsEditor({ title, description, groups }: { title: string; description: string; groups: SettingGroup[] }) {
  const toast = useToast()
  const [saved, setSaved] = useState<Settings | null>(null)
  const [draft, setDraft] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
      .then((s) => { setSaved(s); setDraft(s) })
      .catch((e) => toast('error', errorText(e)))
  }, [toast])

  if (!draft || !saved) return <p className="text-smoke">Loading…</p>
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setDraft({ ...draft, [k]: v })

  const save = async () => {
    setSaving(true)
    try {
      // Re-read so we never overwrite fields changed in another tab
      const latest = await loadSettings()
      const changed = Object.fromEntries(
        (Object.keys(draft) as (keyof Settings)[]).filter((k) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k])).map((k) => [k, draft[k]]),
      )
      const next = { ...latest, ...changed }
      const { error } = await supabase.from('site_settings').upsert({ id: 'site', data: next, updated_at: new Date().toISOString() })
      if (error) throw error
      // Clean up replaced uploads
      for (const k of ['logoUrl', 'heroMediaUrl'] as const) {
        if (k in changed && latest[k] && latest[k] !== next[k]) await removeMedia(pathFromUrl(latest[k]))
      }
      setSaved(next)
      setDraft(next)
      toast('ok', 'Saved. The website shows the changes on the next page load.')
    } catch (e) {
      toast('error', errorText(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <SectionHeader
        title={title}
        description={description}
        action={
          <div className="flex gap-2">
            {dirty && <Button onClick={() => setDraft(saved)}>Undo changes</Button>}
            <Button variant="primary" onClick={save} busy={saving} disabled={!dirty}>Save changes</Button>
          </div>
        }
      />
      <div className="space-y-5">
        {groups.map((g) => (
          <Card key={g.title}>
            <h2 className="text-lg font-semibold text-cream mb-4">{g.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {g.fields.map((f) => {
                const id = `set-${f.key}`
                const wide = f.type === 'textarea' || f.type === 'media' || f.type === 'list'
                return (
                  <div key={f.key} className={wide ? 'md:col-span-2' : ''}>
                    <Field label={f.label} hint={f.hint} htmlFor={id}>
                      {f.type === 'text' && <TextInput id={id} value={String(draft[f.key] ?? '')} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value as never)} />}
                      {f.type === 'textarea' && <TextArea id={id} value={String(draft[f.key] ?? '')} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value as never)} />}
                      {f.type === 'list' && <ListField value={draft.heroChips} onChange={(v) => set('heroChips', v)} />}
                      {f.type === 'media' && <MediaField value={draft[f.key]} accept={f.accept} onChange={(v) => set(f.key, v)} />}
                    </Field>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
      {dirty && (
        <div className="sticky bottom-4 mt-6 flex justify-end">
          <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-charcoal/95 backdrop-blur px-4 py-3 shadow-2xl">
            <span className="text-sm text-smoke">You have unsaved changes</span>
            <Button variant="primary" onClick={save} busy={saving}>Save changes</Button>
          </div>
        </div>
      )}
    </div>
  )
}
