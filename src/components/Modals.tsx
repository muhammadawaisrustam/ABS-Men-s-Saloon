import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Star, Clock, MessageCircle } from 'lucide-react'
import { useContent, visible, whatsappLink, type ModalKind } from '../lib/content'

interface ModalsProps {
  active: ModalKind
  onClose: () => void
  onBook: () => void
}

const TITLES: Record<Exclude<ModalKind, null>, string> = {
  book: 'Book your appointment',
  services: 'Services & prices',
  reviews: 'What our clients say',
}

function BookForm({ onDone }: { onDone: () => void }) {
  const { settings, services: all } = useContent()
  const SERVICES = visible(all)
  const [name, setName] = useState('')
  const [service, setService] = useState(SERVICES[0]?.name ?? '')
  const [when, setWhen] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = `Hi ABS Men's Salon, I'm ${name}. I'd like to book ${service ? `a ${service}` : 'an appointment'}${when ? ` on ${when}` : ''}.`
    window.open(whatsappLink(settings, text), '_blank', 'noopener,noreferrer')
    onDone()
  }

  const field = 'w-full min-h-12 px-4 rounded-xl border border-line bg-ink text-cream placeholder:text-smoke/60 focus:outline-none focus:ring-2 focus:ring-gold'

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-smoke">Fill this in and we&apos;ll open WhatsApp with your booking message ready to send.</p>
      <div>
        <label htmlFor="bk-name" className="block text-sm font-semibold mb-1.5">Your name</label>
        <input id="bk-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="bk-service" className="block text-sm font-semibold mb-1.5">Service</label>
        <select id="bk-service" value={service} onChange={(e) => setService(e.target.value)} className={field}>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="bk-when" className="block text-sm font-semibold mb-1.5">Preferred day and time <span className="font-normal text-smoke">(optional)</span></label>
        <input id="bk-when" value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. Saturday 5 pm" className={field} />
      </div>
      <button type="submit" className="w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient text-ink font-bold cursor-pointer">
        <MessageCircle className="w-5 h-5" aria-hidden="true" /> Send on WhatsApp
      </button>
    </form>
  )
}

export function Modals({ active, onClose, onBook }: ModalsProps) {
  const content = useContent()
  const SERVICES = visible(content.services)
  const REVIEWS = visible(content.reviews)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, onClose])

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.15 } }}
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-charcoal p-6 sm:p-8 shadow-2xl"
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full text-smoke hover:text-cream hover:bg-graphite cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">ABS Men&apos;s Salon</p>
            <h2 id="modal-title" className="mt-1 mb-5 pr-10 text-2xl font-bold text-cream">{TITLES[active]}</h2>

            {active === 'book' && <BookForm onDone={onClose} />}

            {active === 'services' && (
              <div className="space-y-5">
                <ul className="divide-y divide-line">
                  {SERVICES.map((s) => (
                    <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                      <div>
                        <p className="font-semibold text-cream">{s.name}</p>
                        <p className="text-sm text-smoke">{s.description}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-smoke"><Clock className="w-3.5 h-3.5" aria-hidden="true" /> {s.duration}</p>
                      </div>
                      <span className="font-bold text-gold whitespace-nowrap">{s.price}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={onBook} className="w-full min-h-12 rounded-full bg-gold-gradient text-ink font-bold cursor-pointer">Book a service</button>
              </div>
            )}

            {active === 'reviews' && (
              <div className="space-y-3">
                {REVIEWS.map((r) => (
                  <figure key={r.id} className="rounded-2xl border border-line bg-ink p-4">
                    <div className="flex gap-0.5 text-gold" role="img" aria-label={`${r.rating} out of 5 stars`}>
                      {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-gold" aria-hidden="true" />)}
                    </div>
                    <blockquote className="mt-2 text-sm text-cream">“{r.text}”</blockquote>
                    <figcaption className="mt-2 text-xs font-semibold text-smoke">{r.name}</figcaption>
                  </figure>
                ))}
                <button onClick={onBook} className="mt-2 w-full min-h-12 rounded-full bg-gold-gradient text-ink font-bold cursor-pointer">Book your chair</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
