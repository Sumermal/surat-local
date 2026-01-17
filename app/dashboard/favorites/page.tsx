import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Heart } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListingCard } from "@/components/listing-card"

export const metadata = {
  title: "My Favorites | Surat Local",
  description: "View all your saved favorite businesses.",
}

export default async function FavoritesPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/favorites")
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("*, listing:listings(*, area:areas(*), category:categories(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const listings = favorites?.map((f) => f.listing).filter(Boolean) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Favorites</span>
            </nav>

            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">My Favorites</h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">{listings.length} saved businesses</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring and save businesses you love to find them easily later.
              </p>
              <Link href="/search" className="text-primary hover:underline">
                Browse Listings
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
