"use client"

import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Bell, 
  Mail,
  MapPin,
  MessageSquare,
  ChevronRight,
  Database
} from "lucide-react"

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="checkout" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="checkout" className="rounded-lg">{t("settings.checkout_rules")}</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg">{t("settings.payments_cod")}</TabsTrigger>
          <TabsTrigger value="apis" className="rounded-lg">{t("settings.api_integrations")}</TabsTrigger>
          <TabsTrigger value="general" className="rounded-lg">{t("settings.general")}</TabsTrigger>
        </TabsList>

        {/* Checkout Rules */}
        <TabsContent value="checkout" className="space-y-4">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>{t("settings.ordering_config")}</CardTitle>
              <CardDescription>{t("settings.ordering_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="min-order">{t("settings.min_order")}</Label>
                  <Input id="min-order" type="number" defaultValue="200" />
                  <p className="text-xs text-muted-foreground">{t("settings.min_order_desc")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-items">{t("settings.max_items")}</Label>
                  <Input id="max-items" type="number" defaultValue="50" />
                  <p className="text-xs text-muted-foreground">{t("settings.max_items_desc")}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-muted/20">
                <div className="space-y-1">
                  <Label className="text-base">{t("settings.guest_checkout")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.guest_checkout_desc")}</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-muted/20">
                <div className="space-y-1">
                  <Label className="text-base">{t("settings.scheduled_delivery")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.scheduled_delivery_desc")}</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-end p-4">
              <Button>{t("settings.save_checkout")}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payments & COD */}
        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-none shadow-lg">
              <CardHeader>
                <CardTitle>{t("settings.payment_gateways")}</CardTitle>
                <CardDescription>{t("settings.payment_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border shadow-sm font-bold text-primary">RZ</div>
                    <div>
                      <h4 className="font-bold">Razorpay</h4>
                      <p className="text-xs text-muted-foreground">UPI, Cards, Netbanking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-none">{t("common.active")}</Badge>
                    <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-dashed text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border shadow-sm font-bold opacity-40">ST</div>
                    <div>
                      <h4 className="font-bold">Stripe</h4>
                      <p className="text-xs">International Card Payments</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">{t("common.connect")}</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>{t("settings.offline_methods")}</CardTitle>
                <CardDescription>{t("settings.cod_settings")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="font-bold">{t("settings.enable_cod")}</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cod-limit">{t("settings.max_cod")}</Label>
                  <Input id="cod-limit" type="number" defaultValue="5000" />
                </div>
                <div className="space-y-1">
                   <Label className="text-xs text-muted-foreground">{t("settings.restricted_pins")}</Label>
                   <Button variant="outline" className="w-full text-xs h-8 justify-between">
                      {t("settings.manage_blocklist")} <ChevronRight className="h-3 w-3" />
                   </Button>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" variant="secondary">{t("settings.update_offline")}</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* API Integrations */}
        <TabsContent value="apis" className="space-y-4">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>{t("settings.third_party")}</CardTitle>
              <CardDescription>Configure external API keys and services (SOW Section 3).</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                 <div className="p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <MessageSquare className="h-5 w-5" />
                       </div>
                       <div>
                          <h4 className="font-bold">SMS Gateway (Twilio/2Factor)</h4>
                          <p className="text-xs text-muted-foreground">Used for OTP-based login & order updates.</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50/50 text-emerald-600 border-none">{t("common.online")}</Badge>
                 </div>
                 <div className="p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Mail className="h-5 w-5" />
                       </div>
                       <div>
                          <h4 className="font-bold">Email Service (SendGrid/Mailgun)</h4>
                          <p className="text-xs text-muted-foreground">For order receipts and newsletters.</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50/50 text-emerald-600 border-none">{t("common.online")}</Badge>
                 </div>
                 <div className="p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                          <MapPin className="h-5 w-5" />
                       </div>
                       <div>
                          <h4 className="font-bold">Google Maps API</h4>
                          <p className="text-xs text-muted-foreground">Geolocation and delivery distance estimation.</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="bg-amber-50/50 text-amber-600 border-none">Low Balance</Badge>
                 </div>
                 <div className="p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <Bell className="h-5 w-5" />
                       </div>
                       <div>
                          <h4 className="font-bold">Firebase Cloud Messaging</h4>
                          <p className="text-xs text-muted-foreground">Real-time push notifications for App/Web.</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50/50 text-emerald-600 border-none">{t("common.online")}</Badge>
                 </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-4 border-t text-center">
               <p className="text-xs text-muted-foreground w-full flex items-center justify-center gap-2">
                  <Database className="h-3 w-3" /> {t("settings.api_keys_encrypted")}
               </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="general">
           <Card className="border-none shadow-lg opacity-60">
              <CardContent className="p-12 text-center text-muted-foreground italic">
                 {t("settings.general_placeholder")}
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
