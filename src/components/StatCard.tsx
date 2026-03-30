import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  gradient: "blue" | "green" | "orange" | "red";
  subtitle?: string;
}

const gradientClass = {
  blue: "stat-gradient-blue",
  green: "stat-gradient-green",
  orange: "stat-gradient-orange",
  red: "stat-gradient-red",
};

export default function StatCard({ title, value, icon: Icon, gradient, subtitle }: StatCardProps) {
  return (
    <div className={`${gradientClass[gradient]} rounded-xl p-5 text-primary-foreground animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-85">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-lg bg-primary-foreground/15">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
