import { useEffect, useState } from 'react';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getAllUsers } from '../services/api';
import { Search, Users, Mail, Phone, Shield, Power } from 'lucide-react';
import '../components/Layout.css';

const roleLabel = { 1: 'User', 2: 'Admin' };

const UserManager = () => {
    const [users, setUsers]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getAllUsers(res => {
            setLoading(false);
            if (res.code === 200) setUsers(res.users || []);
            else alert(res.message);
        });
    }, []);

    const filtered = users.filter(u =>
        u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <NsLayout title="User Manager" subtitle="View and search through registered workspace profiles">
                <header className="layout-header">
                    <div>
                        <h1 className="layout-title">User Manager</h1>
                        <p className="layout-subtitle">View and search through registered workspace profiles</p>
                    </div>
                </header>

                <div className="search-bar" style={{ marginBottom: 24 }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
                        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                        <input
                            type="text"
                            className="input"
                            style={{ paddingLeft: 40 }}
                            placeholder="Search users by name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="content-card">
                    <div className="content-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Users size={18} style={{ color: 'var(--primary)' }} />
                            <h2 className="content-card-title">All Workspace Members ({filtered.length})</h2>
                        </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ color: 'var(--text-3)', fontFamily: 'monospace' }}>#{u.id}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{u.fullname}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Mail size={13} style={{ opacity: 0.5 }} />
                                                <span>{u.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {u.phone ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Phone size={13} style={{ opacity: 0.5 }} />
                                                    <span>{u.phone}</span>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-3)', fontSize: '11px' }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${u.role === 2 ? 'badge-admin' : 'badge-user'}`}>
                                                <Shield size={10} style={{ marginRight: 2 }} />
                                                {roleLabel[u.role] || u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.status === 1 ? 'badge-active' : 'badge-error'}`}>
                                                <Power size={10} style={{ marginRight: 2 }} />
                                                {u.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filtered.length === 0 && !loading && (
                            <div className="empty-state">
                                <div className="empty-icon">👥</div>
                                <p>No users found matching "{search}"</p>
                            </div>
                        )}
                    </div>
                </div>

                <ProgressBar isProgress={loading} />
        </NsLayout>
    );
};

export default UserManager;
