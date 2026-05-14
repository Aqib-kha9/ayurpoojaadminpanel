
import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Plus, 
  Trash2, 
  Calendar,
  Ticket,
  Users,
  Loader2,
  AlertCircle
} from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function CouponsPage() {
  const { t } = useTranslation()
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discount: "",
    expiry: "",
    usageLimit: ""
  })

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/coupons")
      setCoupons(res.data.data.coupons)
    } catch (error) {
      toast.error("Failed to fetch coupons")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await api.post("/coupons", formData)
      toast.success(t("coupons.success_create") || "Coupon created successfully")
      setIsModalOpen(false)
      setFormData({ code: "", discountType: "PERCENTAGE", discount: "", expiry: "", usageLimit: "" })
      fetchCoupons()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create coupon")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm(t("coupons.delete_confirm") || "Are you sure?")) return
    try {
      await api.delete(`/coupons/${id}`)
      toast.success(t("coupons.success_delete") || "Coupon deleted")
      fetchCoupons()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/coupons/${id}`, { isActive: !currentStatus })
      toast.success(t("coupons.success_toggle") || "Status updated")
      fetchCoupons()
    } catch (error) {
      toast.error("Toggle failed")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("common.coupons")}</h1>
          <p className="text-muted-foreground">{t("coupons.subtitle")}</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger>
            <Button className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-8 px-4 text-primary-foreground">
              <Plus className="h-4 w-4" /> {t("coupons.create_coupon")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                {t("coupons.create_coupon")}
              </DialogTitle>
              <DialogDescription>
                Set up a new discount code for your customers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCoupon} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("coupons.code_label") || "Coupon Code"}</Label>
                <Input 
                  placeholder="EX: AYURPOOJA50" 
                  className="font-mono uppercase"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("coupons.discount_type") || "Discount Type"}</Label>
                  <Select 
                    value={formData.discountType}
                    onValueChange={v => setFormData({...formData, discountType: v ?? "PERCENTAGE"})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FLAT">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("coupons.discount_value") || "Value"}</Label>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("coupons.expiry_date") || "Expiry Date"}</Label>
                  <Input 
                    type="date" 
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("coupons.usage_limit") || "Usage Limit"}</Label>
                  <Input 
                    type="number" 
                    placeholder={t("coupons.unlimited") || "Unlimited"}
                    value={formData.usageLimit}
                    onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t("coupons.save_coupon") || "Save Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <Ticket className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold">{t("common.no_data")}</h3>
          <p className="text-muted-foreground">Start by creating your first promotional code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className={`border-none shadow-lg relative overflow-hidden group transition-all hover:shadow-xl ${!coupon.isActive ? "opacity-70 grayscale-[0.5]" : ""}`}>
              <div className={`absolute top-0 left-0 w-2 h-full ${coupon.isActive ? "bg-primary" : "bg-muted-foreground"}`} />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={coupon.isActive ? "default" : "secondary"}>
                    {coupon.isActive ? t("common.active") : t("common.inactive")}
                  </Badge>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Switch 
                      checked={coupon.isActive} 
                      onCheckedChange={() => handleToggleStatus(coupon.id, coupon.isActive)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl font-mono text-primary flex items-center gap-2">
                  <Ticket className="h-5 w-5" /> {coupon.code}
                </CardTitle>
                <CardDescription className="text-lg font-bold text-foreground">
                  {coupon.discountType === "PERCENTAGE" ? `${coupon.discount}% Off` : `₹${coupon.discount} Off`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-black flex items-center gap-1 tracking-wider">
                      <Calendar className="h-3 w-3" /> {t("coupons.expiry")}
                    </span>
                    <p className="text-sm font-bold">{new Date(coupon.expiry).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-black flex items-center gap-1 tracking-wider">
                      <Users className="h-3 w-3" /> {t("coupons.usage")}
                    </span>
                    <p className="text-sm font-bold">{coupon.usedCount} / {coupon.usageLimit || "∞"}</p>
                  </div>
                </div>
                {coupon.usageLimit && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${coupon.isActive ? "bg-primary" : "bg-muted-foreground"}`} 
                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="pt-2 flex items-center gap-2 p-2 bg-muted/50 rounded-xl">
                  <AlertCircle className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">
                    {coupon.discountType === "PERCENTAGE" ? "Percentage Discount" : "Flat Amount Discount"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
