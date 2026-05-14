import * as React from "react"
import { useTranslation } from "react-i18next"
import { ChevronLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface ProductHeaderProps {
  product: any
  isSaving: boolean
  handleSave: () => void
}

export function ProductHeader({ product, isSaving, handleSave }: ProductHeaderProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b mb-8 -mx-6 md:-mx-8 px-6 md:px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/products")}
          className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {product ? `${t('add_product.title_edit')}: ${typeof product.name === 'string' ? product.name : product.name?.en}` : t('add_product.title_add')}
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('add_product.breadcrumbs.catalog')} / {product ? t('add_product.breadcrumbs.edit') : t('add_product.breadcrumbs.new')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate("/products")} className="rounded-xl border-none bg-muted/50 font-bold">
          {t('add_product.buttons.discard')}
        </Button>
        <Button className="rounded-xl px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2" onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4" /> 
          {isSaving ? t('add_product.buttons.saving') : (product ? t('add_product.buttons.save_edit') : t('add_product.buttons.save_new'))}
        </Button>
      </div>
    </div>
  )
}
