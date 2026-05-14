import * as React from "react"
import { useTranslation } from "react-i18next"
import { Leaf, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FmctDetailsSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  translatingField: string | null
  handleTranslateFieldAI: (fieldName: string, text: string, context: string) => void
}

export function FmctDetailsSection({
  formData,
  setFormData,
  translatingField,
  handleTranslateFieldAI
}: FmctDetailsSectionProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-xl shadow-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
            <Leaf className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-black italic">{t('add_product.sections.fmcg.title')}</CardTitle>
        </div>
        <CardDescription>{t('add_product.sections.fmcg.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.dietary')}</Label>
            <Select value={formData.metadata.dietaryPreference} onValueChange={(val) => setFormData({...formData, metadata: {...formData.metadata, dietaryPreference: val}})}>
              <SelectTrigger className="h-12 border-muted-foreground/10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">{t('add_product.sections.fmcg.veg')}</SelectItem>
                <SelectItem value="non-veg">{t('add_product.sections.fmcg.non_veg')}</SelectItem>
                <SelectItem value="egg">{t('add_product.sections.fmcg.egg')}</SelectItem>
                <SelectItem value="vegan">{t('add_product.sections.fmcg.vegan')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.shelf_life')} (EN)</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTranslateFieldAI('shelfLife', (formData.metadata.shelfLife as any).en, 'FMCG shelf life')} 
                disabled={translatingField === 'shelfLife'} 
                className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
              >
                {translatingField === 'shelfLife' ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-2.5 w-2.5" />}
                {t('add_product.buttons.auto_translate')}
              </Button>
            </div>
            <Input 
              value={(formData.metadata.shelfLife as any).en}
              onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, shelfLife: {...(formData.metadata.shelfLife as any), en: e.target.value}}})}
              placeholder={t('add_product.sections.fmcg.placeholder_shelf')} 
              className="h-12 border-muted-foreground/10" 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input value={(formData.metadata.shelfLife as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, shelfLife: {...(formData.metadata.shelfLife as any), hi: e.target.value}}})} placeholder="HI" className="h-9 text-xs bg-muted/20" />
              <Input value={(formData.metadata.shelfLife as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, shelfLife: {...(formData.metadata.shelfLife as any), te: e.target.value}}})} placeholder="TE" className="h-9 text-xs bg-muted/20" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.ingredients')} (EN)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleTranslateFieldAI('ingredients', (formData.metadata.ingredients as any).en, 'FMCG product ingredients list')} 
              disabled={translatingField === 'ingredients'} 
              className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
            >
              {translatingField === 'ingredients' ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-2.5 w-2.5" />}
              {t('add_product.buttons.auto_translate')}
            </Button>
          </div>
          <Textarea 
            value={(formData.metadata.ingredients as any).en}
            onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, ingredients: {...(formData.metadata.ingredients as any), en: e.target.value}}})}
            placeholder={t('add_product.sections.fmcg.placeholder_ingredients')} 
            className="min-h-[80px] border-muted-foreground/10" 
          />
          <div className="grid grid-cols-2 gap-4">
              <Textarea value={(formData.metadata.ingredients as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, ingredients: {...(formData.metadata.ingredients as any), hi: e.target.value}}})} placeholder="सामग्री (हिंदी)" className="min-h-[60px] text-xs bg-muted/20" />
              <Textarea value={(formData.metadata.ingredients as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, ingredients: {...(formData.metadata.ingredients as any), te: e.target.value}}})} placeholder="పదార్థాలు (తెలుగు)" className="min-h-[60px] text-xs bg-muted/20" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.allergens')} (EN)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleTranslateFieldAI('allergyInfo', (formData.metadata.allergyInfo as any).en, 'FMCG allergen warning text')} 
              disabled={translatingField === 'allergyInfo'} 
              className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
            >
              {translatingField === 'allergyInfo' ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-2.5 w-2.5" />}
              {t('add_product.buttons.auto_translate')}
            </Button>
          </div>
          <Input 
            value={(formData.metadata.allergyInfo as any).en}
            onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, allergyInfo: {...(formData.metadata.allergyInfo as any), en: e.target.value}}})}
            placeholder={t('add_product.sections.fmcg.placeholder_allergens')} 
            className="h-12 border-muted-foreground/10" 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input value={(formData.metadata.allergyInfo as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, allergyInfo: {...(formData.metadata.allergyInfo as any), hi: e.target.value}}})} placeholder="HI" className="h-9 text-xs bg-muted/20" />
            <Input value={(formData.metadata.allergyInfo as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, allergyInfo: {...(formData.metadata.allergyInfo as any), te: e.target.value}}})} placeholder="TE" className="h-9 text-xs bg-muted/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.hsn')}</Label>
              <Input 
                value={formData.metadata.hsnCode}
                onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, hsnCode: e.target.value}})}
                placeholder="Ex: 210690" 
                className="h-12 border-muted-foreground/10 font-mono tracking-tighter" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.barcode')}</Label>
              <Input 
                value={formData.metadata.barcode}
                onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, barcode: e.target.value}})}
                placeholder="UPC/EAN" 
                className="h-12 border-muted-foreground/10 font-mono tracking-tighter" 
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.packaging')} (EN)</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleTranslateFieldAI('packType', (formData.metadata.packType as any).en, 'FMCG pack type')} 
                  disabled={translatingField === 'packType'} 
                  className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
                >
                  {translatingField === 'packType' ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-2.5 w-2.5" />}
                  {t('add_product.buttons.auto_translate')}
                </Button>
              </div>
              <Input 
                value={(formData.metadata.packType as any).en}
                onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, packType: {...(formData.metadata.packType as any), en: e.target.value}}})}
                placeholder={t('add_product.sections.fmcg.placeholder_packaging')} 
                className="h-12 border-muted-foreground/10" 
              />
              <div className="grid grid-cols-2 gap-2">
                <Input value={(formData.metadata.packType as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, packType: {...(formData.metadata.packType as any), hi: e.target.value}}})} placeholder="HI" className="h-9 text-xs bg-muted/20" />
                <Input value={(formData.metadata.packType as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, packType: {...(formData.metadata.packType as any), te: e.target.value}}})} placeholder="TE" className="h-9 text-xs bg-muted/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.fmcg.pack_of')}</Label>
              <Input 
                type="number"
                value={formData.metadata.packOf}
                onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, packOf: e.target.value}})}
                placeholder="Ex: 1" 
                className="h-12 border-muted-foreground/10" 
              />
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
