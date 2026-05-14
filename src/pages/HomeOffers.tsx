import * as React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Trash2,
  Pencil,
  Smartphone,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ImageIcon,
  Zap
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

// Reusing Utilities from Categories
import { BANNER_COLORS, Toast } from "@/components/categories/category-utils"
import DeleteConfirmDialog from "@/components/categories/DeleteConfirmDialog"

export default function HomeOffersPage() {
  const { t, i18n } = useTranslation()
  const [offers, setOffers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  // UI States
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null)
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }

  // Offer Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"en" | "hi" | "te">("en")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [title, setTitle] = React.useState({ en: "", hi: "", te: "" })
  const [subtitle, setSubtitle] = React.useState({ en: "", hi: "", te: "" })
  const [link, setLink] = React.useState("")
  const [color, setColor] = React.useState(BANNER_COLORS[2].value) // Default to Sky
  const [image, setImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [isActive, setIsActive] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isTranslating, setIsTranslating] = React.useState(false)

  // Delete State
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; label: string } | null>(null)

  const fetchOffers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/home-offers")
      setOffers(response.data.data.offers)
    } catch (error) {
      showToast("Failed to fetch offers", "error")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchOffers()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const openAddModal = () => {
    setEditingId(null)
    setActiveTab("en")
    setTitle({ en: "", hi: "", te: "" })
    setSubtitle({ en: "", hi: "", te: "" })
    setLink("")
    setColor(BANNER_COLORS[2].value)
    setImage(null)
    setImagePreview(null)
    setIsActive(true)
    setIsModalOpen(true)
  }

  const openEditModal = (offer: any) => {
    setEditingId(offer.id)
    setActiveTab("en")
    
    const tryParse = (val: any) => {
      if (!val) return { en: "", hi: "", te: "" }
      if (typeof val === 'object') return val
      try {
        const parsed = JSON.parse(val)
        return typeof parsed === 'object' ? parsed : { en: String(parsed), hi: "", te: "" }
      } catch {
        return { en: String(val), hi: "", te: "" }
      }
    }

    const tData = tryParse(offer.title)
    setTitle({ 
      en: tData.en || "", 
      hi: tData.hi || "", 
      te: tData.te || "" 
    })

    const sData = tryParse(offer.subtitle)
    setSubtitle({ 
      en: sData.en || "", 
      hi: sData.hi || "", 
      te: sData.te || "" 
    })

    setLink(offer.link || "")
    setColor(offer.color || BANNER_COLORS[2].value)
    setImage(null)
    setImagePreview(offer.image || null)
    setIsActive(offer.isActive ?? true)
    setIsModalOpen(true)
  }

  const handleTranslateAI = async () => {
    if (!title.en.trim()) return showToast("Enter English title first", "error")
    try {
      setIsTranslating(true)
      const res = await api.post("/categories/translate", { text: title.en })
      const resSub = subtitle.en ? await api.post("/categories/translate", { text: subtitle.en }) : null

      if (res.data.status === "success") {
        setTitle(prev => ({
          ...prev,
          hi: res.data.data.translations.hi,
          te: res.data.data.translations.te
        }))
      }
      if (resSub?.data.status === "success") {
        setSubtitle(prev => ({
          ...prev,
          hi: resSub.data.data.translations.hi,
          te: resSub.data.data.translations.te
        }))
      }
      showToast("Translations ready!")
    } catch {
      showToast("Translation failed", "error")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSave = async () => {
    if (!title.en.trim()) return showToast("Title is required", "error")
    try {
      setIsSaving(true)
      const formData = new FormData()
      formData.append("title", JSON.stringify(title))
      formData.append("subtitle", JSON.stringify(subtitle))
      formData.append("link", link)
      formData.append("color", color)
      formData.append("isActive", String(isActive))
      if (image) formData.append("image", image)

      if (editingId) {
        await api.patch(`/home-offers/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      } else {
        await api.post("/home-offers", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      }
      
      setIsModalOpen(false)
      fetchOffers()
      showToast(editingId ? "Offer updated" : "Offer created")
    } catch (error) {
      showToast("Failed to save", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/home-offers/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchOffers()
      showToast("Offer deleted")
    } catch {
      showToast("Delete failed", "error")
    }
  }

  const getLocalized = (obj: any) => {
    if (!obj) return ""
    if (typeof obj === "string") return obj
    const lang = i18n?.language?.split("-")[0] || "en"
    return obj[lang] || obj.en || Object.values(obj)[0] || ""
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-primary" /> {t("home_offers.title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("home_offers.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground font-bold">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> {offers.length} / 3 {t("home_offers.recommended")}
          </div>
          <Button onClick={openAddModal} className="gap-2 bg-primary hover:bg-primary/90 rounded-xl px-5 h-11 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> {t("home_offers.add_offer")}
          </Button>
        </div>
      </div>

      {/* ── List Section ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : offers.length === 0 ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
            <p className="font-bold text-muted-foreground">{t("home_offers.no_offers")}</p>
            <Button onClick={openAddModal} variant="outline" className="rounded-xl">{t("home_offers.add_first")}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="group overflow-hidden rounded-3xl border-border/50 hover:border-primary/50 transition-all shadow-sm">
              <div className={cn("p-6 md:p-8 flex flex-col justify-between aspect-[16/9] relative overflow-hidden", offer.color)}>
                <div className="absolute top-4 left-4 z-20">
                   <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm", offer.isActive ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-600 border border-slate-500/20")}>
                      <div className={cn("w-1 h-1 rounded-full animate-pulse", offer.isActive ? "bg-emerald-500" : "bg-slate-400")} />
                      {offer.isActive ? t("home_offers.live") : t("home_offers.draft")}
                   </div>
                </div>
                <div className="relative z-10 w-[65%]">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase whitespace-pre-line">
                    {getLocalized(offer.title).replace('\\n', '\n')}
                  </h3>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-600 mt-2 uppercase tracking-widest opacity-90 leading-tight">
                    {getLocalized(offer.subtitle)}
                  </p>
                </div>
                <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center p-4">
                  <img src={offer.image} className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out" alt="offer" />
                </div>
                <div className="mt-auto relative z-10 flex items-center justify-between">
                   <div className="text-[10px] font-black uppercase border-b border-slate-900 pb-0.5">{t("home_offers.explore_now")}</div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-primary" onClick={() => openEditModal(offer)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-lg" onClick={() => setDeleteTarget({ id: offer.id, label: getLocalized(offer.title) })}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Dialogs ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-950 sm:max-w-[750px] w-[95vw] h-[90vh] flex flex-col my-auto">
          {/* Header - Fixed at top */}
          <div className="p-6 md:p-8 border-b border-border/50 shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {editingId ? t("home_offers.edit_offer") : t("home_offers.add_offer")}
              </DialogTitle>
              <DialogDescription className="text-xs">{t("home_offers.design_promo")}</DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content (Form + Preview) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
            {/* Form Section */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                      <TabsTrigger value="en" className="rounded-lg px-4 font-bold text-xs">EN</TabsTrigger>
                      <TabsTrigger value="hi" className="rounded-lg px-4 font-bold text-xs">HI</TabsTrigger>
                      <TabsTrigger value="te" className="rounded-lg px-4 font-bold text-xs">TE</TabsTrigger>
                    </TabsList>
                    <Button variant="ghost" size="sm" onClick={handleTranslateAI} disabled={isTranslating} className="text-primary hover:bg-primary/5 gap-2 font-black text-[10px] uppercase">
                      {isTranslating ? <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-3.5 w-3.5" />}
                      {t("home_offers.ai_translation")}
                    </Button>
                  </div>

                  {(['en', 'hi', 'te'] as const).map((lang) => (
                    <TabsContent key={lang} value={lang} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("home_offers.title_label")} ({lang.toUpperCase()})</Label>
                          <Input value={title[lang]} onChange={e => setTitle({...title, [lang]: e.target.value})} placeholder="e.g. Pharmacy\nDelivered" className="rounded-xl font-black h-11" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("home_offers.subtitle_label")} ({lang.toUpperCase()})</Label>
                          <Input value={subtitle[lang]} onChange={e => setSubtitle({...subtitle, [lang]: e.target.value})} placeholder="e.g. Medicines & essentials" className="rounded-xl font-medium h-11" />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("home_offers.link_url")}</Label>
                  <Input value={link} onChange={e => setLink(e.target.value)} placeholder="/shop-now" className="rounded-xl h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("home_offers.image")}</Label>
                  <Input type="file" onChange={handleImageChange} className="rounded-xl h-11 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary cursor-pointer text-xs font-medium" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-xs font-black uppercase tracking-tight">{t("home_offers.public_visibility")}</Label>
                  <p className="text-[10px] text-muted-foreground">{t("home_offers.public_visibility_desc")}</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-primary" />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("home_offers.bg_theme")}</Label>
                <div className="flex flex-wrap gap-2.5">
                  {BANNER_COLORS.map(p => (
                    <button key={p.value} type="button" onClick={() => setColor(p.value)} className={cn("w-10 h-10 rounded-2xl border-4 transition-all hover:scale-110", p.value, color === p.value ? "border-primary shadow-lg shadow-primary/10" : "border-transparent")}>
                      {color === p.value && <div className="flex items-center justify-center h-full"><CheckCircle2 className="h-5 w-5 text-primary" /></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Preview Section */}
            <div className="pt-6 border-t border-border/10">
               <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">{t("home_offers.preview_title")}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{t("home_offers.preview_desc")}</p>
                  </div>
                  <div className="flex gap-1.5 h-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
               </div>
               
               <div className="w-full flex justify-center">
                  <div className={cn(`w-full max-w-2xl relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between group shadow-2xl border border-white/20 h-[180px] md:h-[240px] transition-all`, color)}>
                    <div className="relative z-10 w-[60%] h-full flex flex-col justify-center text-left">
                      <div className="space-y-2 mb-6 md:mb-10 animate-in fade-in slide-in-from-left duration-700">
                        <h4 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tighter uppercase whitespace-pre-line drop-shadow-sm">
                          {(title[activeTab] || (activeTab === "en" ? "PHARMACY\nDELIVERED" : "")).replace('\\n', '\n')}
                        </h4>
                        <p className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300 opacity-90 leading-snug tracking-widest uppercase mt-2">
                          {subtitle[activeTab] || (activeTab === "en" ? "Medicines & wellness essentials" : "")}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 group/btn w-fit">
                        <span className="text-[14px] md:text-[16px] font-black text-slate-900 border-b-4 border-slate-900 pb-1 tracking-tight uppercase dark:text-white dark:border-white group-hover/btn:text-primary group-hover/btn:border-primary transition-all">
                          {t("home_offers.explore_now")}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-[55%] h-full pointer-events-none select-none overflow-visible">
                      <div className="relative w-full h-full p-4 flex items-center justify-center">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain object-center drop-shadow-2xl scale-110 translate-x-4 animate-in zoom-in duration-1000"
                          />
                        ) : (
                           <div className="w-24 h-24 bg-black/5 rounded-full blur-3xl animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-6 md:p-8 border-t border-border/50 bg-white dark:bg-slate-950 shrink-0">
             <div className="flex gap-4 w-full max-w-md mx-auto">
                <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-xs hover:bg-slate-50" onClick={() => setIsModalOpen(false)}>{t("common.cancel")}</Button>
                <Button className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? t("categories.saving") : editingId ? t("home_offers.update_offer") : t("home_offers.save_offer")}
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        target={deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
