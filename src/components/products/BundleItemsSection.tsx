import * as React from "react"
import { useTranslation } from "react-i18next"
import { PackageOpen, Search, Plus, Trash2, Tag } from "lucide-react"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useDebounce } from "@/hooks/useDebounce"

interface BundleItemsSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function BundleItemsSection({ formData, setFormData }: BundleItemsSectionProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)
  const [searchResults, setSearchResults] = React.useState<any[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  // Safely extract English name from string | object | JSON-string
  const getProductName = (name: any): string => {
    if (!name) return "Unknown"
    if (typeof name === 'object') return name.en || Object.values(name)[0] as string || "Unknown"
    try { return JSON.parse(name).en || name } catch { return name }
  }

  // Safely convert Prisma Decimal {s,e,d} or any value to a readable string
  const formatPrice = (val: any): string => {
    if (val === null || val === undefined) return "0"
    if (typeof val === 'number') return val.toFixed(2)
    if (typeof val === 'string') return parseFloat(val).toFixed(2)
    // Prisma Decimal object {s, e, d}
    if (typeof val === 'object' && val.d) {
      const s = val.s === -1 ? "-" : ""
      const d = val.d.join("")
      const e = val.e
      if (e >= 0) {
        const int = d.slice(0, e + 1).padEnd(e + 1, "0")
        const frac = d.slice(e + 1)
        return `${s}${int}${frac ? '.' + frac : '.00'}`
      } else {
        return `${s}0.${"0".repeat(Math.abs(e) - 1)}${d}`
      }
    }
    return String(val)
  }

  // Calculate Raw Value
  const rawValue = formData.bundleItems?.reduce((acc: number, item: any) => {
    return acc + (parseFloat(item.price || 0) * parseInt(item.quantity || 1))
  }, 0) || 0

  React.useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([])
      return
    }
    const fetchSearch = async () => {
      setIsSearching(true)
      try {
        const res = await api.get(`/products?search=${debouncedSearch}&limit=5`)
        // Filter out bundles from being added to bundles to prevent nesting loops
        setSearchResults(res.data.data.products?.filter((p: any) => p.type !== 'BUNDLE') || [])
      } catch (err) {
        console.error("Failed to fetch products for bundle")
      } finally {
        setIsSearching(false)
      }
    }
    fetchSearch()
  }, [debouncedSearch])

  const addBundleItem = (product: any) => {
    const existing = formData.bundleItems?.find((i: any) => i.childId === product.id)
    if (existing) {
       updateQuantity(product.id, existing.quantity + 1)
       return
    }

    const pName = getProductName(product.name)
    
    setFormData((prev: any) => ({
      ...prev,
      bundleItems: [...(prev.bundleItems || []), { 
        childId: product.id, 
        quantity: 1,
        name: pName,
        price: formatPrice(product.price),
        image: product.images?.[0] || product.image
      }]
    }))
    setSearchTerm("")
    setSearchResults([])
  }

  const removeBundleItem = (childId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      bundleItems: (prev.bundleItems || []).filter((i: any) => i.childId !== childId)
    }))
  }

  const updateQuantity = (childId: string, qty: number) => {
    if (qty < 1) return;
    setFormData((prev: any) => ({
      ...prev,
      bundleItems: (prev.bundleItems || []).map((i: any) => i.childId === childId ? { ...i, quantity: qty } : i)
    }))
  }

  return (
    <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
      <div className="bg-muted/10 p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <PackageOpen className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-black italic">{t('add_product.sections.bundle.title', 'Bundle Configuration')}</CardTitle>
        </div>
        <CardDescription>{t('add_product.sections.bundle.desc', 'Select individual products and their quantities to include in this package.')}</CardDescription>
      </div>

      <CardContent className="p-8 space-y-8">
        {/* Search & Add */}
        <div className="relative space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('add_product.sections.bundle.search_products', 'Search Products')}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or sku to add"
              className="pl-10 h-10 border-muted-foreground/20 bg-muted/5 font-medium"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Search Dropdown */}
          {searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-muted-foreground/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
               {isSearching ? (
                 <div className="p-4 text-center text-xs text-muted-foreground">Searching...</div>
               ) : searchResults.length === 0 ? (
                 <div className="p-4 text-center text-xs text-muted-foreground">No valid products found.</div>
               ) : (
                 searchResults.map(p => {
                    const pName = getProductName(p.name)
                    return (
                        <div key={p.id} className="p-3 hover:bg-muted/30 flex items-center justify-between cursor-pointer border-b border-muted-foreground/5 last:border-0" onClick={() => addBundleItem(p)}>
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-muted overflow-hidden">
                                {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover"/> : <Tag className="w-4 h-4 m-2 text-muted-foreground/30"/>}
                             </div>
                             <div className="flex flex-col">
                                <span className="font-bold text-sm leading-none">{pName}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">{p.sku}</span>
                             </div>
                          </div>
                          <span className="font-black text-primary text-sm">₹{formatPrice(p.price)}</span>
                        </div>
                    )
                 })
               )}
            </div>
          )}
        </div>

        {/* Selected Items */}
        <div className="space-y-4">
           {formData.bundleItems?.length === 0 ? (
             <div className="border-2 border-dashed border-muted-foreground/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-muted/5">
                <PackageOpen className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="font-bold text-sm">Empty Package</p>
                <p className="text-xs text-muted-foreground">Search and select items above to build this bundle.</p>
             </div>
           ) : (
             <div className="space-y-2">
                {formData.bundleItems?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-muted-foreground/10 bg-background shadow-sm group">
                     <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <PackageOpen className="w-5 h-5 text-muted-foreground/30"/>}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{item.name}</span>
                            <span className="text-xs text-muted-foreground font-medium">Price: ₹{item.price}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-muted/40 p-1.5 rounded-lg border border-muted-foreground/10">
                           <Button size="icon" variant="ghost" className="h-6 w-6 rounded text-muted-foreground" onClick={() => updateQuantity(item.childId, item.quantity - 1)}>-</Button>
                           <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                           <Button size="icon" variant="ghost" className="h-6 w-6 rounded text-muted-foreground" onClick={() => updateQuantity(item.childId, item.quantity + 1)}>+</Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500/50 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors" onClick={() => removeBundleItem(item.childId)}>
                           <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Calculated Totals */}
        {formData.bundleItems?.length > 0 && (
          <div className="flex justify-between items-center rounded-xl bg-primary/5 p-4 border border-primary/10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground relative z-10">{t('add_product.sections.bundle.total_value', 'Total Calculated Value')}</span>
                 <span className="text-2xl font-black text-primary">₹ {rawValue.toFixed(2)}</span>
              </div>
              <div className="text-right flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('add_product.sections.bundle.package_price', 'Your Package Price')}</span>
                 <span className="text-xl font-bold bg-white px-2 py-1 rounded inline-block mt-1">₹ {parseFloat(formData.price || "0").toFixed(2)}</span>
              </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
