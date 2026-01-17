"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import type { Area } from "@/lib/types"

interface AreaCardProps {
  area: Area
}

export function AreaCard({ area }: AreaCardProps) {
  const { language, t } = useLanguage()
  const name = language === "hi" && area.name_hi ? area.name_hi : area.name
  const description = language === "hi" && area.description_hi ? area.description_hi : area.description

  return (
    <Link href={`/areas/${area.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {area.image_url ? (
            <Image
              src={area.image_url || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            {area.listing_count !== undefined && (
              <p className="text-sm text-white/80">
                {area.listing_count} {t("listings", translations.listings)}
              </p>
            )}
          </div>
        </div>
        {description && (
          <CardContent className="p-4">
            <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
