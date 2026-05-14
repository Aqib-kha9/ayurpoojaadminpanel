
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Share2, 
  Users, 
  Trophy, 
  ArrowUpRight, 
  Settings2,
  PieChart as PieChartIcon
} from "lucide-react"

export default function ReferralsPage() {
  const { t } = useTranslation()

  const referrals = [
    { user: "Rahul Sharma", code: "RAHUL500", referrals: 15, earned: "₹7,500", status: "Gold" },
    { user: "Anjali Rao", code: "ANJALI100", referrals: 2, earned: "₹200", status: "Silver" },
    { user: "Vijay Kumar", code: "VIJAY99", referrals: 8, earned: "₹1,600", status: "Gold" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("referrals.title")}</h1>
          <p className="text-muted-foreground">{t("referrals.subtitle")}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings2 className="h-4 w-4" /> {t("referrals.program_settings")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("referrals.reward_amount")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">₹100.00</div>
            <p className="text-xs text-muted-foreground">{t("referrals.credit_per_referral")}</p>
            <div className="pt-2">
              <Label htmlFor="reward" className="text-xs">{t("referrals.update_reward")}</Label>
              <div className="flex gap-2 mt-1">
                <Input id="reward" placeholder="100" className="h-9" />
                <Button size="sm">{t("common.save")}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("referrals.total_distributed")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹24,500</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">+₹1,200 this week</p>
            <div className="mt-4 flex items-center gap-2">
               <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%]" />
               </div>
               <span className="text-xs font-bold text-primary">65% {t("referrals.target")}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("referrals.conversion_rate")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.4%</div>
            <p className="text-xs text-muted-foreground mt-1">{t("referrals.from_share_to_purchase")}</p>
            <div className="flex items-center gap-2 mt-4">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <PieChartIcon className="h-4 w-4 text-primary" />
               </div>
               <span className="text-xs font-medium">{t("referrals.industry_average")}: 8.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl">
        <CardHeader>
           <CardTitle>{t("referrals.top_referrers")}</CardTitle>
           <CardDescription>{t("referrals.top_referrers_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-6">
              {referrals.map((ref, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-muted/20 hover:bg-muted/30 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center font-bold text-primary">
                         {idx + 1}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold">{ref.user}</span>
                         <span className="text-xs font-mono text-muted-foreground">{ref.code}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 md:gap-12">
                      <div className="flex flex-col items-center">
                         <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{t("referrals.referrals_col")}</span>
                         <span className="font-bold">{ref.referrals}</span>
                      </div>
                      <div className="flex flex-col items-center">
                         <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{t("referrals.earned")}</span>
                         <span className="font-bold text-emerald-600">{ref.earned}</span>
                      </div>
                      <Badge className={ref.status === "Gold" ? "bg-amber-500/10 text-amber-600 border-none" : "bg-slate-500/10 text-slate-600 border-none"}>
                         {ref.status} {t("referrals.tier")}
                      </Badge>
                   </div>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
