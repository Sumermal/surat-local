"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/category-card"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import type { Category } from "@/lib/types"

interface CategoriesSectionProps {
  categories: Category[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("browseByCategory", translations.browseByCategory)}
            </h2>
            <p className="mt-2 text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/categories">
              {t("viewAll", translations.viewAll)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/categories">
              {t("viewAll", translations.viewAll)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
