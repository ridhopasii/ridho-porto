"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function FinanceManager({ activeTab = "dompet" }: { activeTab?: "dompet" | "transaksi" }) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // forms
  const [newWallet, setNewWallet] = useState({ name: "", balance: 0, icon: "💳" });
  const [newTx, setNewTx] = useState({ wallet_id: "", type: "expense", amount: 0, description: "" });
  
  // edit mode
  const [editWallet, setEditWallet] = useState<any>(null);
  const [editTx, setEditTx] = useState<any>(null);

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
      fetchFinance();
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
      fetchFinance();
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
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

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
                      <button onClick={() => setEditWallet(w)} className="text-xs text-blue-500">Edit</button>
                      <button onClick={() => deleteWallet(w.id)} className="text-xs text-red-500">Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <h4 className="mb-2 text-sm font-medium dark:text-white">{editWallet ? "Edit Wallet" : "Tambah Wallet"}</h4>
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Ikon (💳)" value={editWallet ? editWallet.icon : newWallet.icon} 
                  onChange={e => editWallet ? setEditWallet({...editWallet, icon: e.target.value}) : setNewWallet({...newWallet, icon: e.target.value})}
                  className="w-16 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent"
                />
                <input 
                  type="text" placeholder="Nama Wallet" value={editWallet ? editWallet.name : newWallet.name} 
                  onChange={e => editWallet ? setEditWallet({...editWallet, name: e.target.value}) : setNewWallet({...newWallet, name: e.target.value})}
                  className="flex-1 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent"
                />
                <button 
                  onClick={handleWalletSave} 
                  disabled={editWallet ? !editWallet.name : !newWallet.name} 
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                  {editWallet ? "Save" : "Add"}
                </button>
                {editWallet && <button onClick={() => setEditWallet(null)} className="rounded bg-neutral-200 px-3 py-1 text-sm dark:bg-neutral-800 dark:text-white">Batal</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "transaksi" && (
        <div className="grid gap-6">
          {/* TRANSACTIONS */}
          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-semibold dark:text-white">{editTx ? "Edit Transaksi" : "Transaksi Baru"}</h3>
            <div className="space-y-3">
              <select 
                value={editTx ? editTx.wallet_id : newTx.wallet_id} 
                onChange={e => editTx ? setEditTx({...editTx, wallet_id: e.target.value}) : setNewTx({...newTx, wallet_id: e.target.value})}
                className="w-full rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
              >
                <option value="">Pilih Wallet</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <div className="flex gap-2">
                <select 
                  value={editTx ? editTx.type : newTx.type} 
                  onChange={e => editTx ? setEditTx({...editTx, type: e.target.value}) : setNewTx({...newTx, type: e.target.value})} 
                  className="rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
                >
                  <option value="income">Income (+)</option>
                  <option value="expense">Expense (-)</option>
                </select>
                <input 
                  type="number" placeholder="Nominal" value={editTx ? editTx.amount || "" : newTx.amount || ""} 
                  onChange={e => editTx ? setEditTx({...editTx, amount: parseInt(e.target.value) || 0}) : setNewTx({...newTx, amount: parseInt(e.target.value) || 0})}
                  className="flex-1 rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
                />
              </div>
              <input 
                type="text" placeholder="Keterangan / Deskripsi" value={editTx ? editTx.description : newTx.description} 
                onChange={e => editTx ? setEditTx({...editTx, description: e.target.value}) : setNewTx({...newTx, description: e.target.value})}
                className="w-full rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleTxSave} 
                  disabled={editTx ? (!editTx.wallet_id || !editTx.amount) : (!newTx.wallet_id || !newTx.amount)} 
                  className="flex-1 rounded bg-blue-600 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  Simpan
                </button>
                {editTx && <button onClick={() => setEditTx(null)} className="rounded bg-neutral-200 px-4 py-2 text-sm font-medium dark:bg-neutral-800 dark:text-white">Batal</button>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-4 font-semibold dark:text-white">Riwayat Transaksi (Terbaru)</h3>
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="group flex justify-between rounded border border-neutral-100 p-3 text-sm dark:border-neutral-800">
                  <div>
                    <span className="font-medium dark:text-white">{tx.description}</span>
                    <p className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString()}</p>
                    <div className="mt-1 hidden gap-2 group-hover:flex">
                        <button onClick={() => setEditTx(tx)} className="text-xs font-semibold text-blue-500">Edit</button>
                        <button onClick={() => deleteTx(tx.id)} className="text-xs font-semibold text-red-500">Hapus</button>
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
