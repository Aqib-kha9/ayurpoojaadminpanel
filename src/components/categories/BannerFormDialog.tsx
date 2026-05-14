import * as React from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Megaphone, CheckCircle2, Sparkles, Languages } from "lucide-react"
import { BANNER_COLORS } from "./category-utils"

interface MultilangValue {
  en: string
  hi: string
  te: string
}

interface BannerFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bannerTitle: MultilangValue
  setBannerTitle: (title: MultilangValue) => void
  bannerDiscount: MultilangValue
  setBannerDiscount: (discount: MultilangValue) => void
  bannerColor: string
  setBannerColor: (color: string) => void
  setBannerImage: (file: File | null) => void
  bannerLink: string
  setBannerLink: (link: string) => void
  bannerSaving: boolean
  handleSave: () => void
  handleTranslateAI: () => void
  isTranslating: boolean
}

export default function BannerFormDialog({
  isOpen,
  onOpenChange,
  bannerTitle,
  setBannerTitle,
  bannerDiscount,
  setBannerDiscount,
  bannerColor,
  setBannerColor,
  setBannerImage,
  bannerLink,
  setBannerLink,
  bannerSaving,
  handleSave,
  handleTranslateAI,
  isTranslating
}: BannerFormDialogProps) {
  const { t } = useTranslation()

  const updateTitle = (key: keyof MultilangValue, val: string) => {
    setBannerTitle({ ...bannerTitle, [key]: val })
  }

  const updateDiscount = (key: keyof MultilangValue, val: string) => {
    setBannerDiscount({ ...bannerDiscount, [key]: val })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-br from-rose-50 to-white p-6 pb-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-slate-800">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                  <Megaphone className="h-5 w-5" />
                </div>
                {t("categories.add_banner")}
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleTranslateAI}
                disabled={isTranslating || !bannerTitle.en.trim()}
                className="rounded-xl gap-2 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-semibold transition-all group"
              >
                {isTranslating ? (
                  <div className="h-4 w-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                )}
                {isTranslating ? t("categories.translating") : t("categories.translate_ai")}
              </Button>
            </div>
            <DialogDescription className="text-slate-500 mt-1">
              {t("categories.banners_desc")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {/* Section: Basic Info (English) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="h-3 w-3" /> {t("categories.eng_name")} <span className="text-rose-500">*</span>
              </Label>
              <Input 
                placeholder="Deepawali Sale" 
                value={bannerTitle.en} 
                onChange={e => updateTitle('en', e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("coupons.discount_label")} (EN) <span className="text-rose-500">*</span>
              </Label>
              <Input 
                placeholder="30% Off" 
                value={bannerDiscount.en} 
                onChange={e => updateDiscount('en', e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Section: Translations */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">
                  {t("categories.hindi")}
                </Label>
                <Input 
                  placeholder="दीपावली सेल" 
                  value={bannerTitle.hi} 
                  onChange={e => updateTitle('hi', e.target.value)}
                  className="rounded-xl bg-white/50 border-slate-200" 
                />
                <Input 
                  placeholder="30% की छूट" 
                  value={bannerDiscount.hi} 
                  onChange={e => updateDiscount('hi', e.target.value)}
                  className="rounded-xl bg-white/50 border-slate-200 text-xs" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">
                  {t("categories.telugu")}
                </Label>
                <Input 
                  placeholder="దీపావళి సేల్" 
                  value={bannerTitle.te} 
                  onChange={e => updateTitle('te', e.target.value)}
                  className="rounded-xl bg-white/50 border-slate-200" 
                />
                <Input 
                  placeholder="30% తగ్గింపు" 
                  value={bannerDiscount.te} 
                  onChange={e => updateDiscount('te', e.target.value)}
                  className="rounded-xl bg-white/50 border-slate-200 text-xs" 
                />
              </div>
            </div>
          </div>

          {/* Section: Media & Styles */}
          <div className="space-y-4 pt-2">
             <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="h-3 w-3" /> {t("categories.icon_thumb")} <span className="text-rose-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 transition-colors hover:border-rose-200 group/upload">
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="cursor-pointer text-xs" 
                  onChange={e => setBannerImage(e.target.files?.[0] || null)} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("coupons.type_label")}</Label>
              <div className="grid grid-cols-6 gap-2.5">
                {BANNER_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setBannerColor(c.value)}
                    title={c.name}
                    className={`h-10 rounded-xl border-2 transition-all relative overflow-hidden group/clr ${bannerColor === c.value ? "border-slate-800 scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"}`}
                    style={{ backgroundColor: c.preview }}
                  >
                    {bannerColor === c.value && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                        <CheckCircle2 className="h-5 w-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("categories.slug")} ({t("categories.optional")})</Label>
              <Input 
                placeholder="/products?category=staples" 
                value={bannerLink} 
                onChange={e => setBannerLink(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 p-6 pt-4 gap-3">
          <Button 
            variant="ghost" 
            className="rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors px-6" 
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={bannerSaving} 
            className="rounded-xl gap-2 bg-slate-900 hover:bg-black text-white px-8 h-11 shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            {bannerSaving ? (
              <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t("categories.saving")}</>
            ) : (
              <>{t("categories.add_banner")} ✨</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
