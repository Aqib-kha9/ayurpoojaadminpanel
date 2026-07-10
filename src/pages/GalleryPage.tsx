import * as React from "react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Search,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Loader2,
  Link as LinkIcon,
  Tag,
  ListTree,
  ChevronLeft,
  X,
  Sparkles,
  Eye,
  ArrowLeft,
  ArrowRight,
  Star,
  RotateCcw
} from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface Category {
  id: string
  name: { en: string; hi?: string; te?: string } | string
  slug: string
  parentId?: string | null
  children?: Category[]
}

interface GalleryImage {
  id: string
  url: string
  categoryId: string
  isAssigned: boolean
  createdAt: string
}

interface Product {
  id: string
  name: { en: string; hi?: string; te?: string } | string
  sku: string
  price: number
  images: string[]
}

export default function GalleryPage() {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = React.useState(true)
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set())
  const [selectedL3Category, setSelectedL3Category] = React.useState<Category | null>(null)
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = React.useState(true)

  // Resizable layout width states (VS Code style)
  const [categoryWidth, setCategoryWidth] = React.useState(260)
  const [productWidth, setProductWidth] = React.useState(380)

  // Gallery Images & Products State
  const [galleryImages, setGalleryImages] = React.useState<GalleryImage[]>([])
  const [imagesLoading, setImagesLoading] = React.useState(false)
  const [products, setProducts] = React.useState<Product[]>([])
  const [productsLoading, setProductsLoading] = React.useState(false)

  // Selection state (Bulk selection)
  const [selectedImages, setSelectedImages] = React.useState<GalleryImage[]>([])
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)
  const [activeProductForOrdering, setActiveProductForOrdering] = React.useState<Product | null>(null)

  // Search & Filter State
  const [productSearch, setProductSearch] = React.useState("")
  const [filterNoImageOnly, setFilterNoImageOnly] = React.useState(false)

  // Upload state
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Fetch Categories
  const fetchCategories = React.useCallback(async () => {
    try {
      setCategoriesLoading(true)
      const res = await api.get("/categories")
      setCategories(res.data.data.categories || [])
    } catch (err) {
      toast.error("Failed to load categories")
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Fetch Gallery Images & Products when L3 Category changes
  const fetchGalleryData = React.useCallback(async (categoryId: string) => {
    setImagesLoading(true)
    setProductsLoading(true)
    setSelectedImages([])
    try {
      const [imagesRes, productsRes] = await Promise.all([
        api.get(`/gallery/${categoryId}`),
        api.get(`/products?category=${categoryId}&limit=1000`)
      ])
      setGalleryImages(imagesRes.data.data.images || [])
      
      const fetchedProducts = (productsRes.data.data.products || []).map((p: any) => {
        let imgs: string[] = []
        if (p.images) {
          try {
            imgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images
          } catch {
            imgs = Array.isArray(p.images) ? p.images : []
          }
        }
        return { ...p, images: imgs }
      })
      setProducts(fetchedProducts)
    } catch (err) {
      toast.error("Failed to fetch gallery or products data")
    } finally {
      setImagesLoading(false)
      setProductsLoading(false)
    }
  }, [])

  const handleSelectL3Category = (cat: Category) => {
    setSelectedL3Category(cat)
    fetchGalleryData(cat.id)
  }

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Handle Drag & Drop Upload to Gallery
  const handleDropToGallery = async (e: React.DragEvent) => {
    e.preventDefault()
    if (!selectedL3Category) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedL3Category) return
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const uploadFiles = async (files: File[]) => {
    if (!selectedL3Category) return
    const formData = new FormData()
    formData.append("categoryId", selectedL3Category.id)
    files.forEach(file => {
      formData.append("images", file)
    })

    setUploading(true)
    try {
      const res = await api.post("/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      toast.success(res.data.message || "Images uploaded successfully")
      fetchGalleryData(selectedL3Category.id)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  // Handle Delete Image from Gallery
  const handleDeleteImage = async (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.delete(`/gallery/${imageId}`)
      toast.success("Image deleted from gallery")
      setGalleryImages(prev => prev.filter(img => img.id !== imageId))
      setSelectedImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err) {
      toast.error("Failed to delete image")
    }
  }

  // Visual Linking Trigger (Match/Align - Bulk Supported)
  const linkImagesToProduct = async (imgIds: string[], imgUrls: string[], prodId: string) => {
    try {
      await api.post("/gallery/match", {
        galleryImageIds: imgIds,
        productId: prodId
      })
      toast.success(`${imgIds.length} image(s) aligned successfully! 🚀`)
      
      // Remove linked images from gallery state
      setGalleryImages(prev => prev.filter(img => !imgIds.includes(img.id)))
      // Add images to product's local array state
      setProducts(prev => prev.map(p => {
        if (p.id === prodId) {
          const currentImgs = Array.isArray(p.images) ? p.images : []
          const newImgs = [...currentImgs]
          imgUrls.forEach(url => {
             if (!newImgs.includes(url)) newImgs.push(url)
          })
          return { ...p, images: newImgs }
        }
        return p
      }))

      // Clear from selected images list
      setSelectedImages(prev => prev.filter(img => !imgIds.includes(img.id)))
    } catch (err) {
      toast.error("Failed to link images")
    }
  }

  // HTML5 Drag & Drop: Drag Start
  const handleDragStart = (e: React.DragEvent, img: GalleryImage) => {
    const isAlreadySelected = selectedImages.some(x => x.id === img.id)
    const items = isAlreadySelected ? selectedImages : [img]
    
    e.dataTransfer.setData("text/plain", JSON.stringify({
      ids: items.map(x => x.id),
      urls: items.map(x => x.url)
    }))
  }

  // HTML5 Drag & Drop: Drop on Product Card
  const handleProductDrop = (e: React.DragEvent, productId: string) => {
    e.preventDefault()
    try {
      const dataStr = e.dataTransfer.getData("text/plain")
      if (!dataStr) return
      const { ids, urls } = JSON.parse(dataStr)
      if (ids && urls && ids.length > 0) {
        linkImagesToProduct(ids, urls, productId)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Unlink / Return / Delete an image from product
  const handleUnlinkImage = async (productId: string, imageUrl: string, action: 'return' | 'delete', e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const product = products.find(p => p.id === productId)
    if (!product) return

    try {
      await api.post("/gallery/unlink", {
        productId,
        imageUrl,
        unlinkAction: action
      })
      
      toast.success(action === 'return' ? "Image returned to gallery" : "Image permanently deleted")
      
      // Update local products state
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return { ...p, images: p.images.filter(url => url !== imageUrl) }
        }
        return p
      }))

      // Refresh gallery images if we returned it, so it shows up in gallery
      if (action === 'return' && selectedL3Category) {
        const imagesRes = await api.get(`/gallery/${selectedL3Category.id}`)
        setGalleryImages(imagesRes.data.data.images || [])
      }
    } catch (err) {
      toast.error("Failed to process image unlinking")
    }
  }

  // Save updated images array for product
  const saveProductImageSequence = async (productId: string, updatedImages: string[]) => {
    try {
      await api.patch(`/products/${productId}`, { images: updatedImages })
      // Update local products state
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return { ...p, images: updatedImages }
        }
        return p
      }))
      // Also update the active ordering product modal state to reflect instantly
      setActiveProductForOrdering(prev => {
        if (prev && prev.id === productId) {
          return { ...prev, images: updatedImages }
        }
        return prev
      })
      toast.success("Sequence updated successfully")
    } catch (err) {
      toast.error("Failed to update sequence")
    }
  }

  const handleMakePrimary = async (productId: string, index: number) => {
    const product = products.find(p => p.id === productId)
    if (!product || index === 0) return

    const newImages = [...product.images]
    const [targetImage] = newImages.splice(index, 1)
    newImages.unshift(targetImage) // Move to index 0

    await saveProductImageSequence(productId, newImages)
  }

  const handleMoveImage = async (productId: string, index: number, direction: 'left' | 'right') => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const newImages = [...product.images]
    const targetIndex = direction === 'left' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newImages.length) return

    // Swap elements
    const temp = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = temp

    await saveProductImageSequence(productId, newImages)
  }

  // Drag resizing for Categories (Left Panel)
  const handleCategoryResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = categoryWidth

    const doDrag = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX)
      if (newWidth > 180 && newWidth < 450) {
        setCategoryWidth(newWidth)
      }
    }

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag)
      document.removeEventListener("mouseup", stopDrag)
    }

    document.addEventListener("mousemove", doDrag)
    document.addEventListener("mouseup", stopDrag)
  }

  // Drag resizing for Products (Right Panel)
  const handleProductResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = productWidth

    const doDrag = (moveEvent: MouseEvent) => {
      const newWidth = startWidth - (moveEvent.clientX - startX)
      if (newWidth > 280 && newWidth < 650) {
        setProductWidth(newWidth)
      }
    }

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag)
      document.removeEventListener("mouseup", stopDrag)
    }

    document.addEventListener("mousemove", doDrag)
    document.addEventListener("mouseup", stopDrag)
  }

  // Helper to extract localized name
  const getName = (name: any) => {
    if (typeof name === "object" && name !== null) {
      return name.en || ""
    }
    return String(name || "")
  }

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const nameMatches = getName(p.name).toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase())
    if (filterNoImageOnly) {
      return nameMatches && (!p.images || p.images.length === 0)
    }
    return nameMatches
  })

  // Render recursive category tree
  const renderCategoryNode = (cat: Category, level: number = 1) => {
    const hasChildren = cat.children && cat.children.length > 0
    const isExpanded = expandedCategories.has(cat.id)
    const isSelected = selectedL3Category?.id === cat.id
    const isL3 = level === 3 || !hasChildren

    return (
      <div key={cat.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs cursor-pointer transition-all ${
            isSelected 
              ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
              : isL3 
                ? "hover:bg-accent/60 text-foreground" 
                : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            if (isL3) {
              handleSelectL3Category(cat)
            } else {
              toggleCategory(cat.id)
            }
          }}
          style={{ paddingLeft: `${level * 8}px` }}
        >
          {!isL3 && (
            isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          )}
          <FolderOpen className={`w-3.5 h-3.5 ${isSelected ? "text-primary-foreground" : "text-amber-500"}`} />
          <span className="truncate flex-1">{getName(cat.name)}</span>
          {isL3 && (
            <span className="text-[8px] bg-accent px-1.5 py-0.5 rounded text-accent-foreground font-mono font-bold">L3</span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5">
            {cat.children!.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] min-h-[500px] bg-background border border-border rounded-xl overflow-hidden shadow-sm">
      
      {/* VS Code Style Header Ribbon */}
      <div className="flex justify-between items-center bg-zinc-50 border-b border-border px-4 py-2 flex-shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-zinc-700">WORKSPACE: Product Alignment Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCategorySidebarOpen(!isCategorySidebarOpen)}
            className="h-7 text-xs gap-1.5 px-2 hover:bg-zinc-150"
          >
            <ListTree className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-600">{isCategorySidebarOpen ? "Hide Explorer" : "Show Explorer"}</span>
          </Button>
        </div>
      </div>

      {/* Split Window Workspace (No gaps, thin borders, adjustable) */}
      <div className="flex flex-1 overflow-hidden min-h-0 select-none">
        
        {/* 1. Explorer (Left Panel: Categories) */}
        {isCategorySidebarOpen && (
          <div 
            className="flex flex-col bg-zinc-50/50 flex-shrink-0 h-full overflow-hidden"
            style={{ width: `${categoryWidth}px` }}
          >
            <div className="py-2.5 px-3 border-b border-border flex items-center justify-between bg-zinc-50 flex-shrink-0">
              <span className="text-[10px] font-black tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                <ListTree className="w-3.5 h-3.5 text-primary" />
                Category explorer
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-zinc-200" onClick={() => setIsCategorySidebarOpen(false)}>
                <ChevronLeft className="w-3.5 h-3.5 text-zinc-500" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2.5 custom-scrollbar space-y-1">
              {categoriesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No categories found
                </div>
              ) : (
                categories.map(cat => renderCategoryNode(cat, 1))
              )}
            </div>
          </div>
        )}

        {/* Resizer Handle 1 (VS Code Explorer splitter) */}
        {isCategorySidebarOpen && (
          <div 
            className="w-1 hover:w-1 bg-border hover:bg-primary/60 cursor-col-resize flex-shrink-0 transition-colors duration-150 relative group"
            onMouseDown={handleCategoryResize}
          >
            {/* Extended click zone */}
            <div className="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize z-50"></div>
          </div>
        )}

        {/* 2. Editor Workspace (Center Panel: Unassigned Gallery) */}
        <div className="flex-1 flex flex-col h-full bg-background overflow-hidden min-w-0">
          <div className="py-2 px-4 border-b border-border flex items-center justify-between bg-zinc-50 flex-shrink-0">
            <div>
              <span className="text-[10px] font-black tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                {selectedL3Category ? `${getName(selectedL3Category.name)} Workspace` : "Images Gallery"}
              </span>
            </div>
            {selectedL3Category && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="h-7 text-xs gap-1.5 bg-white shadow-sm border-zinc-200"
              >
                {uploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3" />
                )}
                Upload Images
              </Button>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col min-h-0">
            {!selectedL3Category ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mb-3 text-zinc-300 animate-bounce" />
                <p className="text-xs font-bold text-zinc-800">Select Category to View Images</p>
                <p className="text-[10px] max-w-xs mt-1 text-zinc-500">Pick an L3 category from the Explorer list on the left to start importing and matching images.</p>
              </div>
            ) : (
              <>
                {/* Dropzone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropToGallery}
                  className="border border-dashed border-zinc-200 hover:border-primary/50 transition-all rounded-xl p-3 mb-4 text-center cursor-pointer bg-zinc-50/50 flex flex-col items-center justify-center gap-1 group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 text-zinc-400 group-hover:scale-105 transition-transform" />
                  <p className="text-[11px] font-bold text-zinc-600">Drag & Drop new images here to upload</p>
                </div>

                {/* Images Grid */}
                {imagesLoading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : galleryImages.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mb-2 text-zinc-300" />
                    <p className="text-[11px] font-bold text-zinc-700">No unassigned images</p>
                    <p className="text-[10px] mt-0.5 text-zinc-400">All category images matched to products.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.map(img => {
                      const isSelected = selectedImages.some(x => x.id === img.id)
                      return (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, img)}
                          onClick={() => {
                            setSelectedImages(prev => {
                              const exists = prev.some(x => x.id === img.id)
                              if (exists) {
                                return prev.filter(x => x.id !== img.id)
                              } else {
                                return [...prev, img]
                              }
                            })
                          }}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-grab active:cursor-grabbing border transition-all group ${
                            isSelected 
                              ? "border-primary ring-2 ring-primary/10 shadow-sm scale-[0.98]" 
                              : "border-zinc-200 hover:border-zinc-350 bg-zinc-50 hover:shadow"
                          }`}
                        >
                          <img src={img.url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          
                          {/* Hover Actions in Corners */}
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-7 w-7 rounded-full shadow bg-white/95 hover:bg-white text-zinc-700 hover:scale-105 active:scale-95 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewImage(img.url)
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-7 w-7 rounded-full shadow hover:scale-105 active:scale-95 transition-transform"
                              onClick={(e) => handleDeleteImage(img.id, e)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          {/* Selection Status Badge */}
                          {isSelected && (
                            <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow z-10">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Resizer Handle 2 (VS Code Editor/Split splitter) */}
        <div 
          className="w-1 hover:w-1 bg-border hover:bg-primary/60 cursor-col-resize flex-shrink-0 transition-colors duration-150 relative group"
          onMouseDown={handleProductResize}
        >
          {/* Extended click zone */}
          <div className="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize z-50"></div>
        </div>

        {/* 3. Products List (Right Panel) */}
        <div 
          className="flex flex-col bg-zinc-50/50 flex-shrink-0 h-full overflow-hidden"
          style={{ width: `${productWidth}px` }}
        >
          <div className="py-2.5 px-3 border-b border-border bg-zinc-50 flex-shrink-0">
            <span className="text-[10px] font-black tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              Category Products
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar flex flex-col gap-3 min-h-0">
            {!selectedL3Category ? (
              <div className="flex-1 flex justify-center items-center text-center text-xs text-muted-foreground p-4">
                Select a category folder to load products list
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="space-y-2 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search products or SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-8 h-8 text-xs bg-white border-zinc-200"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="no-image-filter-panel"
                      checked={filterNoImageOnly}
                      onChange={(e) => setFilterNoImageOnly(e.target.checked)}
                      className="rounded border-zinc-300 text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <label htmlFor="no-image-filter-panel" className="text-[11px] font-bold cursor-pointer text-zinc-500">
                      Show products without images only
                    </label>
                  </div>
                </div>

                {/* Selected Item Mapping Info banner */}
                {selectedImages.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 p-2 rounded-lg flex items-center justify-between text-xs animate-pulse flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {selectedImages.slice(0, 3).map((img, i) => (
                          <div key={i} className="w-7 h-7 rounded-full overflow-hidden border border-background bg-white shadow-sm flex-shrink-0">
                            <img src={img.url} alt="Selected" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {selectedImages.length > 3 && (
                          <div className="w-7 h-7 rounded-full border border-background bg-zinc-800 text-[9px] text-white flex items-center justify-center font-bold flex-shrink-0">
                            +{selectedImages.length - 3}
                          </div>
                        )}
                      </div>
                      <p className="truncate font-semibold text-primary">
                        {selectedImages.length} image(s) selected. Click "Link".
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-primary/10" onClick={() => setSelectedImages([])}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}

                {/* Products list */}
                {productsLoading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex-1 text-center py-6 text-xs text-muted-foreground">
                    No matching products found
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-0">
                    {filteredProducts.map(prod => {
                      const imageCount = prod.images?.length || 0
                      return (
                        <div
                          key={prod.id}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleProductDrop(e, prod.id)}
                          className="bg-background border border-zinc-200 hover:border-primary/50 transition-all rounded-lg p-3 flex flex-col gap-2.5 group/product"
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Product main thumbnail */}
                            <div className="w-10 h-10 rounded border flex-shrink-0 overflow-hidden flex items-center justify-center bg-zinc-50">
                              {imageCount > 0 ? (
                                <img src={prod.images[0]} alt="Product" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-zinc-450" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-zinc-800 truncate">{getName(prod.name)}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-zinc-550 font-mono truncate">{prod.sku}</span>
                                <span className="text-[10px] font-bold text-emerald-600">₹{prod.price}</span>
                              </div>
                            </div>

                            {/* Action Link button */}
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {selectedImages.length > 0 ? (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs font-bold gap-1 px-2.5"
                                  onClick={() => linkImagesToProduct(selectedImages.map(x => x.id), selectedImages.map(x => x.url), prod.id)}
                                >
                                  <LinkIcon className="w-3 h-3" />
                                  Link ({selectedImages.length})
                                </Button>
                              ) : (
                                <div className="flex flex-col items-end gap-1 select-none">
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                    imageCount > 0 
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                      : "bg-amber-50 text-amber-600 border border-amber-100"
                                  }`}>
                                    {imageCount} img
                                  </span>
                                  {imageCount > 0 && (
                                    <button
                                      type="button"
                                      className="text-[9px] font-bold text-primary hover:underline cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveProductForOrdering(prod)
                                      }}
                                    >
                                      Adjust Order
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Thumbnails Gallery */}
                          {imageCount > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed border-zinc-200">
                              {prod.images.map((url, index) => (
                                <div key={index} className="relative w-10 h-10 rounded border overflow-hidden bg-white group/thumb">
                                  <img src={url} alt={`product-img-${index}`} className="w-full h-full object-cover" />
                                  
                                  {/* Hover Actions overlay for product thumbnails */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-1 z-10">
                                    {/* Preview */}
                                    <button
                                      type="button"
                                      className="w-4.5 h-4.5 rounded bg-white/95 hover:bg-white text-zinc-700 flex items-center justify-center hover:scale-105 transition-transform"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setPreviewImage(url)
                                      }}
                                      title="Preview Image"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    {/* Return to Gallery */}
                                    <button
                                      type="button"
                                      className="w-4.5 h-4.5 rounded bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center hover:scale-105 transition-transform"
                                      onClick={(e) => handleUnlinkImage(prod.id, url, 'return', e)}
                                      title="Return to Gallery (Unmap)"
                                    >
                                      <RotateCcw className="w-2.5 h-2.5" />
                                    </button>
                                    {/* Permanent Delete */}
                                    <button
                                      type="button"
                                      className="w-4.5 h-4.5 rounded bg-red-600 hover:bg-red-500 text-white flex items-center justify-center hover:scale-105 transition-transform"
                                      onClick={(e) => handleUnlinkImage(prod.id, url, 'delete', e)}
                                      title="Delete Permanently"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
      </div>

      {/* Image Preview Modal (Lightbox) */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[85vh] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[80vh] object-contain select-none" 
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white border-0"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Sequence & Primary Image Reorder Modal */}
      {activeProductForOrdering && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={() => setActiveProductForOrdering(null)}
        >
          <div 
            className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-foreground">Adjust Image Sequence</h3>
                <p className="text-xs text-muted-foreground">{getName(activeProductForOrdering.name)} ({activeProductForOrdering.sku})</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setActiveProductForOrdering(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              <div className="bg-muted/40 border p-3 rounded-xl text-xs text-muted-foreground">
                <span className="font-bold text-primary">💡 Tip:</span> The first image (Index 1) is automatically treated as the **Primary / Thumbnail image** for the product. Use the star icon to set any image as primary, or arrows to reorder.
              </div>

              {activeProductForOrdering.images.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No images linked to this product.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {activeProductForOrdering.images.map((url, idx) => {
                    const isPrimary = idx === 0
                    return (
                      <div 
                        key={idx} 
                        className={`relative rounded-xl border bg-background overflow-hidden p-2 flex flex-col gap-2 group/reorder-card ${
                          isPrimary ? "border-primary ring-2 ring-primary/10" : "border-border"
                        }`}
                      >
                        {/* Image Frame */}
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-50 border">
                          <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-sm text-[9px] font-mono text-white py-0.5 px-1.5 rounded font-bold">
                            Index {idx + 1}
                          </span>
                          
                          {isPrimary && (
                            <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 uppercase">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Primary
                            </span>
                          )}
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          {/* Make Primary */}
                          <Button
                            variant={isPrimary ? "default" : "outline"}
                            size="icon"
                            className={`h-7 w-7 rounded-lg ${isPrimary ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-zinc-500"}`}
                            onClick={() => handleMakePrimary(activeProductForOrdering.id, idx)}
                            disabled={isPrimary}
                            title="Set as Primary Thumbnail"
                          >
                            <Star className={`w-3.5 h-3.5 ${isPrimary ? "fill-current" : ""}`} />
                          </Button>

                          {/* Move Left */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-zinc-500"
                            onClick={() => handleMoveImage(activeProductForOrdering.id, idx, 'left')}
                            disabled={idx === 0}
                            title="Move Left"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Button>

                          {/* Move Right */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-zinc-500"
                            onClick={() => handleMoveImage(activeProductForOrdering.id, idx, 'right')}
                            disabled={idx === activeProductForOrdering.images.length - 1}
                            title="Move Right"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>

                          {/* Return to Gallery */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={(e) => {
                              handleUnlinkImage(activeProductForOrdering.id, url, 'return', e)
                              setActiveProductForOrdering(prev => {
                                if (prev) {
                                  return { ...prev, images: prev.images.filter(x => x !== url) }
                                }
                                return prev
                              })
                            }}
                            title="Return to Gallery (Unmap)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>

                          {/* Delete Permanently */}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={(e) => {
                              handleUnlinkImage(activeProductForOrdering.id, url, 'delete', e)
                              setActiveProductForOrdering(prev => {
                                if (prev) {
                                  return { ...prev, images: prev.images.filter(x => x !== url) }
                                }
                                return prev
                              })
                            }}
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="p-5 border-t bg-muted/20 flex justify-end">
              <Button size="sm" onClick={() => setActiveProductForOrdering(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}
