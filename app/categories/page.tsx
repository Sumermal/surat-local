import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryCard } from "@/components/category-card"

export const metadata = {
  title: "Categories | Surat Local",
  description:
    "Browse businesses by category - restaurants, shopping, healthcare, education, services, and more in Surat.",
}

export default async function CategoriesPage() {
  const supabase = await getSupabaseServerClient()

  const { data: categories } = await supabase.from("categories").select("*, listings:listings(count)").order("name")

  const categoriesWithCount =
    categories?.map((cat) => ({
      ...cat,
      listing_count: cat.listings?.[0]?.count ?? 0,
    })) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Browse by Category</h1>
            <p className="mt-2 text-lg text-muted-foreground">Find exactly what you're looking for in Surat</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesWithCount.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
