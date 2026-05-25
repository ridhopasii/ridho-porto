export interface WalletItem {
  id: number | string;
  name: string;
  color?: string | null;
  icon?: string | null;
  balance?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface FinancialTransactionItem {
  id: number | string;
  wallet_id: number | string;
  type: "income" | "expense";
  amount: number;
  description?: string | null;
  date: string;
  createdAt?: string | null;
  created_at?: string | null;
}
