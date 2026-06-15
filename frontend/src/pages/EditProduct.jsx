import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getProduct, updateProduct, getCategories } from '../services/api';
import { ArrowLeft, Save, PackageOpen } from 'lucide-react';
import '../components/Layout.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm]       = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving]   = useState(false);
  const [cats, setCats]       = useState([]);

  useEffect(() => {
    getProduct(id, res => {
      setLoading(false);
      if (res.code === 200 && res.product) {
        const p = res.product;
        setForm({
          productName: p.productName || '',
          brand: p.brand || '',
          description: p.description || '',
          price: p.price || '',
          stockQuantity: p.stockQuantity || '',
          imageUrl: p.imageUrl || '',
          categoryId: p.categoryId || ''
        });
      } else {
        setErrorMsg(res.message || 'Product not found');
      }
    });
    getCategories(res => { if (res.code === 200) setCats(res.categories || []); });
  }, [id]);

  const set = e => { 
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); 
    setErrors(p => ({ ...p, [e.target.name]: false })); 
  };

  const validate = () => {
    const err = {};
    if (!form.productName.trim()) err.productName = true;
    if (!form.price || isNaN(form.price)) err.price = true;
    if (!form.stockQuantity || isNaN(form.stockQuantity)) err.stockQuantity = true;
    setErrors(err); 
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    updateProduct(id, { 
      ...form, 
      price: parseFloat(form.price), 
      stockQuantity: parseInt(form.stockQuantity), 
      categoryId: form.categoryId ? parseInt(form.categoryId) : null 
    }, res => {
      setSaving(false);
      if (res.code === 200) { 
        alert('Product updated successfully!'); 
        navigate('/products'); 
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <NsLayout title="Edit Product">
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ marginBottom: 24 }} 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={14} /> Back
        </button>

        {loading ? (
          <div className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 32 }}>
            <div className="skeleton" style={{ height: 28, width: '40%' }} />
            <div className="skeleton" style={{ height: 16, width: '25%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 40, width: '100%' }} />
            <div className="skeleton" style={{ height: 40, width: '100%' }} />
            <div className="skeleton" style={{ height: 80, width: '100%' }} />
            <div className="skeleton" style={{ height: 40, width: '100%' }} />
          </div>
        ) : errorMsg ? (
          <div className="form-card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--error-subtle)', color: 'var(--error)', marginBottom: 16 }}>
              <PackageOpen size={24} />
            </div>
            <h2 className="form-card-title">Failed to Load Product</h2>
            <p className="form-card-sub" style={{ color: 'var(--error)', fontWeight: 500, marginTop: 4 }}>
              {errorMsg}
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: 16 }} 
              onClick={() => navigate('/products')}
            >
              Back to Catalog
            </button>
          </div>
        ) : form ? (
          <div className="form-card">
            <h1 className="form-card-title">Edit Product</h1>
            <p className="form-card-sub">Updating ID: #{id}</p>

            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input 
                name="productName" 
                className={`input ${errors.productName ? 'error' : ''}`} 
                value={form.productName} 
                onChange={set} 
                placeholder="Product name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input 
                name="brand" 
                className="input" 
                value={form.brand} 
                onChange={set} 
                placeholder="Brand name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                name="description" 
                className="input" 
                value={form.description} 
                onChange={set} 
                style={{ height: 100, padding: '12px 14px', resize: 'none' }} 
                placeholder="Write an engaging product description…"
              />
            </div>
            
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input 
                  name="price" 
                  type="number" 
                  className={`input ${errors.price ? 'error' : ''}`} 
                  value={form.price} 
                  onChange={set} 
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Qty *</label>
                <input 
                  name="stockQuantity" 
                  type="number" 
                  className={`input ${errors.stockQuantity ? 'error' : ''}`} 
                  value={form.stockQuantity} 
                  onChange={set} 
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input 
                name="imageUrl" 
                className="input" 
                value={form.imageUrl} 
                onChange={set} 
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="categoryId" className="input" value={form.categoryId} onChange={set}>
                <option value="">— Select Category —</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
              </select>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', height: 42, marginTop: 8 }} 
              onClick={handleSubmit} 
              disabled={saving}
            >
              <Save size={15} />
              {saving ? 'Saving changes…' : 'Update Product'}
            </button>
          </div>
        ) : null}
        
        <ProgressBar isProgress={saving} />
    </NsLayout>
  );
};

export default EditProduct;
