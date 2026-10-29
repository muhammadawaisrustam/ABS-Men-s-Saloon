// ---- Business details: placeholders, replace with the real ones ----
export const BRAND = "ABS Men's Salon"
export const PHONE_DISPLAY = '+92 300 0000000'
export const PHONE_LINK = 'tel:+923000000000'
export const WHATSAPP_NUMBER = '923000000000'
export const ADDRESS = '123 Main Street, Your City'

export const whatsappLink = (text = "Hi ABS Men's Salon, I'd like to book an appointment.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export interface Service {
  name: string
  price: string
  time: string
  desc: string
}

export const SERVICES: Service[] = [
  { name: 'Haircut', price: 'Rs 800', time: '30 min', desc: 'Classic or modern cut, washed and styled.' },
  { name: 'Skin Fade', price: 'Rs 1,000', time: '40 min', desc: 'Sharp, seamless fade finished with a razor line-up.' },
  { name: 'Beard Trim & Shape', price: 'Rs 500', time: '20 min', desc: 'Clean lines, hot towel and beard oil.' },
  { name: 'Hot Towel Shave', price: 'Rs 600', time: '30 min', desc: 'Traditional straight-razor shave.' },
  { name: 'Hair Colour', price: 'Rs 1,500', time: '60 min', desc: 'Full colour or natural grey blending.' },
  { name: "Men's Facial", price: 'Rs 1,200', time: '45 min', desc: 'Deep cleanse to refresh tired skin.' },
]

export const HOURS: [string, string][] = [
  ['Monday – Friday', '10:00 am – 9:00 pm'],
  ['Saturday', '10:00 am – 10:00 pm'],
  ['Sunday', '12:00 pm – 8:00 pm'],
]

// Sample reviews: replace with real customer reviews before going live.
export const REVIEWS = [
  { name: 'Customer name', text: 'Best fade I have had in years. Friendly barbers and a spotless shop.' },
  { name: 'Customer name', text: 'The hot towel shave is worth every rupee. I walk out feeling brand new.' },
  { name: 'Customer name', text: 'Easy to book on WhatsApp and they are always on time.' },
]

export const NAV_ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'visit', label: 'Visit' },
]

export type ModalKind = 'book' | 'services' | 'reviews' | null
