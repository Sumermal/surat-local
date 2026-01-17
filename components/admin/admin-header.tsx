import Link from "next/link"
import { LayoutDashboard } from "lucide-react"

export function AdminHeader({ activeTab }: { activeTab?: string }) {
  const tabs = [
    { href: "/admin/listings", label: "Listings" },
    { href: "/admin/areas", label: "Areas" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/submissions", label: "Submissions" },
    { href: "/admin/edits", label: "Edits" },
    { href: "/admin/users", label: "Users" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Admin Panel</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
          <Link
            href="/"
            className="ml-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            View Site
          </Link>
        </nav>
      </div>
    </header>
  )
}
