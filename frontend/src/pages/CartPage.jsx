import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NsLayout from '../components/NsLayout';
import ProgressBar from '../components/ProgressBar';
import { getCart, updateCartItem, removeFromCart, clearCart, placeOrder } from '../services/api';
import { ShoppingCart, Trash2, Plus, Minus, Package, CheckCircle } from 'lucide-react';
import '../components/Layout.css';

const CartPage = () => {
  const [items, setItems]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing]   = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    getCart(res => {
      setLoading(false);
      if (res.code === 200) {
        setItems(res.items || []);
        setTotal(res.total || 0);
      }
    });
  };

  useEffect(() => { load(); }, []);

  const handleQty = (cartId, qty) => {
    if (qty < 1) return;
    updateCartItem(cartId, qty, res => { if (res.code === 200) load(); });
  };

  const handleRemove = (cartId) => {
    removeFromCart(cartId, res => { if (res.code === 200) load(); });
  };

  const handleClear = () => {
    if (!window.confirm('Clear entire cart?')) return;
    clearCart(res => { if (res.code === 200) load(); });
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    // Send empty/default values since address and payment method are not needed on frontend anymore
    placeOrder({ address: 'Store Pickup', paymentMethod: 'COD' }, res => {
      setPlacing(false);
      if (res.code === 200) {
        setOrderDone(true);
        setItems([]);
        setTotal(0);
      } else {
        alert(res.message || 'Failed to place order');
      }
    });
  };

  return (
    <>
      <NsLayout>
          <div className="layout-header">
            <div>
              <h1 className="layout-title">My Cart</h1>
              <p className="layout-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
            </div>
            {items.length > 0 && (
              <button className="btn btn-secondary" onClick={handleClear}>
                <Trash2 size={13} /> Clear Cart
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><ShoppingCart size={40} style={{ opacity: 0.4 }} /></div>
              <p>Your cart is empty</p>
              <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
                {items.map(item => (
                  <div key={item.cartId} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                    transition: 'border-color 0.2s'
                  }}>
                    {/* Image */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                      background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.target.style.display = 'none'; }} />
                        : <Package size={22} style={{ opacity: 0.3 }} />}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.brand || 'Unknown'}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.productName}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-3)' }}>₹{Number(item.price).toLocaleString('en-IN')} each</p>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border-hover)', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm" style={{ borderRadius: 0, height: 32, width: 32, padding: 0 }} onClick={() => handleQty(item.cartId, item.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 10px', fontWeight: 700, fontSize: 14, color: 'var(--text-1)', minWidth: 28, textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-ghost btn-sm" style={{ borderRadius: 0, height: 32, width: 32, padding: 0 }} onClick={() => handleQty(item.cartId, item.quantity + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: 'var(--primary)', minWidth: 100, textAlign: 'right', flexShrink: 0 }}>
                      ₹{Number(item.subtotal).toLocaleString('en-IN')}
                    </p>

                    {/* Remove */}
                    <button className="btn btn-danger btn-sm" style={{ flexShrink: 0 }} onClick={() => handleRemove(item.cartId)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 24, position: 'sticky', top: 24
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Order Summary</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {items.map(item => (
                    <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{item.productName} - {item.quantity}</span>
                      <span style={{ flexShrink: 0 }}>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: 'var(--text-1)', marginBottom: 20 }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>₹{Number(total).toLocaleString('en-IN')}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', height: 44, fontSize: 15 }}
                    onClick={() => setShowCheckout(true)}>
                    <ShoppingCart size={16} /> Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}

          <ProgressBar isProgress={loading || placing} />
      </NsLayout>

      {/* Checkout Modal */}
      {showCheckout && !orderDone && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 400,
            boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.3s var(--ease-out)'
          }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Confirm Order</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--text-3)' }}>
              {items.length} item{items.length !== 1 ? 's' : ''} • Total: <strong style={{ color: 'var(--primary)' }}>₹{Number(total).toLocaleString('en-IN')}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, maxHeight: 180, overflowY: 'auto' }}>
              {items.map(item => (
                <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{item.productName} - {item.quantity}</span>
                  <span style={{ flexShrink: 0, fontWeight: 600 }}>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCheckout(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handlePlaceOrder} disabled={placing}>
                {placing ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderDone && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: 40, width: '100%', maxWidth: 400,
            boxShadow: 'var(--shadow-lg)', textAlign: 'center', animation: 'fadeUp 0.3s var(--ease-out)'
          }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>Order Placed! 🎉</h2>
            <p style={{ margin: '0 0 24px', color: 'var(--text-2)', fontSize: 14 }}>Your order has been confirmed. You can track it in My Orders.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setOrderDone(false); setShowCheckout(false); }}>Stay Here</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/orders/my')}>My Orders</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
