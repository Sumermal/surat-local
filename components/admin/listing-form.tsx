"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Listing, ListingImage } from "@/lib/types"

interface ListingFormProps {
  areas: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  listing?: Listing
  existingImages?: ListingImage[]
}

export function ListingForm({ areas, categories, listing, existingImages = [] }: ListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<ListingImage[]>(existingImages)

  const [formData, setFormData] = useState({
    name: listing?.name || "",
    name_hi: listing?.name_hi || "",
    slug: listing?.slug || "",
    description: listing?.description || "",
    description_hi: listing?.description_hi || "",
    address: listing?.address || "",
    address_hi: listing?.address_hi || "",
    phone: listing?.phone || "",
    email: listing?.email || "",
    website: listing?.website || "",
    opening_hours: listing?.opening_hours || "",
    area_id: listing?.area_id || "",
    category_id: listing?.category_id || "",
    is_verified: listing?.is_verified || false,
    is_featured: listing?.is_featured || false,
    status: listing?.status || "active",
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: listing ? prev.slug : generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = getSupabaseBrowserClient()

    try {
      if (listing) {
        // Update existing listing
        const { error: updateError } = await supabase.from("listings").update(formData).eq("id", listing.id)

        if (updateError) throw updateError
      } else {
        // Create new listing
        const { data: newListing, error: insertError } = await supabase
          .from("listings")
          .insert([formData])
          .select()
          .single()

        if (insertError) throw insertError

        // If we have images uploaded, update them with the new listing ID
        if (images.length > 0 && newListing) {
          await supabase
            .from("listing_images")
            .update({ listing_id: newListing.id })
            .in(
              "id",
              images.map((img) => img.id),
            )
        }
      }

      router.push("/admin/listings")
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save listing"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!listing || !confirm("Are you sure you want to delete this listing?")) return

    setLoading(true)
    const supabase = getSupabaseBrowserClient()

    try {
      const { error } = await supabase.from("listings").delete().eq("id", listing.id)
      if (error) throw error

      router.push("/admin/listings")
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete listing"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name (English) *</Label>
              <Input id="name" value={formData.name} onChange={handleNameChange} required />
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
            <p className="text-xs text-muted-foreground">This will be used in the URL: /listings/{formData.slug}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area_id">Area *</Label>
              <Select value={formData.area_id} onValueChange={(value) => setFormData({ ...formData, area_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Description (English)</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_hi">Description (Hindi)</Label>
              <Textarea
                id="description_hi"
                rows={4}
                value={formData.description_hi}
                onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address (English) *</Label>
              <Textarea
                id="address"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_hi">Address (Hindi)</Label>
              <Textarea
                id="address_hi"
                rows={2}
                value={formData.address_hi}
                onChange={(e) => setFormData({ ...formData, address_hi: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="opening_hours">Opening Hours</Label>
            <Input
              id="opening_hours"
              placeholder="e.g., Mon-Sat 9AM-9PM, Sun Closed"
              value={formData.opening_hours}
              onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload listingId={listing?.id} images={images} onImagesChange={setImages} maxImages={10} />
        </CardContent>
      </Card>

      {/* Status & Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_verified">Verified</Label>
              <p className="text-sm text-muted-foreground">Mark as verified business</p>
            </div>
            <Switch
              id="is_verified"
              checked={formData.is_verified}
              onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_featured">Featured</Label>
              <p className="text-sm text-muted-foreground">Show in featured listings</p>
            </div>
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {listing && (
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Listing
          </Button>
        )}
        <div className="ml-auto flex gap-2">
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
                Save Listing
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
