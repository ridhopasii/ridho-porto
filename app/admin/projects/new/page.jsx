import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProjectForm from '@/components/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-jakarta">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <Link href="/admin/projects" className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Tambah Proyek Baru</h1>
            <p className="text-gray-500 text-sm">Tambahkan karya terbaik Anda ke dalam portofolio.</p>
          </div>
        </header>

        <div className="bg-white/5 border border-[var(--border-subtle)] rounded-3xl p-8">
          <ProjectForm />
        </div>
      </div>
    </div>
  )
}
