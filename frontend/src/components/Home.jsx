import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout, isAdmin } from '../services/api';
import { getUinfo } from '../services/api';
import {
  Search, ShoppingCart, Heart, User, Truck, ShieldCheck, Headphones,
  Star, ChevronRight, Phone, Mail, MapPin, Clock, ArrowRight,
  Package, Tag, Settings, PlusCircle, Users, GitMerge,
  ClipboardList, Download, ShoppingBag, LogOut, LayoutDashboard, Menu, X, Flag
} from 'lucide-react';
import ProgressBar from './ProgressBar';
import '../components/Home.css';

/* ─────────────── ANNOUNCEMENT MESSAGES ─────────────── */
const PROMOS = [
  { icon: '🎁', text: '20% off on your first order' },
  { icon: '🚚', text: 'Free shipping on orders over ₹999' },
  { icon: '💰', text: '30 days money back guarantee' },
];

/* ─────────────── NAV ITEMS ─────────────── */
const sharedItems = [
  { path: '/home',     label: 'Home',      Icon: LayoutDashboard },
  { path: '/products', label: 'Products',  Icon: Package },
];
const userOnlyItems = [
  { path: '/cart',      label: 'My Cart',    Icon: ShoppingCart },
  { path: '/orders/my', label: 'My Orders',  Icon: ClipboardList },
  { path: '/report',    label: 'Report',     Icon: Flag },
];
const adminItems = [
  { path: '/admin',                 label: 'Admin Panel',    Icon: Settings },
  { path: '/admin/products/add',    label: 'Add Product',    Icon: PlusCircle },
  { path: '/admin/products/import', label: 'Import',         Icon: Download },
  { path: '/admin/users',           label: 'Users',          Icon: Users },
  { path: '/admin/rolemapping',     label: 'Role Mapping',   Icon: GitMerge },
  { path: '/admin/orders',          label: 'Orders',         Icon: ClipboardList },
  { path: '/admin/reports',         label: 'View Reports',   Icon: Flag },
];

/* ─────────────── CATEGORIES ─────────────── */
const CATEGORIES = [
  {
    name: 'Gaming', target: 'Gaming', count: '126 products', color: '#dbeafe',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  },
  {
    name: 'Mobiles', target: 'Smartphones', count: '84 products', color: '#fce7f3',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  },
  {
    name: 'Laptops', target: 'Laptops', count: '63 products', color: '#d1fae5',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  },
  {
    name: 'Audio', target: 'Audio Devices', count: '48 products', color: '#fef3c7',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  },
  {
    name: 'Smart Watches', target: 'Smart Watches', count: '37 products', color: '#ede9fe',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  },
  {
    name: 'Accessories', target: 'Accessories', count: '92 products', color: '#ffedd5',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  },
];

/* ─────────────── FEATURED PRODUCTS ─────────────── */
const PRODUCTS = [
  {
    id: 1, name: 'Premium Wireless Earbuds', cat: 'AUDIO',
    price: '₹4,999', oldPrice: '₹7,999', rating: 4.8, reviews: 324,
    badge: 'SALE', badgeType: 'sale',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
    colors: ['#111','#e5e7eb','#3b82f6'],
  },
  {
    id: 2, name: 'Ultra-thin Laptop Pro 14"', cat: 'LAPTOPS',
    price: '₹54,999', oldPrice: null, rating: 4.9, reviews: 156,
    badge: 'NEW', badgeType: 'new',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
    colors: ['#6b7280','#f3f4f6','#1f2937'],
  },
  {
    id: 3, name: 'Smart Watch Series X', cat: 'SMART WATCHES',
    price: '₹12,999', oldPrice: '₹16,999', rating: 4.7, reviews: 298,
    badge: '25% OFF', badgeType: 'sale',
    img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80',
    colors: ['#111','#b45309','#be185d'],
  },
  {
    id: 4, name: 'Gaming Smartphone Pro', cat: 'MOBILES',
    price: '₹39,999', oldPrice: null, rating: 4.9, reviews: 542,
    badge: 'HOT', badgeType: 'hot',
    img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80',
    colors: ['#111','#1d4ed8','#7c3aed'],
  },
  {
    id: 5, name: 'Noise-Canceling Headphones', cat: 'AUDIO',
    price: '₹7,999', oldPrice: '₹11,999', rating: 4.8, reviews: 289,
    badge: 'SALE', badgeType: 'sale',
    img: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=400&q=80',
    colors: ['#111','#f5f5f5','#9ca3af'],
  },
  {
    id: 6, name: 'Smart Speaker Mini', cat: 'ELECTRONICS',
    price: '₹2,499', oldPrice: '₹3,499', rating: 4.6, reviews: 178,
    badge: null, badgeType: null,
    img: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&q=80',
    colors: ['#111','#6b7280','#3b82f6'],
  },
  {
    id: 7, name: 'Mechanical Keyboard RGB', cat: 'ELECTRONICS',
    price: '₹8,499', oldPrice: '₹10,999', rating: 4.7, reviews: 412,
    badge: 'LIMITED', badgeType: 'new',
    img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80',
    colors: ['#111','#ef4444','#3b82f6'],
  },
  {
    id: 8, name: '4K Action Camera Pro', cat: 'ELECTRONICS',
    price: '₹19,999', oldPrice: '₹24,999', rating: 4.8, reviews: 203,
    badge: 'TRENDING', badgeType: 'hot',
    img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
    colors: ['#111','#f59e0b','#10b981'],
  },
];

/* ─────────────── HERO PRODUCTS ─────────────── */
const HERO_PRODUCTS = [
  {
    name: 'Premium Wireless Headphones',
    price: '₹7,999',
    oldPrice: '₹12,999',
    badge: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    name: 'Ultra-thin Laptop Pro 14"',
    price: '₹54,999',
    oldPrice: '₹64,999',
    badge: 'New Arrival',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80',
  },
  {
    name: 'Smart Watch Series X',
    price: '₹12,999',
    oldPrice: '₹16,999',
    badge: '25% Off',
    img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
  },
  {
    name: 'Noise-Canceling Headphones',
    price: '₹7,999',
    oldPrice: '₹11,999',
    badge: 'Trending',
    img: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=500&q=80',
  }
];

/* ═══════════════════════════════════════════════════════
   MAIN HOME COMPONENT
═══════════════════════════════════════════════════════ */
const Home = () => {
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [promoIdx, setPromoIdx]       = useState(0);
  const [mobileNav, setMobileNav]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const admin     = isAdmin();
  const navItems  = admin ? sharedItems : [...sharedItems, ...userOnlyItems];

  const [heroIdx, setHeroIdx] = useState(0);

  /* rotate promo bar */
  useEffect(() => {
    const t = setInterval(() => setPromoIdx(i => (i + 1) % PROMOS.length), 3000);
    return () => clearInterval(t);
  }, []);

  /* rotate hero products automatically */
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_PRODUCTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* auth check */
  useEffect(() => {
    getUinfo(res => {
      setLoading(false);
      if (res.code !== 200) { localStorage.clear(); navigate('/'); }
    });
  }, [navigate]);

  /* close profile on outside click */
  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [profileOpen]);

  const handleSearch = (q = searchQuery) => {
    if (q.trim()) navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="home-page">

      {/* ── 1. ANNOUNCEMENT BAR ─────────────────────── */}
      <div className="ns-topbar">
        <div className="ns-topbar-left">
          <Phone size={13} />
          <span>Need help? Call us: +91 98765 43210</span>
        </div>
        <div className="ns-topbar-center" key={promoIdx}>
          <span>{PROMOS[promoIdx].icon}</span>
          <span>{PROMOS[promoIdx].text}</span>
        </div>
        <div className="ns-topbar-right">
          <span>EN</span>
          <span>|</span>
          <span>₹ INR</span>
        </div>
      </div>

      {/* ── 2. HEADER (Logo + Search + Actions) ─────── */}
      <header className="ns-header">
        <Link to="/home" className="ns-logo">Product<span style={{color:'#0d6efd'}}>Shop</span></Link>

        <div className="ns-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="ns-search-btn" onClick={() => handleSearch()}>
            <Search size={18} />
          </button>
        </div>

        <div className="ns-header-actions">
          <div
            className="ns-header-icon"
            style={{position:'relative'}}
            onClick={e => { e.stopPropagation(); setProfileOpen(o => !o); }}
          >
            <User size={22} />
            <span>Account</span>
            {profileOpen && (
              <div className="ns-profile-dropdown" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setProfileOpen(false); navigate('/profile'); }}>
                  <User size={14}/> My Profile
                </button>
                {admin ? (
                  <button onClick={() => { setProfileOpen(false); navigate('/admin/orders'); }}>
                    <ClipboardList size={14}/> Admin Orders
                  </button>
                ) : (
                  <button onClick={() => { setProfileOpen(false); navigate('/orders/my'); }}>
                    <ClipboardList size={14}/> My Orders
                  </button>
                )}
                {!admin && (
                  <button onClick={() => { setProfileOpen(false); navigate('/report'); }}>
                    <Flag size={14}/> Report Issue
                  </button>
                )}
                <button className="ns-dropdown-logout" onClick={() => { setProfileOpen(false); logout(); }}>
                  <LogOut size={14}/> Sign Out
                </button>
              </div>
            )}
          </div>

          {!admin && (
            <Link to="/cart" className="ns-header-icon">
              <div style={{position:'relative'}}>
                <Heart size={22} />
              </div>
              <span>Wishlist</span>
            </Link>
          )}

          {!admin && (
            <Link to="/cart" className="ns-header-icon">
              <div style={{position:'relative'}}>
                <ShoppingCart size={22} />
                <span className="ns-badge">0</span>
              </div>
              <span>Cart</span>
            </Link>
          )}

          <button className="ns-mobile-menu-btn" onClick={() => setMobileNav(o => !o)}>
            {mobileNav ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </header>

      {/* ── 3. BLACK NAVIGATION BAR ──────────────────── */}
      <nav className="ns-navbar">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`ns-nav-item ${isActive(path) ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
        {admin && adminItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`ns-nav-item ${isActive(path) ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
        <button className="ns-nav-logout" onClick={logout}>
          <LogOut size={14}/> Sign Out
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileNav && (
        <div className="ns-mobile-nav">
          {[...navItems, ...(admin ? adminItems : [])].map(({ path, label, Icon }) => (
            <Link
              key={path}
              to={path}
              className={`ns-mobile-nav-item ${isActive(path) ? 'active' : ''}`}
              onClick={() => setMobileNav(false)}
            >
              <Icon size={16}/> {label}
            </Link>
          ))}
          <button className="ns-mobile-logout" onClick={logout}>
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      )}

      {/* ── 4. HERO SECTION ──────────────────────────── */}
      <section className="ns-hero">
        <div className="ns-hero-left">
          <div className="ns-hero-tag">
            🛍️ &nbsp;LIMITED TIME OFFER
          </div>
          <h1 className="ns-hero-title">
            Discover Amazing<br />Products
          </h1>
          <p className="ns-hero-subtitle">
            Explore our curated collection of premium items designed to
            enhance your lifestyle. From tech to appliances, find everything
            you need with exclusive deals and fast shipping.
          </p>
          <div className="ns-hero-btns">
            <button className="ns-btn-dark" onClick={() => navigate('/products')}>
              Shop Now <ArrowRight size={16}/>
            </button>
            <button className="ns-btn-outline" onClick={() => navigate('/products')}>
              Browse Categories
            </button>
          </div>
          <div className="ns-hero-features">
            <div className="ns-hero-feature"><Truck size={17}/> Free Shipping</div>
            <div className="ns-hero-feature"><ShieldCheck size={17}/> Quality Guarantee</div>
            <div className="ns-hero-feature"><Headphones size={17}/> 24/7 Support</div>
          </div>
        </div>

        <div className="ns-hero-right">
          <div className="ns-hero-card-container">
            <div className={`ns-hero-glow-blob color-theme-${heroIdx}`} />
            <div className="ns-hero-product-card" key={heroIdx} onClick={() => navigate('/products')}>
              <span className="ns-hero-product-badge">{HERO_PRODUCTS[heroIdx].badge}</span>
              <img
                src={HERO_PRODUCTS[heroIdx].img}
                alt={HERO_PRODUCTS[heroIdx].name}
                className="ns-hero-product-img"
                onError={e => { e.target.style.display='none'; }}
              />
              <div className="ns-hero-product-info">
                <div className="ns-hero-product-name">{HERO_PRODUCTS[heroIdx].name}</div>
                <div>
                  <span className="ns-hero-product-price">{HERO_PRODUCTS[heroIdx].price}</span>
                  {HERO_PRODUCTS[heroIdx].oldPrice && (
                    <span className="ns-hero-product-old">{HERO_PRODUCTS[heroIdx].oldPrice}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="ns-hero-dots">
              {HERO_PRODUCTS.map((_, idx) => (
                <button
                  key={idx}
                  className={`ns-hero-dot ${heroIdx === idx ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setHeroIdx(idx); }}
                  aria-label={`Go to product ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FEATURES STRIP ───────────────────────── */}
      <div className="ns-features-strip">
        <div className="ns-feature-item">
          <Truck size={22}/>
          <span className="ns-feature-label">Free Shipping</span>
        </div>
        <div className="ns-feature-divider"/>
        <div className="ns-feature-item">
          <ShieldCheck size={22}/>
          <span className="ns-feature-label">Quality Guarantee</span>
        </div>
        <div className="ns-feature-divider"/>
        <div className="ns-feature-item">
          <Headphones size={22}/>
          <span className="ns-feature-label">24/7 Support</span>
        </div>
        <div className="ns-feature-divider"/>
        <div className="ns-feature-item">
          <ShoppingBag size={22}/>
          <span className="ns-feature-label">Easy Returns</span>
        </div>
      </div>

      {/* ── 6. SEARCH SECTION ───────────────────────── */}
      <section className="ns-search-section">
        <div className="ns-search-inner">
          <h2 className="ns-search-section-title">AI-Powered Product Search</h2>
          <p className="ns-search-section-sub">Search in plain English — find exactly what you need</p>
          <div className="ns-search-bar">
            <input
              type="text"
              placeholder='Try "best phone under ₹20000" or "wireless earbuds for gym"'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()}>
              <Search size={16}/> Search
            </button>
          </div>
          <div className="ns-chips-row">
            {['Best Phones','Gaming Laptops','Smart Watches','Wireless Earbuds','Budget Mobiles','Bluetooth Speakers'].map(label => (
              <button key={label} className="ns-chip" onClick={() => handleSearch(label)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CATEGORIES ───────────────────────────── */}
      <section className="ns-section">
        <div className="ns-section-header">
          <h2 className="ns-section-title">Shop by Category</h2>
          <div className="ns-section-divider"/>
          <p className="ns-section-subtitle">Browse our wide selection of product categories</p>
        </div>
        <div className="ns-categories-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="ns-category-card"
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.target || cat.name)}`)}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="ns-category-img"
                onError={e => { e.target.parentElement.style.background = cat.color; e.target.style.display = 'none'; }}
              />
              <div className="ns-category-overlay"/>
              <div className="ns-category-info">
                <div className="ns-category-name">{cat.name}</div>
                <div className="ns-category-count">{cat.count}</div>
                <span className="ns-category-link">Shop Now <ChevronRight size={14}/></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. FEATURED PRODUCTS ────────────────────── */}
      <section className="ns-section ns-section-bg">
        <div className="ns-section-header">
          <h2 className="ns-section-title">Best Sellers</h2>
          <div className="ns-section-divider"/>
          <p className="ns-section-subtitle">Our most popular products loved by thousands of customers</p>
        </div>
        <div className="ns-products-grid">
          {PRODUCTS.map(p => (
            <div
              key={p.id}
              className="ns-product-card"
              onClick={() => navigate('/products')}
            >
              {p.badge && (
                <span className={`ns-product-badge ns-badge-${p.badgeType}`}>{p.badge}</span>
              )}

              <div className="ns-product-img-wrap">
                <img
                  src={p.img}
                  alt={p.name}
                  className="ns-product-img"
                  onError={e => { e.target.style.display='none'; }}
                />
                <button className="ns-product-add-bar" onClick={e => { e.stopPropagation(); navigate('/products'); }}>
                  Add to Cart
                </button>
              </div>

              <div className="ns-product-info">
                <div className="ns-product-cat">{p.cat}</div>
                <div className="ns-product-name">{p.name}</div>
                <div className="ns-product-stars">
                  <div className="ns-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill={i < Math.floor(p.rating) ? '#ffc107' : 'none'} color="#ffc107"/>
                    ))}
                  </div>
                  <span className="ns-review-count">({p.reviews})</span>
                </div>
                <div className="ns-product-footer">
                  <div>
                    <span className="ns-product-price">{p.price}</span>
                    {p.oldPrice && <span className="ns-product-price-old">{p.oldPrice}</span>}
                  </div>
                </div>
                <div className="ns-swatches">
                  {p.colors.map(c => (
                    <span key={c} className="ns-swatch" style={{background: c}}/>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center', marginTop: 40}}>
          <button className="ns-btn-outline" onClick={() => navigate('/products')}>
            View All Products <ArrowRight size={16}/>
          </button>
        </div>
      </section>

      {/* ── 9. DARK FOOTER ──────────────────────────── */}
      <footer className="ns-footer">
        <div className="ns-footer-grid">
          <div>
            <span className="ns-footer-brand">Product<span style={{color:'#0d6efd'}}>Shop</span></span>
            <p className="ns-footer-desc">
              Your one-stop destination for premium tech products. We offer the best brands
              at competitive prices with fast shipping and excellent customer service.
            </p>
            <div style={{marginBottom: 8, color: 'rgba(255,255,255,0.55)', fontSize: 13}}>Connect With Us</div>
            <div className="ns-social-row">
              {['f','in','tw','yt'].map(s => (
                <a key={s} href="#" className="ns-social-btn" onClick={e => e.preventDefault()}>
                  <span style={{fontSize:12, fontWeight:700}}>{s}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="ns-footer-heading">Shop</div>
            <ul className="ns-footer-links">
              {['New Arrivals','Best Sellers','Electronics','Mobiles','Laptops','Accessories','Sale'].map(l => (
                <li key={l}><a href="#" onClick={e => { e.preventDefault(); navigate('/products'); }}>→ {l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ns-footer-heading">Support</div>
            <ul className="ns-footer-links">
              {['Help Center','Order Status','Shipping Info','Returns & Exchanges','Size Guide','Contact Us'].map(l => (
                <li key={l}><a href="#">→ {l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ns-footer-heading">Contact Information</div>
            <div className="ns-footer-contact-item">
              <MapPin size={15}/> 123 MG Road, Bangalore, Karnataka 560001
            </div>
            <div className="ns-footer-contact-item">
              <Phone size={15}/> +91 98765 43210
            </div>
            <div className="ns-footer-contact-item">
              <Mail size={15}/> support@productshop.in
            </div>
            <div className="ns-footer-contact-item">
              <Clock size={15}/> Mon–Sat: 9am–6pm
            </div>
          </div>
        </div>
        <div className="ns-footer-bottom">
          <p className="ns-footer-copy">
            © 2026 <strong>ProductShop</strong>. All Rights Reserved.
          </p>
          <div style={{display:'flex', gap:16}}>
            <a href="#" style={{color:'rgba(255,255,255,0.4)', fontSize:12, textDecoration:'none'}}>Terms</a>
            <a href="#" style={{color:'rgba(255,255,255,0.4)', fontSize:12, textDecoration:'none'}}>Privacy</a>
            <a href="#" style={{color:'rgba(255,255,255,0.4)', fontSize:12, textDecoration:'none'}}>Cookies</a>
          </div>
        </div>
      </footer>

      <ProgressBar isProgress={loading}/>
    </div>
  );
};

export default Home;
