import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button, Card, SectionHeader, TextInput, errorText, useToast } from './ui'

export function AdminsEditor({ myEmail }: { myEmail: string }) {
  const toast = useToast()
  const [admins, setAdmins] = useState<{ email: string }[]>([])
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('admins').select('email').order('created_at')
    if (error) toast('error', errorText(error))
    else setAdmins(data)
  }, [toast])
  useEffect(() => { load() }, [load])

  const add = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const { error } = await supabase.from('admins').insert({ email: email.trim().toLowerCase() })
    setBusy(false)
    if (error) return toast('error', errorText(error))
    toast('ok', 'Admin added. They can now create an account with that email.')
    setEmail('')
    load()
  }

  const remove = async (target: string) => {
    if (!window.confirm(`Remove ${target} as an admin?`)) return
    const { error } = await supabase.from('admins').delete().eq('email', target)
    if (error) return toast('error', errorText(error))
    toast('ok', 'Admin removed.')
    load()
  }

  return (
    <div>
      <SectionHeader title="Admins" description="People on this list can sign in and edit the website. To add someone, enter their email here, then they create an account on the sign-in page with that same email." />
      <Card className="mb-5">
        <form onSubmit={add} className="flex flex-col sm:flex-row gap-3">
          <TextInput type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Admin email" />
          <Button variant="primary" type="submit" busy={busy} className="shrink-0"><UserPlus className="w-4 h-4" aria-hidden="true" /> Add admin</Button>
        </form>
      </Card>
      <ul className="space-y-3">
        {admins.map((a) => (
          <li key={a.email}>
            <Card className="flex items-center justify-between gap-3 !py-3">
              <span className="text-cream break-all">{a.email}{a.email.toLowerCase() === myEmail.toLowerCase() && <span className="ml-2 text-xs text-gold">(you)</span>}</span>
              {a.email.toLowerCase() !== myEmail.toLowerCase() && (
                <Button variant="danger" onClick={() => remove(a.email)}><Trash2 className="w-4 h-4" aria-hidden="true" /> Remove</Button>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
