import { useEffect, useState } from 'react';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getAllOrders, updateOrderStatus } from '../services/api';
import { Package, ChevronDown, ChevronUp, RefreshCw, User } from 'lucide-react';
import '../components/Layout.css';

const STATUS_COLORS = {
  PENDING:    { bg: 'rgba(255,183,64,0.1)',   color: '#ffb740', label: 'Pending'    },
  CONFIRMED:  { bg: 'rgba(6,214,160,0.1)',   color: '#06d6a0', label: 'Confirmed'  },
  SHIPPED:    { bg: 'rgba(124,106,255,0.1)',  color: '#7c6aff', label: 'Shipped'    },
  DELIVERED:  { bg: 'rgba(6,214,160,0.15)',   color: '#06d6a0', label: 'Delivered'  },
  CANCELLED:  { bg: 'rgba(255,77,109,0.1)',   color: '#ff4d6d', label: 'Cancelled'  },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [expanded, setExpanded] = useState({});

  const load = () => {
    setLoading(true);
    getAllOrders(res => {
      setLoading(false);
      if (res.code === 200) {
        setOrders(res.orders || []);
      } else {
        alert(res.message || 'Failed to load orders');
      }
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    updateOrderStatus(orderId, newStatus, res => {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
      if (res.code === 200) {
        load();
      } else {
        alert(res.message || 'Failed to update order status');
      }
    });
  };

  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const fmt = dt => {
    if (!dt) return '-';
    try {
      return new Date(dt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  return (
    <NsLayout>
        <div className="layout-header">
          <div>
            <h1 className="layout-title">Manage Orders</h1>
            <p className="layout-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} in system</p>
          </div>
          <button className="btn btn-secondary" onClick={load} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'spin' : ''} style={{ marginRight: 6 }} /> Refresh
          </button>
        </div>

        {loading && orders.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Package size={40} style={{ opacity: 0.4 }} /></div>
            <p>No customer orders placed yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
              const open = expanded[order.id];
              const isUpdating = updating[order.id];

              return (
                <div key={order.id} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden'
                }}>
                  {/* Order Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', cursor: 'pointer' }}
                    onClick={() => toggle(order.id)}>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>Order #{order.id}</span>
                        <span style={{
                          fontSize: 11,
                          padding: '2px 10px',
                          borderRadius: 99,
                          background: s.bg,
                          color: s.color,
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {s.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmt(order.createdAt)}</span>
                      </div>
                      
                      {/* Customer and Order metadata */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <User size={12} style={{ opacity: 0.6 }} /> {order.username}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>•</span>
                        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Method: {order.paymentMethod || 'COD'}</span>
                        {order.address && order.address !== 'N/A' && (
                          <>
                            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>•</span>
                            <span style={{ fontSize: 13, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                              {order.address}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right side: total price and status update dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} onClick={e => e.stopPropagation()}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)', flexShrink: 0 }}>
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <select
                          className="btn btn-ghost"
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '4px 10px',
                            height: 32,
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-1)',
                            background: 'var(--bg-elevated)'
                          }}
                          value={order.status}
                          disabled={isUpdating}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      {open ? <ChevronUp size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} onClick={() => toggle(order.id)} />
                            : <ChevronDown size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} onClick={() => toggle(order.id)} />}
                    </div>
                  </div>

                  {/* Expandable Order Items list */}
                  {open && (
                    <div style={{
                      borderTop: '1px solid var(--border)',
                      padding: '16px 20px',
                      background: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}>
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 8,
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: 'var(--bg-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <Package size={18} style={{ opacity: 0.3 }} />
                            )}
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: 600,
                              color: 'var(--text-1)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {item.productName}
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>
                              Qty: {item.quantity} • ₹{Number(item.price).toLocaleString('en-IN')} each
                            </p>
                          </div>
                          
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)', flexShrink: 0 }}>
                            ₹{Number(item.subtotal).toLocaleString('en-IN')}
                          </span>
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

export default AdminOrders;
