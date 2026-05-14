import * as React from "react"
import { useTranslation } from "react-i18next"
import { ImageIcon, Upload, Plus, Trash2 } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface MediaSectionProps {
  thumbnail: File | null
  setThumbnail: (file: File | null) => void
  images: File[]
  setImages: (files: File[]) => void
  existingImages?: string[]
}

export function MediaSection({
  thumbnail,
  setThumbnail,
  images,
  setImages,
  existingImages = []
}: MediaSectionProps) {
  const { t } = useTranslation()
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
    }
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  return (
    <Card className="border-none shadow-xl shadow-primary/5 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
          <ImageIcon className="h-4 w-4" />
        </div>
        <CardTitle className="text-xl font-black italic">{t('add_product.sections.media.title')}</CardTitle>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{t('add_product.sections.media.thumbnail')}</Label>
          <div className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex flex-col items-center justify-center relative group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
            {thumbnail ? (
              <div className="relative w-full h-full">
                <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="w-full h-full object-cover" />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                  onClick={(e) => { e.preventDefault(); setThumbnail(null); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : existingImages.length > 0 ? (
              <div className="relative w-full h-full">
                <img src={existingImages[0]} alt="Thumbnail" className="w-full h-full object-cover rounded-2xl" />
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors mb-2" />
                <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{t('add_product.sections.media.click_upload')}</p>
              </>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleThumbnailChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-[5]" 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{t('add_product.sections.media.gallery')}</Label>
          <div className="grid grid-cols-2 gap-3">
             {existingImages.slice(1).map((url, idx) => (
               <div key={`old-${idx}`} className="aspect-square rounded-xl border border-muted-foreground/10 bg-muted/5 relative overflow-hidden group">
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
               </div>
             ))}
             {images.map((img, idx) => (
               <div key={idx} className="aspect-square rounded-xl border border-muted-foreground/10 bg-muted/5 relative overflow-hidden group">
                  <img src={URL.createObjectURL(img)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
               </div>
             ))}
             {images.length < 4 && (
               <div className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/10 bg-muted/5 flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all relative">
                  <Plus className="h-6 w-6 text-muted-foreground/20" />
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleGalleryChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-[5]" 
                  />
               </div>
             )}
          </div>
        </div>
      </div>
    </Card>
  )
}
