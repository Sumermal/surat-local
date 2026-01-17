"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types"

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: category?.name || "",
    name_hi: category?.name_hi || "",
    slug: category?.slug || "",
    description: category?.description || "",
    description_hi: category?.description_hi || "",
    icon: category?.icon || "",
    color: category?.color || "",
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = getSupabaseBrowserClient()

    try {
      if (category) {
        const { error } = await supabase.from("categories").update(formData).eq("id", category.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("categories").insert([formData])
        if (error) throw error
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save category"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
              <p>{error}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: category ? formData.slug : generateSlug(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_hi">Name (Hindi)</Label>
              <Input
                id="name_hi"
                value={formData.name_hi}
                onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Lucide icon name)</Label>
              <Input
                id="icon"
                placeholder="e.g., utensils, shopping-bag, heart"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="e.g., orange, blue, green"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Description (English)</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_hi">Description (Hindi)</Label>
              <Textarea
                id="description_hi"
                rows={3}
                value={formData.description_hi}
                onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Category
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
