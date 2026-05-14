import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Printer, 
  MapPin, 
  User, 
  Package, 
  Clock, 
  CreditCard,
  ShoppingBag,
  CheckCircle,
  Truck,
  AlertCircle,
  ExternalLink
} from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function OrderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrderDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      // Since we don't have a specific GET /orders/:id for admin yet,
      // we might need to fetch all and find, OR add the endpoint.
      // Let's assume we add GET /orders/:id to the backend as well.
      const res = await api.get(`/orders/all`) // Fallback: find in all for now
      if (res.data.status === "success") {
        const found = res.data.data.orders.find((o: any) => o.id === id)
        if (found) setOrder(found)
        else toast.error("Order not found")
      }
    } catch {
      toast.error("Failed to load order details")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrderDetails()
  }, [fetchOrderDetails])

  const handleUpdateStatus = async (status: string) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      if (res.data.status === "success") {
        toast.success(`Order status updated to ${status}`);
        setOrder({ ...order, orderStatus: status });
      }
    } catch {
      toast.error("Failed to update status");
    }
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'DELIVERED': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'CANCELLED': return "bg-red-500/10 text-red-600 border-red-500/20";
      case 'PROCESSING': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'CONFIRMED': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default: return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    }
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Loading Order Data...</p>
      </div>
    )
  }

  if (!order) return <div className="p-8 text-center font-bold">Order not found</div>

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/orders")} className="rounded-full bg-white shadow-sm border border-muted/20">
             <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">
              Order Details <span className="text-primary">#{order.orderNumber.split('-').slice(-1)}</span>
            </h1>
            <div className="flex items-center gap-3">
               <Badge className={`font-black text-[10px] tracking-widest uppercase py-1 px-3 border-none ${getStatusStyle(order.orderStatus)}`}>
                  {order.orderStatus}
               </Badge>
               <span className="text-xs text-muted-foreground font-bold">Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm aa')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={() => window.print()} className="gap-2 h-12 rounded-2xl font-black uppercase tracking-widest text-xs px-6 border-muted/20 bg-white">
              <Printer className="h-4 w-4" /> Print Invoice
           </Button>
           
           <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="gap-2 h-12 rounded-2xl font-black uppercase tracking-widest text-xs px-8 shadow-xl shadow-primary/20">
                   Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-muted/20">
                 <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest pb-2 opacity-50 px-3">Lifecycle Actions</DropdownMenuLabel>
                 <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleUpdateStatus('CONFIRMED')} className="gap-3 h-11 px-3 rounded-xl cursor-pointer text-amber-600 font-bold text-xs uppercase tracking-wider">
                       Confirm Order
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus('SHIPPED')} className="gap-3 h-11 px-3 rounded-xl cursor-pointer text-blue-600 font-bold text-xs uppercase tracking-wider">
                       Ship Items
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')} className="gap-3 h-11 px-3 rounded-xl cursor-pointer text-purple-600 font-bold text-xs uppercase tracking-wider">
                       Out for Delivery
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus('DELIVERED')} className="gap-3 h-11 px-3 rounded-xl cursor-pointer text-emerald-600 font-bold text-xs uppercase tracking-wider">
                       Mark as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-muted/10 my-2" />
                    <DropdownMenuItem onClick={() => handleUpdateStatus('CANCELLED')} className="gap-3 h-11 px-3 rounded-xl cursor-pointer text-red-600 font-bold text-xs uppercase tracking-wider">
                       Cancel Order
                    </DropdownMenuItem>
                 </DropdownMenuGroup>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items & Summary */}
        <div className="lg:col-span-2 space-y-8">
           {/* Items List */}
           <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                       <ShoppingBag className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Ordered Items</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-muted/30">
                       <TableRow className="border-none">
                          <TableHead className="pl-8 h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Product Details</TableHead>
                          <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Unit Price</TableHead>
                          <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Qty</TableHead>
                          <TableHead className="h-14 pr-8 text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground">Subtotal</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {order.items.map((item: any) => (
                          <TableRow key={item.id} className="border-muted/5 group">
                             <TableCell className="pl-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center p-2">
                                      <img 
                                        src={(item.product?.images as string[])?.[0] || "https://placehold.co/400"} 
                                        alt="" 
                                        className="w-full h-full object-contain"
                                      />
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                        {(item.product?.name as any)?.[i18n.language] || (item.product?.name as any)?.en}
                                      </span>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">SKU: {item.product?.sku}</span>
                                   </div>
                                </div>
                             </TableCell>
                             <TableCell className="font-medium text-base text-slate-600">₹{Number(item.price).toLocaleString()}</TableCell>
                             <TableCell className="text-center">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-muted/30 font-black text-sm">
                                   ×{item.quantity}
                                </span>
                             </TableCell>
                             <TableCell className="pr-8 text-right font-black text-lg">₹{(Number(item.price) * item.quantity).toLocaleString()}</TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>

                 <div className="p-8 bg-slate-900 text-white rounded-b-[2.5rem]">
                    <div className="max-w-xs ml-auto space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gross Subtotal</span>
                          <span className="font-bold">₹{Number(order.totalAmount).toLocaleString()}</span>
                       </div>
                       {order.couponCode && (
                          <div className="flex justify-between items-center text-sm text-primary">
                             <span className="font-black uppercase tracking-[0.2em] text-[10px]">Discount ({order.couponCode})</span>
                             <span className="font-black">-₹{(Number(order.totalAmount) + (Number(order.totalAmount) > 999 ? 0 : 49) - Number(order.payableAmount)).toLocaleString()}</span>
                          </div>
                       )}
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Delivery Charges</span>
                          <span className="font-bold">{Number(order.totalAmount) > 999 ? "FREE" : "₹49"}</span>
                       </div>
                       <Separator className="bg-white/10 my-4" />
                       <div className="flex justify-between items-end">
                          <div>
                            <p className="text-primary font-black uppercase tracking-[0.3em] text-[9px] mb-1">Net Payable Amount</p>
                            <p className="text-slate-400 text-[10px] font-medium leading-none">(Inclusive of all taxes)</p>
                          </div>
                          <span className="text-3xl font-black text-white">₹{Number(order.payableAmount).toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Timeline/Tracking Info Placeholder */}
           <Card className="border-none shadow-xl rounded-[2.5rem] bg-indigo-50 border-indigo-100 dark:bg-primary/5 p-8">
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                    <Truck className="h-5 w-5" />
                 </div>
                 <h3 className="text-lg font-black uppercase tracking-tight">Delivery Tracking</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-indigo-800 dark:text-primary font-bold">
                 <Clock className="h-4 w-4" />
                 <span>Shipment has not been created yet. Confirm the order to generate AWB.</span>
              </div>
           </Card>
        </div>

        {/* Right Column: Customer & Payment */}
        <div className="space-y-8">
           {/* Customer Profile */}
           <Card className="border-none shadow-2xl rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
                    <User className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Customer Profile</CardTitle>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center font-black text-xl text-primary border border-muted/20">
                       {order.user?.name?.[0] || "?"}
                    </div>
                    <div>
                       <p className="text-lg font-bold leading-tight">{order.user?.name || "Guest User"}</p>
                       <p className="text-xs text-muted-foreground font-medium">{order.user?.email || "No email provided"}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-2xl border border-muted/10">
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Phone</p>
                       <p className="text-sm font-bold">{order.user?.phone || "N/A"}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-muted/10">
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">User ID</p>
                       <p className="text-[9px] font-mono break-all opacity-50">{order.userId.slice(0, 8)}...</p>
                    </div>
                 </div>
                 <Link to={`/users/${order.userId}`}>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] gap-2">
                       <ExternalLink className="h-3 w-3" /> View User Activity
                    </Button>
                 </Link>
              </div>
           </Card>

           {/* Delivery Snapshot */}
           <Card className="border-none shadow-2xl rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <MapPin className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Delivery Point</CardTitle>
              </div>
              <div className="bg-muted/30 p-6 rounded-[2rem] border border-muted/10 relative overflow-hidden group">
                 <Badge className="absolute right-0 top-0 rounded-bl-2xl rounded-tr-none font-black text-[9px] px-3 bg-primary">
                    {order.shippingAddress?.type}
                 </Badge>
                 <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{order.shippingAddress?.street}</p>
                 <p className="text-xs text-muted-foreground font-medium mt-1">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                 </p>
                 <p className="text-xs text-muted-foreground font-medium">Pin: {order.shippingAddress?.postalCode}</p>
                 
                 <Separator className="my-4 bg-muted/10" />
                 
                 <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Contact Person</p>
                 <p className="text-xs font-bold mt-0.5">{order.user?.name}</p>
              </div>
           </Card>

           {/* Payment Status */}
           <Card className="border-none shadow-2xl rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
                    <CreditCard className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Payment Intel</CardTitle>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-5 bg-muted/30 rounded-2xl border border-muted/10">
                    <div>
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Gateway</p>
                       <p className="text-sm font-black text-slate-900 dark:text-white">{order.paymentMode}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                       <Badge className={`font-black text-[10px] ${order.paymentStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'} border-none`}>
                          {order.paymentStatus}
                       </Badge>
                    </div>
                 </div>
                 
                 {order.paymentMode === 'COD' && order.paymentStatus === 'PENDING' && (
                    <div className="flex gap-3 items-center p-4 bg-amber-50 rounded-2xl border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20">
                       <AlertCircle className="h-4 w-4 text-amber-600" />
                       <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500">Collect cash upon delivery</p>
                    </div>
                 )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
