import { useState, useEffect } from 'react';
import { ExternalLink, Download, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MailingListSignup from '../components/MailingListSignup';
import CommunitySignup from '../components/CommunitySignup';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  author: string;
  created_at: string;
  resource_type: string | null;
}

interface ExternalResource {
  title: string;
  url: string;
  org: string;
  desc: string;
}

const externalResources: ExternalResource[] = [
  {
    title: 'Stanford Search Fund Primer & Research',
    url: 'https://www.gsb.stanford.edu/faculty-research/centers-initiatives/ces/research/search-funds',
    org: 'Stanford Graduate School of Business',
    desc: 'The most comprehensive research on the search fund model - including data on returns, acquisition targets, and searcher backgrounds.',
  },
  {
    title: 'HBS Entrepreneurship & Acquisitions',
    url: 'https://www.hbs.edu/faculty/Pages/results.aspx?k=acquisition',
    org: 'Harvard Business School',
    desc: 'Resources and faculty research on entrepreneurship, acquisitions, and small business ownership.',
  },
  {
    title: 'HEC Paris Entrepreneurship',
    url: 'https://www.hec.edu/en/program/msc-entrepreneurship-and-venture-creation',
    org: 'HEC Paris',
    desc: 'French business school with strong focus on entrepreneurship, venture creation, and small business acquisition.',
  },
  {
    title: 'INSEAD Search Fund & Entrepreneurship',
    url: 'https://www.insead.edu/executive-education/search-fund-masterclass',
    org: 'INSEAD',
    desc: 'Global business school with dedicated programs and masterclasses on search funds and entrepreneurship.',
  },
  {
    title: 'AJ Wasserstein - Search Fund Resources',
    url: 'https://ajwasserstein.com/',
    org: 'AJ Wasserstein',
    desc: 'Industry insights, case studies, and resources on search funds from a leading searcher and thought leader in the space.',
  },
  {
    title: 'Cambridge Judge Business School',
    url: 'https://www.jbs.cam.ac.uk/',
    org: 'Cambridge Judge Business School',
    desc: 'Our home institution - visit for MBA programme information, research, and upcoming events at Cambridge Judge.',
  },
  {
    title: 'University of Cambridge',
    url: 'https://www.cam.ac.uk/',
    org: 'University of Cambridge',
    desc: 'The official University of Cambridge website with information about our historic institution and its programmes.',
  },
  {
    title: 'IESE Business School',
    url: 'https://www.iese.edu/',
    org: 'IESE Business School',
    desc: 'Leading business school with extensive entrepreneurship and corporate development programmes and research.',
  },
];

const categories = ['book', 'primer', 'case_study', 'article'];
const categoryLabels = {
  book: 'Books',
  primer: 'Primers',
  case_study: 'Case Studies',
  article: 'Articles',
};

const resourceTypes = ['searcher', 'investor', 'company', 'other'];
const resourceTypeLabels = {
  searcher: 'Searcher Perspective',
  investor: 'Investor Perspective',
  company: 'Company Perspective',
  other: 'Other',
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResourceType, setSelectedResourceType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const query = supabase.from('resources').select('*').order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw error;
        setResources(data || []);
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter(r => {
    const categoryMatch = selectedCategory === 'all' || r.category === selectedCategory;
    const typeMatch = selectedResourceType === 'all' || selectedCategory !== 'case_study' || r.resource_type === selectedResourceType;
    return categoryMatch && typeMatch;
  });

  return (
    <div>
      {/* Hero - white */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Learning</p>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-none mb-6 tracking-tight">
              Resources.
            </h1>
            <p className="text-xl text-eta-navy/65 font-sans leading-relaxed max-w-2xl">
              A curated collection of books, primers, and articles to guide your ETA journey from first principles to acquisition close.
            </p>
          </div>
        </div>
      </section>

      {/* Uploaded Resources - cream */}
      <section className="bg-eta-cream py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Collection</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-6 tracking-tight">
            Our library.
          </h2>

          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedResourceType('all'); }}
              className={`px-4 py-2 text-sm font-bold font-sans transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-eta-navy text-white'
                  : 'bg-white border border-[#e6e0d0] text-eta-navy hover:bg-white'
              }`}
            >
              All Resources
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedResourceType('all'); }}
                className={`px-4 py-2 text-sm font-bold font-sans transition-colors ${
                  selectedCategory === cat
                    ? 'bg-eta-navy text-white'
                    : 'bg-white border border-[#e6e0d0] text-eta-navy hover:bg-white'
                }`}
              >
                {categoryLabels[cat as keyof typeof categoryLabels]}
              </button>
            ))}
          </div>

          {/* Case study type filter */}
          {selectedCategory === 'case_study' && (
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => setSelectedResourceType('all')}
                className={`px-4 py-2 text-sm font-bold font-sans transition-colors ${
                  selectedResourceType === 'all'
                    ? 'bg-eta-gold text-eta-navy'
                    : 'bg-white border border-[#e6e0d0] text-eta-navy hover:bg-white'
                }`}
              >
                All Types
              </button>
              {resourceTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedResourceType(type)}
                  className={`px-4 py-2 text-sm font-bold font-sans transition-colors ${
                    selectedResourceType === type
                      ? 'bg-eta-gold text-eta-navy'
                      : 'bg-white border border-[#e6e0d0] text-eta-navy hover:bg-white'
                  }`}
                >
                  {resourceTypeLabels[type as keyof typeof resourceTypeLabels]}
                </button>
              ))}
            </div>
          )}

          {/* Resources grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-eta-muted font-sans">Loading resources...</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e6e0d0]">
              {filteredResources.map(resource => (
                <div key={resource.id} className="bg-white p-6 flex flex-col hover:bg-eta-cream transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-eta-gold/10 flex items-center justify-center flex-shrink-0">
                      {resource.category === 'book' ? (
                        <BookOpen size={18} className="text-eta-navy" />
                      ) : (
                        <FileText size={18} className="text-eta-navy" />
                      )}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-eta-gold font-sans">
                      {categoryLabels[resource.category as keyof typeof categoryLabels]}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-eta-navy font-sans mb-1 leading-tight tracking-tight">
                    {resource.title}
                  </h3>
                  <div className="mb-2 flex items-center gap-2 flex-wrap">
                    {resource.author && (
                      <p className="text-eta-gold text-xs font-bold font-sans">by {resource.author}</p>
                    )}
                    {resource.resource_type && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-eta-gold/70 font-sans bg-eta-gold/10 px-1.5 py-0.5">
                        {resourceTypeLabels[resource.resource_type as keyof typeof resourceTypeLabels]}
                      </p>
                    )}
                  </div>
                  <p className="text-eta-muted text-sm font-sans leading-relaxed flex-grow mb-4">
                    {resource.description}
                  </p>
                  {resource.file_url && (
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-eta-navy text-sm font-bold font-sans flex items-center gap-1.5 hover:gap-2.5 transition-all"
                    >
                      Download <Download size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e6e0d0] p-12 text-center">
              <p className="text-eta-muted font-sans">No resources in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* External resources - white */}
      <section className="bg-white py-16 md:py-24 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Online Resources</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-10 tracking-tight">
            Worth exploring.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#e6e0d0]">
            {externalResources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-eta-cream p-8 flex flex-col hover:bg-white transition-colors group"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans mb-3">{r.org}</div>
                <h3 className="text-lg font-black text-eta-navy font-sans mb-3 leading-tight tracking-tight group-hover:text-eta-navy-mid transition-colors">{r.title}</h3>
                <p className="text-eta-muted text-sm font-sans leading-relaxed flex-grow mb-5">{r.desc}</p>
                <span className="text-eta-navy text-sm font-bold font-sans flex items-center gap-1.5">
                  Visit resource <ExternalLink size={13} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote - cream */}
      <section className="bg-eta-cream py-14 md:py-18 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="border-l-4 border-eta-gold pl-8 max-w-3xl">
            <p className="text-xl md:text-2xl font-black text-eta-navy font-sans leading-snug tracking-tight mb-4">
              "Search funds as a whole have produced attractive risk-adjusted returns for investors and have created substantial value for operators and their communities."
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans">Stanford GSB - 2022 Search Fund Study</p>
          </div>
        </div>
      </section>

      {/* CTA - white */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Community</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-6 tracking-tight">Ready to connect?</h2>
          <p className="text-eta-navy/65 font-sans mb-8 max-w-2xl mx-auto">Join the Cambridge ETA community to access resources, connect with peers, and stay updated on events and opportunities.</p>
          <button
            onClick={() => setShowSignup(true)}
            className="bg-eta-navy text-white text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy-mid transition-colors inline-flex items-center gap-2"
          >
            Join our community <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <CommunitySignup isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
}
