import { ArrowRight } from 'lucide-react';

interface ProgramProps {
  onNavigate: (page: string) => void;
}

export default function Program({ onNavigate }: ProgramProps) {
  const team = [
    { name: 'Taslim Ahmed', role: 'President', image: '/Taslim_LinkedIn_Picture.jpeg' },
    { name: 'Andres Camacho', role: 'VP Partnerships', image: '/Andres_Picture.jpeg' },
    { name: 'Armaan Zaheer', role: 'VP Communications', image: '/PHOTO-2026-03-06-14-02-14.jpg' },
  ];

  return (
    <div>
      {/* Hero - white */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Leadership</p>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-none mb-6 tracking-tight">
              Team.
            </h1>
            <p className="text-xl text-eta-navy/65 font-sans leading-relaxed max-w-2xl">
              Meet the Cambridge Judge ETA leadership team - a group of passionate students and alumni building a community around acquisition entrepreneurship.
            </p>
          </div>
        </div>
      </section>

      {/* Mission - cream */}
      <section className="bg-eta-cream py-12 md:py-16 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="border-l-4 border-eta-gold pl-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans mb-3">Our Mission</p>
            <p className="text-xl md:text-2xl font-black text-eta-navy font-sans leading-snug tracking-tight max-w-3xl">
              We are dedicated to building a thriving ecosystem that supports and empowers acquisition entrepreneurs from Cambridge Judge Business School.
            </p>
          </div>
        </div>
      </section>

      {/* Team grid - white */}
      <section className="bg-white py-20 md:py-24 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">People</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-12 tracking-tight">
            Leadership team.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#e6e0d0]">
            {team.map((member, i) => (
              <div key={i} className="bg-eta-cream group hover:bg-white transition-colors overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden bg-[#ddd7c8]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-1">{member.role}</div>
                  <h3 className="text-xl font-black text-eta-navy font-sans leading-tight tracking-tight">{member.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join - cream */}
      <section className="bg-eta-cream py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Join Us</p>
              <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-5 tracking-tight">
                Interested in joining the team?
              </h2>
              <p className="text-eta-navy/70 font-sans leading-relaxed mb-8">
                We're always looking for passionate individuals to help grow our community. If you're a Cambridge Judge student or alumni with a passion for ETA, get in touch.
              </p>
              <button onClick={() => onNavigate('contact')} className="bg-eta-navy text-white text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy-mid transition-colors flex items-center gap-2 w-fit">
                Get Involved <ArrowRight size={15} />
              </button>
            </div>
            <div className="bg-white border border-[#e6e0d0] p-8">
              <img src="/Cambridge_ETA_Club_Logo.png" alt="Cambridge ETA Club" className="w-40 h-auto mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
