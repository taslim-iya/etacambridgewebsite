import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface CommunitySignupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunitySignup({ isOpen, onClose }: CommunitySignupProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    jobRole: '',
    linkedinProfile: '',
    roleType: '',
    isCambridgeAlum: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    { value: 'searcher', label: 'Searcher' },
    { value: 'investor', label: 'Investor' },
    { value: 'prospective_searcher', label: 'Prospective Searcher' },
    { value: 'deal_advisor', label: 'Deal Advisor' },
    { value: 'operator', label: 'Operator' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      setError('Full name and email are required');
      return;
    }

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
          body: JSON.stringify({
            email: formData.email,
            full_name: formData.fullName,
            company: formData.company,
            job_role: formData.jobRole,
            linkedin_profile: formData.linkedinProfile,
            role_type: formData.roleType,
            is_cambridge_alum: formData.isCambridgeAlum,
            source: 'community',
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setFormData({
          fullName: '',
          email: '',
          company: '',
          jobRole: '',
          linkedinProfile: '',
          roleType: '',
          isCambridgeAlum: false,
        });
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-eta-navy/40 hover:text-eta-navy transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle size={48} className="text-eta-gold mb-4" />
              <h3 className="text-2xl font-black text-eta-navy font-sans mb-2">Welcome to the community!</h3>
              <p className="text-eta-navy/65 font-sans">We'll be in touch soon with opportunities and updates.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-eta-gold font-sans mb-2">Join Us</p>
                <h2 className="text-3xl md:text-4xl font-black text-eta-navy font-sans mb-3 leading-tight">Join the Cambridge ETA community.</h2>
                <p className="text-eta-navy/65 font-sans">Tell us more about yourself so we can connect you with relevant opportunities and resources.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name - Required */}
                <div>
                  <label className="block text-sm font-bold text-eta-navy font-sans mb-2">
                    Full Name <span className="text-eta-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-white border border-[#e6e0d0] text-eta-navy placeholder:text-eta-navy/40 font-sans focus:outline-none focus:border-eta-gold"
                  />
                </div>

                {/* Email - Required */}
                <div>
                  <label className="block text-sm font-bold text-eta-navy font-sans mb-2">
                    Email <span className="text-eta-gold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-white border border-[#e6e0d0] text-eta-navy placeholder:text-eta-navy/40 font-sans focus:outline-none focus:border-eta-gold"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-bold text-eta-navy font-sans mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company (optional)"
                    className="w-full px-4 py-2.5 bg-white border border-[#e6e0d0] text-eta-navy placeholder:text-eta-navy/40 font-sans focus:outline-none focus:border-eta-gold"
                  />
                </div>

                {/* Job Role */}
                <div>
                  <label className="block text-sm font-bold text-eta-navy font-sans mb-2">Job Role</label>
                  <input
                    type="text"
                    value={formData.jobRole}
                    onChange={e => setFormData({ ...formData, jobRole: e.target.value })}
                    placeholder="Your job title (optional)"
                    className="w-full px-4 py-2.5 bg-white border border-[#e6e0d0] text-eta-navy placeholder:text-eta-navy/40 font-sans focus:outline-none focus:border-eta-gold"
                  />
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label className="block text-sm font-bold text-eta-navy font-sans mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedinProfile}
                    onChange={e => setFormData({ ...formData, linkedinProfile: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile (optional)"
                    className="w-full px-4 py-2.5 bg-white border border-[#e6e0d0] text-eta-navy placeholder:text-eta-navy/40 font-sans focus:outline-none focus:border-eta-gold"
                  />
                </div>

                {/* Role Type */}
                <div>
                  <label className="block text-sm font-bold text-eta-navy font-sans mb-3">What best describes your role?</label>
                  <div className="space-y-2">
                    {roleOptions.map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="roleType"
                          value={option.value}
                          checked={formData.roleType === option.value}
                          onChange={e => setFormData({ ...formData, roleType: e.target.value })}
                          className="w-4 h-4 accent-eta-gold"
                        />
                        <span className="text-eta-navy font-sans group-hover:text-eta-gold transition-colors">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cambridge Alumni */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isCambridgeAlum}
                      onChange={e => setFormData({ ...formData, isCambridgeAlum: e.target.checked })}
                      className="w-4 h-4 accent-eta-gold"
                    />
                    <span className="text-eta-navy font-sans group-hover:text-eta-gold transition-colors">I'm a Cambridge Judge alumnus</span>
                  </label>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-600 text-sm font-sans">{error}</p>}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-grow bg-eta-navy text-white text-sm font-bold font-sans py-3 hover:bg-eta-navy-mid transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {loading ? 'Joining...' : 'Join Community'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-[#e6e0d0] text-eta-navy text-sm font-bold font-sans hover:bg-eta-cream transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
