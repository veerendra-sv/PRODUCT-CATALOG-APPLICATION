import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getProduct, addToCart, isAdmin } from '../services/api';
import { ArrowLeft, Edit2, Package, ShoppingCart, Plus, Minus } from 'lucide-react';
import '../components/Layout.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const admin = isAdmin();

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product.id, qty, res => {
      setAdding(false);
      if (res.code === 200) { setAdded(true); setTimeout(() => setAdded(false), 2000); }
      else alert(res.message);
    });
  };

  useEffect(() => {
    getProduct(id, res => { setLoading(false); if (res.code === 200) setProduct(res.product); });
  }, [id]);

  return (
    <NsLayout title="Product Details">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20, gap: 6 }} onClick={() => navigate('/products')}>
          <ArrowLeft size={14} /> Back to Products
        </button>

        {product && (
          <div className="detail-layout">
            <div className="detail-img-box">
              {product.imageUrl
                ? <img src={product.imageUrl} alt={product.productName} />
                : <div className="detail-placeholder"><Package size={64} /></div>}
            </div>

            <div className="detail-info-card">
              <p className="detail-brand">{product.brand}</p>
              <h1 className="detail-name">{product.productName}</h1>
              <p className="detail-price">₹{Number(product.price || 0).toLocaleString('en-IN')}</p>
              <p className="detail-desc">{product.description || 'No description provided.'}</p>

              <div className="detail-meta">
                <div className="detail-meta-chip">
                  <strong>{product.categoryId || '-'}</strong>
                  Category ID
                </div>
              </div>

              {!admin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-hover)', borderRadius: 8, overflow: 'hidden' }}>
                    <button className="btn btn-ghost btn-sm" style={{ borderRadius: 0 }} onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={13} /></button>
                    <span style={{ padding: '0 14px', fontWeight: 600, color: 'var(--text-1)' }}>{qty}</span>
                    <button className="btn btn-ghost btn-sm" style={{ borderRadius: 0 }} onClick={() => setQty(q => q + 1)}><Plus size={13} /></button>
                  </div>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart} disabled={adding}>
                    <ShoppingCart size={14} />
                    {added ? 'âœ“ Added!' : adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              )}
              {admin && (
                <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                  <Edit2 size={14} /> Edit Product
                </button>
              )}
            </div>
          </div>
        )}

        <ProgressBar isProgress={loading} />
    </NsLayout>
  );
};

export default ProductDetail;


