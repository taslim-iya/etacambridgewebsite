import { useState, useEffect } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(password);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newEmail || !tempPassword) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('Not authenticated');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/create-admin`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({
          email: newEmail,
          password: tempPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const { error: dbError } = await supabase
        .from('admin_users')
        .insert([{ email: newEmail, role: 'admin' }]);

      if (dbError) throw dbError;

      setNewEmail('');
      setTempPassword('');
      setShowForm(false);
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!confirm(`Delete admin ${email}?`)) return;

    try {
      const { error: err } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (err) throw err;
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && users.length === 0) {
    return <div className="text-white/50">Loading admins...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white font-sans mb-2">Admin Users</h2>
          <p className="text-white/50 font-sans">Manage admin accounts and permissions</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-eta-gold text-eta-navy font-bold font-sans rounded hover:bg-yellow-400 transition-colors"
        >
          <Plus size={16} /> New Admin
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Create New Admin</h3>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-sans font-bold mb-2">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/30 font-sans focus:outline-none focus:border-eta-gold"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-sans font-bold mb-2">Temporary Password</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={tempPassword}
                    onChange={e => setTempPassword(e.target.value)}
                    placeholder="Generate or enter password"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/30 font-sans focus:outline-none focus:border-eta-gold font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white font-sans font-bold transition-colors"
                >
                  Generate
                </button>
              </div>
              {tempPassword && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="mt-2 flex items-center gap-2 text-eta-gold text-sm font-sans hover:text-yellow-400 transition-colors"
                >
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy Password'}
                </button>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !newEmail || !tempPassword}
                className="px-6 py-2 bg-eta-gold text-eta-navy font-bold font-sans rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(''); setTempPassword(''); setNewEmail(''); }}
                className="px-6 py-2 bg-white/10 text-white font-bold font-sans rounded hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && !showForm && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm font-sans">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-white/50 font-sans text-center py-8">No admin users yet</p>
        ) : (
          users.map(user => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-white font-sans font-bold">{user.email}</p>
                <p className="text-white/50 text-sm font-sans">
                  {new Date(user.created_at).toLocaleDateString()} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
              <button
                onClick={() => handleDeleteAdmin(user.id, user.email)}
                className="p-2 text-white/50 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
