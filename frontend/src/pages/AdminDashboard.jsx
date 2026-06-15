import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getProducts, getCategories, deleteProduct } from '../services/api';
import { Package, Tag, PlusCircle, Edit2, Trash2, DownloadCloud } from 'lucide-react';
import '../components/Layout.css';

const AdminDashboard = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  const loadData = () => {
    let done = 0;
    const finish = () => { if (++done === 2) setLoading(false); };
    getProducts(res   => { if (res.code === 200) setProducts(res.products || []);       finish(); }, {});
    getCategories(res => { if (res.code === 200) setCategories(res.categories || []);   finish(); });
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = id => {
    if (!window.confirm('Delete this product?')) return;
    deleteProduct(id, res => {
      if (res.code === 200) setProducts(p => p.filter(x => x.id !== id));
      else alert(res.message);
    });
  };

  const stats = [
    { label: 'Total Products', value: products.length,   Icon: Package, color: 'var(--primary)', bg: 'var(--primary-subtle)' },
    { label: 'Categories',     value: categories.length, Icon: Tag,     color: 'var(--accent)',  bg: 'var(--accent-subtle)'  },
  ];

  return (
    <NsLayout>
        <div className="layout-header">
          <div>
            <h1 className="layout-title">Admin Dashboard</h1>
            <p className="layout-subtitle">Manage your catalog and inventory</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/products/import')}>
              <DownloadCloud size={14} /> Import Products
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/admin/products/add')}>
              <PlusCircle size={14} /> Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          {stats.map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="stat-card">
              <div className="stat-card-icon" style={{ background: bg, color }}><Icon size={18} /></div>
              <div className="stat-card-value">{value}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">All Products</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Product</th><th>Brand</th>
                  <th>Price</th><th>Stock</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{p.id}</td>
                    <td style={{ color: 'var(--text-1)', fontWeight: 600 }}>{p.productName}</td>
                    <td>{p.brand || '—'}</td>
                    <td style={{ color: 'var(--text-1)', fontWeight: 700 }}>₹{Number(p.price||0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${p.stockQuantity > 0 ? 'badge-active' : 'badge-error'}`}>
                        {p.stockQuantity > 0 ? p.stockQuantity : 'Out'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && !loading && <div className="empty-state"><p>No products yet.</p></div>}
          </div>
        </div>

        <ProgressBar isProgress={loading} />
    </NsLayout>
  );
};

export default AdminDashboard;
