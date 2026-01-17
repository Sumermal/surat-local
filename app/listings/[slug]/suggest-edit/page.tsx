import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SuggestEditForm } from "@/components/suggest-edit-form"

interface SuggestEditPageProps {
  params: Promise<{ slug: string }>
}

export default async function SuggestEditPage({ params }: SuggestEditPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  const { data: listing } = await supabase.from("listings").select("*").eq("slug", slug).single()

  if (!listing) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/listings/${slug}/suggest-edit`)
  }

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
              <Link
                href={`/listings/${slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {listing.name}
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Suggest Edit</span>
            </nav>

            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Suggest an Edit</h1>
            <p className="mt-2 text-lg text-muted-foreground">Help us keep {listing.name} information accurate</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <SuggestEditForm listing={listing} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
