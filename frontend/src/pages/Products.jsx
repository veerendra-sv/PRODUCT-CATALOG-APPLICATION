import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories, deleteProduct, semanticSearch } from '../services/api';
import { Search, PackageX, SlidersHorizontal, Sparkles } from 'lucide-react';
import '../components/Layout.css';

const SkeletonCard = () => (
  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
    <div className="skeleton" style={{ width: '100%', aspectRatio: '4/3' }} />
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="skeleton" style={{ height: 10, width: '40%' }} />
      <div className="skeleton" style={{ height: 16, width: '80%' }} />
      <div className="skeleton" style={{ height: 12, width: '100%' }} />
      <div className="skeleton" style={{ height: 12, width: '70%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div className="skeleton" style={{ height: 20, width: '35%' }} />
        <div className="skeleton" style={{ height: 28, width: '25%', borderRadius: 6 }} />
      </div>
    </div>
  </div>
);

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // Standard filter state
  const [search, setSearch]           = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice]       = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice]       = useState(searchParams.get('maxPrice') || '');

  // Smart (Semantic) Search state
  const [smartMode, setSmartMode]       = useState(false);
  const [smartQuery, setSmartQuery]     = useState('');
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartLabel, setSmartLabel]     = useState('');

  // ── Loaders ──────────────────────────────────────────────────────────────────
  const loadProducts = (filters = {}) => {
    setLoading(true);
    setError('');
    getProducts(res => {
      setLoading(false);
      if (res.code === 200) setProducts(res.products || []);
      else setError(res.message || 'Failed to load products');
    }, filters);
  };

  useEffect(() => {
    const qSearch = searchParams.get('search') || '';
    const qCat = searchParams.get('category') || '';
    const qMin = searchParams.get('minPrice') || '';
    const qMax = searchParams.get('maxPrice') || '';

    setSearch(qSearch);
    setSelectedCat(qCat);
    setMinPrice(qMin);
    setMaxPrice(qMax);

    loadProducts({
      category: qCat,
      search: qSearch,
      minPrice: qMin ? parseFloat(qMin) : null,
      maxPrice: qMax ? parseFloat(qMax) : null,
    });
  }, [searchParams]);

  useEffect(() => {
    getCategories(res => { if (res.code === 200) setCategories(res.categories || []); });
  }, []);

  // ── Standard filter handlers ──────────────────────────────────────────────────
  const applyFilters = () => {
    const params = {};
    if (search.trim()) params.search = search;
    if (selectedCat) params.category = selectedCat;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this product?')) return;
    deleteProduct(id, res => {
      if (res.code === 200) applyFilters();
      else alert(res.message);
    });
  };

  // ── Smart Search handlers ─────────────────────────────────────────────────────
  const handleSmartSearch = () => {
    if (!smartQuery.trim()) return;
    setSmartLoading(true);
    setError('');
    semanticSearch(smartQuery, res => {
      setSmartLoading(false);
      if (res.code === 200) {
        setProducts(res.products || []);
        setSmartLabel(`Smart Search: "${smartQuery}" — ${res.total} result${res.total !== 1 ? 's' : ''}`);
      } else {
        setError(res.message || 'Semantic search failed. Make sure the search index is seeded.');
      }
    });
  };

  const handleSmartReset = () => {
    setSmartQuery('');
    setSmartLabel('');
    setSmartMode(false);
    setSearchParams({});
  };

  const toggleSmartMode = () => {
    if (smartMode) {
      handleSmartReset();
    } else {
      setSmartMode(true);
    }
  };

  // ── Subtitle text ─────────────────────────────────────────────────────────────
  const subtitle = (smartLoading || loading)
    ? 'Searching…'
    : smartLabel || `${products.length} premium product${products.length !== 1 ? 's' : ''} found`;

  return (
    <NsLayout>

        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="layout-header">
          <div>
            <h1 className="layout-title">Product Catalog</h1>
            <p className="layout-subtitle">{subtitle}</p>
          </div>

          {/* Smart Search toggle */}
          <button
            onClick={toggleSmartMode}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
              background: smartMode
                ? 'linear-gradient(135deg, #6c63ff, #a855f7)'
                : 'var(--bg-surface)',
              color: smartMode ? '#fff' : 'var(--text-2)',
              border: `1px solid ${smartMode ? 'transparent' : 'var(--border)'}`,
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
            }}
          >
            <Sparkles size={14} />
            {smartMode ? 'Smart Search ON' : 'Smart Search'}
          </button>
        </div>

        {/* ── Smart Search Panel ────────────────────────────────────── */}
        {smartMode && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(168,85,247,0.08))',
            border: '1px solid rgba(108,99,255,0.35)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            marginBottom: 28,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <Sparkles size={18} style={{ color: '#a855f7', flexShrink: 0 }} />
            <div style={{ flex: '1 1 300px' }}>
              <input
                className="input"
                type="text"
                placeholder='Try: "affordable gaming laptop", "best phone for photography"…'
                value={smartQuery}
                onChange={e => setSmartQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSmartSearch()}
                style={{ paddingLeft: 14, border: '1px solid rgba(108,99,255,0.4)' }}
              />
            </div>
            <button
              className="btn"
              onClick={handleSmartSearch}
              disabled={smartLoading}
              style={{
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: '#fff', border: 'none', height: 40, minWidth: 120, fontWeight: 600,
              }}
            >
              {smartLoading ? 'Searching…' : '✨ Search'}
            </button>
            <button className="btn btn-secondary" onClick={handleSmartReset} style={{ height: 40 }}>
              Reset
            </button>
          </div>
        )}

        {/* ── Standard Filter Panel ─────────────────────────────────── */}
        {!smartMode && (
          <div className="filter-panel" style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            marginBottom: 28,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'flex-end',
          }}>
            {/* Search Box */}
            <div style={{ flex: '2 1 240px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SlidersHorizontal size={12} /> Search Products
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-3)',
                  display: 'flex', pointerEvents: 'none',
                }}>
                  <Search size={14} />
                </span>
                <input
                  className="input"
                  style={{ paddingLeft: 36 }}
                  type="text"
                  placeholder="Search specs, brand or name…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyFilters()}
                />
              </div>
            </div>

            {/* Category */}
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label">Category</label>
              <select
                className="input select-custom"
                value={selectedCat}
                onChange={e => setSelectedCat(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.categoryName}>{c.categoryName}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div style={{ flex: '0 1 110px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label">Min (₹)</label>
              <input
                className="input"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
              />
            </div>

            {/* Max Price */}
            <div style={{ flex: '0 1 110px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="form-label">Max (₹)</label>
              <input
                className="input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={applyFilters} style={{ height: 40 }}>
                Apply
              </button>
              <button className="btn btn-secondary" onClick={handleReset} style={{ height: 40 }}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ── Product Grid ──────────────────────────────────────────── */}
        {error ? (
          <div className="empty-state">
            <div className="empty-icon"><PackageX size={40} style={{ opacity: 0.4 }} /></div>
            <p style={{ color: 'var(--error)' }}>{error}</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        ) : (loading || smartLoading) ? (
          <div className="products-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No products match your criteria</p>
          </div>
        ) : (
          <div className="products-grid animate-fadeUp">
            {products.map(p => <ProductCard key={p.id} product={p} onDelete={handleDelete} />)}
          </div>
        )}

    </NsLayout>
  );
};

export default Products;
