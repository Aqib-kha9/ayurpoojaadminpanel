import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
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
import { Input } from "@/components/ui/input"
import { 
  Search, 
  ExternalLink, 
  Filter, 
  Calendar,
  Download,
  MoreVertical,
  Loader2,
  RefreshCcw,
  User,
  MapPin,
  ShoppingBag,
  Printer,
  X,
  CheckCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import api from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

export default function OrdersPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/orders/all");
      if (res.data.status === "success") {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      if (res.data.status === "success") {
        toast.success(`Order set to ${status}`);
        setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status } : o));
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, orderStatus: status });
        }
      }
    } catch (err) {
      toast.error("Failed to update order status");
    }
  }

  const handleViewDetails = (order: any) => {
    navigate(`/orders/${order.id}`)
  }

  const handleGetInvoice = (order: any) => {
    toast.success("Generating Invoice...");
    setSelectedOrder(order);
    setIsDetailsOpen(true);
    // Simulate invoice generation delay
    setTimeout(() => {
       toast.info("Invoice Ready for Printing");
    }, 1000);
  }

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.phone?.includes(searchQuery)
  );

  const stats = [
    { labelKey: "orders.new_orders", value: orders.filter(o => o.orderStatus === 'PROCESSING').length, color: "bg-blue-500" },
    { labelKey: "orders.processing", value: orders.filter(o => o.orderStatus === 'CONFIRMED').length, color: "bg-amber-500" },
    { labelKey: "orders.out_for_delivery", value: orders.filter(o => o.orderStatus === 'OUT_FOR_DELIVERY' || o.orderStatus === 'SHIPPED').length, color: "bg-purple-500" },
    { labelKey: "orders.delivered", value: orders.filter(o => o.orderStatus === 'DELIVERED').length, color: "bg-emerald-500" },
  ]

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'DELIVERED': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'CANCELLED': return "bg-red-500/10 text-red-600 border-red-500/20";
      case 'PROCESSING': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'CONFIRMED': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default: return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Stats same as before */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("orders.title")}</h1>
          <p className="text-muted-foreground">{t("orders.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isLoading} className="gap-2 rounded-xl h-11 px-4">
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Sync
          </Button>
          <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            <Download className="h-4 w-4" /> {t("common.export")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.labelKey} className="flex flex-col p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-muted/10 group hover:shadow-xl transition-all">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{t(stat.labelKey)}</span>
            <div className="flex items-center justify-between mt-3">
              <span className="text-3xl font-black">{stat.value}</span>
              <div className={`w-3 h-3 rounded-full ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-500/50`} />
            </div>
          </div>
        ))}
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Recent Orders</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search order number or customer..." 
                  className="pl-10 h-12 rounded-2xl bg-muted/30 border-none shadow-inner text-sm font-medium" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-2xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-none">
                <TableHead className="pl-8 h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Order ID</TableHead>
                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Date</TableHead>
                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Customer</TableHead>
                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Total</TableHead>
                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Payment</TableHead>
                <TableHead className="h-14 pr-8 text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="h-20 text-center">
                      <div className="flex items-center justify-center gap-3 text-muted-foreground animate-pulse">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest">Loading Live Orders...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <Search className="h-12 w-12 mb-4" />
                        <p className="text-sm font-black uppercase tracking-widest">No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-muted/5 hover:bg-muted/20 transition-all group">
                    <TableCell className="pl-8 font-mono font-bold text-primary text-sm">#{order.orderNumber.split('-').slice(-2).join('-')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(order.createdAt), 'dd MMM, HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{order.user?.name || "Guest"}</span>
                        <span className="text-[10px] text-muted-foreground">{order.user?.phone || order.user?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-base">₹{Number(order.payableAmount).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={`font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm ${getStatusStyle(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-tight">{order.paymentMode}</span>
                        <span className={`text-[9px] font-bold ${order.paymentStatus === 'SUCCESS' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted/50 transition-colors outline-hidden">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-muted/20">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest pb-2 opacity-50 px-3">Order Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(order)} className="gap-3 h-11 px-3 rounded-xl cursor-pointer hover:bg-primary/10">
                              <ExternalLink className="h-4 w-4 text-blue-500" /> <span className="font-bold text-sm">View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGetInvoice(order)} className="gap-3 h-11 px-3 rounded-xl cursor-pointer hover:bg-primary/10">
                              <Download className="h-4 w-4 text-emerald-500" /> <span className="font-bold text-sm">Get Invoice</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          
                          <DropdownMenuSeparator className="bg-muted/10 my-2" />
                          
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest pb-2 opacity-50 px-3">Quick Status Update</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')} className="gap-3 h-10 px-3 rounded-xl cursor-pointer text-amber-600 font-bold text-xs uppercase tracking-wider">
                              Confirm Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} className="gap-3 h-10 px-3 rounded-xl cursor-pointer text-blue-600 font-bold text-xs uppercase tracking-wider">
                              Ship Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')} className="gap-3 h-10 px-3 rounded-xl cursor-pointer text-purple-600 font-bold text-xs uppercase tracking-wider">
                              Out for Delivery
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} className="gap-3 h-10 px-3 rounded-xl cursor-pointer text-emerald-600 font-bold text-xs uppercase tracking-wider">
                              Deliver Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} className="gap-3 h-10 px-3 rounded-xl cursor-pointer text-red-600 font-bold text-xs uppercase tracking-wider">
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-8 text-white">
            <DialogHeader className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="border-white/20 text-white uppercase tracking-widest font-black text-[10px] px-3 mb-4">
                    Order Receipt
                  </Badge>
                  <DialogTitle className="text-3xl font-black tracking-tighter uppercase">
                    Order <span className="text-primary">#{selectedOrder?.orderNumber.split('-').slice(-2).join('-')}</span>
                  </DialogTitle>
                </div>
                <Button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="bg-white/10 hover:bg-white/20 rounded-full h-10 w-10 p-0 border-none"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <DialogDescription className="text-slate-400 font-medium">
                Placed on {selectedOrder && format(new Date(selectedOrder.createdAt), 'EEEE, do MMMM yyyy (hh:mm aa)')}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto bg-white dark:bg-slate-950">
             {/* Customer & Shipping Section */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                      <User className="h-3 w-3" /> Customer Details
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/30 border border-muted/20">
                      <p className="font-bold text-lg">{selectedOrder?.user?.name || "Guest User"}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder?.user?.phone}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder?.user?.email}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                      <MapPin className="h-3 w-3" /> Shipping Address
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/30 border border-muted/20">
                      <p className="font-bold text-sm">{selectedOrder?.shippingAddress?.street}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state} - {selectedOrder?.shippingAddress?.postalCode}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-2">
                        {selectedOrder?.shippingAddress?.type} Point
                      </p>
                   </div>
                </div>
             </div>

             {/* Items Section */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                   <ShoppingBag className="h-3 w-3" /> Itemized Breakdown
                </div>
                <div className="rounded-3xl border border-muted/20 overflow-hidden">
                   <Table>
                      <TableHeader className="bg-muted/10">
                         <TableRow>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">Product</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">Price</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">Qty</TableHead>
                            <TableHead className="text-right font-black text-[10px] uppercase tracking-widest h-12">Total</TableHead>
                         </TableRow>
                      </TableHeader>
                      <TableBody>
                         {selectedOrder?.items?.map((item: any) => (
                            <TableRow key={item.id} className="border-muted/5">
                               <TableCell>
                                  <span className="font-bold text-sm">{(item.product?.name as any)?.[i18n.language] || (item.product?.name as any)?.en}</span>
                                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{item.product?.sku}</p>
                               </TableCell>
                               <TableCell className="font-medium text-sm">₹{Number(item.price).toLocaleString()}</TableCell>
                               <TableCell className="font-bold">×{item.quantity}</TableCell>
                               <TableCell className="text-right font-black">₹{(Number(item.price) * item.quantity).toLocaleString()}</TableCell>
                            </TableRow>
                         ))}
                      </TableBody>
                   </Table>
                </div>
             </div>

             {/* Summary Section */}
             <div className="space-y-4 bg-muted/20 p-6 rounded-[2rem] border border-muted/10">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground font-medium">Subtotal</span>
                   <span className="font-bold">₹{Number(selectedOrder?.totalAmount).toLocaleString()}</span>
                </div>
                {selectedOrder?.couponCode && (
                  <div className="flex justify-between items-center text-sm text-primary">
                    <span className="font-bold uppercase tracking-widest text-[10px]">Discount ({selectedOrder.couponCode})</span>
                    <span className="font-black">-₹{(Number(selectedOrder.totalAmount) + (Number(selectedOrder.totalAmount) > 999 ? 0 : 49) - Number(selectedOrder.payableAmount)).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground font-medium">Shipping Fee</span>
                   <span className="font-bold">{Number(selectedOrder?.totalAmount) > 999 ? "FREE" : "₹49"}</span>
                </div>
                <Separator className="bg-muted/10" />
                <div className="flex justify-between items-center">
                   <span className="font-black uppercase tracking-widest text-xs">Net Amount Payable</span>
                   <span className="text-2xl font-black text-primary">₹{Number(selectedOrder?.payableAmount).toLocaleString()}</span>
                </div>
             </div>
          </div>

          <div className="p-8 border-t bg-muted/10 flex flex-col md:flex-row gap-4">
             <Button variant="outline" onClick={() => window.print()} className="flex-1 h-12 rounded-2xl border-muted/20 font-black gap-2 uppercase tracking-widest text-xs">
                <Printer className="h-4 w-4" /> Print Invoice
             </Button>
             <Button 
               onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
               disabled={selectedOrder?.orderStatus !== 'PROCESSING'}
               className="flex-1 h-12 rounded-2xl font-black gap-2 uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
             >
                <CheckCircle className="h-4 w-4" /> Confirm Order
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
