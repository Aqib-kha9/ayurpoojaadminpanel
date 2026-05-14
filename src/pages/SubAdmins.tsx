import * as React from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Shield, ShieldAlert, ShieldCheck, Mail, UserPlus, Trash2, Key } from "lucide-react"
import { format } from "date-fns"

export default function SubAdminsPage() {
  const [admins, setAdmins] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [newAdmin, setNewAdmin] = React.useState({ name: "", email: "", password: "" })

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const resp = await api.get("/admin")
      setAdmins(resp.data.data.admins)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchAdmins()
  }, [])

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post("/admin", newAdmin)
      setIsAddOpen(false)
      setNewAdmin({ name: "", email: "", password: "" })
      fetchAdmins()
    } catch (err) {
      alert("Failed to create admin")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await api.delete(`/admin/${id}`)
      fetchAdmins()
    } catch (err) {}
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic tracking-tighter text-primary">Team Management</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-70">Manage Sub-Admins and Permissions</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20">
          <UserPlus className="h-4 w-4" /> Add Sub-Admin
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
           <CardTitle className="text-lg font-black flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Active Personnel
           </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Admin Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Email Address</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Role</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Access Level</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Joined</TableHead>
                <TableHead className="text-right pr-6">{/* Actions */}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={6} className="h-16 bg-muted/20" />
                  </TableRow>
                ))
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                          {admin.name[0]}
                        </div>
                        <span className="font-bold">{admin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Mail className="h-3 w-3" /> {admin.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.role === "ADMIN" ? "default" : "secondary"} className="rounded-full text-[10px] font-black italic">
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex gap-1">
                          {admin.role === "ADMIN" ? (
                             <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px]">FULL ACCESS</Badge>
                          ) : (
                             <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[9px]">RESTRICTED</Badge>
                          )}
                       </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground">{format(new Date(admin.createdAt), "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {admin.role !== "ADMIN" && (
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(admin.id)} className="text-destructive hover:bg-destructive/10">
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
           <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black italic flex items-center gap-3">
                 <ShieldCheck className="h-7 w-7" /> Add Sub-Admin
              </DialogTitle>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Create new personnel account</p>
           </DialogHeader>
           <form onSubmit={handleCreateAdmin} className="p-8 space-y-4">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-muted-foreground">Full Name</Label>
                 <Input 
                   className="h-12 border-muted-foreground/10" 
                   value={newAdmin.name}
                   onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                   placeholder="e.g. Rahul Sharma"
                   required
                 />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-muted-foreground">Email Address</Label>
                 <Input 
                   type="email" 
                   className="h-12 border-muted-foreground/10" 
                   value={newAdmin.email}
                   onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                   placeholder="rahul@ayurpooja.com"
                   required
                 />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-muted-foreground">Secret Password</Label>
                 <div className="relative">
                    <Key className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                    <Input 
                      type="password" 
                      className="h-12 pl-10 border-muted-foreground/10" 
                      value={newAdmin.password}
                      onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                 </div>
              </div>
              <DialogFooter className="pt-6">
                 <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold">Discard</Button>
                 <Button type="submit" className="rounded-xl px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20">Grant Access</Button>
              </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
