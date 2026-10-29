import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { AbsLogo } from '../components/AbsLogo'
import { Button, Field, TextInput, errorText } from './ui'

type Mode = 'signin' | 'signup' | 'forgot' | 'reset'

export function AuthScreen({ initialMode = 'signin', onDone }: { initialMode?: Mode; onDone?: () => void }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const redirectTo = `${window.location.origin}/admin`
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } })
        if (error) throw error
        if (!data.session) setMsg({ kind: 'ok', text: 'Account created. Check your email and click the confirmation link, then sign in.' })
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
        if (error) throw error
        setMsg({ kind: 'ok', text: 'If that email has an account, a reset link is on its way.' })
      } else {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        setMsg({ kind: 'ok', text: 'Password updated.' })
        onDone?.()
      }
    } catch (err) {
      setMsg({ kind: 'error', text: errorText(err) })
    } finally {
      setBusy(false)
    }
  }

  const titles: Record<Mode, string> = {
    signin: 'Sign in to the admin panel',
    signup: 'Create your admin account',
    forgot: 'Reset your password',
    reset: 'Choose a new password',
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-charcoal p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <AbsLogo className="w-24 h-24" />
          <h1 className="mt-4 text-2xl font-bold text-cream">{titles[mode]}</h1>
          <p className="mt-1 text-sm text-smoke">ABS Men&apos;s Salon website</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode !== 'reset' && (
            <Field label="Email" htmlFor="auth-email">
              <TextInput id="auth-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          )}
          {mode !== 'forgot' && (
            <Field label={mode === 'reset' ? 'New password' : 'Password'} hint={mode !== 'signin' ? 'At least 8 characters.' : undefined} htmlFor="auth-pass">
              <TextInput id="auth-pass" type="password" required minLength={mode === 'signin' ? undefined : 8} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
          )}
          {msg && <p role="status" className={`text-sm ${msg.kind === 'ok' ? 'text-gold-light' : 'text-red-300'}`}>{msg.text}</p>}
          <Button variant="primary" type="submit" busy={busy} className="w-full">
            {{ signin: 'Sign in', signup: 'Create account', forgot: 'Send reset link', reset: 'Update password' }[mode]}
          </Button>
        </form>
        {mode !== 'reset' && (
          <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
            {mode === 'signin' ? (
              <>
                <button className="min-h-11 text-gold hover:text-gold-light cursor-pointer" onClick={() => { setMode('signup'); setMsg(null) }}>First time? Create account</button>
                <button className="min-h-11 text-smoke hover:text-cream cursor-pointer" onClick={() => { setMode('forgot'); setMsg(null) }}>Forgot password?</button>
              </>
            ) : (
              <button className="min-h-11 text-gold hover:text-gold-light cursor-pointer" onClick={() => { setMode('signin'); setMsg(null) }}>Back to sign in</button>
            )}
          </div>
        )}
        <a href="/" className="mt-4 block text-center text-sm text-smoke hover:text-cream">← Back to website</a>
      </div>
    </div>
  )
}
