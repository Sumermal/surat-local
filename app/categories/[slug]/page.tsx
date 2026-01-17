import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListingCard } from "@/components/listing-card"
import { AreaFilter } from "@/components/area-filter"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ area?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()
  const { data: category } = await supabase.from("categories").select("name, description").eq("slug", slug).single()

  if (!category) return { title: "Category Not Found | Surat Local" }

  return {
    title: `${category.name} in Surat | Surat Local`,
    description: category.description || `Find the best ${category.name.toLowerCase()} in Surat.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { area } = await searchParams
  const supabase = await getSupabaseServerClient()

  // Fetch category details
  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (!category) {
    notFound()
  }

  // Fetch areas for filter
  const { data: areas } = await supabase.from("areas").select("*").order("name")

  // Build listings query
  let listingsQuery = supabase
    .from("listings")
    .select("*, area:areas(*), category:categories(*)")
    .eq("category_id", category.id)

  if (area) {
    const { data: selectedArea } = await supabase.from("areas").select("id").eq("slug", area).single()
    if (selectedArea) {
      listingsQuery = listingsQuery.eq("area_id", selectedArea.id)
    }
  }

  const { data: listings } = await listingsQuery.order("is_featured", { ascending: false }).order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{category.name}</span>
            </nav>

            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{category.name}</h1>
            {category.description && (
              <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{category.description}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Area Filter */}
          <AreaFilter areas={areas ?? []} selectedArea={area} basePath={`/categories/${slug}`} />

          {/* Listings Grid */}
          {listings && listings.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-lg text-muted-foreground">No listings found in this category.</p>
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
