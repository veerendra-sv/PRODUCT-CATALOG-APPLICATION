import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isLoggedIn } from '../services/api';
import {
  Menu, X, Check, ArrowRight, Shield, Zap, Laptop, Phone,
  ShoppingCart, Database, RefreshCw, BarChart3, Users, Package,
  ListCollapse, MapPin, Mail, Clock
} from 'lucide-react';
import './LandingPage.css';

const TABS = [
  {
    id: 'catalog',
    label: 'Storefront Catalog',
    Icon: Package,
    title: 'Dynamic Storefront & Product Catalog',
    desc: 'Browse, filter, and discover products instantly with our reactive search and category sidebar. Showcase high-quality items complete with color swatches, rating stars, and pricing details.',
    checks: [
      'Sub-millisecond query filtering',
      'Interactive category navigation chips',
      'Visual swatches and star rating counts',
      'One-click add to cart shortcuts'
    ],
    image: '/home_page.png',
    statVal: '< 8ms',
    statLbl: 'Query Search latency'
  },
  {
    id: 'rbac',
    label: 'Role Mapping Grid',
    Icon: GitMergeIcon,
    title: 'Granular Role Mapping & Access Control',
    desc: 'Protect system parameters dynamically. Configure visibility metrics, platform navigation authorization mapping, and backend API routes access rules directly from the Admin visibility control grid.',
    checks: [
      'Dynamic permission matrix mapping',
      'JWT payload token validation',
      'Administrative menu control checks',
      'Secure ProtectedRoute wrappers'
    ],
    image: '/rolemapping_page.png',
    statVal: '100%',
    statLbl: 'RBAC Enforcement'
  },
  {
    id: 'cart',
    label: 'Shopping Cart & Orders',
    Icon: ShoppingCart,
    title: 'Frictionless Cart & Cash Checkout',
    desc: 'Add products, update checkout counts, and review aggregated pricing. Inquire transactions instantly using our cash-on-delivery pickup order placement structure.',
    checks: [
      'Instant subtotal price computation',
      'Quantity selector increments',
      'Modal checkout order confirmations',
      'Interactive customer orders tracker'
    ],
    image: '/cart_page.png',
    statVal: 'COD',
    statLbl: 'Default Checkout Method'
  },
  {
    id: 'auth',
    label: 'Security Gateway',
    Icon: Shield,
    title: 'Redesigned Minimalist Security Gateway',
    desc: 'Login and signup using our sleek, high-contrast monochrome gateway. Features custom security roles selection (User vs. Admin), robust inputs validation indicators, and token persistence.',
    checks: [
      'Monochrome credentials panels',
      'Role-based sign up toggles',
      'Clients validate state indicators',
      'Token-secured gateway entry paths'
    ],
    image: '/login_page.png',
    statVal: 'OAuth 2.0',
    statLbl: 'Auth Standards'
  }
];

function GitMergeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 15V9a4 4 0 0 0-4-4H9" />
      <path d="M6 9v6" />
    </svg>
  );
}

const SERVICES = [
  { Icon: Package, title: 'Storefront Catalog', desc: 'Browse products instantly with responsive search indices and category filters.' },
  { Icon: Users, title: 'RBAC Role Mapping', desc: 'Manage access matrices, authorize visibility endpoints, and register roles.' },
  { Icon: ListCollapse, title: 'Category Manager', desc: 'Add, update, and categorize inventory records cleanly from the dashboard.' },
  { Icon: ShoppingCart, title: 'Checkout & Orders', desc: 'Verify store cart subtotals and check out using integrated store pickup queues.' }
];

const FAQS = [
  {
    num: '01',
    q: 'How does the admin Role Mapping dashboard work?',
    a: 'Role Mapping connects role codes (like Administrator or User) to navigational menu visibility rules. Admins can select roles and menus to grant visibility dynamically, immediately updating navigation options.'
  },
  {
    num: '02',
    q: 'How can I import products in bulk?',
    a: 'Navigate to the Bulk Import tool as an Admin. You can trigger an auto-import of test products, upload local schema-aligned CSV logs, or click to fetch and seed 100+ items directly from the DummyJSON API.'
  },
  {
    num: '03',
    q: 'Are cart subtotals calculated securely?',
    a: 'Yes! Cart subtotals, item aggregates, and shipping validations are calculated dynamically on the backend and mapped to the frontend interface to prevent client-side data tampering.'
  },
  {
    num: '04',
    q: 'What is the default payment method?',
    a: 'To simplify deployment, Cash on Delivery (COD) / Store Pickup is the integrated method, enabling direct order logging without requiring external payment integrations.'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tabActive, setTabActive] = useState('catalog');
  const [faqOpen, setFaqOpen] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const authenticated = isLoggedIn();

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${contactForm.name}, your message has been sent successfully!`);
    setContactForm({ name: '', email: '', message: '' });
  };

  const currentTab = TABS.find(t => t.id === tabActive);

  return (
    <div className="lp-root">
      {/* ── Navbar ──────────────────────────────────────── */}
      <header className="lp-header">
        <Link to="/" className="lp-logo">
          Product<span>Shop</span>
        </Link>
        <nav className="lp-nav">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#services" className="lp-nav-link">Services</a>
          <a href="#faq" className="lp-nav-link">FAQs</a>
          <a href="#contact" className="lp-nav-link">Contact</a>
        </nav>
        <div className="lp-header-actions">
          {authenticated ? (
            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/home')}>
              Go to Catalog Shop <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button className="lp-btn lp-btn-outline" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')}>
                Get Started
              </button>
            </>
          )}
          <button className="lp-hamburger" onClick={() => setMobileMenu(o => !o)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile nav dropdown */}
      <div className={`lp-mobile-nav ${mobileMenu ? 'open' : ''}`}>
        <a href="#features" className="lp-mobile-nav-link" onClick={() => setMobileMenu(false)}>Features</a>
        <a href="#services" className="lp-mobile-nav-link" onClick={() => setMobileMenu(false)}>Services</a>
        <a href="#faq" className="lp-mobile-nav-link" onClick={() => setMobileMenu(false)}>FAQs</a>
        <a href="#contact" className="lp-mobile-nav-link" onClick={() => setMobileMenu(false)}>Contact</a>
        <button className="lp-btn lp-btn-primary" style={{ width: '100%', marginTop: 10 }} onClick={() => { setMobileMenu(false); navigate(authenticated ? '/home' : '/login'); }}>
          {authenticated ? 'Go to Catalog Shop' : 'Get Started'}
        </button>
      </div>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-left">
          <div className="lp-hero-tag">
            📦 Product Catalog Platform
          </div>
          <h1 className="lp-hero-title">
            Streamlined Management for Your <span>Storefront & Inventory</span>
          </h1>
          <p className="lp-hero-sub">
            A comprehensive, API-driven catalog system featuring granular RBAC role mappings, bulk CSV database hydration, and cash storefront order checkout queues.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')}>
              Sign In to Storefront <ArrowRight size={16} />
            </button>
            <button className="lp-btn lp-btn-outline" onClick={() => navigate('/login')}>
              Register Catalog Account
            </button>
          </div>
          <div className="lp-hero-badges">
            <div className="lp-hero-badge"><Shield size={16} /> Granular RBAC</div>
            <div className="lp-hero-badge"><Zap size={16} /> Instant Search</div>
            <div className="lp-hero-badge"><Database size={16} /> Seeds Seeding</div>
          </div>
        </div>

        <div className="lp-hero-right">
          <div className="lp-showcase-bg" />
          <div className="lp-hero-mockups">
            <img
              src="/home_page.png"
              alt="Product Catalog Storefront"
              className="lp-hero-mockup-1"
            />
            <img
              src="/login_page.png"
              alt="Monochrome Login Interface"
              className="lp-hero-mockup-2"
            />
          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────── */}
      <section className="lp-stats">
        <div className="lp-stats-grid">
          <div>
            <div className="lp-stat-val">100K+</div>
            <div className="lp-stat-label">In-Stock Products</div>
          </div>
          <div>
            <div className="lp-stat-val">99.9%</div>
            <div className="lp-stat-label">System Gateway Uptime</div>
          </div>
          <div>
            <div className="lp-stat-val">50+</div>
            <div className="lp-stat-label">Product Classifications</div>
          </div>
          <div>
            <div className="lp-stat-val">100%</div>
            <div className="lp-stat-label">RBAC Security Verified</div>
          </div>
        </div>
      </section>

      {/* ── Features Tab Section ───────────────────────────── */}
      <section id="features" className="lp-section">
        <div className="lp-sec-header">
          <span className="lp-sec-tag">Module Details</span>
          <h2 className="lp-sec-title">Engineered for Platform Catalog Operations</h2>
          <p className="lp-sec-sub">Control inventories, map permissions, check out orders, and bulk import records through specialized system modules.</p>
        </div>

        <div className="lp-tabs-layout">
          <div className="lp-tabs-menu">
            {TABS.map(tab => {
              const Icon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  className={`lp-tab-btn ${tabActive === tab.id ? 'active' : ''}`}
                  onClick={() => setTabActive(tab.id)}
                >
                  <span className="lp-tab-btn-icon"><Icon size={18} /></span>
                  <span className="lp-tab-btn-text">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="lp-tab-panel" key={tabActive}>
            <div>
              <h3 className="lp-panel-title">{currentTab.title}</h3>
              <p className="lp-panel-desc">{currentTab.desc}</p>
              <div className="lp-panel-grid">
                {currentTab.checks.map((check, idx) => (
                  <div key={idx} className="lp-panel-check">
                    <Check size={16} strokeWidth={3} /> {check}
                  </div>
                ))}
              </div>
              <div className="lp-panel-stat">
                <div>
                  <div className="lp-panel-mini-val">{currentTab.statVal}</div>
                  <div className="lp-panel-mini-lbl">{currentTab.statLbl}</div>
                </div>
                <div style={{ borderLeft: '1px dashed var(--lp-border)', paddingLeft: 30 }}>
                  <div className="lp-panel-mini-val">Store Pickup</div>
                  <div className="lp-panel-mini-lbl">Fulfillment Path</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={currentTab.image}
                alt={currentTab.label}
                className="lp-tab-mockup"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Cards Section ─────────────────────────── */}
      <section id="services" className="lp-section lp-section-bg">
        <div className="lp-sec-header">
          <span className="lp-sec-tag">System Modules</span>
          <h2 className="lp-sec-title">What ProductShop Handles</h2>
          <p className="lp-sec-sub">Our solution wraps catalog databases in secure gateway structures, offering rich, high-contrast visual frontends.</p>
        </div>

        <div className="lp-services-grid">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.Icon;
            return (
              <div key={idx} className="lp-service-card">
                <div className="lp-service-icon lp-srv-icon">
                  <Icon size={24} />
                </div>
                <h3 className="lp-srv-title">{srv.title}</h3>
                <p className="lp-srv-desc">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>


      {/* ── FAQ Section ─────────────────────────────────── */}
      <section id="faq" className="lp-section lp-section-bg">
        <div className="lp-sec-header">
          <span className="lp-sec-tag">Knowledge</span>
          <h2 className="lp-sec-title">Common Platform Questions</h2>
          <p className="lp-sec-sub">Have a question regarding security gates or bulk uploads? Check our answers below.</p>
        </div>

        <div className="lp-faq-list">
          {FAQS.map((faq, idx) => {
            const open = faqOpen === idx;
            return (
              <div key={idx} className="lp-faq-item">
                <div className="lp-faq-head" onClick={() => setFaqOpen(open ? null : idx)}>
                  <h4 className="lp-faq-title">
                    <span className="lp-faq-num">{faq.num}</span> {faq.q}
                  </h4>
                  {open ? <X size={16} /> : <ArrowRight size={16} />}
                </div>
                {open && (
                  <div className="lp-faq-body">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Contact Section ──────────────────────────────── */}
      <section id="contact" className="lp-section">
        <div className="lp-sec-header">
          <span className="lp-sec-tag">Get in touch</span>
          <h2 className="lp-sec-title">We are Here to Support You</h2>
          <p className="lp-sec-sub">Submit feedback, request schema adjustments, or inquire about custom integration architectures.</p>
        </div>

        <div className="lp-contact-layout">
          <div className="lp-contact-info">
            <div className="lp-contact-item">
              <div className="lp-contact-icon"><MapPin size={18} /></div>
              <div>
                <h5 className="lp-contact-title">Platform HQ</h5>
                <p className="lp-contact-desc">123 MG Road, Bangalore, Karnataka 560001</p>
              </div>
            </div>
            <div className="lp-contact-item">
              <div className="lp-contact-icon"><Mail size={18} /></div>
              <div>
                <h5 className="lp-contact-title">Email Enquiries</h5>
                <p className="lp-contact-desc">support@productshop.in</p>
              </div>
            </div>
            <div className="lp-contact-item">
              <div className="lp-contact-icon"><Clock size={18} /></div>
              <div>
                <h5 className="lp-contact-title">Business Operations</h5>
                <p className="lp-contact-desc">Monday – Saturday: 9:00 AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>

          <form className="lp-contact-form" onSubmit={handleContactSubmit}>
            <div className="lp-form-row">
              <div className="lp-form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div className="lp-form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="lp-form-field">
              <label>Message Content</label>
              <textarea
                required
                rows={4}
                placeholder="How can we help your business build catalogs?"
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>
            <button type="submit" className="lp-btn lp-btn-primary" style={{ width: '100%', height: 46 }}>
              Send Feedback Message
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div>
            <Link to="/" className="lp-logo" style={{ color: '#fff' }}>
              Product<span style={{ color: '#fff' }}>Shop</span>
            </Link>
            <p className="lp-footer-desc">
              Next-generation inventory catalog hubs. Deploy storefront listings databases, secure endpoint gates, and visual maps instantly.
            </p>
          </div>
          <div>
            <h5 className="lp-footer-heading">Product</h5>
            <ul className="lp-footer-links">
              <li><a href="#features">Key Features</a></li>
              <li><a href="#services">Core Modules</a></li>
            </ul>
          </div>
          <div>
            <h5 className="lp-footer-heading">Support</h5>
            <ul className="lp-footer-links">
              <li><a href="#faq">Frequently Asked</a></li>
              <li><a href="#contact">Contact Support</a></li>
              <li><a href="/login">Platform Log In</a></li>
            </ul>
          </div>
          <div>
            <h5 className="lp-footer-heading">Connect With Us</h5>
            <div className="lp-footer-contact">
              <div className="lp-footer-contact-item"><MapPin size={14} /> Bangalore, IN</div>
              <div className="lp-footer-contact-item"><Mail size={14} /> support@productshop.in</div>
            </div>
            <div className="lp-social-row">
              {['f', 'in', 'tw', 'yt'].map((s, idx) => (
                <a key={idx} href="#" className="lp-social-btn" onClick={e => e.preventDefault()}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{s}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <p className="lp-footer-copy">© 2026 ProductShop. All rights reserved.</p>
          <div className="lp-footer-terms">
            <a href="#">Terms</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
