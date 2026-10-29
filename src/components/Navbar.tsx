import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, CalendarCheck } from 'lucide-react'
import { AbsLogo } from './AbsLogo'
import { NAV_ITEMS } from '../data'

interface NavbarProps {
  activeNav: string
  onNavClick: (id: string) => void
  onBookClick: () => void
}

export function Navbar({ activeNav, onNavClick, onBookClick }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Main" className="relative z-40 w-full px-1 sm:px-3 py-2">
      <div className="flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 group" onClick={() => onNavClick('')}>
          <AbsLogo small className="w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-105" title="ABS Men's Salon home" />
          <span className="leading-none">
            <span className="block font-brush text-2xl sm:text-[28px] text-gold-gradient">ABS</span>
            <span className="block text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-smoke">MEN&apos;S SALON</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => onNavClick(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative inline-flex items-center min-h-11 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-gold-light font-semibold' : 'text-smoke hover:text-cream'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gold"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <motion.button
          onClick={onBookClick}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:inline-flex items-center gap-2 min-h-11 px-6 rounded-full bg-gold-gradient text-ink text-sm font-bold shadow-[0_6px_20px_rgba(217,169,52,0.25)] hover:shadow-[0_10px_28px_rgba(217,169,52,0.4)] transition-shadow cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4" aria-hidden="true" />
          Book Now
        </motion.button>

        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-line bg-charcoal text-cream cursor-pointer"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            className="md:hidden absolute left-0 right-0 top-full mt-2 rounded-2xl border border-line bg-charcoal/95 backdrop-blur-xl p-4 shadow-2xl"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => { onNavClick(item.id); setOpen(false) }}
                    className="flex items-center min-h-12 px-4 rounded-xl text-cream hover:bg-graphite font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={() => { onBookClick(); setOpen(false) }}
              className="mt-3 w-full min-h-12 rounded-full bg-gold-gradient text-ink font-bold cursor-pointer"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
