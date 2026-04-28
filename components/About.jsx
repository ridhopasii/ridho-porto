'use client';
import { CheckCircle2, User, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import PhotoSwiper from './PhotoSwiper';

export default function About({ profile }) {
  return (
    <section id="tentang" className="py-24 px-6 relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Image Part - Premium Frame */}
          <div className="relative group">
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-[var(--border-subtle)] bg-background p-4 relative z-10">
              <div className="w-full h-full rounded-[2rem] overflow-hidden group-hover:grayscale-0 transition-all duration-700">
                <PhotoSwiper
                  images={
                    profile?.images && profile.images.length > 0
                      ? profile.images
                      : [
                          profile?.avatarUrl ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
                        ]
                  }
                  aspectRatio="aspect-square"
                  rounded="rounded-[2rem]"
                />
              </div>
            </div>

            {/* Glassmorphism Floating Card */}
            <div className="absolute -bottom-10 -right-4 md:-right-10 glass p-8 rounded-3xl z-20 shadow-2xl max-w-[280px] animate-fade-in-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-black">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-foreground font-bold font-outfit">Verified Expert</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {profile?.badge || 'Global Ambassador'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "
                {profile?.quote ||
                  'Berkomitmen untuk membawa dampak positif melalui teknologi dan inovasi.'}
                "
              </p>
            </div>

            {/* Background Decoration */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -z-10"></div>
          </div>

          {/* Text Part */}
          <div>
            <h2 className="text-sm font-bold text-teal-500 uppercase tracking-[0.3em] mb-4">
              {profile?.about_tag || 'Discovery'}
            </h2>
            <h3 className="text-4xl md:text-6xl font-black mb-8 font-outfit tracking-tighter text-foreground uppercase">
              {profile?.about_title ? (
                <>
                  {profile.about_title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-teal-500">{profile.about_title.split(' ').pop()}</span>
                </>
              ) : (
                <>
                  ABOUT <span className="text-teal-500">ME</span>
                </>
              )}
            </h3>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
              {profile?.bio ||
                'I am a passionate TechnoPreneur with a deep interest in building scalable web applications and innovative digital solutions.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: 'Role',
                  value: profile?.title || 'TechnoPreneur',
                  icon: <Briefcase size={16} />,
                },
                {
                  label: 'Location',
                  value: profile?.location || 'Indonesia',
                  icon: <MapPin size={16} />,
                },
                {
                  label: 'Education',
                  value: profile?.education_level || 'Global Relations',
                  icon: <GraduationCap size={16} />,
                },
                {
                  label: 'Availability',
                  value: profile?.availability || 'Ready to Work',
                  icon: <User size={16} />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-2xl hover:border-teal-500/30 transition-all flex items-center gap-4 group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover/item:bg-teal-500 group-hover/item:text-black transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-foreground font-bold text-sm tracking-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
