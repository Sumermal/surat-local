import { redirect } from "next/navigation"
import Link from "next/link"
import { Edit } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditActions } from "@/components/admin/edit-actions"

export const metadata = {
  title: "Suggested Edits | Admin | Surat Local",
}

export default async function AdminEditsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/edits")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: edits } = await supabase
    .from("suggested_edits")
    .select("*, profile:profiles(full_name, email), listing:listings(id, name, slug)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Suggested Edits</h1>
            <p className="text-muted-foreground mt-1">Review and apply suggested changes to listings</p>
          </div>

          {edits && edits.length > 0 ? (
            <div className="space-y-4">
              {edits.map((edit) => {
                const changes = edit.suggested_changes as Record<string, string>
                return (
                  <Card key={edit.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Edit for:{" "}
                            <Link href={`/listings/${edit.listing?.slug}`} className="text-primary hover:underline">
                              {edit.listing?.name}
                            </Link>
                          </CardTitle>
                          <CardDescription>
                            Suggested by {edit.profile?.full_name || edit.profile?.email || "Unknown"} on{" "}
                            {new Date(edit.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            edit.status === "pending"
                              ? "outline"
                              : edit.status === "approved"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {edit.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 text-sm">
                        {Object.entries(changes).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                            <span className="col-span-2 font-medium">{value || "N/A"}</span>
                          </div>
                        ))}
                      </div>
                      {edit.reason && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Reason:</span> <p className="mt-1">{edit.reason}</p>
                        </div>
                      )}

                      {edit.status === "pending" && (
                        <EditActions editId={edit.id} listingId={edit.listing?.id || ""} suggestedChanges={changes} />
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Edit className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold text-foreground">No pending edits</h2>
                <p className="text-muted-foreground">All edit suggestions have been reviewed.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span className="text-lg font-bold">Admin Panel</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/admin/listings"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Listings
          </Link>
          <Link
            href="/admin/submissions"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Submissions
          </Link>
          <Link href="/admin/edits" className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-foreground">
            Edits
          </Link>
          <Link
            href="/"
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            View Site
          </Link>
        </nav>
      </div>
    </header>
  )
}
