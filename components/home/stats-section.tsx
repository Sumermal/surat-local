"use client"

import { Building2, MapPin, Tag, MessageSquare } from "lucide-react"

interface StatsSectionProps {
  stats: {
    listings: number
    areas: number
    categories: number
    reviews: number
  }
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    { label: "Business Listings", value: stats.listings, icon: Building2 },
    { label: "Areas Covered", value: stats.areas, icon: MapPin },
    { label: "Categories", value: stats.categories, icon: Tag },
    { label: "User Reviews", value: stats.reviews, icon: MessageSquare },
  ]

  return (
    <section className="border-y border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
