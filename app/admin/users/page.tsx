import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserRoleSelect } from "@/components/admin/user-role-select"

export const metadata = {
  title: "Manage Users | Admin | Surat Local",
}

export default async function AdminUsersPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/users")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")

  const { data: users } = await supabase
    .from("profiles")
    .select("*, reviews:reviews(count), favorites:favorites(count)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader activeTab="/admin/users" />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground mt-1">{users?.length ?? 0} total users</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Reviews</TableHead>
                    <TableHead>Favorites</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((userProfile) => (
                    <TableRow key={userProfile.id}>
                      <TableCell className="font-medium">{userProfile.full_name || "N/A"}</TableCell>
                      <TableCell>{userProfile.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            userProfile.role === "admin"
                              ? "default"
                              : userProfile.role === "business"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {userProfile.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{userProfile.reviews?.[0]?.count || 0}</TableCell>
                      <TableCell>{userProfile.favorites?.[0]?.count || 0}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(userProfile.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <UserRoleSelect
                          userId={userProfile.id}
                          currentRole={userProfile.role}
                          disabled={userProfile.id === user.id}
                        />
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
