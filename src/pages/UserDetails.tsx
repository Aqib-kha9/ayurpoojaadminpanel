import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Phone, 
  Mail, 
  Wallet, 
  MapPin, 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Minus, 
  ChevronLeft,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Users
} from "lucide-react"
import api from "@/lib/api"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [userDetails, setUserDetails] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [walletForm, setWalletForm] = React.useState({ amount: "", reason: "", type: "CREDIT" as "CREDIT" | "DEBIT" })
  const [isWalletLoading, setIsWalletLoading] = React.useState(false)

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true)
      const resp = await api.get(`/users/${id}`)
      setUserDetails(resp.data.data.user)
    } catch (err) {
      console.error("Failed to fetch user details", err)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (id) fetchUserDetails()
  }, [id])

  const handleWalletAction = async () => {
    if (!userDetails || !walletForm.amount || !walletForm.reason) return
    try {
      setIsWalletLoading(true)
      await api.post(`/users/${id}/wallet`, walletForm)
      setWalletForm({ amount: "", reason: "", type: "CREDIT" })
      fetchUserDetails()
    } catch (err) {
      alert("Failed to update wallet")
    } finally {
      setIsWalletLoading(false)
    }
  }

  const handleToggleBlock = async () => {
    if (!id) return
    try {
      await api.patch(`/users/${id}/block`)
      fetchUserDetails()
    } catch (error) {
       alert("Failed to update user status")
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">{t("users.user_not_found")}</h2>
        <Button onClick={() => navigate("/users")}>{t("users.back_to_users")}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/users")}
          className="gap-2 hover:bg-primary/5 -ml-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-bold uppercase tracking-widest text-[10px]">{t("users.back_to_users")}</span>
        </Button>
      </div>

      <div className="flex flex-col max-h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-primary/5">
        {/* Header */}
        <div className="bg-primary/5 p-8 border-b border-primary/10 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-5xl font-black text-primary border-4 border-white overflow-hidden relative group">
              {userDetails.profileImage ? (
                <img src={userDetails.profileImage} alt={userDetails.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : userDetails.name?.[0]}
            </div>
            <div className="space-y-3 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-4xl font-black italic text-primary leading-none tracking-tighter">
                  {userDetails.name || t("users.unnamed_user")}
                </h2>
                <Badge 
                  variant={userDetails.status === "ACTIVE" ? "default" : "destructive"} 
                  className={cn(
                    "rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-widest border-none",
                    userDetails.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                  )}
                >
                  {userDetails.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-xl">
                  <Phone className="h-4 w-4 text-primary" /> {userDetails.phone}
                </div>
                {userDetails.email && (
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-xl">
                    <Mail className="h-4 w-4 text-primary" /> {userDetails.email}
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-xl">
                  <Calendar className="h-4 w-4 text-primary" /> Joined {format(new Date(userDetails.createdAt), "dd MMM yyyy")}
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-center md:justify-start">
                <Button 
                  variant="outline" 
                  className={cn(
                    "rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6",
                    userDetails.status === "ACTIVE" ? "text-destructive border-destructive/20 hover:bg-destructive hover:text-white" : "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                  )}
                  onClick={handleToggleBlock}
                >
                  {userDetails.status === "ACTIVE" ? <ShieldAlert className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                  {userDetails.status === "ACTIVE" ? t("users.block_account") : t("users.unblock_account")}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Stats Overlay - Production Style */}
          <div className="mt-8 md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 flex gap-4 md:gap-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-none shadow-xl p-4 min-w-[140px] rounded-2xl">
              <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">{t("users.total_orders")}</p>
              <p className="text-2xl font-black italic text-slate-900 dark:text-white">{userDetails.orders?.length || 0}</p>
            </Card>
            <Card className="bg-primary text-white border-none shadow-2xl p-4 min-w-[160px] rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-2 -bottom-2 opacity-20 group-hover:scale-150 transition-transform duration-700">
                <Wallet className="w-16 h-16" />
              </div>
              <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-widest">{t("users.wallet_balance")}</p>
              <p className="text-2xl font-black italic">₹{parseFloat(userDetails.walletBalance).toFixed(2)}</p>
            </Card>
          </div>
        </div>

        {/* Page Body */}
        <div className="p-8 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Main Data) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Addresses Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-500" /> {t("users.delivery_addresses")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userDetails.addresses?.map((addr: any) => (
                    <div key={addr.id} className={cn(
                      "p-6 rounded-3xl border transition-all duration-300",
                      addr.isDefault 
                        ? "bg-primary/[0.03] border-primary/20 shadow-md ring-1 ring-primary/10" 
                        : "bg-muted/30 border-transparent hover:border-slate-200 dark:hover:border-white/10"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase px-2 py-0">{addr.type}</Badge>
                        {addr.isDefault && <Badge className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0">Primary</Badge>}
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.state}<br />
                        <span className="font-black text-xs text-primary">{addr.postalCode}</span>
                      </p>
                    </div>
                  ))}
                  {(!userDetails.addresses || userDetails.addresses.length === 0) && (
                    <div className="col-span-2 p-12 bg-muted/20 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl text-center">
                      <p className="text-sm text-muted-foreground font-bold italic">{t("users.no_addresses")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction History Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                  <Package className="h-6 w-6 text-amber-500" /> {t("users.recent_wallet_activity")}
                </h3>
                <div className="rounded-[2rem] border border-primary/5 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-[11px] font-black uppercase tracking-widest px-6">{t("users.transaction_date")}</TableHead>
                        <TableHead className="text-[11px] font-black uppercase tracking-widest">{t("common.type")}</TableHead>
                        <TableHead className="text-[11px] font-black uppercase tracking-widest">{t("users.description_note")}</TableHead>
                        <TableHead className="text-right text-[11px] font-black uppercase tracking-widest px-6">{t("wallet.amount")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userDetails.transactions?.map((tx: any) => (
                        <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-sm font-bold text-slate-600 dark:text-slate-400 px-6">
                            {format(new Date(tx.createdAt), "dd MMM, hh:mm a")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {tx.type === "CREDIT" ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"><ArrowUpRight className="h-3 w-3 text-emerald-600" /></div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center"><ArrowDownLeft className="h-3 w-3 text-rose-600" /></div>
                              )}
                              <span className={cn("text-[11px] font-black", tx.type === "CREDIT" ? "text-emerald-600" : "text-rose-600")}>{tx.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-500">{tx.reason}</TableCell>
                          <TableCell className="text-right font-black text-base italic tracking-tight px-6">
                            <span className={tx.type === "CREDIT" ? "text-emerald-600" : "text-rose-600"}>
                              {tx.type === "CREDIT" ? "+" : "-"} ₹{parseFloat(tx.amount).toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!userDetails.transactions || userDetails.transactions.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-bold italic">
                            {t("users.no_addresses").replace("addresses", "transactions")} 
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Right Column (Controls & Referrals) */}
            <div className="space-y-8">
              {/* Wallet Manager */}
              <Card className="border-none shadow-2xl bg-slate-950 text-white p-8 rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  {t("users.manage_wallet")}
                </h4>
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase opacity-50 tracking-widest">{t("users.amount_inr")}</Label>
                       <Input 
                          type="number" 
                          value={walletForm.amount}
                          onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})}
                          className="bg-white/5 border-white/10 h-12 text-white font-black text-lg focus:ring-primary rounded-xl" 
                          placeholder="0.00" 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase opacity-50 tracking-widest">{t("users.internal_note")}</Label>
                       <Input 
                          value={walletForm.reason}
                          onChange={(e) => setWalletForm({...walletForm, reason: e.target.value})}
                          className="bg-white/5 border-white/10 h-12 text-white font-bold focus:ring-primary rounded-xl" 
                          placeholder={t("users.note_placeholder")} 
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                       onClick={() => {
                          setWalletForm(prev => ({...prev, type: "CREDIT"}));
                          handleWalletAction();
                       }}
                       disabled={isWalletLoading}
                       className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-emerald-600/20" 
                    >
                       <Plus className="h-4 w-4" /> {isWalletLoading && walletForm.type === "CREDIT" ? t("users.processing") : t("users.credit")}
                    </Button>
                    <Button 
                       onClick={() => {
                          setWalletForm(prev => ({...prev, type: "DEBIT"}));
                          handleWalletAction();
                       }}
                       disabled={isWalletLoading}
                       variant="destructive"
                       className="h-12 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-destructive/20" 
                    >
                       <Minus className="h-4 w-4" /> {isWalletLoading && walletForm.type === "DEBIT" ? t("users.processing") : t("users.debit")}
                    </Button>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed italic text-center font-bold">
                    {t("users.audit_log_warning")}
                  </p>
                </div>
              </Card>

              {/* Referral Hub */}
              <Card className="border-none shadow-xl p-8 rounded-[2.5rem] space-y-6 border border-primary/5">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-indigo-500" />
                  </div>
                  {t("users.referral_network")}
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-2xl flex items-center justify-between border-2 border-dashed border-primary/20 group hover:border-primary/40 transition-colors">
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">{t("users.unique_referral_code")}</p>
                       <p className="text-lg font-black tracking-widest text-primary font-mono">{userDetails.referralCode}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground px-2 mb-2">{t("users.users_referred")} ({userDetails.referrals?.length || 0})</p>
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2 no-scrollbar">
                      {userDetails.referrals?.map((ref: any) => (
                        <div key={ref.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all">
                          <div className="flex flex-col">
                             <span className="text-xs font-black">{ref.name || t("users.ayur_user")}</span>
                             <span className="text-[9px] text-muted-foreground font-mono">{ref.phone}</span>
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground italic bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border">
                             {format(new Date(ref.createdAt), "MMM yy")}
                          </span>
                        </div>
                      ))}
                      {(!userDetails.referrals || userDetails.referrals.length === 0) && (
                        <div className="text-center py-6">
                           <p className="text-[11px] italic text-muted-foreground font-bold">{t("users.no_referrals")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
