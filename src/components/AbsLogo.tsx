import { useContent } from '../lib/content'

interface AbsLogoProps {
  className?: string
  title?: string
  /** Use the small file for icons in the navbar and footer */
  small?: boolean
}

// The official ABS Men's Salon logo. An uploaded logo from the admin panel replaces it.
export function AbsLogo({ className, title = "ABS Men's Salon", small = false }: AbsLogoProps) {
  const { settings } = useContent()
  const src = settings.logoUrl || (small ? '/abs-logo-small.webp' : '/abs-logo.webp')
  return (
    <img
      src={src}
      alt={title}
      width={1046}
      height={1008}
      decoding="async"
      className={`object-contain ${className ?? ''}`}
    />
  )
}
