"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function PlanningManager() {
  const [plans, setPlans] = useState<any[]>([]);
  const [tabungan, setTabungan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPlan, setNewPlan] = useState({ year: 2026, category: "", item: "" });
  const [newTabungan, setNewTabungan] = useState({ month: "", year: 2026, category: "", amount: 0, target: 0, notes: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/planning");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setPlans(data.plans);
      setTabungan(data.tabungan);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async () => {
    const toastId = toast.loading("Membuat plan...");
    try {
      const res = await fetch("/api/admin/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_plan", payload: newPlan }),
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Berhasil", { id: toastId });
      setNewPlan({ year: 2026, category: "", item: "" });
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const createTabungan = async () => {
    const toastId = toast.loading("Menambahkan tabungan...");
    try {
      const res = await fetch("/api/admin/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_tabungan", payload: { ...newTabungan, amount: Number(newTabungan.amount), target: Number(newTabungan.target) } }),
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Berhasil", { id: toastId });
      setNewTabungan({ month: "", year: 2026, category: "", amount: 0, target: 0, notes: "" });
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* YEARLY PLAN */}
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Yearly Plan 2026+</h3>
          <div className="space-y-2">
            {plans.map(p => (
              <div key={p.id} className="rounded border border-neutral-100 p-2 text-sm dark:border-neutral-800 dark:text-white">
                <div className="flex justify-between font-medium">
                  <span>{p.category}</span>
                  <span>{p.progress}%</span>
                </div>
                <p className="text-neutral-500">{p.item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <h4 className="mb-2 text-sm font-medium dark:text-white">Tambah Plan</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Kategori" value={newPlan.category} onChange={e => setNewPlan({...newPlan, category: e.target.value})} className="w-1/3 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              <input type="text" placeholder="Item Plan" value={newPlan.item} onChange={e => setNewPlan({...newPlan, item: e.target.value})} className="flex-1 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              <button onClick={createPlan} className="rounded bg-blue-600 px-3 py-1 text-sm text-white">Add</button>
            </div>
          </div>
        </div>

        {/* TABUNGAN UMROH */}
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Tabungan Tujuan</h3>
          <div className="space-y-2">
            {tabungan.map(t => (
              <div key={t.id} className="rounded border border-neutral-100 p-2 text-sm dark:border-neutral-800 dark:text-white">
                <div className="flex justify-between font-medium">
                  <span>{t.category} ({t.month} {t.year})</span>
                  <span>Rp {t.amount.toLocaleString()} / Rp {t.target.toLocaleString()}</span>
                </div>
                <p className="text-xs text-neutral-500">{t.notes}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <h4 className="mb-2 text-sm font-medium dark:text-white">Tambah Tabungan</h4>
            <div className="grid gap-2">
              <input type="text" placeholder="Kategori (Misal: Umroh)" value={newTabungan.category} onChange={e => setNewTabungan({...newTabungan, category: e.target.value})} className="rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              <div className="flex gap-2">
                <input type="text" placeholder="Bulan" value={newTabungan.month} onChange={e => setNewTabungan({...newTabungan, month: e.target.value})} className="w-1/2 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
                <input type="number" placeholder="Nominal" value={newTabungan.amount || ""} onChange={e => setNewTabungan({...newTabungan, amount: Number(e.target.value)})} className="w-1/2 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              </div>
              <button onClick={createTabungan} className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white">Simpan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
