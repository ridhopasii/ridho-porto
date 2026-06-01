"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { TbEdit, TbTrash, TbPlus } from "react-icons/tb";
import { ModalShell, FormFooter, inputCls, labelCls } from "../AdminFormUI";

// Draggable Item Component
function SortableItem({ id, plan, setEditPlan, deletePlan }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm cursor-grab active:cursor-grabbing mb-2 group touch-none">
       <div className="flex justify-between items-start">
         <p className="text-sm dark:text-white font-medium">{plan.item}</p>
         <div className="hidden group-hover:flex gap-1 ml-2">
            <button onPointerDown={(e) => { e.stopPropagation(); setEditPlan(plan); }} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" title="Edit"><TbEdit size={16} /></button>
            <button onPointerDown={(e) => { e.stopPropagation(); deletePlan(plan.id); }} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" title="Hapus"><TbTrash size={16} /></button>
         </div>
       </div>
       <div className="flex justify-between items-center mt-2">
         <span className="text-[10px] uppercase font-bold text-neutral-400">{plan.category || 'Tugas'}</span>
         <span className="text-[10px] text-blue-500">{plan.progress}%</span>
       </div>
    </div>
  );
}

// Droppable Column Component
function Column({ id, title, items, setEditPlan, deletePlan, onClearDone }: any) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 min-h-[400px] border border-neutral-100 dark:border-neutral-800 flex-1 flex flex-col">
       <h4 className="font-bold mb-4 dark:text-white flex justify-between items-center">
         {title} 
         <div className="flex gap-2 items-center">
           {id === 'done' && items.length > 0 && (
             <button onClick={onClearDone} className="text-xs bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded transition-colors" title="Bersihkan kartu yang sudah selesai">🧹 Sapu</button>
           )}
           <span className="text-xs font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full">{items.length}</span>
         </div>
       </h4>
       <div ref={setNodeRef} className="flex-1">
         <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
           {items.map((item: any) => <SortableItem key={item.id} id={item.id} plan={item} setEditPlan={setEditPlan} deletePlan={deletePlan} />)}
         </SortableContext>
       </div>
    </div>
  );
}

export default function PlanningManager({
  activeTab = "rencana",
  onMutate,
}: {
  activeTab?: "rencana" | "tabungan";
  onMutate?: () => void;
}) {
  const [plans, setPlans] = useState<any[]>([]);
  const [tabungan, setTabungan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newPlan, setNewPlan] = useState({ year: new Date().getFullYear(), category: "", item: "", progress: 0 });
  const [newTabungan, setNewTabungan] = useState({ month: "", year: new Date().getFullYear(), category: "", amount: 0, target: 0, notes: "" });

  // Edit states
  const [editPlan, setEditPlan] = useState<any>(null);
  const [editTabungan, setEditTabungan] = useState<any>(null);

  // Modal states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showTabunganModal, setShowTabunganModal] = useState(false);

  // Auto show modal when edit state is set
  useEffect(() => {
    if (editPlan) setShowPlanModal(true);
  }, [editPlan]);

  useEffect(() => {
    if (editTabungan) setShowTabunganModal(true);
  }, [editTabungan]);

  // Dnd states
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const columnsData = {
    todo: plans.filter(p => p.progress === 0),
    inProgress: plans.filter(p => p.progress > 0 && p.progress < 100),
    done: plans.filter(p => p.progress === 100),
  };

  const activePlan = activeId ? plans.find(p => p.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const currentPlan = plans.find(p => p.id === active.id);
    if (!currentPlan) return;

    const overId = over.id;
    let newProgress = currentPlan.progress;

    if (overId === "todo") newProgress = 0;
    else if (overId === "inProgress") newProgress = 50;
    else if (overId === "done") newProgress = 100;
    else {
      const overPlan = plans.find(p => p.id === overId);
      if (overPlan) {
        if (overPlan.progress === 0) newProgress = 0;
        else if (overPlan.progress > 0 && overPlan.progress < 100) newProgress = 50;
        else if (overPlan.progress === 100) newProgress = 100;
      }
    }

    if (newProgress !== currentPlan.progress) {
      const updatedPlan = { ...currentPlan, progress: newProgress };
      setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));

      try {
        const res = await fetch("/api/admin/planning", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_plan", payload: updatedPlan }),
        });
        if (!res.ok) throw new Error("Gagal menyimpan progress");
        toast.success("Progress diperbarui");
        onMutate?.();
      } catch (e: any) {
        toast.error(e.message);
        fetchData();
      }
    }
  };

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
        setNewPlan({ year: new Date().getFullYear(), category: "", item: "", progress: 0 });
      }
      setShowPlanModal(false);
      fetchData();
      onMutate?.();
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
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleClearDone = async () => {
    if (!window.confirm("Yakin ingin menghapus semua kartu yang sudah selesai (100%)?")) return;
    const toastId = toast.loading("Menyapu papan...");
    try {
      const doneIds = columnsData.done.map(p => p.id);
      for (const id of doneIds) {
        await fetch(`/api/admin/planning?action=delete_plan&id=${id}`, { method: "DELETE" });
      }
      toast.success("Papan berhasil dibersihkan!", { id: toastId });
      fetchData();
      onMutate?.();
    } catch (e: any) {
      toast.error("Gagal membersihkan papan", { id: toastId });
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
        setNewTabungan({ month: "", year: new Date().getFullYear(), category: "", amount: 0, target: 0, notes: "" });
      }
      setShowTabunganModal(false);
      fetchData();
      onMutate?.();
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
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
        ))}
      </div>
    );

  const totalTabungan = tabungan.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTargetTabungan = tabungan.reduce((sum, t) => sum + (Number(t.target) || 0), 0);
  const percentageTabungan = totalTargetTabungan > 0 ? ((totalTabungan / totalTargetTabungan) * 100).toFixed(1) : 0;
  const totalPlans = plans.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* YEARLY PLAN / KANBAN */}
        {activeTab === "rencana" && (
        <div className="space-y-6">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
              <Column id="todo" title="💡 Ide / Rencana" items={columnsData.todo} setEditPlan={setEditPlan} deletePlan={deletePlan} />
              <Column id="inProgress" title="⚙️ Sedang Dikerjakan" items={columnsData.inProgress} setEditPlan={setEditPlan} deletePlan={deletePlan} />
              <Column id="done" title="✅ Selesai" items={columnsData.done} setEditPlan={setEditPlan} deletePlan={deletePlan} onClearDone={handleClearDone} />
            </div>
            <DragOverlay>
              {activePlan ? (
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg border-2 border-blue-500 shadow-xl opacity-80 rotate-2 cursor-grabbing">
                  <p className="text-sm dark:text-white font-medium">{activePlan.item}</p>
                  <div className="text-xs text-neutral-400 mt-2">{activePlan.category || 'Tugas'}</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <button onClick={() => { setEditPlan(null); setShowPlanModal(true); }} className="flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 p-4 w-full justify-center text-neutral-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20">
            <TbPlus size={20} />
            <span className="font-semibold">Tambah Rencana Baru</span>
          </button>

          {showPlanModal && (
            <ModalShell title={editPlan ? "✏️ Edit Rencana" : "✨ Tambah Rencana Baru"} onClose={() => { setShowPlanModal(false); setTimeout(() => setEditPlan(null), 200); }}>
              <form onSubmit={e => { e.preventDefault(); handlePlanSave(); }} className="space-y-4">
                <div>
                  <label className={labelCls}>Kategori</label>
                  <input type="text" placeholder="Misal: Pekerjaan, Pribadi" value={editPlan ? editPlan.category : newPlan.category} onChange={e => editPlan ? setEditPlan({...editPlan, category: e.target.value}) : setNewPlan({...newPlan, category: e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Nama Rencana / Tugas</label>
                  <input type="text" placeholder="Detail rencana..." value={editPlan ? editPlan.item : newPlan.item} onChange={e => editPlan ? setEditPlan({...editPlan, item: e.target.value}) : setNewPlan({...newPlan, item: e.target.value})} className={inputCls} required />
                </div>
                <FormFooter loading={false} onClose={() => { setShowPlanModal(false); setTimeout(() => setEditPlan(null), 200); }} saveLabel={editPlan ? "Simpan Perubahan" : "Tambahkan"} />
              </form>
            </ModalShell>
          )}
        </div>
        )}

        {/* TABUNGAN UMROH */}
        {activeTab === "tabungan" && (
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Tabungan Tujuan</h3>
          <div className="space-y-3">
            {tabungan.map(t => {
              const isDone = t.target > 0 && t.amount >= t.target;
              return (
              <div key={t.id} className={`group rounded-xl border p-3 text-sm transition-all ${isDone ? 'border-yellow-300 bg-yellow-50/50 dark:border-yellow-600/50 dark:bg-yellow-900/20' : 'border-neutral-100 dark:border-neutral-800'} dark:text-white`}>
                <div className="flex justify-between items-center font-medium mb-1">
                  <span className="flex items-center gap-2">
                    {t.category} ({t.month} {t.year})
                    {isDone && <span className="animate-bounce inline-block text-lg" title="Target Tercapai!">🏆</span>}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={isDone ? "text-yellow-600 dark:text-yellow-500 font-bold" : ""}>Rp {t.amount.toLocaleString()} / Rp {t.target.toLocaleString()}</span>
                    <div className="hidden gap-2 group-hover:flex">
                      <button onClick={() => setEditTabungan(t)} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" title="Edit"><TbEdit size={16} /></button>
                      <button onClick={() => deleteTabungan(t.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" title="Hapus"><TbTrash size={16} /></button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-500">{t.notes}</p>
                
                {/* Progress Bar Mini */}
                <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${isDone ? 'bg-yellow-400' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (t.amount/t.target)*100)}%` }}></div>
                </div>
              </div>
            )})}
          </div>
          <button onClick={() => { setEditTabungan(null); setShowTabunganModal(true); }} className="mt-4 flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 p-4 w-full justify-center text-neutral-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20">
            <TbPlus size={20} />
            <span className="font-semibold">Tambah Target Tabungan</span>
          </button>

          {showTabunganModal && (
            <ModalShell title={editTabungan ? "✏️ Edit Tabungan" : "✨ Tambah Tabungan"} onClose={() => { setShowTabunganModal(false); setTimeout(() => setEditTabungan(null), 200); }}>
              <form onSubmit={e => { e.preventDefault(); handleTabunganSave(); }} className="space-y-4">
                <div>
                  <label className={labelCls}>Kategori / Tujuan</label>
                  <input type="text" placeholder="Misal: Umroh" value={editTabungan ? editTabungan.category : newTabungan.category} onChange={e => editTabungan ? setEditTabungan({...editTabungan, category: e.target.value}) : setNewTabungan({...newTabungan, category: e.target.value})} className={inputCls} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Bulan & Tahun (Opsional)</label>
                    <input type="text" placeholder="Misal: Jan 2026" value={editTabungan ? editTabungan.month : newTabungan.month} onChange={e => editTabungan ? setEditTabungan({...editTabungan, month: e.target.value}) : setNewTabungan({...newTabungan, month: e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Uang Terkumpul (Rp)</label>
                    <input type="number" placeholder="Nominal saat ini" value={editTabungan ? editTabungan.amount : newTabungan.amount} onChange={e => editTabungan ? setEditTabungan({...editTabungan, amount: Number(e.target.value)}) : setNewTabungan({...newTabungan, amount: Number(e.target.value)})} className={inputCls} required />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Target Dana (Rp)</label>
                  <input type="number" placeholder="Target nominal" value={editTabungan ? editTabungan.target : newTabungan.target} onChange={e => editTabungan ? setEditTabungan({...editTabungan, target: Number(e.target.value)}) : setNewTabungan({...newTabungan, target: Number(e.target.value)})} className={inputCls} required />
                </div>
                <FormFooter loading={false} onClose={() => { setShowTabunganModal(false); setTimeout(() => setEditTabungan(null), 200); }} saveLabel={editTabungan ? "Simpan Perubahan" : "Tambahkan"} />
              </form>
            </ModalShell>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
