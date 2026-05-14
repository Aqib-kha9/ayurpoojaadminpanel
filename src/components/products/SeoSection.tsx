import * as React from "react"
import { useTranslation } from "react-i18next"
import { Globe, ImageIcon, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SeoSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleTranslateFieldAI?: (fieldName: string, text: string, context: string) => Promise<void>
}

export function SeoSection({ formData, setFormData, handleTranslateFieldAI }: SeoSectionProps) {
  const { t } = useTranslation()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(formData?.metadata?.seoImage || null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, seoImage: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
      <div className="bg-muted/10 p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <Globe className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-black italic">{t('add_product.sections.seo.title')}</CardTitle>
        </div>
        <CardDescription>{t('add_product.sections.seo.desc')}</CardDescription>
      </div>
      <CardContent className="p-8 pt-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.seo.meta_title')} (EN)</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => (handleTranslateFieldAI as any)('seoTitle', (formData.metadata.seoTitle as any).en, 'SEO Title')} 
                className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
              >
                <Sparkles className="h-2.5 w-2.5" /> {t('add_product.buttons.auto_translate')}
              </Button>
            </div>
            <Input 
              value={(formData.metadata.seoTitle as any).en} 
              onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, seoTitle: {...(formData.metadata.seoTitle as any), en: e.target.value}}})}
              placeholder="Meta Title (English)" 
              className="h-12 border-muted-foreground/10" 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input value={(formData.metadata.seoTitle as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, seoTitle: {...(formData.metadata.seoTitle as any), hi: e.target.value}}})} placeholder="Hindi" className="h-9 text-xs bg-muted/20" />
              <Input value={(formData.metadata.seoTitle as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, seoTitle: {...(formData.metadata.seoTitle as any), te: e.target.value}}})} placeholder="Telugu" className="h-9 text-xs bg-muted/20" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.seo.meta_desc')} (EN)</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => (handleTranslateFieldAI as any)('seoDesc', (formData.metadata.seoDesc as any).en, 'SEO Description')} 
                className="h-5 text-primary p-0 gap-1 font-black text-[8px] uppercase"
              >
                <Sparkles className="h-2.5 w-2.5" /> {t('add_product.buttons.auto_translate')}
              </Button>
            </div>
            <Textarea 
              value={(formData.metadata.seoDesc as any).en} 
              onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, seoDesc: {...(formData.metadata.seoDesc as any), en: e.target.value}}})}
              placeholder={t('add_product.sections.seo.placeholder_desc')} 
              className="min-h-[80px] border-muted-foreground/10" 
            />
            <div className="grid grid-cols-2 gap-4">
              <Textarea value={(formData.metadata.seoDesc as any).hi} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, seoDesc: {...(formData.metadata.seoDesc as any), hi: e.target.value}}})} placeholder="Hindi Description" className="min-h-[60px] text-xs bg-muted/20" />
              <Textarea value={(formData.metadata.seoDesc as any).te} onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, seoDesc: {...(formData.metadata.seoDesc as any), te: e.target.value}}})} placeholder="Telugu Description" className="min-h-[60px] text-xs bg-muted/20" />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.seo.meta_image')}</Label>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <div 
              onClick={handleUploadClick}
              className="group relative h-48 rounded-2xl border-2 border-dashed border-muted-foreground/10 bg-muted/5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
            >
              {preview || (typeof formData.metadata?.seoImage === 'string' && formData.metadata.seoImage) ? (
                <img src={preview || formData.metadata.seoImage} className="w-full h-full object-cover" alt="SEO Preview" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                    <ImageIcon className="h-6 w-6 text-primary/40" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary/60 transition-colors">{t('add_product.sections.seo.click_upload')}</span>
                  <p className="text-[8px] text-muted-foreground/30 mt-2">Recommended: 1200 x 630 px</p>
                </>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-muted-foreground/5" />

        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('add_product.sections.seo.indexing')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "Index", key: "index" },
              { label: "No Index", key: "noindex" },
              { label: "No Follow", key: "nofollow" },
              { label: "No Archive", key: "noarchive" },
              { label: "No Snippet", key: "nosnippet" },
              { label: "No Image Index", key: "noimageindex" },
            ].map((idx) => (
              <div key={idx.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-muted-foreground/5">
                <Label className="text-xs font-bold">{idx.label}</Label>
                <Switch 
                  checked={formData.metadata[idx.key]} 
                  onCheckedChange={(val) => setFormData({...formData, metadata: {...formData.metadata, [idx.key]: val}})}
                  className="scale-75" 
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.seo.max_snippet')}</Label>
              <Input 
                type="number" 
                value={formData.metadata.maxSnippet} 
                onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, maxSnippet: e.target.value}})}
                className="h-12 border-muted-foreground/10" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.seo.max_video')}</Label>
              <Input 
                type="number" 
                value={formData.metadata.maxVideoPreview} 
                onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, maxVideoPreview: e.target.value}})}
                className="h-12 border-muted-foreground/10" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">{t('add_product.sections.seo.max_image')}</Label>
              <Select 
                value={formData.metadata.maxImagePreview} 
                onValueChange={(val) => setFormData({...formData, metadata: {...formData.metadata, maxImagePreview: val}})}
              >
                 <SelectTrigger className="h-12 border-muted-foreground/10">
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                 </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
