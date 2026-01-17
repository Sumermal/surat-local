import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Settings } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileSettings } from "@/components/profile-settings"

export const metadata = {
  title: "Settings | Surat Local",
  description: "Manage your account settings.",
}

export default async function SettingsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/settings")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
              <span className="text-foreground">Settings</span>
            </nav>

            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Account Settings</h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <ProfileSettings profile={profile} userEmail={user.email || ""} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
