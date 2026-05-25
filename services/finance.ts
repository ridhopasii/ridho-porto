import { queryRowsFallback } from "@/common/libs/table-query";
import { supabaseServer } from "@/common/libs/supabase-server";
import {
  FinancialTransactionItem,
  WalletItem,
} from "@/common/types/finance";

const WALLET_TABLES = ["Wallets", "wallets"];
const TRANSACTION_TABLES = ["FinancialTransactions", "financialtransactions"];

export async function getWalletsData() {
  return queryRowsFallback<WalletItem>(WALLET_TABLES, (table) =>
    supabaseServer
      .from(table)
      .select("*")
      .order("created_at", { ascending: false }),
  );
}

export async function getFinancialTransactionsData() {
  return queryRowsFallback<FinancialTransactionItem>(
    TRANSACTION_TABLES,
    (table) =>
      supabaseServer
        .from(table)
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false }),
  );
}

export async function getFinanceHubData() {
  const [wallets, transactions] = await Promise.all([
    getWalletsData(),
    getFinancialTransactionsData(),
  ]);

  return {
    wallets,
    transactions,
  };
}
