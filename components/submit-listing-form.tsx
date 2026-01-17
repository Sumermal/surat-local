"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"
import type { Area, Category } from "@/lib/types"

interface UploadedImage {
  id?: string
  url: string
  caption?: string
  caption_hi?: string
  is_primary?: boolean
}

export function SubmitListingForm({ areas, categories }: { areas: Area[]; categories: Category[] }) {
  const [formData, setFormData] = useState({
    name: "",
    name_hi: "",
    description: "",
    description_hi: "",
    address: "",
    address_hi: "",
    phone: "",
    email: "",
    website: "",
    hours: "",
    area_id: "",
    category_id: "",
  })
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.area_id || !formData.category_id) {
      toast({
        title: "Please fill all required fields",
        description: "Area and category are required.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("user_submissions").insert({
        user_id: user.id,
        area_id: formData.area_id,
        category_id: formData.category_id,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        submission_data: {
          ...formData,
          images: images.map((img) => ({
            url: img.url,
            caption: img.caption,
            caption_hi: img.caption_hi,
            is_primary: img.is_primary,
          })),
        },
      })

      if (error) throw error

      toast({
        title: "Listing submitted!",
        description: "Your submission will be reviewed and added to our directory soon.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting listing:", error)
      toast({
        title: "Error submitting listing",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the main details of the business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_hi">Business Name (Hindi)</Label>
              <Input
                id="name_hi"
                value={formData.name_hi}
                onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
                placeholder="व्यापार का नाम"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">Area *</Label>
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
              <Label htmlFor="category">Category *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description (English)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the business..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_hi">Description (Hindi)</Label>
            <Textarea
              id="description_hi"
              value={formData.description_hi}
              onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
              placeholder="व्यापार का विवरण..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How can customers reach this business?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address (English) *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_hi">Address (Hindi)</Label>
            <Input
              id="address_hi"
              value={formData.address_hi}
              onChange={(e) => setFormData({ ...formData, address_hi: e.target.value })}
              placeholder="पता"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Business Hours</Label>
            <Textarea
              id="hours"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="Mon-Sat: 9am-9pm&#10;Sunday: Closed"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>Upload photos of the business (optional, up to 10 images)</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" className="bg-transparent" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Submitting..." : "Submit Listing"}
        </Button>
      </div>
    </form>
  )
}
