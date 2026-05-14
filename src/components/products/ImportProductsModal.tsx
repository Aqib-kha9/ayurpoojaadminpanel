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

interface ImportProductsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportProductsModal({ isOpen, onClose, onSuccess }: ImportProductsModalProps) {
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
      
      // Define the headers based on our supported fields
      const headers = [
        "Category ID", "Type", "SKU", "Name (EN)", "Name (HI)", "Name (TE)",
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
      const response = await api.get('/categories?limit=1000')
      const categories = response.data.data?.categories || []
      const firstCategory = categories.length > 0 ? categories[0] : null
      const exampleCatId = firstCategory ? firstCategory.id : "your-category-id-here"

      // Provide one example row to help the user
      const sampleData = [
        exampleCatId, "STANDARD", "SKU-EX-001", "Example Product", "उदाहरण उत्पाद", "ఉదాహరణ ఉత్పత్తి",
        "Example Brand", "", "", "This is a great product.", "", "",
        "99", "120", "50", "pc", "ACTIVE",
        "New", "", "",
        "snack, tasty", "", "",
        "4.5", "10", "true", "true", "true",
        "10", "Percentage", "5", "inclusive",
        "0", "0.5", "10", "10", "5",
        "10",
        "Example Mfg", "", "",
        "India", "", "",
        "FSSAI123456789",
        "Buy Example Product Online", "", "",
        "Get the best deals on Example Product.", "", "",
        "true", "false", "false", "false", "false", "false",
        "-1", "-1", "large",
        "veg",
        "6 months", "", "",
        "Flour, Sugar", "", "",
        "None", "", "",
        "1234", "890123456789",
        "Packet", "", "",
        "1",
        "https://example.com/image1.jpg,https://example.com/image2.jpg"
      ]

      const workbook = xlsx.utils.book_new()

      // 1. Products Sheet
      const worksheet = xlsx.utils.aoa_to_sheet([headers, sampleData])
      const colWidths = headers.map(h => ({ wch: Math.max(h.length, 15) }))
      worksheet['!cols'] = colWidths
      xlsx.utils.book_append_sheet(workbook, worksheet, "Products")

      // 2. Categories Reference Sheet
      const categoryHeaders = ["Category ID (Copy this)", "Category Name (EN)", "Category Slug"]
      const categoryRows = categories.map((cat: any) => [
        cat.id, 
        typeof cat.name === 'string' ? JSON.parse(cat.name).en || cat.name : cat.name?.en || "", 
        cat.slug
      ])
      const catWorksheet = xlsx.utils.aoa_to_sheet([categoryHeaders, ...categoryRows])
      catWorksheet['!cols'] = [{ wch: 40 }, { wch: 30 }, { wch: 30 }]
      xlsx.utils.book_append_sheet(workbook, catWorksheet, "Categories Reference")

      xlsx.writeFile(workbook, "Products_Import_Template.xlsx")
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

      const response = await api.post('/products/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const data = response.data.data
      if (data.failureCount > 0) {
        setUploadResult({ 
          status: 'error', 
          message: `Processed ${data.totalProcessed} products. ${data.successCount} succeeded, ${data.failureCount} failed.`,
          details: data.errors
        })
      } else {
        setUploadResult({ 
          status: 'success', 
          message: `Successfully imported ${data.successCount} products!` 
        })
        onSuccess()
      }
    } catch (error: any) {
      setUploadResult({ 
        status: 'error', 
        message: error.response?.data?.message || error.message || "Failed to import products."
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
            {t("products.bulk_import", "Bulk Import Products")}
          </DialogTitle>
          <DialogDescription>
            Download the template, fill in your product details, and upload the Excel file to import thousands of products at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Download Template */}
          <div className="bg-muted/30 p-4 rounded-xl border border-muted flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm mb-1">1. Download Template</h4>
              <p className="text-xs text-muted-foreground">
                Get the required Excel layout. Do not change the column headers.
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
