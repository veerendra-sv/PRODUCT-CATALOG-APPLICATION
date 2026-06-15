import { useEffect, useState } from 'react';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getCategories, createCategory, isAdmin } from '../services/api';
import { Tag, PlusCircle, FolderHeart } from 'lucide-react';
import '../components/Layout.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [form, setForm]             = useState({ categoryName: '', description: '' });
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);
    const admin = isAdmin();

    const loadCategories = () => {
        setLoading(true);
        getCategories(res => {
            setLoading(false);
            if (res.code === 200) setCategories(res.categories || []);
        });
    };

    useEffect(() => { loadCategories(); }, []);

    const handleSubmit = () => {
        const err = {};
        if (!form.categoryName.trim()) err.categoryName = true;
        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setSaving(true);
        createCategory(form, res => {
            setSaving(false);
            if (res.code === 200) {
                setForm({ categoryName: '', description: '' });
                loadCategories();
            } else alert(res.message);
        });
    };

    return (
        <NsLayout title="Categories" subtitle="Organize and group products in your catalogue">
                <header className="layout-header">
                    <div>
                        <h1 className="layout-title">Categories</h1>
                        <p className="layout-subtitle">Organize and group products in your catalogue</p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: admin ? '1fr 360px' : '1fr', gap: 28, alignItems: 'start' }}>
                    {/* List */}
                    <div className="content-card">
                        <div className="content-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Tag size={18} style={{ color: 'var(--primary)' }} />
                                <h2 className="content-card-title">All Categories ({categories.length})</h2>
                            </div>
                        </div>
                        {categories.length === 0 && !loading ? (
                            <div className="empty-state">
                                <div className="empty-icon">🏷️</div>
                                <p>No categories created yet.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Category Name</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(c => (
                                            <tr key={c.id}>
                                                <td style={{ color: 'var(--text-3)', fontFamily: 'monospace' }}>#{c.id}</td>
                                                <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{c.categoryName}</td>
                                                <td>{c.description || <span style={{ color: 'var(--text-3)', fontSize: '11px' }}>—</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Add form — admin only */}
                    {admin && (
                        <div className="form-card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <FolderHeart size={20} style={{ color: 'var(--accent)' }} />
                                <h2 className="form-card-title" style={{ margin: 0, fontSize: 16 }}>New Category</h2>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Category Name *</label>
                                <input 
                                    className={`input ${errors.categoryName ? 'error' : ''}`}
                                    value={form.categoryName}
                                    onChange={e => { setForm(p=>({...p, categoryName:e.target.value})); setErrors({}); }}
                                    placeholder="e.g. Smart Electronics" 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea 
                                    className="input"
                                    value={form.description}
                                    onChange={e => setForm(p=>({...p, description:e.target.value}))}
                                    placeholder="Optional description of this product line…" 
                                    style={{ height: 100, padding: '12px 14px', resize: 'none' }} 
                                />
                            </div>
                            <button 
                                className="btn btn-primary" 
                                style={{ width: '100%', marginTop: 8 }} 
                                onClick={handleSubmit} 
                                disabled={saving}
                            >
                                <PlusCircle size={15} />
                                {saving ? 'Adding…' : 'Add Category'}
                            </button>
                        </div>
                    )}
                </div>

                <ProgressBar isProgress={loading || saving} />
        </NsLayout>
    );
};

export default Categories;
