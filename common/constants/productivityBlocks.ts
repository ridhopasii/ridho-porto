export const PRODUCTIVITY_BLOCKS = {
  block1: [
    "Tahajud",
    "Subuh + Qur'an + Al-Waqiah",
    "Zikir pagi",
    "Dhuha",
    "Zuhur + Ar-Rahman",
    "Ashar + Al-Insyirah",
    "Magrib + Yasin",
    "Isya + Al-Mulk",
    "Tilawah 10 halaman",
    "5 vocabulary",
    "Jurnal malam",
    "Listening Episoden",
  ],
  block2A: [
    "Deep Work Python",
    "Speaking (record 30 menit)",
    "Latihan desain 30 menit",
  ],
  block2B: [
    "Deep Work C",
    "English reading & writing",
    "Belajar materi (WPU / konsep)",
  ],
  block2Sunday: ["Administrasi file", "Review mingguan", "Istirahat / buffer"],
  block3: ["Review minggu", "Rapikan file", "Buffer task"],
};

export function getDayType(dateStr: string) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  if (dayOfWeek === 0) return "Minggu";
  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) return "A";
  return "B";
}

export function getAllTasksForDay(dayType: string) {
  let block2Tasks: string[] = [];
  if (dayType === "A") {
    block2Tasks = PRODUCTIVITY_BLOCKS.block2A;
  } else if (dayType === "B") {
    block2Tasks = PRODUCTIVITY_BLOCKS.block2B;
  } else {
    block2Tasks = PRODUCTIVITY_BLOCKS.block2Sunday;
  }

  return [
    ...PRODUCTIVITY_BLOCKS.block1,
    ...block2Tasks,
    ...PRODUCTIVITY_BLOCKS.block3,
  ];
}

export function getCategorizedTasksForDay(dayType: string) {
  let block2Tasks: string[] = [];
  if (dayType === "A") {
    block2Tasks = PRODUCTIVITY_BLOCKS.block2A;
  } else if (dayType === "B") {
    block2Tasks = PRODUCTIVITY_BLOCKS.block2B;
  } else {
    block2Tasks = PRODUCTIVITY_BLOCKS.block2Sunday;
  }

  return {
    block1: PRODUCTIVITY_BLOCKS.block1,
    block2: block2Tasks,
    block3: PRODUCTIVITY_BLOCKS.block3,
  };
}
