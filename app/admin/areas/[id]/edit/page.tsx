import { redirect, notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AreaForm } from "@/components/admin/area-form"

export const metadata = {
  title: "Edit Area | Admin | Surat Local",
}

export default async function EditAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/areas")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: area } = await supabase.from("areas").select("*").eq("id", id).single()
  if (!area) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader activeTab="/admin/areas" />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-foreground">Edit Area</h1>
          <AreaForm area={area} />
        </div>
      </main>
    </div>
  )
}
