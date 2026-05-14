
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Edit, 
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export default function LanguagesPage() {
  const { t } = useTranslation()

  const languages = [
    { code: "EN", name: "English", native: "English", status: "Active", completion: 100 },
    { code: "TE", name: "Telugu", native: "తెలుగు", status: "Active", completion: 92 },
    { code: "HI", name: "Hindi", native: "हिन्दी", status: "Active", completion: 85 },
    { code: "KN", name: "Kannada", native: "ಕನ್ನಡ", status: "Inactive", completion: 0 },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("languages.title")}</h1>
          <p className="text-muted-foreground">{t("languages.subtitle")}</p>
        </div>
        <Button className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" /> {t("languages.add_language")}
        </Button>
      </div>

      <div className="grid gap-6">
        {languages.map((lang) => (
          <Card key={lang.code} className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="w-full md:w-48 bg-muted/30 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-muted/50">
                  <span className="text-4xl font-bold text-primary/40 mb-2">{lang.code}</span>
                  <span className="font-semibold">{lang.name}</span>
                  <span className="text-sm text-muted-foreground">{lang.native}</span>
                </div>
                <div className="flex-1 p-6 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{t("languages.content_coverage")}</h3>
                        {lang.completion === 100 ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : lang.completion > 0 ? (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{t("languages.coverage_desc")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`status-${lang.code}`} className="text-sm font-medium">
                          {lang.status === "Active" ? t("common.active") : t("common.inactive")}
                        </Label>
                        <Switch id={`status-${lang.code}`} checked={lang.status === "Active"} />
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" /> {t("languages.edit_content")}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{lang.completion}% {t("languages.translated")}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${lang.completion === 100 ? "bg-emerald-500" : "bg-primary"}`} 
                        style={{ width: `${lang.completion}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="p-3 rounded-lg bg-card border border-muted/20 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{t("languages.products")}</p>
                      <p className="text-lg font-bold">120/120</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-muted/20 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{t("languages.categories")}</p>
                      <p className="text-lg font-bold">12/12</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-muted/20 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{t("languages.packages")}</p>
                      <p className="text-lg font-bold">5/5</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-muted/20 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{t("languages.notif_label")}</p>
                      <p className="text-lg font-bold">24/45</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
