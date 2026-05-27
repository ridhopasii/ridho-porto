"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function FinanceManager() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // forms
  const [newWallet, setNewWallet] = useState({ name: "", balance: 0, icon: "💳" });
  const [newTx, setNewTx] = useState({ wallet_id: "", type: "expense", amount: 0, description: "" });

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

  const createWallet = async () => {
    const toastId = toast.loading("Membuat wallet...");
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_wallet", payload: newWallet }),
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Wallet berhasil dibuat", { id: toastId });
      setNewWallet({ name: "", balance: 0, icon: "💳" });
      fetchFinance();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const createTransaction = async () => {
    const toastId = toast.loading("Menambahkan transaksi...");
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_tx", payload: { ...newTx, amount: Number(newTx.amount) } }),
      });
      if (!res.ok) throw new Error("Gagal");
      toast.success("Transaksi berhasil", { id: toastId });
      setNewTx({ wallet_id: "", type: "expense", amount: 0, description: "" });
      fetchFinance();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* WALLETS */}
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Daftar Dompet (Wallets)</h3>
          <div className="flex flex-col gap-3">
            {wallets.map((w) => (
              <div key={w.id} className="flex justify-between rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span>{w.icon}</span>
                  <span className="font-medium dark:text-white">{w.name}</span>
                </div>
                <span className="font-bold dark:text-white">Rp {w.balance?.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <h4 className="mb-2 text-sm font-medium dark:text-white">Tambah Wallet</h4>
            <div className="flex gap-2">
              <input 
                type="text" placeholder="Ikon (💳)" value={newWallet.icon} onChange={e => setNewWallet({...newWallet, icon: e.target.value})}
                className="w-16 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent"
              />
              <input 
                type="text" placeholder="Nama Wallet" value={newWallet.name} onChange={e => setNewWallet({...newWallet, name: e.target.value})}
                className="flex-1 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent"
              />
              <button onClick={createWallet} disabled={!newWallet.name} className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50">Add</button>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Transaksi Baru</h3>
          <div className="space-y-3">
            <select 
              value={newTx.wallet_id} onChange={e => setNewTx({...newTx, wallet_id: e.target.value})}
              className="w-full rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
            >
              <option value="">Pilih Wallet</option>
              {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <div className="flex gap-2">
              <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value})} className="rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent">
                <option value="income">Income (+)</option>
                <option value="expense">Expense (-)</option>
              </select>
              <input 
                type="number" placeholder="Nominal" value={newTx.amount || ""} onChange={e => setNewTx({...newTx, amount: parseInt(e.target.value) || 0})}
                className="flex-1 rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
              />
            </div>
            <input 
              type="text" placeholder="Keterangan / Deskripsi" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})}
              className="w-full rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
            />
            <button 
              onClick={createTransaction} disabled={!newTx.wallet_id || !newTx.amount} 
              className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Simpan Transaksi
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 font-semibold dark:text-white">Riwayat Transaksi (Terbaru)</h3>
        <div className="space-y-2">
          {transactions.map(tx => (
            <div key={tx.id} className="flex justify-between rounded border border-neutral-100 p-3 text-sm dark:border-neutral-800">
              <div>
                <span className="font-medium dark:text-white">{tx.description}</span>
                <p className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString()}</p>
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
  );
}
