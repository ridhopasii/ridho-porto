import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

export interface HistoricalAverages {
  [category: string]: {
    average: number;
    count: number;
    total: number;
  };
}

export const getHistoricalExpenses = async (limit = 150): Promise<HistoricalAverages> => {
  try {
    const { data, error } = await supabase
      .from("FinancialTransactions")
      .select("*")
      .eq("type", "expense")
      .order("date", { ascending: false })
      .limit(limit);

    if (error || !data) return {};

    const categories: { [cat: string]: { total: number; count: number } } = {};

    data.forEach((tx) => {
      let cat = "Lainnya";
      const desc = tx.description || "";
      
      if (desc.includes(" - ")) {
        cat = desc.split(" - ")[0].trim();
      } else {
        const common = ["Makan", "Transport", "Belanja", "Hiburan", "Tagihan", "Lainnya"];
        const found = common.find((c) => desc.toLowerCase().startsWith(c.toLowerCase()));
        if (found) cat = found;
      }

      if (!categories[cat]) {
        categories[cat] = { total: 0, count: 0 };
      }
      categories[cat].total += Number(tx.amount || 0);
      categories[cat].count += 1;
    });

    const averages: HistoricalAverages = {};
    Object.keys(categories).forEach((cat) => {
      averages[cat] = {
        average: Math.round(categories[cat].total / categories[cat].count),
        count: categories[cat].count,
        total: categories[cat].total,
      };
    });

    return averages;
  } catch (e) {
    console.error("Failed to get historical averages:", e);
    return {};
  }
};

export const getSubscriptionAuditData = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 45); // 45 days historical data
    const cutoffStr = cutoffDate.toISOString().split("T")[0];

    const [
      { data: transactions },
      { data: trackers },
      { data: habits },
      { data: productivity },
    ] = await Promise.all([
      supabase.from("FinancialTransactions").select("*").eq("type", "expense").gte("date", cutoffStr),
      supabase.from("MonthlyTracker").select("*").gte("date", cutoffStr),
      supabase.from("HabitConfig").select("*"),
      supabase.from("Productivity").select("*").gte("date", cutoffStr),
    ]);

    // Filter recurring or subscription transactions
    const activeBills = (transactions || []).filter((tx) => {
      const desc = (tx.description || "").toLowerCase();
      return (
        desc.includes("tagihan") ||
        desc.includes("langganan") ||
        desc.includes("subscription") ||
        desc.includes("premium") ||
        desc.startsWith("tagihan - ")
      );
    });

    return {
      activeBills: activeBills.map(b => ({
        date: b.date,
        description: b.description,
        amount: b.amount
      })),
      trackers: trackers || [],
      habits: habits || [],
      productivityLogs: (productivity || []).map(p => ({
        date: p.date,
        dayType: p.dayType,
        pomodoroMinutes: p.pomodoroMinutes,
        mood: p.mood
      }))
    };
  } catch (e) {
    console.error("Failed to get subscription audit data:", e);
    return { activeBills: [], trackers: [], habits: [], productivityLogs: [] };
  }
};

// Ringkasan keuangan + produktivitas + habit untuk 7 hari terakhir.
// Dipakai oleh laporan mingguan otomatis via Telegram (cron weekly-report).
export const getWeeklySummary = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    const cutoffStr = cutoffDate.toISOString().split("T")[0];

    const [
      { data: transactions },
      { data: trackers },
      { data: habits },
      { data: productivity },
    ] = await Promise.all([
      supabase.from("FinancialTransactions").select("*").gte("date", cutoffStr),
      supabase.from("MonthlyTracker").select("*").gte("date", cutoffStr),
      supabase.from("HabitConfig").select("*"),
      supabase.from("Productivity").select("*").gte("date", cutoffStr),
    ]);

    const txs = transactions || [];

    // Agregasi keuangan: total pemasukan, pengeluaran, dan per-kategori.
    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCategory: { [cat: string]: number } = {};
    const common = ["Makan", "Transport", "Belanja", "Hiburan", "Tagihan", "Lainnya"];

    txs.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      if (tx.type === "income") {
        totalIncome += amount;
        return;
      }
      totalExpense += amount;

      let cat = "Lainnya";
      const desc = tx.description || "";
      if (desc.includes(" - ")) {
        cat = desc.split(" - ")[0].trim();
      } else {
        const found = common.find((c) => desc.toLowerCase().startsWith(c.toLowerCase()));
        if (found) cat = found;
      }
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + amount;
    });

    const topCategories = Object.entries(expenseByCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    // Agregasi produktivitas: total pomodoro & rata-rata penyelesaian tugas.
    let totalPomodoroMinutes = 0;
    let totalTasks = 0;
    let completedTasks = 0;
    (productivity || []).forEach((p) => {
      totalPomodoroMinutes += Number(p.pomodoroMinutes || 0);
      try {
        const parsed = JSON.parse(p.tasks || "[]");
        totalTasks += parsed.length;
        completedTasks += parsed.filter((x: any) => x.completed).length;
      } catch (e) {}
    });

    // Agregasi habit: hitung berapa kali tiap habit tercapai sepanjang minggu.
    const habitTally = (habits || []).map((h) => {
      let hit = 0;
      (trackers || []).forEach((t) => {
        if ((t.checklist || {})[h.id]) hit += 1;
      });
      return { name: `${h.icon || ""} ${h.name}`.trim(), hit, outOf: (trackers || []).length };
    });

    return {
      periodStart: cutoffStr,
      periodEnd: new Date().toISOString().split("T")[0],
      finance: {
        totalIncome,
        totalExpense,
        net: totalIncome - totalExpense,
        topCategories,
        transactionCount: txs.length,
      },
      productivity: {
        totalPomodoroMinutes,
        totalPomodoroSessions: Math.floor(totalPomodoroMinutes / 25),
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        daysLogged: (productivity || []).length,
      },
      habits: habitTally,
    };
  } catch (e) {
    console.error("Failed to get weekly summary:", e);
    return null;
  }
};

export const getHabitFrictionData = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days data
    const cutoffStr = cutoffDate.toISOString().split("T")[0];

    const [
      { data: trackers },
      { data: habits },
      { data: productivity },
    ] = await Promise.all([
      supabase.from("MonthlyTracker").select("*").gte("date", cutoffStr).order("date", { ascending: true }),
      supabase.from("HabitConfig").select("*"),
      supabase.from("Productivity").select("*").gte("date", cutoffStr).order("date", { ascending: true }),
    ]);

    const habitMap = (habits || []).reduce((acc, h) => {
      acc[h.id] = `${h.icon} ${h.name}`;
      return acc;
    }, {} as { [id: string]: string });

    const dailySummary = (trackers || []).map((t) => {
      const prod = (productivity || []).find((p) => p.date === t.date);
      
      let totalTasks = 0;
      let completedTasks = 0;
      if (prod && prod.tasks) {
        try {
          const parsed = JSON.parse(prod.tasks);
          totalTasks = parsed.length;
          completedTasks = parsed.filter((x: any) => x.completed).length;
        } catch (e) {}
      }

      const completedHabitsList: string[] = [];
      const missedHabitsList: string[] = [];
      
      const chk = t.checklist || {};
      (habits || []).forEach((h) => {
        if (chk[h.id]) {
          completedHabitsList.push(habitMap[h.id]);
        } else {
          missedHabitsList.push(habitMap[h.id]);
        }
      });

      return {
        date: t.date,
        dayType: prod?.dayType || "Regular",
        tasksCount: totalTasks,
        completedTasksCount: completedTasks,
        pomodoroMinutes: prod?.pomodoroMinutes || 0,
        mood: prod?.mood || "🙂",
        completedHabits: completedHabitsList,
        missedHabits: missedHabitsList
      };
    });

    return dailySummary;
  } catch (e) {
    console.error("Failed to get habit friction data:", e);
    return [];
  }
};
