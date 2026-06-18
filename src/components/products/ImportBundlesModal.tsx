import * as React from "react"
import { useTranslation } from "react-i18next"
import * as xlsx from "xlsx"
import api from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UploadCloud, Download, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface ImportBundlesModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportBundlesModal({ isOpen, onClose, onSuccess }: ImportBundlesModalProps) {
  const { t } = useTranslation()
  const [file, setFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadResult, setUploadResult] = React.useState<{
    status: 'idle' | 'success' | 'error'
    message?: string
    details?: any
  }>({ status: 'idle' })

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [isDownloadingTemplate, setIsDownloadingTemplate] = React.useState(false)

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true)
      
      const headers = [
        "Category ID", "Bundle SKU", "Name (EN)", "Name (HI)", "Name (TE)",
        "Bundle Items (SKU:Qty, ...)",
        "Brand (EN)", "Brand (HI)", "Brand (TE)", "Description (EN)", "Description (HI)", "Description (TE)",
        "Price", "MRP", "Stock", "Unit", "Status",
        "Badge (EN)", "Badge (HI)", "Badge (TE)",
        "Tags (EN)", "Tags (HI)", "Tags (TE)",
        "Rating", "Reviews Count", "Is Returnable", "Is COD Allowed", "Is Cancelable",
        "Discount Amount", "Discount Type", "Tax Amount", "Tax Type",
        "Shipping Cost", "Shipping Weight", "Shipping Length", "Shipping Width", "Shipping Height",
        "Total Allowed Quantity",
        "Manufacturer (EN)", "Manufacturer (HI)", "Manufacturer (TE)",
        "Made In (EN)", "Made In (HI)", "Made In (TE)",
        "FSSAI",
        "SEO Title (EN)", "SEO Title (HI)", "SEO Title (TE)",
        "SEO Desc (EN)", "SEO Desc (HI)", "SEO Desc (TE)",
        "SEO Index", "SEO NoIndex", "SEO NoFollow", "SEO NoArchive", "SEO NoSnippet", "SEO NoImageIndex",
        "SEO Max Snippet", "SEO Max Video Preview", "SEO Max Image Preview",
        "Dietary Preference",
        "Shelf Life (EN)", "Shelf Life (HI)", "Shelf Life (TE)",
        "Ingredients (EN)", "Ingredients (HI)", "Ingredients (TE)",
        "Allergy Info (EN)", "Allergy Info (HI)", "Allergy Info (TE)",
        "HSN Code", "Barcode",
        "Pack Type (EN)", "Pack Type (HI)", "Pack Type (TE)",
        "Pack Of",
        "Images URLs (comma separated)"
      ]

      // Fetch actual categories to include as a reference sheet
      const categoriesResponse = await api.get('/categories?limit=1000')
      const categories = categoriesResponse.data.data?.categories || []
      const firstCategory = categories.length > 0 ? categories[0] : null
      const exampleCatId = firstCategory ? firstCategory.id : "your-category-id-here"

      // Fetch actual products to include as a reference sheet
      const productsResponse = await api.get('/products?limit=5000&type=STANDARD')
      const products = productsResponse.data.data?.products || []
      const firstProduct = products.length > 0 ? products[0] : null
      const exampleSku = firstProduct ? firstProduct.sku : "SKU-EX-001"

      const instructions = [
        "INSTRUCTIONS (Do not edit this row)", 
        "Required. Unique stock keeping unit for the bundle. Used to track inventory. Must be completely unique across all products.",
        "Required. Bundle name in English. This is the primary title displayed to users.",
        "Optional. Hindi name for localizing the bundle title.",
        "Optional. Telugu name for localizing the bundle title.",
        "Required. Comma separated list of child SKUs with quantities (e.g. SKU1:2, SKU2:1). These are the individual products that make up this bundle.",
        "Optional. Brand name in English. Helps users filter by brand.",
        "Optional. Hindi brand.",
        "Optional. Telugu brand.",
        "Optional. Full description in English. Shown on the bundle details page.",
        "Optional. Hindi description.",
        "Optional. Telugu description.",
        "Required. Selling price (e.g. 199). This is the final price the customer pays for the whole bundle.",
        "Optional. Original price (MRP) (e.g. 250). Used to calculate and display the discount percentage.",
        "Optional. Current inventory count for the bundle as a whole.",
        "Required. Selling unit. Options: 'pc', 'kg', 'g', 'L', 'ml', 'box', 'packet'. Indicates how the bundle is measured.",
        "Optional. Options: 'DRAFT', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'. Default: ACTIVE. Determines visibility on the storefront.",
        "Optional. Promotional badge (e.g. 'New', 'Best Value'). Shown as a tag on the bundle card.",
        "Optional. Hindi badge.",
        "Optional. Telugu badge.",
        "Optional. Comma separated tags (e.g. 'gift, festive'). Used for search and categorization.",
        "Optional. Comma separated tags in Hindi.",
        "Optional. Comma separated tags in Telugu.",
        "Optional. Default 4.5. Initial or overridden rating out of 5.",
        "Optional. Number of reviews. Used for display purposes.",
        "Optional. 'true' or 'false'. Indicates if the customer can return this bundle after purchase.",
        "Optional. 'true' or 'false'. Indicates if Cash on Delivery is allowed for this bundle.",
        "Optional. 'true' or 'false'. Indicates if the order can be canceled before shipping.",
        "Optional. Value of discount. Used in conjunction with Discount Type.",
        "Optional. Options: 'Percentage' or 'Flat'. How the discount is applied.",
        "Optional. Tax value (e.g. 18 for 18%).",
        "Optional. Options: 'inclusive' or 'exclusive'. Whether the selling price already includes this tax.",
        "Optional. Shipping cost. Flat rate shipping fee for this bundle.",
        "Optional. Shipping weight in kg. Used to calculate dynamic shipping rates.",
        "Optional. Length in cm. Used for volumetric weight calculations.",
        "Optional. Width in cm. Used for volumetric weight calculations.",
        "Optional. Height in cm. Used for volumetric weight calculations.",
        "Optional. Max qty a user can buy in a single order.",
        "Optional. Manufacturer name. For legal and informational compliance.",
        "Optional. Manufacturer name in Hindi.",
        "Optional. Manufacturer name in Telugu.",
        "Optional. Country of origin (e.g. 'India'). Required for many e-commerce platforms.",
        "Optional. Country of origin in Hindi.",
        "Optional. Country of origin in Telugu.",
        "Optional. FSSAI License No. Required for food items in the bundle.",
        "Optional. SEO Title. Overrides the default page title for better search engine ranking.",
        "Optional. SEO Title in Hindi.",
        "Optional. SEO Title in Telugu.",
        "Optional. SEO Description. Meta description for search engines.",
        "Optional. SEO Description in Hindi.",
        "Optional. SEO Description in Telugu.",
        "Optional. 'true' or 'false'. If true, allows search engines to index the page.",
        "Optional. 'true' or 'false'. If true, instructs search engines not to index the page.",
        "Optional. 'true' or 'false'. If true, instructs search engines not to follow links on the page.",
        "Optional. 'true' or 'false'. If true, prevents search engines from showing a cached link.",
        "Optional. 'true' or 'false'. If true, prevents search engines from displaying a snippet.",
        "Optional. 'true' or 'false'. If true, prevents search engines from indexing images.",
        "Optional. -1 for unlimited. Max length of snippet in search results.",
        "Optional. -1 for unlimited. Max length of video preview.",
        "Optional. e.g. 'large'. Max size of image preview.",
        "Optional. Options: 'veg', 'non-veg', 'vegan', 'egg'. Shows the dietary icon for the bundle.",
        "Optional. e.g. '6 months'. Shelf life of the products in the bundle.",
        "Optional. Shelf life in Hindi.",
        "Optional. Shelf life in Telugu.",
        "Optional. Comma separated. List of ingredients across the bundle.",
        "Optional. Ingredients in Hindi.",
        "Optional. Ingredients in Telugu.",
        "Optional. Allergy info (e.g. 'Contains Nuts'). Warnings for customers.",
        "Optional. Allergy info in Hindi.",
        "Optional. Allergy info in Telugu.",
        "Optional. Tax classification code (HSN). Used for GST/Tax reporting.",
        "Optional. Product barcode (UPC/EAN). Used for scanning and inventory.",
        "Optional. e.g. 'Box', 'Basket', 'Hamper'. Type of packaging.",
        "Optional. Pack type in Hindi.",
        "Optional. Pack type in Telugu.",
        "Optional. Number of items inside the pack.",
        "Optional. Comma separated direct image URLs. Images will be downloaded and saved."
      ]

      const sampleData = [
        exampleCatId, "BNDL-EX-001", "Example Bundle", "उदाहरण बंडल", "ఉదాహరణ బండిల్",
        `${exampleSku}:2, ANOTHER-SKU:1`,
        "Example Brand", "", "", "This is a great bundle.", "", "",
        "199", "250", "50", "pc", "ACTIVE",
        "New", "", "",
        "bundle, offer", "", "",
        "4.8", "15", "true", "true", "true",
        "10", "Percentage", "5", "inclusive",
        "0", "1.5", "20", "20", "15",
        "5",
        "Example Mfg", "", "",
        "India", "", "",
        "FSSAI123456789",
        "Buy Example Bundle Online", "", "",
        "Get the best deals on Example Bundle.", "", "",
        "true", "false", "false", "false", "false", "false",
        "-1", "-1", "large",
        "veg",
        "6 months", "", "",
        "Flour, Sugar", "", "",
        "None", "", "",
        "1234", "890123456789",
        "Box", "", "",
        "1",
        "https://example.com/bundle1.jpg,https://example.com/bundle2.jpg"
      ]

      const workbook = xlsx.utils.book_new()

      // 1. Products Sheet
      const worksheet = xlsx.utils.aoa_to_sheet([headers, instructions, sampleData])
      const colWidths = headers.map(h => ({ wch: Math.max(h.length, 15) }))
      worksheet['!cols'] = colWidths
      xlsx.utils.book_append_sheet(workbook, worksheet, "Bundles")

      // 2. Categories Reference Sheet
      const categoryHeaders = ["Category ID (Copy this)", "Category Name (EN)", "Category Slug"]
      const categoryRows = categories.map((cat: any) => {
        let cName = ""
        if (typeof cat.name === 'string') {
          try { cName = JSON.parse(cat.name).en || cat.name } catch { cName = cat.name }
        } else if (typeof cat.name === 'object' && cat.name !== null) {
          cName = cat.name.en || ""
        }
        return [cat.id, cName, cat.slug]
      })
      const catWorksheet = xlsx.utils.aoa_to_sheet([categoryHeaders, ...categoryRows])
      catWorksheet['!cols'] = [{ wch: 40 }, { wch: 30 }, { wch: 30 }]
      xlsx.utils.book_append_sheet(workbook, catWorksheet, "Categories Reference")

      // 3. Products Reference Sheet
      const productHeaders = ["Product SKU (Copy this)", "Product Name (EN)", "Stock"]
      const productRows = products.map((prod: any) => {
        let pName = ""
        if (typeof prod.name === 'string') {
          try { pName = JSON.parse(prod.name).en || prod.name } catch { pName = prod.name }
        } else if (typeof prod.name === 'object' && prod.name !== null) {
          pName = prod.name.en || ""
        }
        return [prod.sku, pName, prod.stock]
      })
      const prodWorksheet = xlsx.utils.aoa_to_sheet([productHeaders, ...productRows])
      prodWorksheet['!cols'] = [{ wch: 30 }, { wch: 50 }, { wch: 15 }]
      xlsx.utils.book_append_sheet(workbook, prodWorksheet, "Products Reference")

      xlsx.writeFile(workbook, "Bundles_Import_Template.xlsx")
    } catch (error) {
      console.error("Failed to generate template", error)
    } finally {
      setIsDownloadingTemplate(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setUploadResult({ status: 'idle' })
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      setUploadResult({ status: 'idle' })
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/products/bulk-import-bundles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const data = response.data.data
      if (data.failureCount > 0) {
        setUploadResult({ 
          status: 'error', 
          message: `Processed ${data.totalProcessed} bundles. ${data.successCount} succeeded, ${data.failureCount} failed.`,
          details: data.errors
        })
      } else {
        setUploadResult({ 
          status: 'success', 
          message: `Successfully imported ${data.successCount} bundles!` 
        })
        onSuccess()
      }
    } catch (error: any) {
      setUploadResult({ 
        status: 'error', 
        message: error.response?.data?.message || error.message || "Failed to import bundles."
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setUploadResult({ status: 'idle' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isUploading && !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            {t("products.bulk_import_bundles", "Bulk Import Package Bundles")}
          </DialogTitle>
          <DialogDescription>
            Download the bundle template, fill in bundle details and include product SKUs, and upload the Excel file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Download Template */}
          <div className="bg-muted/30 p-4 rounded-xl border border-muted flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm mb-1">1. Download Template</h4>
              <p className="text-xs text-muted-foreground">
                Get the required Excel layout for bundles. Do not change the column headers.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} disabled={isDownloadingTemplate} className="gap-2 shrink-0">
              {isDownloadingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
              Template
            </Button>
          </div>

          {/* Step 2: Upload */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm">2. Upload Filled Template</h4>
            
            {uploadResult.status === 'idle' && (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  file ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/10'
                }`}
              >
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <FileSpreadsheet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={handleReset} disabled={isUploading}>Cancel</Button>
                      <Button size="sm" onClick={handleUpload} disabled={isUploading} className="gap-2">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        {isUploading ? "Importing..." : "Start Import"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer space-y-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Click to select an Excel file</p>
                      <p className="text-xs text-muted-foreground">Supports .xlsx and .xls formats</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadResult.status === 'success' && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-700">{uploadResult.message}</h4>
                </div>
                <Button variant="outline" size="sm" onClick={() => { onClose(); onSuccess(); }} className="mt-2">
                  Done
                </Button>
              </div>
            )}

            {uploadResult.status === 'error' && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-bold text-rose-700 mb-2">{uploadResult.message}</h4>
                  {uploadResult.details && uploadResult.details.length > 0 && (
                    <div className="text-left bg-background rounded-md p-3 max-h-32 overflow-y-auto text-xs font-mono text-rose-600 border border-rose-500/20">
                      {uploadResult.details.map((err: string, i: number) => (
                        <div key={i} className="mb-1 truncate" title={err}>{err}</div>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleReset} className="mt-2">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
