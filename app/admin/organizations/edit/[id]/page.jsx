import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import OrganizationForm from '@/components/OrganizationForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditOrganizationPage({ params }) {
  const { id } = params;
  const supabase = await createClient();

  const { data: organization } = await supabase
    .from('Organization')
    .select('*')
    .eq('id', id)
    .single();

  if (!organization) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl">
          <header className="mb-10 flex items-center gap-4">
            <Link
              href="/admin/organizations"
              className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Organisasi</h1>
              <p className="text-gray-500 text-sm">
                Perbarui informasi pengalaman organisasi Anda.
              </p>
            </div>
          </header>

          <div className="bg-white/5 border border-[var(--border-subtle)] rounded-3xl p-8">
            <OrganizationForm initialData={organization} />
          </div>
        </div>
      </main>
    </div>
  );
}
