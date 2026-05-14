import * as React from "react"
import { useTranslation } from "react-i18next"
import { Package, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { quillModules, quillFormats } from "./quill-config"

interface BasicInfoSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  isTranslatingName: boolean
  isTranslatingDesc: boolean
  translatingField: string | null
  handleTranslateNameAI: () => void
  handleTranslateDescriptionAI: () => void
  handleTranslateFieldAI: (fieldName: string, text: string, context: string) => void
}

export function BasicInfoSection({
  formData,
  setFormData,
  isTranslatingName,
  isTranslatingDesc,
  translatingField,
  handleTranslateNameAI,
  handleTranslateDescriptionAI,
  handleTranslateFieldAI
}: BasicInfoSectionProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden group">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-purple-600 rounded-t-full" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Package className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-black italic">{t('add_product.sections.basic.title')}</CardTitle>
        </div>
        <CardDescription>{t('add_product.sections.basic.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name_en" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.name')} (English) *</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleTranslateNameAI} 
                disabled={isTranslatingName} 
                className="h-6 text-primary hover:bg-primary/5 gap-1.5 font-black text-[9px] uppercase tracking-wider"
              >
                {isTranslatingName ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-3 w-3" />}
                {t('add_product.buttons.auto_translate')}
              </Button>
            </div>
            <Input 
              id="name_en" 
              value={formData.name.en} 
              onChange={(e) => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
              placeholder={t('add_product.sections.basic.placeholder_name')} 
              className="h-12 border-muted-foreground/10 focus:border-primary/30 transition-all text-base font-medium" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_hi" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.name')} (Hindi)</Label>
            <Input 
              id="name_hi" 
              value={formData.name.hi} 
              onChange={(e) => setFormData({...formData, name: {...formData.name, hi: e.target.value}})}
              placeholder="नाम (हिंदी)" 
              className="h-12 border-muted-foreground/10 focus:border-primary/30 transition-all text-base font-medium" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_te" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.name')} (Telugu)</Label>
            <Input 
              id="name_te" 
              value={formData.name.te} 
              onChange={(e) => setFormData({...formData, name: {...formData.name, te: e.target.value}})}
              placeholder="పేరు (తెలుగు)" 
              className="h-12 border-muted-foreground/10 focus:border-primary/30 transition-all text-base font-medium" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.sku')} *</Label>
          <Input 
            id="sku" 
            value={formData.sku} 
            onChange={(e) => setFormData({...formData, sku: e.target.value})}
            placeholder="AP-CHIPS-001" 
            className="h-12 border-muted-foreground/10" 
          />
        </div>

        <div className="space-y-4">
          <style>{`
            .quill-editor .ql-toolbar {
              border-top-left-radius: 12px;
              border-top-right-radius: 12px;
              border-color: rgba(0,0,0,0.05);
              background: rgba(0,0,0,0.02);
            }
            .quill-editor .ql-container {
              border-bottom-left-radius: 12px;
              border-bottom-right-radius: 12px;
              border-color: rgba(0,0,0,0.05);
              min-height: 150px;
              font-family: inherit;
            }
            .quill-editor .ql-editor {
              min-height: 150px;
              font-size: 0.95rem;
              line-height: 1.6;
            }
            .dark .quill-editor .ql-toolbar {
              border-color: rgba(255,255,255,0.1);
              background: rgba(255,255,255,0.05);
            }
            .dark .quill-editor .ql-container {
              border-color: rgba(255,255,255,0.1);
            }
            .dark .ql-snow .ql-stroke { stroke: #fff; }
            .dark .ql-snow .ql-fill { fill: #fff; }
            .dark .ql-snow .ql-picker { color: #fff; }
          `}</style>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description_en" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.description')} (English)</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleTranslateDescriptionAI} 
                disabled={isTranslatingDesc} 
                className="h-6 text-primary hover:bg-primary/5 gap-1.5 font-black text-[9px] uppercase tracking-wider"
              >
                {isTranslatingDesc ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-3 w-3" />}
                {t('add_product.buttons.auto_translate')}
              </Button>
            </div>
            <ReactQuill 
              theme="snow"
              value={formData.description.en}
              onChange={(content) => setFormData({...formData, description: {...formData.description, en: content}})}
              modules={quillModules}
              formats={quillFormats}
              className="quill-editor bg-background"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description_hi" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.description')} (Hindi)</Label>
              <ReactQuill 
                theme="snow"
                value={formData.description.hi || ""}
                onChange={(content) => setFormData({...formData, description: {...formData.description, hi: content}})}
                modules={quillModules}
                formats={quillFormats}
                className="quill-editor bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_te" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.description')} (Telugu)</Label>
              <ReactQuill 
                theme="snow"
                value={formData.description.te || ""}
                onChange={(content) => setFormData({...formData, description: {...formData.description, te: content}})}
                modules={quillModules}
                formats={quillFormats}
                className="quill-editor bg-background"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="badge_en" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.badge')} (English)</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTranslateFieldAI('badge', formData.badge.en, 'short ecommerce feature badge')} 
                disabled={translatingField === 'badge'} 
                className="h-6 text-primary hover:bg-primary/5 gap-1.5 font-black text-[9px] uppercase tracking-wider"
              >
                {translatingField === 'badge' ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-3 w-3" />}
                {t('add_product.buttons.auto_translate')}
              </Button>
            </div>
            <Input 
              id="badge_en" 
              value={formData.badge.en}
              onChange={(e) => setFormData({...formData, badge: {...formData.badge, en: e.target.value}})}
              placeholder={t('add_product.sections.basic.placeholder_badge')} 
              className="h-12 border-muted-foreground/10" 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={formData.badge.hi}
                onChange={(e) => setFormData({...formData, badge: {...formData.badge, hi: e.target.value}})}
                placeholder="नाम (हिंदी)" 
                className="h-10 border-muted-foreground/5 text-sm bg-muted/20" 
              />
              <Input 
                value={formData.badge.te}
                onChange={(e) => setFormData({...formData, badge: {...formData.badge, te: e.target.value}})}
                placeholder="పేరు (తెలుగు)" 
                className="h-10 border-muted-foreground/5 text-sm bg-muted/20" 
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tags_en" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('add_product.sections.basic.tags')}</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTranslateFieldAI('tags', formData.tags.en, 'comma separated search tags')} 
                disabled={translatingField === 'tags'} 
                className="h-6 text-primary hover:bg-primary/5 gap-1.5 font-black text-[9px] uppercase tracking-wider"
              >
                {translatingField === 'tags' ? <div className="animate-spin h-2 w-2 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-3 w-3" />}
                {t('add_product.buttons.auto_translate')}
              </Button>
            </div>
            <Input 
              id="tags_en" 
              value={formData.tags.en}
              onChange={(e) => setFormData({...formData, tags: {...formData.tags, en: e.target.value}})}
              placeholder={t('add_product.sections.basic.placeholder_tags')} 
              className="h-12 border-muted-foreground/10" 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={formData.tags.hi}
                onChange={(e) => setFormData({...formData, tags: {...formData.tags, hi: e.target.value}})}
                placeholder="Tags (हिंदी)" 
                className="h-10 border-muted-foreground/5 text-sm bg-muted/20" 
              />
              <Input 
                value={formData.tags.te}
                onChange={(e) => setFormData({...formData, tags: {...formData.tags, te: e.target.value}})}
                placeholder="Tags (తెలుగు)" 
                className="h-10 border-muted-foreground/5 text-sm bg-muted/20" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
