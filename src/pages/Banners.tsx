import * as React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Trash2,
  Pencil,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ImageIcon,
  Layout,
  Power,
  ChevronRight
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

// Reusing Utilities
import { BANNER_COLORS, Toast, getName } from "@/components/categories/category-utils"
import DeleteConfirmDialog from "@/components/categories/DeleteConfirmDialog"

export default function BannersPage() {
  const { t, i18n } = useTranslation()
  const [banners, setBanners] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  // UI States
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null)
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"en" | "hi" | "te">("en")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [title, setTitle] = React.useState({ en: "", hi: "", te: "" })
  const [subtitle, setSubtitle] = React.useState({ en: "", hi: "", te: "" })
  const [link, setLink] = React.useState("")
  const [color, setColor] = React.useState(BANNER_COLORS[0].value) 
  const [image, setImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [isActive, setIsActive] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isTranslating, setIsTranslating] = React.useState(false)

  // Delete State
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; label: string } | null>(null)

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/banners")
      setBanners(response.data.data.banners)
    } catch (error) {
      showToast(t("banners.messages.fetch_error") || "Failed to fetch banners", "error")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchBanners()
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
    setColor(BANNER_COLORS[0].value)
    setImage(null)
    setImagePreview(null)
    setIsActive(true)
    setIsModalOpen(true)
  }

  const openEditModal = (banner: any) => {
    setEditingId(banner.id)
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

    const tData = tryParse(banner.title)
    setTitle({ 
      en: tData.en || "", 
      hi: tData.hi || "", 
      te: tData.te || "" 
    })

    const sData = tryParse(banner.subtitle)
    setSubtitle({ 
      en: sData.en || "", 
      hi: sData.hi || "", 
      te: sData.te || "" 
    })

    setLink(banner.link || "")
    setColor(banner.color || BANNER_COLORS[0].value)
    setImage(null)
    setImagePreview(banner.image || null)
    setIsActive(banner.isActive ?? true)
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
      showToast(t("home_offers.ai_ready") || "Translations ready!")
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
        await api.patch(`/banners/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      } else {
        await api.post("/banners", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      }
      
      setIsModalOpen(false)
      fetchBanners()
      showToast(t("banners.messages.save_success"))
    } catch (error) {
      showToast("Failed to save", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/banners/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchBanners()
      showToast(t("banners.messages.delete_success"))
    } catch {
      showToast("Delete failed", "error")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 uppercase">
            <Layout className="h-6 w-6 text-primary" /> {t("banners.title")}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">{t("banners.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={openAddModal} className="gap-2 bg-primary hover:bg-primary/90 rounded-xl px-5 h-11 shadow-lg shadow-primary/20 font-bold uppercase tracking-tight">
            <Plus className="h-4 w-4" /> {t("banners.add_banner")}
          </Button>
        </div>
      </div>

      {/* ── List Section (Table) ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <Card className="border-none shadow-xl bg-card overflow-hidden rounded-[2rem]">
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-muted/30 border-b border-border/50">
                    <tr>
                      <th className="px-6 py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">{t("banners.table.preview")}</th>
                      <th className="px-6 py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">{t("banners.table.details")}</th>
                      <th className="px-6 py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">{t("banners.table.link")}</th>
                      <th className="px-6 py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">{t("banners.table.status")}</th>
                      <th className="px-6 py-5 text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground">{t("banners.table.actions")}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/40">
                   {banners.map((banner) => (
                     <tr key={banner.id} className="group hover:bg-muted/20 transition-all">
                       <td className="px-6 py-4">
                         <div className={cn("w-32 h-16 rounded-xl flex items-center justify-center overflow-hidden border border-border/50 shadow-sm relative", banner.color)}>
                           <img src={banner.image} alt="Banner" className="h-full object-contain drop-shadow-md" />
                           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ExternalLink className="h-4 w-4 text-white" />
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex flex-col">
                           <span className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight line-clamp-1">{getName(banner, i18n.language.split('-')[0])}</span>
                           <span className="text-xs font-bold text-muted-foreground/80 line-clamp-1">
                             {typeof banner.subtitle === 'object' ? banner.subtitle[i18n.language.split('-')[0]] || banner.subtitle.en : banner.subtitle}
                           </span>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <Badge variant="outline" className="rounded-lg font-bold text-[10px] border-border/50 uppercase tracking-tighter">
                           {banner.link || "No Link"}
                         </Badge>
                       </td>
                       <td className="px-6 py-4">
                         <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", banner.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-600")}>
                            <div className={cn("w-1 h-1 rounded-full", banner.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                            {banner.isActive ? t("banners.fields.active") : t("banners.fields.inactive")}
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm active:scale-95" onClick={() => openEditModal(banner)}>
                             <Pencil className="h-4 w-4" />
                           </Button>
                           <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all shadow-sm active:scale-95" onClick={() => setDeleteTarget({ id: banner.id, label: getName(banner, 'en') })}>
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   {banners.length === 0 && (
                     <tr>
                       <td colSpan={5} className="px-6 py-20 text-center flex flex-col items-center gap-4">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                          <p className="font-bold text-muted-foreground">{t("banners.messages.no_banners")}</p>
                          <Button onClick={openAddModal} variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">{t("banners.add_banner")}</Button>
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>
      )}

      {/* ── Add/Edit Dialog ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-950 sm:max-w-3xl w-[95vw] max-h-[90vh] flex flex-col my-auto">
          <div className="p-6 md:p-8 border-b border-border/50 grow-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                {editingId ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                {editingId ? t("banners.edit_banner") : t("banners.add_banner")}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium">{t("banners.promo_design")}</DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            {/* Multi-language Tabs */}
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
               <div className="flex items-center justify-between gap-4 flex-wrap">
                 <TabsList className="bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="en" className="rounded-lg px-4 font-black text-[10px] uppercase">EN</TabsTrigger>
                    <TabsTrigger value="hi" className="rounded-lg px-4 font-black text-[10px] uppercase">HI</TabsTrigger>
                    <TabsTrigger value="te" className="rounded-lg px-4 font-black text-[10px] uppercase">TE</TabsTrigger>
                 </TabsList>
                 <Button variant="ghost" size="sm" onClick={handleTranslateAI} disabled={isTranslating} className="text-primary hover:bg-primary/5 gap-2 font-black text-[10px] uppercase">
                    {isTranslating ? <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {t("home_offers.ai_translation")}
                 </Button>
               </div>

               {(['en', 'hi', 'te'] as const).map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("banners.fields.title_label")} ({lang.toUpperCase()})</Label>
                         <Input value={title[lang]} onChange={e => setTitle({...title, [lang]: e.target.value})} placeholder="e.g. Back to School Essentials" className="rounded-xl font-black h-12 border-border/60 focus:border-primary/50 transition-colors" />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("banners.fields.subtitle_label")} ({lang.toUpperCase()})</Label>
                         <Input value={subtitle[lang]} onChange={e => setSubtitle({...subtitle, [lang]: e.target.value})} placeholder="e.g. Get Flat 50% Off" className="rounded-xl font-medium h-12 border-border/60 focus:border-primary/50 transition-colors" />
                       </div>
                    </div>
                  </TabsContent>
               ))}
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("banners.fields.link_label")}</Label>
                 <Input value={link} onChange={e => setLink(e.target.value)} placeholder="/products/school" className="rounded-xl h-12 border-border/60" />
               </div>
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("banners.fields.image")}</Label>
                 <div className="flex items-center gap-4">
                    <div className="relative group">
                       <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/40">
                          {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground/30" />}
                       </div>
                       <Input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <Button variant="outline" className="rounded-xl h-12 px-4 text-[10px] font-black uppercase tracking-widest relative">
                       {image ? image.name : t("banners.fields.image")}
                       <Input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </Button>
                 </div>
               </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-border/40 shadow-sm">
               <div className="space-y-0.5">
                  <Label className="text-xs font-black uppercase tracking-tight">{t("banners.fields.status")}</Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Make this banner visible on the homepage.</p>
               </div>
               <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-primary" />
            </div>

            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">{t("banners.fields.theme_color")}</Label>
               <div className="flex flex-wrap gap-2.5">
                  {BANNER_COLORS.map(p => (
                    <button key={p.value} type="button" onClick={() => setColor(p.value)} className={cn("w-10 h-10 rounded-2xl border-4 transition-all hover:scale-110", p.value, color === p.value ? "border-primary shadow-lg shadow-primary/20" : "border-transparent")}>
                       {color === p.value && <div className="flex items-center justify-center h-full"><CheckCircle2 className="h-5 w-5 text-primary" /></div>}
                    </button>
                  ))}
               </div>
            </div>

            {/* Live Preview Section */}
            <div className="pt-8 border-t border-border/30">
               <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Experience Preview</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5 uppercase font-bold tracking-widest">How it looks in the app banner slot</p>
                  </div>
               </div>
               
               <div className="w-full flex justify-center">
                  <div className={cn("w-full h-40 rounded-[2rem] p-6 md:p-8 flex items-center justify-between overflow-hidden relative shadow-2xl transition-all duration-500", color)}>
                     <div className="relative z-10 space-y-2 max-w-[60%]">
                        <h4 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tighter uppercase whitespace-pre-line">
                           {(title[activeTab] || "Preview Title").replace('\\n', '\n')}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 opacity-90">
                           {subtitle[activeTab] || "Preview Subtitle Content"}
                        </p>
                        <div className="pt-2">
                           <div className="inline-flex items-center gap-1.5 border-b-2 border-slate-900 pb-0.5 text-[10px] font-black uppercase">
                              Shop Now <ChevronRight className="h-3 w-3" />
                           </div>
                        </div>
                     </div>
                     <div className="absolute right-0 top-0 w-[45%] h-full flex items-center justify-center p-4">
                        {imagePreview ? (
                          <img src={imagePreview} className="max-w-full max-h-[120%] object-contain drop-shadow-2xl animate-in zoom-in duration-700" alt="Preview" />
                        ) : (
                           <div className="w-20 h-20 bg-black/5 rounded-full blur-2xl animate-pulse" />
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-border/50 bg-white dark:bg-slate-950 shrink-0">
             <div className="flex gap-4 w-full max-w-md mx-auto">
                <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all active:scale-95" onClick={() => setIsModalOpen(false)}>
                   {t("common.cancel")}
                </Button>
                <Button className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 transition-all active:scale-95" onClick={handleSave} disabled={isSaving}>
                   {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : null}
                   {editingId ? t("banners.edit_banner") : t("banners.add_banner")}
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
