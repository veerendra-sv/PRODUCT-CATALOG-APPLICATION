import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import { submitReport, getUinfo } from '../services/api';
import { Flag, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import '../components/Layout.css';

const REPORT_TYPES = ['Product Issue', 'Order Issue', 'General Feedback', 'Other'];

const Report = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'General Feedback', title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    setLoading(true);
    setResult(null);

    // Get user info then submit
    getUinfo(res => {
      const payload = {
        userId:      res?.id   || '',
        username:    res?.username || res?.name || 'User',
        email:       res?.email || '',
        type:        form.type,
        title:       form.title.trim(),
        description: form.description.trim(),
      };

      submitReport(payload, r => {
        setLoading(false);
        if (r?.code === 200) {
          setResult({ success: true, message: 'Your report has been submitted! Our team will review it shortly.' });
          setForm({ type: 'General Feedback', title: '', description: '' });
        } else {
          setResult({ success: false, message: r?.message || 'Failed to submit report. Please try again.' });
        }
      });
    });
  };

  return (
    <NsLayout title="Report an Issue" subtitle="Let us know about any problems or feedback">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="form-card" style={{ maxWidth: 620 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Flag size={20} color="#fff" />
            </div>
            <div>
              <h1 className="form-card-title" style={{ margin: 0 }}>Report an Issue</h1>
              <p className="form-card-sub" style={{ margin: 0 }}>Let us know about any problems or feedback</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

          {/* Success/Error Banner */}
          {result && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 18px', borderRadius: 'var(--radius)', marginBottom: 20,
              background: result.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${result.success ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
              {result.success
                ? <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                : <AlertCircle  size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              }
              <span style={{ fontSize: 14, color: result.success ? '#22c55e' : '#ef4444' }}>
                {result.message}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Report Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label">Report Type</label>
              <select
                className="input select-custom"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label">Title <span style={{ color: 'var(--error)' }}>*</span></label>
              <input
                className="input"
                name="title"
                type="text"
                placeholder="Brief summary of the issue…"
                value={form.title}
                onChange={handleChange}
                maxLength={120}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'right' }}>
                {form.title.length}/120
              </span>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label">Description <span style={{ color: 'var(--error)' }}>*</span></label>
              <textarea
                className="input"
                name="description"
                placeholder="Describe the issue in detail. Include any relevant product names, order numbers, or steps to reproduce…"
                value={form.description}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                required
                style={{ resize: 'vertical', minHeight: 120, fontFamily: 'inherit' }}
              />
              <span style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'right' }}>
                {form.description.length}/1000
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !form.title.trim() || !form.description.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}
            >
              <Send size={14} />
              {loading ? 'Submitting…' : 'Submit Report'}
            </button>
          </form>
        </div>

    </NsLayout>
  );
};

export default Report;
