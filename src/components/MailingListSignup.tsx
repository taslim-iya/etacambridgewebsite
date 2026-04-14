import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface MailingListSignupProps {
  source: string;
  heading?: string;
  subheading?: string;
  label?: string;
}

export default function MailingListSignup({
  source,
  heading = 'Join our mailing list.',
  subheading = 'Get updates on events, resources, and opportunities to connect with the Cambridge ETA community.',
  label = 'Stay Connected',
}: MailingListSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mailing-list?action=subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, source }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-eta-navy py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">{label}</p>
            <h2 className="text-3xl md:text-4xl font-black text-white font-sans leading-tight mb-4 tracking-tight">
              {heading}
            </h2>
            <p className="text-white/55 font-sans text-sm leading-relaxed mb-4">
              {subheading}
            </p>
            <a href="mailto:team@etacambridge.com" className="text-eta-gold text-sm font-bold font-sans hover:text-eta-gold-light transition-colors">
              team@etacambridge.com
            </a>
          </div>
          <div>
            {subscribed ? (
              <div className="flex items-center gap-3 text-white">
                <CheckCircle size={20} className="text-eta-gold flex-shrink-0" />
                <span className="font-bold font-sans">You're subscribed! We'll be in touch soon.</span>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="Your email address"
                    className="flex-grow bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-sm font-sans focus:outline-none focus:border-eta-gold"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-eta-gold text-eta-navy text-sm font-bold font-sans px-6 py-3 hover:bg-eta-gold-light transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {error && <p className="text-red-300 text-xs font-sans">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
