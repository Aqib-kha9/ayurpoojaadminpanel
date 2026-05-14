import * as React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/lib/api"
import { PRODUCTS } from "@/lib/mock-data"

// Sub-components
import { ProductHeader } from "@/components/products/ProductHeader"
import { BasicInfoSection } from "@/components/products/BasicInfoSection"
import { OrganizationSection } from "@/components/products/OrganizationSection"
import { FmctDetailsSection } from "@/components/products/FmctDetailsSection"
import { PricingInventorySection } from "@/components/products/PricingInventorySection"
import { MediaSection } from "@/components/products/MediaSection"
import { SeoSection } from "@/components/products/SeoSection"
import { BundleItemsSection } from "@/components/products/BundleItemsSection"
import { SidebarSettings } from "@/components/products/SidebarSettings"
import { LivePreviewCard } from "@/components/products/LivePreviewCard"

export default function AddProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()
  
  // Find product if in edit mode
  const [apiProduct, setApiProduct] = React.useState<any>(null)
  const [isFetching, setIsFetching] = React.useState(false)

  // Fetch product from API if ID exists
  React.useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setIsFetching(true)
          const res = await api.get(`/products/${id}`)
          setApiProduct(res.data.data.product)
        } catch (error) {
          console.error("Failed to fetch product for editing", error)
        } finally {
          setIsFetching(false)
        }
      }
      fetchProduct()
    } else {
      setApiProduct(null)
    }
  }, [id])

  const [discountType, setDiscountType] = React.useState("Percentage")
  const [formData, setFormData] = React.useState({
    type: "STANDARD",
    bundleItems: [],
    name: { en: "", hi: "", te: "" },
    brand: { en: "", hi: "", te: "" },
    sku: "",
    description: { en: "", hi: "", te: "" },
    mrp: "",
    price: "",
    stock: "0",
    unit: "pc",
    categoryId: "", // Final specific ID
    l1CategoryId: "", // Root category
    l2CategoryId: "", // Sub category
    l3CategoryId: "", // Sub-sub category
    badge: { en: "", hi: "", te: "" },
    tags: { en: "", hi: "", te: "" },
    rating: "4.5",
    reviewsCount: "0",
    status: "ACTIVE",
    isReturnable: true,
    isCodAllowed: true,
    isCancelable: true,
    totalAllowedQuantity: "",
    discountAmount: "",
    taxAmount: "",
    taxType: "inclusive",
    shippingCost: "",
    shippingWeight: "",
    shippingLength: "",
    shippingWidth: "",
    shippingHeight: "",
    metadata: {
      manufacturer: { en: "", hi: "", te: "" },
      madeIn: { en: "", hi: "", te: "" },
      fssai: "",
      seoTitle: { en: "", hi: "", te: "" },
      seoDesc: { en: "", hi: "", te: "" },
      index: true,
      noindex: false,
      nofollow: false,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      maxSnippet: "-1",
      maxVideoPreview: "-1",
      maxImagePreview: "large",
      dietaryPreference: "veg",
      shelfLife: { en: "", hi: "", te: "" },
      ingredients: { en: "", hi: "", te: "" },
      allergyInfo: { en: "", hi: "", te: "" },
      hsnCode: "",
      barcode: "",
      packType: { en: "", hi: "", te: "" },
      packOf: "1"
    }
  })

  // Translation States
  const [isTranslatingName, setIsTranslatingName] = React.useState(false)
  const [isTranslatingDesc, setIsTranslatingDesc] = React.useState(false)
  const [translatingField, setTranslatingField] = React.useState<string | null>(null)

  // Asset States
  const [images, setImages] = React.useState<File[]>([])
  const [thumbnail, setThumbnail] = React.useState<File | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [dbCategories, setDbCategories] = React.useState<any[]>([])
  const [isLoadingCats, setIsLoadingCats] = React.useState(true)

  // Reconstruct category path if we're editing
  React.useEffect(() => {
    if (formData.categoryId && dbCategories.length > 0 && !formData.l1CategoryId) {
      // Find path in tree: [root, child, grandchild]
      const findPath = (nodes: any[], targetId: string, path: string[] = []): string[] | null => {
        for (const node of nodes) {
          if (node.id === targetId) return [...path, node.id];
          if (node.children) {
            const found = findPath(node.children, targetId, [...path, node.id]);
            if (found) return found;
          }
        }
        return null;
      };

      const path = findPath(dbCategories, formData.categoryId);
      if (path) {
        setFormData(prev => ({
          ...prev,
          l1CategoryId: path[0] || "",
          l2CategoryId: path[1] || "",
          l3CategoryId: path[2] || ""
        }));
      }
    }
  }, [formData.categoryId, dbCategories]);

  // Pre-fill form if editing
  React.useEffect(() => {
    if (apiProduct) {
       const p = apiProduct as any;
       
       // Helper to format Decimal to string
       const fmtDec = (val: any) => {
         if (val === null || val === undefined) return "0"
         if (typeof val === 'object' && val.d) {
           const s = val.s === -1 ? "-" : ""; const d = val.d.join(""); const e = val.e
           if (e >= 0) {
             const int = d.slice(0, e + 1).padEnd(e + 1, "0"); const frac = d.slice(e + 1)
             return frac ? `${s}${int}.${frac}` : `${s}${int}`
           } else {
             return `${s}0.${"0".repeat(Math.abs(e) - 1)}${d}`
           }
         }
         return String(val)
       }

       const getLocalizedObj = (backendField: any) => {
          if (!backendField) return { en: "", hi: "", te: "" }
          if (typeof backendField === 'string') return { en: backendField, hi: backendField, te: backendField }
          return {
             en: backendField.en || "",
             hi: backendField.hi || "",
             te: backendField.te || ""
          }
       }

       setFormData(prev => {
          const transformedMetadata = {
             ...prev.metadata,
             ...(p.metadata || {}),
             shelfLife: getLocalizedObj(p.metadata?.shelfLife),
             ingredients: getLocalizedObj(p.metadata?.ingredients),
             allergyInfo: getLocalizedObj(p.metadata?.allergyInfo),
             packType: getLocalizedObj(p.metadata?.packType),
             manufacturer: getLocalizedObj(p.metadata?.manufacturer),
             madeIn: getLocalizedObj(p.metadata?.madeIn),
             seoTitle: getLocalizedObj(p.metadata?.seoTitle),
             seoDesc: getLocalizedObj(p.metadata?.seoDesc),
          }

          return {
            ...prev,
            ...p,
            mrp: fmtDec(p.mrp),
            price: fmtDec(p.price),
            stock: fmtDec(p.stock),
            rating: fmtDec(p.rating),
            reviewsCount: fmtDec(p.reviewsCount),
            totalAllowedQuantity: fmtDec(p.totalAllowedQuantity || ""),
            shippingWeight: fmtDec(p.shippingWeight),
            shippingLength: fmtDec(p.shippingLength),
            shippingWidth: fmtDec(p.shippingWidth),
            shippingHeight: fmtDec(p.shippingHeight),
            shippingCost: fmtDec(p.shippingCost),
            taxAmount: fmtDec(p.taxAmount),
            discountAmount: fmtDec(p.discountAmount),
            
            bundleItems: p.bundleItems ? p.bundleItems.map((b: any) => {
                const childName = b.child?.name
                const nameStr = (() => {
                    if (!childName) return 'Unknown'
                    if (typeof childName === 'object') return childName.en || Object.values(childName)[0] || 'Unknown'
                    try { return JSON.parse(childName).en || childName } catch { return childName }
                })()
                return {
                    childId: b.childId,
                    quantity: b.quantity,
                    name: nameStr,
                    price: fmtDec(b.child?.price),
                    image: b.child?.images?.[0] || b.child?.image
                }
            }) : [],
            type: p.type || "STANDARD",
            name: getLocalizedObj(p.name),
            brand: getLocalizedObj(p.brand),
            description: getLocalizedObj(p.description),
            badge: getLocalizedObj(p.badge),
            
            tags: (() => {
               const srcArgs = p.tags;
               if (!srcArgs) return { en: "", hi: "", te: "" };
               if (Array.isArray(srcArgs)) return { en: srcArgs.join(', '), hi: "", te: "" };
               return {
                 en: Array.isArray(srcArgs.en) ? srcArgs.en.join(', ') : (srcArgs.en || ""),
                 hi: Array.isArray(srcArgs.hi) ? srcArgs.hi.join(', ') : (srcArgs.hi || ""),
                 te: Array.isArray(srcArgs.te) ? srcArgs.te.join(', ') : (srcArgs.te || "")
               };
            })(),
            
            metadata: transformedMetadata
          }
       });
    }
  }, [apiProduct]);

  // Translation Handlers
  const handleTranslateNameAI = async () => {
    if (!formData.name.en.trim()) return alert(t('add_product.alerts.enter_english_name'))
    try {
      setIsTranslatingName(true)
      const res = await api.post("/categories/translate", { 
        text: formData.name.en, 
        context: "short ecommerce product name" 
      })
      if (res.data.status === "success") {
        const { hi, te } = res.data.data.translations
        setFormData(prev => ({
          ...prev,
          name: { ...prev.name, hi, te }
        }))
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Name translation failed"
      alert(`AI Translation Error: ${msg}`)
    } finally {
      setIsTranslatingName(false)
    }
  }

  const handleTranslateDescriptionAI = async () => {
    const plainText = formData.description.en.replace(/<[^>]*>/g, '').trim()
    if (!plainText) return alert(t('add_product.alerts.enter_english_desc'))
    
    try {
      setIsTranslatingDesc(true)
      const res = await api.post("/categories/translate", { 
        text: formData.description.en,
        context: "long ecommerce product description, PRESERVE ALL HTML TAGS strictly"
      })
      if (res.data.status === "success") {
        const { hi: translatedHi, te: translatedTe } = res.data.data.translations
        setFormData(prev => ({
          ...prev,
          description: { 
            ...prev.description, 
            hi: translatedHi || prev.description.hi, 
            te: translatedTe || prev.description.te 
          }
        }))
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Description translation failed"
      alert(`AI Translation Error: ${msg}`)
    } finally {
      setIsTranslatingDesc(false)
    }
  }

  const handleTranslateFieldAI = async (fieldName: string, text: string, context: string) => {
    if (!text.trim()) return alert(t('add_product.alerts.enter_english_field', { field: fieldName }))
    try {
      setTranslatingField(fieldName)
      const res = await api.post("/categories/translate", { text, context })
      if (res.data.status === "success") {
        const { hi, te } = res.data.data.translations
        
        // Update top-level or metadata-nested localized fields
        if (fieldName === "badge") {
          setFormData(prev => ({ ...prev, badge: { ...prev.badge, hi, te } }))
        } else if (fieldName === "brand") {
          setFormData(prev => ({ ...prev, brand: { ...prev.brand, hi, te } }))
        } else if (fieldName === "tags") {
          setFormData(prev => ({ ...prev, tags: { ...prev.tags, hi, te } }))
        } else {
          setFormData(prev => ({
            ...prev,
            metadata: {
              ...prev.metadata,
              [fieldName]: { en: text, hi, te }
            }
          }))
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || `Translation for ${fieldName} failed`
      alert(`AI Translation Error: ${msg}`)
    } finally {
      setTranslatingField(null)
    }
  }


  // Data Fetching
  React.useEffect(() => {
    const fetchCats = async () => {
      try {
        setIsLoadingCats(true)
        const response = await api.get("/categories")
        setDbCategories(response.data.data.categories)
      } catch (err) {
      } finally {
        setIsLoadingCats(false)
      }
    }
    fetchCats()
  }, [])

  // Save Handler
  const handleSave = async () => {
    try {
      setIsSaving(true)
      const data = new FormData()
      data.append("name", JSON.stringify(formData.name))
      data.append("description", JSON.stringify(formData.description))
      data.append("brand", JSON.stringify(formData.brand))
      data.append("sku", formData.sku)
      data.append("type", formData.type)
      data.append("bundleItems", JSON.stringify(formData.bundleItems))
      data.append("mrp", formData.mrp)
      data.append("price", formData.price)
      data.append("stock", formData.stock)
      data.append("unit", formData.unit)
      data.append("categoryId", formData.categoryId)
      data.append("badge", JSON.stringify(formData.badge))
      
      // Process multilingual tags into arrays
      const processedTags = {
        en: formData.tags.en.split(',').map(t => t.trim()).filter(t => t),
        hi: formData.tags.hi.split(',').map(t => t.trim()).filter(t => t),
        te: formData.tags.te.split(',').map(t => t.trim()).filter(t => t)
      }
      data.append("tags", JSON.stringify(processedTags))
      data.append("rating", formData.rating)
      data.append("reviewsCount", formData.reviewsCount)
      data.append("status", formData.status)

      data.append("isReturnable", String(formData.isReturnable))
      data.append("isCodAllowed", String(formData.isCodAllowed))
      data.append("isCancelable", String(formData.isCancelable))
      if (formData.totalAllowedQuantity) data.append("totalAllowedQuantity", formData.totalAllowedQuantity)
      
      if (formData.discountAmount) {
         data.append("discountAmount", formData.discountAmount)
         data.append("discountType", discountType)
      }
      if (formData.taxAmount) {
         data.append("taxAmount", formData.taxAmount)
         data.append("taxType", formData.taxType)
      }
      if (formData.shippingCost) data.append("shippingCost", formData.shippingCost)
      if (formData.shippingWeight) data.append("shippingWeight", formData.shippingWeight)
      if (formData.shippingLength) data.append("shippingLength", formData.shippingLength)
      if (formData.shippingWidth) data.append("shippingWidth", formData.shippingWidth)
      if (formData.shippingHeight) data.append("shippingHeight", formData.shippingHeight)
      
      data.append("metadata", JSON.stringify(formData.metadata))

      if (thumbnail) data.append("images", thumbnail)
      images.forEach(img => data.append("images", img))

      if (id) {
        await api.patch(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } })
      } else {
        await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } })
      }
      
      navigate("/products")
    } catch (error) {
      alert(t('add_product.alerts.save_failed'))
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-500">
      <ProductHeader product={apiProduct} isSaving={isSaving} handleSave={handleSave} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-4">
             <button
                onClick={() => setFormData(prev => ({ ...prev, type: 'STANDARD' }))}
                className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${formData.type === 'STANDARD' ? 'border-primary bg-primary/5 text-primary' : 'border-muted bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
             >Standard Product</button>
             <button
                onClick={() => setFormData(prev => ({ ...prev, type: 'BUNDLE' }))}
                className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${formData.type === 'BUNDLE' ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600' : 'border-muted bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
             >Package Bundle</button>
          </div>

          <BasicInfoSection 
            formData={formData} 
            setFormData={setFormData}
            isTranslatingName={isTranslatingName}
            isTranslatingDesc={isTranslatingDesc}
            translatingField={translatingField}
            handleTranslateNameAI={handleTranslateNameAI}
            handleTranslateDescriptionAI={handleTranslateDescriptionAI}
            handleTranslateFieldAI={handleTranslateFieldAI}
          />
          
          {formData.type === 'BUNDLE' && (
             <BundleItemsSection formData={formData} setFormData={setFormData} />
          )}

          <OrganizationSection 
            formData={formData} 
            setFormData={setFormData} 
            dbCategories={dbCategories} 
            product={apiProduct} 
            handleTranslateFieldAI={handleTranslateFieldAI}
            isLoadingCats={isLoadingCats}
          />

          <FmctDetailsSection 
            formData={formData} 
            setFormData={setFormData}
            translatingField={translatingField}
            handleTranslateFieldAI={handleTranslateFieldAI}
          />

          <PricingInventorySection 
            formData={formData} 
            setFormData={setFormData}
            discountType={discountType}
            setDiscountType={setDiscountType}
          />

          <MediaSection 
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            images={images}
            setImages={setImages}
            existingImages={apiProduct?.images || []}
          />

          <SeoSection 
            formData={formData} 
            setFormData={setFormData} 
            handleTranslateFieldAI={handleTranslateFieldAI}
          />
        </div>

        <div className="space-y-8">
          <SidebarSettings 
            formData={formData} 
            setFormData={setFormData} 
            handleTranslateFieldAI={handleTranslateFieldAI}
          />
          <LivePreviewCard 
            product={apiProduct} 
            formData={formData} 
            dbCategories={dbCategories}
            thumbnail={thumbnail}
          />
        </div>
      </div>
    </div>
  )
}
