"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import type { Category } from "@/lib/types"
import {
  Utensils,
  ShoppingBag,
  Stethoscope,
  GraduationCap,
  Wrench,
  Building,
  Car,
  Sparkles,
  Dumbbell,
  PartyPopper,
  Landmark,
  MoreHorizontal,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  utensils: Utensils,
  "shopping-bag": ShoppingBag,
  stethoscope: Stethoscope,
  "graduation-cap": GraduationCap,
  wrench: Wrench,
  building: Building,
  car: Car,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  "party-popper": PartyPopper,
  landmark: Landmark,
}

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { language, t } = useLanguage()
  const name = language === "hi" && category.name_hi ? category.name_hi : category.name
  const Icon = iconMap[category.icon] || MoreHorizontal

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">{name}</h3>
            {category.listing_count !== undefined && (
              <p className="text-sm text-muted-foreground">
                {category.listing_count} {t("listings", translations.listings)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
