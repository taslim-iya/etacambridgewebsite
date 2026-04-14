import { Linkedin, Instagram, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
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
    <footer className="bg-eta-navy text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 bg-eta-gold rounded flex items-center justify-center flex-shrink-0 group-hover:bg-eta-gold-light transition-colors">
                <span className="font-black text-eta-navy text-xs">ETA</span>
              </div>
              <span className="font-black text-white font-sans text-sm leading-tight">Cambridge<br />ETA Club</span>
            </button>
            <p className="text-white/45 text-xs font-sans leading-relaxed mb-5">
              Building a community of acquisition entrepreneurs at Cambridge Judge Business School.
            </p>
            <div className="flex gap-2">
              <a href="https://www.linkedin.com/company/cambridge-eta-club" target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-eta-gold hover:text-eta-gold transition-colors" aria-label="LinkedIn">
                <Linkedin size={13} />
              </a>
              <a href="#" className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-eta-gold hover:text-eta-gold transition-colors" aria-label="Instagram">
                <Instagram size={13} />
              </a>
              <a href="mailto:team@etacambridge.com" className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-eta-gold hover:text-eta-gold transition-colors" aria-label="Email">
                <Mail size={13} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/35 font-sans mb-4">Navigation</p>
            <ul className="space-y-2.5">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-xs text-white/55 font-sans hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/35 font-sans mb-4">External Links</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Cambridge Judge Business School', url: 'https://www.jbs.cam.ac.uk/' },
                { label: 'University of Cambridge', url: 'https://www.cam.ac.uk/' },
                { label: 'AJ Wasserstein', url: 'https://ajwasserstein.com/' },
              ].map((r, i) => (
                <li key={i}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/55 font-sans hover:text-white transition-colors leading-relaxed">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/35 font-sans mb-4">Contact</p>
            <p className="text-xs text-white/55 font-sans mb-0.5">Cambridge Judge Business School</p>
            <p className="text-xs text-white/55 font-sans mb-4">Trumpington Street, Cambridge<br />CB2 1AG, United Kingdom</p>
            <a href="mailto:team@etacambridge.com" className="text-xs text-eta-gold font-bold font-sans hover:text-eta-gold-light transition-colors">
              team@etacambridge.com
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/25 font-sans">
            &copy; {new Date().getFullYear()} Cambridge Judge Business School ETA Community
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[11px] text-white/25 font-sans">Cambridge, United Kingdom</p>
            <button onClick={() => onNavigate('admin')} className="text-[11px] text-white/25 font-sans hover:text-eta-gold transition-colors">Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
