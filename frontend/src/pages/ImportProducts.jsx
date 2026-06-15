import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { importFromDummyJSON, seedSearchIndex } from '../services/api';
import { ArrowLeft, Download, CheckCircle2, AlertCircle, Package, Sparkles, Database } from 'lucide-react';
import '../components/Layout.css';

const ImportProducts = () => {
  const [loading, setLoading]       = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [result, setResult]         = useState(null);
  const [seedResult, setSeedResult] = useState(null);
  const navigate = useNavigate();

  const handleDummyImport = () => {
    if (!window.confirm('This will import up to 100 products from DummyJSON. Continue?')) return;
    setLoading(true);
    setResult(null);
    importFromDummyJSON(res => {
      setLoading(false);
      if (res && res.code === 200) {
        setResult({ success: true, message: `Successfully imported ${res.imported || 'multiple'} products!` });
      } else {
        setResult({ success: false, message: res?.message || 'Import failed. Please try again.' });
      }
    });
  };

  const handleSeedSearch = () => {
    setSeedLoading(true);
    setSeedResult(null);
    seedSearchIndex(res => {
      setSeedLoading(false);
      if (res && res.code === 200) {
        setSeedResult({
          success: true,
          message: `✅ Smart Search index seeded! ${res.inserted || 0} products added to MongoDB.`
        });
      } else {
        setSeedResult({
          success: false,
          message: res?.message || 'Seeding failed. Make sure the search service is running on port 3001.'
        });
      }
    });
  };

  return (
    <NsLayout title="Import Products" subtitle="Bulk import products into the catalog">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="form-card" style={{ maxWidth: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Download size={20} color="#fff" />
            </div>
            <div>
              <h1 className="form-card-title" style={{ margin: 0 }}>Import Products</h1>
              <p className="form-card-sub" style={{ margin: 0 }}>Bulk import products into the catalog</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

          {/* ── Step 1: DummyJSON Import ────────────────────────────────── */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Package size={18} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 20 }}>STEP 1</span>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Import from DummyJSON</h3>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>
                  Fetches up to <strong>100 sample products</strong> from{' '}
                  <a href="https://dummyjson.com" target="_blank" rel="noreferrer"
                    style={{ color: 'var(--accent)' }}>dummyjson.com</a>{' '}
                  and imports them into PostgreSQL.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleDummyImport}
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Download size={14} />
                  {loading ? 'Importing…' : 'Start Import'}
                </button>
              </div>
            </div>
          </div>

          {/* Import Result */}
          {result && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px',
              borderRadius: 'var(--radius)',
              background: result.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${result.success ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              marginBottom: 16
            }}>
              {result.success
                ? <CheckCircle2 size={18} color="#22c55e" />
                : <AlertCircle size={18} color="#ef4444" />
              }
              <span style={{ fontSize: 14, color: result.success ? '#22c55e' : '#ef4444' }}>
                {result.message}
              </span>
            </div>
          )}

          {/* ── Step 2: Seed Smart Search Index ────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.06), rgba(168,85,247,0.06))',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(168,85,247,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Database size={18} color="#a855f7" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a855f7', background: 'rgba(168,85,247,0.15)', padding: '2px 8px', borderRadius: 20 }}>STEP 2</span>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Seed Smart Search Index</h3>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>
                  Syncs your product catalog to <strong>MongoDB Atlas</strong> to power the{' '}
                  <Sparkles size={12} style={{ display: 'inline', color: '#a855f7' }} />{' '}
                  <strong>Smart Search</strong> feature. Run this after every import.
                </p>
                <button
                  className="btn"
                  onClick={handleSeedSearch}
                  disabled={seedLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                    color: '#fff', border: 'none', fontWeight: 600
                  }}
                >
                  <Sparkles size={14} />
                  {seedLoading ? 'Seeding MongoDB…' : 'Seed Smart Search'}
                </button>
              </div>
            </div>
          </div>

          {/* Seed Result */}
          {seedResult && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px',
              borderRadius: 'var(--radius)',
              background: seedResult.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${seedResult.success ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              marginBottom: 8
            }}>
              {seedResult.success
                ? <CheckCircle2 size={18} color="#22c55e" />
                : <AlertCircle size={18} color="#ef4444" />
              }
              <span style={{ fontSize: 14, color: seedResult.success ? '#22c55e' : '#ef4444' }}>
                {seedResult.message}
              </span>
              {seedResult.success && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => navigate('/products')}
                >
                  Try Smart Search
                </button>
              )}
            </div>
          )}

        </div>

        <ProgressBar isProgress={loading || seedLoading} />
    </NsLayout>
  );
};

export default ImportProducts;
