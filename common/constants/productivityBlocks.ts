export type DayTypeConfig = {
  id: string;
  name: string;
  daysOfWeek: number[]; // 0=Sun, 1=Mon, etc.
  tasks: string[];
};

export type ProductivityConfig = {
  morningTasks: string[];
  eveningTasks: string[];
  dayTypes: DayTypeConfig[];
};

export const DEFAULT_PRODUCTIVITY_CONFIG: ProductivityConfig = {
  morningTasks: [
    "Tahajud",
    "Subuh + Qur'an + Al-Waqiah",
    "Zikir pagi",
    "Dhuha",
    "Zuhur + Ar-Rahman",
    "Ashar + Al-Insyirah",
    "Magrib + Yasin"
  ],
  eveningTasks: [
    "Isya + Al-Mulk",
    "Tilawah 10 halaman",
    "5 vocabulary",
    "Jurnal malam",
    "Listening Episoden"
  ],
  dayTypes: [
    {
      id: "A",
      name: "Hari A (Fokus Spesifik)",
      daysOfWeek: [1, 3, 5],
      tasks: [
        "Deep Work Python",
        "Speaking (record 30 menit)",
        "Latihan desain 30 menit"
      ]
    },
    {
      id: "B",
      name: "Hari B (Fokus Spesifik)",
      daysOfWeek: [2, 4, 6],
      tasks: [
        "Deep Work C",
        "English reading & writing",
        "Belajar materi (WPU / konsep)"
      ]
    },
    {
      id: "Minggu",
      name: "Minggu (Review)",
      daysOfWeek: [0],
      tasks: [
        "Administrasi file", 
        "Review mingguan", 
        "Istirahat / buffer"
      ]
    },
    {
      id: "Work",
      name: "Work (Umum)",
      daysOfWeek: [],
      tasks: [
        "Selesaikan tugas harian"
      ]
    },
    {
      id: "Rest",
      name: "Rest",
      daysOfWeek: [],
      tasks: [
        "Tidur cukup",
        "Recharge energi"
      ]
    }
  ]
};

export function getDayType(dateStr: string, config: ProductivityConfig = DEFAULT_PRODUCTIVITY_CONFIG) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Cari dayType yang sesuai dengan hari ini
  const matchingType = config.dayTypes.find(dt => dt.daysOfWeek.includes(dayOfWeek));
  if (matchingType) {
    return matchingType.id;
  }
  
  // Fallback
  return config.dayTypes[0]?.id || "A";
}

export function getAllTasksForDay(dayTypeId: string, config: ProductivityConfig = DEFAULT_PRODUCTIVITY_CONFIG) {
  const dt = config.dayTypes.find(d => d.id === dayTypeId) || config.dayTypes[0];
  const dtTasks = dt ? dt.tasks : [];

  return [
    ...config.morningTasks,
    ...dtTasks,
    ...config.eveningTasks,
  ];
}

export function getCategorizedTasksForDay(dayTypeId: string, config: ProductivityConfig = DEFAULT_PRODUCTIVITY_CONFIG) {
  const dt = config.dayTypes.find(d => d.id === dayTypeId) || config.dayTypes[0];
  const dtTasks = dt ? dt.tasks : [];

  return {
    block1: config.morningTasks,
    block2: dtTasks,
    block3: config.eveningTasks,
  };
}
