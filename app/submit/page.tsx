import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubmitListingForm } from "@/components/submit-listing-form"

export const metadata = {
  title: "Submit a Listing | Surat Local",
  description: "Add your business to Surat Local directory.",
}

export default async function SubmitListingPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/submit")
  }

  // Fetch areas and categories
  const { data: areas } = await supabase.from("areas").select("*").order("name")
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Submit Listing</span>
            </nav>

            <div className="flex items-center gap-3">
              <Plus className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Submit a Business</h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              Add your business to our directory and reach thousands of locals
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <SubmitListingForm areas={areas ?? []} categories={categories ?? []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
