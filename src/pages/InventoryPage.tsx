import { useState } from "react";
import { INVENTORY_ITEMS, MOCK_LIABILITIES, MOCK_RECEIVABLES } from "@/data/mockData";
import { InventoryItem, Liability, Receivable } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingDown, TrendingUp } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inventory & Stock</h2>
        <p className="text-muted-foreground text-sm">Manage product stock</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 font-semibold text-muted-foreground">Product</th>
              <th className="pb-3 font-semibold text-muted-foreground text-center">Stock</th>
              <th className="pb-3 font-semibold text-muted-foreground text-center">Unit</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Unit Price</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {INVENTORY_ITEMS.map(item => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-3 font-medium">{item.name}</td>
                <td className="py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.stock < 10 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                    {item.stock}
                  </span>
                </td>
                <td className="py-3 text-center text-muted-foreground">{item.unit}</td>
                <td className="py-3 text-right">৳{item.unitPrice.toLocaleString()}</td>
                <td className="py-3 text-right font-medium">৳{(item.stock * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
