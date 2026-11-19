"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertIcon, ImageIcon, SpinnerIcon } from "@/components/marketplace/icons"
import { CATEGORIES } from "@/lib/categories"
import {
  createListing,
  validateImage,
  type ListingInput,
} from "@/lib/marketplace"
import { cn } from "@/lib/utils"

export default function SellPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("Electronics")
  const [location, setLocation] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function handleFile(file: File | null) {
    setImageError("")
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }
    const validation = validateImage(file)
    if (validation) {
      setImageError(validation)
      return
    }
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const listing = await createListing({
        title,
        description,
        price: Number(price),
        email,
        category,
        location,
        imageFile,
      } satisfies ListingInput)
      router.push(`/listing/${listing.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create listing.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[720px] px-3 py-6 sm:px-4">
      <h1 className="text-[22px] font-bold text-fb-ink">Create a listing</h1>
      <p className="mt-1 text-[13px] text-fb-muted">
        Add a photo and the details. Your listing goes live right away.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-5">
        {/* Image */}
        <div>
          <label className="mb-1.5 block text-[14px] font-semibold">Photo</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-fb-border bg-white p-6 text-center transition hover:border-fb-blue hover:bg-fb-accent",
              imagePreview && "border-solid p-2",
            )}
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Listing preview"
                className="max-h-64 w-full rounded-lg object-contain"
              />
            ) : (
              <>
                <ImageIcon className="size-8 text-fb-muted" />
                <span className="text-[14px] font-medium text-fb-ink">
                  Add a photo
                </span>
                <span className="text-[12px] text-fb-muted">
                  JPEG, PNG, WebP or GIF · up to 5 MB
                </span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />
          {imageError ? (
            <p className="mt-1.5 text-[12px] text-red-600">{imageError}</p>
          ) : null}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1.5 block text-[14px] font-semibold">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={100}
            placeholder="What are you selling?"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-[14px] font-semibold">Category</label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="mb-1.5 block text-[14px] font-semibold">
            Location (optional)
          </label>
          <Input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            maxLength={80}
            placeholder="City, State"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="mb-1.5 block text-[14px] font-semibold">
            Price (USD)
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-[14px] font-semibold">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={5}
            placeholder="Describe the item, condition, and any details buyers should know."
            required
          />
          <p className="mt-1 text-[11px] text-fb-muted">
            {description.length}/2000
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[14px] font-semibold">
            Your email (for buyers to reach you)
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {error ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
            <AlertIcon className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 flex-1 rounded-full bg-fb-blue text-[15px] font-semibold text-white hover:bg-fb-blue-dark"
          >
            {submitting ? (
              <>
                <SpinnerIcon className="size-4" />
                Publishing…
              </>
            ) : (
              "Publish listing"
            )}
          </Button>
        </div>
      </form>
    </main>
  )
}
