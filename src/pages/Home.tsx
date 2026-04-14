import { useState } from 'react';
import { ArrowRight, TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';
import MailingListSignup from '../components/MailingListSignup';
import CommunitySignup from '../components/CommunitySignup';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { number: '500+', label: 'Search Funds Globally' },
  { number: '35%', label: 'Median IRR' },
  { number: '$10-20M', label: 'Typical Fund Size' },
  { number: '2-3 Yrs', label: 'Average Search Timeline' },
];

const pillars = [
  {
    icon: Users,
    title: 'Community',
    desc: 'A growing network of Cambridge Judge students, alumni, investors, and advisors all connected by a passion for acquisition entrepreneurship.',
    page: 'community',
  },
  {
    icon: Calendar,
    title: 'Events',
    desc: 'Workshops, investor panels, and networking sessions throughout the academic year at Cambridge Judge Business School.',
    page: 'events',
  },
  {
    icon: BookOpen,
    title: 'Resources',
    desc: 'Curated books, primers, case studies, and research to guide you from first principles through to acquisition close.',
    page: 'resources',
  },
  {
    icon: TrendingUp,
    title: 'Case Studies',
    desc: 'Real-world examples of successful ETA transactions - from initial search to acquisition close and value creation.',
    page: 'casestudies',
  },
];

export default function Home({ onNavigate }: HomeProps) {
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <div>
      {/* Hero - white background, full-bleed premium feel */}
      <section className="bg-white pt-16 pb-0 border-b border-[#e6e0d0] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <div className="pb-16">
              <div className="inline-flex items-center gap-2 bg-eta-cream border border-[#e6e0d0] px-3 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 bg-eta-gold rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans">Cambridge Judge Business School</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-[1.0] mb-6 tracking-tight">
                Become an<br />Owner-<br />Operator.
              </h1>
              <p className="text-lg text-eta-navy/65 font-sans leading-relaxed mb-10 max-w-lg">
                Entrepreneurship Through Acquisition empowers Cambridge students and alumni to acquire, own, and grow established businesses.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => onNavigate('about')} className="bg-eta-navy text-white text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy-mid transition-colors flex items-center gap-2">
                  Learn About ETA <ArrowRight size={15} />
                </button>
                <button onClick={() => setCommunityOpen(true)} className="border border-eta-navy text-eta-navy text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy hover:text-white transition-colors">
                  Join the Community
                </button>
              </div>
            </div>

            {/* Logo showcase panel */}
            <div className="hidden md:flex items-end justify-center pb-0">
              <div className="bg-eta-cream border-l border-t border-[#e6e0d0] p-12 pb-16 w-full flex flex-col items-center justify-center gap-6">
                <img
                  src="/Cambridge_ETA_Club_Logo.png"
                  alt="Cambridge ETA Club"
                  className="w-56 h-auto"
                />
                <div className="text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-eta-muted font-sans">Est. Cambridge, UK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar - navy */}
      <section className="bg-eta-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y-0 md:divide-x md:divide-white/10">
            {stats.map((s, i) => (
              <div key={i} className="md:px-8 first:pl-0 last:pr-0 text-center md:text-left">
                <div className="text-3xl md:text-4xl font-black text-eta-gold font-sans mb-1 tracking-tight">{s.number}</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45 font-sans">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is ETA - cream background */}
      <section className="bg-eta-cream py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-5 gap-14 lg:gap-20 items-start">
            <div className="md:col-span-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">What is ETA?</p>
              <h2 className="text-4xl md:text-5xl font-black text-eta-navy font-sans leading-[1.05] mb-6 tracking-tight">
                A smarter path to entrepreneurship.
              </h2>
              <p className="text-eta-navy/70 font-sans leading-relaxed text-lg mb-5">
                Instead of starting from scratch, Entrepreneurship Through Acquisition means acquiring a proven, profitable business and becoming its owner-operator.
              </p>
              <p className="text-eta-navy/70 font-sans leading-relaxed mb-10">
                With existing cash flow, customers, and teams already in place, ETA offers a more capital-efficient and lower-risk path to business ownership - and extraordinary upside for the right operator.
              </p>
              <button onClick={() => onNavigate('about')} className="border border-eta-navy text-eta-navy text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy hover:text-white transition-colors flex items-center gap-2 w-fit">
                Explore ETA Models <ArrowRight size={15} />
              </button>
            </div>
            <div className="md:col-span-2 space-y-px bg-[#ddd7c8]">
              {[
                { title: 'Career Independence', desc: 'Own and operate your business on your terms.' },
                { title: 'Proven Track Record', desc: 'Acquire businesses with established revenue and customers.' },
                { title: 'Attractive Returns', desc: '35% median IRR for search fund investors globally.' },
                { title: 'Legacy Building', desc: 'Create lasting impact by growing companies and preserving jobs.' },
              ].map((item, i) => (
                <div key={i} className="bg-white px-6 py-5">
                  <div className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-eta-gold rounded-full flex-shrink-0 mt-2" />
                    <div>
                      <div className="font-bold text-eta-navy font-sans text-sm leading-snug mb-1">{item.title}</div>
                      <div className="text-eta-muted text-sm font-sans leading-snug">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars - white background, horizontal strip layout */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Get Involved</p>
              <h2 className="text-4xl md:text-5xl font-black text-eta-navy font-sans leading-[1.05] tracking-tight">
                Everything you need<br className="hidden md:block" /> to succeed in ETA.
              </h2>
            </div>
            <button onClick={() => setCommunityOpen(true)} className="text-sm font-bold text-eta-navy font-sans flex items-center gap-2 hover:gap-3 transition-all flex-shrink-0 mb-1">
              Join the community <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-px bg-[#e6e0d0]">
            {pillars.map((p, i) => (
              <button
                key={i}
                onClick={() => onNavigate(p.page)}
                className="bg-white p-8 text-left group hover:bg-eta-cream transition-colors"
              >
                <div className="w-10 h-10 bg-eta-cream group-hover:bg-white transition-colors flex items-center justify-center mb-5">
                  <p.icon size={20} className="text-eta-navy" />
                </div>
                <h3 className="text-base font-black text-eta-navy font-sans mb-3 leading-tight">{p.title}</h3>
                <p className="text-eta-muted text-sm font-sans leading-relaxed mb-5">{p.desc}</p>
                <span className="text-eta-navy/50 text-[12px] font-bold font-sans flex items-center gap-1 group-hover:text-eta-navy group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={11} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quote - cream */}
      <section className="bg-eta-cream py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="border-l-4 border-eta-gold pl-8">
            <p className="text-2xl md:text-3xl font-black text-eta-navy font-sans leading-tight mb-5">
              "The search fund model has proven to be an exceptional path for talented individuals to become successful entrepreneurs."
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans">Stanford GSB Search Fund Study</p>
          </div>
        </div>
      </section>

      <MailingListSignup
        source="home"
        heading="Begin your ETA journey today."
        subheading="Subscribe to receive updates on events, resources, and opportunities to connect with the Cambridge ETA community."
        label="Ready to start?"
      />

      <CommunitySignup isOpen={communityOpen} onClose={() => setCommunityOpen(false)} />
    </div>
  );
}
