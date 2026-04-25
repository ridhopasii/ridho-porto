export default function About({ profile }) {
  return (
    <section id="tentang" className="py-24 px-6 relative bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Part */}
          <div className="relative animate-fade-in-up">
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 group">
              <img 
                src={profile?.avatarUrl || 'https://github.com/ridhopasii.png'} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <p className="text-2xl font-bold font-outfit">Ridho Robbi Pasi</p>
                <p className="text-teal-500 font-medium">TechnoPreneur</p>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/30 blur-[60px] rounded-full"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-500/30 blur-[60px] rounded-full"></div>
          </div>

          {/* Text Part */}
          <div className="animate-fade-in-up animation-delay-2000">
            <h2 className="text-4xl md:text-5xl font-black mb-8 font-outfit tracking-tight">
              A BIT <span className="text-teal-500">ABOUT ME</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              {profile?.bio || "I am a passionate TechnoPreneur with a deep interest in building scalable web applications and innovative digital solutions. With expertise in modern technologies like React, Next.js, and Supabase, I strive to create experiences that are not only functional but also visually stunning."}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Location', value: profile?.location || 'Indonesia' },
                { label: 'Experience', value: '5+ Years' },
                { label: 'Projects', value: '20+ Completed' },
                { label: 'Specialty', value: 'Full Stack Dev' },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-white font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
