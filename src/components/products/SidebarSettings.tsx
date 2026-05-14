import * as React from "react"
import { useTranslation } from "react-i18next"
import { Settings2, Info, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SidebarSettingsProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleTranslateFieldAI?: (fieldName: string, text: string, context: string) => Promise<void>
}

export function SidebarSettings({ formData, setFormData, handleTranslateFieldAI }: SidebarSettingsProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-xl shadow-primary/5 sticky top-32">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Settings2 className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-black italic">{t('add_product.sections.sidebar.settings')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.sidebar.manufacturer')} (EN)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => (handleTranslateFieldAI as any)('manufacturer', (formData.metadata.manufacturer as any).en, 'manufacturer name')} 
              className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
            >
              <Sparkles className="h-2.5 w-2.5" /> {t('add_product.buttons.auto_translate')}
            </Button>
          </div>
          <Input 
            placeholder="Enter Manufacturer Name" 
            value={(formData.metadata.manufacturer as any).en} 
            onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, manufacturer: {...(formData.metadata.manufacturer as any), en: e.target.value}}})} 
            className="h-11 border-muted-foreground/10" 
          />
          <div className="grid grid-cols-2 gap-2">
            <Input value={(formData.metadata.manufacturer as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, manufacturer: {...(formData.metadata.manufacturer as any), hi: e.target.value}}})} placeholder="HI" className="h-8 text-[10px] bg-muted/20" />
            <Input value={(formData.metadata.manufacturer as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, manufacturer: {...(formData.metadata.manufacturer as any), te: e.target.value}}})} placeholder="TE" className="h-8 text-[10px] bg-muted/20" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.sidebar.made_in')} (EN)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => (handleTranslateFieldAI as any)('madeIn', (formData.metadata.madeIn as any).en, 'country name')} 
              className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
            >
              <Sparkles className="h-2.5 w-2.5" /> {t('add_product.buttons.auto_translate')}
            </Button>
          </div>
          <Input 
            placeholder="Ex: India" 
            value={(formData.metadata.madeIn as any).en} 
            onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, madeIn: {...(formData.metadata.madeIn as any), en: e.target.value}}})} 
            className="h-11 border-muted-foreground/10" 
          />
          <div className="grid grid-cols-2 gap-2">
            <Input value={(formData.metadata.madeIn as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, madeIn: {...(formData.metadata.madeIn as any), hi: e.target.value}}})} placeholder="HI" className="h-8 text-[10px] bg-muted/20" />
            <Input value={(formData.metadata.madeIn as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, madeIn: {...(formData.metadata.madeIn as any), te: e.target.value}}})} placeholder="TE" className="h-8 text-[10px] bg-muted/20" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.sidebar.fssai')}</Label>
          <Input 
            placeholder="Registration Number" 
            value={formData.metadata.fssai} 
            onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, fssai: e.target.value}})} 
            className="h-11 border-muted-foreground/10 font-mono" 
          />
        </div>

        <Separator className="bg-muted-foreground/5" />

        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">{t('add_product.sections.sidebar.returnable')}</Label>
              <p className="text-[10px] text-muted-foreground font-medium">{t('add_product.sections.sidebar.returnable_desc')}</p>
            </div>
            <Switch checked={formData.isReturnable} onCheckedChange={(val) => setFormData({...formData, isReturnable: val})} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">{t('add_product.sections.sidebar.cod')}</Label>
              <p className="text-[10px] text-muted-foreground font-medium">{t('add_product.sections.sidebar.cod_desc')}</p>
            </div>
            <Switch checked={formData.isCodAllowed} onCheckedChange={(val) => setFormData({...formData, isCodAllowed: val})} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">{t('add_product.sections.sidebar.cancelable')}</Label>
              <p className="text-[10px] text-muted-foreground font-medium">{t('add_product.sections.sidebar.cancelable_desc')}</p>
            </div>
            <Switch checked={formData.isCancelable} onCheckedChange={(val) => setFormData({...formData, isCancelable: val})} />
          </div>
        </div>

        <Separator className="bg-muted-foreground/5" />

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.sidebar.order_limit_label')}</Label>
          <div className="flex items-center gap-4">
             <Input 
              type="number" 
              value={formData.totalAllowedQuantity} 
              onChange={(e) => setFormData({...formData, totalAllowedQuantity: e.target.value})}
              className="h-11 border-muted-foreground/10" 
             />
             <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none font-bold whitespace-nowrap">{t('add_product.sections.sidebar.unlimited_badge')}</Badge>
          </div>
        </div>

        <div className="pt-4">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
              {t('add_product.sections.sidebar.legal_info')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
