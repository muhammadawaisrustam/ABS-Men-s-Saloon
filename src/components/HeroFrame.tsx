import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Pause, Play, Scissors, Clock } from 'lucide-react'
import { AbsLogo } from './AbsLogo'
import { useContent } from '../lib/content'

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url)

export function HeroFrame() {
  const { settings } = useContent()
  const media = settings.heroMediaUrl
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const chipIcons = [Scissors, Clock]

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) v.pause()
    else v.play().catch(() => {})
    setPlaying(!playing)
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-ink">
      {/* Background: uploaded photo or video, or the branded backdrop */}
      {media && isVideo(media) && (
        <video ref={videoRef} src={media} autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {media && !isVideo(media) && (
        <img src={media} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div aria-hidden="true" className="absolute inset-0">
        {media ? (
          <div className="absolute inset-0 bg-ink/55" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_35%,rgba(217,169,52,0.28),rgba(11,11,11,0)_70%)]" />
            <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(135deg,#d9a934_0_2px,transparent_2px_28px)]" />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      </div>

      {/* Headline */}
      <div className="absolute inset-x-0 bottom-[9%] sm:bottom-[6%] z-10 flex justify-center px-4 pointer-events-none">
        <h1 className="font-display font-black uppercase leading-none tracking-[-0.035em] whitespace-nowrap text-[12vw] sm:text-[13vw] lg:text-[11vw] xl:text-[150px] text-gold-gradient drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
          <span className="sr-only">ABS Men&apos;s Salon: </span>{settings.heroHeadline}
        </h1>
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 left-1/2 -translate-x-1/2 top-[7%] h-[50%] sm:h-[54%] aspect-[1046/1008] drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
      >
        <AbsLogo className="w-full h-full" />
      </motion.div>

      {/* Corner chips */}
      {settings.heroChips.length > 0 && (
        <div className="absolute top-4 left-4 z-30 hidden sm:flex flex-col gap-2">
          {settings.heroChips.filter(Boolean).map((chip, i) => {
            const Icon = chipIcons[i % chipIcons.length]
            return (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ink/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-cream">
                <Icon className="w-3.5 h-3.5 text-gold" aria-hidden="true" /> {chip}
              </span>
            )
          })}
        </div>
      )}

      {media && isVideo(media) && (
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="absolute bottom-4 right-4 z-30 inline-flex items-center justify-center w-11 h-11 rounded-full bg-ink/80 hover:bg-ink text-cream border border-white/20 backdrop-blur-md cursor-pointer"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}
