"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function PlanningManager({ activeTab = "rencana" }: { activeTab?: "rencana" | "tabungan" }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [tabungan, setTabungan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newPlan, setNewPlan] = useState({ year: 2026, category: "", item: "", progress: 0 });
  const [newTabungan, setNewTabungan] = useState({ month: "", year: 2026, category: "", amount: 0, target: 0, notes: "" });

  // Edit states
  const [editPlan, setEditPlan] = useState<any>(null);
  const [editTabungan, setEditTabungan] = useState<any>(null);

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

  const handlePlanSave = async () => {
    const toastId = toast.loading(editPlan ? "Menyimpan plan..." : "Membuat plan...");
    try {
      if (editPlan) {
        const res = await fetch("/api/admin/planning", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_plan", payload: editPlan }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Berhasil diperbarui", { id: toastId });
        setEditPlan(null);
      } else {
        const res = await fetch("/api/admin/planning", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create_plan", payload: newPlan }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Berhasil ditambahkan", { id: toastId });
        setNewPlan({ year: 2026, category: "", item: "", progress: 0 });
      }
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const deletePlan = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus plan ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/planning?action=delete_plan&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleTabunganSave = async () => {
    const toastId = toast.loading(editTabungan ? "Menyimpan tabungan..." : "Menambahkan tabungan...");
    try {
      if (editTabungan) {
        const res = await fetch("/api/admin/planning", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_tabungan", payload: { ...editTabungan, amount: Number(editTabungan.amount), target: Number(editTabungan.target) } }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Berhasil diperbarui", { id: toastId });
        setEditTabungan(null);
      } else {
        const res = await fetch("/api/admin/planning", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create_tabungan", payload: { ...newTabungan, amount: Number(newTabungan.amount), target: Number(newTabungan.target) } }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Berhasil ditambahkan", { id: toastId });
        setNewTabungan({ month: "", year: 2026, category: "", amount: 0, target: 0, notes: "" });
      }
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const deleteTabungan = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus rekor tabungan ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/planning?action=delete_tabungan&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  const totalTabungan = tabungan.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTargetTabungan = tabungan.reduce((sum, t) => sum + (Number(t.target) || 0), 0);
  const percentageTabungan = totalTargetTabungan > 0 ? ((totalTabungan / totalTargetTabungan) * 100).toFixed(1) : 0;
  const totalPlans = plans.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* YEARLY PLAN */}
        {activeTab === "rencana" && (
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Yearly Plan 2026+</h3>
          <div className="space-y-2">
            {plans.map(p => (
              <div key={p.id} className="group rounded border border-neutral-100 p-2 text-sm dark:border-neutral-800 dark:text-white">
                <div className="flex justify-between font-medium">
                  <span>{p.category}</span>
                  <div className="flex items-center gap-3">
                    <span>{p.progress}%</span>
                    <div className="hidden gap-2 group-hover:flex">
                      <button onClick={() => setEditPlan(p)} className="text-xs font-semibold text-blue-500">Edit</button>
                      <button onClick={() => deletePlan(p.id)} className="text-xs font-semibold text-red-500">Del</button>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-500">{p.item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <h4 className="mb-2 text-sm font-medium dark:text-white">{editPlan ? "Edit Plan" : "Tambah Plan"}</h4>
            <div className="grid gap-2">
              <input type="text" placeholder="Kategori" value={editPlan ? editPlan.category : newPlan.category} onChange={e => editPlan ? setEditPlan({...editPlan, category: e.target.value}) : setNewPlan({...newPlan, category: e.target.value})} className="rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              <input type="text" placeholder="Item Plan" value={editPlan ? editPlan.item : newPlan.item} onChange={e => editPlan ? setEditPlan({...editPlan, item: e.target.value}) : setNewPlan({...newPlan, item: e.target.value})} className="rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              <div className="flex gap-2">
                <input type="number" placeholder="Progress (%)" value={editPlan ? editPlan.progress : newPlan.progress} onChange={e => editPlan ? setEditPlan({...editPlan, progress: Number(e.target.value)}) : setNewPlan({...newPlan, progress: Number(e.target.value)})} className="w-1/3 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
                <button onClick={handlePlanSave} disabled={editPlan ? !editPlan.item : !newPlan.item} className="flex-1 rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50">
                  {editPlan ? "Simpan Perubahan" : "Add"}
                </button>
                {editPlan && <button onClick={() => setEditPlan(null)} className="rounded bg-neutral-200 px-3 py-1 text-sm dark:bg-neutral-800 dark:text-white">Batal</button>}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* TABUNGAN UMROH */}
        {activeTab === "tabungan" && (
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Tabungan Tujuan</h3>
          <div className="space-y-2">
            {tabungan.map(t => (
              <div key={t.id} className="group rounded border border-neutral-100 p-2 text-sm dark:border-neutral-800 dark:text-white">
                <div className="flex justify-between font-medium">
                  <span>{t.category} ({t.month} {t.year})</span>
                  <div className="flex items-center gap-3">
                    <span>Rp {t.amount.toLocaleString()} / Rp {t.target.toLocaleString()}</span>
                    <div className="hidden gap-2 group-hover:flex">
                      <button onClick={() => setEditTabungan(t)} className="text-xs font-semibold text-blue-500">Edit</button>
                      <button onClick={() => deleteTabungan(t.id)} className="text-xs font-semibold text-red-500">Del</button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-500">{t.notes}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <h4 className="mb-2 text-sm font-medium dark:text-white">{editTabungan ? "Edit Tabungan" : "Tambah Tabungan"}</h4>
            <div className="grid gap-2">
              <input type="text" placeholder="Kategori (Misal: Umroh)" value={editTabungan ? editTabungan.category : newTabungan.category} onChange={e => editTabungan ? setEditTabungan({...editTabungan, category: e.target.value}) : setNewTabungan({...newTabungan, category: e.target.value})} className="rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              <div className="flex gap-2">
                <input type="text" placeholder="Bulan (Misal: Jan)" value={editTabungan ? editTabungan.month : newTabungan.month} onChange={e => editTabungan ? setEditTabungan({...editTabungan, month: e.target.value}) : setNewTabungan({...newTabungan, month: e.target.value})} className="w-1/2 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
                <input type="number" placeholder="Nominal" value={editTabungan ? editTabungan.amount : newTabungan.amount} onChange={e => editTabungan ? setEditTabungan({...editTabungan, amount: Number(e.target.value)}) : setNewTabungan({...newTabungan, amount: Number(e.target.value)})} className="w-1/2 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              </div>
              <input type="number" placeholder="Target Dana" value={editTabungan ? editTabungan.target : newTabungan.target} onChange={e => editTabungan ? setEditTabungan({...editTabungan, target: Number(e.target.value)}) : setNewTabungan({...newTabungan, target: Number(e.target.value)})} className="w-full rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" />
              <div className="flex gap-2">
                <button onClick={handleTabunganSave} disabled={editTabungan ? !editTabungan.amount : !newTabungan.amount} className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
                  {editTabungan ? "Simpan Perubahan" : "Simpan Tabungan"}
                </button>
                {editTabungan && <button onClick={() => setEditTabungan(null)} className="rounded bg-neutral-200 px-4 py-2 text-sm font-medium dark:bg-neutral-800 dark:text-white">Batal</button>}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
