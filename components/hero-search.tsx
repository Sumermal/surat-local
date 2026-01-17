"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("searchPlaceholder", translations.searchPlaceholder)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 pl-10 pr-4 text-base"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-6">
        {t("search", translations.search)}
      </Button>
    </form>
  )
}
