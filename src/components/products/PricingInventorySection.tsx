import * as React from "react"
import { useTranslation } from "react-i18next"
import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PricingInventorySectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  discountType: string
  setDiscountType: React.Dispatch<React.SetStateAction<string>>
}

export function PricingInventorySection({
  formData,
  setFormData,
  discountType,
  setDiscountType
}: PricingInventorySectionProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-xl shadow-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <DollarSign className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-black italic">{t('add_product.sections.pricing.title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.mrp')} *</Label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-muted-foreground/50 font-black">₹</span>
            <Input 
              value={formData.mrp} 
              onChange={(e) => setFormData({...formData, mrp: e.target.value})}
              type="number" 
              placeholder="0.00" 
              className="h-12 pl-8 border-muted-foreground/10 text-lg font-black" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.selling_price')} *</Label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-muted-foreground/50 font-black">₹</span>
            <Input 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              type="number" 
              placeholder="0.00" 
              className="h-12 pl-8 border-muted-foreground/10 text-lg font-black" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.stock')}</Label>
          <Input 
            value={formData.stock} 
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            type="number" 
            placeholder="Enter Qty" 
            className="h-12 border-muted-foreground/10" 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.order_limit')}</Label>
          <Input 
            value={formData.totalAllowedQuantity} 
            onChange={(e) => setFormData({...formData, totalAllowedQuantity: e.target.value})}
            type="number" 
            placeholder={t('add_product.sections.pricing.unlimited')} 
            className="h-12 border-muted-foreground/10" 
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.rating')}</Label>
          <Input 
            type="number" 
            step="0.1" 
            max="5" 
            value={formData.rating} 
            onChange={(e) => setFormData({...formData, rating: e.target.value})}
            className="h-12 border-muted-foreground/10" 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.reviews')}</Label>
          <Input 
            type="number" 
            value={formData.reviewsCount} 
            onChange={(e) => setFormData({...formData, reviewsCount: e.target.value})}
            className="h-12 border-muted-foreground/10" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.discount_type')}</Label>
            <Select value={discountType} onValueChange={(val) => setDiscountType(val ?? "Percentage")}>
              <SelectTrigger className="h-12 border-muted-foreground/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">{t('add_product.sections.pricing.percentage')}</SelectItem>
                <SelectItem value="Flat">{t('add_product.sections.pricing.flat')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.discount_amount')}</Label>
            <div className="relative">
              {discountType === "Flat" && <span className="absolute left-3 top-3.5 text-muted-foreground/50 font-black">₹</span>}
              <Input type="number" placeholder="0" value={formData.discountAmount} onChange={(e) => setFormData({...formData, discountAmount: e.target.value})} className={cn("h-12 border-muted-foreground/10", discountType === "Flat" && "pl-8")} />
              {discountType === "Percentage" && <span className="absolute right-3 top-3.5 text-muted-foreground/50 font-black">%</span>}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.tax_amount')}</Label>
          <Input type="number" placeholder="18" value={formData.taxAmount} onChange={(e) => setFormData({...formData, taxAmount: e.target.value})} className="h-12 border-muted-foreground/10" />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.tax_type')}</Label>
          <Select value={formData.taxType} onValueChange={(val) => setFormData({...formData, taxType: val})}>
            <SelectTrigger className="h-12 border-muted-foreground/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inclusive">{t('add_product.sections.pricing.inclusive')}</SelectItem>
              <SelectItem value="exclusive">{t('add_product.sections.pricing.exclusive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.shipping')}</Label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-muted-foreground/50 font-black">₹</span>
            <Input type="number" placeholder="0" value={formData.shippingCost} onChange={(e) => setFormData({...formData, shippingCost: e.target.value})} className="h-12 pl-8 border-muted-foreground/10" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 col-span-1 md:col-span-3 mt-4 pt-6 border-t border-muted/50">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.weight')}</Label>
            <Input type="number" placeholder="Eg. 500" value={formData.shippingWeight} onChange={(e) => setFormData({...formData, shippingWeight: e.target.value})} className="h-12 border-muted-foreground/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.length')}</Label>
            <Input type="number" placeholder="Eg. 10" value={formData.shippingLength} onChange={(e) => setFormData({...formData, shippingLength: e.target.value})} className="h-12 border-muted-foreground/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.width')}</Label>
            <Input type="number" placeholder="Eg. 10" value={formData.shippingWidth} onChange={(e) => setFormData({...formData, shippingWidth: e.target.value})} className="h-12 border-muted-foreground/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.pricing.height')}</Label>
            <Input type="number" placeholder="Eg. 10" value={formData.shippingHeight} onChange={(e) => setFormData({...formData, shippingHeight: e.target.value})} className="h-12 border-muted-foreground/10" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
