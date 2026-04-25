import { Trophy, FileText, ArrowRight } from 'lucide-react'

export default function Achievements({ awards, publications }) {
  return (
    <section className="py-24 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Awards */}
        <div>
          <h2 className="text-3xl font-black font-outfit mb-12 flex items-center gap-4">
            <Trophy className="text-yellow-500" /> AWARDS
          </h2>
          <div className="space-y-4">
            {awards?.map(award => (
              <div key={award.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div>
                  <h3 className="font-bold text-lg">{award.title}</h3>
                  <p className="text-gray-500 text-sm">{award.issuer} • {award.year}</p>
                </div>
                <Trophy size={20} className="text-gray-700 group-hover:text-yellow-500 transition-colors" />
              </div>
            ))}
            {awards?.length === 0 && <p className="text-gray-600 italic">No awards found.</p>}
          </div>
        </div>

        {/* Publications */}
        <div>
          <h2 className="text-3xl font-black font-outfit mb-12 flex items-center gap-4">
            <FileText className="text-blue-500" /> PUBLICATIONS
          </h2>
          <div className="space-y-6">
            {publications?.map(pub => (
              <a key={pub.id} href={pub.url} target="_blank" className="block group">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{pub.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{pub.publisher} • {pub.year}</p>
                    <p className="text-teal-500 text-xs font-bold flex items-center gap-1">
                      READ PUBLICATION <ArrowRight size={12} />
                    </p>
                  </div>
                </div>
              </a>
            ))}
            {publications?.length === 0 && <p className="text-gray-600 italic">No publications found.</p>}
          </div>
        </div>

      </div>
    </section>
  )
}
