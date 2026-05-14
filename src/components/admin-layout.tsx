import * as React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Bell, Search, Globe, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link, Outlet, useLocation } from "react-router-dom"
import { MENU_ITEMS } from "@/lib/mock-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "react-i18next"

const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
]

export function AdminLayout() {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  
  const activeItem = MENU_ITEMS.find(item => item.href === location.pathname)
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    // Update the document language attribute for accessibility
    document.documentElement.lang = code
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/50">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shrink-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1 flex items-center gap-4">
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/" />}>{t("common.admin", "Admin")}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeItem?.label || t("common.dashboard")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden lg:block w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("common.search_everything")}
                  className="w-full bg-background pl-8 h-9 rounded-full border-muted-foreground/20 focus-visible:ring-primary"
                />
              </div>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger 
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-2 h-9 rounded-full border-muted-foreground/20 font-medium"
                  )}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLang.flag} {currentLang.native}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2">
                  <DropdownMenuGroup>
                    {LANGUAGES.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer",
                          i18n.language === lang.code && "bg-primary/10 text-primary font-bold"
                        )}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold leading-none">{lang.native}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5">{lang.label}</span>
                        </div>
                        {i18n.language === lang.code && (
                          <Check className="h-3.5 w-3.5 ml-auto text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
              </Button>
            </div>
          </header>
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl space-y-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
