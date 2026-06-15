import { useEffect, useState } from 'react';
import NsLayout from '../components/NsLayout';
import { getReports, updateReportStatus } from '../services/api';
import { ClipboardList, CheckCircle2, Clock, Eye, RefreshCw } from 'lucide-react';
import '../components/Layout.css';

const STATUS_CONFIG = {
  'Pending':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  'In Review': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'  },
  'Resolved':  { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'   },
};

const TYPE_COLORS = {
  'Product Issue':    '#f97316',
  'Order Issue':      '#ef4444',
  'General Feedback': '#6c63ff',
  'Other':            '#8b5cf6',
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
};

const AdminReports = () => {
  const [reports, setReports]   = useState([]);
  const [counts, setCounts]     = useState({});
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const loadReports = () => {
    setLoading(true);
    getReports(res => {
      setLoading(false);
      if (res?.code === 200) {
        setReports(res.reports || []);
        setCounts(res.counts   || {});
      }
    });
  };

  useEffect(() => { loadReports(); }, []);

  const handleStatusChange = (id, status) => {
    setUpdating(id);
    updateReportStatus(id, status, res => {
      setUpdating(null);
      if (res?.code === 200) loadReports();
    });
  };

  const filtered = filter
    ? reports.filter(r => r.status === filter)
    : reports;

  const fmt = dt => dt ? new Date(dt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—';

  return (
    <NsLayout>

        {/* Header */}
        <div className="layout-header">
          <div>
            <h1 className="layout-title">User Reports</h1>
            <p className="layout-subtitle">Review and manage issues submitted by users</p>
          </div>
          <button className="btn btn-secondary" onClick={loadReports} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total',     value: counts.total    || 0, color: '#6c63ff' },
            { label: 'Pending',   value: counts.pending  || 0, color: '#f59e0b' },
            { label: 'In Review', value: counts.inReview || 0, color: '#3b82f6' },
            { label: 'Resolved',  value: counts.resolved || 0, color: '#22c55e' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '14px 20px', flex: '1 1 120px',
              borderLeft: `3px solid ${s.color}`
            }}>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['', 'Pending', 'In Review', 'Resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
                fontWeight: 600, fontSize: 12, border: '1px solid',
                background: filter === f ? 'var(--accent)' : 'var(--bg-surface)',
                color:      filter === f ? '#fff'          : 'var(--text-2)',
                borderColor: filter === f ? 'transparent'  : 'var(--border)',
                transition: 'all 0.15s',
              }}
            >
              {f || 'All'} {f === '' ? `(${counts.total || 0})` : ''}
            </button>
          ))}
        </div>

        {/* Reports Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><ClipboardList size={40} style={{ opacity: 0.3 }} /></div>
            <p>No reports found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(r => (
              <div key={r._id} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                {/* Report Row */}
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>

                  {/* Type tag */}
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 2,
                    background: `${TYPE_COLORS[r.type] || '#6c63ff'}22`,
                    color: TYPE_COLORS[r.type] || '#6c63ff',
                    border: `1px solid ${TYPE_COLORS[r.type] || '#6c63ff'}44`,
                  }}>
                    {r.type}
                  </span>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-1)', fontSize: 14 }}>{r.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>
                      By <strong>{r.username || 'Unknown'}</strong>
                      {r.email ? ` · ${r.email}` : ''}
                      {' · '}{fmt(r.submittedAt)}
                    </p>
                    {expanded === r._id && (
                      <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6,
                        background: 'var(--bg-elevated)', padding: '10px 14px', borderRadius: 8 }}>
                        {r.description}
                      </p>
                    )}
                  </div>

                  {/* Right controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
                    <StatusBadge status={r.status} />

                    <button
                      onClick={() => setExpanded(expanded === r._id ? null : r._id)}
                      style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6,
                        padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        gap: 4, fontSize: 12, color: 'var(--text-2)' }}
                    >
                      <Eye size={12} /> {expanded === r._id ? 'Hide' : 'View'}
                    </button>

                    {r.status !== 'Resolved' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(r._id, 'In Review')}
                            disabled={updating === r._id}
                            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                              borderRadius: 6, padding: '4px 12px', cursor: 'pointer',
                              fontSize: 12, fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Clock size={11} /> In Review
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(r._id, 'Resolved')}
                          disabled={updating === r._id}
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: 6, padding: '4px 12px', cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <CheckCircle2 size={11} /> {updating === r._id ? '…' : 'Resolve'}
                        </button>
                      </div>
                    )}

                    {r.status === 'Resolved' && r.resolvedAt && (
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        Resolved {fmt(r.resolvedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </NsLayout>
  );
};

export default AdminReports;
