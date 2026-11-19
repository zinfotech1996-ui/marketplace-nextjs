"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { SearchIcon } from "@/components/marketplace/icons"
import { cn } from "@/lib/utils"

export function TopBar() {
  const [value, setValue] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setValue(params.get("q") ?? "")
  }, [])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const params = new URLSearchParams(window.location.search)
    if (value.trim()) params.set("q", value.trim())
    else params.delete("q")
    window.location.href = `/?${params.toString()}`
  }

  return (
    <header className="sticky top-0 z-40 border-b border-fb-border bg-white shadow-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-fb-blue/40"
          aria-label="Marketplace home"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-fb-blue text-lg font-bold text-white">
            M
          </span>
          <span className="hidden text-[20px] font-bold tracking-tight text-fb-blue sm:inline">
            Marketplace
          </span>
        </Link>

        <form onSubmit={submit} className="relative min-w-0 flex-1">
          <label htmlFor="market-search" className="sr-only">
            Search listings
          </label>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fb-muted" />
          <input
            id="market-search"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search Marketplace"
            autoComplete="off"
            className="h-10 w-full rounded-full border border-fb-border bg-fb-bg pl-10 pr-4 text-[15px] text-fb-ink outline-none placeholder:text-fb-muted focus:border-fb-blue focus:bg-white focus:ring-2 focus:ring-fb-blue/20 [&::-webkit-search-cancel-button]:hidden"
          />
        </form>

        <Link
          href="/sell"
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-fb-blue px-4 text-[14px] font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-fb-blue-dark hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue/40"
        >
          <span aria-hidden="true" className="text-base leading-none">
            +
          </span>
          <span className="hidden sm:inline">Sell</span>
        </Link>
      </div>
    </header>
  )
}
