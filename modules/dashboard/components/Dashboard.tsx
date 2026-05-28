"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

import SegmentedTabs from "@/common/components/elements/SegmentedTabs";
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

type MainTab = "produktif" | "keuangan";
type ProductiveTab = "ringkasan" | "riwayat" | "tracker" | "rencana" | "tabungan" | "kebiasaan";
type FinanceTab = "dompet" | "transaksi";

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

const HubCard = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <HubCard className="p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
      {label}
    </p>
    <p className="mt-2 text-2xl font-black tracking-tight text-neutral-950 dark:text-white">
      {value}
    </p>
    {hint ? <p className="mt-2 text-xs text-neutral-500">{hint}</p> : null}
  </HubCard>
);

export default function Dashboard({
  locale,
  productivity,
  finance,
}: DashboardProps) {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>("produktif");
  const [productiveTab, setProductiveTab] = useState<ProductiveTab>("ringkasan");
  const [financeTab, setFinanceTab] = useState<FinanceTab>("dompet");

  const logs = productivity.logs || [];
  const savingsPlans = productivity.savingsPlans || [];
  const wallets = finance.wallets || [];
  const transactions = finance.transactions || [];

  const totalPomodoro = logs.reduce(
    (sum, item) => sum + safeNumber(item.pomodoroMinutes),
    0,
  );
  const totalSavings = savingsPlans.reduce(
    (sum, item) => sum + safeNumber(item.amount),
    0,
  );
  const savingsTarget = savingsPlans.reduce(
    (sum, item) => sum + safeNumber(item.target),
    0,
  );
  const savingsProgress = savingsTarget
    ? Math.round((totalSavings / savingsTarget) * 100)
    : 0;
  const totalBalance = wallets.reduce(
    (sum, item) => sum + safeNumber(item.balance),
    0,
  );
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + safeNumber(item.amount), 0);
  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + safeNumber(item.amount), 0);

  const handleLogout = async () => {
    await fetch("/api/private-dashboard/login", { method: "DELETE" });
    router.refresh();
  };

  const topLinks = [
    { href: `/${locale}/admin`, label: "Admin", icon: "🔐" },
    { href: `/${locale}/blog`, label: "Blog", icon: "✍️" },
    { href: `/${locale}/achievements`, label: "Pencapaian", icon: "🏆" },
  ];

  return (
    <div className="space-y-6 px-4 py-6 md:px-0">
      <section className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-white via-white to-cyan-50 p-5 shadow-sm dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-cyan-950/10 md:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">
              Private Hub
            </p>
            <h1 className="max-w-2xl text-3xl font-black tracking-tight text-neutral-950 dark:text-white md:text-4xl">
              Dashboard pribadimu untuk produktif, keuangan, dan pencapaian.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Kelola dan pantau seluruh aspek produktivitas dan finansialmu di satu tempat.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-blue-900 dark:hover:text-blue-400"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-red-900 dark:hover:text-red-400"
              >
                🚪 Keluar
              </button>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[420px]">
            <StatCard
              label="Saldo Total"
              value={currencyFormatter.format(totalBalance)}
              hint={`${numberFormatter.format(wallets.length)} dompet aktif`}
            />
            <StatCard
              label="Savings"
              value={`${savingsProgress}%`}
              hint={`${currencyFormatter.format(totalSavings)} / ${currencyFormatter.format(savingsTarget)}`}
            />
            <StatCard
              label="Pomodoro"
              value={`${numberFormatter.format(totalPomodoro)} menit`}
              hint={`${numberFormatter.format(logs.length)} log produktif`}
            />
            <StatCard
              label="Arus Kas"
              value={currencyFormatter.format(totalIncome - totalExpense)}
              hint={`${currencyFormatter.format(totalIncome)} masuk, ${currencyFormatter.format(totalExpense)} keluar`}
            />
          </div>
        </div>
      </section>

      <HubCard className="p-1">
        <SegmentedTabs
          value={mainTab}
          onChange={setMainTab}
          options={[
            { value: "produktif", label: "Produktif", icon: "🌿" },
            { value: "keuangan", label: "Keuangan", icon: "💰" },
          ]}
        />
      </HubCard>

      {mainTab === "produktif" ? (
        <div className="space-y-5">
          <HubCard className="p-1">
            <SegmentedTabs
              value={productiveTab}
              onChange={setProductiveTab}
              options={[
                { value: "ringkasan", label: "Analitik", icon: "📊" },
                { value: "riwayat", label: "Riwayat", icon: "🕒" },
                { value: "tracker", label: "Tracker", icon: "📈" },
                { value: "rencana", label: "Rencana", icon: "🎯" },
                { value: "tabungan", label: "Tabungan", icon: "💰" },
                { value: "kebiasaan", label: "Kebiasaan", icon: "✨" },
              ]}
            />
          </HubCard>

          {productiveTab === "ringkasan" ? <ProductivityManager activeTab="ringkasan" /> : null}
          {productiveTab === "riwayat" ? <ProductivityManager activeTab="riwayat" /> : null}
          {productiveTab === "tracker" ? <HabitsManager activeTab="tracker" /> : null}
          {productiveTab === "kebiasaan" ? <HabitsManager activeTab="kebiasaan" /> : null}
          {productiveTab === "rencana" ? <PlanningManager activeTab="rencana" /> : null}
          {productiveTab === "tabungan" ? <PlanningManager activeTab="tabungan" /> : null}
        </div>
      ) : (
        <div className="space-y-5">
          <HubCard className="p-1">
            <SegmentedTabs
              value={financeTab}
              onChange={setFinanceTab}
              options={[
                { value: "dompet", label: "Dompet", icon: "💳" },
                { value: "transaksi", label: "Transaksi", icon: "🧾" },
              ]}
            />
          </HubCard>

          {financeTab === "dompet" ? <FinanceManager activeTab="dompet" /> : null}
          {financeTab === "transaksi" ? <FinanceManager activeTab="transaksi" /> : null}
        </div>
      )}
    </div>
  );
}
