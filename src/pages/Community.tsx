import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import MailingListSignup from '../components/MailingListSignup';
import CommunitySignup from '../components/CommunitySignup';

interface CommunityProps {
  onNavigate: (page: string) => void;
}

export default function Community({ onNavigate }: CommunityProps) {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <div>
      {/* Hero - white */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">People</p>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-none mb-6 tracking-tight">
              Community.
            </h1>
            <p className="text-xl text-eta-navy/65 font-sans leading-relaxed max-w-2xl">
              A growing network of Cambridge Judge students, alumni, and professionals interested in acquisition entrepreneurship.
            </p>
          </div>
        </div>
      </section>

      {/* About - cream */}
      <section className="bg-eta-cream py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-20">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-6 tracking-tight">
                Cambridge's ETA network.
              </h2>
              <p className="text-eta-navy/70 font-sans leading-relaxed mb-4">
                Our community is made up of MBA students, alumni, and professionals from Cambridge Judge Business School who are passionate about acquisition entrepreneurship.
              </p>
              <p className="text-eta-navy/70 font-sans leading-relaxed">
                We share knowledge, opportunities, and support across every stage of the ETA journey - from first interest to acquisition close and beyond.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Who's In The Network</p>
              <div className="space-y-px bg-[#ddd7c8]">
                {[
                  { title: 'Current MBAs', desc: 'Students exploring ETA as their post-MBA path' },
                  { title: 'Active Searchers', desc: 'Alumni currently running a funded search' },
                  { title: 'Acquired Operators', desc: 'Alumni who have acquired and now operate companies' },
                  { title: 'ETA Investors', desc: 'Angels and search fund investors in our network' },
                ].map((item, i) => (
                  <div key={i} className="bg-white px-6 py-4 flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-eta-gold flex-shrink-0 mt-1.5" />
                    <div>
                      <div className="font-bold text-eta-navy font-sans text-sm mb-0.5">{item.title}</div>
                      <div className="text-eta-muted text-sm font-sans">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member profiles - white */}
      <section className="bg-white py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Members</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-4 tracking-tight">
            Featured members.
          </h2>
          <p className="text-eta-navy/65 font-sans leading-relaxed mb-10 max-w-2xl">
            Cambridge Judge alumni who have successfully navigated the ETA journey. Their stories inspire the next generation.
          </p>
          <div className="bg-eta-cream border border-[#e6e0d0] p-12 text-center">
            <p className="text-eta-muted font-sans text-sm italic mb-6">
              Member profiles coming soon. Be part of our growing community of acquisition entrepreneurs.
            </p>
            <button onClick={() => setShowSignup(true)} className="bg-eta-navy text-white text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy-mid transition-colors inline-flex items-center gap-2">
              Join the community <ArrowRight size={15} />
            </button>
          </div>

          <CommunitySignup isOpen={showSignup} onClose={() => setShowSignup(false)} />
        </div>
      </section>

      <MailingListSignup
        source="community"
        heading="Join our mailing list."
        subheading="Get updates on events, member spotlights, and opportunities to connect with the Cambridge ETA community."
        label="Stay Connected"
      />
    </div>
  );
}
