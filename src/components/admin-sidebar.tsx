import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { MENU_ITEMS } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/use-auth"

// Map menu item label keys to their i18n keys in common namespace
const LABEL_KEY_MAP: Record<string, string> = {
  "Dashboard":         "common.dashboard",
  "Products":          "common.products",
  "Users":             "common.users",
  "Orders":            "common.orders",
  "Coupons":           "common.coupons",
  "Referrals":         "common.referrals",
  "Wallet":            "common.wallet",
  "Refunds":           "common.refunds",
  "Notifications":     "common.notifications",
  "Languages":         "common.languages",
  "Categories":       "common.categories",
  "Banners":          "common.banners",
  "Brands":           "common.brands",
  "Sub-Admins":       "common.permissions",
  "Shipping":          "common.shipping",
  "Settings":          "common.settings",
}

export function AdminSidebar() {
  const location = useLocation()
  const { t } = useTranslation()
  const { logout } = useAuth()

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r bg-sidebar">
      <SidebarHeader className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Ayur Pooja Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu>
          {MENU_ITEMS.map((item) => {
            const i18nKey = LABEL_KEY_MAP[item.label]
            const translatedLabel = i18nKey ? t(i18nKey) : item.label
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  render={
                    <Link 
                      to={item.href} 
                      className="flex items-center gap-3 transition-all hover:translate-x-1" 
                    />
                  }
                  tooltip={translatedLabel}
                  isActive={location.pathname === item.href}
                  className="h-11 px-4"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{translatedLabel}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <Avatar className="w-9 h-9 border-2 border-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate leading-none">Admin User</span>
            <span className="text-xs text-muted-foreground truncate">admin@ayurpooja.com</span>
          </div>
          <SidebarMenuButton size="default" className="shrink-0" tooltip={t("common.logout")} onClick={logout}>
            <LogOut className="w-4 h-4" />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
