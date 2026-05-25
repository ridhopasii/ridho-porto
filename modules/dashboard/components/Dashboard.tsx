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

type MainTab = "produktif" | "keuangan";
type ProductiveTab = "ringkasan" | "tracker" | "rencana" | "tabungan" | "kebiasaan";
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

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const safeNumber = (value: unknown) => Number(value || 0);

const parseTasks = (tasks: unknown) => {
  if (Array.isArray(tasks)) return tasks;

  if (typeof tasks === "string") {
    try {
      const parsed = JSON.parse(tasks);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const parseChecklist = (checklist: unknown) => {
  if (checklist && typeof checklist === "object" && !Array.isArray(checklist)) {
    return checklist as Record<string, boolean>;
  }

  if (typeof checklist === "string") {
    try {
      const parsed = JSON.parse(checklist);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, boolean>)
        : {};
    } catch {
      return {};
    }
  }

  return {};
};

const groupBy = <T,>(items: T[], getter: (item: T) => string) => {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = getter(item) || "Lainnya";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

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
  const monthlyTrackers = productivity.monthlyTrackers || [];
  const habitConfigs = productivity.habitConfigs || [];
  const savingsPlans = productivity.savingsPlans || [];
  const yearlyPlans = productivity.yearlyPlans || [];
  const wallets = finance.wallets || [];
  const transactions = finance.transactions || [];

  const activeHabits = habitConfigs.filter((habit) => habit.isActive !== false);
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

  const latestLog = logs[0];
  const latestTasks = parseTasks(latestLog?.tasks);
  const recentTrackers = monthlyTrackers.slice(0, 4);
  const walletMap = new Map(wallets.map((wallet) => [String(wallet.id), wallet]));
  const yearlyGroups = groupBy(yearlyPlans, (item) => item.category);
  const habitGroups = groupBy(activeHabits, (item) => item.category);
  const savingsGroups = groupBy(savingsPlans, (item) => item.category);

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
              Semua yang penting dikumpulkan dalam satu tempat, dengan toggle
              yang ringan supaya pindah antar bagian terasa cepat dan rapi.
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
                { value: "ringkasan", label: "Ringkasan", icon: "📊" },
                { value: "tracker", label: "Bulanan", icon: "🗓️" },
                { value: "rencana", label: "Tahunan", icon: "🧭" },
                { value: "tabungan", label: "Tabungan", icon: "🕌" },
                { value: "kebiasaan", label: "Kebiasaan", icon: "✅" },
              ]}
            />
          </HubCard>

          {productiveTab === "ringkasan" ? (
            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.95fr]">
              <HubCard className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                      Log Terakhir
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                      {formatDate(latestLog?.date)}
                    </h2>
                  </div>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {latestLog?.dayType || "Dynamic"}
                  </span>
                </div>

                {latestLog ? (
                  <div className="mt-5 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Mood
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {latestLog.mood || "-"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Goals
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {latestLog.goals || "-"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Pomodoro
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {numberFormatter.format(
                            safeNumber(latestLog.pomodoroMinutes),
                          )}{" "}
                          menit
                        </p>
                      </div>
                      <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Progress Tugas
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {latestTasks.filter((task: any) => task.completed)
                            .length}
                          /{latestTasks.length || 0}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                        Tasks
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {latestTasks.slice(0, 8).map((task: any, index: number) => (
                          <div
                            key={`${task.name || "task"}-${index}`}
                            className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 dark:border-neutral-800"
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                task.completed ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-700"
                              }`}
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {task.name || task.blockName || "Task"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    Belum ada productivity log yang tersimpan.
                  </div>
                )}
              </HubCard>

              <HubCard className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                      Tracker Bulanan
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                      Entri terbaru
                    </h2>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
                    {numberFormatter.format(monthlyTrackers.length)} bulan
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {recentTrackers.map((tracker) => {
                    const checklist = parseChecklist(tracker.checklist);
                    const total = Object.keys(checklist).length;
                    const checked = Object.values(checklist).filter(Boolean).length;
                    const percent = total ? Math.round((checked / total) * 100) : 0;

                    return (
                      <div
                        key={`${tracker.id}-${tracker.date}`}
                        className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                              {formatDate(tracker.date)}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {checked}/{total} checklist terselesaikan
                            </p>
                          </div>
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {percent}%
                          </span>
                        </div>
                        {tracker.notes ? (
                          <p className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                            {tracker.notes}
                          </p>
                        ) : null}
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {recentTrackers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                      Monthly tracker belum ada isinya.
                    </div>
                  ) : null}
                </div>
              </HubCard>
            </div>
          ) : null}

          {productiveTab === "tracker" ? (
            <HubCard className="p-5">
              <div className="grid gap-4">
                {monthlyTrackers.map((tracker) => {
                  const checklist = parseChecklist(tracker.checklist);
                  const total = Object.keys(checklist).length;
                  const checked = Object.values(checklist).filter(Boolean).length;
                  const percent = total ? Math.round((checked / total) * 100) : 0;

                  return (
                    <div
                      key={String(tracker.id)}
                      className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                            {formatDate(tracker.date)}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {checked}/{total} checklist selesai
                          </p>
                        </div>
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
                          {percent}%
                        </span>
                      </div>

                      {tracker.notes ? (
                        <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                          {tracker.notes}
                        </p>
                      ) : null}
                    </div>
                  );
                })}

                {monthlyTrackers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    Monthly tracker belum tersedia.
                  </div>
                ) : null}
              </div>
            </HubCard>
          ) : null}

          {productiveTab === "rencana" ? (
            <div className="space-y-5">
              {Object.entries(yearlyGroups).map(([category, items]) => (
                <HubCard key={category} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        {category}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                        {items.length} target
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {items.map((plan) => {
                      const progress = safeNumber(plan.progress);
                      return (
                        <div
                          key={String(plan.id)}
                          className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                                {plan.item}
                              </p>
                              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {plan.year}
                              </p>
                            </div>
                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {progress}%
                            </span>
                          </div>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                            <div
                              className={`h-full rounded-full ${plan.completed ? "bg-emerald-500" : "bg-blue-500"}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="mt-4 space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                            {plan.monthlyHabit ? <p>Bulanan: {plan.monthlyHabit}</p> : null}
                            {plan.weeklyHabit ? <p>Mingguan: {plan.weeklyHabit}</p> : null}
                            {plan.dailyHabit ? <p>Harian: {plan.dailyHabit}</p> : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </HubCard>
              ))}

              {yearlyPlans.length === 0 ? (
                <HubCard className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Yearly plan belum diisi.
                </HubCard>
              ) : null}
            </div>
          ) : null}

          {productiveTab === "tabungan" ? (
            <div className="space-y-5">
              {Object.entries(savingsGroups).map(([category, items]) => (
                <HubCard key={category} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        {category}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                        {numberFormatter.format(items.length)} entri
                      </h3>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
                      {currencyFormatter.format(
                        items.reduce((sum, item) => sum + safeNumber(item.amount), 0),
                      )}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => {
                      const amount = safeNumber(item.amount);
                      const target = safeNumber(item.target);
                      const progress = target ? Math.min(100, Math.round((amount / target) * 100)) : 0;

                      return (
                        <div
                          key={String(item.id)}
                          className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                                {item.month} {item.year}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {item.category}
                              </p>
                            </div>
                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {progress}%
                            </span>
                          </div>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
                              <p className="text-neutral-500 dark:text-neutral-400">Terkumpul</p>
                              <p className="mt-1 font-semibold text-neutral-950 dark:text-white">
                                {currencyFormatter.format(amount)}
                              </p>
                            </div>
                            <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
                              <p className="text-neutral-500 dark:text-neutral-400">Target</p>
                              <p className="mt-1 font-semibold text-neutral-950 dark:text-white">
                                {currencyFormatter.format(target)}
                              </p>
                            </div>
                          </div>

                          {item.notes ? (
                            <p className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                              {item.notes}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </HubCard>
              ))}

              {savingsPlans.length === 0 ? (
                <HubCard className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Tabungan umroh belum ada.
                </HubCard>
              ) : null}
            </div>
          ) : null}

          {productiveTab === "kebiasaan" ? (
            <div className="space-y-5">
              {Object.entries(habitGroups).map(([category, items]) => (
                <HubCard key={category} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        {category}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                        {items.length} kebiasaan
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((habit) => (
                      <div
                        key={String(habit.id)}
                        className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-100 text-lg dark:bg-neutral-900">
                              {habit.icon || "✨"}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                                {habit.name}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {habit.frequency || "daily"} • target {habit.target || 1}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              habit.isActive !== false
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                            }`}
                          >
                            {habit.isActive !== false ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </HubCard>
              ))}

              {activeHabits.length === 0 ? (
                <HubCard className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Belum ada kebiasaan yang aktif.
                </HubCard>
              ) : null}
            </div>
          ) : null}
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

          {financeTab === "dompet" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {wallets.map((wallet) => (
                <HubCard key={String(wallet.id)} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-2xl text-xl"
                        style={{
                          backgroundColor: `${wallet.color || "#3b82f6"}20`,
                          color: wallet.color || "#3b82f6",
                        }}
                      >
                        {wallet.icon || "💳"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                          {wallet.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatDate(wallet.createdAt || wallet.created_at)}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
                      {currencyFormatter.format(safeNumber(wallet.balance))}
                    </span>
                  </div>
                </HubCard>
              ))}

              {wallets.length === 0 ? (
                <HubCard className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Belum ada dompet keuangan.
                </HubCard>
              ) : null}
            </div>
          ) : null}

          {financeTab === "transaksi" ? (
            <HubCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                  <thead className="bg-neutral-50 dark:bg-neutral-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        Dompet
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        Tipe
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        Nominal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        Deskripsi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {transactions.map((transaction) => {
                      const wallet = walletMap.get(String(transaction.wallet_id));
                      const isIncome = transaction.type === "income";

                      return (
                        <tr key={String(transaction.id)}>
                          <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                            {wallet?.name || String(transaction.wallet_id)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                isIncome
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {isIncome ? "Income" : "Expense"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-neutral-950 dark:text-white">
                            {currencyFormatter.format(safeNumber(transaction.amount))}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                            {transaction.description || "-"}
                          </td>
                        </tr>
                      );
                    })}

                    {transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
                        >
                          Belum ada transaksi keuangan.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </HubCard>
          ) : null}
        </div>
      )}
    </div>
  );
}
