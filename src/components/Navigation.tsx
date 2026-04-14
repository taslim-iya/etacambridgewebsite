import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; label: string; desc: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchablePages = [
    { id: 'home', label: 'Home', desc: 'Welcome to Cambridge ETA Club', keywords: ['home', 'welcome', 'eta', 'cambridge'] },
    { id: 'about', label: 'About ETA', desc: 'What is Entrepreneurship Through Acquisition?', keywords: ['about', 'eta', 'entrepreneurship', 'acquisition', 'search fund', 'irr', 'what is'] },
    { id: 'program', label: 'Team', desc: 'Meet our leadership team', keywords: ['team', 'program', 'people', 'leadership', 'president', 'taslim', 'andres', 'armaan'] },
    { id: 'events', label: 'Events', desc: 'Workshops, panels, and networking', keywords: ['events', 'workshop', 'panel', 'networking', 'calendar'] },
    { id: 'casestudies', label: 'Case Studies', desc: 'Real-world ETA transaction examples', keywords: ['case studies', 'case study', 'examples', 'transactions', 'deals'] },
    { id: 'resources', label: 'Resources', desc: 'Books, primers, and research materials', keywords: ['resources', 'books', 'primers', 'research', 'articles', 'reading'] },
    { id: 'community', label: 'Community', desc: 'Join the Cambridge ETA network', keywords: ['community', 'join', 'network', 'members', 'connect'] },
    { id: 'contact', label: 'Contact', desc: 'Get in touch with the team', keywords: ['contact', 'email', 'message', 'touch', 'enquiry'] },
  ];

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const results = searchablePages.filter(p =>
      p.keywords.some(k => k.includes(lower)) ||
      p.label.toLowerCase().includes(lower) ||
      p.desc.toLowerCase().includes(lower)
    );
    setSearchResults(results);
  };

  const handleSearchSelect = (id: string) => {
    onNavigate(id);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About ETA' },
    { id: 'program', label: 'Team' },
    { id: 'events', label: 'Events' },
    { id: 'casestudies', label: 'Case Studies' },
    { id: 'resources', label: 'Resources' },
    { id: 'community', label: 'Community' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_24px_rgba(26,39,68,0.10)]' : ''}`}>
      {/* Logo bar */}
      <div className="border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-[88px]">
          <button onClick={() => onNavigate('home')} className="flex items-center group">
            <img
              src="/Cambridge_ETA_Club_Logo.png"
              alt="Cambridge ETA Club"
              className="h-20 w-auto"
            />
          </button>
          <div className="flex items-center gap-2">
            <button
              className="text-eta-navy/60 hover:text-eta-navy transition-colors p-2 rounded-full hover:bg-[#f0ebe0]"
              onClick={() => { setSearchOpen(s => !s); setSearchQuery(''); setSearchResults([]); }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              className="md:hidden text-eta-navy p-2 rounded-full hover:bg-[#f0ebe0] transition-colors"
              onClick={() => setIsMenuOpen(s => !s)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-3 relative">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); } }}
              placeholder="Search the site..."
              className="w-full bg-[#f7f2e8] border border-[#e6e0d0] px-4 py-2.5 text-sm text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-navy"
            />
            {searchResults.length > 0 && (
              <div className="absolute left-4 right-4 top-full bg-white border border-[#e6e0d0] shadow-lg z-50">
                {searchResults.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSearchSelect(r.id)}
                    className="w-full text-left px-4 py-3 hover:bg-eta-cream border-b border-[#e6e0d0] last:border-0 transition-colors"
                  >
                    <div className="text-sm font-bold text-eta-navy font-sans">{r.label}</div>
                    <div className="text-xs text-eta-muted font-sans">{r.desc}</div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute left-4 right-4 top-full bg-white border border-[#e6e0d0] shadow-lg z-50 px-4 py-3">
                <p className="text-sm text-eta-muted font-sans">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav bar */}
      <div className="border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="hidden md:flex items-center gap-0 h-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3.5 h-full text-[13px] font-sans transition-colors ${
                  currentPage === item.id
                    ? 'text-eta-navy font-bold'
                    : 'text-eta-muted font-medium hover:text-eta-navy'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-eta-gold" />
                )}
              </button>
            ))}
          </div>
          <div className="md:hidden flex items-center h-10">
            <span className="text-sm font-bold text-eta-navy font-sans">
              {navItems.find(n => n.id === currentPage)?.label || 'Cambridge ETA Club'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e6e0d0] shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-1 flex flex-col">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
                className={`text-left py-3 text-sm font-sans border-b border-[#e6e0d0] last:border-0 ${
                  currentPage === item.id
                    ? 'font-bold text-eta-navy'
                    : 'text-eta-muted hover:text-eta-navy'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
