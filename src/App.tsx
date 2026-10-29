import { useCallback, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { Phone } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { HeroFrame } from './components/HeroFrame'
import { HeroCards } from './components/HeroCards'
import { Sections } from './components/Sections'
import { Modals } from './components/Modals'
import { AbsLogo } from './components/AbsLogo'
import { CONTACTS, ADDRESS, type ModalKind } from './data'

export default function App() {
  const [activeNav, setActiveNav] = useState('')
  const [modal, setModal] = useState<ModalKind>(null)
  const close = useCallback(() => setModal(null), [])
  const book = useCallback(() => setModal('book'), [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-3 focus:text-ink">
        Skip to main content
      </a>
      <div id="top" className="min-h-screen bg-ink bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(217,169,52,0.08),transparent)] flex flex-col items-center">
        {/* Navbar has its own row; the hero frame sits cleanly below it */}
        <header className="sticky top-0 z-40 w-full bg-ink/85 backdrop-blur-md border-b border-line/60">
          <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-1.5">
            <Navbar activeNav={activeNav} onNavClick={setActiveNav} onBookClick={book} />
          </div>
        </header>

        <main id="main" className="w-full">
          <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
            <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] max-h-[720px] rounded-2xl sm:rounded-3xl overflow-hidden border border-line shadow-2xl">
              <HeroFrame />
            </div>
          </div>

          <HeroCards onBookClick={book} onServicesClick={() => setModal('services')} onReviewsClick={() => setModal('reviews')} />
          <Sections onBookClick={book} />
        </main>

        <footer className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 mt-24 py-8 border-t border-line flex flex-wrap items-center justify-between gap-4 text-sm text-smoke">
          <span className="flex items-center gap-3">
            <AbsLogo small className="w-10 h-10 rounded-full ring-1 ring-gold/40" />
            © {new Date().getFullYear()} ABS Men&apos;s Salon
          </span>
          <span className="flex flex-wrap items-center gap-x-5">
            <span>{ADDRESS}</span>
            {CONTACTS.map((c) => (
              <a key={c.tel} href={c.tel} className="inline-flex items-center gap-2 min-h-11 text-gold hover:text-gold-light">
                <Phone className="w-4 h-4" aria-hidden="true" /> {c.display}
              </a>
            ))}
          </span>
        </footer>
      </div>

      <Modals active={modal} onClose={close} onBook={book} />
    </MotionConfig>
  )
}
