import { useState, useEffect } from 'react';
import { Trash2, Plus, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Resource {
  id: string;
  title: string;
  category: string;
  author: string;
  description: string;
  file_url: string;
  resource_type: string | null;
}

const categories = ['book', 'primer', 'case_study', 'article'];
const categoryLabels = {
  book: 'Books',
  primer: 'Primers',
  case_study: 'Case Studies',
  article: 'Articles',
};

const resourceTypes = ['searcher', 'investor', 'company', 'other'];
const resourceTypeLabels = {
  searcher: 'Searcher Perspective',
  investor: 'Investor Perspective',
  company: 'Company Perspective',
  other: 'Other',
};

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'book',
    author: '',
    description: '',
    file_url: '',
    resource_type: null as string | null,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('resources').insert([formData]);
      if (error) throw error;

      setMessage('Resource added successfully');
      setIsError(false);
      setFormData({ title: '', category: 'book', author: '', description: '', file_url: '', resource_type: null });
      setShowForm(false);
      await fetchResources();

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to add resource');
      setIsError(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;

    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;

      setMessage('Resource deleted');
      setIsError(false);
      await fetchResources();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to delete');
      setIsError(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white font-sans">Resources</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-eta-gold text-eta-navy font-bold font-sans px-6 py-3 hover:bg-eta-gold-light transition-colors"
        >
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded flex items-center gap-3 ${isError ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'}`}>
          {!isError && <Check size={18} className="text-green-400" />}
          {isError && <AlertCircle size={18} className="text-red-400" />}
          <p className={`font-sans ${isError ? 'text-red-200' : 'text-green-200'}`}>{message}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white/10 border border-white/20 p-8 rounded mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
                required
              />
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white font-sans focus:outline-none focus:border-eta-gold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{categoryLabels[cat as keyof typeof categoryLabels]}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Author (optional)"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
              />
              {formData.category === 'case_study' && (
                <select
                  value={formData.resource_type || ''}
                  onChange={e => setFormData({ ...formData, resource_type: e.target.value || null })}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white font-sans focus:outline-none focus:border-eta-gold"
                >
                  <option value="">Select case study type</option>
                  {resourceTypes.map(type => (
                    <option key={type} value={type}>{resourceTypeLabels[type as keyof typeof resourceTypeLabels]}</option>
                  ))}
                </select>
              )}
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold min-h-24"
              required
            />

            <input
              type="url"
              placeholder="File URL (link to PDF or file)"
              value={formData.file_url}
              onChange={e => setFormData({ ...formData, file_url: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-eta-gold"
            />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-eta-gold text-eta-navy font-bold font-sans px-6 py-2 hover:bg-eta-gold-light transition-colors"
              >
                Add Resource
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
        <div className="text-white/60 font-sans">Loading resources...</div>
      ) : resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map(resource => (
            <div key={resource.id} className="bg-white/10 border border-white/20 p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-black text-white font-sans">{resource.title}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-eta-gold font-sans bg-eta-gold/20 px-2 py-1 rounded">
                      {categoryLabels[resource.category as keyof typeof categoryLabels]}
                    </span>
                    {resource.resource_type && (
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white font-sans bg-white/20 px-2 py-1 rounded">
                        {resourceTypeLabels[resource.resource_type as keyof typeof resourceTypeLabels]}
                      </span>
                    )}
                  </div>
                  {resource.author && (
                    <p className="text-white/60 font-sans text-sm mb-2">by {resource.author}</p>
                  )}
                  <p className="text-white/70 font-sans text-sm">{resource.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="flex-shrink-0 p-2 text-red-400 hover:bg-red-500/20 transition-colors rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 p-8 rounded text-center">
          <p className="text-white/60 font-sans">No resources yet. Add one to get started.</p>
        </div>
      )}
    </div>
  );
}
