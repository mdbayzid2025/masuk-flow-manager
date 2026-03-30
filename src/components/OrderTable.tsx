import { Order } from "@/data/types";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  ongoing: "bg-info/15 text-info border-info/30",
  completed: "bg-success/15 text-success border-success/30",
};

interface Props {
  orders: Order[];
  onSelect?: (order: Order) => void;
}

export default function OrderTable({ orders, onSelect }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 font-semibold text-muted-foreground">ID</th>
            <th className="pb-3 font-semibold text-muted-foreground">Client</th>
            <th className="pb-3 font-semibold text-muted-foreground hidden sm:table-cell">Service</th>
            <th className="pb-3 font-semibold text-muted-foreground">Status</th>
            <th className="pb-3 font-semibold text-muted-foreground text-right">Charge</th>
            <th className="pb-3 font-semibold text-muted-foreground text-right hidden md:table-cell">Paid</th>
            <th className="pb-3 font-semibold text-muted-foreground text-right hidden md:table-cell">Due</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const paid = order.payments.reduce((s, p) => s + p.amount, 0);
            const due = order.serviceCharge - paid;
            return (
              <tr
                key={order.id}
                className="border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelect?.(order)}
              >
                <td className="py-3 font-medium">{order.id}</td>
                <td className="py-3">
                  <div>{order.clientName}</div>
                  <div className="text-xs text-muted-foreground">{order.phone}</div>
                </td>
                <td className="py-3 hidden sm:table-cell">{order.service}</td>
                <td className="py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 text-right font-medium">৳{order.serviceCharge.toLocaleString()}</td>
                <td className="py-3 text-right hidden md:table-cell text-success">৳{paid.toLocaleString()}</td>
                <td className="py-3 text-right hidden md:table-cell text-destructive">৳{due.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
