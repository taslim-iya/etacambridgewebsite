import { useState, useEffect } from 'react';
import { Trash2, Plus, Check, AlertCircle, Users, ChevronDown, ChevronUp, X, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  event_type: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registration_count?: number;
}

interface Registration {
  id: string;
  full_name: string;
  email: string;
  role: string;
  notes: string;
  created_at: string;
}

const eventTypes = ['workshop', 'panel', 'networking'];
const typeLabels: Record<string, string> = {
  workshop: 'Workshop',
  panel: 'Panel',
  networking: 'Networking',
};

const roleLabels: Record<string, string> = {
  mba_student: 'MBA Student',
  phd_student: 'PhD / Research',
  alumni: 'Alumni',
  searcher: 'Searcher',
  investor: 'Investor',
  operator: 'Operator',
  advisor: 'Advisor',
  external: 'External',
};

function toDatetimeLocal(isoString: string | null) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Record<string, Registration[]>>({});
  const [loadingRegs, setLoadingRegs] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Event & { date: string }>>({});
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'workshop',
    description: '',
    date: '',
    location: '',
    capacity: 50,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count } = await supabase
            .from('event_registrations')
            .select('id', { count: 'exact', head: true })
            .eq('event_id', event.id);
          return { ...event, registration_count: count ?? 0 };
        })
      );

      setEvents(eventsWithCounts);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId: string) => {
    if (registrations[eventId]) {
      setExpandedEvent(expandedEvent === eventId ? null : eventId);
      return;
    }
    setLoadingRegs(eventId);
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRegistrations(prev => ({ ...prev, [eventId]: data || [] }));
      setExpandedEvent(eventId);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoadingRegs(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('events').insert([
        {
          ...formData,
          date: formData.date ? new Date(formData.date).toISOString() : null,
        }
      ]);
      if (error) throw error;

      setMessage('Event added successfully');
      setIsError(false);
      setFormData({ title: '', event_type: 'workshop', description: '', date: '', location: '', capacity: 50 });
      setShowForm(false);
      await fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to add event');
      setIsError(true);
    }
  };

  const startEdit = (event: Event) => {
    setEditingId(event.id);
    setEditData({
      title: event.title,
      event_type: event.event_type,
      description: event.description,
      date: toDatetimeLocal(event.date),
      location: event.location ?? '',
      capacity: event.capacity ?? 50,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: editData.title,
          event_type: editData.event_type,
          description: editData.description,
          date: editData.date ? new Date(editData.date).toISOString() : null,
          location: editData.location || null,
          capacity: editData.capacity || null,
        })
        .eq('id', eventId);

      if (error) throw error;

      setMessage('Event updated successfully');
      setIsError(false);
      setEditingId(null);
      setEditData({});
      await fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update event');
      setIsError(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event and all its registrations?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;

      setMessage('Event deleted');
      setIsError(false);
      setExpandedEvent(null);
      await fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to delete');
      setIsError(true);
    }
  };

  const handleDeleteRegistration = async (regId: string, eventId: string) => {
    if (!confirm('Remove this registration?')) return;
    try {
      const { error } = await supabase.from('event_registrations').delete().eq('id', regId);
      if (error) throw error;

      setRegistrations(prev => ({
        ...prev,
        [eventId]: prev[eventId].filter(r => r.id !== regId),
      }));
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, registration_count: (e.registration_count ?? 1) - 1 } : e
      ));
    } catch (err) {
      console.error('Failed to delete registration:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white font-sans">Events</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-eta-gold text-eta-navy font-bold font-sans px-6 py-3 hover:bg-eta-gold-light transition-colors"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 flex items-center gap-3 ${isError ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'}`}>
          {!isError && <Check size={18} className="text-green-400" />}
          {isError && <AlertCircle size={18} className="text-red-400" />}
          <p className={`font-sans ${isError ? 'text-red-200' : 'text-green-200'}`}>{message}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white/10 border border-white/20 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
                required
              />
              <select
                value={formData.event_type}
                onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white font-sans focus:outline-none focus:border-eta-gold"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>{typeLabels[type]}</option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold min-h-24"
              required
            />

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="datetime-local"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white font-sans focus:outline-none focus:border-eta-gold"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
                min="1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-eta-gold text-eta-navy font-bold font-sans px-6 py-2 hover:bg-eta-gold-light transition-colors"
              >
                Add Event
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white/10 text-white font-bold font-sans px-6 py-2 border border-white/20 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-white/60 font-sans">Loading events...</div>
      ) : events.length > 0 ? (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="bg-white/10 border border-white/20 overflow-hidden">
              <div className="p-6">
                {editingId === event.id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editData.title ?? ''}
                        onChange={e => setEditData({ ...editData, title: e.target.value })}
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
                        placeholder="Event Title"
                        required
                      />
                      <select
                        value={editData.event_type ?? 'workshop'}
                        onChange={e => setEditData({ ...editData, event_type: e.target.value })}
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white font-sans focus:outline-none focus:border-eta-gold"
                      >
                        {eventTypes.map(type => (
                          <option key={type} value={type}>{typeLabels[type]}</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      value={editData.description ?? ''}
                      onChange={e => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold min-h-24"
                      placeholder="Description"
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="datetime-local"
                        value={editData.date ?? ''}
                        onChange={e => setEditData({ ...editData, date: e.target.value })}
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white font-sans focus:outline-none focus:border-eta-gold"
                      />
                      <input
                        type="text"
                        value={editData.location ?? ''}
                        onChange={e => setEditData({ ...editData, location: e.target.value })}
                        placeholder="Location"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
                      />
                      <input
                        type="number"
                        value={editData.capacity ?? ''}
                        onChange={e => setEditData({ ...editData, capacity: parseInt(e.target.value) })}
                        placeholder="Capacity"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
                        min="1"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleSaveEdit(event.id)}
                        className="flex items-center gap-2 bg-eta-gold text-eta-navy font-bold font-sans px-5 py-2 hover:bg-eta-gold-light transition-colors"
                      >
                        <Check size={15} /> Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-white/10 text-white font-bold font-sans px-5 py-2 border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-black text-white font-sans">{event.title}</h3>
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-eta-gold font-sans bg-eta-gold/20 px-2 py-1">
                          {typeLabels[event.event_type] ?? event.event_type}
                        </span>
                      </div>
                      <p className="text-white/70 font-sans text-sm mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-white/60 text-sm font-sans mb-4">
                        {event.date && <span>Date: {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                        {!event.date && <span className="text-white/40">Date: TBC</span>}
                        {event.location && <span>Location: {event.location}</span>}
                        {event.capacity && <span>Capacity: {event.capacity}</span>}
                      </div>
                      <button
                        onClick={() => fetchRegistrations(event.id)}
                        className="inline-flex items-center gap-2 text-sm font-bold font-sans text-white/80 hover:text-white transition-colors bg-white/10 border border-white/20 px-4 py-2 hover:bg-white/20"
                      >
                        <Users size={14} />
                        {event.registration_count ?? 0} Registration{event.registration_count !== 1 ? 's' : ''}
                        {loadingRegs === event.id ? (
                          <span className="text-white/40">...</span>
                        ) : expandedEvent === event.id ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(event)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit event"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {expandedEvent === event.id && registrations[event.id] && (
                <div className="border-t border-white/10 bg-white/5">
                  {registrations[event.id].length === 0 ? (
                    <p className="px-6 py-4 text-white/50 font-sans text-sm">No registrations yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-sans">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">Name</th>
                            <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">Email</th>
                            <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">Role</th>
                            <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">Notes</th>
                            <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">Registered</th>
                            <th className="px-4 py-3" />
                          </tr>
                        </thead>
                        <tbody>
                          {registrations[event.id].map(reg => (
                            <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="px-6 py-3 text-white font-medium">{reg.full_name}</td>
                              <td className="px-4 py-3 text-white/70">{reg.email}</td>
                              <td className="px-4 py-3">
                                <span className="text-[11px] font-bold text-eta-gold bg-eta-gold/15 px-2 py-1">
                                  {roleLabels[reg.role] ?? reg.role}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-white/50 max-w-48 truncate">{reg.notes || '—'}</td>
                              <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                                {new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleDeleteRegistration(reg.id, event.id)}
                                  className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 p-8 text-center">
          <p className="text-white/60 font-sans">No events yet. Add one to get started.</p>
        </div>
      )}
    </div>
  );
}
