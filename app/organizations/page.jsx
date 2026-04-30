import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { Users, ArrowLeft, Globe, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PhotoSwiper from '@/components/PhotoSwiper';

export default async function OrganizationsPage() {
  const supabase = await createClient();
  const { data: organizations } = await supabase.from('Organization').select('*').order('period', { ascending: false });

  return (
    <div className="min-h-screen bg-body text-foreground font-jakarta selection:bg-accent/30">
      <Navbar />
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none flex items-center gap-4">
            <Users className="text-accent w-12 h-12 md:w-20 md:h-20" /> Organisasi.
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed mb-12">
            Kumpulan pengalaman kepanitiaan, komunitas, dan organisasi.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {organizations?.map((org) => (
            <div key={org.id} className="group p-1 bg-white/5 rounded-[2rem] border border-[var(--border-subtle)] hover:border-accent/30 transition-all duration-500 flex flex-col h-[28rem]">
              <div className="flex flex-col p-5 h-full bg-body rounded-[1.8rem] relative overflow-hidden">
                <div className="w-full h-32 mb-4 rounded-xl overflow-hidden relative z-10 border border-[var(--border-subtle)] flex-shrink-0">
                  <PhotoSwiper images={Array.isArray(org.images) && org.images.length > 0 ? org.images : []} aspectRatio="aspect-[16/9]" rounded="rounded-none" />
                  {org.logoUrl && (
                    <div className="absolute -bottom-4 left-4 w-12 h-12 bg-body rounded-xl overflow-hidden p-1.5 border border-[var(--border-subtle)] shadow-lg z-20">
                      <Image src={org.logoUrl} alt={org.name} fill sizes="48px" className="object-contain p-1.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col pt-2 min-h-0">
                  <Link href={`/organizations/${org.slug}`}>
                    <h4 className="text-lg font-black text-foreground group-hover:text-accent transition-colors uppercase tracking-tight leading-tight mb-1 truncate">
                      {org.name || 'Organization Name'}
                    </h4>
                  </Link>
                  <p className="text-accent font-bold uppercase text-[10px] tracking-widest mb-4 truncate">
                    {org.role || 'Role'}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                    {org.description || ''}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-auto pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-accent" /> {org.period || 'N/A'}
                    </div>
                    {org.website && (
                      <a href={org.website} target="_blank" className="flex items-center gap-1 hover:text-accent">
                        <Globe size={10} /> Web
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!organizations || organizations.length === 0) && (
            <p className="text-gray-600 italic col-span-full">Belum ada riwayat organisasi.</p>
          )}
        </div>
      </section>
    </div>
  );
}
