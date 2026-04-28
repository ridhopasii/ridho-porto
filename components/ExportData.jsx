'use client';

import { useState } from 'react';
import { Download, Loader2, CheckCircle2, Database } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ExportData() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const exportAllData = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // Fetch semua data dari semua tabel
      const [
        { data: profile },
        { data: projects },
        { data: articles },
        { data: skills },
        { data: experiences },
        { data: educations },
        { data: awards },
        { data: publications },
        { data: organizations },
        { data: gallery },
        { data: messages },
        { data: settings },
      ] = await Promise.all([
        supabase.from('Profile').select('*'),
        supabase.from('Project').select('*'),
        supabase.from('Article').select('*'),
        supabase.from('Skill').select('*'),
        supabase.from('Experience').select('*'),
        supabase.from('Education').select('*'),
        supabase.from('Award').select('*'),
        supabase.from('Publication').select('*'),
        supabase.from('Organization').select('*'),
        supabase.from('Gallery').select('*'),
        supabase.from('Message').select('*'),
        supabase.from('SiteSettings').select('*'),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: {
          profile,
          projects,
          articles,
          skills,
          experiences,
          educations,
          awards,
          publications,
          organizations,
          gallery,
          messages,
          settings,
        },
      };

      // Download sebagai JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Gagal export data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <Database size={20} className="text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Export & Backup Data</h3>
          <p className="text-xs text-gray-500">Download semua data dalam format JSON</p>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-2 text-blue-400 text-sm">
          <CheckCircle2 size={16} />
          Data berhasil diexport!
        </div>
      )}

      <button
        onClick={exportAllData}
        disabled={loading}
        className="w-full py-3 bg-blue-500 text-foreground font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Mengexport...
          </>
        ) : (
          <>
            <Download size={18} /> Export Semua Data
          </>
        )}
      </button>

      <p className="mt-3 text-[10px] text-gray-600 text-center">
        File akan didownload dalam format JSON. Simpan dengan aman sebagai backup.
      </p>
    </div>
  );
}
