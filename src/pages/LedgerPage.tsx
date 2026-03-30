import { useState } from "react";
import { MOCK_LIABILITIES, MOCK_RECEIVABLES } from "@/data/mockData";
import { Liability, Receivable } from "@/data/types";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function LedgerPage() {
  const [liabilities, setLiabilities] = useState<Liability[]>(MOCK_LIABILITIES);
  const [receivables, setReceivables] = useState<Receivable[]>(MOCK_RECEIVABLES);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [showAddReceivable, setShowAddReceivable] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", purpose: "", amount: "" });

  const totalPayable = liabilities.reduce((s, l) => s + l.amount, 0);
  const totalReceivable = receivables.reduce((s, r) => s + r.amount, 0);

  const handleAddLiability = () => {
    if (!form.name || !form.amount) { toast.error("Fill required fields"); return; }
    setLiabilities([{ id: `l-${Date.now()}`, name: form.name, address: form.address, purpose: form.purpose, amount: Number(form.amount) }, ...liabilities]);
    setForm({ name: "", address: "", purpose: "", amount: "" });
    setShowAddLiability(false);
    toast.success("Liability added");
  };

  const handleAddReceivable = () => {
    if (!form.name || !form.amount) { toast.error("Fill required fields"); return; }
    setReceivables([{ id: `r-${Date.now()}`, name: form.name, address: form.address, purpose: form.purpose, amount: Number(form.amount) }, ...receivables]);
    setForm({ name: "", address: "", purpose: "", amount: "" });
    setShowAddReceivable(false);
    toast.success("Receivable added");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ledger</h2>
        <p className="text-muted-foreground text-sm">Track payables (Korjo/Hawlad) and receivables</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payable */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Payable (Korjo/Hawlad)</h3>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddLiability(true)}><Plus className="h-3 w-3 mr-1" /> Add</Button>
          </div>
          <div className="space-y-2">
            {liabilities.map(l => (
              <div key={l.id} className="flex justify-between items-start bg-muted/50 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.address} • {l.purpose}</p>
                </div>
                <p className="font-bold text-destructive">৳{l.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex justify-between font-semibold">
            <span>Total Payable</span>
            <span className="text-destructive">৳{totalPayable.toLocaleString()}</span>
          </div>
        </div>

        {/* Receivable */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Receivable (Assets)</h3>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddReceivable(true)}><Plus className="h-3 w-3 mr-1" /> Add</Button>
          </div>
          <div className="space-y-2">
            {receivables.map(r => (
              <div key={r.id} className="flex justify-between items-start bg-muted/50 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.address} • {r.purpose}</p>
                </div>
                <p className="font-bold text-success">৳{r.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex justify-between font-semibold">
            <span>Total Receivable</span>
            <span className="text-success">৳{totalReceivable.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Add Liability Dialog */}
      <Dialog open={showAddLiability} onOpenChange={setShowAddLiability}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Payable Entry</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
            <div><Label>Purpose</Label><Input value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} /></div>
            <div><Label>Amount *</Label><Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
            <Button onClick={handleAddLiability} className="w-full">Add Payable</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Receivable Dialog */}
      <Dialog open={showAddReceivable} onOpenChange={setShowAddReceivable}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Receivable Entry</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
            <div><Label>Purpose</Label><Input value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} /></div>
            <div><Label>Amount *</Label><Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
            <Button onClick={handleAddReceivable} className="w-full">Add Receivable</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
