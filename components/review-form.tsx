"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  listingId: string
}

export function ReviewForm({ listingId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Please select a rating",
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
        toast({
          title: "Please sign in to leave a review",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("reviews").insert({
        listing_id: listingId,
        user_id: user.id,
        rating,
        comment: comment.trim() || null,
      })

      if (error) throw error

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      })

      setRating(0)
      setComment("")

      // Refresh the page to show the new review
      window.location.reload()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Write a Review</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating) ? "fill-amber-400 text-amber-400" : "text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
          Your Review (optional)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
