"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SubmissionActionsProps {
  submissionId: string
  submissionData: Record<string, string>
}

export function SubmissionActions({ submissionId, submissionData }: SubmissionActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()

      // Generate slug from name
      const slug = submissionData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      // Create the listing
      const { error: listingError } = await supabase.from("listings").insert({
        name: submissionData.name,
        name_hi: submissionData.name_hi || null,
        slug: `${slug}-${Date.now()}`,
        description: submissionData.description || null,
        description_hi: submissionData.description_hi || null,
        address: submissionData.address,
        address_hi: submissionData.address_hi || null,
        phone: submissionData.phone || null,
        email: submissionData.email || null,
        website: submissionData.website || null,
        hours: submissionData.hours || null,
        area_id: submissionData.area_id,
        category_id: submissionData.category_id,
      })

      if (listingError) throw listingError

      // Update submission status
      const { error: updateError } = await supabase
        .from("user_submissions")
        .update({ status: "approved" })
        .eq("id", submissionId)

      if (updateError) throw updateError

      toast({ title: "Submission approved", description: "The listing has been created." })
      router.refresh()
    } catch (error) {
      console.error("Error approving submission:", error)
      toast({ title: "Error approving submission", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("user_submissions").update({ status: "rejected" }).eq("id", submissionId)

      if (error) throw error

      toast({ title: "Submission rejected" })
      router.refresh()
    } catch (error) {
      console.error("Error rejecting submission:", error)
      toast({ title: "Error rejecting submission", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2 pt-4 border-t border-border">
      <Button onClick={handleApprove} disabled={isLoading} className="gap-2">
        <Check className="h-4 w-4" />
        Approve & Create Listing
      </Button>
      <Button variant="outline" onClick={handleReject} disabled={isLoading} className="gap-2 bg-transparent">
        <X className="h-4 w-4" />
        Reject
      </Button>
    </div>
  )
}
