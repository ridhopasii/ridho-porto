export interface ProductivityLogItem {
  id: number | string;
  date: string;
  tasks: unknown;
  dayType?: string | null;
  mood?: string | null;
  goals?: string | null;
  pomodoroMinutes?: number | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface MonthlyTrackerItem {
  id: number | string;
  date: string;
  checklist: Record<string, boolean> | unknown;
  notes?: string | null;
  createdAt?: string | null;
}

export interface HabitConfigItem {
  id: number | string;
  name: string;
  category: string;
  icon?: string | null;
  isActive?: boolean | null;
  frequency?: string | null;
  target?: number | null;
  sortOrder?: number | null;
}

export interface YearlyPlanItem {
  id: number | string;
  year: number;
  category: string;
  item: string;
  monthlyHabit?: string | null;
  weeklyHabit?: string | null;
  dailyHabit?: string | null;
  completed?: boolean | null;
  progress?: number | null;
  sortOrder?: number | null;
  createdAt?: string | null;
}

export interface TabunganUmrohItem {
  id: number | string;
  month: string;
  year: number;
  category: string;
  amount?: number | null;
  target?: number | null;
  notes?: string | null;
  createdAt?: string | null;
}
