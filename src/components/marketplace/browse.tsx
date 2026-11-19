"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { CategoryTabs } from "@/components/marketplace/category-tabs"
import { ListingCard } from "@/components/marketplace/listing-card"
import { ViewToggle } from "@/components/marketplace/view-toggle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/categories"
import { fetchListings, type Listing } from "@/lib/marketplace"
import { cn } from "@/lib/utils"

type SortOption = "newest" | "price-asc" | "price-desc"

export function Browse() {
  const [query, setQuery] = useState("")

  useEffect(() => {
    function sync() {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get("q") ?? "")
    }
    sync()
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [])

  const [category, setCategory] = useState("All")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sort, setSort] = useState<SortOption>("newest")
  const [listings, setListings] = useState<Listing[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    const stored = window.localStorage.getItem("marketplace.view")
    if (stored === "grid" || stored === "list") setView(stored)
    const storedSort = window.localStorage.getItem("marketplace.sort")
    if (storedSort === "newest" || storedSort === "price-asc" || storedSort === "price-desc") {
      setSort(storedSort)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("marketplace.view", view)
  }, [view])

  useEffect(() => {
    window.localStorage.setItem("marketplace.sort", sort)
  }, [sort])

  useEffect(() => {
    let cancelled = false
    setStatus("loading")
    setError("")
    fetchListings({ category, query })
      .then((data) => {
        if (cancelled) return
        setListings(data)
        setStatus("ready")
      })
      .catch((err) => {
        if (cancelled) return
        setStatus("error")
        setError(err instanceof Error ? err.message : "Could not load listings.")
      })
    return () => {
      cancelled = true
    }
  }, [category, query])

  const sorted = useMemo(() => {
    const copy = [...listings]
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price)
    else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price)
    else copy.sort((a, b) => b.created_at.localeCompare(a.created_at))
    return copy
  }, [listings, sort])

  const filteredCount = sorted.length

  return (
    <div className="mx-auto flex w-full max-w-[1280px] gap-6 px-3 py-4 sm:px-4">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-20 space-y-1">
          <h2 className="px-2 text-[13px] font-semibold uppercase tracking-wide text-fb-muted">
            Categories
          </h2>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const active = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={
                    "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[14px] font-medium transition-all duration-150 hover:translate-x-1 " +
                    (active
                      ? "bg-fb-accent text-fb-blue"
                      : "text-fb-ink hover:bg-fb-secondary")
                  }
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-fb-secondary text-fb-ink">
                    <FontAwesomeIcon icon={CATEGORY_ICONS[cat]} className="size-4" />
                  </span>
                  {cat}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-fb-ink">
              {query ? `Results for “${query}”` : "Today's picks"}
            </h1>
            <p className="text-[13px] text-fb-muted">
              {filteredCount > 0
                ? `${filteredCount} listing${filteredCount === 1 ? "" : "s"}`
                : "Browse what your community is selling"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-9 rounded-full border border-fb-border bg-white px-3 text-[13px] font-medium text-fb-ink outline-none focus:border-fb-blue focus:ring-2 focus:ring-fb-blue/20"
              aria-label="Sort listings"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <div className="mb-3 lg:hidden">
          <CategoryTabs value={category} onChange={setCategory} />
        </div>

        {status === "loading" ? <ListingSkeleton view={view} /> : null}

        {status === "error" ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-[14px] font-semibold text-red-700">Couldn't load listings</p>
            <p className="mt-1 text-[13px] text-red-600">{error}</p>
          </div>
        ) : null}

        {status === "ready" && sorted.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-fb-secondary text-3xl">
              🛒
            </div>
            <p className="text-[16px] font-semibold text-fb-ink">No listings yet</p>
            <p className="max-w-[40ch] text-[13px] text-fb-muted">
              {query
                ? "Try a different search or category."
                : "Be the first to sell something in your community."}
            </p>
            <Link
              href="/sell"
              className="mt-2 rounded-full bg-fb-blue-dark px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#1565c0]"
            >
              Create a listing
            </Link>
          </div>
        ) : null}

        {status === "ready" && sorted.length > 0 ? (
          <div
            className={cn(
              "gap-3",
              view === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-2",
            )}
          >
            {sorted.map((listing) => (
              <ListingCard key={listing.id} listing={listing} view={view} />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}

function ListingSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div
      className={cn(
        "gap-3",
        view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-2",
      )}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-fb-border bg-white"
        >
          <div className="aspect-square bg-fb-secondary" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-3/4 rounded bg-fb-secondary" />
            <div className="h-3 w-1/2 rounded bg-fb-secondary" />
          </div>
        </div>
      ))}
    </div>
  )
}
