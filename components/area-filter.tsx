"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import type { Area } from "@/lib/types"

interface AreaFilterProps {
  areas: Area[]
  selectedArea?: string
  basePath: string
}

export function AreaFilter({ areas, selectedArea, basePath }: AreaFilterProps) {
  const { language } = useLanguage()

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !selectedArea
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All Areas
      </Link>
      {areas.map((area) => {
        const name = language === "hi" && area.name_hi ? area.name_hi : area.name
        const isSelected = selectedArea === area.slug

        return (
          <Link
            key={area.id}
            href={`${basePath}?area=${area.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {name}
          </Link>
        )
      })}
    </div>
  )
}
