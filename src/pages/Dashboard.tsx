import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, CreditCard, ShoppingCart, ArrowUpRight } from "lucide-react";
import StatCard from "@/components/StatCard";
import OrderTable from "@/components/OrderTable";
import { MOCK_ORDERS, MOCK_EXPENSES, MOCK_RECEIVABLES, MOCK_LIABILITIES } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", income: 13000, expense: 4700 },
  { month: "Feb", income: 8000, expense: 800 },
  { month: "Mar", income: 7000, expense: 17000 },
];

const serviceBreakdown = [
  { name: "BIN Return", value: 5000 },
  { name: "Passport", value: 8000 },
  { name: "NID Correction", value: 3000 },
  { name: "TIN Certificate", value: 4000 },
];

const CHART_COLORS = [
  "hsl(215 80% 48%)", "hsl(168 70% 42%)", "hsl(38 92% 50%)", "hsl(280 60% 55%)"
];

export default function Dashboard() {
  const totalIncome = MOCK_ORDERS.reduce((s, o) => s + o.payments.reduce((ps, p) => ps + p.amount, 0), 0);
  const totalExpense = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);
  const cashInHand = totalIncome - totalExpense;
  const totalReceivable = MOCK_RECEIVABLES.reduce((s, r) => s + r.amount, 0)
    + MOCK_ORDERS.reduce((s, o) => s + (o.serviceCharge - o.payments.reduce((ps, p) => ps + p.amount, 0)), 0);
  const totalPayable = MOCK_LIABILITIES.reduce((s, l) => s + l.amount, 0);

  const recentOrders = [...MOCK_ORDERS].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Yearly overview — 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Cash in Hand" value={`৳${cashInHand.toLocaleString()}`} icon={Wallet} gradient="blue" />
        <StatCard title="Total Expense" value={`৳${totalExpense.toLocaleString()}`} icon={TrendingDown} gradient="red" />
        <StatCard title="Total Receivable" value={`৳${totalReceivable.toLocaleString()}`} icon={TrendingUp} gradient="green" />
        <StatCard title="Total Payable" value={`৳${totalPayable.toLocaleString()}`} icon={CreditCard} gradient="orange" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(214 20% 90%)", fontSize: 13 }}
                formatter={(val: number) => `৳${val.toLocaleString()}`}
              />
              <Bar dataKey="income" fill="hsl(215 80% 48%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Services Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={serviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                {serviceBreakdown.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `৳${val.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {serviceBreakdown.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Orders</h3>
          <a href="/orders" className="text-xs text-primary flex items-center gap-1 hover:underline">
            View all <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <OrderTable orders={recentOrders} />
      </div>
    </div>
  );
}
