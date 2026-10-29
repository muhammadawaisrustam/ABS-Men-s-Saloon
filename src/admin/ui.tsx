import { createContext, useCallback, useContext, useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

// ---- Small form building blocks for the admin panel ----

export const inputCls =
  'w-full min-h-11 px-3.5 py-2 rounded-xl border border-line bg-ink text-cream placeholder:text-smoke/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent'

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-cream">{label}</label>
      {children}
      {hint && <p className="text-xs text-smoke">{hint}</p>}
    </div>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${inputCls} py-2.5 resize-y ${props.className ?? ''}`} />
}

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
const variants: Record<Variant, string> = {
  primary: 'bg-gold-gradient text-ink font-bold hover:brightness-110',
  secondary: 'border border-line bg-graphite text-cream hover:border-gold/60',
  danger: 'border border-red-500/40 text-red-300 hover:bg-red-500/10',
  ghost: 'text-smoke hover:text-cream hover:bg-graphite',
}

export function Button({ variant = 'secondary', busy, children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; busy?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      className={`inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${className ?? ''}`}
    >
      {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 min-h-11 text-sm text-smoke cursor-pointer"
    >
      <span className={`relative inline-block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-gold' : 'bg-graphite border border-line'}`}>
        <span className={`absolute top-1 left-0 w-4 h-4 rounded-full bg-cream transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </span>
      {label}
    </button>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-charcoal p-5 sm:p-6 ${className ?? ''}`}>{children}</div>
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-cream">{title}</h1>
        {description && <p className="mt-1 text-sm text-smoke max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ---- Toast messages ----
interface Toast { id: number; kind: 'ok' | 'error'; text: string }
const ToastCtx = createContext<(kind: Toast['kind'], text: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, kind, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 6000 : 3000)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl ${t.kind === 'ok' ? 'border-gold/40 bg-charcoal text-cream' : 'border-red-500/50 bg-[#2a1414] text-red-200'}`}>
            {t.kind === 'ok' ? <CheckCircle2 className="w-4 h-4 mt-0.5 text-gold shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function errorText(e: unknown) {
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message)
  return 'Something went wrong. Please try again.'
}
