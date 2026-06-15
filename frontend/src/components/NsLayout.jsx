import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, isAdmin } from '../services/api';
import {
  Search, ShoppingCart, Heart, User, Phone,
  Settings, PlusCircle, Users, GitMerge,
  ClipboardList, Download, LogOut, LayoutDashboard,
  Package, Menu, X, Flag
} from 'lucide-react';
import './NsLayout.css';

const sharedItems = [
  { path: '/home',     label: 'Home' },
  { path: '/products', label: 'Products' },
];
const userOnlyItems = [
  { path: '/cart',      label: 'My Cart' },
  { path: '/orders/my', label: 'My Orders' },
  { path: '/report',    label: 'Report Issue' },
];
const adminItems = [
  { path: '/admin',                 label: 'Admin Panel' },
  { path: '/admin/products/add',    label: 'Add Product' },
  { path: '/admin/products/import', label: 'Import' },
  { path: '/admin/users',           label: 'Users' },
  { path: '/admin/rolemapping',     label: 'Role Mapping' },
  { path: '/admin/orders',          label: 'Orders' },
  { path: '/admin/reports',         label: 'View Reports' },
];

const PROMOS = [
  { icon: '🎁', text: '20% off on your first order' },
  { icon: '🚚', text: 'Free shipping on orders over ₹999' },
  { icon: '💰', text: '30 days money back guarantee' },
];

const NsLayout = ({ children, title, subtitle }) => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const admin     = isAdmin();
  const navItems  = admin ? sharedItems : [...sharedItems, ...userOnlyItems];

  const [search,      setSearch]      = useState('');
  const [promoIdx,    setPromoIdx]    = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPromoIdx(i => (i + 1) % PROMOS.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [profileOpen]);

  const handleSearch = (q = search) => {
    if (q.trim()) navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const isActive = path => location.pathname === path;

  return (
    <div className="nsl-root">

      {/* ── Header ───────────────────────────────────── */}
      <header className="nsl-header">
        <Link to="/home" className="nsl-logo">
          Product<span>Shop</span>
        </Link>

        <div className="nsl-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="nsl-search-btn" onClick={() => handleSearch()}>
            <Search size={17}/>
          </button>
        </div>

        <div className="nsl-header-actions">
          <div
            className="nsl-hicon"
            style={{ position: 'relative' }}
            onClick={e => { e.stopPropagation(); setProfileOpen(o => !o); }}
          >
            <div className="nsl-icon-wrap">
              <User size={21}/>
            </div>
            <span>Account</span>
            {profileOpen && (
              <div className="nsl-profile-drop" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setProfileOpen(false); navigate('/profile'); }}>
                  <User size={13}/> My Profile
                </button>
                {admin
                  ? <button onClick={() => { setProfileOpen(false); navigate('/admin/orders'); }}><ClipboardList size={13}/> Admin Orders</button>
                  : <button onClick={() => { setProfileOpen(false); navigate('/orders/my'); }}><ClipboardList size={13}/> My Orders</button>
                }
                {!admin && (
                  <button onClick={() => { setProfileOpen(false); navigate('/report'); }}>
                    <Flag size={13}/> Report Issue
                  </button>
                )}
                <button className="nsl-drop-logout" onClick={() => { setProfileOpen(false); logout(); }}>
                  <LogOut size={13}/> Sign Out
                </button>
              </div>
            )}
          </div>

          {!admin && (
            <Link to="/cart" className="nsl-hicon">
              <div className="nsl-icon-wrap">
                <Heart size={21}/>
              </div>
              <span>Wishlist</span>
            </Link>
          )}

          {!admin && (
            <Link to="/cart" className="nsl-hicon">
              <div className="nsl-icon-wrap" style={{ position: 'relative' }}>
                <ShoppingCart size={21}/>
                <span className="nsl-badge">0</span>
              </div>
              <span>Cart</span>
            </Link>
          )}

          <button className="nsl-hamburger" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </header>

      {/* ── Black Navbar ─────────────────────────────── */}
      <nav className="nsl-navbar">
        {navItems.map(({ path, label }) => (
          <Link key={path} to={path} className={`nsl-nav-item ${isActive(path) ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
        {admin && adminItems.map(({ path, label }) => (
          <Link key={path} to={path} className={`nsl-nav-item ${isActive(path) ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
        <button className="nsl-nav-logout" onClick={logout}>
          <LogOut size={14}/> Sign Out
        </button>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="nsl-mobile-nav">
          {[...navItems, ...(admin ? adminItems : [])].map(({ path, label }) => (
            <Link key={path} to={path} className={`nsl-mob-item ${isActive(path) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <button className="nsl-mob-logout" onClick={logout}><LogOut size={14}/> Sign Out</button>
        </div>
      )}

      {/* ── Page Content ────────────────────────────── */}
      <main className="nsl-main">
        {(title || subtitle) && (
          <div className="nsl-page-header">
            {title    && <h1 className="nsl-page-title">{title}</h1>}
            {subtitle && <p  className="nsl-page-sub">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="nsl-footer">
        <div className="nsl-footer-inner">
          <span className="nsl-footer-logo">Product<span>Shop</span></span>
          <p className="nsl-footer-copy">© 2026 ProductShop. All Rights Reserved.</p>
          <div className="nsl-footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NsLayout;
