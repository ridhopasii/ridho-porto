import { ExternalLink, CodeXml, ArrowUpRight } from 'lucide-react'

export default function Projects({ projects }) {
  return (
    <section id="proyek" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl md:text-6xl font-black font-outfit tracking-tight mb-4">
              FEATURED <span className="text-purple-500">PROJECTS</span>
            </h2>
            <p className="text-gray-500 max-w-md">
              A selection of my best work, spanning web development, UI/UX design, and innovative tech solutions.
            </p>
          </div>
          <div className="text-teal-500 font-bold flex items-center gap-2 cursor-pointer hover:underline">
            View All Work <ArrowUpRight size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects?.map((project, idx) => (
            <div key={project.id} className="group relative animate-fade-in-up" style={{ animationDelay: `${idx * 200}ms` }}>
              {/* Project Card */}
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 bg-white/5 transition-all duration-500 group-hover:border-teal-500/50 group-hover:-translate-y-2">
                {/* Image */}
                <img 
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                
                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.split(',').map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-teal-400 border border-white/5">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-teal-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {project.description}
                  </p>
                  
                  <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <a href={project.projectUrl} target="_blank" className="p-3 bg-white text-black rounded-full hover:bg-teal-500 hover:text-white transition-all">
                      <ExternalLink size={20} />
                    </a>
                    <a href="#" className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/10 hover:border-teal-500 transition-all">
                      <CodeXml size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects?.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500">Belum ada proyek yang dipublikasikan. Tambahkan lewat Panel Admin!</p>
          </div>
        )}
      </div>
    </section>
  )
}
