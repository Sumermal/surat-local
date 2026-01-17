import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search-form"
import { ListingCard } from "@/components/listing-card"

export const metadata = {
  title: "Search | Surat Local",
  description: "Search for businesses, services, and more in Surat.",
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    area?: string
    category?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, area, category } = await searchParams
  const supabase = await getSupabaseServerClient()

  // Fetch areas and categories for filters
  const { data: areas } = await supabase.from("areas").select("*").order("name")
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Build search query
  let listingsQuery = supabase.from("listings").select("*, area:areas(*), category:categories(*)")

  if (q) {
    listingsQuery = listingsQuery.or(`name.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%`)
  }

  if (area) {
    const { data: selectedArea } = await supabase.from("areas").select("id").eq("slug", area).single()
    if (selectedArea) {
      listingsQuery = listingsQuery.eq("area_id", selectedArea.id)
    }
  }

  if (category) {
    const { data: selectedCategory } = await supabase.from("categories").select("id").eq("slug", category).single()
    if (selectedCategory) {
      listingsQuery = listingsQuery.eq("category_id", selectedCategory.id)
    }
  }

  const { data: listings } = await listingsQuery.order("is_featured", { ascending: false }).order("name").limit(50)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">Search Listings</h1>
            <SearchForm
              areas={areas ?? []}
              categories={categories ?? []}
              initialQuery={q}
              initialArea={area}
              initialCategory={category}
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {listings?.length || 0} {listings?.length === 1 ? "result" : "results"} found
              {q && (
                <>
                  {" "}
                  for "<span className="font-medium text-foreground">{q}</span>"
                </>
              )}
            </p>
          </div>

          {/* Results Grid */}
          {listings && listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No listings found matching your criteria.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or browse our categories.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
