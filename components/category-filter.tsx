"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import type { Category } from "@/lib/types"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  basePath: string
}

export function CategoryFilter({ categories, selectedCategory, basePath }: CategoryFilterProps) {
  const { language } = useLanguage()

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !selectedCategory
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </Link>
      {categories.map((category) => {
        const name = language === "hi" && category.name_hi ? category.name_hi : category.name
        const isSelected = selectedCategory === category.slug

        return (
          <Link
            key={category.id}
            href={`${basePath}?category=${category.slug}`}
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
