
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Plus
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function WalletPage() {
  const { t } = useTranslation()

  const transactions = [
    { id: "TXN1021", user: "Rahul Sharma", amount: 500, type: "Credit", reason: "Referral Bonus", date: "2024-04-12" },
    { id: "TXN1022", user: "Anjali Rao", amount: 200, type: "Debit", reason: "Order Purchase", date: "2024-04-11" },
    { id: "TXN1023", user: "Vijay Kumar", amount: 1000, type: "Credit", reason: "Manual Credit", date: "2024-04-10" },
    { id: "TXN1024", user: "Priya Singh", amount: 150, type: "Credit", reason: "Cashback", date: "2024-04-09" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("wallet.title")}</h1>
          <p className="text-muted-foreground">{t("wallet.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> {t("wallet.manual_credit")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-primary text-primary-foreground border-none shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="h-32 w-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-primary-foreground/80 text-sm font-medium uppercase tracking-widest">{t("wallet.total_balance")}</CardTitle>
            <div className="text-4xl font-bold pt-2">₹1,45,280</div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary-foreground/60">Across 842 {t("wallet.active_wallets")}</p>
            <div className="mt-6 flex items-center gap-4">
               <div className="flex-1 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold text-white/60">{t("wallet.todays_credits")}</p>
                  <p className="text-lg font-bold">₹2,500</p>
               </div>
               <div className="flex-1 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold text-white/60">{t("wallet.todays_usage")}</p>
                  <p className="text-lg font-bold">₹8,420</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("wallet.recent_transactions")}</CardTitle>
                <CardDescription>{t("wallet.transaction_log")}</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t("wallet.search_placeholder")} className="pl-8 h-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("wallet.user")}</TableHead>
                  <TableHead>{t("wallet.type")}</TableHead>
                  <TableHead>{t("wallet.amount")}</TableHead>
                  <TableHead>{t("wallet.reason")}</TableHead>
                  <TableHead className="text-right">{t("wallet.date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {txn.type === "Credit" ? (
                          <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 text-rose-500" />
                        )}
                        <span className={txn.type === "Credit" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                          {txn.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">₹{txn.amount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{txn.reason}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-mono">{txn.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
