"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function DeleteAreaButton({ areaId, areaName }: { areaId: string; areaName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${areaName}"? This will also delete all listings in this area.`))
      return

    setLoading(true)
    const supabase = getSupabaseBrowserClient()

    try {
      const { error } = await supabase.from("areas").delete().eq("id", areaId)
      if (error) throw error
      router.refresh()
    } catch (err) {
      alert("Failed to delete area")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
    </Button>
  )
}
