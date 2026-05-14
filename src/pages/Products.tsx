import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CATEGORIES } from "@/lib/mock-data"
import api from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Check,
  Tag,
  Package,
  Boxes,
  Layers,
  Info,
  PackageOpen,
  FileSpreadsheet
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ImportProductsModal } from "@/components/products/ImportProductsModal"

export default function ProductsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [products, setProducts] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")

  // Modal states
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isImportOpen, setIsImportOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null)

  const fetchProducts = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/products")
      setProducts(res.data.data.products || [])
    } catch {
      console.error("Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Filtering logic
  const filteredProducts = products.filter(product => {
    let pName = ""
    if (typeof product.name === 'string') {
      try { pName = JSON.parse(product.name).en || product.name } catch { pName = product.name }
    } else if (typeof product.name === 'object' && product.name !== null) {
      pName = product.name.en || ""
    }

    const matchesSearch = String(pName).toLowerCase().includes(searchTerm.toLowerCase()) || 
                         String(product.brand?.en || product.brand || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         String(product.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
                         
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Handlers
  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await api.delete(`/products/${selectedProduct.id}`)
        fetchProducts()
        setIsDeleteOpen(false)
        setSelectedProduct(null)
      } catch {
        alert("Failed to delete product")
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("products.title")}</h1>
          <p className="text-muted-foreground">{t("products.subtitle", "Manage comprehensive Ayur Pooja catalog with multi-layered details.")}</p>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          <Button 
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            className="w-full md:w-auto gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" /> {t("products.import", "Import")}
          </Button>
          <Button 
            onClick={() => navigate("/products/add")}
            className="w-full md:w-auto gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> {t("products.add_new")}
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-none bg-primary/5 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{t("products.total_products", "Total Products")}</p>
                  <p className="text-xl font-bold">{products.length}</p>
               </div>
            </CardContent>
         </Card>
         <Card className="border-none bg-amber-500/5 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Boxes className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{t("products.low_stock_alert", "Low Stock Alert")}</p>
                  <p className="text-xl font-bold">{products.filter(p => p.stock < 150).length}</p>
               </div>
            </CardContent>
         </Card>
         <Card className="border-none bg-blue-500/5 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Layers className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{t("common.categories", "Categories")}</p>
                  <p className="text-xl font-bold">{CATEGORIES.length}</p>
               </div>
            </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle>{t("products.catalog_explorer", "Catalog Explorer")}</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t("products.search_placeholder")} 
                  className="pl-8 bg-background border-none shadow-inner" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
                <SelectTrigger className="w-full sm:w-40 border-none shadow-inner bg-background">
                  <SelectValue placeholder={t("products.stock_status", "Stock Status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("products.all_status", "All Status")}</SelectItem>
                  <SelectItem value="active">{t("common.active")}</SelectItem>
                  <SelectItem value="low">{t("products.low_stock", "Low Stock")}</SelectItem>
                  <SelectItem value="out">{t("products.out_of_stock", "Out of Stock")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="w-[80px] pl-6 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t("products.preview", "Preview")}</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t("products.product_brand", "Product & Brand")}</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t("common.category", "Category")}</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t("products.price_unit", "Price & Unit")}</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t("products.inventory", "Inventory")}</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t("common.status")}</TableHead>
                <TableHead className="text-right pr-6 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t("common.action", "Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-bold">
                    <div className="flex justify-center mb-4"><div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>
                    Loading Catalog...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.map((product) => {
                let pName = ""
                if (typeof product.name === 'string') {
                  try { pName = JSON.parse(product.name).en || product.name } catch { pName = product.name }
                } else if (typeof product.name === 'object' && product.name !== null) {
                  pName = product.name.en || ""
                }
                
                const displayImage = product.images?.[0] || product.image

                // Inline decimal helper for list
                const formatDec = (val: any) => {
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

                const catName = typeof product.category?.name === 'object' ? product.category.name.en : 
                                typeof product.category === 'string' ? product.category : 
                                product.category?.name || "General"
                
                return (
                <TableRow key={product.id} className="group hover:bg-muted/30 transition-all">
                  <TableCell className="pl-6 py-4">
                    <div className="relative w-14 h-14">
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden border-2 border-background shadow-md">
                        {displayImage ? (
                          <img src={displayImage} alt={pName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                        )}
                      </div>
                      {product.type === 'BUNDLE' && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-md" title="Package Bundle">
                          <PackageOpen className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-base leading-none">{pName}</span>
                         {product.type === 'BUNDLE' && (
                           <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-200">
                             <PackageOpen className="w-2.5 h-2.5" /> Bundle
                           </span>
                         )}
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-medium">{String(product.brand?.en || product.brand || "Unbranded")}</span>
                          <span className="text-[10px] text-muted-foreground/40">•</span>
                          <span className="text-[10px] font-mono text-muted-foreground/60 tracking-tight">{product.sku}</span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit text-[10px] px-2 py-0 h-5 border-primary/20 bg-primary/5 text-primary">
                           {catName}
                        </Badge>
                       {product.subCategory && <span className="text-[10px] text-muted-foreground pl-1">{product.subCategory}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2">
                          <span className="font-black text-primary">₹{formatDec(product.price)}</span>
                          <span className="text-xs text-muted-foreground line-through opacity-50">₹{formatDec(product.mrp)}</span>
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground/70">{product.unit || "unit"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 w-28">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase">
                         <span className={product.stock < 50 ? "text-rose-600" : "text-emerald-600"}>{formatDec(product.stock)} {t("products.units", "Units")}</span>
                         <span className="text-muted-foreground/40">500 Max</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            product.stock < 50 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : 
                            product.stock < 150 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : 
                            "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          )} 
                          style={{ width: `${Math.min((product.stock / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "border-none px-3 font-bold text-[10px] uppercase tracking-wide",
                        product.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                      )}
                    >
                      {product.status || t("common.active")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-full"
                        )}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 p-2">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => navigate(`/products/view/${product.id}`)} className="gap-2 focus:bg-primary/5">
                            <Info className="h-4 w-4 text-primary" /> {t("common.view_details", "View Full Details")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/products/edit/${product.id}`)} className="gap-2 focus:bg-primary/5">
                            <Edit className="h-4 w-4 text-purple-600" /> {t("common.edit")} {t("products.full_details", "Full Details")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { setSelectedProduct(product); setIsDeleteOpen(true); }} 
                            className="text-destructive gap-2 focus:bg-destructive/10 focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" /> {t("common.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/5 p-4 border-t flex justify-end">
           <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
              <Info className="h-3 w-3" /> {t("products.showing_items", "Showing")} {filteredProducts.length} {t("common.of", "of")} {products.length} {t("products.catalog_items", "catalog items")}
           </div>
        </CardFooter>
      </Card>
      {/* Delete Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">{t("products.confirm_delete", "Archive Distribution?")}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              {t("products.delete_warning", "Are you sure you want to de-list")} <strong>{typeof selectedProduct?.name === 'string' ? selectedProduct?.name : (selectedProduct?.name?.en || 'this item')}</strong> {t("products.delete_warning_cont", "from the catalog? This will halt all active bookings.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="font-bold border-none bg-muted">{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-rose-600 hover:bg-rose-700 font-black px-8">
              {t("common.confirm", "Confirm Archival")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImportProductsModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onSuccess={() => {
          setIsImportOpen(false)
          fetchProducts()
        }} 
      />
    </div>
  )
}
