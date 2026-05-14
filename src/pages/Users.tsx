import * as React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { USERS as INITIAL_USERS } from "@/lib/mock-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import api from "@/lib/api"
import { format } from "date-fns"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { 
  MoreHorizontal, ShieldAlert, ShieldCheck, Search, Phone, Mail, 
  Eye, Edit2, Trash2, Users, Wallet, MapPin, Package, 
  ArrowUpRight, ArrowDownLeft, Plus, Minus 
} from "lucide-react"

export default function UsersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [users, setUsers] = React.useState<any[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [limit] = React.useState(10)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  
  const [isWalletOpen, setIsWalletOpen] = React.useState(false)
  const [walletForm, setWalletForm] = React.useState({ amount: "", reason: "", type: "CREDIT" as "CREDIT" | "DEBIT" })
  const [isWalletLoading, setIsWalletLoading] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/users/all", {
        params: { page, limit, search: searchTerm }
      })
      setUsers(response.data.data.users)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [page, searchTerm])

  const handleToggleBlock = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}/block`)
      fetchUsers()
    } catch (error) {
       alert("Failed to update user status")
    }
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id))
      setIsDeleteOpen(false)
      setSelectedUser(null)
    }
  }

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? { ...user, ...updatedData } : user
    ))
    setIsEditOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("users.title")}</h1>
          <p className="text-muted-foreground">{t("users.subtitle")}</p>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>{t("users.registered_users")}</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("users.search_placeholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("users.user")}</TableHead>
                <TableHead>{t("users.contact")}</TableHead>
                <TableHead>{t("users.joined")}</TableHead>
                <TableHead>{t("users.orders")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={6}><div className="h-12 bg-muted rounded-lg w-full" /></TableCell>
                  </TableRow>
                ))
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/5 transition-transform group-hover:scale-105">
                          {user.name ? user.name[0] : <Users className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{user.name || t("users.unnamed_user")}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{user.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Phone className="h-3 w-3 text-primary/60" />
                          {user.phone}
                        </div>
                        {user.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground">
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-xs font-black">₹{parseFloat(user.walletBalance).toFixed(2)}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t("users.balance")}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "ACTIVE" ? "default" : "destructive"}
                        className={cn(
                          "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter border-none",
                          user.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {t(`common.${user.status.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hover:bg-primary/10")}>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-primary/10 shadow-2xl">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 px-2">{t("users.manage_account")}</DropdownMenuLabel>
                             <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)} className="gap-2 rounded-lg">
                               <Eye className="w-4 h-4 text-blue-500" /> {t("users.view_profile")}
                             </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditOpen(true); }} className="gap-2 rounded-lg">
                              <Edit2 className="w-4 h-4 text-amber-500" /> {t("users.edit_info")}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem 
                              onClick={() => handleToggleBlock(user.id)}
                              className={cn("gap-2 rounded-lg font-bold", user.status === "ACTIVE" ? "text-destructive" : "text-emerald-600")}
                            >
                              {user.status === "ACTIVE" ? (
                                <><ShieldAlert className="w-4 h-4" /> {t("users.block_account")}</>
                              ) : (
                                <><ShieldCheck className="w-4 h-4" /> {t("users.unblock_account")}</>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {users.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {t("users.no_users")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("users.edit_user")}</DialogTitle>
            <DialogDescription>{t("users.edit_description")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("users.full_name")}</Label>
              <Input id="name" name="name" defaultValue={selectedUser?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("users.email_address")}</Label>
              <Input id="email" name="email" type="email" defaultValue={selectedUser?.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("users.phone_number")}</Label>
              <Input id="phone" name="phone" defaultValue={selectedUser?.phone} required />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>{t("common.cancel")}</Button>
              <Button type="submit">{t("users.save_changes")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("users.delete_warning")} <strong> {selectedUser?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("users.delete_account")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
