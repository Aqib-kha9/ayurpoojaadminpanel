
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { 
  Truck, 
  Package, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Box,
  RefreshCcw,
  ShieldCheck
} from "lucide-react"

export default function ShippingPage() {
  const { t } = useTranslation()

  const shipments = [
    { id: "SHIP-101", order: "#ORD-7722", status: "In Transit", carrier: "Shiprocket", est: "Apr 18" },
    { id: "SHIP-98", order: "#ORD-7715", status: "Delivered", carrier: "Delhivery", est: "Completed" },
    { id: "SHIP-105", order: "#ORD-7725", status: "Ready to Ship", carrier: "Pending", est: "N/A" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("shipping.title")}</h1>
          <p className="text-muted-foreground">{t("shipping.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="gap-2">
              <RefreshCcw className="h-4 w-4" /> {t("shipping.sync_status")}
           </Button>
           <Button className="gap-2">
              <Plus className="h-4 w-4" /> {t("shipping.manual_shipment")}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-indigo-600 text-white relative overflow-hidden">
           <div className="absolute -right-4 -bottom-4 opacity-10">
              <Truck className="h-32 w-32" />
           </div>
           <CardHeader>
              <div className="flex items-center gap-2 mb-2 p-1 px-2 rounded-full bg-white/20 w-fit">
                 <ShieldCheck className="h-4 w-4" /> 
                 <span className="text-xs font-bold uppercase">{t("shipping.active_integration")}</span>
              </div>
              <CardTitle className="text-2xl font-bold">Shiprocket</CardTitle>
              <CardDescription className="text-indigo-100/60">{t("shipping.api_status")}</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-indigo-100/70">{t("shipping.daily_limit")}</span>
                    <span className="font-bold font-mono">245 / 1000</span>
                 </div>
                 <div className="h-1.5 w-full bg-indigo-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[24%]" />
                 </div>
              </div>
           </CardContent>
           <CardFooter>
              <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-white/90">
                 {t("shipping.configure_api")}
              </Button>
           </CardFooter>
        </Card>

        {shipments.map((ship) => (
          <Card key={ship.id} className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={ship.status === "Delivered" ? "default" : "outline"} className={ship.status === "Delivered" ? "bg-emerald-500/10 text-emerald-600 border-none" : ""}>
                   {ship.status}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">{ship.id}</span>
              </div>
              <CardTitle className="text-lg pt-2">{ship.order}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Box className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{t("shipping.carrier")}</span>
                        <span className="text-sm font-medium">{ship.carrier}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{t("shipping.est_delivery")}</span>
                        <span className="text-sm font-medium">{ship.est}</span>
                     </div>
                  </div>
               </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
               <Button variant="ghost" className="w-full gap-2 text-xs">
                  {t("shipping.track_live")} <ExternalLink className="h-3 w-3" />
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
