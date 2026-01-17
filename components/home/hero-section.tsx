"use client"

import { MapPin } from "lucide-react"
import { HeroSearch } from "@/components/hero-search"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 sm:py-28 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            <span>Surat, Gujarat</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            {t("heroTitle", translations.heroTitle)}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("heroSubtitle", translations.heroSubtitle)}
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl text-pretty">
            {t("heroDescription", translations.heroDescription)}
          </p>

          <div className="flex justify-center">
            <HeroSearch />
          </div>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>500+ Businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>50+ Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Trusted Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
