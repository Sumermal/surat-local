import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { AreasSection } from "@/components/home/areas-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { StatsSection } from "@/components/home/stats-section"

export default async function HomePage() {
  const supabase = await getSupabaseServerClient()

  // Fetch areas with listing counts
  const { data: areas } = await supabase.from("areas").select("*, listings:listings(count)").order("name").limit(8)

  const areasWithCount =
    areas?.map((area) => ({
      ...area,
      listing_count: area.listings?.[0]?.count ?? 0,
    })) ?? []

  // Fetch categories with listing counts
  const { data: categories } = await supabase.from("categories").select("*, listings:listings(count)").order("name")

  const categoriesWithCount =
    categories?.map((cat) => ({
      ...cat,
      listing_count: cat.listings?.[0]?.count ?? 0,
    })) ?? []

  // Fetch featured listings
  const { data: featuredListings } = await supabase
    .from("listings")
    .select("*, area:areas(*), category:categories(*)")
    .eq("is_featured", true)
    .limit(6)

  // Get stats
  const { count: totalListings } = await supabase.from("listings").select("*", { count: "exact", head: true })
  const { count: totalAreas } = await supabase.from("areas").select("*", { count: "exact", head: true })
  const { count: totalCategories } = await supabase.from("categories").select("*", { count: "exact", head: true })
  const { count: totalReviews } = await supabase.from("reviews").select("*", { count: "exact", head: true })

  const stats = {
    listings: totalListings ?? 0,
    areas: totalAreas ?? 0,
    categories: totalCategories ?? 0,
    reviews: totalReviews ?? 0,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection stats={stats} />
        <AreasSection areas={areasWithCount} />
        <CategoriesSection categories={categoriesWithCount} />
        <FeaturedSection listings={featuredListings ?? []} />
      </main>
      <Footer />
    </div>
  )
}
