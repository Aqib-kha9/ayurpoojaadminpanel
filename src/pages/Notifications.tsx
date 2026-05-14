
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Bell, 
  Send, 
  Target, 
  History,
  Clock,
  Users
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NotificationsPage() {
  const { t } = useTranslation()

  const history = [
    { title: "Big Sale Alert!", sentTo: "All Users", date: "2,000 users", time: "2 hours ago", status: "Sent" },
    { title: "New Package Available", sentTo: "Hyderabad Users", date: "500 users", time: "Yesterday", status: "Sent" },
    { title: "Incomplete Profile Reminder", sentTo: "Unregistered", date: "120 users", time: "2 days ago", status: "Scheduled" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("notifications.title")}</h1>
        <p className="text-muted-foreground">{t("notifications.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" /> {t("notifications.create")}
            </CardTitle>
            <CardDescription>{t("notifications.compose")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t("notifications.notif_title")}</Label>
              <Input id="title" placeholder={t("notifications.title_placeholder")} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">{t("notifications.message_body")}</Label>
              <Textarea 
                id="message" 
                placeholder={t("notifications.message_placeholder")} 
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">0 / 150 {t("notifications.characters")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t("notifications.target_audience")}</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder={t("notifications.target_audience")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("notifications.all_users")}</SelectItem>
                    <SelectItem value="active">{t("notifications.active_users")}</SelectItem>
                    <SelectItem value="inactive">{t("notifications.inactive_users")}</SelectItem>
                    <SelectItem value="city">{t("notifications.specific_city")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("notifications.delivery_time")}</Label>
                <Select defaultValue="now">
                  <SelectTrigger>
                    <SelectValue placeholder={t("notifications.delivery_time")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">{t("notifications.send_now")}</SelectItem>
                    <SelectItem value="scheduled">{t("notifications.schedule_later")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between items-center p-6 mt-4">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>{t("notifications.estimated_reach")}: ~842 {t("notifications.all_users")}</span>
             </div>
             <Button className="gap-2 shadow-lg shadow-primary/20">
                <Send className="h-4 w-4" /> {t("notifications.send_notification")}
             </Button>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5 text-muted-foreground" /> {t("notifications.recent_history")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-muted/50">
                {history.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                      <Badge variant={item.status === "Sent" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1"><Users className="h-3 w-3" /> {item.sentTo} ({item.date})</p>
                      <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time}</p>
                    </div>
                  </div>
                ))}
             </div>
             <Button variant="ghost" className="w-full rounded-none border-t text-xs h-12">
               {t("notifications.view_all_history")}
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
