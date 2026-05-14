
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ANALYTICS } from "@/lib/mock-data"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts"
import { Button } from "@/components/ui/button"
import { Download, Calendar as CalendarIcon } from "lucide-react"

export default function ReportsPage() {
  const { t } = useTranslation()

  const pieData = [
    { name: 'Snacks', value: 400 },
    { name: 'Cosmetics', value: 300 },
    { name: 'Beverages', value: 300 },
    { name: 'Household', value: 200 },
  ]

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e']

  const summaryStats = [
    { labelKey: "reports.new_registrations", value: "142", trend: "+12%" },
    { labelKey: "reports.avg_order_value", value: "₹450", trend: "+5%" },
    { labelKey: "reports.coupon_usage", value: "24%", trend: "-2%" },
    { labelKey: "reports.referral_rate", value: "12%", trend: "+8%" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("reports.title")}</h1>
          <p className="text-muted-foreground">{t("reports.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" /> {t("reports.last_30_days")}
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> {t("reports.download_report")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle>{t("reports.sales_growth")}</CardTitle>
            <CardDescription>{t("reports.revenue_trends")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS.salesData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>{t("reports.sales_by_category")}</CardTitle>
            <CardDescription>{t("reports.order_distribution")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {summaryStats.map((item, idx) => (
           <Card key={idx} className="border-none shadow-md">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t(item.labelKey)}</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className={`text-xs mt-1 font-medium ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.trend} {t("reports.vs_last_period")}
                </p>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  )
}
