"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Listing } from "@/lib/types"

interface SuggestEditFormProps {
  listing: Listing
}

export function SuggestEditForm({ listing }: SuggestEditFormProps) {
  const [formData, setFormData] = useState({
    name: listing.name,
    address: listing.address,
    phone: listing.phone || "",
    email: listing.email || "",
    website: listing.website || "",
    hours: listing.hours || "",
    description: listing.description || "",
  })
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      const { error } = await supabase.from("suggested_edits").insert({
        listing_id: listing.id,
        user_id: user.id,
        suggested_changes: formData,
        reason: reason.trim() || null,
      })

      if (error) throw error

      toast({
        title: "Edit suggestion submitted!",
        description: "Thank you for helping improve our listings.",
      })

      router.push(`/listings/${listing.slug}`)
    } catch (error) {
      console.error("Error submitting edit:", error)
      toast({
        title: "Error submitting suggestion",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Business Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://"
          />
        </div>

        <div>
          <Label htmlFor="hours">Business Hours</Label>
          <Textarea
            id="hours"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            placeholder="Mon-Sat: 9am-9pm&#10;Sunday: Closed"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="reason">Reason for Changes (optional)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you suggesting these changes?"
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Suggestion"}
        </Button>
      </div>
    </form>
  )
}
