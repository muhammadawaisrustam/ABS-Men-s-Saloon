import { motion } from 'motion/react'
import { Clock, MapPin, Phone, Star, ImageIcon, MessageCircle } from 'lucide-react'
import { SERVICES, REVIEWS, HOURS, ADDRESS, PHONE_DISPLAY, PHONE_LINK, whatsappLink } from '../data'

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

function Heading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <motion.div {...reveal} className="text-center mb-10 sm:mb-12">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">{title}</h2>
    </motion.div>
  )
}

const wrap = 'w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8'

export function Sections({ onBookClick }: { onBookClick: () => void }) {
  return (
    <>
      <section id="services" aria-labelledby="services-title" className={`${wrap} pt-24 sm:pt-28`}>
        <Heading eyebrow="Price list" title="Our Services" id="services-title" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.05 }}
              className="rounded-2xl border border-line bg-charcoal p-6 hover:border-gold/50 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold text-cream">{s.name}</h3>
                <span className="font-bold text-gold whitespace-nowrap">{s.price}</span>
              </div>
              <p className="mt-1.5 text-sm text-smoke">{s.desc}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-smoke"><Clock className="w-3.5 h-3.5" aria-hidden="true" /> {s.time}</p>
            </motion.li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <button onClick={onBookClick} className="inline-flex items-center min-h-12 px-8 rounded-full bg-gold-gradient text-ink font-bold cursor-pointer">Book a service</button>
        </div>
      </section>

      <section id="gallery" aria-labelledby="gallery-title" className={`${wrap} pt-24 sm:pt-28`}>
        <Heading eyebrow="Our work" title="Fresh Cuts, Clean Fades" id="gallery-title" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Replace these placeholders with real photos (WebP, with alt text). */}
          {[1, 2, 3, 4].map((n) => (
            <motion.div
              key={n}
              {...reveal}
              className="aspect-[4/5] rounded-2xl border-2 border-dashed border-line bg-charcoal flex flex-col items-center justify-center gap-2 text-smoke"
            >
              <ImageIcon className="w-6 h-6" aria-hidden="true" />
              <span className="text-sm">Photo {n}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="reviews" aria-labelledby="reviews-title" className={`${wrap} pt-24 sm:pt-28`}>
        <Heading eyebrow="Reviews" title="What Our Clients Say" id="reviews-title" />
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <motion.li key={i} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-2xl border border-line bg-charcoal p-6">
              <div className="flex gap-0.5 text-gold" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-gold" aria-hidden="true" />)}
              </div>
              <blockquote className="mt-3 text-lg leading-relaxed text-cream">“{r.text}”</blockquote>
              <p className="mt-3 text-sm font-semibold text-smoke">{r.name}</p>
            </motion.li>
          ))}
        </ul>
      </section>

      <section id="visit" aria-labelledby="visit-title" className={`${wrap} pt-24 sm:pt-28`}>
        <motion.div {...reveal} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center rounded-3xl border border-gold/25 bg-[radial-gradient(ellipse_at_top_left,rgba(217,169,52,0.16),transparent_60%)] bg-charcoal p-6 sm:p-10 lg:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Visit us</p>
            <h2 id="visit-title" className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">Ready For A Fresh Look?</h2>
            <p className="mt-3 text-smoke">Book your chair on WhatsApp, give us a call, or just walk in.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-gold-gradient text-ink font-bold">
                <MessageCircle className="w-5 h-5" aria-hidden="true" /> Book on WhatsApp
              </a>
              <a href={PHONE_LINK} className="inline-flex items-center gap-2 min-h-12 px-6 rounded-full border border-cream/40 text-cream font-semibold hover:bg-cream hover:text-ink transition-colors">
                <Phone className="w-4 h-4" aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-smoke"><MapPin className="w-5 h-5 text-gold" aria-hidden="true" /> {ADDRESS}</p>
          </div>
          <div className="rounded-2xl border border-line bg-ink/70 p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-cream"><Clock className="w-5 h-5 text-gold" aria-hidden="true" /> Opening Hours</h3>
            <dl className="mt-4 divide-y divide-line">
              {HOURS.map(([d, t]) => (
                <div key={d} className="flex justify-between gap-4 py-3.5">
                  <dt className="text-smoke">{d}</dt>
                  <dd className="font-semibold text-cream">{t}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </section>
    </>
  )
}
