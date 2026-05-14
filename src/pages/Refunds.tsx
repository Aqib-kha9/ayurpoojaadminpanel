
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  RefreshCcw, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Clock,
  History
} from "lucide-react"

export default function RefundsPage() {
  const { t } = useTranslation()

  const requests = [
    { id: "REF-501", order: "#ORD-7710", user: "Rahul Sharma", amount: "₹450", reason: "Damaged Product", status: "Pending", date: "2024-04-14" },
    { id: "REF-499", order: "#ORD-7705", user: "Sonal Gupta", amount: "₹1,200", reason: "Wrong Item Received", status: "Approved", date: "2024-04-12" },
    { id: "REF-495", order: "#ORD-7688", user: "Amit Shah", amount: "₹250", reason: "Quality Issue", status: "Rejected", date: "2024-04-10" },
  ]

  const stats = [
    { labelKey: "refunds.pending_claims", value: 5, icon: Clock, color: "text-amber-500" },
    { labelKey: "refunds.processed_today", value: 12, icon: CheckCircle2, color: "text-emerald-500" },
    { labelKey: "refunds.total_refunded", value: "₹1.2L", icon: RefreshCcw, color: "text-primary" },
    { labelKey: "refunds.conflict_rate", value: "0.8%", icon: AlertCircle, color: "text-rose-500" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("refunds.title")}</h1>
          <p className="text-muted-foreground">{t("refunds.subtitle")}</p>
        </div>
        <Button variant="outline" className="gap-2">
           <History className="h-4 w-4" /> {t("refunds.refund_policy")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {stats.map((stat, idx) => (
           <Card key={idx} className="border-none shadow-md">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase">{t(stat.labelKey)}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="space-y-4">
         <h2 className="text-xl font-bold px-1">{t("refunds.active_requests")}</h2>
         {requests.map((req) => (
           <Card key={req.id} className="border-none shadow-lg group hover:ring-1 ring-primary/20 transition-all">
             <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                   <div className="p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-muted/50 w-full md:w-64">
                      <span className="text-xs font-mono text-muted-foreground mb-1">{req.id}</span>
                      <h3 className="font-bold text-lg">{req.order}</h3>
                      <p className="text-sm text-muted-foreground">{req.user}</p>
                   </div>
                   <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">{req.amount}</span>
                            <Badge variant={
                               req.status === "Pending" ? "secondary" : 
                               req.status === "Approved" ? "default" : "destructive"
                            } className={req.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-none" : ""}>
                               {req.status}
                            </Badge>
                         </div>
                         <p className="text-sm font-medium">{t("refunds.reason")}: <span className="text-muted-foreground font-normal">{req.reason}</span></p>
                         <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {t("refunds.requested_on")} {req.date}</p>
                      </div>
                      
                      {req.status === "Pending" ? (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <Button variant="outline" className="flex-1 md:flex-none border-destructive text-destructive hover:bg-destructive/10">{t("refunds.reject")}</Button>
                           <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700">{t("refunds.approve_refund")}</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" className="gap-2 text-primary group-hover:translate-x-1 transition-transform">
                           {t("refunds.view_details")} <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                   </div>
                </div>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  )
}
