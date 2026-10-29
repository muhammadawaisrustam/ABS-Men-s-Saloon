import { createClient } from '@supabase/supabase-js'

// Public (publishable) values: safe to ship in the browser. Access is
// controlled by row-level security in the database. Env vars override them.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://nkxzuxzhgflduakiqdwp.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_cj1Zj8zNSqVvhWv61A8xfQ_dL81NGZ1'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const MEDIA_BUCKET = 'media'
