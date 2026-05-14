import * as React from "react"
import { useTranslation } from "react-i18next"
import { Tag, Plus, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrganizationSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  dbCategories: any[]
  product: any
  handleTranslateFieldAI?: (fieldName: string, text: string, context: string) => Promise<void>
  isLoadingCats?: boolean
}

export function OrganizationSection({
  formData,
  setFormData,
  dbCategories,
  product,
  handleTranslateFieldAI,
  isLoadingCats
}: OrganizationSectionProps) {
  const { t } = useTranslation()

  // Derived category lists based on hierarchy
  const l1Categories = dbCategories || [];
  const selectedL1 = l1Categories.find((c: any) => c.id === formData.l1CategoryId);
  const l2Categories = selectedL1?.children || [];
  const selectedL2 = l2Categories.find((c: any) => c.id === formData.l2CategoryId);
  const l3Categories = selectedL2?.children || [];
  const selectedL3 = l3Categories.find((c: any) => c.id === formData.l3CategoryId);

  const handleL1Change = (val: string) => {
    setFormData({
      ...formData,
      l1CategoryId: val,
      l2CategoryId: "",
      l3CategoryId: "",
      categoryId: val
    });
  };

  const handleL2Change = (val: string) => {
    setFormData({
      ...formData,
      l2CategoryId: val,
      l3CategoryId: "",
      categoryId: val
    });
  };

  const handleL3Change = (val: string) => {
    setFormData({
      ...formData,
      l3CategoryId: val,
      categoryId: val
    });
  };

  return (
    <Card className="border-none shadow-xl shadow-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Tag className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-black italic">{t('add_product.sections.organization.title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 overflow-hidden">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.organization.category_l1')} *</Label>
          <Select onValueChange={(val) => handleL1Change(val ?? "")} value={formData.l1CategoryId || ""}>
            <SelectTrigger className="h-12 border-muted-foreground/10 w-full overflow-hidden">
              <span className="truncate">
                {selectedL1 ? (typeof selectedL1.name === 'string' ? selectedL1.name : (selectedL1.name as any).en || "Unnamed") : <SelectValue placeholder={isLoadingCats ? "Loading..." : t('add_product.sections.organization.select_category')} />}
              </span>
            </SelectTrigger>
            <SelectContent>
              {isLoadingCats ? (
                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
              ) : l1Categories.length > 0 ? (
                l1Categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>{typeof cat.name === 'string' ? cat.name : (cat.name as any).en || "Unnamed"}</SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>No categories found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 overflow-hidden">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.organization.category_l2')}</Label>
          <Select 
            onValueChange={(val) => handleL2Change(val ?? "")} 
            value={formData.l2CategoryId || ""}
            disabled={!formData.l1CategoryId || l2Categories.length === 0}
          >
            <SelectTrigger className="h-12 border-muted-foreground/10 w-full overflow-hidden">
              <span className="truncate">
                {selectedL2 ? (typeof selectedL2.name === 'string' ? selectedL2.name : (selectedL2.name as any).en || "Unnamed") : <SelectValue placeholder={!formData.l1CategoryId ? t('add_product.sections.organization.choose_l1') : l2Categories.length === 0 ? t('add_product.sections.organization.no_subs') : t('add_product.sections.organization.select_category')} />}
              </span>
            </SelectTrigger>
            <SelectContent>
              {l2Categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{typeof cat.name === 'string' ? cat.name : (cat.name as any).en || "Unnamed"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 overflow-hidden">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.organization.category_l3')}</Label>
          <Select 
            onValueChange={(val) => handleL3Change(val ?? "")} 
            value={formData.l3CategoryId || ""}
            disabled={!formData.l2CategoryId || l3Categories.length === 0}
          >
            <SelectTrigger className="h-12 border-muted-foreground/10 w-full overflow-hidden">
              <span className="truncate">
                {selectedL3 ? (typeof selectedL3.name === 'string' ? selectedL3.name : (selectedL3.name as any).en || "Unnamed") : <SelectValue placeholder={!formData.l2CategoryId ? t('add_product.sections.organization.choose_l1') : l3Categories.length === 0 ? t('add_product.sections.organization.no_subs') : t('add_product.sections.organization.select_category')} />}
              </span>
            </SelectTrigger>
            <SelectContent>
              {l3Categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{typeof cat.name === 'string' ? cat.name : (cat.name as any).en || "Unnamed"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.organization.brand')} (EN)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => (handleTranslateFieldAI as any)('brand', (formData.brand as any).en, 'FMCG brand name, ALWAYS TRANSLITERATE to regional scripts (write exactly how it sounds in Hindi and Telugu)')} 
              className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
            >
              <Sparkles className="h-2.5 w-2.5" /> {t('add_product.buttons.auto_translate')}
            </Button>
          </div>
          <Input 
            value={(formData.brand as any).en} 
            onChange={(e) => setFormData({...formData, brand: {...(formData.brand as any), en: e.target.value}})}
            placeholder={t('add_product.sections.organization.placeholder_brand')} 
            className="h-12 border-muted-foreground/10" 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input value={(formData.brand as any).hi} onChange={(e) => setFormData({...formData, brand: {...(formData.brand as any), hi: e.target.value}})} placeholder="Hindi" className="h-9 text-xs bg-muted/20" />
            <Input value={(formData.brand as any).te} onChange={(e) => setFormData({...formData, brand: {...(formData.brand as any), te: e.target.value}})} placeholder="Telugu" className="h-9 text-xs bg-muted/20" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.organization.type')}</Label>
          <Select defaultValue="physical">
            <SelectTrigger className="h-12 border-muted-foreground/10">
              <SelectValue placeholder={t('add_product.sections.organization.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical">Physical Product</SelectItem>
              <SelectItem value="digital">Digital Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.organization.unit')}</Label>
          <Select 
            value={formData.unit} 
            onValueChange={(val) => setFormData({...formData, unit: val ?? ""})}
          >
             <SelectTrigger className="h-12 border-muted-foreground/10">
                <SelectValue placeholder={t('add_product.sections.organization.unit')} />
             </SelectTrigger>
             <SelectContent>
                <SelectItem value="kg">kg (Kilogram)</SelectItem>
                <SelectItem value="g">g (Gram)</SelectItem>
                <SelectItem value="pc">pc (Piece)</SelectItem>
                <SelectItem value="l">l (Litre)</SelectItem>
                <SelectItem value="ml">ml (Millilitre)</SelectItem>
             </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.sku')}</Label>
          <div className="flex gap-2">
            <Input 
              value={formData.sku} 
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              placeholder="Ayur Pooja-001" 
              className="h-12 border-muted-foreground/10 font-mono tracking-tighter" 
            />
            <Button variant="outline" className="h-12 px-3 border-muted-foreground/10 group hover:bg-primary/10">
              <Plus className="h-4 w-4 group-active:rotate-90 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
