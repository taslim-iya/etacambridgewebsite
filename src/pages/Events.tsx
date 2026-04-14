import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import MailingListSignup from '../components/MailingListSignup';
import CommunitySignup from '../components/CommunitySignup';
import EventRegistrationModal from '../components/EventRegistrationModal';
import { supabase } from '../lib/supabase';

interface EventsProps {
  onNavigate: (page: string) => void;
}

interface Event {
  id: string;
  title: string;
  event_type: string;
  description: string;
  date: string | null;
  location: string | null;
  capacity: number | null;
}

const typeLabels: Record<string, string> = {
  workshop: 'Workshop',
  panel: 'Speaker Panel',
  networking: 'Networking',
};

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    full: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function Events({ onNavigate }: EventsProps) {
  const [showCommunitySignup, setShowCommunitySignup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Upcoming</p>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-none mb-6 tracking-tight">
              Events.
            </h1>
            <p className="text-xl text-eta-navy/65 font-sans leading-relaxed max-w-2xl">
              Workshops, panels and networking opportunities throughout the academic year at Cambridge Judge Business School. Open to all Cambridge students and alumni.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-eta-cream py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Calendar</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-10 tracking-tight">
            What's next.
          </h2>

          {loading ? (
            <div className="border-t border-[#e6e0d0] py-12 text-center">
              <p className="text-eta-muted font-sans text-sm">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="border-t border-[#e6e0d0]">
              {events.map(event => {
                const dateInfo = event.date ? formatEventDate(event.date) : null;
                return (
                  <div key={event.id} className="py-8 flex flex-col md:flex-row md:items-start gap-8 border-b border-[#e6e0d0] group">
                    <div className="flex-shrink-0 w-20">
                      {dateInfo ? (
                        <div className="text-center">
                          <div className="text-4xl font-black text-eta-navy font-sans leading-none">{dateInfo.day}</div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mt-1">{dateInfo.month}</div>
                        </div>
                      ) : (
                        <div className="text-4xl font-black text-eta-navy font-sans leading-none">TBC</div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-2">
                        {typeLabels[event.event_type] ?? event.event_type}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-eta-navy font-sans mb-3 leading-tight tracking-tight">
                        {event.title}
                      </h3>
                      <p className="text-eta-navy/65 font-sans text-sm leading-relaxed mb-4 max-w-2xl">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-4 mb-5">
                        {dateInfo && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-eta-navy bg-white border border-[#e6e0d0] px-3 py-1.5">
                            <Calendar size={11} className="text-eta-gold" />
                            {dateInfo.full} · {dateInfo.time}
                          </span>
                        )}
                        {!event.date && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-eta-navy bg-white border border-[#e6e0d0] px-3 py-1.5">
                            <span className="w-1.5 h-1.5 bg-eta-gold" />
                            Date TBC
                          </span>
                        )}
                        {event.location && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-eta-navy bg-white border border-[#e6e0d0] px-3 py-1.5">
                            <MapPin size={11} className="text-eta-gold" />
                            {event.location}
                          </span>
                        )}
                        {event.capacity && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-eta-navy bg-white border border-[#e6e0d0] px-3 py-1.5">
                            <Users size={11} className="text-eta-gold" />
                            {event.capacity} places
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="bg-eta-navy text-white text-sm font-bold font-sans px-6 py-2.5 hover:bg-eta-navy-mid transition-colors inline-flex items-center gap-2"
                      >
                        Register <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border-t border-[#e6e0d0]">
              <div className="py-8 flex flex-col md:flex-row md:items-start gap-8 border-b border-[#e6e0d0]">
                <div className="flex-shrink-0 w-20">
                  <div className="text-4xl font-black text-eta-navy font-sans leading-none">TBC</div>
                </div>
                <div className="flex-grow">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-2">Workshop</div>
                  <h3 className="text-xl md:text-2xl font-black text-eta-navy font-sans mb-3 leading-tight tracking-tight">
                    Search Fund Economics: From Raise to Acquisition
                  </h3>
                  <p className="text-eta-navy/65 font-sans text-sm leading-relaxed mb-5 max-w-2xl">
                    An introduction to the search fund model — covering search fund capitalisation, search economics and the path from raise to acquisition.
                  </p>
                  <div className="flex items-center gap-5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-eta-navy bg-white border border-[#e6e0d0] px-3 py-1.5">
                      <span className="w-1.5 h-1.5 bg-eta-gold" />
                      Date TBC
                    </span>
                    <button
                      onClick={() => setShowCommunitySignup(true)}
                      className="text-eta-navy text-sm font-bold font-sans flex items-center gap-1.5 hover:gap-2.5 transition-all"
                    >
                      Register interest <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-eta-muted text-sm font-sans mt-8 italic mb-6">
            More events will be announced throughout the academic year. Subscribe below to be the first to know.
          </p>
          <button
            onClick={() => setShowCommunitySignup(true)}
            className="bg-eta-navy text-white text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy-mid transition-colors inline-flex items-center gap-2"
          >
            Join our community <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Format</p>
          <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans leading-tight mb-10 tracking-tight">
            Types of events.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#e6e0d0]">
            {[
              { type: 'Workshops', desc: 'Deep-dive sessions on specific aspects of ETA — from search fund economics to deal structuring and due diligence.' },
              { type: 'Speaker Panels', desc: 'Hear from practitioners who have successfully navigated the ETA journey — searchers, operators, and investors.' },
              { type: 'Networking', desc: 'Connect with fellow Cambridge students and alumni who share your interest in acquisition entrepreneurship.' },
            ].map((item, i) => (
              <div key={i} className="bg-eta-cream p-8">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-3">0{i + 1}</div>
                <h3 className="text-xl font-black text-eta-navy font-sans mb-3 leading-tight tracking-tight">{item.type}</h3>
                <p className="text-eta-muted text-sm font-sans leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MailingListSignup
        source="events"
        heading="Stay in the loop."
        subheading="Get notified about upcoming events, workshops, and speaker panels as soon as they're announced."
        label="Never miss an event."
      />

      <CommunitySignup isOpen={showCommunitySignup} onClose={() => setShowCommunitySignup(false)} />
      <EventRegistrationModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
