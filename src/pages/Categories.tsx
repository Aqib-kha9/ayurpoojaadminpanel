import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Folder,
  Grid3X3,
  ArrowRight,
  ListTree,
  Sparkles
} from "lucide-react"
import api from "@/lib/api"

// Modular Components
import { BANNER_COLORS, Toast, LevelBadge } from "@/components/categories/category-utils"
import CategoryItem from "@/components/categories/CategoryItem"
import CategoryFormDialog from "@/components/categories/CategoryFormDialog"
import BannerFormDialog from "@/components/categories/BannerFormDialog"
import DeleteConfirmDialog from "@/components/categories/DeleteConfirmDialog"

import { useTranslation } from "react-i18next"

export default function CategoriesPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set())
  const [banners, setBanners] = React.useState<Record<string, any[]>>({})

  // UI States
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null)
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }

  // Categories Modal State
  const [isCatOpen, setIsCatOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [addingLevel, setAddingLevel] = React.useState(0)
  const [presetParentId, setPresetParentId] = React.useState<string | null>(null)
  const [parentName, setParentName] = React.useState("")
  const [catName, setCatName] = React.useState({ en: "", hi: "", te: "" })
  const [catSlug, setCatSlug] = React.useState("")
  const [catImage, setCatImage] = React.useState<File | null>(null)
  const [catImageUrl, setCatImageUrl] = React.useState<string | null>(null)
  const [catSaving, setCatSaving] = React.useState(false)
  const [isTranslating, setIsTranslating] = React.useState(false)

  // Banner Modal State
  const [isBannerOpen, setIsBannerOpen] = React.useState(false)
  const [bannerCatId, setBannerCatId] = React.useState("")
  const [bannerTitle, setBannerTitle] = React.useState({ en: "", hi: "", te: "" })
  const [bannerDiscount, setBannerDiscount] = React.useState({ en: "", hi: "", te: "" })
  const [bannerColor, setBannerColor] = React.useState(BANNER_COLORS[0].value)
  const [bannerImage, setBannerImage] = React.useState<File | null>(null)
  const [bannerLink, setBannerLink] = React.useState("")
  const [bannerSaving, setBannerSaving] = React.useState(false)
  const [isBannerTranslating, setIsBannerTranslating] = React.useState(false)

  // Delete State
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; label: string } | null>(null)

  // ────────────────────────────────────────────
  // API Fetchers
  // ────────────────────────────────────────────
  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/categories")
      setCategories(res.data.data.categories)
    } catch {
      showToast(t("categories.load_fail"), "error")
    } finally {
      setLoading(false)
    }
  }, [t])

  const fetchBannersFor = async (catId: string) => {
    try {
      const res = await api.get(`/megamenu/category/${catId}`)
      setBanners(prev => ({ ...prev, [catId]: res.data.data.banners || [] }))
    } catch { }
  }

  React.useEffect(() => { fetchCategories() }, [fetchCategories])

  // ────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────
  const toggle = (id: string) => {
    setExpanded(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else { n.add(id); if (!banners[id]) fetchBannersFor(id) }
      return n
    })
  }

  const openAddCategory = (parentId: string | null = null, level: number = 0, pName: string = "") => {
    setEditingId(null); setAddingLevel(level); setPresetParentId(parentId); setParentName(pName)
    setCatName({ en: "", hi: "", te: "" }); setCatSlug(""); setCatImage(null); setCatImageUrl(null); setIsCatOpen(true)
  }

  const openEditCategory = (cat: any) => {
    setEditingId(cat.id);
    setAddingLevel(cat.parentId ? 1 : 0);
    setParentName("");
    setPresetParentId(cat.parentId)

    let nameData = { en: "", hi: "", te: "" }
    try {
      const rawName = cat.name
      if (typeof rawName === "object" && rawName !== null) {
        nameData = {
          en: rawName.en || "",
          hi: rawName.hi || "",
          te: rawName.te || ""
        }
      } else {
        nameData = { en: String(rawName || ""), hi: "", te: "" }
      }
    } catch {
      nameData = { en: String(cat.name || ""), hi: "", te: "" }
    }

    setCatName(nameData)
    setCatSlug(cat.slug || ""); setCatImage(null); setCatImageUrl(cat.image || null); setIsCatOpen(true)
  }

  const handleTranslateAI = async () => {
    if (!catName.en.trim()) return showToast(t("categories.enter_eng"), "error")
    try {
      setIsTranslating(true)
      const res = await api.post("/categories/translate", { text: catName.en })
      if (res.data.status === "success") {
        setCatName(prev => ({
          ...prev,
          hi: res.data.data.translations.hi,
          te: res.data.data.translations.te
        }))
        showToast(t("categories.ai_ready"))
      }
    } catch {
      showToast(t("categories.save_fail"), "error")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSaveCategory = async () => {
    if (!catName.en.trim() || !catSlug.trim()) return showToast(t("categories.req_fields"), "error")
    try {
      setCatSaving(true)
      const fd = new FormData()
      fd.append("name", JSON.stringify(catName)); fd.append("slug", catSlug)
      if (presetParentId) fd.append("parentId", presetParentId)
      if (catImage) fd.append("image", catImage)

      if (editingId) await api.patch(`/categories/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      else await api.post("/categories", fd, { headers: { "Content-Type": "multipart/form-data" } })

      setIsCatOpen(false); await fetchCategories(); showToast(t("categories.save_success"))
    } catch {
      showToast(t("categories.save_fail"), "error")
    } finally {
      setCatSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/categories/${deleteTarget.id}`)
      setDeleteTarget(null); await fetchCategories(); showToast(t("categories.delete_success"))
    } catch {
      showToast(t("categories.delete_fail"), "error"); setDeleteTarget(null)
    }
  }

  const openAddBanner = (catId: string) => {
    setBannerCatId(catId); setBannerTitle({ en: "", hi: "", te: "" }); setBannerDiscount({ en: "", hi: "", te: "" }); setBannerImage(null)
    setBannerLink(""); setBannerColor(BANNER_COLORS[0].value); setIsBannerOpen(true)
  }

  const handleBannerTranslateAI = async () => {
    if (!bannerTitle.en.trim()) return showToast(t("categories.enter_eng"), "error")
    try {
      setIsBannerTranslating(true)
      const res = await api.post("/categories/translate", { text: bannerTitle.en })
      const resDisc = await api.post("/categories/translate", { text: bannerDiscount.en })

      if (res.data.status === "success" && resDisc.data.status === "success") {
        setBannerTitle(prev => ({
          ...prev,
          hi: res.data.data.translations.hi,
          te: res.data.data.translations.te
        }))
        setBannerDiscount(prev => ({
          ...prev,
          hi: resDisc.data.data.translations.hi,
          te: resDisc.data.data.translations.te
        }))
        showToast(t("categories.ai_ready"))
      }
    } catch {
      showToast(t("categories.save_fail"), "error")
    } finally {
      setIsBannerTranslating(false)
    }
  }

  const handleSaveBanner = async () => {
    if (!bannerTitle.en || !bannerDiscount.en || !bannerImage) return showToast(t("categories.banner_req"), "error")
    try {
      setBannerSaving(true)
      const fd = new FormData()
      fd.append("categoryId", bannerCatId)
      fd.append("title", JSON.stringify(bannerTitle))
      fd.append("discount", JSON.stringify(bannerDiscount))
      fd.append("color", bannerColor)
      if (bannerLink) fd.append("link", bannerLink)
      fd.append("image", bannerImage)

      await api.post("/megamenu/banners", fd, { headers: { "Content-Type": "multipart/form-data" } })
      setIsBannerOpen(false); await fetchBannersFor(bannerCatId); showToast(t("categories.banner_success"))
    } catch {
      showToast(t("categories.banner_fail"), "error")
    } finally {
      setBannerSaving(false)
    }
  }

  const handleDeleteBanner = async (catId: string, bannerId: string) => {
    try {
      await api.delete(`/megamenu/banners/${bannerId}`); await fetchBannersFor(catId); showToast(t("categories.banner_delete"))
    } catch { showToast(t("categories.delete_fail"), "error") }
  }

  const countAll = (items: any[]): number => items.reduce((sum, c) => 1 + sum + countAll(c.children || []), 0)
  const totalCats = countAll(categories)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ListTree className="h-6 w-6 text-primary" /> {t("categories.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("categories.subtitle").split(":").shift()}: <span className="font-bold text-primary">{t("categories.l1_short")}</span>
            <ArrowRight className="inline h-3 w-3 mx-1" />
            <span className="font-bold text-violet-600">{t("categories.l2_short")}</span>
            <ArrowRight className="inline h-3 w-3 mx-1" />
            <span className="font-bold text-rose-500">{t("categories.l3_short")}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground font-bold">
            <Grid3X3 className="h-3.5 w-3.5 text-primary" /> {t("categories.categories_count", { count: totalCats })}
          </div>
          <Button onClick={() => openAddCategory(null, 0, "")} className="gap-2 bg-primary hover:bg-primary/90 rounded-xl px-5">
            <Plus className="h-4 w-4" /> {t("categories.add_l1")}
          </Button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: t("categories.l1_label"), color: "bg-primary/10 text-primary border-primary/20" },
          { label: t("categories.l2_label"), color: "bg-violet-100 text-violet-700 border-violet-200" },
          { label: t("categories.l3_label"), color: "bg-rose-100 text-rose-600 border-rose-200" },
        ].map(l => (
          <span key={l.label} className={`text-[10px] font-bold px-3 py-1 rounded-full border ${l.color}`}> {l.label} </span>
        ))}
        <span className="text-[10px] px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium flex items-center gap-1 border">
          <Sparkles className="h-2.5 w-2.5" /> {t("categories.ai_hint")}
        </span>
      </div>

      {/* ── Tree ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground">{t("categories.building_tree")}</p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center"> <Folder className="h-7 w-7 text-muted-foreground/50" /> </div>
            <div className="text-center">
              <p className="font-bold text-muted-foreground">{t("categories.no_categories")}</p>
              <p className="text-xs text-muted-foreground/70 mt-1 text-center">{t("categories.no_categories_desc")}</p>
            </div>
            <Button onClick={() => openAddCategory(null)} className="gap-2"> <Plus className="h-4 w-4" /> {t("categories.add_first")} </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-border/30">
            {categories.map(cat => (
              <CategoryItem
                key={cat.id}
                cat={cat}
                depth={0}
                expanded={expanded}
                toggle={toggle}
                banners={banners}
                openAddCategory={openAddCategory}
                openEditCategory={openEditCategory}
                openAddBanner={openAddBanner}
                handleDeleteBanner={handleDeleteBanner}
                setDeleteTarget={setDeleteTarget}
              />
            ))}
            <button
              onClick={() => openAddCategory(null)}
              className="w-full flex items-center gap-2 px-5 py-3 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> {t("categories.add_l1")}
            </button>
          </div>
        </Card>
      )}

      {/* ════════ DIALOGS ════════ */}
      <CategoryFormDialog
        isOpen={isCatOpen} onOpenChange={setIsCatOpen}
        editingId={editingId} addingLevel={addingLevel} parentName={parentName}
        catName={catName} setCatName={setCatName} catSlug={catSlug} setCatSlug={setCatSlug}
        setCatImage={setCatImage} catSaving={catSaving} handleSave={handleSaveCategory}
        isTranslating={isTranslating} onTranslateAI={handleTranslateAI}
        catImageUrl={catImageUrl}
      />

      <BannerFormDialog
        isOpen={isBannerOpen} onOpenChange={setIsBannerOpen}
        bannerTitle={bannerTitle} setBannerTitle={setBannerTitle}
        bannerDiscount={bannerDiscount} setBannerDiscount={setBannerDiscount}
        bannerColor={bannerColor} setBannerColor={setBannerColor}
        setBannerImage={setBannerImage} bannerLink={bannerLink} setBannerLink={setBannerLink}
        bannerSaving={bannerSaving} handleSave={handleSaveBanner}
        handleTranslateAI={handleBannerTranslateAI}
        isTranslating={isBannerTranslating}
      />

      <DeleteConfirmDialog
        target={deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
