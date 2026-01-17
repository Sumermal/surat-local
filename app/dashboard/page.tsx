import { redirect } from "next/navigation"
import Link from "next/link"
import { Heart, MessageSquare, Edit, Settings } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Dashboard | Surat Local",
  description: "Manage your Surat Local account, favorites, and reviews.",
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get stats
  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: reviewsCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: suggestionsCount } = await supabase
    .from("suggested_edits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const stats = [
    {
      label: "Favorites",
      value: favoritesCount ?? 0,
      icon: Heart,
      href: "/dashboard/favorites",
      color: "text-red-500",
    },
    {
      label: "Reviews",
      value: reviewsCount ?? 0,
      icon: MessageSquare,
      href: "/dashboard/reviews",
      color: "text-amber-500",
    },
    {
      label: "Suggestions",
      value: suggestionsCount ?? 0,
      icon: Edit,
      href: "/dashboard/suggestions",
      color: "text-primary",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {profile?.full_name || "Welcome back!"}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={`rounded-lg bg-secondary p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Recent Favorites
                </CardTitle>
                <CardDescription>Your saved businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentFavorites userId={user.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                  Recent Reviews
                </CardTitle>
                <CardDescription>Reviews you've written</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentReviews userId={user.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

async function RecentFavorites({ userId }: { userId: string }) {
  const supabase = await getSupabaseServerClient()

  const { data: favorites } = await supabase
    .from("favorites")
    .select("*, listing:listings(id, name, slug, area:areas(name))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">No favorites yet</p>
        <Button asChild>
          <Link href="/search">Browse Listings</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {favorites.map((fav) => (
        <Link
          key={fav.id}
          href={`/listings/${fav.listing?.slug}`}
          className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary transition-colors"
        >
          <div>
            <p className="font-medium text-foreground">{fav.listing?.name}</p>
            <p className="text-sm text-muted-foreground">{fav.listing?.area?.name}</p>
          </div>
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        </Link>
      ))}
      <Button variant="outline" className="w-full bg-transparent" asChild>
        <Link href="/dashboard/favorites">View All Favorites</Link>
      </Button>
    </div>
  )
}

async function RecentReviews({ userId }: { userId: string }) {
  const supabase = await getSupabaseServerClient()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, listing:listings(id, name, slug)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">No reviews yet</p>
        <Button asChild>
          <Link href="/search">Find a Business to Review</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/listings/${review.listing?.slug}`}
          className="block rounded-lg p-3 hover:bg-secondary transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">{review.listing?.name}</p>
            <div className="flex items-center gap-1 text-amber-500">
              {"★".repeat(review.rating)}
              <span className="text-muted">{"★".repeat(5 - review.rating)}</span>
            </div>
          </div>
          {review.comment && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{review.comment}</p>}
        </Link>
      ))}
      <Button variant="outline" className="w-full bg-transparent" asChild>
        <Link href="/dashboard/reviews">View All Reviews</Link>
      </Button>
    </div>
  )
}
