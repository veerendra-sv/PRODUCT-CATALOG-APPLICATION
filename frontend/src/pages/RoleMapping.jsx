import { useEffect, useState } from 'react';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import {
    getAllRoles, createRole,
    getAllMenus, createMenu,
    getAllMappings, createMapping, deleteMapping
} from '../services/api';
import { Key, ListCollapse, Link2, Plus, Trash2, Shield, Settings, Menu } from 'lucide-react';
import '../components/Layout.css';

const RoleMapping = () => {
    const [roles, setRoles]       = useState([]);
    const [menus, setMenus]       = useState([]);
    const [mappings, setMappings] = useState([]);
    const [loading, setLoading]   = useState(true);

    // Forms
    const [roleForm, setRoleForm] = useState({ role: '', rolename: '' });
    const [menuForm, setMenuForm] = useState({ mid: '', menu: '', icon: '' });
    const [mapForm,  setMapForm]  = useState({ role: '', mid: '' });

    const loadAll = () => {
        let done = 0;
        const finish = () => { if (++done === 3) setLoading(false); };
        getAllRoles(res    => { if (res.code === 200) setRoles(res.roles || []);       finish(); });
        getAllMenus(res    => { if (res.code === 200) setMenus(res.menus || []);       finish(); });
        getAllMappings(res => { if (res.code === 200) setMappings(res.mappings || []); finish(); });
    };

    useEffect(() => { loadAll(); }, []);

    // ── Add Role ──────────────────────────────────────────────────────────────
    const handleAddRole = () => {
        if (!roleForm.role || !roleForm.rolename.trim()) { alert('Fill in both fields.'); return; }
        createRole({ role: parseInt(roleForm.role), rolename: roleForm.rolename }, res => {
            if (res.code === 200) { setRoleForm({ role: '', rolename: '' }); loadAll(); }
            else alert(res.message);
        });
    };

    // ── Add Menu ──────────────────────────────────────────────────────────────
    const handleAddMenu = () => {
        if (!menuForm.mid || !menuForm.menu.trim()) { alert('Fill in ID and Menu name.'); return; }
        createMenu({ mid: parseInt(menuForm.mid), menu: menuForm.menu, icon: menuForm.icon }, res => {
            if (res.code === 200) { setMenuForm({ mid: '', menu: '', icon: '' }); loadAll(); }
            else alert(res.message);
        });
    };

    // ── Add Mapping ───────────────────────────────────────────────────────────
    const handleAddMapping = () => {
        if (!mapForm.role || !mapForm.mid) { alert('Select both role and menu.'); return; }
        createMapping({ role: parseInt(mapForm.role), mid: parseInt(mapForm.mid) }, res => {
            if (res.code === 200) { setMapForm({ role: '', mid: '' }); loadAll(); }
            else alert(res.message);
        });
    };

    // ── Delete Mapping ────────────────────────────────────────────────────────
    const handleDeleteMapping = (role, mid) => {
        if (!window.confirm('Remove this mapping?')) return;
        deleteMapping({ role, mid }, res => {
            if (res.code === 200) loadAll();
            else alert(res.message);
        });
    };

    // ── Find names ────────────────────────────────────────────────────────────
    const roleName = id => roles.find(r => r.role === id)?.rolename || id;
    const menuName = id => menus.find(m => m.mid === id)?.menu || id;

    return (
        <NsLayout title="Role Mapping" subtitle="Configure authorization matrices, platform navigation menus, and permissions">
                <header className="layout-header">
                    <div>
                        <h1 className="layout-title">Role Mapping</h1>
                        <p className="layout-subtitle">Configure authorization matrices, platform navigation menus, and permissions</p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>

                    {/* ── Roles ───────────────────────────────────── */}
                    <div className="content-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div className="content-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Key size={18} style={{ color: 'var(--primary)' }} />
                                <h2 className="content-card-title">Roles System</h2>
                            </div>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto', maxH: '250px' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Role Code</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map(r => (
                                        <tr key={r.role}>
                                            <td style={{ color: 'var(--text-3)', fontFamily: 'monospace' }}>#{r.role}</td>
                                            <td>
                                                <span className={`badge ${r.role === 2 ? 'badge-admin' : 'badge-user'}`}>
                                                    <Shield size={10} style={{ marginRight: 2 }} />
                                                    {r.rolename}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div style={{ padding: 20, borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10, marginBottom: 12 }}>
                                <input 
                                    className="input" 
                                    type="number" 
                                    placeholder="ID" 
                                    value={roleForm.role}
                                    onChange={e => setRoleForm(p => ({ ...p, role: e.target.value }))} 
                                />
                                <input 
                                    className="input" 
                                    placeholder="e.g. ROLE_MANAGER" 
                                    value={roleForm.rolename}
                                    onChange={e => setRoleForm(p => ({ ...p, rolename: e.target.value }))} 
                                />
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddRole}>
                                <Plus size={14} /> Add Role
                            </button>
                        </div>
                    </div>

                    {/* ── Menus ───────────────────────────────────── */}
                    <div className="content-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div className="content-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <ListCollapse size={18} style={{ color: 'var(--accent)' }} />
                                <h2 className="content-card-title">Navigation Menus</h2>
                            </div>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto', maxH: '250px' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Menu Item</th>
                                        <th>Icon Tag</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menus.map(m => (
                                        <tr key={m.mid}>
                                            <td style={{ color: 'var(--text-3)', fontFamily: 'monospace' }}>#{m.mid}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{m.menu}</td>
                                            <td>
                                                <span style={{ fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>
                                                    {m.icon || '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div style={{ padding: 20, borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 100px', gap: 10, marginBottom: 12 }}>
                                <input 
                                    className="input" 
                                    type="number" 
                                    placeholder="ID" 
                                    value={menuForm.mid}
                                    onChange={e => setMenuForm(p => ({ ...p, mid: e.target.value }))} 
                                />
                                <input 
                                    className="input" 
                                    placeholder="Menu title e.g. Billing" 
                                    value={menuForm.menu}
                                    onChange={e => setMenuForm(p => ({ ...p, menu: e.target.value }))} 
                                />
                                <input 
                                    className="input" 
                                    placeholder="Icon (e.g. Settings)" 
                                    value={menuForm.icon}
                                    onChange={e => setMenuForm(p => ({ ...p, icon: e.target.value }))} 
                                />
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddMenu}>
                                <Plus size={14} /> Add Menu
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Role ↔ Menu Mappings ────────────────────────────────────── */}
                <div className="content-card">
                    <div className="content-card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Link2 size={18} style={{ color: 'var(--primary)' }} />
                            <h2 className="content-card-title">Permissions & Menu Visibility Matrix</h2>
                        </div>
                        
                        {/* Add mapping form */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                            <select 
                                className="input" 
                                style={{ width: 180 }} 
                                value={mapForm.role}
                                onChange={e => setMapForm(p => ({ ...p, role: e.target.value }))}
                            >
                                <option value="">— Select Role —</option>
                                {roles.map(r => <option key={r.role} value={r.role}>{r.rolename}</option>)}
                            </select>
                            
                            <select 
                                className="input" 
                                style={{ width: 180 }} 
                                value={mapForm.mid}
                                onChange={e => setMapForm(p => ({ ...p, mid: e.target.value }))}
                            >
                                <option value="">— Select Menu —</option>
                                {menus.map(m => <option key={m.mid} value={m.mid}>{m.menu}</option>)}
                            </select>
                            
                            <button className="btn btn-primary" onClick={handleAddMapping}>
                                <Plus size={14} /> Map Access
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Role Name</th>
                                    <th>Menu Authorized</th>
                                    <th style={{ width: 120, textTransform: 'uppercase', fontSize: 10 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mappings.map((m, i) => (
                                    <tr key={i}>
                                        <td>
                                            <span className={`badge ${m.role === 2 ? 'badge-admin' : 'badge-user'}`}>
                                                <Shield size={10} style={{ marginRight: 2 }} />
                                                {roleName(m.role)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--text-1)' }}>
                                                <Menu size={14} style={{ opacity: 0.5 }} />
                                                {menuName(m.mid)}
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDeleteMapping(m.role, m.mid)}
                                            >
                                                <Trash2 size={12} />
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {mappings.length === 0 && !loading && (
                            <div className="empty-state">
                                <p>No role to menu permissions mapped yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <ProgressBar isProgress={loading} />
        </NsLayout>
    );
};

export default RoleMapping;
