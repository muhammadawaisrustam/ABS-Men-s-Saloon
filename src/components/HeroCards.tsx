import { motion } from 'motion/react'
import { Star, ArrowRight, Scissors, Sparkles } from 'lucide-react'
import { useContent } from '../lib/content'

interface HeroCardsProps {
  onBookClick: () => void
  onServicesClick: () => void
  onReviewsClick: () => void
}

const card =
  'rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border border-line bg-charcoal/95 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow] duration-300 hover:border-gold/50 min-h-[220px] lg:min-h-[240px]'

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export function HeroCards({ onBookClick, onServicesClick, onReviewsClick }: HeroCardsProps) {
  const { settings: s } = useContent()
  return (
    <section aria-label="Highlights" className="relative z-30 w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8">
      {/* Booking pill centred over the middle card */}
      <div className="relative z-40 flex justify-center mb-6 sm:mb-8">
        <motion.button
          onClick={onBookClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 min-h-11 px-7 sm:px-9 rounded-full bg-gold-gradient text-ink font-bold text-sm sm:text-base shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          {s.bookingPillText}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 items-stretch">
        <motion.div {...enter(0.1)} className={`${card} flex flex-col justify-between group`}>
          <div className="flex items-center gap-3 text-gold">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-gold/40 bg-ink">
              <Scissors className="w-5 h-5" aria-hidden="true" />
            </span>
            <Sparkles className="w-5 h-5 text-smoke group-hover:text-gold transition-colors" aria-hidden="true" />
          </div>
          <h2 className="my-4 text-lg sm:text-[19px] lg:text-xl font-medium leading-snug text-cream">
            {s.card1Title}{' '}
            <span className="font-bold text-gold-gradient">{s.card1Highlight}</span>
          </h2>
          <button
            onClick={onServicesClick}
            className="self-start inline-flex items-center gap-1.5 min-h-11 text-sm font-bold text-cream underline underline-offset-4 decoration-gold hover:text-gold-light cursor-pointer group/link"
          >
            See Prices
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
          </button>
        </motion.div>

        <motion.div {...enter(0.2)} className={`${card} flex flex-col items-center justify-center text-center`}>
          <h2 className="text-2xl lg:text-[28px] font-bold leading-tight text-cream">
            {s.card2Title}
            <br />
            <span className="font-brush font-normal text-4xl lg:text-5xl text-gold-gradient">{s.card2Highlight}</span>
          </h2>
          <p className="mt-3 max-w-[320px] text-sm text-smoke leading-relaxed">
            {s.card2Text}
          </p>
        </motion.div>

        <motion.div {...enter(0.3)} className={`${card} flex flex-col justify-between`}>
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-gold fill-gold" aria-hidden="true" />
            <span className="text-xl font-bold text-cream">{s.ratingValue}</span>
            <span className="text-sm text-smoke">rating</span>
          </div>
          <button onClick={onReviewsClick} className="flex items-center gap-3 py-1 text-left cursor-pointer group/rev" aria-label="Read customer reviews">
            <span className="flex -space-x-2.5" aria-hidden="true">
              {['A', 'B', 'S'].map((l) => (
                <span key={l} className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-charcoal bg-graphite text-gold text-sm font-bold">
                  {l}
                </span>
              ))}
            </span>
            <span className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-cream group-hover/rev:text-gold-light transition-colors">{s.clientsCount}</span>
              <span className="text-xs text-smoke">{s.clientsLabel}</span>
            </span>
          </button>
          <p className="text-sm text-smoke leading-relaxed">{s.card3Text}</p>
        </motion.div>
      </div>
    </section>
  )
}
