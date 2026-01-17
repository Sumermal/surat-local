import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AreaCard } from "@/components/area-card"

export const metadata = {
  title: "Areas in Surat | Surat Local",
  description: "Browse all areas and neighborhoods in Surat. Find local businesses in Adajan, Vesu, Athwa, and more.",
}

export default async function AreasPage() {
  const supabase = await getSupabaseServerClient()

  const { data: areas } = await supabase.from("areas").select("*, listings:listings(count)").order("name")

  const areasWithCount =
    areas?.map((area) => ({
      ...area,
      listing_count: area.listings?.[0]?.count ?? 0,
    })) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Areas in Surat</h1>
            <p className="mt-2 text-lg text-muted-foreground">Explore businesses in different neighborhoods of Surat</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areasWithCount.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
