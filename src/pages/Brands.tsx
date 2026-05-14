import * as React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Pencil, Sparkles, ExternalLink, SwitchCamera } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

export default function BrandsPage() {
  const { t } = useTranslation()
  const [brands, setBrands] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Top-Level UI States
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null)
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }

  // Modal State
  const [isOpen, setIsOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  // Form State
  const [name, setName] = React.useState({ en: "", hi: "", te: "" })
  const [image, setImage] = React.useState<File | null>(null)
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [isActive, setIsActive] = React.useState(true)
  
  // Loading States
  const [isSaving, setIsSaving] = React.useState(false)
  const [isTranslating, setIsTranslating] = React.useState(false)

  // Delete State
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; label: string } | null>(null)

  const fetchBrands = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/brands")
      setBrands(res.data.data.brands || [])
    } catch {
      showToast("Failed to load brand partners", "error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  const openAdd = () => {
    setEditingId(null)
    setName({ en: "", hi: "", te: "" })
    setImage(null)
    setImageUrl(null)
    setIsActive(true)
    setIsOpen(true)
  }

  const openEdit = (brand: any) => {
    setEditingId(brand.id)
    
    // Parse the stored JSON string name if it exists
    let nameData = { en: "", hi: "", te: "" }
    try {
      if (brand.name.startsWith('{')) {
        nameData = JSON.parse(brand.name)
      } else {
        nameData.en = brand.name
      }
    } catch {
      nameData.en = brand.name
    }
    
    setName({
      en: nameData.en || "",
      hi: nameData.hi || "",
      te: nameData.te || ""
    })
    
    setImage(null)
    setImageUrl(brand.image || null)
    setIsActive(brand.isActive !== false)
    setIsOpen(true)
  }

  const handleTranslateAI = async () => {
    if (!name.en.trim()) return showToast("Please enter English name first", "error")
    try {
      setIsTranslating(true)
      const res = await api.post("/categories/translate", { text: name.en })
      if (res.data.status === "success") {
        setName(prev => ({
          ...prev,
          hi: res.data.data.translations.hi,
          te: res.data.data.translations.te
        }))
        showToast("Translations generated via AI")
      }
    } catch {
      showToast("Translation failed", "error")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSave = async () => {
    try {
      if (!name.en) return showToast("English Brand Name is required", "error")
      if (!editingId && !image && !imageUrl) return showToast("Brand Logo is required", "error")
      
      setIsSaving(true)
      
      const formData = new FormData()
      formData.append("name", JSON.stringify(name))
      formData.append("isActive", isActive ? "true" : "false")
      if (image) formData.append("image", image)

      if (editingId) {
        await api.patch(`/brands/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        showToast("Brand Partner updated successfully")
      } else {
        await api.post("/brands", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        showToast("Brand Partner created successfully")
      }
      
      setIsOpen(false)
      fetchBrands()
    } catch (error) {
      showToast("Failed to save brand", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/brands/${deleteTarget.id}`)
      showToast("Brand deleted successfully")
      setDeleteTarget(null)
      fetchBrands()
    } catch {
      showToast("Delete failed", "error")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4", toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white")}>
          <div className="font-bold text-sm tracking-wide">{toast.msg}</div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> Brand Partners
          </h1>
          <p className="text-muted-foreground text-sm">Manage logos for the rolling marquee on the storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={openAdd} className="gap-2 bg-primary hover:bg-primary/90 rounded-xl px-5 h-11 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Add Partner
          </Button>
        </div>
      </div>

      {/* ── List Section ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : brands.length === 0 ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="h-10 w-10 text-muted-foreground/30 flex items-center justify-center">
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="font-bold text-muted-foreground">No brand partners added yet.</p>
            <Button onClick={openAdd} variant="outline" className="rounded-xl">Add First Partner</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {brands.map((brand) => {
            let parsedName = brand.name
            try {
              if (brand.name.startsWith('{')) {
                parsedName = JSON.parse(brand.name).en || "Unnamed"
              }
            } catch {}

            return (
              <Card key={brand.id} className={cn("group overflow-hidden rounded-3xl border-border/50 hover:border-primary/50 transition-all shadow-sm", !brand.isActive && "opacity-60")}>
                <div className="p-0 relative flex flex-col items-center">
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-20">
                     <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm", brand.isActive ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-600 border border-slate-500/20")}>
                        <div className={cn("w-1 h-1 rounded-full animate-pulse", brand.isActive ? "bg-emerald-500" : "bg-slate-400")} />
                        {brand.isActive ? "Live" : "Draft"}
                     </div>
                  </div>

                  <div className="w-full aspect-square bg-slate-50/50 dark:bg-white/5 flex items-center justify-center p-8 group-hover:bg-primary/5 transition-colors duration-500">
                    {brand.image && (
                       <img src={brand.image} alt={parsedName} className="max-w-full max-h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-700 ease-out" />
                    )}
                  </div>
                  
                  <div className="p-4 w-full flex items-center justify-between border-t border-slate-100 dark:border-border/50 bg-white dark:bg-slate-950">
                    <h3 className="font-black uppercase tracking-widest text-xs text-slate-900 dark:text-white truncate">{parsedName}</h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-sm text-primary" onClick={() => openEdit(brand)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-sm text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget({ id: brand.id, label: parsedName })}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── Dialogs ── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-950 sm:max-w-[700px] w-[95vw] max-h-[90vh] flex flex-col my-auto">
          {/* Header - Fixed at top */}
          <div className="p-6 md:p-8 border-b border-border/50 shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {editingId ? "Edit Brand Partner" : "Add Brand Partner"}
              </DialogTitle>
              <DialogDescription>
                Provide the localized name and transparent logo.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto space-y-8">
            {/* Translations wrapper */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Brand Name (Multi-language)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTranslateAI}
                  disabled={isTranslating}
                  className="h-8 text-[10px] uppercase font-bold tracking-widest gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-100 text-indigo-700"
                >
                  <Sparkles className="h-3 w-3" />
                  {isTranslating ? "Translating..." : "Auto Translate"}
                </Button>
              </div>

              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-100 dark:bg-white/5 rounded-xl h-12">
                  <TabsTrigger value="en" className="rounded-lg font-bold text-xs">English</TabsTrigger>
                  <TabsTrigger value="hi" className="rounded-lg font-bold text-xs">Hindi</TabsTrigger>
                  <TabsTrigger value="te" className="rounded-lg font-bold text-xs">Telugu</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 p-4 rounded-xl border border-border/50 bg-slate-50/50 dark:bg-white/5 shadow-inner">
                  <TabsContent value="en" className="m-0 focus-visible:outline-none">
                    <Input value={name.en} onChange={(e) => setName({...name, en: e.target.value})} placeholder="e.g. Nestle" className="border-none bg-transparent shadow-none text-lg font-medium px-2" />
                  </TabsContent>
                  <TabsContent value="hi" className="m-0 focus-visible:outline-none">
                    <Input value={name.hi} onChange={(e) => setName({...name, hi: e.target.value})} placeholder="e.g. नेस्ले" className="border-none bg-transparent shadow-none text-lg font-medium px-2 font-hindi" />
                  </TabsContent>
                  <TabsContent value="te" className="m-0 focus-visible:outline-none">
                    <Input value={name.te} onChange={(e) => setName({...name, te: e.target.value})} placeholder="e.g. నెస్లే" className="border-none bg-transparent shadow-none text-lg font-medium px-2 font-telugu" />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Config wrapper */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Transparent Logo (PNG/SVG)</Label>
                  <div className="relative group rounded-[2rem] border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted/20 aspect-square flex flex-col items-center justify-center p-4 overflow-hidden">
                    {(image || imageUrl) ? (
                      <img src={image ? URL.createObjectURL(image) : imageUrl!} className="max-w-full max-h-full object-contain p-2 drop-shadow-md" alt="Preview" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center mb-2">
                           <SwitchCamera className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Upload Logo</span>
                      </>
                    )}
                    <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
               </div>

               <div className="space-y-6">
                 {/* Activity Toggle */}
                 <div className="p-5 rounded-[2rem] border border-border/50 bg-muted/20 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                       <Label className="text-sm font-bold tracking-tight">Active Status</Label>
                       <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-emerald-500" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Inactive brands will not appear in the storefront scrolling marquee.</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="p-6 md:p-8 shrink-0 flex justify-end gap-3 border-t border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl px-6 font-bold h-11">
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving} className="rounded-xl px-8 h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
              {isSaving ? "Saving..." : (editingId ? "Update Partner" : "Create Partner")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <div className="bg-red-500 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
               <Trash2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-black text-white">Delete Brand?</DialogTitle>
          </div>
          <div className="p-8 text-center space-y-6 bg-white dark:bg-[#08090a]">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Are you sure you want to completely remove <strong className="text-slate-900 dark:text-white text-lg">{deleteTarget?.label}</strong> from the rolling marquee? This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button type="button" variant="outline" className="rounded-full px-8 h-11 font-bold" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" className="rounded-full px-8 h-11 font-black uppercase tracking-widest text-[10px]" onClick={handleDelete}>
                Delete Permanently
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
