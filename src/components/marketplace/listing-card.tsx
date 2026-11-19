import Link from "next/link"

import { getListingImageUrl } from "@/lib/marketplace"
import { cn } from "@/lib/utils"

export function ListingCard({
  listing,
  view,
}: {
  listing: {
    id: string
    title: string
    price: number
    category: string
    location: string | null
    image_path: string | null
    created_at: string
  }
  view: "grid" | "list"
}) {
  const imageUrl = getListingImageUrl(listing.image_path)

  if (view === "list") {
    return (
      <Link
        href={`/listing/${listing.id}`}
        className="flex gap-3 rounded-xl border border-fb-border bg-white p-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-fb-secondary">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={listing.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-fb-muted">
              📷
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold text-fb-ink">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(listing.price)}
          </p>
          <p className="truncate text-[14px] text-fb-ink">{listing.title}</p>
          <p className="mt-1 text-[12px] text-fb-muted">{listing.category}</p>
          {listing.location ? <p className="text-[11px] text-fb-muted">{listing.location}</p> : null}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-fb-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-fb-secondary">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-fb-muted">
            📷
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[16px] font-bold text-fb-ink">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(listing.price)}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[13px] text-fb-ink">{listing.title}</p>
        <p className="mt-1 truncate text-[12px] text-fb-muted">{listing.category}</p>
{listing.location ? <p className="truncate text-[11px] text-fb-muted">{listing.location}</p> : null}
      </div>
    </Link>
  )
}
