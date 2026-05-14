
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ANALYTICS, ORDERS, CATEGORIES } from "@/lib/mock-data"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ANALYTICS.stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(`dashboard.${stat.label.toLowerCase().replace(/ /g, '_')}`)}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                {stat.change.startsWith("+") ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={stat.change.startsWith("+") ? "text-emerald-500" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">{t("common.vs_last_month")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="lg:col-span-4 border-none shadow-lg">
          <CardHeader>
            <CardTitle>{t("dashboard.revenue_analytics")}</CardTitle>
            <CardDescription>{t("dashboard.revenue_description")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS.salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card className="lg:col-span-3 border-none shadow-lg">
          <CardHeader>
            <CardTitle>{t("dashboard.top_categories")}</CardTitle>
            <CardDescription>{t("dashboard.categories_description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {cat.name[0]}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.count} {t("dashboard.items")}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(cat.count / 150) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("dashboard.recent_orders")}</CardTitle>
            <CardDescription>{t("dashboard.recent_orders_description")}</CardDescription>
          </div>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">
            {t("dashboard.view_all")} <ArrowUpRight className="ml-1 h-3 w-3" />
          </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dashboard.order_id")}</TableHead>
                <TableHead>{t("dashboard.customer")}</TableHead>
                <TableHead>{t("dashboard.items")}</TableHead>
                <TableHead>{t("dashboard.total")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("dashboard.payment")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ORDERS.map((order) => (
                <TableRow key={order.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono font-medium">{order.id}</TableCell>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="font-semibold">₹{order.total}</TableCell>
                   <TableCell>
                    <Badge 
                      variant={
                        order.status === "Delivered" ? "default" : 
                        order.status === "Processing" ? "secondary" : "outline"
                      }
                      className={order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none" : ""}
                    >
                      {t(`common.${order.status.toLowerCase()}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {t(`common.${order.payment.toLowerCase().includes('upi') ? 'paid_upi' : order.payment.toLowerCase().includes('card') ? 'paid_card' : 'cod'}`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
