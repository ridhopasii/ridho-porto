import AdminSidebar from '@/components/AdminSidebar';
import OrganizationForm from '@/components/OrganizationForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddOrganization() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <Link
            href="/admin/organizations"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 mb-8 transition-colors uppercase text-[10px] font-black tracking-widest"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar
          </Link>
          <h1 className="text-3xl font-black mb-10 font-outfit uppercase tracking-tight">
            Tambah <span className="text-teal-500">Organisasi Baru</span>
          </h1>

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
            <OrganizationForm />
          </div>
        </div>
      </main>
    </div>
  );
}
