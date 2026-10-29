interface AbsLogoProps {
  className?: string
  title?: string
  /** Use the small file for icons in the navbar and footer */
  small?: boolean
}

// The official ABS Men's Salon logo, used as supplied.
export function AbsLogo({ className, title = "ABS Men's Salon", small = false }: AbsLogoProps) {
  return (
    <img
      src={small ? '/abs-logo-small.webp' : '/abs-logo.webp'}
      alt={title}
      width={1046}
      height={1008}
      decoding="async"
      className={`object-contain ${className ?? ''}`}
    />
  )
}
