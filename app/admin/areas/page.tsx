import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteAreaButton } from "@/components/admin/delete-area-button"

export const metadata = {
  title: "Manage Areas | Admin | Surat Local",
}

export default async function AdminAreasPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/areas")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: areas } = await supabase.from("areas").select("*, listings:listings(count)").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader activeTab="/admin/areas" />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Areas</h1>
              <p className="text-muted-foreground mt-1">{areas?.length ?? 0} areas</p>
            </div>
            <Button asChild>
              <Link href="/admin/areas/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Area
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Hindi Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Listings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areas?.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>{area.name_hi || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{area.slug}</TableCell>
                      <TableCell>{area.listings?.[0]?.count || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/areas/${area.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteAreaButton areaId={area.id} areaName={area.name} />
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
