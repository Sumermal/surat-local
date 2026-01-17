import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListingCard } from "@/components/listing-card"
import { CategoryFilter } from "@/components/category-filter"
import type { Metadata } from "next"

interface AreaPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()
  const { data: area } = await supabase.from("areas").select("name, description").eq("slug", slug).single()

  if (!area) return { title: "Area Not Found | Surat Local" }

  return {
    title: `${area.name} - Businesses & Services | Surat Local`,
    description: area.description || `Discover local businesses and services in ${area.name}, Surat.`,
  }
}

export default async function AreaPage({ params, searchParams }: AreaPageProps) {
  const { slug } = await params
  const { category } = await searchParams
  const supabase = await getSupabaseServerClient()

  // Fetch area details
  const { data: area } = await supabase.from("areas").select("*").eq("slug", slug).single()

  if (!area) {
    notFound()
  }

  // Fetch categories for filter
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Build listings query
  let listingsQuery = supabase
    .from("listings")
    .select("*, area:areas(*), category:categories(*)")
    .eq("area_id", area.id)

  if (category) {
    const { data: selectedCategory } = await supabase.from("categories").select("id").eq("slug", category).single()
    if (selectedCategory) {
      listingsQuery = listingsQuery.eq("category_id", selectedCategory.id)
    }
  }

  const { data: listings } = await listingsQuery.order("is_featured", { ascending: false }).order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div
          className="relative bg-secondary/30 py-12"
          style={
            area.image_url
              ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${area.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm">
              <Link
                href="/"
                className={`${area.image_url ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"} transition-colors`}
              >
                Home
              </Link>
              <ChevronRight className={`h-4 w-4 ${area.image_url ? "text-white/50" : "text-muted-foreground"}`} />
              <Link
                href="/areas"
                className={`${area.image_url ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"} transition-colors`}
              >
                Areas
              </Link>
              <ChevronRight className={`h-4 w-4 ${area.image_url ? "text-white/50" : "text-muted-foreground"}`} />
              <span className={area.image_url ? "text-white" : "text-foreground"}>{area.name}</span>
            </nav>

            <h1 className={`text-3xl font-bold sm:text-4xl ${area.image_url ? "text-white" : "text-foreground"}`}>
              {area.name}
            </h1>
            {area.description && (
              <p className={`mt-2 max-w-2xl text-lg ${area.image_url ? "text-white/80" : "text-muted-foreground"}`}>
                {area.description}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <CategoryFilter categories={categories ?? []} selectedCategory={category} basePath={`/areas/${slug}`} />

          {/* Listings Grid */}
          {listings && listings.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-lg text-muted-foreground">No listings found in this area.</p>
              <Link href="/submit" className="mt-4 inline-block text-primary hover:underline">
                Be the first to add a listing
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
