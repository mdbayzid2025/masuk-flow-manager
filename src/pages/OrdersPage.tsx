import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { MOCK_ORDERS, SERVICES, PAYMENT_METHODS } from "@/data/mockData";
import { Order, Payment } from "@/data/types";
import OrderTable from "@/components/OrderTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNew, setShowNew] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // New order form
  const [newOrder, setNewOrder] = useState({ clientName: "", phone: "", service: "", serviceCharge: "", operatingCost: "" });

  const filtered = orders.filter((o) => {
    const matchSearch = o.clientName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateOrder = () => {
    if (!newOrder.clientName || !newOrder.service || !newOrder.serviceCharge) {
      toast.error("Please fill all required fields");
      return;
    }
    const order: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      clientName: newOrder.clientName,
      phone: newOrder.phone,
      service: newOrder.service,
      status: "pending",
      serviceCharge: Number(newOrder.serviceCharge),
      operatingCost: Number(newOrder.operatingCost) || 0,
      payments: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setOrders([order, ...orders]);
    setNewOrder({ clientName: "", phone: "", service: "", serviceCharge: "", operatingCost: "" });
    setShowNew(false);
    toast.success("Order created");
  };

  // Payment form
  const [paymentForm, setPaymentForm] = useState({ amount: "", method: "", note: "" });

  const handleAddPayment = () => {
    if (!selectedOrder || !paymentForm.amount || !paymentForm.method) {
      toast.error("Fill amount and method");
      return;
    }
    const payment: Payment = {
      id: `p-${Date.now()}`,
      amount: Number(paymentForm.amount),
      method: paymentForm.method,
      date: new Date().toISOString().slice(0, 10),
      note: paymentForm.note,
    };
    setOrders(orders.map(o => o.id === selectedOrder.id
      ? { ...o, payments: [...o.payments, payment], updatedAt: new Date().toISOString().slice(0, 10) }
      : o
    ));
    setSelectedOrder({ ...selectedOrder, payments: [...selectedOrder.payments, payment] });
    setPaymentForm({ amount: "", method: "", note: "" });
    setShowPayment(false);
    toast.success("Payment recorded");
  };

  const updateStatus = (status: "pending" | "ongoing" | "completed") => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status } : o));
    setSelectedOrder({ ...selectedOrder, status });
    toast.success(`Status updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-muted-foreground text-sm">Manage service orders and payments</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-1" /> New Order</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <OrderTable orders={filtered} onSelect={setSelectedOrder} />
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found</p>}
      </div>

      {/* New Order Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Client Name *</Label><Input value={newOrder.clientName} onChange={e => setNewOrder({...newOrder, clientName: e.target.value})} /></div>
            <div><Label>Phone</Label><Input value={newOrder.phone} onChange={e => setNewOrder({...newOrder, phone: e.target.value})} /></div>
            <div>
              <Label>Service *</Label>
              <Select value={newOrder.service} onValueChange={v => setNewOrder({...newOrder, service: v})}>
                <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>{SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Service Charge *</Label><Input type="number" value={newOrder.serviceCharge} onChange={e => setNewOrder({...newOrder, serviceCharge: e.target.value})} /></div>
              <div><Label>Operating Cost</Label><Input type="number" value={newOrder.operatingCost} onChange={e => setNewOrder({...newOrder, operatingCost: e.target.value})} /></div>
            </div>
            <Button onClick={handleCreateOrder} className="w-full">Create Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(o) => !o && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          {selectedOrder && (() => {
            const paid = selectedOrder.payments.reduce((s, p) => s + p.amount, 0);
            const due = selectedOrder.serviceCharge - paid;
            const profit = selectedOrder.serviceCharge - selectedOrder.operatingCost;
            return (
              <>
                <DialogHeader><DialogTitle>{selectedOrder.id} — {selectedOrder.clientName}</DialogTitle></DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-muted-foreground">Service:</span> {selectedOrder.service}</div>
                    <div><span className="text-muted-foreground">Phone:</span> {selectedOrder.phone}</div>
                    <div><span className="text-muted-foreground">Created:</span> {selectedOrder.createdAt}</div>
                    <div><span className="text-muted-foreground">Status:</span>
                      <Select value={selectedOrder.status} onValueChange={(v) => updateStatus(v as any)}>
                        <SelectTrigger className="h-7 w-28 inline-flex ml-2"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-muted-foreground text-xs">Charge</p>
                      <p className="font-bold">৳{selectedOrder.serviceCharge.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-muted-foreground text-xs">Cost</p>
                      <p className="font-bold">৳{selectedOrder.operatingCost.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-muted-foreground text-xs">Profit</p>
                      <p className="font-bold text-success">৳{profit.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Payments</h4>
                      <Button size="sm" variant="outline" onClick={() => setShowPayment(true)}>
                        <Plus className="h-3 w-3 mr-1" /> Add Payment
                      </Button>
                    </div>
                    {selectedOrder.payments.length === 0 ? (
                      <p className="text-muted-foreground text-xs">No payments recorded</p>
                    ) : (
                      <div className="space-y-1.5">
                        {selectedOrder.payments.map(p => (
                          <div key={p.id} className="flex justify-between items-center bg-muted/50 rounded-md px-3 py-2">
                            <div>
                              <span className="font-medium">৳{p.amount.toLocaleString()}</span>
                              <span className="text-muted-foreground ml-2 text-xs">{p.method}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{p.date} {p.note && `• ${p.note}`}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between mt-3 pt-3 border-t border-border font-semibold">
                      <span>Paid: <span className="text-success">৳{paid.toLocaleString()}</span></span>
                      <span>Due: <span className="text-destructive">৳{due.toLocaleString()}</span></span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Amount *</Label><Input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} /></div>
            <div>
              <Label>Payment Method *</Label>
              <Select value={paymentForm.method} onValueChange={v => setPaymentForm({...paymentForm, method: v})}>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>{PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Note</Label><Input value={paymentForm.note} onChange={e => setPaymentForm({...paymentForm, note: e.target.value})} placeholder="e.g. Advance, Final payment" /></div>
            <Button onClick={handleAddPayment} className="w-full">Record Payment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
