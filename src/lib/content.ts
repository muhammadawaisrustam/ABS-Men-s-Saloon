import { useEffect, useState, createContext, useContext } from 'react'
import { supabase } from './supabase'

export interface Settings {
  brandName: string
  brandSubtitle: string
  heroHeadline: string
  heroChips: string[]
  heroMediaUrl: string
  logoUrl: string
  bookingPillText: string
  card1Title: string
  card1Highlight: string
  card2Title: string
  card2Highlight: string
  card2Text: string
  ratingValue: string
  clientsCount: string
  clientsLabel: string
  card3Text: string
  servicesTitle: string
  galleryTitle: string
  reviewsTitle: string
  visitTitle: string
  visitText: string
  address: string
  mapsUrl: string
  whatsappNumber: string
  whatsappMessage: string
}

export interface Row {
  id: string
  visible: boolean
  sort_order: number
}
export interface Service extends Row { name: string; price: string; duration: string; description: string }
export interface Contact extends Row { name: string; phone: string }
export interface Hours extends Row { label: string; hours: string }
export interface Review extends Row { name: string; text: string; rating: number }
export interface GalleryItem extends Row { image_url: string; storage_path: string | null; caption: string }

export interface SiteContent {
  settings: Settings
  services: Service[]
  contacts: Contact[]
  hours: Hours[]
  reviews: Review[]
  gallery: GalleryItem[]
}

export const DEFAULT_SETTINGS: Settings = {
  brandName: 'ABS',
  brandSubtitle: "MEN'S SALON",
  heroHeadline: 'Look Sharp',
  heroChips: ['Walk-ins welcome', 'Open daily till 9 pm'],
  heroMediaUrl: '',
  logoUrl: '',
  bookingPillText: 'Book Now · Cuts from Rs 800',
  card1Title: 'Precision Grooming For',
  card1Highlight: 'The Modern Man.',
  card2Title: 'Discover The',
  card2Highlight: 'ABS Experience',
  card2Text: 'Skilled barbers, hot towels and sharp finishes in a relaxed, premium space made for men.',
  ratingValue: '4.9',
  clientsCount: '500+',
  clientsLabel: 'Happy clients',
  card3Text: 'The barbers your city trusts for fades, beards and classic cuts.',
  servicesTitle: 'Our Services',
  galleryTitle: 'Fresh Cuts, Clean Fades',
  reviewsTitle: 'What Our Clients Say',
  visitTitle: 'Ready For A Fresh Look?',
  visitText: 'Book your chair on WhatsApp, give us a call, or just walk in.',
  address: 'Nayab Valley, Behind Rakshanda Masjid',
  mapsUrl: '',
  whatsappNumber: '923095654052',
  whatsappMessage: "Hi ABS Men's Salon, I'd like to book an appointment.",
}

const row = (i: number) => ({ id: `default-${i}`, visible: true, sort_order: i })

// Shown while loading, or if the database can't be reached.
export const DEFAULT_CONTENT: SiteContent = {
  settings: DEFAULT_SETTINGS,
  services: [
    { ...row(1), name: 'Haircut', price: 'Rs 800', duration: '30 min', description: 'Classic or modern cut, washed and styled.' },
    { ...row(2), name: 'Skin Fade', price: 'Rs 1,000', duration: '40 min', description: 'Sharp, seamless fade finished with a razor line-up.' },
    { ...row(3), name: 'Beard Trim & Shape', price: 'Rs 500', duration: '20 min', description: 'Clean lines, hot towel and beard oil.' },
    { ...row(4), name: 'Hot Towel Shave', price: 'Rs 600', duration: '30 min', description: 'Traditional straight-razor shave.' },
    { ...row(5), name: 'Hair Colour', price: 'Rs 1,500', duration: '60 min', description: 'Full colour or natural grey blending.' },
    { ...row(6), name: "Men's Facial", price: 'Rs 1,200', duration: '45 min', description: 'Deep cleanse to refresh tired skin.' },
  ],
  contacts: [
    { ...row(1), name: 'Malik Ansab Rustam', phone: '0309 5654052' },
    { ...row(2), name: 'Raja Mazir', phone: '0319 5754756' },
  ],
  hours: [
    { ...row(1), label: 'Monday – Friday', hours: '10:00 am – 9:00 pm' },
    { ...row(2), label: 'Saturday', hours: '10:00 am – 10:00 pm' },
    { ...row(3), label: 'Sunday', hours: '12:00 pm – 8:00 pm' },
  ],
  reviews: [
    { ...row(1), name: 'Customer name', rating: 5, text: 'Best fade I have had in years. Friendly barbers and a spotless shop.' },
    { ...row(2), name: 'Customer name', rating: 5, text: 'The hot towel shave is worth every rupee. I walk out feeling brand new.' },
    { ...row(3), name: 'Customer name', rating: 5, text: 'Easy to book on WhatsApp and they are always on time.' },
  ],
  gallery: [],
}

export const TABLES = {
  services: 'services',
  contacts: 'contacts',
  hours: 'opening_hours',
  reviews: 'reviews',
  gallery: 'gallery',
} as const

const CACHE_KEY = 'abs-content-v1'

export async function fetchContent(): Promise<SiteContent> {
  const order = { ascending: true }
  const [settings, services, contacts, hours, reviews, gallery] = await Promise.all([
    supabase.from('site_settings').select('data').eq('id', 'site').maybeSingle(),
    supabase.from(TABLES.services).select('*').order('sort_order', order),
    supabase.from(TABLES.contacts).select('*').order('sort_order', order),
    supabase.from(TABLES.hours).select('*').order('sort_order', order),
    supabase.from(TABLES.reviews).select('*').order('sort_order', order),
    supabase.from(TABLES.gallery).select('*').order('sort_order', order),
  ])
  const firstError = [settings, services, contacts, hours, reviews, gallery].find((r) => r.error)?.error
  if (firstError) throw firstError
  return {
    settings: { ...DEFAULT_SETTINGS, ...((settings.data?.data as Partial<Settings>) ?? {}) },
    services: (services.data ?? []) as Service[],
    contacts: (contacts.data ?? []) as Contact[],
    hours: (hours.data ?? []) as Hours[],
    reviews: (reviews.data ?? []) as Review[],
    gallery: (gallery.data ?? []) as GalleryItem[],
  }
}

function readCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as SiteContent) : null
  } catch {
    return null
  }
}

/** Loads site content: cached copy first (instant), then fresh from the database. */
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(() => readCache() ?? DEFAULT_CONTENT)
  useEffect(() => {
    let alive = true
    fetchContent()
      .then((c) => {
        if (!alive) return
        setContent(c)
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch { /* storage unavailable */ }
      })
      .catch((e) => console.warn('Using saved content; could not load from database:', e))
    return () => { alive = false }
  }, [])
  return content
}

export const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT)
export const useContent = () => useContext(ContentContext)

// ---- helpers ----
export const visible = <T extends Row>(rows: T[]) => rows.filter((r) => r.visible)

/** Turns a local number like "0309 5654052" into a tel: link with the +92 code. */
export function telLink(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return `tel:${digits}`
  if (digits.startsWith('0')) return `tel:+92${digits.slice(1)}`
  return `tel:+${digits}`
}

export function whatsappLink(s: Settings, text = s.whatsappMessage) {
  const number = s.whatsappNumber.replace(/\D/g, '').replace(/^0/, '92')
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function mapsLink(s: Settings) {
  return s.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`ABS Mens Salon ${s.address}`)}`
}

export const NAV_ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'visit', label: 'Visit' },
]

export type ModalKind = 'book' | 'services' | 'reviews' | null
