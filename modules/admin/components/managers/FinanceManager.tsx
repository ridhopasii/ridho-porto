"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { TbCoffee, TbCar, TbShoppingCart, TbDeviceGamepad2, TbEdit, TbTrash, TbPlus, TbDownload } from "react-icons/tb";
import { ModalShell, FormFooter, inputCls, labelCls } from "../AdminFormUI";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#f43f5e"];

export default function FinanceManager({
  activeTab = "dompet",
  onMutate,
}: {
  activeTab?: "dompet" | "transaksi";
  onMutate?: () => void;
}) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // forms
  const [newWallet, setNewWallet] = useState({ name: "", balance: 0, icon: "💳" });
  const [newTx, setNewTx] = useState({ wallet_id: "", type: "expense", amount: 0, description: "" });
  
  // edit mode
  const [editWallet, setEditWallet] = useState<any>(null);
  const [editTx, setEditTx] = useState<any>(null);
  
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);

  useEffect(() => {
    if (editWallet) setShowWalletModal(true);
  }, [editWallet]);

  useEffect(() => {
    if (editTx) setShowTxModal(true);
  }, [editTx]);

  // monthly limit limit state
  const [monthlyLimit, setMonthlyLimit] = useState(2000000);
  const [recurringTxs, setRecurringTxs] = useState<{id: string, name: string, amount: number}[]>([]);

  useEffect(() => {
    const savedLimit = localStorage.getItem("finance_monthly_limit");
    if (savedLimit) setMonthlyLimit(Number(savedLimit));
    
    const savedRecurring = localStorage.getItem("finance_recurring_txs");
    if (savedRecurring) {
      try { setRecurringTxs(JSON.parse(savedRecurring)); } catch(e) {}
    }
  }, []);

  const handleLimitChange = (val: number) => {
    setMonthlyLimit(val);
    localStorage.setItem("finance_monthly_limit", val.toString());
  };

  const currentMonthExp = useMemo(() => {
    const now = new Date();
    return transactions.reduce((sum, tx) => {
      const txDate = new Date(tx.date || new Date());
      if (tx.type === 'expense' && txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) {
        return sum + tx.amount;
      }
      return sum;
    }, 0);
  }, [transactions]);

  const isKanker = currentMonthExp > monthlyLimit;

  const expenseData = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const grouped = expenses.reduce((acc, tx) => {
      let desc = tx.description || "Lainnya";
      
      // Extract Category if format is "Category - Detail"
      if (desc.includes("-")) {
        desc = desc.split("-")[0].trim();
      }
      
      acc[desc] = (acc[desc] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // top 5 expenses
  }, [transactions]);

  const handleQuickAdd = (desc: string, amount: number) => {
    if (!wallets.length) return toast.error("Buat wallet terlebih dahulu di tab Dompet");
    setNewTx({ wallet_id: wallets[0].id, type: "expense", amount, description: desc });
    toast.success(`${desc} dimasukkan ke form. Silakan simpan!`);
  };

  const handleGenerateRecurring = async () => {
    if (recurringTxs.length === 0) return toast.error("Belum ada daftar pengeluaran rutin.");
    if (!wallets.length) return toast.error("Tidak ada wallet untuk transaksi.");
    if (!window.confirm("Catat semua pengeluaran rutin bulan ini secara otomatis?")) return;
    
    const toastId = toast.loading("Memasukkan transaksi rutin...");
    try {
      for (const tx of recurringTxs) {
        await fetch("/api/admin/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "create_tx", 
            payload: { wallet_id: wallets[0].id, type: "expense", amount: tx.amount, description: tx.name } 
          }),
        });
      }
      toast.success("Berhasil mencatat pengeluaran rutin!", { id: toastId });
      fetchFinance();
    } catch (e: any) {
      toast.error("Gagal mencatat pengeluaran rutin", { id: toastId });
    }
  };

  const addRecurringTemplate = () => {
    const name = window.prompt("Nama Pengeluaran Rutin (misal: Netflix, Kos):");
    if (!name) return;
    const amountStr = window.prompt("Nominal (Rp):");
    const amount = Number(amountStr);
    if (!amount) return toast.error("Nominal tidak valid");
    
    const newArr = [...recurringTxs, { id: Date.now().toString(), name, amount }];
    setRecurringTxs(newArr);
    localStorage.setItem("finance_recurring_txs", JSON.stringify(newArr));
    toast.success("Tersimpan!");
  };

  const deleteRecurringTemplate = (id: string) => {
    const newArr = recurringTxs.filter(x => x.id !== id);
    setRecurringTxs(newArr);
    localStorage.setItem("finance_recurring_txs", JSON.stringify(newArr));
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/finance");
      if (!res.ok) throw new Error("Gagal mengambil data keuangan");
      const data = await res.json();
      setWallets(data.wallets);
      setTransactions(data.transactions);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletSave = async () => {
    const toastId = toast.loading(editWallet ? "Menyimpan wallet..." : "Membuat wallet...");
    try {
      if (editWallet) {
        const res = await fetch("/api/admin/finance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_wallet", payload: editWallet }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Wallet berhasil diperbarui", { id: toastId });
        setEditWallet(null);
      } else {
        const res = await fetch("/api/admin/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create_wallet", payload: newWallet }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Wallet berhasil dibuat", { id: toastId });
        setNewWallet({ name: "", balance: 0, icon: "💳" });
      }
      setShowWalletModal(false);
      fetchFinance();
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const deleteWallet = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus wallet ini? Semua transaksi terkait mungkin akan error atau terhapus.")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/finance?action=delete_wallet&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchFinance();
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleTxSave = async () => {
    const toastId = toast.loading(editTx ? "Menyimpan transaksi..." : "Menambahkan transaksi...");
    try {
      if (editTx) {
        const res = await fetch("/api/admin/finance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_tx", payload: { ...editTx, amount: Number(editTx.amount) } }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Transaksi berhasil diperbarui", { id: toastId });
        setEditTx(null);
      } else {
        const res = await fetch("/api/admin/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create_tx", payload: { ...newTx, amount: Number(newTx.amount) } }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Transaksi berhasil dibuat", { id: toastId });
        setNewTx({ wallet_id: "", type: "expense", amount: 0, description: "" });
      }
      setShowTxModal(false);
      fetchFinance();
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const deleteTx = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini? Saldo wallet akan disesuaikan kembali.")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/finance?action=delete_tx&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchFinance();
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return toast.error("Tidak ada data untuk di-export");
    
    // Create CSV header
    const headers = ["Tanggal", "Jenis", "Nominal (Rp)", "Keterangan", "ID Wallet"];
    const csvRows = [headers.join(",")];
    
    // Add data rows
    transactions.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString('id-ID');
      const type = tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
      const amount = tx.amount;
      const desc = `"${tx.description.replace(/"/g, '""')}"`;
      const wallet = tx.wallet_id;
      csvRows.push([date, type, amount, desc, wallet].join(","));
    });
    
    // Create blob and download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Laporan berhasil di-download!");
  };

  if (loading)
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      {activeTab === "dompet" && (
        <div className="grid gap-6">
          {/* WALLETS */}
          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-semibold dark:text-white">Daftar Dompet (Wallets)</h3>
            <div className="flex flex-col gap-3">
              {wallets.map((w) => (
                <div key={w.id} className="group flex justify-between rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span>{w.icon}</span>
                    <span className="font-medium dark:text-white">{w.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold dark:text-white">Rp {w.balance?.toLocaleString()}</span>
                    <div className="hidden items-center gap-2 group-hover:flex">
                      <button onClick={() => setEditWallet(w)} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" title="Edit"><TbEdit size={16} /></button>
                      <button onClick={() => deleteWallet(w.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" title="Hapus"><TbTrash size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setEditWallet(null); setShowWalletModal(true); }}
              className="mt-4 flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 p-4 w-full justify-center text-neutral-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              <TbPlus size={20} />
              <span className="font-semibold">Tambah Wallet Baru</span>
            </button>
          </div>

          {showWalletModal && (
            <ModalShell title={editWallet ? "✏️ Edit Wallet" : "✨ Tambah Wallet"} onClose={() => { setShowWalletModal(false); setTimeout(() => setEditWallet(null), 200); }}>
              <form onSubmit={e => { e.preventDefault(); handleWalletSave(); }} className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20">
                    <label className={labelCls}>Ikon</label>
                    <input 
                      type="text" placeholder="💳" value={editWallet ? editWallet.icon : newWallet.icon} 
                      onChange={e => editWallet ? setEditWallet({...editWallet, icon: e.target.value}) : setNewWallet({...newWallet, icon: e.target.value})}
                      className={`${inputCls} text-center`} required
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelCls}>Nama Wallet</label>
                    <input 
                      type="text" placeholder="Misal: BCA, Gopay" value={editWallet ? editWallet.name : newWallet.name} 
                      onChange={e => editWallet ? setEditWallet({...editWallet, name: e.target.value}) : setNewWallet({...newWallet, name: e.target.value})}
                      className={inputCls} required
                    />
                  </div>
                </div>
                <FormFooter loading={false} onClose={() => { setShowWalletModal(false); setTimeout(() => setEditWallet(null), 200); }} saveLabel={editWallet ? "Simpan Perubahan" : "Tambahkan"} />
              </form>
            </ModalShell>
          )}
        </div>
      )}

      {activeTab === "transaksi" && (
        <div className="grid gap-6">
          {/* VISUAL CHART & KANKER WARNING */}
          <div className={`rounded-xl border ${isKanker ? 'border-red-500 shadow-red-200 dark:shadow-red-900/20' : 'border-neutral-200'} bg-white p-5 shadow-sm dark:bg-neutral-900 transition-colors`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold dark:text-white">Pengeluaran Terbesar Bulan Ini</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Batas: Rp</span>
                <input 
                  type="number" 
                  value={monthlyLimit} 
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="w-24 bg-neutral-100 dark:bg-neutral-800 text-xs px-2 py-1 rounded outline-none" 
                  title="Ubah Batas Aman Pengeluaran"
                />
              </div>
            </div>
            
            {isKanker && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative font-bold text-center animate-bounce shadow-md">
                🚨 AWAS KANKER (KANTONG KERING)! 🚨
                <p className="text-xs font-normal mt-1">Pengeluaran Anda bulan ini (Rp {currentMonthExp.toLocaleString()}) sudah melebihi batas aman (Rp {monthlyLimit.toLocaleString()}). Ayo ngerem jajan!</p>
              </div>
            )}

            <div className="h-[250px] w-full">
              {expenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => `Rp ${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  Belum ada data pengeluaran
                </div>
              )}
            </div>
          </div>

          {/* QUICK ADD */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <h3 className="mb-3 font-semibold dark:text-white">Quick Add (Sekali Pakai)</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button onClick={() => handleQuickAdd("Makan/Minum", 15000)} className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors">
                    <TbCoffee size={24} className="text-orange-500" />
                    <span className="text-xs font-medium dark:text-neutral-300">Makan</span>
                  </button>
                  <button onClick={() => handleQuickAdd("Transportasi", 10000)} className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors">
                    <TbCar size={24} className="text-blue-500" />
                    <span className="text-xs font-medium dark:text-neutral-300">Transport</span>
                  </button>
                  <button onClick={() => handleQuickAdd("Belanja", 50000)} className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors">
                    <TbShoppingCart size={24} className="text-green-500" />
                    <span className="text-xs font-medium dark:text-neutral-300">Belanja</span>
                  </button>
                  <button onClick={() => handleQuickAdd("Hiburan", 30000)} className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors">
                    <TbDeviceGamepad2 size={24} className="text-purple-500" />
                    <span className="text-xs font-medium dark:text-neutral-300">Hiburan</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 sm:border-l sm:pl-6 border-neutral-200 dark:border-neutral-800">
                <div className="mb-3 flex justify-between items-center">
                  <h3 className="font-semibold dark:text-white">Tagihan Rutin Bulanan</h3>
                  <button onClick={addRecurringTemplate} className="text-blue-500 text-xs hover:underline">+ Tambah</button>
                </div>
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {recurringTxs.map(rt => (
                    <div key={rt.id} className="flex justify-between text-sm border border-neutral-100 p-2 rounded dark:border-neutral-800">
                      <span className="dark:text-neutral-300">{rt.name}</span>
                      <div className="flex gap-2">
                        <span className="text-red-500">Rp {rt.amount.toLocaleString()}</span>
                        <button onClick={() => deleteRecurringTemplate(rt.id)} className="text-neutral-400 hover:text-red-500"><TbTrash size={14}/></button>
                      </div>
                    </div>
                  ))}
                  {recurringTxs.length === 0 && <p className="text-xs text-neutral-400">Belum ada tagihan rutin yang diatur.</p>}
                </div>
                <button onClick={handleGenerateRecurring} className="w-full rounded bg-blue-600 text-white py-2 text-xs font-bold hover:bg-blue-700 transition-colors">
                  Catat Semua Tagihan Bulan Ini
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setEditTx(null); setShowTxModal(true); }}
            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 p-4 w-full justify-center text-neutral-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
          >
            <TbPlus size={20} />
            <span className="font-semibold">Tambah Transaksi Baru</span>
          </button>

          {showTxModal && (
            <ModalShell title={editTx ? "✏️ Edit Transaksi" : "✨ Transaksi Baru"} onClose={() => { setShowTxModal(false); setTimeout(() => setEditTx(null), 200); }}>
              <form onSubmit={e => { e.preventDefault(); handleTxSave(); }} className="space-y-4">
                <div>
                  <label className={labelCls}>Sumber Dana / Wallet</label>
                  <select 
                    value={editTx ? editTx.wallet_id : newTx.wallet_id} 
                    onChange={e => editTx ? setEditTx({...editTx, wallet_id: e.target.value}) : setNewTx({...newTx, wallet_id: e.target.value})}
                    className={inputCls} required
                  >
                    <option value="">Pilih Wallet...</option>
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className={labelCls}>Jenis</label>
                    <select 
                      value={editTx ? editTx.type : newTx.type} 
                      onChange={e => editTx ? setEditTx({...editTx, type: e.target.value}) : setNewTx({...newTx, type: e.target.value})} 
                      className={inputCls} required
                    >
                      <option value="expense">Pengeluaran (-)</option>
                      <option value="income">Pemasukan (+)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className={labelCls}>Nominal (Rp)</label>
                    <input 
                      type="number" placeholder="0" value={editTx ? editTx.amount || "" : newTx.amount || ""} 
                      onChange={e => editTx ? setEditTx({...editTx, amount: parseInt(e.target.value) || 0}) : setNewTx({...newTx, amount: parseInt(e.target.value) || 0})}
                      className={inputCls} required
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Keterangan / Deskripsi</label>
                  <input 
                    type="text" placeholder="Misal: Makan Siang, Gaji" value={editTx ? editTx.description : newTx.description} 
                    onChange={e => editTx ? setEditTx({...editTx, description: e.target.value}) : setNewTx({...newTx, description: e.target.value})}
                    className={inputCls} required
                  />
                </div>
                <FormFooter loading={false} onClose={() => { setShowTxModal(false); setTimeout(() => setEditTx(null), 200); }} saveLabel={editTx ? "Simpan Perubahan" : "Tambahkan Transaksi"} />
              </form>
            </ModalShell>
          )}

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold dark:text-white">Riwayat Transaksi (Terbaru)</h3>
              <button onClick={handleExportCSV} className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50">
                <TbDownload size={16} /> Export CSV
              </button>
            </div>
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="group flex justify-between rounded border border-neutral-100 p-3 text-sm dark:border-neutral-800">
                  <div>
                    <span className="font-medium dark:text-white">{tx.description}</span>
                    <p className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString()}</p>
                    <div className="mt-1 hidden gap-2 group-hover:flex">
                        <button onClick={() => setEditTx(tx)} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" title="Edit"><TbEdit size={16} /></button>
                        <button onClick={() => deleteTx(tx.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" title="Hapus"><TbTrash size={16} /></button>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && <p className="text-sm text-neutral-500">Belum ada transaksi.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
