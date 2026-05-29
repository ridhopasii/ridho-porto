"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";

import PrivateHubLayout from "./PrivateHubLayout";
import {
  FinancialTransactionItem,
  WalletItem,
} from "@/common/types/finance";
import {
  HabitConfigItem,
  MonthlyTrackerItem,
  ProductivityLogItem,
  TabunganUmrohItem,
  YearlyPlanItem,
} from "@/common/types/productivity";

// Import Full CRUD Managers
import FinanceManager from "@/modules/admin/components/managers/FinanceManager";
import ProductivityManager from "@/modules/admin/components/managers/ProductivityManager";
import HabitsManager from "@/modules/admin/components/managers/HabitsManager";
import PlanningManager from "@/modules/admin/components/managers/PlanningManager";

type ProductiveTab = "harian" | "riwayat" | "tracker" | "rencana" | "tabungan" | "pengaturan_hari";
type FinanceTab = "dompet" | "transaksi";
type ActiveTab = ProductiveTab | FinanceTab;

const PRODUCTIVE_TABS: ProductiveTab[] = ["harian", "riwayat", "tracker", "rencana", "tabungan", "pengaturan_hari"];
const FINANCE_TABS: FinanceTab[] = ["dompet", "transaksi"];

interface DashboardProps {
  locale: string;
  productivity: {
    logs: ProductivityLogItem[];
    monthlyTrackers: MonthlyTrackerItem[];
    habitConfigs: HabitConfigItem[];
    savingsPlans: TabunganUmrohItem[];
    yearlyPlans: YearlyPlanItem[];
  };
  finance: {
    wallets: WalletItem[];
    transactions: FinancialTransactionItem[];
  };
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("id-ID");
const safeNumber = (value: unknown) => Number(value || 0);

export default function Dashboard({
  locale,
  productivity,
  finance,
}: DashboardProps) {
  const router = useRouter();
  const pathname = usePathname() || "";

  // Detect active tab from URL
  const segments = pathname.split("/");
  const slugTab = segments[segments.length - 1] as ActiveTab;
  const validTab: ActiveTab = [...PRODUCTIVE_TABS, ...FINANCE_TABS].includes(slugTab as any)
    ? slugTab
    : "harian";

  const [activeTab, setActiveTab] = useState<ActiveTab>(validTab);
  const [editMode, setEditMode] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    const newTab = [...PRODUCTIVE_TABS, ...FINANCE_TABS].includes(slugTab as any)
      ? slugTab
      : "harian";
    setActiveTab(newTab);
  }, [pathname, slugTab]);

  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      setActiveTab(tab);
      router.push(`/${locale}/private-hub/${tab}`);
    },
    [locale, router]
  );

  const [localWallets, setLocalWallets] = useState(finance.wallets || []);
  const [localTransactions, setLocalTransactions] = useState(finance.transactions || []);
  const [localLogs, setLocalLogs] = useState(productivity.logs || []);
  const [localSavings, setLocalSavings] = useState(productivity.savingsPlans || []);

  const refreshStats = useCallback(async () => {
    try {
      const [financeRes, planningRes, productivityRes] = await Promise.all([
        fetch("/api/admin/finance"),
        fetch("/api/admin/planning"),
        fetch("/api/admin/productivity"),
      ]);
      if (financeRes.ok) {
        const data = await financeRes.json();
        setLocalWallets(data.wallets || []);
        setLocalTransactions(data.transactions || []);
      }
      if (planningRes.ok) {
        const data = await planningRes.json();
        setLocalSavings(data.tabungan || []);
      }
      if (productivityRes.ok) {
        const data = await productivityRes.json();
        if (Array.isArray(data)) setLocalLogs(data);
      }
    } catch {
      // silent
    }
  }, []);

  const stats = useMemo(() => {
    const totalPomodoro = localLogs.reduce((sum, item) => sum + safeNumber(item.pomodoroMinutes), 0);
    const totalSavings = localSavings.reduce((sum, item) => sum + safeNumber(item.amount), 0);
    const savingsTarget = localSavings.reduce((sum, item) => sum + safeNumber(item.target), 0);
    const savingsProgress = savingsTarget ? Math.round((totalSavings / savingsTarget) * 100) : 0;
    const totalBalance = localWallets.reduce((sum, item) => sum + safeNumber(item.balance), 0);
    const totalIncome = localTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + safeNumber(item.amount), 0);
    const totalExpense = localTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + safeNumber(item.amount), 0);
    return { totalPomodoro, totalSavings, savingsTarget, savingsProgress, totalBalance, totalIncome, totalExpense };
  }, [localLogs, localSavings, localWallets, localTransactions]);

  const isProductiveTab = PRODUCTIVE_TABS.includes(activeTab as ProductiveTab);
  const isFinanceTab = FINANCE_TABS.includes(activeTab as FinanceTab);

  return (
    <PrivateHubLayout
      editMode={editMode}
      onEditModeChange={setEditMode}
    >
      <div className="space-y-5 p-4 lg:p-6">

        {/* Stats Header */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: "Saldo Total",
              value: currencyFormatter.format(stats.totalBalance),
              hint: `${numberFormatter.format(localWallets.length)} dompet`,
              color: "text-cyan-500",
            },
            {
              label: "Tabungan",
              value: `${stats.savingsProgress}%`,
              hint: `${currencyFormatter.format(stats.totalSavings)} / ${currencyFormatter.format(stats.savingsTarget)}`,
              color: "text-emerald-500",
            },
            {
              label: "Pomodoro",
              value: `${numberFormatter.format(stats.totalPomodoro)} mnt`,
              hint: `${numberFormatter.format(localLogs.length)} log`,
              color: "text-violet-500",
            },
            {
              label: "Arus Kas",
              value: currencyFormatter.format(stats.totalIncome - stats.totalExpense),
              hint: `+${currencyFormatter.format(stats.totalIncome)} / -${currencyFormatter.format(stats.totalExpense)}`,
              color: stats.totalIncome >= stats.totalExpense ? "text-emerald-500" : "text-red-500",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{item.label}</p>
              <p className={`mt-2 text-2xl font-black tracking-tight ${item.color}`}>{item.value}</p>
              {item.hint && <p className="mt-1 text-[11px] text-neutral-500">{item.hint}</p>}
            </div>
          ))}
        </section>

        {/* Edit mode banner */}
        {editMode && (
          <div className="flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-[13px] font-medium text-cyan-800 dark:border-cyan-800/40 dark:bg-cyan-950/30 dark:text-cyan-300">
            <span className="text-lg">✏️</span>
            <span>Mode Edit aktif — kamu bisa tambah, ubah, dan hapus data di bawah.</span>
          </div>
        )}

        {/* Content area */}
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/40">

          {/* Produktivitas tabs */}
          {isProductiveTab && (
            <div
              className={activeTab === "harian" || activeTab === "riwayat" || activeTab === "pengaturan_hari" ? "" : (activeTab === "tracker" || activeTab === "rencana" || activeTab === "tabungan" ? "" : "hidden")}
            >
              {(activeTab === "harian" || activeTab === "riwayat" || activeTab === "pengaturan_hari") && (
                <ProductivityManager
                  activeTab={activeTab as any}
                  onMutate={refreshStats}
                />
              )}
              {activeTab === "tracker" && (
                <HabitsManager onMutate={refreshStats} />
              )}
              {(activeTab === "rencana" || activeTab === "tabungan") && (
                <PlanningManager
                  activeTab={activeTab as "rencana" | "tabungan"}
                  onMutate={refreshStats}
                />
              )}
            </div>
          )}

          {/* Keuangan tabs */}
          {isFinanceTab && (
            <FinanceManager
              activeTab={activeTab as FinanceTab}
              onMutate={refreshStats}
            />
          )}
        </div>
      </div>
    </PrivateHubLayout>
  );
}
