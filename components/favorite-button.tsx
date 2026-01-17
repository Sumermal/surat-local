"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  listingId: string
  isFavorited: boolean
  isLoggedIn: boolean
}

export function FavoriteButton({ listingId, isFavorited: initialFavorited, isLoggedIn }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId)

        if (error) throw error

        setIsFavorited(false)
        toast({ title: "Removed from favorites" })
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          listing_id: listingId,
        })

        if (error) throw error

        setIsFavorited(true)
        toast({ title: "Added to favorites" })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className={`h-10 w-10 ${isFavorited ? "bg-red-100 hover:bg-red-200 text-red-600" : "bg-background/90 hover:bg-background"}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
    </Button>
  )
}
