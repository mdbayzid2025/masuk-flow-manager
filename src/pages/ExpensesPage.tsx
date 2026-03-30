import { useState } from "react";
import { Plus } from "lucide-react";
import { MOCK_EXPENSES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/data/mockData";
import { Expense } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ category: "", description: "", amount: "", method: "", date: "" });
  const [catFilter, setCatFilter] = useState("all");

  const filtered = catFilter === "all" ? expenses : expenses.filter(e => e.category === catFilter);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const handleCreate = () => {
    if (!form.category || !form.amount || !form.method) { toast.error("Fill required fields"); return; }
    const exp: Expense = {
      id: `e-${Date.now()}`, category: form.category, description: form.description,
      amount: Number(form.amount), method: form.method, date: form.date || new Date().toISOString().slice(0, 10),
    };
    setExpenses([exp, ...expenses]);
    setForm({ category: "", description: "", amount: "", method: "", date: "" });
    setShowNew(false);
    toast.success("Expense added");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Expenses</h2>
          <p className="text-muted-foreground text-sm">Track all business and personal expenses</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-1" /> Add Expense</Button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto text-sm font-semibold">Total: <span className="text-destructive">৳{total.toLocaleString()}</span></div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 font-semibold text-muted-foreground">Date</th>
              <th className="pb-3 font-semibold text-muted-foreground">Category</th>
              <th className="pb-3 font-semibold text-muted-foreground hidden sm:table-cell">Description</th>
              <th className="pb-3 font-semibold text-muted-foreground hidden md:table-cell">Method</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-b border-border/50">
                <td className="py-3">{e.date}</td>
                <td className="py-3"><span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">{e.category}</span></td>
                <td className="py-3 hidden sm:table-cell text-muted-foreground">{e.description}</td>
                <td className="py-3 hidden md:table-cell text-muted-foreground">{e.method}</td>
                <td className="py-3 text-right font-medium text-destructive">৳{e.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No expenses found</p>}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Amount *</Label><Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            </div>
            <div>
              <Label>Payment Method *</Label>
              <Select value={form.method} onValueChange={v => setForm({...form, method: v})}>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>{PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate} className="w-full">Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
