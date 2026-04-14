import { useEffect, useState } from 'react';
import { Users, Mail, Calendar, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalSubscribers: number;
  totalResources: number;
  totalEvents: number;
  totalCaseStudies: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSubscribers: 0,
    totalResources: 0,
    totalEvents: 0,
    totalCaseStudies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [subscribers, resources, events, caseStudies] = await Promise.all([
          supabase.from('newsletter_subscribers').select('id', { count: 'exact' }),
          supabase.from('resources').select('id', { count: 'exact' }),
          supabase.from('events').select('id', { count: 'exact' }),
          supabase.from('case_studies').select('id', { count: 'exact' }),
        ]);

        setStats({
          totalSubscribers: subscribers.count || 0,
          totalResources: resources.count || 0,
          totalEvents: events.count || 0,
          totalCaseStudies: caseStudies.count || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: Mail, label: 'Newsletter Subscribers', value: stats.totalSubscribers, color: 'bg-blue-500' },
    { icon: FileText, label: 'Resources', value: stats.totalResources, color: 'bg-purple-500' },
    { icon: Calendar, label: 'Events', value: stats.totalEvents, color: 'bg-green-500' },
    { icon: Users, label: 'Case Studies', value: stats.totalCaseStudies, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white font-sans mb-8">Overview</h2>
        {loading ? (
          <div className="text-white/60 font-sans">Loading statistics...</div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white/10 border border-white/20 p-6 hover:bg-white/15 transition-colors">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                  <card.icon size={24} className="text-white" />
                </div>
                <p className="text-white/60 text-sm font-sans mb-2">{card.label}</p>
                <p className="text-4xl font-black text-white font-sans">{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/10 border border-white/20 p-8 rounded">
        <h3 className="text-xl font-black text-white font-sans mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-eta-navy p-4 rounded border border-white/10">
            <p className="text-white/80 font-sans text-sm mb-3">Manage resources, events, and case studies using the tabs above. Upload files and track community engagement through the dashboard.</p>
          </div>
          <div className="bg-eta-navy p-4 rounded border border-white/10">
            <p className="text-white/80 font-sans text-sm mb-3">View detailed analytics on user engagement, page views, and form submissions. Track newsletter growth and subscription sources.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
