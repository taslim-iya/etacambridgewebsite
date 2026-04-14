import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-eta-navy border-t-2 border-eta-gold z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-white/70 font-sans leading-relaxed max-w-xl">
          We use cookies to improve your experience on our site and to analyse site usage. By continuing, you consent to our use of cookies in accordance with GDPR.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="text-xs font-bold text-white/50 hover:text-white transition-colors font-sans uppercase tracking-wider"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="bg-eta-gold text-eta-navy text-xs font-bold font-sans px-4 py-2 hover:bg-eta-gold-light transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
