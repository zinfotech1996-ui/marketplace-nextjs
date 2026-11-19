import { getSupabaseClient } from "@/lib/supabase"

export const STORAGE_BUCKET = "listing-images"
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export type Listing = {
  id: string
  title: string
  description: string
  price: number
  email: string
  category: string
  location: string | null
  image_path: string | null
  created_at: string
}

export type ListingInput = {
  title: string
  description: string
  price: number
  email: string
  category: string
  location: string
  imageFile: File | null
}

export type BuyerMessage = {
  id: string
  listing_id: string
  buyer_email: string
  message: string
  created_at: string
}

export class MarketError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.name = "MarketError"
    this.code = code
  }
}

function requireClient() {
  const client = getSupabaseClient()
  if (!client) {
    throw new MarketError(
      "Supabase is not configured. Add your project URL and anon key to .env.local.",
    )
  }
  return client
}

function toMarketError(error: { message?: string; code?: string }): MarketError {
  const code = error.code
  const message = error.message ?? ""
  if (code === "42P01") {
    return new MarketError(
      "The listings table is missing. Run supabase/schema.sql in the Supabase SQL editor.",
      code,
    )
  }
  if (code === "42501" || message.includes("row-level security")) {
    return new MarketError(
      "The database refused that request. Check the row level security policies.",
      code,
    )
  }
  if (message.toLowerCase().includes("failed to fetch")) {
    return new MarketError(
      "Can't reach Supabase. Check your internet connection and project URL.",
      code,
    )
  }
  return new MarketError(message || "Something went wrong. Please try again.", code)
}

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPEG, PNG, WebP, or GIF image."
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller."
  }
  return null
}

export async function uploadListingImage(file: File): Promise<string> {
  const client = requireClient()
  const error = validateImage(file)
  if (error) throw new MarketError(error)

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false })

  if (uploadError) throw toMarketError(uploadError)
  return path
}

export function getListingImageUrl(path: string | null): string | null {
  if (!path) return null
  const client = getSupabaseClient()
  if (!client) return null
  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function fetchListings({
  category,
  query,
}: {
  category?: string
  query?: string
} = {}): Promise<Listing[]> {
  const client = requireClient()
  let request = client
    .from("listings")
    .select("id, title, description, price, email, category, location, image_path, created_at")
    .order("created_at", { ascending: false })

  if (category && category !== "All") {
    request = request.eq("category", category)
  }
  if (query?.trim()) {
    const term = query.trim()
    request = request.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
  }

  const { data, error } = await request
  if (error) throw toMarketError(error)
  return (data ?? []) as Listing[]
}

export async function fetchListing(id: string): Promise<Listing | null> {
  const client = requireClient()
  const { data, error } = await client
    .from("listings")
    .select("id, title, description, price, email, category, location, image_path, created_at")
    .eq("id", id)
    .maybeSingle()

  if (error) throw toMarketError(error)
  return (data as Listing | null) ?? null
}

export async function createListing(input: ListingInput): Promise<Listing> {
  const client = requireClient()
  const title = input.title.trim()
  const description = input.description.trim()
  const email = input.email.trim()

  if (title.length < 3) throw new MarketError("Title must be at least 3 characters.")
  if (description.length < 10) throw new MarketError("Description must be at least 10 characters.")
  if (!Number.isFinite(input.price) || input.price < 0) throw new MarketError("Price must be a valid number.")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new MarketError("Enter a valid email address.")

  let imagePath: string | null = null
  if (input.imageFile) {
    imagePath = await uploadListingImage(input.imageFile)
  }

  const { data, error } = await client
    .from("listings")
    .insert({
      title,
      description,
      price: input.price,
      email,
      category: input.category,
      location: input.location.trim() || null,
      image_path: imagePath,
    })
    .select("id, title, description, price, email, category, image_path, created_at")
    .single()

  if (error) throw toMarketError(error)
  return data as Listing
}

export async function sendMessage({
  listingId,
  buyerEmail,
  message,
}: {
  listingId: string
  buyerEmail: string
  message: string
}): Promise<void> {
  const client = requireClient()
  const trimmedEmail = buyerEmail.trim()
  const trimmedMessage = message.trim()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new MarketError("Enter a valid email address.")
  }
  if (trimmedMessage.length < 1) throw new MarketError("Write a message first.")

  const { error } = await client.from("messages").insert({
    listing_id: listingId,
    buyer_email: trimmedEmail,
    message: trimmedMessage,
  })

  if (error) throw toMarketError(error)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  if (Number.isNaN(diff)) return ""
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (diff < 60_000) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}
