export type OrderStatus = "pending" | "ongoing" | "completed";

export interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  note: string;
}

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  status: OrderStatus;
  serviceCharge: number;
  operatingCost: number;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  method: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  unitPrice: number;
}

export interface Liability {
  id: string;
  name: string;
  address: string;
  purpose: string;
  amount: number;
}

export interface Receivable {
  id: string;
  name: string;
  address: string;
  purpose: string;
  amount: number;
}
