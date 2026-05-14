import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Pencil, 
  FolderOpen, 
  Layers, 
  Tag, 
  Megaphone 
} from "lucide-react"
import { getName, LevelBadge, LEVEL_COLORS } from "./category-utils"

import { useTranslation } from "react-i18next"

interface CategoryItemProps {
  cat: any
  depth: number
  expanded: Set<string>
  toggle: (id: string) => void
  banners: Record<string, any[]>
  openAddCategory: (parentId: string | null, level: number, name: string) => void
  openEditCategory: (cat: any) => void
  openAddBanner: (catId: string) => void
  handleDeleteBanner: (catId: string, bannerId: string) => void
  setDeleteTarget: (target: { id: string; label: string } | null) => void
}

export default function CategoryItem({ 
  cat, 
  depth = 0, 
  expanded, 
  toggle, 
  banners,
  openAddCategory,
  openEditCategory,
  openAddBanner,
  handleDeleteBanner,
  setDeleteTarget
}: CategoryItemProps) {
  const { t, i18n } = useTranslation()
  const name = getName(cat, i18n.language)
  const hasChildren = cat.children?.length > 0
  const isExpanded = expanded.has(cat.id)
  const catBanners = banners[cat.id] || []

  // Depth-based styling
  const paddingLeft = depth === 0 ? "pl-5" : depth === 1 ? "pl-10" : "pl-16"
  const borderAccent =
    depth === 0 ? "border-l-primary" :
    depth === 1 ? "border-l-violet-400" :
                  "border-l-rose-400"
  const bgHover =
    depth === 0 ? "hover:bg-primary/5" :
    depth === 1 ? "hover:bg-violet-50/50 dark:hover:bg-violet-900/10" :
                  "hover:bg-rose-50/50 dark:hover:bg-rose-900/10"

  const levelLabels = [t("categories.l1_short"), t("categories.l2_short"), t("categories.l3_short")]

  return (
    <div>
      {/* ── Row ── */}
      <div
        className={`
          group flex items-center gap-3 pr-4 py-3 cursor-pointer transition-colors border-l-2 ${borderAccent} ${bgHover} ${paddingLeft}
          ${depth > 0 ? "border-t border-border/30" : ""}
        `}
        onClick={() => toggle(cat.id)}
      >
        {/* Expand / folder icon */}
        <div className="shrink-0 flex items-center gap-1">
          {hasChildren || depth === 0 ? (
            isExpanded
              ? <ChevronDown className={`h-3.5 w-3.5 ${LEVEL_COLORS[Math.min(depth, 2)]}`} />
              : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <span className="w-3.5" />
          )}
        </div>

        {/* Category thumbnail */}
        <div className="shrink-0">
          {cat.image ? (
            <div className="w-9 h-9 rounded-xl border border-border/50 overflow-hidden bg-muted">
              <img src={cat.image} className="w-full h-full object-contain" alt={name} />
            </div>
          ) : (
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br
                ${depth === 0 ? "from-primary to-primary/70" : depth === 1 ? "from-violet-500 to-violet-700" : "from-rose-400 to-rose-600"}`}
            >
              {depth === 0 ? <FolderOpen className="h-4 w-4" /> : depth === 1 ? <Layers className="h-3.5 w-3.5" /> : <Tag className="h-3 w-3" />}
            </div>
          )}
        </div>

        {/* Name & badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold truncate ${depth === 0 ? "text-base" : depth === 1 ? "text-sm" : "text-xs"}`}>
              {name}
            </span>
            <LevelBadge level={depth} label={levelLabels[depth]} />
            {cat.children?.length > 0 && (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono text-muted-foreground">
                {cat.children.length} {t("categories.sub")}
              </Badge>
            )}
          </div>
          {/* Show multilingual names as hint if different from current */}
          <div className="flex gap-2">
            {cat.name?.hi && i18n.language !== 'hi' && (
              <span className="text-[10px] text-muted-foreground mt-0.5 truncate opacity-60">
                {cat.name.hi}
              </span>
            )}
            {cat.name?.te && i18n.language !== 'te' && (
              <span className="text-[10px] text-muted-foreground mt-0.5 truncate opacity-60">
                {cat.name.te}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons - only visible on hover */}
        <div
          className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={e => e.stopPropagation()}
        >
          {/* Add sub-category (only if depth < 2) */}
          {depth < 2 && (
            <Button
              size="sm"
              variant="ghost"
              className={`h-7 text-[11px] gap-1 rounded-lg ${depth === 0 ? "text-violet-600 hover:bg-violet-50" : "text-rose-500 hover:bg-rose-50"}`}
              onClick={() => openAddCategory(cat.id, depth + 1, name)}
            >
              <Plus className="h-3 w-3" />
              {depth === 0 ? t("categories.add_l2") : t("categories.add_l3")}
            </Button>
          )}
          {/* Add banner (only on L1) */}
          {depth === 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[11px] gap-1 rounded-lg text-rose-500 hover:bg-rose-50"
              onClick={() => openAddBanner(cat.id)}
            >
              <Megaphone className="h-3 w-3" /> {t("categories.add_banner")}
            </Button>
          )}
          {/* Edit button */}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-lg text-violet-500 hover:bg-violet-50"
            title={t("categories.edit_cat")}
            onClick={() => openEditCategory(cat)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
            title={t("common.delete")}
            onClick={() => setDeleteTarget({ id: cat.id, label: name })}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* ── Expanded Panel ── */}
      {isExpanded && (
        <div className={`${depth === 0 ? "ml-5 border-l-2 border-l-primary/20" : depth === 1 ? "ml-10 border-l-2 border-l-violet-200" : ""}`}>
          {/* Children recursively */}
          {cat.children?.map((child: any) => (
            <CategoryItem 
              key={child.id}
              cat={child} 
              depth={depth + 1}
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

          {/* Add Next Level button */}
          {depth < 2 && (
            <button
              onClick={() => openAddCategory(cat.id, depth + 1, name)}
              className={`w-full flex items-center gap-2 px-5 py-2.5 text-xs font-semibold transition-colors
                ${depth === 0 ? "text-violet-500 hover:bg-violet-50/50 border-t border-border/30" : "text-rose-400 hover:bg-rose-50/50 border-t border-border/30"}`}
            >
              <Plus className="h-3 w-3" />
              {t("common.add")} {depth === 0 ? t("categories.l2_short") : t("categories.l3_short")}
            </button>
          )}

          {/* Promo Banners panel (only for L1 when expanded) */}
          {depth === 0 && (
            <div className="mx-5 my-4 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">
                    {t("categories.promo_banners")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{t("categories.banners_desc")}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px] gap-1 border-rose-200 text-rose-500 hover:bg-rose-50 rounded-lg"
                  onClick={() => openAddBanner(cat.id)}
                >
                  <Plus className="h-3 w-3" /> {t("categories.add_banner")}
                </Button>
              </div>

              {catBanners.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-4">
                  {t("categories.no_banners")}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {catBanners.map((b: any) => (
                    <div
                      key={b.id}
                      className="group/b flex items-center gap-2.5 p-2.5 rounded-xl border border-border/40 bg-card"
                    >
                      {b.image && (
                        <img src={b.image} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border/30" alt={b.title} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-primary">
                          {(() => {
                            const lang = i18n.language.split("-")[0] || "en";
                            const discount = b.discount;
                            if (!discount) return "";
                            if (typeof discount === "object") return discount[lang] || discount.en || "";
                            try {
                              const parsed = JSON.parse(discount);
                              if (typeof parsed === "object") return parsed[lang] || parsed.en || "";
                              return String(parsed);
                            } catch (e) {
                              return String(discount);
                            }
                          })()}
                        </p>
                        <p className="text-xs font-bold truncate">
                          {(() => {
                            const lang = i18n.language.split("-")[0] || "en";
                            const title = b.title;
                            if (!title) return "";
                            if (typeof title === "object") return title[lang] || title.en || "";
                            try {
                              const parsed = JSON.parse(title);
                              if (typeof parsed === "object") return parsed[lang] || parsed.en || "";
                              return String(parsed);
                            } catch (e) {
                              return String(title);
                            }
                          })()}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10 opacity-0 group-hover/b:opacity-100 shrink-0"
                        onClick={() => handleDeleteBanner(cat.id, b.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
