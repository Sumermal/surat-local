"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Review } from "@/lib/types"

interface ReviewsListProps {
  reviews: Review[]
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-6 last:border-0">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={review.profile?.avatar_url || undefined} />
              <AvatarFallback>{review.profile?.full_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-foreground">{review.profile?.full_name || "Anonymous"}</p>
                <time className="text-sm text-muted-foreground shrink-0">
                  {new Date(review.created_at).toLocaleDateString()}
                </time>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                  />
                ))}
              </div>
              {review.comment && <p className="mt-3 text-muted-foreground">{review.comment}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
