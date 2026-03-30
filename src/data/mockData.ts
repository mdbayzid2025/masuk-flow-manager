import { Order, Expense, Payment, InventoryItem, Liability, Receivable } from "./types";

export const SERVICES = [
  "BIN Return", "NID Correction", "Passport", "TIN Certificate",
  "Trade License", "Company Registration", "Tax Return", "Birth Certificate",
  "Visa Processing", "Computer Repair", "Printing & Lamination", "Other"
] as const;

export const EXPENSE_CATEGORIES = [
  "Housing", "Transportation", "Loans", "Food", "Entertainment",
  "Children", "Family Care", "Shop", "Gifts/Donations",
  "Savings/Investments", "Met Life Policy", "Others"
] as const;

export const PAYMENT_METHODS = [
  "Cash", "bKash Personal", "bKash Merchant", "Rocket", "Nagad",
  "Brac Bank Savings", "Brac Bank Current", "Telecash Agent",
  "Teletalk Balance", "Insurance", "Savings"
] as const;

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: "1", name: "A4 Paper", stock: 50, unit: "Ream", unitPrice: 550 },
  { id: "2", name: "Ali Mobile", stock: 3, unit: "Pcs", unitPrice: 8500 },
  { id: "3", name: "Epson Ink", stock: 12, unit: "Bottle", unitPrice: 350 },
  { id: "4", name: "Laminate Paper", stock: 200, unit: "Sheet", unitPrice: 5 },
  { id: "5", name: "Legal Paper", stock: 30, unit: "Ream", unitPrice: 600 },
  { id: "6", name: "Pantum Ink", stock: 5, unit: "Cartridge", unitPrice: 1800 },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001", clientName: "Abdul Karim", phone: "01712345678",
    service: "BIN Return", status: "ongoing", serviceCharge: 5000,
    operatingCost: 1500, payments: [
      { id: "p1", amount: 2000, method: "Cash", date: "2026-01-15", note: "Advance" }
    ],
    createdAt: "2026-01-15", updatedAt: "2026-01-20"
  },
  {
    id: "ORD-002", clientName: "Fatema Begum", phone: "01898765432",
    service: "Passport", status: "completed", serviceCharge: 8000,
    operatingCost: 3000, payments: [
      { id: "p2", amount: 4000, method: "bKash Personal", date: "2026-02-01", note: "Advance" },
      { id: "p3", amount: 4000, method: "Cash", date: "2026-02-20", note: "Final" }
    ],
    createdAt: "2026-02-01", updatedAt: "2026-02-20"
  },
  {
    id: "ORD-003", clientName: "Mohammad Hasan", phone: "01611223344",
    service: "NID Correction", status: "pending", serviceCharge: 3000,
    operatingCost: 800, payments: [],
    createdAt: "2026-03-10", updatedAt: "2026-03-10"
  },
  {
    id: "ORD-004", clientName: "Rina Akter", phone: "01555667788",
    service: "TIN Certificate", status: "ongoing", serviceCharge: 4000,
    operatingCost: 1200, payments: [
      { id: "p4", amount: 2000, method: "Nagad", date: "2026-03-05", note: "Advance" }
    ],
    createdAt: "2026-03-05", updatedAt: "2026-03-15"
  },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: "e1", category: "Shop", description: "Electricity bill", amount: 3500, method: "Cash", date: "2026-01-05" },
  { id: "e2", category: "Transportation", description: "Fuel cost", amount: 1200, method: "Cash", date: "2026-01-10" },
  { id: "e3", category: "Food", description: "Staff lunch", amount: 800, method: "bKash Personal", date: "2026-02-01" },
  { id: "e4", category: "Housing", description: "Shop rent", amount: 12000, method: "Brac Bank Current", date: "2026-03-01" },
  { id: "e5", category: "Met Life Policy", description: "Monthly premium", amount: 5000, method: "Brac Bank Savings", date: "2026-03-01" },
];

export const MOCK_LIABILITIES: Liability[] = [
  { id: "l1", name: "Rafiq Uddin", address: "Siddhirganj", purpose: "Business Loan", amount: 50000 },
  { id: "l2", name: "Jamal Hossain", address: "Narayanganj", purpose: "Hawlad", amount: 25000 },
];

export const MOCK_RECEIVABLES: Receivable[] = [
  { id: "r1", name: "Kamal Ahmed", address: "Fatullah", purpose: "Service Due", amount: 8000 },
  { id: "r2", name: "Shahidul Islam", address: "Siddhirganj", purpose: "Product Credit", amount: 12000 },
];
