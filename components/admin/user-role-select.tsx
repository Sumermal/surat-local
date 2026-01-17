"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function UserRoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: string
  currentRole: string
  disabled?: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return

    setLoading(true)
    const supabase = getSupabaseBrowserClient()

    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error
      router.refresh()
    } catch (err) {
      alert("Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select value={currentRole} onValueChange={handleRoleChange} disabled={disabled || loading}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="business">Business</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}
