"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import type { Listing } from "@/lib/types"

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { language, t } = useLanguage()
  const name = language === "hi" && listing.name_hi ? listing.name_hi : listing.name
  const description = language === "hi" && listing.description_hi ? listing.description_hi : listing.description
  const address = language === "hi" && listing.address_hi ? listing.address_hi : listing.address
  const areaName = listing.area
    ? language === "hi" && listing.area.name_hi
      ? listing.area.name_hi
      : listing.area.name
    : ""

  return (
    <Link href={`/listings/${listing.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {listing.image_url ? (
            <Image
              src={listing.image_url || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {listing.is_featured && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
              {t("featured", translations.featured)}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {listing.is_verified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />}
          </div>
          {description && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{description}</p>}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{areaName}</span>
            </div>
            {listing.avg_rating !== undefined && listing.avg_rating > 0 && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{listing.avg_rating.toFixed(1)}</span>
                {listing.review_count !== undefined && (
                  <span className="text-muted-foreground">({listing.review_count})</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
