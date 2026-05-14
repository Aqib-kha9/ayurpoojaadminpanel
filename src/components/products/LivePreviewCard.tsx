import * as React from "react"
import { useTranslation } from "react-i18next"
import { Eye, Heart, Zap, ImageIcon } from "lucide-react"

interface LivePreviewCardProps {
  product: any
  formData: any
  dbCategories?: any[]
  thumbnail?: File | null
}

export function LivePreviewCard({ product, formData, dbCategories, thumbnail }: LivePreviewCardProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en' // Get current language from admin setting

  const categoryObj = dbCategories?.find(c => c.id === formData.categoryId)
  const categoryName = categoryObj?.name ? (typeof categoryObj.name === 'string' ? categoryObj.name : (categoryObj.name[lang] || categoryObj.name.en)) : "Category"

  const price = parseFloat(formData.price) || 0;
  const mrp = parseFloat(formData.mrp) || 0;
  const discountPercent = mrp > 0 && price < mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const rating = parseFloat(formData.rating) || 5.0;
  const reviewsCount = parseInt(formData.reviewsCount, 10) || 0;

  const imageUrl = thumbnail ? URL.createObjectURL(thumbnail) : (product?.image || null);
  const badgeText = formData.badge?.[lang] || formData.badge?.en || "";
  const productName = formData.name?.[lang] || formData.name?.en || "Product Name";

  return (
    <div className="space-y-4 sticky top-32 mt-6">
      <div className="flex items-center gap-2 px-1">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Eye className="h-3 w-3 text-primary" />
        </div>
        <h3 className="text-xs font-black uppercase text-primary tracking-widest">{t('add_product.sections.preview.badge', 'LIVE PREVIEW')}</h3>
      </div>
      
      {/* Product Card Replica */}
      <div className="bg-white dark:bg-[#0c0d0e] rounded-[1.2rem] border border-slate-200 dark:border-white/5 p-1.5 shadow-xl overflow-hidden flex flex-col group/card relative mx-auto w-full max-w-[280px] pointer-events-none">
        
        {/* Product Image Carousel */}
        <div className="relative aspect-[5/4] w-full rounded-[0.8rem] bg-slate-50 dark:bg-white/5 overflow-hidden mb-2 shrink-0 group flex items-center justify-center">
          {imageUrl ? (
             <img src={imageUrl} alt={productName} className="object-cover w-full h-full group-hover/card:scale-105 transition-transform duration-700" />
          ) : (
             <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
          )}

          {/* Badge overlay */}
          {badgeText && (
            <div className="absolute top-2 left-2 bg-[#00a86b] text-white px-2.5 py-1 rounded-full shadow-lg">
              <span className="text-[9px] font-black uppercase tracking-wider">{badgeText}</span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="px-1.5 pb-1 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <div className="bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-full">
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-500 dark:text-white/70 shadow-sm">
                {categoryName}
              </span>
            </div>
            <button className="text-slate-300">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-[15px] font-black text-slate-900 dark:text-white leading-[1.15] mb-2 tracking-tight line-clamp-2 min-h-[2.1rem]">
            {productName}
          </h4>

          <div className="flex items-center gap-0.5 text-[#facc15] mb-2.5">
            {[...Array(5)].map((_, i) => (
              <Zap key={i} className={`w-3 h-3 fill-current ${i >= Math.round(rating) ? 'opacity-40' : ''}`} />
            ))}
            <span className="text-slate-400 font-bold text-[10px] ml-1 tracking-tight">({reviewsCount.toLocaleString()})</span>
          </div>

          {/* Dashed Separator */}
          <div className="border-t-2 border-dashed border-slate-100 dark:border-white/10 mb-2.5 mt-auto" />

          <div className="flex items-center justify-between gap-1 pb-1">
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-950 dark:text-white tracking-tighter leading-none">
                ₹{price.toLocaleString()}
              </span>
              {mrp > price && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-slate-400 font-bold line-through">₹{mrp.toLocaleString()}</span>
                  <span className="text-[9px] font-black text-[#00a86b]">
                    {discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>
            
            <button 
              className="h-8 px-5 bg-[#0a0a0a] text-white rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
