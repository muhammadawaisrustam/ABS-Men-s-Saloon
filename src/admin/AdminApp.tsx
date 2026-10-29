import { useEffect, useState, type ComponentType } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Home, Palette, LayoutGrid, MapPin, Clock, Scissors, Images, MessageSquareQuote, Users, LogOut, ExternalLink, Menu, X, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { TABLES, type Service, type Contact, type Hours, type Review, type GalleryItem } from '../lib/content'
import { AbsLogo } from '../components/AbsLogo'
import { AuthScreen } from './Auth'
import { SettingsEditor } from './SettingsEditor'
import { ListEditor } from './ListEditor'
import { AdminsEditor } from './AdminsEditor'
import { Button, Card, ToastProvider, errorText, useToast } from './ui'
import { uploadMedia, removeMedia } from './upload'

type TabId = 'brand' | 'home' | 'contact' | 'hours' | 'services' | 'gallery' | 'reviews' | 'admins'
const TABS: { id: TabId; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'brand', label: 'Logo & hero', icon: Palette },
  { id: 'home', label: 'Homepage text', icon: LayoutGrid },
  { id: 'services', label: 'Services & prices', icon: Scissors },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'reviews', label: 'Reviews', icon: MessageSquareQuote },
  { id: 'contact', label: 'Contact & location', icon: MapPin },
  { id: 'hours', label: 'Opening hours', icon: Clock },
  { id: 'admins', label: 'Admins', icon: Users },
]

function GalleryUpload({ reload, nextOrder }: { reload: () => Promise<void>; nextOrder: number }) {
  const toast = useToast()
  const [progress, setProgress] = useState<string | null>(null)
  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    const list = Array.from(files)
    try {
      for (const [i, file] of list.entries()) {
        setProgress(`Uploading ${i + 1} of ${list.length}…`)
        const { url, path } = await uploadMedia(file, 'gallery')
        const { error } = await supabase.from(TABLES.gallery).insert({ image_url: url, storage_path: path, caption: '', sort_order: nextOrder + i })
        if (error) throw error
      }
      toast('ok', `${list.length} photo${list.length > 1 ? 's' : ''} added to the gallery.`)
    } catch (e) {
      toast('error', errorText(e))
    } finally {
      setProgress(null)
      await reload()
    }
  }
  return (
    <Card className="mb-5 border-dashed">
      <label className={`flex flex-col items-center justify-center gap-2 py-6 text-center cursor-pointer ${progress ? 'pointer-events-none opacity-60' : ''}`}>
        <Upload className="w-8 h-8 text-gold" aria-hidden="true" />
        <span className="font-semibold text-cream">{progress ?? 'Upload photos'}</span>
        <span className="text-sm text-smoke">Pick one or more photos (JPG, PNG or WebP). Portrait photos look best.</span>
        <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => upload(e.target.files)} />
      </label>
    </Card>
  )
}

function Dashboard({ session }: { session: Session }) {
  const fromHash = () => {
    const h = window.location.hash.slice(1) as TabId
    return TABS.some((t) => t.id === h) ? h : 'brand'
  }
  const [tab, setTab] = useState<TabId>(fromHash)
  const [navOpen, setNavOpen] = useState(false)
  useEffect(() => { if (window.location.hash.slice(1) !== tab) window.history.replaceState(null, '', `#${tab}`) }, [tab])
  useEffect(() => {
    const onHash = () => setTab(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const email = session.user.email ?? ''

  const content = (() => {
    switch (tab) {
      case 'brand':
        return (
          <SettingsEditor
            title="Logo & hero"
            description="The logo, name and big headline at the top of the website."
            groups={[
              { title: 'Logo', fields: [
                { key: 'logoUrl', label: 'Logo image', type: 'media', accept: 'image/png,image/webp,image/jpeg', hint: 'Leave empty to use the built-in ABS logo. A PNG with a transparent background works best.' },
                { key: 'brandName', label: 'Name next to the logo', type: 'text' },
                { key: 'brandSubtitle', label: 'Small text under the name', type: 'text' },
              ] },
              { title: 'Hero', fields: [
                { key: 'heroHeadline', label: 'Big headline', type: 'text', hint: 'Keep it short (2 words) so it fits on phones.' },
                { key: 'heroMediaUrl', label: 'Background photo or video', type: 'media', accept: 'image/*,video/mp4,video/webm', hint: 'Optional. A dark overlay is added so the logo and headline stay readable. Videos should be under 50 MB.' },
                { key: 'heroChips', label: 'Small labels in the top-left corner', type: 'list' },
              ] },
            ]}
          />
        )
      case 'home':
        return (
          <SettingsEditor
            title="Homepage text"
            description="The booking button, the three cards under the hero, and section headings."
            groups={[
              { title: 'Booking button', fields: [{ key: 'bookingPillText', label: 'Button text', type: 'text' }] },
              { title: 'Left card', fields: [
                { key: 'card1Title', label: 'Text', type: 'text' },
                { key: 'card1Highlight', label: 'Gold highlighted text', type: 'text' },
              ] },
              { title: 'Middle card', fields: [
                { key: 'card2Title', label: 'Heading', type: 'text' },
                { key: 'card2Highlight', label: 'Gold script text', type: 'text' },
                { key: 'card2Text', label: 'Description', type: 'textarea' },
              ] },
              { title: 'Right card', fields: [
                { key: 'ratingValue', label: 'Rating', type: 'text', placeholder: '4.9' },
                { key: 'clientsCount', label: 'Number', type: 'text', placeholder: '500+' },
                { key: 'clientsLabel', label: 'Label after the number', type: 'text' },
                { key: 'card3Text', label: 'Description', type: 'textarea' },
              ] },
              { title: 'Section headings', fields: [
                { key: 'servicesTitle', label: 'Services heading', type: 'text' },
                { key: 'galleryTitle', label: 'Gallery heading', type: 'text' },
                { key: 'reviewsTitle', label: 'Reviews heading', type: 'text' },
                { key: 'visitTitle', label: 'Visit heading', type: 'text' },
                { key: 'visitText', label: 'Visit text', type: 'textarea' },
              ] },
            ]}
          />
        )
      case 'contact':
        return (
          <div className="space-y-12">
            <SettingsEditor
              title="Contact & location"
              description="Address, map and WhatsApp booking."
              groups={[
                { title: 'Location', fields: [
                  { key: 'address', label: 'Address', type: 'text' },
                  { key: 'mapsUrl', label: 'Google Maps link (optional)', type: 'text', hint: 'Paste the share link from Google Maps. If empty, the site searches the address.' },
                ] },
                { title: 'WhatsApp booking', fields: [
                  { key: 'whatsappNumber', label: 'WhatsApp number', type: 'text', hint: 'Bookings are sent here. Format: 03095654052 or 923095654052.' },
                  { key: 'whatsappMessage', label: 'Default message', type: 'textarea' },
                ] },
              ]}
            />
            <ListEditor<Contact>
              table={TABLES.contacts}
              title="Phone numbers"
              description="Shown in the visit section and footer. Tapping a number on a phone starts a call."
              itemName="phone number"
              newItem={{ name: '', phone: '' }}
              fields={[
                { key: 'phone', label: 'Phone number', type: 'text', placeholder: '0300 0000000', required: true },
                { key: 'name', label: 'Name (optional)', type: 'text' },
              ]}
            />
          </div>
        )
      case 'hours':
        return (
          <ListEditor<Hours>
            table={TABLES.hours}
            title="Opening hours"
            description="Each row is one line in the opening hours box."
            itemName="row"
            newItem={{ label: 'New day', hours: '10:00 am – 9:00 pm' }}
            fields={[
              { key: 'label', label: 'Day(s)', type: 'text', placeholder: 'Monday – Friday', required: true },
              { key: 'hours', label: 'Hours', type: 'text', placeholder: '10:00 am – 9:00 pm', required: true },
            ]}
          />
        )
      case 'services':
        return (
          <ListEditor<Service>
            table={TABLES.services}
            title="Services & prices"
            description="Your price list. These also appear in the booking form."
            itemName="service"
            newItem={{ name: 'New service', price: 'Rs ', duration: '', description: '' }}
            fields={[
              { key: 'name', label: 'Service name', type: 'text', required: true },
              { key: 'price', label: 'Price', type: 'text', placeholder: 'Rs 800' },
              { key: 'duration', label: 'Time', type: 'text', placeholder: '30 min' },
              { key: 'description', label: 'Short description', type: 'textarea' },
            ]}
          />
        )
      case 'reviews':
        return (
          <ListEditor<Review>
            table={TABLES.reviews}
            title="Reviews"
            description="Customer reviews shown on the homepage."
            itemName="review"
            newItem={{ name: '', text: 'New review', rating: 5 }}
            fields={[
              { key: 'text', label: 'Review', type: 'textarea', required: true },
              { key: 'name', label: 'Customer name', type: 'text' },
              { key: 'rating', label: 'Stars', type: 'rating' },
            ]}
          />
        )
      case 'gallery':
        return (
          <ListEditor<GalleryItem>
            table={TABLES.gallery}
            title="Gallery"
            description="Photos of your work. Upload, add captions, reorder, hide or delete."
            itemName="photo"
            hideAdd
            newItem={{ image_url: '', storage_path: null, caption: '' }}
            fields={[{ key: 'caption', label: 'Caption (optional)', type: 'text', wide: true }]}
            toolbar={(reload, nextOrder) => <GalleryUpload reload={reload} nextOrder={nextOrder} />}
            preview={(g) => <img src={g.image_url} alt="" className="w-32 h-40 rounded-xl object-cover border border-line" />}
            onDelete={(g) => removeMedia(g.storage_path)}
          />
        )
      case 'admins':
        return <AdminsEditor myEmail={email} />
    }
  })()

  return (
    <div className="min-h-screen bg-ink text-cream lg:flex">
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-line bg-ink/95 backdrop-blur">
        <span className="flex items-center gap-2 font-semibold"><AbsLogo small className="w-9 h-9" /> Admin</span>
        <Button variant="ghost" aria-label={navOpen ? 'Close menu' : 'Open menu'} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>
          {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>
      <aside className={`${navOpen ? 'block' : 'hidden'} lg:block lg:w-72 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 border-r border-line bg-charcoal`}>
        <div className="hidden lg:flex items-center gap-3 px-5 h-20 border-b border-line">
          <AbsLogo small className="w-11 h-11" />
          <div>
            <p className="font-bold">ABS Admin</p>
            <p className="text-xs text-smoke truncate max-w-[180px]">{email}</p>
          </div>
        </div>
        <nav aria-label="Admin sections" className="p-3">
          <ul className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => { setTab(id); setNavOpen(false); window.scrollTo(0, 0) }}
                  aria-current={tab === id ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 min-h-11 px-3 rounded-xl text-sm font-medium cursor-pointer ${tab === id ? 'bg-gold/15 text-gold-light' : 'text-smoke hover:text-cream hover:bg-graphite'}`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-line space-y-1">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 min-h-11 px-3 rounded-xl text-sm text-smoke hover:text-cream hover:bg-graphite">
              <Home className="w-4 h-4" /> View website <ExternalLink className="w-3.5 h-3.5 ml-auto" />
            </a>
            <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 min-h-11 px-3 rounded-xl text-sm text-smoke hover:text-cream hover:bg-graphite cursor-pointer">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </nav>
      </aside>
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-5xl">{content}</main>
    </div>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      setSession(s)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setIsAdmin(null); return }
    supabase.rpc('is_admin').then(({ data, error }) => setIsAdmin(!error && data === true))
  }, [session])

  let body
  if (session === undefined) body = <div className="min-h-screen bg-ink" />
  else if (recovery) body = <AuthScreen initialMode="reset" onDone={() => setRecovery(false)} />
  else if (!session) body = <AuthScreen />
  else if (isAdmin === null) body = <div className="min-h-screen bg-ink flex items-center justify-center text-smoke">Checking access…</div>
  else if (!isAdmin)
    body = (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <AbsLogo className="w-20 h-20 mx-auto" />
          <h1 className="mt-4 text-xl font-bold text-cream">No admin access yet</h1>
          <p className="mt-2 text-sm text-smoke">
            You&apos;re signed in as <span className="text-cream">{session.user.email}</span>, but this email isn&apos;t on the admin list. Ask an existing admin to add it under <b>Admins</b>.
          </p>
          <Button className="mt-5" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </Card>
      </div>
    )
  else body = <Dashboard session={session} />

  return <ToastProvider>{body}</ToastProvider>
}
