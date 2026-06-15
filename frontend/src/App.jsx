import { useEffect, useRef, useState } from 'react';
import { callApi, apibaseurl } from './lib';
import './App.css';
import ProgressBar from './components/ProgressBar.jsx';
import {
  User, Lock, Mail, Phone, ChevronRight,
  ShoppingBag, BarChart2, Shield, Zap
} from 'lucide-react';

const App = () => {
  const [isSignin, setIsSignIn] = useState(true);
  const finput = useRef();
  const [isProgress, setIsProgress] = useState(false);
  const [errorData, setErrorData] = useState({});

  const [signupData, setSignupData] = useState({
    fullname: '', phone: '', email: '', password: '', retypepassword: '', role: 1
  });

  const [signinData, setSigninData] = useState({ username: '', password: '' });

  useEffect(() => {
    setTimeout(() => finput.current?.focus(), 0);
  }, [isSignin]);

  const switchWindow = () => {
    setIsSignIn(p => !p);
    setErrorData({});
    setSigninData({ username: '', password: '' });
    setSignupData({ fullname: '', phone: '', email: '', password: '', retypepassword: '', role: 1 });
  };

  const handleSigninInput  = e => setSigninData({ ...signinData,  [e.target.name]: e.target.value });
  const handleSignupInput  = e => setSignupData({ ...signupData,  [e.target.name]: e.target.value });

  const validateSignin = () => {
    const err = {};
    if (!signinData.username) err.username = true;
    if (!signinData.password) err.password = true;
    setErrorData(err);
    return Object.keys(err).length === 0;
  };

  const validateSignup = () => {
    const err = {};
    if (!signupData.fullname) err.fullname = true;
    if (!signupData.phone)    err.phone    = true;
    if (!signupData.email)    err.email    = true;
    if (!signupData.password) err.password = true;
    if (!signupData.retypepassword || signupData.password !== signupData.retypepassword)
      err.retypepassword = true;
    setErrorData(err);
    return Object.keys(err).length === 0;
  };

  const signin = () => {
    if (!validateSignin()) return;
    setIsProgress(true);
    callApi('POST', `${apibaseurl}/authservice/signin`, signinData, null, res => {
      if (res.code !== 200) alert(res.message);
      else {
        localStorage.setItem('token', res.jwt);
        window.location.replace('/home');
      }
      setIsProgress(false);
    });
  };

  const signup = () => {
    if (!validateSignup()) return;
    setIsProgress(true);
    callApi('POST', `${apibaseurl}/authservice/signup`, signupData, null, res => {
      alert(res.message);
      setIsProgress(false);
      setSignupData({ fullname: '', phone: '', email: '', password: '', retypepassword: '', role: 1 });
      finput.current?.focus();
    });
  };

  const features = [
    'Role-based access control (RBAC)',
    'JWT-secured API gateway',
    'Real-time product inventory',
    'Admin analytics dashboard',
  ];

  return (
    <div className="auth-root">
      {/* ── LEFT: Brand Panel ──────────────────── */}
      <div className="auth-brand">
        <div className="auth-brand-logo">
          <div className="auth-brand-logo-icon">🛒</div>
          <span className="auth-brand-logo-text">Product Catalog Application</span>
        </div>

        <div className="auth-brand-content">
          <div className="auth-brand-tag">Smart Product Catalog</div>
          <h1 className="auth-brand-headline">
            The modern way to manage your <span>product catalog</span>
          </h1>
          <p className="auth-brand-sub">
            A full-stack, API-driven platform built for teams who need
            real-time product data, intelligent inventory control, and
            enterprise-grade security.
          </p>
          <div className="auth-brand-features">
            {features.map((f, i) => (
              <div className="auth-brand-feature" key={i}>
                <span className="auth-brand-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="auth-brand-footer">
          © 2026 Product Catalog Application. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT: Form Panel ──────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-form-box">

          {isSignin ? (
            /* ── SIGN IN ─────────────────── */
            <>
              <h2 className="auth-form-title">Welcome back</h2>
              <p className="auth-form-subtitle">Sign in to your Product Catalog account</p>

              <label className="auth-field-label">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Mail size={15} /></span>
                <input
                  ref={finput}
                  className={`auth-input ${errorData.username ? 'error' : ''}`}
                  type="text"
                  name="username"
                  placeholder="you@company.com"
                  autoComplete="off"
                  value={signinData.username}
                  onChange={handleSigninInput}
                  onKeyDown={e => e.key === 'Enter' && signin()}
                />
              </div>

              <label className="auth-field-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={15} /></span>
                <input
                  className={`auth-input ${errorData.password ? 'error' : ''}`}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={signinData.password}
                  onChange={handleSigninInput}
                  onKeyDown={e => e.key === 'Enter' && signin()}
                />
              </div>

              <div className="auth-forgot">
                <button>Forgot password?</button>
              </div>

              <button className="auth-submit" onClick={signin} disabled={isProgress}>
                {isProgress ? 'Signing in…' : 'Sign in'}
              </button>

              <div className="auth-switch">
                Don't have an account?{' '}
                <button onClick={switchWindow}>Create one →</button>
              </div>
            </>
          ) : (
            /* ── SIGN UP ─────────────────── */
            <>
              <h2 className="auth-form-title">Create account</h2>
              <p className="auth-form-subtitle">Join Product Catalog — it's free to get started</p>

              <label className="auth-field-label">Full name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><User size={15} /></span>
                <input
                  ref={finput}
                  className={`auth-input ${errorData.fullname ? 'error' : ''}`}
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  autoComplete="off"
                  value={signupData.fullname}
                  onChange={handleSignupInput}
                />
              </div>

              <div className="auth-grid-2">
                <div>
                  <label className="auth-field-label">Phone</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon"><Phone size={15} /></span>
                    <input
                      className={`auth-input ${errorData.phone ? 'error' : ''}`}
                      type="text"
                      name="phone"
                      placeholder="9876543210"
                      autoComplete="off"
                      value={signupData.phone}
                      onChange={handleSignupInput}
                    />
                  </div>
                </div>
                <div>
                  <label className="auth-field-label">Email</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon"><Mail size={15} /></span>
                    <input
                      className={`auth-input ${errorData.email ? 'error' : ''}`}
                      type="text"
                      name="email"
                      placeholder="you@mail.com"
                      autoComplete="off"
                      value={signupData.email}
                      onChange={handleSignupInput}
                    />
                  </div>
                </div>
              </div>

              <label className="auth-field-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={15} /></span>
                <input
                  className={`auth-input ${errorData.password ? 'error' : ''}`}
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  autoComplete="off"
                  value={signupData.password}
                  onChange={handleSignupInput}
                />
              </div>

              <label className="auth-field-label">Confirm password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={15} /></span>
                <input
                  className={`auth-input ${errorData.retypepassword ? 'error' : ''}`}
                  type="password"
                  name="retypepassword"
                  placeholder="Re-enter your password"
                  autoComplete="off"
                  value={signupData.retypepassword}
                  onChange={handleSignupInput}
                />
              </div>

              <label className="auth-field-label">Account type</label>
              <div className="auth-role-grid">
                <div className="auth-role-option">
                  <input type="radio" id="role-user" name="role" value={1}
                    checked={signupData.role === 1}
                    onChange={() => setSignupData({ ...signupData, role: 1 })} />
                  <label className="auth-role-label" htmlFor="role-user">
                    <span className="auth-role-icon"><User size={20} /></span>
                    User
                  </label>
                </div>
                <div className="auth-role-option">
                  <input type="radio" id="role-admin" name="role" value={2}
                    checked={signupData.role === 2}
                    onChange={() => setSignupData({ ...signupData, role: 2 })} />
                  <label className="auth-role-label" htmlFor="role-admin">
                    <span className="auth-role-icon"><Shield size={20} /></span>
                    Admin
                  </label>
                </div>
              </div>

              <button className="auth-submit" onClick={signup} disabled={isProgress}>
                {isProgress ? 'Creating account…' : 'Create account'}
              </button>

              <div className="auth-switch">
                Already have an account?{' '}
                <button onClick={switchWindow}>Sign in →</button>
              </div>
            </>
          )}
        </div>
      </div>

      <ProgressBar isProgress={isProgress} />
    </div>
  );
};

export default App;
