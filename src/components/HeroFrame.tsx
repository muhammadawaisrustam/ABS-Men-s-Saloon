import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Pause, Play, Scissors, Clock } from 'lucide-react'
import { AbsLogo } from './AbsLogo'

// Drop your own footage at public/hero.mp4 and it plays here automatically.
// Until then, the frame shows the branded emblem version below.
const VIDEO_URL = '/hero.mp4'

export function HeroFrame() {
  const bgRef = useRef<HTMLVideoElement>(null)
  const fgRef = useRef<HTMLVideoElement>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [playing, setPlaying] = useState(true)

  // Keep the foreground (masked) copy in step with the background video,
  // so the person appears in front of the headline.
  useEffect(() => {
    if (!hasVideo) return
    let raf = 0
    const tick = () => {
      const bg = bgRef.current
      const fg = fgRef.current
      if (bg && fg && Math.abs(bg.currentTime - fg.currentTime) > 0.04) fg.currentTime = bg.currentTime
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [hasVideo])

  const togglePlay = () => {
    const vids = [bgRef.current, fgRef.current]
    if (playing) vids.forEach((v) => v?.pause())
    else vids.forEach((v) => v?.play().catch(() => {}))
    setPlaying(!playing)
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-ink">
      {/* Layer 1: background video, or the branded backdrop */}
      <video
        ref={bgRef}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        onLoadedData={() => setHasVideo(true)}
        onError={() => setHasVideo(false)}
        className={`absolute inset-0 w-full h-full object-cover ${hasVideo ? 'opacity-100' : 'opacity-0'}`}
      />
      {!hasVideo && (
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_35%,rgba(217,169,52,0.28),rgba(11,11,11,0)_70%)]" />
          <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(135deg,#d9a934_0_2px,transparent_2px_28px)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        </div>
      )}

      {/* Layer 2: oversized headline, sits behind the subject */}
      <div className="absolute inset-x-0 bottom-[9%] sm:bottom-[6%] z-10 flex justify-center px-4 pointer-events-none">
        <h1 className="font-display font-black uppercase leading-none tracking-[-0.035em] whitespace-nowrap text-[12vw] sm:text-[13vw] lg:text-[11vw] xl:text-[150px] text-gold-gradient drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
          <span className="sr-only">ABS Men&apos;s Salon: </span>Look Sharp
        </h1>
      </div>

      {/* Layer 3: the subject in front of the headline */}
      {hasVideo ? (
        <video
          ref={fgRef}
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 z-20 w-full h-full object-cover pointer-events-none"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 30% 80% at 50% 40%, black 50%, rgba(0,0,0,0.8) 65%, transparent 85%)',
            maskImage: 'radial-gradient(ellipse 30% 80% at 50% 40%, black 50%, rgba(0,0,0,0.8) 65%, transparent 85%)',
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-20 left-1/2 -translate-x-1/2 top-[7%] h-[50%] sm:h-[54%] aspect-[1046/1008] drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        >
          <AbsLogo className="w-full h-full" />
        </motion.div>
      )}

      {/* Corner chips */}
      <div className="absolute top-4 left-4 z-30 hidden sm:flex flex-col gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ink/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-cream">
          <Scissors className="w-3.5 h-3.5 text-gold" aria-hidden="true" /> Walk-ins welcome
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ink/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-cream">
          <Clock className="w-3.5 h-3.5 text-gold" aria-hidden="true" /> Open daily till 9 pm
        </span>
      </div>

      {hasVideo && (
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
