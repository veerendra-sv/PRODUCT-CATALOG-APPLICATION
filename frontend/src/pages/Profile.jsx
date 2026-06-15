import { useEffect, useState } from 'react';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getMyOrders, getUinfo } from '../services/api';
import { User, Mail, Shield, ClipboardList, CheckCircle } from 'lucide-react';
import '../components/Layout.css';

const Profile = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Decode token to get email and role
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setEmail(payload.username || 'N/A');
        setRole(payload.role === 2 ? 'Admin' : 'User');
      } catch (err) {
        console.error('Failed to parse token payload:', err);
      }
    }

    // 2. Fetch fullname from the existing uinfo API
    getUinfo(res => {
      if (res.code === 200) {
        setFullname(res.fullname);
      }
      
      // 3. Fetch orders count
      getMyOrders(orderRes => {
        setLoading(false);
        if (orderRes.code === 200) {
          setOrderCount(orderRes.orders?.length || 0);
        }
      });
    });
  }, []);

  return (
    <NsLayout title="My Profile" subtitle="Your personal account details">
        <div className="layout-header">
          <div>
            <h1 className="layout-title">My Profile</h1>
            <p className="layout-subtitle">Your personal account details</p>
          </div>
        </div>

        <div style={{
          maxWidth: 600,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Header Avatar card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--primary)'
            }}>
              <User size={36} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>{fullname || email.split('@')[0]}</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-3)' }}>{email}</p>
            </div>
          </div>

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Full Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ color: 'var(--text-3)', display: 'flex', width: 24 }}><User size={18} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Full Name</p>
                <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{fullname || 'N/A'}</p>
              </div>
            </div>

            {/* Email Address */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ color: 'var(--text-3)', display: 'flex', width: 24 }}><Mail size={18} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Email Address</p>
                <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{email}</p>
              </div>
            </div>

            {/* Role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ color: 'var(--text-3)', display: 'flex', width: 24 }}><Shield size={18} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Role</p>
                <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: role === 'Admin' ? 'var(--primary)' : 'var(--text-1)' }}>
                  {role}
                </p>
              </div>
            </div>

            {/* Total Orders Placed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ color: 'var(--text-3)', display: 'flex', width: 24 }}><ClipboardList size={18} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Total Orders Placed</p>
                <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{orderCount}</p>
              </div>
            </div>

            {/* Account Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ color: 'var(--text-3)', display: 'flex', width: 24 }}><CheckCircle size={18} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Account Status</p>
                <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: '#06d6a0', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProgressBar isProgress={loading} />
    </NsLayout>
  );
};

export default Profile;
