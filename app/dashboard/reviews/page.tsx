import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight, MessageSquare, Star } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "My Reviews | Surat Local",
  description: "View all reviews you've written.",
}

export default async function ReviewsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/reviews")
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, listing:listings(id, name, slug, area:areas(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

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
              <span className="text-foreground">Reviews</span>
            </nav>

            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-amber-500" />
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">My Reviews</h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">{reviews?.length ?? 0} reviews written</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/listings/${review.listing?.slug}`}
                          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {review.listing?.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{review.listing?.area?.name}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        {review.comment && <p className="mt-3 text-muted-foreground">{review.comment}</p>}
                      </div>
                      <time className="text-sm text-muted-foreground shrink-0">
                        {new Date(review.created_at).toLocaleDateString()}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No reviews yet</h2>
              <p className="text-muted-foreground mb-6">
                Share your experiences by reviewing businesses you've visited.
              </p>
              <Link href="/search" className="text-primary hover:underline">
                Find a Business to Review
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
