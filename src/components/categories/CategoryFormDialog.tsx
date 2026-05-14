import * as React from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Plus, 
  Pencil, 
  FolderOpen, 
  Layers, 
  Tag, 
  Sparkles, 
  ImageIcon 
} from "lucide-react"
import { LEVEL_LABELS, LEVEL_COLORS } from "./category-utils"

interface CategoryFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingId: string | null
  addingLevel: number
  parentName: string
  catName: { en: string; hi: string; te: string }
  setCatName: (name: { en: string; hi: string; te: string }) => void
  catSlug: string
  setCatSlug: (slug: string) => void
  setCatImage: (file: File | null) => void
  catSaving: boolean
  isTranslating: boolean
  onTranslateAI: () => void
  catImageUrl?: string | null
  handleSave: () => void
}

export default function CategoryFormDialog({
  isOpen,
  onOpenChange,
  editingId,
  addingLevel,
  parentName,
  catName,
  setCatName,
  catSlug,
  setCatSlug,
  setCatImage,
  catSaving,
  isTranslating,
  onTranslateAI,
  catImageUrl,
  handleSave
}: CategoryFormDialogProps) {
  const { t } = useTranslation()
  const [preview, setPreview] = React.useState<string | null>(null)

  // Handle local file preview
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setCatImage(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  // Cleanup preview URL
  React.useEffect(() => {
    if (!isOpen) setPreview(null)
  }, [isOpen])

  const levelLabels = [t("categories.l1_short"), t("categories.l2_short"), t("categories.l3_short")]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {editingId ? <Pencil className="h-5 w-5 text-violet-600" /> : 
             addingLevel === 0 ? <FolderOpen className="h-5 w-5 text-primary" /> :
             addingLevel === 1 ? <Layers className="h-5 w-5 text-violet-600" /> :
                                 <Tag className="h-5 w-5 text-violet-500" />}
            {editingId ? t("categories.edit_cat") : `${t("common.add")} ${levelLabels[Math.min(addingLevel, 2)]}`}
          </DialogTitle>
          {parentName && !editingId && (
            <DialogDescription className="flex items-center gap-1.5 mt-1">
              <span>{t("categories.add_under")}</span>
              <Badge variant="outline" className={`text-[10px] ${addingLevel === 1 ? LEVEL_COLORS[0] : LEVEL_COLORS[1]}`}>
                {parentName}
              </Badge>
            </DialogDescription>
          )}
          {(!parentName || editingId) && (
            <DialogDescription>
              {editingId ? t("categories.update_cat_desc") : t("categories.ai_hint")}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Level info callout */}
          <div className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5
            ${addingLevel === 0 ? "bg-primary/5 border-primary/20 text-primary" :
              addingLevel === 1 ? "bg-violet-50 border-violet-200 text-violet-700" :
                                  "bg-violet-50 border-violet-200 text-violet-700"}`}>
            <div className="shrink-0 mt-0.5">
              {addingLevel === 0 ? "🗂️" : addingLevel === 1 ? "📂" : "📄"}
            </div>
            <div>
              {addingLevel === 0 && t("categories.l1_label")}
              {addingLevel === 1 && t("categories.l2_label")}
              {addingLevel === 2 && t("categories.l3_label")}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>{t("categories.eng_name")} <span className="text-destructive">*</span></span>
                <button
                  type="button"
                  onClick={onTranslateAI}
                  disabled={isTranslating || !catName.en}
                  className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                >
                  {isTranslating ? 
                    <div className="h-2 w-2 border border-violet-600 border-t-transparent rounded-full animate-spin" /> : 
                    <Sparkles className="h-2.5 w-2.5" />
                  }
                  {t("categories.translate_ai")}
                </button>
              </Label>
              <Input
                placeholder={addingLevel === 0 ? "e.g. Groceries" : addingLevel === 1 ? "e.g. Staples" : "e.g. Atta & Flours"}
                value={catName.en}
                autoFocus
                onChange={e => {
                  const val = e.target.value
                  setCatName({ ...catName, en: val })
                  setCatSlug(val.toLowerCase().replace(/[\s&]+/g, "-").replace(/[^a-z0-9-]/g, ""))
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("categories.slug")} <span className="text-destructive">*</span></Label>
              <Input value={catSlug} placeholder="auto-generated" onChange={e => setCatSlug(e.target.value)} />
            </div>
          </div>

          {/* AI Translation */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { lang: "hi", label: t("categories.hindi") },
              { lang: "te", label: t("categories.telugu") }
            ].map(({ lang, label }) => (
              <div key={lang} className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  {label}
                  <Badge variant="secondary" className="text-[9px] gap-0.5 px-1.5 h-4"><Sparkles className="h-2 w-2" />AI</Badge>
                </Label>
                <Input
                  placeholder={t("categories.ai_hint")}
                  value={(catName as any)[lang]}
                  onChange={e => setCatName({ ...catName, [lang]: e.target.value })}
                />
              </div>
            ))}
          </div>

          {/* Image & Preview */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" /> 
              {catImageUrl ? t("categories.update_thumb") : t("categories.icon_thumb")} 
              {addingLevel > 0 && <span className="text-muted-foreground font-normal ml-1">{t("categories.optional")}</span>}
            </Label>
            
            <div className="flex items-center gap-4">
              {(preview || catImageUrl) && (
                <div className="relative h-14 w-14 rounded-xl overflow-hidden border bg-slate-50 flex items-center justify-center shrink-0">
                  <img 
                    src={preview || catImageUrl || ""} 
                    alt="Preview" 
                    className="h-full w-full object-cover" 
                  />
                  {preview && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Badge className="text-[8px] px-1 h-3 bg-primary">New</Badge>
                    </div>
                  )}
                </div>
              )}
              <Input 
                type="file" 
                accept="image/*" 
                className="cursor-pointer text-xs h-9 py-1 flex-1" 
                onChange={onFileChange} 
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          <Button onClick={handleSave} disabled={catSaving || isTranslating} className="rounded-xl gap-2 font-bold">
            {catSaving
              ? <><div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {t("categories.saving")}</>
              : <><Plus className="h-3.5 w-3.5" /> {editingId ? t("categories.update_cat") : t("categories.save_cat")}</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
