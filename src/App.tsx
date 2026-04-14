import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import About from './pages/About';
import Program from './pages/Program';
import Resources from './pages/Resources';
import Events from './pages/Events';
import Community from './pages/Community';
import Contact from './pages/Contact';
import CaseStudies from './pages/CaseStudies';
import Admin from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const breadcrumbMap: Record<string, string> = {
    about: 'About ETA',
    program: 'Team',
    resources: 'Resources',
    events: 'Events',
    community: 'Community',
    contact: 'Contact',
    casestudies: 'Case Studies',
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'about': return <About onNavigate={setCurrentPage} />;
      case 'program': return <Program onNavigate={setCurrentPage} />;
      case 'resources': return <Resources />;
      case 'events': return <Events onNavigate={setCurrentPage} />;
      case 'community': return <Community onNavigate={setCurrentPage} />;
      case 'contact': return <Contact />;
      case 'casestudies': return <CaseStudies onNavigate={setCurrentPage} />;
      case 'admin': return <Admin />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  const crumbLabel = breadcrumbMap[currentPage];

  if (currentPage === 'admin') {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {crumbLabel && (
        <div className="bg-white border-b border-[#e6e0d0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2 flex items-center gap-2 text-[12px] text-eta-muted font-sans">
            <button onClick={() => setCurrentPage('home')} className="hover:text-eta-navy transition-colors">
              Cambridge ETA Club
            </button>
            <span>/</span>
            <span className="text-eta-navy font-medium">{crumbLabel}</span>
          </div>
        </div>
      )}
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
      <CookieConsent />
    </div>
  );
}

export default App;
