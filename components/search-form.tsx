"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Area, Category } from "@/lib/types"

interface SearchFormProps {
  areas: Area[]
  categories: Category[]
  initialQuery?: string
  initialArea?: string
  initialCategory?: string
}

export function SearchForm({ areas, categories, initialQuery, initialArea, initialCategory }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery || "")
  const [selectedArea, setSelectedArea] = useState(initialArea || "all")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (selectedArea && selectedArea !== "all") params.set("area", selectedArea)
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search businesses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 pl-10 pr-4 text-base"
        />
      </div>

      <Select value={selectedArea} onValueChange={setSelectedArea}>
        <SelectTrigger className="h-12 w-full sm:w-[180px]">
          <SelectValue placeholder="All Areas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Areas</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area.id} value={area.slug}>
              {area.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="h-12 w-full sm:w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size="lg" className="h-12 px-8">
        Search
      </Button>
    </form>
  )
}
