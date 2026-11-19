"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { CATEGORIES, CATEGORY_ICONS } from "@/lib/categories"
import { cn } from "@/lib/utils"

export function CategoryTabs({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((category) => {
        const active = value === category
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all duration-150 hover:scale-105 active:scale-95",
              active
                ? "border-fb-blue bg-fb-blue text-white"
                : "border-fb-border bg-white text-fb-ink hover:bg-fb-secondary",
            )}
          >
            <FontAwesomeIcon icon={CATEGORY_ICONS[category]} className="size-4" />
            {category}
          </button>
        )
      })}
    </div>
  )
}
