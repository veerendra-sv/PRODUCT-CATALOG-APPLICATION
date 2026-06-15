import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { createProduct, getCategories } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import '../components/Layout.css';

const empty = { productName:'', brand:'', description:'', price:'', stockQuantity:'', imageUrl:'', categoryId:'' };

const AddProduct = () => {
  const [form, setForm]       = useState(empty);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [cats, setCats]       = useState([]);
  const navigate = useNavigate();

  useEffect(() => { getCategories(res => { if (res.code === 200) setCats(res.categories || []); }); }, []);

  const set = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setErrors(p => ({ ...p, [e.target.name]: false })); };

  const validate = () => {
    const err = {};
    if (!form.productName.trim()) err.productName = true;
    if (!form.price || isNaN(form.price)) err.price = true;
    if (!form.stockQuantity || isNaN(form.stockQuantity)) err.stockQuantity = true;
    setErrors(err); return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    createProduct({ ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity), categoryId: form.categoryId ? parseInt(form.categoryId) : null }, res => {
      setLoading(false);
      if (res.code === 200) { alert('Product added!'); navigate('/products'); }
      else alert(res.message);
    });
  };

  return (
    <NsLayout title="Add Product" subtitle="Fill in the details to add a new product to the catalog">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="form-card">
          <h1 className="form-card-title">Add Product</h1>
          <p className="form-card-sub">Fill in the details to add a new product to the catalog</p>

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input name="productName" className={`input ${errors.productName ? 'error' : ''}`}
              value={form.productName} onChange={set} placeholder="e.g. iPhone 15 Pro" />
          </div>

          <div className="form-group">
            <label className="form-label">Brand</label>
            <input name="brand" className="input" value={form.brand} onChange={set} placeholder="e.g. Apple" />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="input" value={form.description} onChange={set}
              placeholder="Product description…" style={{ height: 90 }} />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input name="price" type="number" className={`input ${errors.price ? 'error' : ''}`}
                value={form.price} onChange={set} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Qty *</label>
              <input name="stockQuantity" type="number" className={`input ${errors.stockQuantity ? 'error' : ''}`}
                value={form.stockQuantity} onChange={set} placeholder="0" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input name="imageUrl" className="input" value={form.imageUrl} onChange={set}
              placeholder="https://example.com/img.jpg" />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="categoryId" className="input" value={form.categoryId} onChange={set}>
              <option value="">— Select Category —</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
            </select>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', height: 42 }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding…' : 'Add Product'}
          </button>
        </div>

        <ProgressBar isProgress={loading} />
    </NsLayout>
  );
};

export default AddProduct;
