"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertIcon, ArrowLeftIcon, CheckIcon, SpinnerIcon } from "@/components/marketplace/icons"
import { getListingImageUrl } from "@/lib/marketplace"
import {
  fetchListing,
  formatPrice,
  formatRelativeTime,
  sendMessage,
  type Listing,
} from "@/lib/marketplace"
import { cn } from "@/lib/utils"

export default function ListingDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-fb-muted">Loading…</div>}>
      <ListingDetail />
    </Suspense>
  )
}

function ListingDetail() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [listing, setListing] = useState<Listing | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "notfound">(
    "loading",
  )
  const [error, setError] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [buyerEmail, setBuyerEmail] = useState("")
  const [buyerMessage, setBuyerMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState("")

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setStatus("loading")
    fetchListing(id)
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setStatus("notfound")
          return
        }
        setListing(data)
        setStatus("ready")
      })
      .catch((err) => {
        if (cancelled) return
        setStatus("error")
        setError(err instanceof Error ? err.message : "Could not load listing.")
      })
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSend(event: React.FormEvent) {
    event.preventDefault()
    if (!listing) return
    setSending(true)
    setSendError("")
    try {
      await sendMessage({
        listingId: listing.id,
        buyerEmail,
        message: buyerMessage,
      })
      setSent(true)
      setBuyerMessage("")
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Could not send message.")
    } finally {
      setSending(false)
    }
  }

  function closeDialog() {
    setDialogOpen(false)
    setSent(false)
    setSendError("")
  }

  const imageUrl = listing ? getListingImageUrl(listing.image_path) : null

  return (
    <main className="mx-auto w-full max-w-[1100px] px-3 py-4 sm:px-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-fb-blue hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </button>

      {status === "loading" ? (
        <div className="animate-pulse space-y-4">
          <div className="aspect-[4/3] w-full rounded-xl bg-fb-secondary" />
          <div className="h-6 w-2/3 rounded bg-fb-secondary" />
          <div className="h-4 w-1/3 rounded bg-fb-secondary" />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <AlertIcon className="mx-auto size-5 text-red-600" />
          <p className="mt-1.5 text-[14px] font-semibold text-red-700">
            Couldn&apos;t load this listing
          </p>
          <p className="mt-1 text-[13px] text-red-600">{error}</p>
        </div>
      ) : null}

      {status === "notfound" ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-fb-secondary text-3xl">
            🔍
          </div>
          <p className="text-[16px] font-semibold text-fb-ink">Listing not found</p>
          <p className="text-[13px] text-fb-muted">
            It may have been removed or the link is wrong.
          </p>
          <Link href="/" className="mt-2 rounded-full bg-fb-blue px-5 py-2 text-[14px] font-semibold text-white">
            Browse Marketplace
          </Link>
        </div>
      ) : null}

      {status === "ready" && listing ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Image */}
          <div className="overflow-hidden rounded-xl border border-fb-border bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full bg-fb-secondary">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={listing.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl text-fb-muted">
                  📷
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="rounded-xl border border-fb-border bg-white p-4 shadow-sm">
              <p className="text-[26px] font-bold text-fb-ink">
                {formatPrice(listing.price)}
              </p>
              <h1 className="mt-1 text-[20px] font-semibold text-fb-ink">
                {listing.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-fb-muted">
                <span className="rounded-full bg-fb-secondary px-2.5 py-0.5 font-medium text-fb-ink">
                  {listing.category}
                </span>
                {listing.location ? (
                  <>
                    <span>·</span>
                    <span>{listing.location}</span>
                  </>
                ) : null}
                <span>·</span>
                <span>Posted {formatRelativeTime(listing.created_at)}</span>
              </div>

              <Button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="mt-4 h-11 w-full rounded-full bg-fb-blue-dark text-[15px] font-semibold text-white hover:bg-[#1565c0]"
              >
                Message Seller
              </Button>
            </div>

            <div className="rounded-xl border border-fb-border bg-white p-4 shadow-sm">
              <h2 className="text-[15px] font-semibold text-fb-ink">Description</h2>
              <p className="mt-2 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-fb-ink">
                {listing.description}
              </p>
            </div>

            <div className="rounded-xl border border-fb-border bg-white p-4 shadow-sm">
              <h2 className="text-[15px] font-semibold text-fb-ink">Seller</h2>
              <p className="mt-2 text-[14px] text-fb-ink">{listing.email}</p>
              <p className="mt-1 text-[12px] text-fb-muted">
                Contact the seller directly by email, or use Message Seller above.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message the seller</DialogTitle>
            <DialogDescription>
              Your message is saved and shared with the seller. (Sending a real
              email is a bonus feature.)
            </DialogDescription>
          </DialogHeader>

          {sent ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <CheckIcon className="size-8 text-green-600" />
              <p className="text-[14px] font-semibold text-fb-ink">Message sent!</p>
              <p className="text-[13px] text-fb-muted">
                The seller will reach out to you by email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3">
              <div>
                <label htmlFor="buyer-email" className="mb-1.5 block text-[13px] font-semibold">
                  Your email
                </label>
                <Input
                  id="buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="buyer-message" className="mb-1.5 block text-[13px] font-semibold">
                  Message
                </label>
                <Textarea
                  id="buyer-message"
                  value={buyerMessage}
                  onChange={(event) => setBuyerMessage(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Hi, is this still available?"
                  required
                />
              </div>
              {sendError ? (
                <p className="text-[12px] text-red-600">{sendError}</p>
              ) : null}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={sending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sending}
                  className="bg-fb-blue text-white hover:bg-fb-blue-dark"
                >
                  {sending ? (
                    <>
                      <SpinnerIcon className="size-4" />
                      Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
