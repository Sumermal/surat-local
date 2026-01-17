import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, MapPin, Phone, Globe, Clock, Mail, BadgeCheck, Star, ExternalLink, Share2 } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReviewsList } from "@/components/reviews-list"
import { ReviewForm } from "@/components/review-form"
import { FavoriteButton } from "@/components/favorite-button"
import { ListingCard } from "@/components/listing-card"
import { ImageGallery } from "@/components/image-gallery"
import type { Metadata } from "next"

interface ListingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()
  const { data: listing } = await supabase
    .from("listings")
    .select("name, description, area:areas(name)")
    .eq("slug", slug)
    .single()

  if (!listing) return { title: "Listing Not Found | Surat Local" }

  return {
    title: `${listing.name} - ${listing.area?.name || "Surat"} | Surat Local`,
    description: listing.description || `${listing.name} in ${listing.area?.name || "Surat"}.`,
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  // Fetch listing with relations
  const { data: listing } = await supabase
    .from("listings")
    .select("*, area:areas(*), category:categories(*)")
    .eq("slug", slug)
    .single()

  if (!listing) {
    notFound()
  }

  const { data: listingImages } = await supabase
    .from("listing_images")
    .select("*")
    .eq("listing_id", listing.id)
    .order("display_order", { ascending: true })

  // Fetch reviews with user profiles
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profile:profiles(full_name, avatar_url)")
    .eq("listing_id", listing.id)
    .order("created_at", { ascending: false })

  // Calculate average rating
  const avgRating = reviews && reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  // Fetch related listings (same category, different listing)
  const { data: relatedListings } = await supabase
    .from("listings")
    .select("*, area:areas(*), category:categories(*)")
    .eq("category_id", listing.category_id)
    .neq("id", listing.id)
    .limit(3)

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if listing is favorited
  let isFavorited = false
  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", listing.id)
      .single()
    isFavorited = !!favorite
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-64 bg-secondary sm:h-80 lg:h-96">
          {listing.image_url ? (
            <Image src={listing.image_url || "/placeholder.svg"} alt={listing.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <MapPin className="h-20 w-20 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex gap-2 sm:left-6 sm:top-6">
            {listing.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
            {listing.is_verified && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                <BadgeCheck className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
            <FavoriteButton listingId={listing.id} isFavorited={isFavorited} isLoggedIn={!!user} />
            <Button size="icon" variant="secondary" className="h-10 w-10 bg-background/90 hover:bg-background">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={`/categories/${listing.category?.slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {listing.category?.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={`/areas/${listing.area?.slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {listing.area?.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground truncate">{listing.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{listing.name}</h1>
                {listing.name_hi && <p className="mt-1 text-lg text-muted-foreground">{listing.name_hi}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${star <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{avgRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({reviews?.length} reviews)</span>
                    </div>
                  )}
                  <Badge variant="outline">{listing.category?.name}</Badge>
                  <span className="text-muted-foreground">{listing.area?.name}</span>
                </div>
              </div>

              {listingImages && listingImages.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">Photos</h2>
                  <ImageGallery images={listingImages} primaryImage={listing.image_url} />
                </div>
              )}

              {/* Description */}
              {listing.description && (
                <div>
                  <h2 className="mb-3 text-xl font-semibold text-foreground">About</h2>
                  <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                  {listing.description_hi && (
                    <p className="mt-2 text-muted-foreground leading-relaxed">{listing.description_hi}</p>
                  )}
                </div>
              )}

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Reviews ({reviews?.length || 0})</h2>
                </div>

                {user && (
                  <div className="mb-8">
                    <ReviewForm listingId={listing.id} />
                  </div>
                )}

                <ReviewsList reviews={reviews ?? []} />

                {!user && (
                  <div className="mt-6 rounded-lg bg-secondary/50 p-6 text-center">
                    <p className="text-muted-foreground mb-4">Sign in to leave a review</p>
                    <Button asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-sm text-muted-foreground">{listing.address}</p>
                      {listing.address_hi && <p className="text-sm text-muted-foreground mt-1">{listing.address_hi}</p>}
                    </div>
                  </div>

                  {listing.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <a href={`tel:${listing.phone}`} className="text-sm text-primary hover:underline">
                          {listing.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {listing.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <a href={`mailto:${listing.email}`} className="text-sm text-primary hover:underline">
                          {listing.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {listing.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Website</p>
                        <a
                          href={listing.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {listing.hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Hours</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{listing.hours}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Suggest Edit */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">Is this your business or see something wrong?</p>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/listings/${listing.slug}/suggest-edit`}>Suggest an Edit</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Listings */}
          {relatedListings && relatedListings.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Similar Listings</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedListings.map((related) => (
                  <ListingCard key={related.id} listing={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
