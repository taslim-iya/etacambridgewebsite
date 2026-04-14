import { useEffect, useState } from 'react';
import { Save, Mail, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmailSettings {
  id: string;
  key: string;
  subject: string;
  body: string;
  admin_notification_email: string;
}

export default function AdminEmailSettings() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('key', 'welcome_email')
        .maybeSingle();

      if (error) {
        setError('Failed to load email settings');
      } else if (data) {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    setError('');

    const { error } = await supabase
      .from('email_settings')
      .update({
        subject: settings.subject,
        body: settings.body,
        admin_notification_email: settings.admin_notification_email,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'welcome_email');

    if (error) {
      setError('Failed to save settings');
    } else {
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-white/60 font-sans">Loading email settings...</div>;
  }

  if (!settings) {
    return <div className="text-red-400 font-sans">Email settings not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white font-sans mb-2">Email Settings</h2>
        <p className="text-white/50 font-sans text-sm">Configure the welcome email sent to new subscribers and the admin notification address.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/10 border border-white/20 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-eta-gold/20 flex items-center justify-center">
              <Mail size={20} className="text-eta-gold" />
            </div>
            <h3 className="text-lg font-black text-white font-sans">Welcome Email</h3>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70 font-sans mb-2">Subject Line</label>
            <input
              type="text"
              value={settings.subject}
              onChange={e => setSettings({ ...settings, subject: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-sans focus:outline-none focus:border-eta-gold"
              placeholder="Email subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70 font-sans mb-2">
              Email Body
              <span className="text-white/40 font-normal ml-2">— use <code className="text-eta-gold">{'{{full_name}}'}</code> to personalise</span>
            </label>
            <textarea
              value={settings.body}
              onChange={e => setSettings({ ...settings, body: e.target.value })}
              rows={14}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-sans text-sm focus:outline-none focus:border-eta-gold resize-y"
              placeholder="Welcome email body..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 flex items-center justify-center">
                <Bell size={20} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-black text-white font-sans">Admin Notifications</h3>
            </div>
            <p className="text-white/50 font-sans text-sm mb-4">
              Receive an email notification each time someone joins the community or mailing list. Leave blank to disable notifications.
            </p>
            <div>
              <label className="block text-sm font-bold text-white/70 font-sans mb-2">Notification Email Address</label>
              <input
                type="email"
                value={settings.admin_notification_email}
                onChange={e => setSettings({ ...settings, admin_notification_email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-sans focus:outline-none focus:border-eta-gold"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4">
            <p className="text-white/40 font-sans text-xs leading-relaxed">
              <strong className="text-white/60">Available template variables:</strong><br />
              <code className="text-eta-gold">{'{{full_name}}'}</code> — subscriber's full name<br />
              <code className="text-eta-gold">{'{{email}}'}</code> — subscriber's email address
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-eta-gold text-eta-navy font-bold font-sans px-6 py-3 hover:bg-eta-gold-light transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {message && <p className="text-green-400 font-sans text-sm">{message}</p>}
        {error && <p className="text-red-400 font-sans text-sm">{error}</p>}
      </div>
    </div>
  );
}
