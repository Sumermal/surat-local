"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface EditActionsProps {
  editId: string
  listingId: string
  suggestedChanges: Record<string, string>
}

export function EditActions({ editId, listingId, suggestedChanges }: EditActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()

      // Apply changes to listing
      const { error: listingError } = await supabase.from("listings").update(suggestedChanges).eq("id", listingId)

      if (listingError) throw listingError

      // Update edit status
      const { error: updateError } = await supabase
        .from("suggested_edits")
        .update({ status: "approved" })
        .eq("id", editId)

      if (updateError) throw updateError

      toast({ title: "Edit approved", description: "The listing has been updated." })
      router.refresh()
    } catch (error) {
      console.error("Error approving edit:", error)
      toast({ title: "Error approving edit", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("suggested_edits").update({ status: "rejected" }).eq("id", editId)

      if (error) throw error

      toast({ title: "Edit rejected" })
      router.refresh()
    } catch (error) {
      console.error("Error rejecting edit:", error)
      toast({ title: "Error rejecting edit", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2 pt-4 border-t border-border">
      <Button onClick={handleApprove} disabled={isLoading} className="gap-2">
        <Check className="h-4 w-4" />
        Approve & Apply
      </Button>
      <Button variant="outline" onClick={handleReject} disabled={isLoading} className="gap-2 bg-transparent">
        <X className="h-4 w-4" />
        Reject
      </Button>
    </div>
  )
}
