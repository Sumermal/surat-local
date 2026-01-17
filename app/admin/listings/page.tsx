import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, BadgeCheck, Star } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata = {
  title: "Manage Listings | Admin | Surat Local",
}

export default async function AdminListingsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/listings")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: listings } = await supabase
    .from("listings")
    .select("*, area:areas(name), category:categories(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader activeTab="/admin/listings" />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Listings</h1>
              <p className="text-muted-foreground mt-1">{listings?.length ?? 0} total listings</p>
            </div>
            <Button asChild>
              <Link href="/admin/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Listing
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings?.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">
                        <Link href={`/listings/${listing.slug}`} className="hover:text-primary transition-colors">
                          {listing.name}
                        </Link>
                      </TableCell>
                      <TableCell>{listing.area?.name}</TableCell>
                      <TableCell>{listing.category?.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {listing.is_verified && (
                            <Badge variant="secondary" className="gap-1">
                              <BadgeCheck className="h-3 w-3" /> Verified
                            </Badge>
                          )}
                          {listing.is_featured && (
                            <Badge className="bg-accent text-accent-foreground gap-1">
                              <Star className="h-3 w-3" /> Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/listings/${listing.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
