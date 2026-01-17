import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteCategoryButton } from "@/components/admin/delete-category-button"

export const metadata = {
  title: "Manage Categories | Admin | Surat Local",
}

export default async function AdminCategoriesPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/categories")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: categories } = await supabase.from("categories").select("*, listings:listings(count)").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader activeTab="/admin/categories" />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>
              <p className="text-muted-foreground mt-1">{categories?.length ?? 0} categories</p>
            </div>
            <Button asChild>
              <Link href="/admin/categories/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Hindi Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Listings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.icon || "-"}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.name_hi || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                      <TableCell>{category.listings?.[0]?.count || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                        </div>
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
