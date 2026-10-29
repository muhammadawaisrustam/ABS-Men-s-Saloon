import { supabase, MEDIA_BUCKET } from '../lib/supabase'

/** Uploads a file to the public media bucket and returns its URL and storage path. */
export async function uploadMedia(file: File, folder: string) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

/** Storage path from a public media URL, if it is one of ours. */
export function pathFromUrl(url: string) {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`
  const i = url.indexOf(marker)
  return i >= 0 ? decodeURIComponent(url.slice(i + marker.length)) : null
}

export async function removeMedia(path: string | null | undefined) {
  if (!path) return
  await supabase.storage.from(MEDIA_BUCKET).remove([path])
}
