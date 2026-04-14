import { useState, useEffect } from 'react';
import { LogOut, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminDashboard from '../components/AdminDashboard';
import AdminResources from '../components/AdminResources';
import AdminEvents from '../components/AdminEvents';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminUsers from '../components/AdminUsers';
import AdminEmailSettings from '../components/AdminEmailSettings';

type AdminTab = 'dashboard' | 'resources' | 'events' | 'analytics' | 'admin' | 'email';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-eta-navy flex items-center justify-center">
        <div className="text-white text-center">
          <p className="font-sans text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-eta-navy py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-3xl font-black text-eta-navy font-sans mb-2">Admin Portal</h1>
            <p className="text-eta-muted font-sans text-sm mb-8">Sign in to manage content</p>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-[#e6e0d0] text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-gold"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-[#e6e0d0] text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-gold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-eta-muted"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <div className="p-3 rounded text-sm font-sans bg-red-100 text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-eta-navy text-white font-bold font-sans py-3 hover:bg-eta-navy-mid transition-colors disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eta-navy">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white font-sans">Admin Portal</h1>
            <p className="text-white/50 text-sm font-sans">{session.user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-eta-gold transition-colors font-sans font-bold text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="sm:hidden py-3">
            <select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value as AdminTab)}
              className="w-full bg-white/10 border border-white/20 text-white font-sans font-bold text-sm px-4 py-2.5 focus:outline-none focus:border-eta-gold"
            >
              {(['dashboard', 'resources', 'events', 'analytics', 'admin', 'email'] as AdminTab[]).map(tab => (
                <option key={tab} value={tab} className="bg-eta-navy text-white">
                  {tab === 'email' ? 'Email Settings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:flex gap-2 overflow-x-auto scrollbar-none">
            {(['dashboard', 'resources', 'events', 'analytics', 'admin', 'email'] as AdminTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-4 font-bold font-sans text-sm transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-eta-gold border-eta-gold'
                    : 'text-white/60 border-transparent hover:text-white'
                }`}
              >
                {tab === 'email' ? 'Email Settings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'resources' && <AdminResources />}
        {activeTab === 'events' && <AdminEvents />}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'admin' && <AdminUsers />}
        {activeTab === 'email' && <AdminEmailSettings />}
      </div>
    </div>
  );
}
