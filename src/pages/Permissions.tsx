
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  ShieldCheck, 
  UserPlus
} from "lucide-react"

export default function PermissionsPage() {
  const { t } = useTranslation()

  const roles = [
    { name: "Super Admin", users: 1, permissions: "All Access", color: "bg-indigo-500" },
    { name: "Order Manager", users: 3, permissions: "Orders, Shipping", color: "bg-amber-500" },
    { name: "Inventory Lead", users: 2, permissions: "Products, Packages", color: "bg-emerald-500" },
    { name: "Support", users: 5, permissions: "Users, Wallet, Refunds", color: "bg-rose-500" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("permissions.title")}</h1>
          <p className="text-muted-foreground">{t("permissions.subtitle")}</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> {t("permissions.create_role")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.name} className="border-none shadow-lg overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${role.color}`} />
                   <CardTitle className="text-xl">{role.name}</CardTitle>
                </div>
                <Badge variant="secondary">{role.users} {t("permissions.users_assigned")}</Badge>
              </div>
              <CardDescription className="pt-2 font-medium">{t("permissions.permissions_label")}: {role.permissions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                 {[
                   { labelKey: "permissions.can_view_reports", value: true },
                   { labelKey: "permissions.can_process_refunds", value: role.name !== "Inventory Lead" },
                   { labelKey: "permissions.can_manage_products", value: role.name !== "Support" },
                   { labelKey: "permissions.can_manage_users", value: role.name === "Super Admin" || role.name === "Support" },
                 ].map((p, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-muted-foreground/10">
                      <span className="text-sm font-medium">{t(p.labelKey)}</span>
                      <Switch checked={p.value} disabled={role.name === "Super Admin"} />
                   </div>
                 ))}
              </div>
            </CardContent>
            <div className="px-6 py-4 bg-muted/30 border-t flex justify-between items-center">
               <span className="text-xs text-muted-foreground">{t("permissions.last_modified")}</span>
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">{t("permissions.edit_role")}</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">{t("common.delete")}</Button>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
