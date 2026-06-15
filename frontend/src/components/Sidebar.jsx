import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, isAdmin } from '../services/api';
import {
  LayoutDashboard, Package, Tag, Settings,
  PlusCircle, Users, GitMerge, LogOut, ShoppingBag, Download, ShoppingCart, ClipboardList, User, Flag
} from 'lucide-react';
import './Sidebar.css';

const sharedItems = [
  { path: '/home',     label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/products', label: 'Products',  Icon: Package },
];

const userOnlyItems = [
  { path: '/cart',      label: 'My Cart',       Icon: ShoppingCart },
  { path: '/orders/my', label: 'My Orders',     Icon: ClipboardList },
  { path: '/report',    label: 'Report Issue',  Icon: Flag },
];

const adminItems = [
  { path: '/admin',                  label: 'Admin Panel',     Icon: Settings },
  { path: '/admin/products/add',     label: 'Add Product',     Icon: PlusCircle },
  { path: '/admin/products/import',  label: 'Import Products', Icon: Download },
  { path: '/admin/users',            label: 'Users',           Icon: Users },
  { path: '/admin/rolemapping',      label: 'Role Mapping',    Icon: GitMerge },
  { path: '/admin/orders',           label: 'Manage Orders',   Icon: ClipboardList },
  { path: '/admin/reports',          label: 'View Reports',    Icon: Flag },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const admin = isAdmin();
  const navItems = admin ? sharedItems : [...sharedItems, ...userOnlyItems];

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [dropdownOpen]);

  return (
    <>
      <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <ShoppingBag size={16} />
        </div>
        <span className="sidebar-brand-name">Product Catalog Application</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Navigation</p>
        {navItems.map(({ path, label, Icon }) => (
          <Link key={path} to={path}
            className={`sidebar-item ${location.pathname === path ? 'active' : ''}`}>
            <Icon size={15} />
            <span>{label}</span>
          </Link>
        ))}

        {admin && (
          <>
            <p className="sidebar-nav-label" style={{ marginTop: 20 }}>Admin</p>
            {adminItems.map(({ path, label, Icon }) => (
              <Link key={path} to={path}
                className={`sidebar-item ${location.pathname === path ? 'active' : ''}`}>
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={logout}>
        <LogOut size={14} />
        <span>Sign out</span>
      </button>
    </aside>

    {/* Global Profile Dropdown (Top-Right) */}
    <div className="global-profile-container">
      <div style={{ position: 'relative' }}>
        <button className="profile-avatar-btn" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}>
          <User size={18} />
        </button>
        {dropdownOpen && (
          <div className="profile-dropdown-menu" onClick={e => e.stopPropagation()}>
            <button className="profile-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
              <User size={14} />
              <span>My Profile</span>
            </button>
            {admin ? (
              <button className="profile-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/admin/orders'); }}>
                <ClipboardList size={14} />
                <span>Admin Orders</span>
              </button>
            ) : (
              <button className="profile-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/orders/my'); }}>
                <ClipboardList size={14} />
                <span>My Orders</span>
              </button>
            )}
            <button className="profile-dropdown-item logout-item" onClick={() => { setDropdownOpen(false); logout(); }} style={{ borderTop: '1px solid var(--border)' }}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </>
);
};

export default Sidebar;
