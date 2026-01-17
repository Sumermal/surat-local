import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SubmissionActions } from "@/components/admin/submission-actions"

export const metadata = {
  title: "Pending Submissions | Admin | Surat Local",
}

export default async function AdminSubmissionsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/submissions")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  // Fetch areas and categories for display
  const { data: areas } = await supabase.from("areas").select("*")
  const { data: categories } = await supabase.from("categories").select("*")

  const { data: submissions } = await supabase
    .from("user_submissions")
    .select("*, profile:profiles(full_name, email)")
    .order("created_at", { ascending: false })

  const getAreaName = (id: string) => areas?.find((a) => a.id === id)?.name || "Unknown"
  const getCategoryName = (id: string) => categories?.find((c) => c.id === id)?.name || "Unknown"

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Pending Submissions</h1>
            <p className="text-muted-foreground mt-1">Review and approve new business submissions</p>
          </div>

          {submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const data = submission.submission_data as Record<string, string>
                return (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {data.name || "Untitled"}
                          </CardTitle>
                          <CardDescription>
                            Submitted by {submission.profile?.full_name || submission.profile?.email || "Unknown"} on{" "}
                            {new Date(submission.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            submission.status === "pending"
                              ? "outline"
                              : submission.status === "approved"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Area:</span>{" "}
                          <span className="font-medium">{getAreaName(data.area_id)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>{" "}
                          <span className="font-medium">{getCategoryName(data.category_id)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Address:</span>{" "}
                          <span className="font-medium">{data.address}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>{" "}
                          <span className="font-medium">{data.phone || "N/A"}</span>
                        </div>
                      </div>
                      {data.description && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Description:</span>{" "}
                          <p className="mt-1">{data.description}</p>
                        </div>
                      )}

                      {submission.status === "pending" && (
                        <SubmissionActions submissionId={submission.id} submissionData={data} />
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold text-foreground">No pending submissions</h2>
                <p className="text-muted-foreground">All submissions have been reviewed.</p>
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
            className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-foreground"
          >
            Submissions
          </Link>
          <Link
            href="/admin/edits"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
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
