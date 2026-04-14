import { useState, useEffect } from 'react';
import { Mail, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

interface AnalyticsData {
  subscribers: Subscriber[];
  sourceBreakdown: { [key: string]: number };
  totalSubscribers: number;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    subscribers: [],
    sourceBreakdown: {},
    totalSubscribers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const subscribers = data || [];
        const sourceBreakdown: { [key: string]: number } = {};

        subscribers.forEach(sub => {
          sourceBreakdown[sub.source] = (sourceBreakdown[sub.source] || 0) + 1;
        });

        setAnalytics({
          subscribers,
          sourceBreakdown,
          totalSubscribers: subscribers.length,
        });
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const filteredSubscribers = analytics.subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-3xl font-black text-white font-sans mb-8">Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 border border-white/20 p-6 rounded">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-sans">Total Newsletter Subscribers</p>
              <p className="text-4xl font-black text-white font-sans">{analytics.totalSubscribers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 p-6 rounded">
          <h3 className="text-white font-bold font-sans mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> Signup Sources
          </h3>
          <div className="space-y-2">
            {Object.entries(analytics.sourceBreakdown).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-white/70 font-sans text-sm capitalize">{source}</span>
                <span className="text-white font-bold font-sans">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/10 border border-white/20 rounded overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-black text-white font-sans">Newsletter Subscribers</h3>
            <span className="bg-eta-gold text-eta-navy text-sm font-bold font-sans px-3 py-1 rounded">
              {filteredSubscribers.length}
            </span>
          </div>
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
          />
        </div>

        <div className="divide-y divide-white/10">
          {loading ? (
            <div className="p-6 text-white/60 font-sans">Loading subscribers...</div>
          ) : filteredSubscribers.length > 0 ? (
            filteredSubscribers.map(subscriber => (
              <div key={subscriber.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold font-sans">{subscriber.email}</p>
                    <div className="flex items-center gap-3 mt-2 text-white/60 text-sm font-sans">
                      <span className="bg-eta-gold/20 text-eta-gold px-2 py-1 rounded capitalize text-[11px] font-bold">
                        {subscriber.source}
                      </span>
                      <span>
                        {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-white/60 font-sans text-center">
              {searchTerm ? 'No subscribers match your search' : 'No subscribers yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
