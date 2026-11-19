"use client"

import { GridIcon, ListIcon } from "@/components/marketplace/icons"
import { cn } from "@/lib/utils"

export function ViewToggle({
  view,
  onChange,
}: {
  view: "grid" | "list"
  onChange: (view: "grid" | "list") => void
}) {
  return (
    <div className="inline-flex rounded-full border border-fb-border bg-white p-0.5">
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={view === "grid"}
        aria-label="Grid view"
        className={cn(
          "flex size-8 items-center justify-center rounded-full transition-all duration-150 hover:scale-110 active:scale-90",
          view === "grid" ? "bg-fb-blue text-white" : "text-fb-muted hover:text-fb-ink",
        )}
      >
        <GridIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
        aria-label="List view"
        className={cn(
          "flex size-8 items-center justify-center rounded-full transition-all duration-150 hover:scale-110 active:scale-90",
          view === "list" ? "bg-fb-blue text-white" : "text-fb-muted hover:text-fb-ink",
        )}
      >
        <ListIcon className="size-4" />
      </button>
    </div>
  )
}
