import { useState } from 'react';
import { X, Check, AlertCircle, Calendar, MapPin, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  event_type: string;
  description: string;
  date: string | null;
  location: string | null;
  capacity: number | null;
}

interface EventRegistrationModalProps {
  event: Event | null;
  onClose: () => void;
}

const roleOptions = [
  { value: 'mba_student', label: 'MBA Student (Cambridge)' },
  { value: 'phd_student', label: 'PhD / Research Student' },
  { value: 'alumni', label: 'Cambridge Alumni' },
  { value: 'searcher', label: 'Active Searcher' },
  { value: 'investor', label: 'ETA Investor' },
  { value: 'operator', label: 'Operator / Acquired CEO' },
  { value: 'advisor', label: 'Deal Advisor' },
  { value: 'external', label: 'External / Other' },
];

const typeLabels: Record<string, string> = {
  workshop: 'Workshop',
  panel: 'Speaker Panel',
  networking: 'Networking',
};

export default function EventRegistrationModal({ event, onClose }: EventRegistrationModalProps) {
  const [form, setForm] = useState({ full_name: '', email: '', role: '', notes: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/event-registration`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event.id,
          full_name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          notes: form.notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      if (data.duplicate) {
        setErrorMsg('You have already registered for this event with that email address.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setForm({ full_name: '', email: '', role: '', notes: '' });
    setStatus('idle');
    setErrorMsg('');
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-eta-navy/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-eta-navy/40 hover:text-eta-navy transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check size={28} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-eta-navy font-sans mb-3 tracking-tight">You're registered!</h2>
            <p className="text-eta-muted font-sans text-sm leading-relaxed mb-2">
              We've noted your registration for <strong className="text-eta-navy">{event.title}</strong>.
            </p>
            <p className="text-eta-muted font-sans text-sm leading-relaxed mb-8">
              We'll send a confirmation to <strong className="text-eta-navy">{form.email}</strong> with event details closer to the date.
            </p>
            <button
              onClick={handleClose}
              className="bg-eta-navy text-white font-bold font-sans px-8 py-3 hover:bg-eta-navy-mid transition-colors text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="bg-eta-cream border-b border-[#e6e0d0] px-8 pt-8 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans block mb-2">
                {typeLabels[event.event_type] ?? event.event_type}
              </span>
              <h2 className="text-2xl font-black text-eta-navy font-sans leading-tight tracking-tight mb-4 pr-8">
                {event.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm">
                {event.date && (
                  <div className="flex items-center gap-2 text-eta-navy/70 font-sans">
                    <Calendar size={14} className="text-eta-gold flex-shrink-0" />
                    <span>{formatDate(event.date)} at {formatTime(event.date)}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-eta-navy/70 font-sans">
                    <MapPin size={14} className="text-eta-gold flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-center gap-2 text-eta-navy/70 font-sans">
                    <Users size={14} className="text-eta-gold flex-shrink-0" />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-eta-navy/60 font-sans mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full border border-[#e6e0d0] px-4 py-2.5 text-sm text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-navy transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-eta-navy/60 font-sans mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full border border-[#e6e0d0] px-4 py-2.5 text-sm text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-navy transition-colors bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-eta-navy/60 font-sans mb-1.5">
                  Your Role <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-[#e6e0d0] px-4 py-2.5 text-sm text-eta-navy font-sans focus:outline-none focus:border-eta-navy transition-colors bg-white appearance-none"
                >
                  <option value="" disabled>Select your role...</option>
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-eta-navy/60 font-sans mb-1.5">
                  Questions or Notes <span className="text-eta-navy/30 font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Anything you'd like us to know, or questions you'd like addressed..."
                  rows={3}
                  className="w-full border border-[#e6e0d0] px-4 py-2.5 text-sm text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-navy transition-colors bg-white resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-sans">{errorMsg}</p>
                </div>
              )}

              <div className="pt-2 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-eta-navy text-white font-bold font-sans px-8 py-3 hover:bg-eta-navy-mid transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Registering...' : 'Register for Event'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm text-eta-muted font-sans hover:text-eta-navy transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-[11px] text-eta-muted font-sans">
                By registering, you agree to receive event-related communications from the Cambridge ETA Club.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
