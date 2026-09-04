import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import api from '../../services/api';

export default function CreateExperienceModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [organization, setOrganization] = useState('');
  const [date, setDate] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [description, setDescription] = useState('');
  const [challenges, setChallenges] = useState('');
  const [whatILearned, setWhatILearned] = useState('');
  const [advice, setAdvice] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/experiences', {
        title,
        category,
        organization,
        date,
        technologies,
        description,
        challenges,
        whatILearned,
        advice,
        tags
      });

      if (res.success) {
        onCreated();
        onClose();
        setTitle('');
        setDescription('');
        setChallenges('');
        setAdvice('');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Knowledge on Experience Hub"
      subtitle="Inspire peers and juniors by detailing your hackathon, internship, research or project journey."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Experience Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Winning 1st Place at Smart India Hackathon — Edge AI Video Analysis"
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Internship">Internship</option>
              <option value="Research">Research & Papers</option>
              <option value="Project">Engineering Project</option>
              <option value="Industry">Industry Experience</option>
              <option value="Career Advice">Career Advice</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Organization / Event</label>
            <input
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Microsoft Research India"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Timeline / Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. Summer 2025"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Technologies / Frameworks (comma-separated)</label>
          <input
            type="text"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            placeholder="e.g. PyTorch, YOLOv10, FastAPI, React, CUDA"
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Comprehensive Overview</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what the project or internship entailed..."
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Obstacles & Challenges Faced</label>
            <textarea
              rows={2}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="e.g. GPU memory saturation, model latency..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Actionable Advice for Peers</label>
            <textarea
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="e.g. Master core DAA and build end-to-end prototypes..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>Publish to Community</Button>
        </div>
      </form>
    </Modal>
  );
}
