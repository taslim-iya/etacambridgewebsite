import { ArrowRight } from 'lucide-react';
import MailingListSignup from '../components/MailingListSignup';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const models = [
    {
      title: 'Search Fund',
      desc: 'Raise capital from investors to fund a 2-3 year search for a business to acquire. Upon finding a target, investors provide acquisition capital and the searcher becomes CEO.',
      points: ['Investor-backed', 'Full-time commitment', '$500K-$1M raised', '35% median IRR'],
    },
    {
      title: 'Self-Funded Search',
      desc: 'Use personal savings to conduct a search. Acquire using seller financing, bank debt, and investor capital. Greater equity ownership and flexibility than a traditional search fund.',
      points: ['Greater flexibility', 'Higher equity retention', 'Part-time option', 'Lower external accountability'],
    },
    {
      title: 'Apprenticeship Model',
      desc: 'Join an existing company as a CEO-in-training or junior partner with a path to ownership. Learn while earning a salary before transitioning to full ownership.',
      points: ['Lower initial risk', 'Learn while earning', 'Mentorship access', 'Proven operations'],
    },
  ];

  return (
    <div>
      {/* Hero - white */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">About ETA</p>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-none mb-6 tracking-tight">
              About ETA.
            </h1>
            <p className="text-xl text-eta-navy/65 font-sans leading-relaxed max-w-2xl">
              Entrepreneurship Through Acquisition is a proven path to business ownership - acquire a profitable company and run it as CEO.
            </p>
          </div>
        </div>
      </section>

      {/* What is ETA - cream */}
      <section className="bg-eta-cream py-20 md:py-24 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-20">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Definition</p>
              <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-6 tracking-tight">
                What is Entrepreneurship Through Acquisition?
              </h2>
              <p className="text-eta-navy/70 font-sans leading-relaxed mb-4">
                ETA is a proven path to business ownership where aspiring entrepreneurs acquire and operate existing, profitable businesses rather than starting from scratch.
              </p>
              <p className="text-eta-navy/70 font-sans leading-relaxed mb-4">
                Instead of betting on an untested idea, you buy a functioning enterprise with existing customers, revenue, and employees - dramatically reducing risk while providing the rewards and independence of ownership.
              </p>
              <p className="text-eta-navy/70 font-sans leading-relaxed">
                With millions of baby boomer business owners approaching retirement without successors, there has never been a better time to pursue ETA.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Key Benefits</p>
              <div className="space-y-px bg-[#ddd7c8]">
                {[
                  { title: 'Proven Business Model', desc: 'Acquire companies with established revenue and profitability' },
                  { title: 'Immediate Cash Flow', desc: 'Start earning from day one with existing operations' },
                  { title: 'Lower Risk Profile', desc: 'Historical performance reduces uncertainty vs. startups' },
                  { title: 'Existing Team & Customers', desc: 'Inherit infrastructure, relationships, and market position' },
                  { title: 'Attractive Returns', desc: 'Strong track record of value creation for operators and investors' },
                ].map((item, i) => (
                  <div key={i} className="bg-white px-6 py-4 flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-eta-gold rounded-full flex-shrink-0 mt-1.5" />
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

      {/* Models - white */}
      <section className="bg-white py-20 md:py-24 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Models</p>
            <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-4 tracking-tight">
              Three paths to ownership.
            </h2>
            <p className="text-eta-navy/65 font-sans leading-relaxed max-w-xl">
              There's no single way to pursue ETA. Choose the approach that best fits your situation, risk tolerance, and goals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[#e6e0d0]">
            {models.map((model, i) => (
              <div key={i} className="bg-eta-cream p-8 flex flex-col">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-3">Model {i + 1}</div>
                <h3 className="text-xl font-black text-eta-navy font-sans mb-3 leading-tight tracking-tight">{model.title}</h3>
                <p className="text-eta-muted text-sm font-sans leading-relaxed mb-6 flex-grow">{model.desc}</p>
                <div className="border-t border-[#ddd7c8] pt-4 space-y-2">
                  {model.points.map((pt, j) => (
                    <div key={j} className="flex items-center gap-2 text-[12px] text-eta-muted font-sans">
                      <span className="w-1 h-1 bg-eta-gold rounded-full flex-shrink-0" />
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources - cream */}
      <section className="bg-eta-cream py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Further Reading</p>
          <h2 className="text-3xl font-black text-eta-navy font-sans leading-tight mb-8 tracking-tight">Key resources.</h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#ddd7c8] mb-10">
            {[
              { title: 'Stanford Search Fund Primer', url: 'https://www.gsb.stanford.edu/faculty-research/centers-initiatives/ces/research/search-funds', desc: 'Comprehensive research on the search fund model globally' },
              { title: 'HBR: Buying a Small Business', url: 'https://hbr.org/2018/09/buying-a-small-business-doesnt-have-to-be-daunting', desc: 'Harvard Business Review guide for aspiring acquirers' },
              { title: 'Cambridge Judge Business School', url: 'https://www.jbs.cam.ac.uk/', desc: 'Our home and the broader academic community' },
            ].map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="bg-white p-6 hover:bg-eta-cream transition-colors group block">
                <h3 className="font-bold text-eta-navy font-sans text-sm mb-2 group-hover:text-eta-navy-mid transition-colors leading-snug">{r.title}</h3>
                <p className="text-eta-muted text-xs font-sans leading-relaxed mb-3">{r.desc}</p>
                <span className="text-eta-navy text-xs font-bold font-sans flex items-center gap-1">Visit →</span>
              </a>
            ))}
          </div>
          <button onClick={() => onNavigate('casestudies')} className="border border-eta-navy text-eta-navy text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy hover:text-white transition-colors flex items-center gap-2 w-fit">
            View Case Studies <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <MailingListSignup
        source="about"
        heading="Interested in ETA?"
        subheading="Join our mailing list to receive updates on events, resources, and the Cambridge ETA community."
        label="Get Started"
      />
    </div>
  );
}
