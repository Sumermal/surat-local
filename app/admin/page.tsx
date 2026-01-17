import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, Tag, Building2, Users, Edit, FileText, Star } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata = {
  title: "Admin Dashboard | Surat Local",
  description: "Manage Surat Local directory.",
}

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch stats
  const { count: totalListings } = await supabase.from("listings").select("*", { count: "exact", head: true })
  const { count: totalAreas } = await supabase.from("areas").select("*", { count: "exact", head: true })
  const { count: totalCategories } = await supabase.from("categories").select("*", { count: "exact", head: true })
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: totalReviews } = await supabase.from("reviews").select("*", { count: "exact", head: true })
  const { count: pendingSubmissions } = await supabase
    .from("user_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
  const { count: pendingEdits } = await supabase
    .from("suggested_edits")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const stats = [
    {
      label: "Total Listings",
      value: totalListings ?? 0,
      icon: Building2,
      href: "/admin/listings",
      color: "text-primary",
    },
    { label: "Areas", value: totalAreas ?? 0, icon: MapPin, href: "/admin/areas", color: "text-accent" },
    { label: "Categories", value: totalCategories ?? 0, icon: Tag, href: "/admin/categories", color: "text-chart-3" },
    { label: "Users", value: totalUsers ?? 0, icon: Users, href: "/admin/users", color: "text-chart-4" },
    { label: "Reviews", value: totalReviews ?? 0, icon: Star, href: "/admin/reviews", color: "text-amber-500" },
  ]

  const pendingStats = [
    {
      label: "Pending Submissions",
      value: pendingSubmissions ?? 0,
      icon: FileText,
      href: "/admin/submissions",
      description: "New listings to review",
    },
    {
      label: "Pending Edit Suggestions",
      value: pendingEdits ?? 0,
      icon: Edit,
      href: "/admin/edits",
      description: "Suggested changes to review",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your Surat Local directory</p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pending Actions */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Pending Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pendingStats.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card
                  className={`transition-all hover:shadow-md hover:-translate-y-0.5 ${stat.value > 0 ? "border-amber-500/50" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <stat.icon className="h-5 w-5" />
                        {stat.label}
                      </CardTitle>
                      {stat.value > 0 && (
                        <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-medium text-white">
                          {stat.value}
                        </span>
                      )}
                    </div>
                    <CardDescription>{stat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
