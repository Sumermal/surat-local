import { redirect, notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { ListingForm } from "@/components/admin/listing-form"

export const metadata = {
  title: "Edit Listing | Admin | Surat Local",
}

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/listings")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: listing } = await supabase.from("listings").select("*").eq("id", id).single()
  if (!listing) notFound()

  const { data: images } = await supabase
    .from("listing_images")
    .select("*")
    .eq("listing_id", id)
    .order("is_primary", { ascending: false })
    .order("display_order")

  const { data: areas } = await supabase.from("areas").select("id, name").order("name")
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader activeTab="/admin/listings" />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-foreground">Edit Listing</h1>
          <ListingForm
            areas={areas || []}
            categories={categories || []}
            listing={listing}
            existingImages={images || []}
          />
        </div>
      </main>
    </div>
  )
}
