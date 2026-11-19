import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const key = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)?.trim()

let client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return Boolean(url && key)
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!url || !key) return null
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 10 } },
  })
  return client
}
