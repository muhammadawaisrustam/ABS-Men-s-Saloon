import { useId } from 'react'

interface AbsLogoProps {
  className?: string
  title?: string
}

// Vector redraw of the ABS Men's Salon emblem: gold line-art barber with
// sunglasses, scissors and razor, "ABS" in brush script inside a ring.
// Fonts (Kaushan Script, Montserrat) are loaded in index.html.
export function AbsLogo({ className, title = "ABS Men's Salon" }: AbsLogoProps) {
  const id = useId().replace(/:/g, '')
  const gold = `url(#gold-${id})`
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6d98a" />
          <stop offset="0.45" stopColor="#d9a934" />
          <stop offset="1" stopColor="#a5761b" />
        </linearGradient>
      </defs>
      {/* rings */}
      <circle cx="200" cy="200" r="194" fill="none" stroke={gold} strokeWidth="2.5"/>
      <path d="M 66 268 A 144 144 0 1 1 336 262" fill="none" stroke={gold} strokeWidth="6" strokeLinecap="round"/>

      {/* straight razor (behind) */}
      <g fill={gold} transform="rotate(18 330 165)">
      <rect x="322" y="150" width="16" height="96" rx="8"/>
      <path d="M 322 150 L 322 88 C 322 80 330 76 338 80 L 350 86 L 338 150 Z" opacity="0.9"/>
      </g>
      {/* scissors */}
      <g fill="none" stroke={gold} strokeWidth="5" strokeLinecap="round">
      <path d="M 312 84 L 292 186"/>
      <path d="M 286 86 L 306 186"/>
      <circle cx="288" cy="202" r="11"/>
      <circle cx="312" cy="200" r="11"/>
      </g>
      <circle cx="299" cy="140" r="3.5" fill="#111"/>

      <g transform="translate(-30 -24) scale(1.12)">
      {/* shoulders and collar */}
      <g fill="none" stroke={gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 96 286 C 116 258 150 244 190 236"/>
      <path d="M 252 230 C 276 238 292 248 302 262"/>
      <path d="M 192 214 L 190 236 L 204 250 L 214 232"/>
      <path d="M 238 222 L 240 230 L 248 246 L 252 230"/>
      </g>

      <g fill={gold}>
      {/* hair quiff */}
      <path d="M 166 146 C 150 116 154 84 178 68 C 198 54 230 54 250 64 C 268 76 270 92 262 102 C 256 110 250 114 246 116 C 232 108 210 108 196 114 C 186 120 182 132 180 146 Z"/>
      {/* beard (sideburn, jaw, chin, up to mouth, cheek line back) */}
      <path d="M 180 142 C 178 168 184 196 202 214 C 214 230 232 244 248 248 C 258 238 261 222 258 204 L 256 192 L 250 192 C 246 196 240 196 236 192 C 234 186 230 180 222 174 C 212 166 202 158 198 140 Z"/>
      {/* moustache */}
      <path d="M 232 180 C 240 172 254 172 262 177 C 266 177 270 173 270 167 C 275 173 273 182 265 184 C 257 186 249 184 243 184 C 237 186 231 186 226 182 C 222 178 222 172 226 169 C 226 175 228 178 232 180 Z"/>
      {/* sunglasses */}
      <path d="M 228 128 L 256 128 C 258 141 254 151 244 153 C 233 154 228 146 228 128 Z"/>
      <path d="M 196 128 L 222 128 C 223 144 218 153 208 153 C 198 152 195 143 196 128 Z"/>
      <rect x="220" y="127" width="10" height="4" rx="2"/>
      <rect x="170" y="128" width="28" height="4" rx="2"/>
      </g>

      <g fill="none" stroke={gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      {/* face profile: forehead, brow, nose, lip */}
      <path d="M 248 114 C 252 120 256 126 257 132"/>
      <path d="M 257 152 C 262 160 268 166 270 172 C 266 176 262 176 258 175"/>
      <path d="M 254 190 C 257 192 258 196 257 200"/>
      {/* ear */}
      <path d="M 176 140 C 164 134 158 148 162 162 C 165 172 170 176 178 174"/>
      </g>

      {/* dark detail lines: hair strands, lens shine, beard texture, mouth */}
      <g fill="none" stroke="#121212" strokeWidth="2.2" strokeLinecap="round">
      <path d="M 176 124 C 180 98 196 82 224 74"/>
      <path d="M 190 114 C 198 96 216 84 244 82"/>
      <path d="M 204 110 C 216 98 232 92 256 94"/>
      <path d="M 234 134 L 242 147"/>
      <path d="M 202 134 L 210 147"/>
      <path d="M 192 176 C 196 194 206 208 222 216"/>
      <path d="M 204 182 C 210 200 222 220 240 234"/>
      <path d="M 220 192 C 226 206 236 220 248 232"/>
      <path d="M 168 150 C 166 156 168 164 172 168"/>
      <path d="M 240 188 L 252 188"/>
      </g>
      </g>

      {/* wordmark */}
      <text x="200" y="326" textAnchor="middle" fontFamily="'Kaushan Script', 'Brush Script MT', cursive" fontSize="108" fill={gold} stroke="#0f0f0f" strokeWidth="6" paintOrder="stroke">ABS</text>
      <text x="200" y="362" textAnchor="middle" fontFamily="Montserrat, Arial, sans-serif" fontWeight="700" fontSize="23" letterSpacing="3" fill={gold}>MEN&apos;S SALON</text>
    </svg>
  )
}
