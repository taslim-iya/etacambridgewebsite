import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('contact_submissions').insert([{
        name: formData.name,
        email: formData.email,
        message: `Subject: ${formData.subject}\n\n${formData.message}`,
        submission_type: 'contact_form',
      }]);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero - white */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e6e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-4">Get in Touch</p>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-eta-navy font-sans leading-none mb-6 tracking-tight">
              Contact.
            </h1>
            <p className="text-xl text-eta-navy/65 font-sans leading-relaxed max-w-2xl">
              Whether you're curious about ETA, want to get involved, or just want to say hello - we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Form + sidebar - cream */}
      <section className="bg-eta-cream py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="bg-white border border-[#e6e0d0] p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <CheckCircle size={28} className="text-eta-gold flex-shrink-0" />
                    <h3 className="text-2xl font-black text-eta-navy font-sans tracking-tight">Message received!</h3>
                  </div>
                  <p className="text-eta-navy/70 font-sans leading-relaxed mb-8">
                    Thank you for getting in touch. We'll respond within 2-3 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="border border-eta-navy text-eta-navy text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy hover:text-white transition-colors flex items-center gap-2 w-fit"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full bg-white border border-[#e6e0d0] px-4 py-3 text-sm text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-navy"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full bg-white border border-[#e6e0d0] px-4 py-3 text-sm text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-navy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans mb-2">Subject</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-[#e6e0d0] px-4 py-3 text-sm text-eta-navy font-sans focus:outline-none focus:border-eta-navy"
                    >
                      <option value="">Select a subject...</option>
                      <option value="general">General enquiry</option>
                      <option value="join">Join the community</option>
                      <option value="events">Events & workshops</option>
                      <option value="partnership">Partnership opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-eta-muted font-sans mb-2">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your interest in ETA..."
                      className="w-full bg-white border border-[#e6e0d0] px-4 py-3 text-sm text-eta-navy placeholder:text-eta-muted font-sans focus:outline-none focus:border-eta-navy resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-eta-navy text-white text-sm font-bold font-sans px-7 py-3.5 hover:bg-eta-navy-mid transition-colors flex items-center gap-2 w-fit disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send message'} <ArrowRight size={15} />
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-px bg-[#ddd7c8]">
              <div className="bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-3">Direct Contact</p>
                <h3 className="font-black text-eta-navy font-sans text-base mb-3 leading-tight tracking-tight">Prefer to email us directly?</h3>
                <a href="mailto:team@etacambridge.com" className="text-eta-navy font-bold font-sans text-sm hover:text-eta-navy-mid transition-colors">
                  team@etacambridge.com
                </a>
                <p className="text-eta-muted text-xs font-sans mt-3 leading-relaxed">
                  We typically respond within 2-3 business days.
                </p>
              </div>

              <div className="bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-3">Location</p>
                <h3 className="font-black text-eta-navy font-sans text-sm mb-1 leading-tight tracking-tight">Cambridge Judge Business School</h3>
                <p className="text-eta-muted text-sm font-sans">Trumpington Street, Cambridge, CB2 1AG, United Kingdom</p>
              </div>

              <div className="bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-3">Ways to Connect</p>
                <ul className="space-y-2.5">
                  {[
                    'Attend our events and workshops',
                    'Access our curated resources',
                    'Join the ETA network',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-eta-navy font-sans">
                      <span className="w-1.5 h-1.5 bg-eta-gold flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
