import { useState } from "react";
import { MOCK_ORDERS, MOCK_EXPENSES } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportsPage() {
  const [period, setPeriod] = useState("all");

  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.serviceCharge, 0);
  const totalCost = MOCK_ORDERS.reduce((s, o) => s + o.operatingCost, 0);
  const totalExpenses = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);
  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit - totalExpenses;

  // Expense by category
  const expByCat: Record<string, number> = {};
  MOCK_EXPENSES.forEach(e => { expByCat[e.category] = (expByCat[e.category] || 0) + e.amount; });
  const expCatData = Object.entries(expByCat).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Per-client
  const clientData: Record<string, { revenue: number; cost: number; paid: number }> = {};
  MOCK_ORDERS.forEach(o => {
    if (!clientData[o.clientName]) clientData[o.clientName] = { revenue: 0, cost: 0, paid: 0 };
    clientData[o.clientName].revenue += o.serviceCharge;
    clientData[o.clientName].cost += o.operatingCost;
    clientData[o.clientName].paid += o.payments.reduce((s, p) => s + p.amount, 0);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground text-sm">Financial summaries and analytics</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
            <SelectItem value="yearly">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* P&L Summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Profit & Loss Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Revenue", value: totalRevenue, color: "text-primary" },
            { label: "Operating Cost", value: totalCost, color: "text-warning" },
            { label: "Gross Profit", value: grossProfit, color: "text-success" },
            { label: "Expenses", value: totalExpenses, color: "text-destructive" },
            { label: "Net Profit", value: netProfit, color: netProfit >= 0 ? "text-success" : "text-destructive" },
          ].map(item => (
            <div key={item.label} className="text-center bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>৳{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expense by Category Chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={expCatData} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
            <Tooltip formatter={(val: number) => `৳${val.toLocaleString()}`} />
            <Bar dataKey="value" fill="hsl(0 72% 51%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Client-wise */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Client-wise Report</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 font-semibold text-muted-foreground">Client</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Revenue</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Cost</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Profit</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Paid</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Due</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(clientData).map(([name, d]) => (
              <tr key={name} className="border-b border-border/50">
                <td className="py-3 font-medium">{name}</td>
                <td className="py-3 text-right">৳{d.revenue.toLocaleString()}</td>
                <td className="py-3 text-right text-warning">৳{d.cost.toLocaleString()}</td>
                <td className="py-3 text-right text-success">৳{(d.revenue - d.cost).toLocaleString()}</td>
                <td className="py-3 text-right text-success">৳{d.paid.toLocaleString()}</td>
                <td className="py-3 text-right text-destructive">৳{(d.revenue - d.paid).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
