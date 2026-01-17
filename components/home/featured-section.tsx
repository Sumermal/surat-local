"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listing-card"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import type { Listing } from "@/lib/types"

interface FeaturedSectionProps {
  listings: Listing[]
}

export function FeaturedSection({ listings }: FeaturedSectionProps) {
  const { t } = useLanguage()

  if (listings.length === 0) return null

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("featuredListings", translations.featuredListings)}
            </h2>
            <p className="mt-2 text-muted-foreground">Top-rated businesses hand-picked for you</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/search">
              {t("viewAll", translations.viewAll)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/search">
              {t("viewAll", translations.viewAll)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
