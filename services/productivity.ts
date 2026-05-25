import { queryRowsFallback } from "@/common/libs/table-query";
import { supabaseServer } from "@/common/libs/supabase-server";
import {
  HabitConfigItem,
  MonthlyTrackerItem,
  ProductivityLogItem,
  TabunganUmrohItem,
  YearlyPlanItem,
} from "@/common/types/productivity";

const PRODUCTIVITY_TABLES = ["Productivity", "productivity"];
const MONTHLY_TRACKER_TABLES = ["MonthlyTracker", "monthly_tracker"];
const HABIT_TABLES = ["HabitConfig", "habit_config"];
const SAVINGS_TABLES = ["TabunganUmroh", "tabungan_umroh"];
const YEARLY_TABLES = ["YearlyPlan", "yearly_plan"];

export async function getProductivityLogs() {
  return queryRowsFallback<ProductivityLogItem>(PRODUCTIVITY_TABLES, (table) =>
    supabaseServer.from(table).select("*").order("date", { ascending: false }),
  );
}

export async function getMonthlyTrackers() {
  return queryRowsFallback<MonthlyTrackerItem>(
    MONTHLY_TRACKER_TABLES,
    (table) =>
      supabaseServer.from(table).select("*").order("date", {
        ascending: false,
      }),
  );
}

export async function getHabitConfigs() {
  return queryRowsFallback<HabitConfigItem>(HABIT_TABLES, (table) =>
    supabaseServer
      .from(table)
      .select("*")
      .order("sortOrder", { ascending: true }),
  );
}

export async function getSavingsPlans() {
  return queryRowsFallback<TabunganUmrohItem>(SAVINGS_TABLES, (table) =>
    supabaseServer
      .from(table)
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: true }),
  );
}

export async function getYearlyPlans() {
  return queryRowsFallback<YearlyPlanItem>(YEARLY_TABLES, (table) =>
    supabaseServer
      .from(table)
      .select("*")
      .order("sortOrder", { ascending: true })
      .order("createdAt", { ascending: false }),
  );
}

export async function getProductivityHubData() {
  const [logs, monthlyTrackers, habitConfigs, savingsPlans, yearlyPlans] =
    await Promise.all([
      getProductivityLogs(),
      getMonthlyTrackers(),
      getHabitConfigs(),
      getSavingsPlans(),
      getYearlyPlans(),
    ]);

  return {
    logs,
    monthlyTrackers,
    habitConfigs,
    savingsPlans,
    yearlyPlans,
  };
}
