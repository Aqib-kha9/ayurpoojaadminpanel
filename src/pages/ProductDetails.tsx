import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  ChevronLeft, 
  Edit, 
  Tag, 
  Package, 
  DollarSign, 
  Leaf, 
  Globe, 
  Info,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  Search,
  Box,
  ShoppingCart,
  PackageOpen
} from "lucide-react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || "en"
  
  const [product, setProduct] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState(currentLang)
  const [activeImage, setActiveImage] = React.useState(0)

  // Sync activeTab when global language changes
  React.useEffect(() => {
    setActiveTab(currentLang)
  }, [currentLang])

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.data.product)
        setActiveImage(0)
      } catch (error) {
        console.error("Failed to fetch product", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Robust formatting helpers
  const formatValue = (val: any) => {
    if (val === null || val === undefined) return "0"
    if (typeof val === 'object') {
       if (val.d && Array.isArray(val.d)) { // Prisma Decimal
          const s = val.s === -1 ? "-" : ""
          const d = val.d.join("")
          const e = val.e
          if (e >= 0) {
             const integerPart = d.slice(0, e + 1).padEnd(e + 1, "0")
             const fractionalPart = d.slice(e + 1)
             return fractionalPart ? `${s}${integerPart}.${fractionalPart}` : `${s}${integerPart}`
          } else {
             const absE = Math.abs(e)
             return `${s}0.${"0".repeat(absE - 1)}${d}`
          }
       }
       return "0"
    }
    return String(val)
  }

  const getLocalized = (field: any, lang: string) => {
    if (!field) return ""
    if (typeof field === 'string') return field
    return field[lang] || field.en || ""
  }

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Product Specs...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-2">
            <Info className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black">Product Not Found</h2>
        <Button onClick={() => navigate("/products")} variant="outline" className="rounded-xl">Go Back to Catalog</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/products")}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Badge className="bg-primary/10 text-primary border-none pointer-events-none uppercase text-[9px] font-black tracking-widest italic px-2">Product ID: {product.id.split('-')[0]}</Badge>
               {product.status === "ACTIVE" ? (
                 <Badge className="bg-emerald-500/10 text-emerald-600 border-none uppercase text-[9px] font-black tracking-widest px-2">Ready for Sale</Badge>
               ) : (
                 <Badge className="bg-rose-500/10 text-rose-600 border-none uppercase text-[9px] font-black tracking-widest px-2">De-listed</Badge>
               )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{getLocalized(product.name, currentLang)}</h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" /> 
              {getLocalized(product.category?.name, currentLang) || "General Catalog"} 
              <ArrowRight className="h-3 w-3" /> 
              {product.sku}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/products")} 
            className="rounded-2xl h-12 px-6 font-bold border-none bg-muted/50"
          >
            Back to List
          </Button>
          <Button 
            onClick={() => navigate(`/products/edit/${product.id}`)}
            className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
          >
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - VISUALS & CORE INFO */}
        <div className="lg:col-span-2 space-y-8">
            
            <Card className="border-none shadow-2xl overflow-hidden glassmorphism border border-white/5">
               <CardContent className="p-0">
                  <div className="flex flex-col xl:flex-row">
                     {/* Dynamic Gallery */}
                     <div className="flex-1 bg-muted/20 p-6 md:p-10 flex flex-col items-center justify-center gap-6 group relative">
                        <div className="w-full aspect-square md:max-w-md flex items-center justify-center relative">
                           <img 
                             src={product.images?.[activeImage] || product.image || "/placeholder.png"} 
                             alt="Product View" 
                             className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 drop-shadow-2xl" 
                           />
                           <div className="absolute bottom-0 left-0">
                              <Badge className="bg-black/60 backdrop-blur-md text-white border-none font-bold italic text-[10px]">
                                 {activeImage === 0 ? "PRIMARY ASSET" : `VIEW ${activeImage + 1}`}
                              </Badge>
                           </div>
                        </div>
                        
                        {/* Thumbnails Row */}
                        {product.images && product.images.length > 1 && (
                           <div className="flex flex-wrap justify-center gap-3 mt-4">
                              {product.images.map((img: string, idx: number) => (
                                 <button
                                   key={idx}
                                   onClick={() => setActiveImage(idx)}
                                   className={cn(
                                     "w-14 h-14 rounded-xl border-2 transition-all overflow-hidden bg-white",
                                     activeImage === idx ? "border-primary shadow-lg scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                   )}
                                 >
                                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                 </button>
                              ))}
                           </div>
                        )}
                     </div>

                     <div className="p-8 xl:w-[350px] flex flex-col justify-center gap-6 bg-card/40 backdrop-blur-3xl border-t xl:border-t-0 xl:border-l border-white/10">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Brand Authority</p>
                           <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/40 leading-tight">
                              {getLocalized(product.brand, currentLang)}
                           </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                           <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10">
                              <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Standard MRP</p>
                              <p className="text-xl font-black italic">₹{formatValue(product.mrp)}</p>
                           </div>
                           <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
                              <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Selling Value</p>
                              <div className="flex items-baseline gap-2">
                                 <p className="text-xl font-black text-emerald-600 italic">₹{formatValue(product.price)}</p>
                                 {product.discountAmount && (
                                    <Badge variant="outline" className="text-[10px] h-5 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-black italic">
                                       -{formatValue(product.discountAmount)}{product.discountType === 'Percentage' ? '%' : '₹'}
                                    </Badge>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 xl:grid-cols-1 gap-4 pt-2">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                                 <Box className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Stock</p>
                                 <p className="font-bold text-sm">{formatValue(product.stock)} {product.unit}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                                 <Tag className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">SKU</p>
                                 <p className="font-bold font-mono text-xs tracking-tighter overflow-hidden text-ellipsis">{product.sku}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Multilingual Content Sheet */}
            <Card className="border-none shadow-xl">
               <CardHeader className="border-b border-muted/30 pb-0">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                           <Globe className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-xl font-black italic">Content Profile</CardTitle>
                     </div>
                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                        <TabsList className="bg-muted/50 p-1 rounded-xl h-10">
                           <TabsTrigger value="en" className="rounded-lg font-black text-[10px] uppercase tracking-wider px-4">English</TabsTrigger>
                           <TabsTrigger value="hi" className="rounded-lg font-black text-[10px] uppercase tracking-wider px-4">हिंदी</TabsTrigger>
                           <TabsTrigger value="te" className="rounded-lg font-black text-[10px] uppercase tracking-wider px-4">తెలుగు</TabsTrigger>
                        </TabsList>
                     </Tabs>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                     <TabsContent value="en" className="space-y-6 mt-0 animate-in fade-in duration-300">
                        <div>
                           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Full Display Name</p>
                           <h3 className="text-2xl font-bold">{getLocalized(product.name, 'en') || "No English Name"}</h3>
                        </div>
                        <Separator className="bg-muted-foreground/5" />
                        <div>
                           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Product Narrative</p>
                           <div 
                             className="prose prose-sm max-w-none prose-headings:font-black prose-p:leading-relaxed text-foreground/80"
                             dangerouslySetInnerHTML={{ __html: getLocalized(product.description, 'en') || "No description provided." }}
                           />
                        </div>
                        {getLocalized(product.badge, 'en') && (
                           <div className="pt-4">
                              <Badge className="bg-primary hover:bg-primary font-black italic px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                                 {getLocalized(product.badge, 'en')}
                              </Badge>
                           </div>
                        )}
                     </TabsContent>
                     {/* Repeat for HI and TE with localized fields */}
                     <TabsContent value="hi" className="space-y-6 mt-0 animate-in fade-in duration-300">
                        <div>
                           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Display Name (Hindi)</p>
                           <h3 className="text-2xl font-bold">{getLocalized(product.name, 'hi') || "हिंदी नाम उपलब्ध नहीं है"}</h3>
                        </div>
                        <Separator className="bg-muted-foreground/5" />
                        <div>
                           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Narrative (Hindi)</p>
                           <div 
                             className="prose prose-sm max-w-none text-foreground/80"
                             dangerouslySetInnerHTML={{ __html: getLocalized(product.description, 'hi') || "कोई विवरण उपलब्ध नहीं है।" }}
                           />
                        </div>
                     </TabsContent>
                     <TabsContent value="te" className="space-y-6 mt-0 animate-in fade-in duration-300">
                        <div>
                           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Display Name (Telugu)</p>
                           <h3 className="text-2xl font-bold">{getLocalized(product.name, 'te') || "తెలుగు పేరు అందుబాటులో లేదు"}</h3>
                        </div>
                        <Separator className="bg-muted-foreground/5" />
                        <div>
                           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Narrative (Telugu)</p>
                           <div 
                             className="prose prose-sm max-w-none text-foreground/80"
                             dangerouslySetInnerHTML={{ __html: getLocalized(product.description, 'te') || "వివరణ అందుబాటులో లేదు." }}
                           />
                        </div>
                     </TabsContent>
                  </Tabs>
               </CardContent>
            </Card>
        </div>

          {/* Bundle Contents — only shown for BUNDLE type products */}
          {product.type === 'BUNDLE' && product.bundleItems && product.bundleItems.length > 0 && (
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="bg-indigo-500/5 p-8 border-b border-indigo-500/10">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <PackageOpen className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-xl font-black italic">Bundle Contents</CardTitle>
                  <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-indigo-500/10 text-indigo-600 px-2 py-1 rounded-full">
                    {product.bundleItems.length} {product.bundleItems.length === 1 ? 'Item' : 'Items'} Included
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">All products included in this package bundle.</p>
              </div>
              <CardContent className="p-6 space-y-3">
                {product.bundleItems.map((item: any, idx: number) => {
                  const childName = getLocalized(item.child?.name, currentLang)
                  const childImage = item.child?.images?.[0] || item.child?.image
                  const childPrice = formatValue(item.child?.price)
                  const subtotal = (parseFloat(childPrice) * item.quantity).toFixed(2)
                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-muted-foreground/5 hover:bg-indigo-500/5 hover:border-indigo-500/10 transition-all group">
                      <div className="w-16 h-16 rounded-xl bg-white border border-muted-foreground/10 overflow-hidden shadow-sm flex-shrink-0">
                        {childImage ? (
                          <img src={childImage} alt={childName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{childName}</p>
                        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-tight">{item.child?.sku}</p>
                        <p className="text-xs text-muted-foreground font-medium">Unit Price: ₹{childPrice}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Qty</span>
                        <span className="font-black text-lg text-indigo-600 leading-none">{item.quantity}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0 pl-4 border-l border-muted-foreground/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subtotal</span>
                        <span className="font-black text-base text-primary">₹{subtotal}</span>
                      </div>
                    </div>
                  )
                })}

                {/* Total Raw Value Footer */}
                <div className="mt-4 pt-4 border-t border-indigo-500/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Raw Value</p>
                    <p className="text-2xl font-black text-muted-foreground/70">
                      ₹{product.bundleItems.reduce((acc: number, item: any) => {
                          return acc + (parseFloat(formatValue(item.child?.price)) * item.quantity)
                        }, 0).toFixed(2)
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bundle Price</p>
                    <p className="text-2xl font-black text-emerald-600">₹{formatValue(product.price)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        {/* RIGHT COLUMN - SPECS & LOGISTICS */}
        <div className="space-y-8">
            
            {/* FMCG Specifications Card */}
            <Card className="border-none shadow-xl bg-green-500/5">
               <CardHeader>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                        <Leaf className="h-4 w-4" />
                     </div>
                     <CardTitle className="text-lg font-black italic uppercase italic tracking-tighter">FMCG Intelligence</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="space-y-6">
                  {product.metadata?.fssai && (
                     <div className="p-4 rounded-2xl bg-white/50 border border-green-500/10">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 flex items-center gap-1">
                           <ShieldCheck className="h-3 w-3 text-green-600" /> FSSAI License No.
                        </p>
                        <p className="font-mono font-black text-green-700 tracking-widest uppercase">{product.metadata.fssai}</p>
                     </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1"><Calendar className="h-2.5 w-2.5" /> Shelf Life</p>
                        <p className="text-sm font-bold">{getLocalized(product.metadata?.shelfLife, currentLang) || "Standard"}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1"><Leaf className="h-2.5 w-2.5" /> Dietary</p>
                        <Badge className={cn(
                           "uppercase text-[10px] font-black",
                           product.metadata?.dietaryPreference === 'veg' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        )}>
                           {product.metadata?.dietaryPreference || "Not Set"}
                        </Badge>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Manufacturer</p>
                        <p className="text-xs font-bold">{getLocalized(product.metadata?.manufacturer, currentLang) || "N/A"}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Made In</p>
                        <p className="text-xs font-bold">{getLocalized(product.metadata?.madeIn, currentLang) || "India"}</p>
                     </div>
                  </div>
                  <Separator className="bg-green-500/10" />
                  <div className="space-y-4 text-xs">
                     <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Ingredients Preview</p>
                        <p className="line-clamp-4 leading-relaxed text-muted-foreground font-medium">
                           {getLocalized(product.metadata?.ingredients, currentLang) || "Recipe details not disclosed."}
                        </p>
                     </div>
                     {getLocalized(product.metadata?.allergyInfo, currentLang) && (
                        <div>
                           <p className="text-[9px] font-black text-rose-600 uppercase mb-2 uppercase italic tracking-tighter">⚠️ Allergen Alert</p>
                           <p className="leading-relaxed text-muted-foreground font-bold italic">
                              {getLocalized(product.metadata?.allergyInfo, currentLang)}
                           </p>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
               <CardHeader>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <Truck className="h-4 w-4" />
                     </div>
                     <CardTitle className="text-lg font-black italic uppercase italic tracking-tighter">Physical Profile</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 rounded-2xl bg-muted/30">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Net Weight</p>
                        <p className="text-sm font-bold">{formatValue(product.shippingWeight || 0)}g</p>
                     </div>
                     <div className="p-3 rounded-2xl bg-muted/30">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Pack Of</p>
                        <p className="text-sm font-bold">{product.metadata?.packOf || "1"}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                     <div className="flex items-center justify-between font-black italic text-primary">
                        <span className="text-[10px] uppercase tracking-widest">Order Limit (Max)</span>
                        <span className="text-sm">{formatValue(product.totalAllowedQuantity) || "No Limit"}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Packaging</span>
                        <span className="text-sm font-bold">{getLocalized(product.metadata?.packType, currentLang) || "Standard"}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Dimensions (LxWxH)</span>
                        <span className="text-[11px] font-bold">
                           {formatValue(product.shippingLength || 0)}x{formatValue(product.shippingWidth || 0)}x{formatValue(product.shippingHeight || 0)} cm
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Barcode / EAN</span>
                        <span className="text-[11px] font-mono font-bold tracking-tight">{product.metadata?.barcode || "N/A"}</span>
                     </div>
                     <Separator className="bg-muted-foreground/5" />
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Hsn Code</span>
                        <span className="text-sm font-mono font-bold tracking-widest">{product.metadata?.hsnCode || "N/A"}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Tax Type ({product.taxType || "Inc"})</span>
                        <span className="text-sm font-bold">₹{formatValue(product.taxAmount || 0)}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Shipping Fee</span>
                        <span className="text-sm font-bold">₹{formatValue(product.shippingCost || 0)}</span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-muted/50">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Purchase Rules</p>
                           <p className="text-[10px] font-bold">
                              {product.isReturnable ? "Returnable" : "No Returns"} • {product.isCodAllowed ? "COD" : "Prepaid"} • {product.isCancelable ? "Cancelable" : "No Cancel"}
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* SEO Preview Card */}
            <Card className="border-none shadow-xl bg-purple-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <Search className="h-4 w-4" />
                     </div>
                     <CardTitle className="text-lg font-black italic uppercase italic tracking-tighter">SEO & Social Card</CardTitle>
                  </div>
               </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-purple-500/10">
                     <p className="text-[10px] font-bold text-[#1a0dab] mb-1 truncate">{getLocalized(product.metadata?.seoTitle, currentLang) || getLocalized(product.name, currentLang)}</p>
                     <p className="text-[10px] text-[#006621] mb-1">lovishshoppers.com › product › {product.slug}</p>
                     <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">
                        {getLocalized(product.metadata?.seoDesc, currentLang) || "Preview of how your product appears in Google search results."}
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                     {product.tags && (typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags)[activeTab]?.map((tag: any, i: number) => (
                        <Badge key={i} variant="outline" className="text-[9px] font-black uppercase text-purple-600/70 border-purple-600/20 bg-purple-600/5">
                           #{tag}
                        </Badge>
                     ))}
                  </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
