import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import MailingListSignup from '../components/MailingListSignup';
import CommunitySignup from '../components/CommunitySignup';

interface CaseStudiesProps {
  onNavigate: (page: string) => void;
}

export default function CaseStudies({ onNavigate }: CaseStudiesProps) {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <div>
      {/* Hero - white */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Case Studies</p>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-none mb-6 tracking-tight">
              Case Studies.
            </h1>
            <p className="text-xl text-eta-navy/65 font-sans leading-relaxed max-w-2xl">
              Real-world examples of successful ETA transactions - from initial search to acquisition close and value creation.
            </p>
          </div>
        </div>
      </section>

      {/* Overview - cream */}
      <section className="bg-eta-cream py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Overview</p>
              <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-6 tracking-tight">
                Learn from real acquisitions.
              </h2>
              <p className="text-eta-navy/70 font-sans leading-relaxed mb-4">
                Case studies are one of the most powerful learning tools in ETA. By studying real deals - what worked, what didn't, and why - you gain practical insight that no textbook can provide.
              </p>
              <p className="text-eta-navy/70 font-sans leading-relaxed">
                Our case study library covers a range of sectors, deal structures, and searcher backgrounds, giving you a comprehensive view of the ETA landscape.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">What's Covered</p>
              <div className="space-y-px bg-[#ddd7c8]">
                {[
                  { title: 'Search Phase', desc: 'How searchers identify and evaluate acquisition targets' },
                  { title: 'Deal Structuring', desc: 'Financing, valuation, and negotiation strategies' },
                  { title: 'Due Diligence', desc: 'What to look for and red flags to avoid' },
                  { title: 'Post-Acquisition', desc: 'Operational improvements and value creation' },
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

      {/* Cases - white */}
      <section className="bg-white py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Featured Cases</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-10 tracking-tight">
            Case study library.
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-[#e6e0d0] mb-8">
            {[
              { sector: 'Business Services', deal: 'Self-funded search', outcome: 'Acquired a niche B2B services firm. 2x EBITDA growth in year one through pricing and operational improvements.' },
              { sector: 'Healthcare Services', deal: 'Traditional search fund', outcome: 'Investor-backed acquisition of a regional healthcare provider. Expanded to new geographies post-close.' },
              { sector: 'Technology Services', deal: 'Independent sponsor', outcome: 'IT managed services acquisition. Integrated two bolt-on acquisitions within 18 months of ownership.' },
            ].map((c, i) => (
              <div key={i} className="bg-eta-cream p-8 flex flex-col">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-2">{c.sector}</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans mb-4">{c.deal}</div>
                <p className="text-eta-muted text-sm font-sans leading-relaxed flex-grow">{c.outcome}</p>
                <div className="mt-6 pt-5 border-t border-[#ddd7c8]">
                  <span className="text-eta-muted text-xs font-sans italic">Full case study available to community members</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-eta-muted text-sm font-sans italic mb-6">
            Detailed case studies are available to registered community members. Sign up to access the full library.
          </p>
          <button
            onClick={() => setShowSignup(true)}
            className="bg-eta-navy text-white text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy-mid transition-colors inline-flex items-center gap-2"
          >
            Join our community <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <CommunitySignup isOpen={showSignup} onClose={() => setShowSignup(false)} />

      {/* Quote - cream */}
      <section className="bg-eta-cream py-14 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="border-l-4 border-eta-gold pl-8 max-w-3xl">
            <p className="text-xl md:text-2xl font-black text-eta-navy font-sans leading-snug tracking-tight mb-4">
              "Search funds as a whole have produced attractive risk-adjusted returns for investors and have created substantial value."
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-5">Stanford GSB - 2022 Search Fund Study</p>
            <a
              href="https://www.gsb.stanford.edu/faculty-research/centers-initiatives/ces/research/search-funds"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-eta-navy text-eta-navy text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy hover:text-white transition-colors inline-flex items-center gap-2"
            >
              Read the Stanford Primer <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
