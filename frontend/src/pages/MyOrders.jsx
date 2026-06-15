import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getMyOrders } from '../services/api';
import { Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import '../components/Layout.css';

const STATUS_COLORS = {
  CONFIRMED:  { bg: 'rgba(6,214,160,0.1)',   color: '#06d6a0', label: 'Confirmed'  },
  PENDING:    { bg: 'rgba(255,183,64,0.1)',   color: '#ffb740', label: 'Pending'    },
  SHIPPED:    { bg: 'rgba(124,106,255,0.1)',  color: '#7c6aff', label: 'Shipped'    },
  DELIVERED:  { bg: 'rgba(6,214,160,0.15)',   color: '#06d6a0', label: 'Delivered'  },
  CANCELLED:  { bg: 'rgba(255,77,109,0.1)',   color: '#ff4d6d', label: 'Cancelled'  },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders(res => {
      setLoading(false);
      if (res.code === 200) setOrders(res.orders || []);
    });
  }, []);

  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const fmt = dt => {
    if (!dt) return 'â€”';
    try { return new Date(dt).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
    catch { return 'â€”'; }
  };

  return (
    <NsLayout>
        <div className="layout-header">
          <div>
            <h1 className="layout-title">My Orders</h1>
            <p className="layout-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            <ShoppingBag size={14} /> Shop More
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Package size={40} style={{ opacity: 0.4 }} /></div>
            <p>No orders yet</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>Start Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
              const open = expanded[order.id];
              return (
                <div key={order.id} style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden'
                }}>
                  {/* Order Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => toggle(order.id)}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>Order #{order.id}</span>
                        <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 99, background: s.bg, color: s.color, fontWeight: 700 }}>
                          {s.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmt(order.createdAt)}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-3)' }}>
                        {order.paymentMethod} Â· {order.address?.substring(0, 50)}{order.address?.length > 50 ? 'â€¦' : ''}
                      </p>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)', flexShrink: 0 }}>
                    ₹{Number(order.total).toLocaleString('en-IN')}
                    </span>
                    {open ? <ChevronUp size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                           : <ChevronDown size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
                  </div>

                  {/* Order Items (expandable) */}
                  {open && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(order.items || []).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                            background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {item.imageUrl
                              ? <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
                              : <Package size={18} style={{ opacity: 0.3 }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.productName}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>Qty: {item.quantity} - ₹{Number(item.price).toLocaleString('en-IN')}</p>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)', flexShrink: 0 }}>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <ProgressBar isProgress={loading} />
    </NsLayout>
  );
};

export default MyOrders;

