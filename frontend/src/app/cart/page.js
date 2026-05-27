'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function CartPage() {
  const [cartData, setCartData] = useState({ items: [], subtotal: 0 });
  const [siteUrl, setSiteUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    const [cart, settings] = await Promise.all([
      apiFetch('/api/cart'),
      apiFetch('/api/settings')
    ]);
    if (cart.success) setCartData(cart);
    if (settings.success) setSiteUrl(settings.siteUrl?.replace(/\/$/, '') || '');
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (pid) => {
    await apiFetch('/api/cart/remove', { method: 'POST', body: JSON.stringify({ pid }) });
    fetchCart();
  };

  const updateQty = async (pid, qty) => {
    await apiFetch('/api/cart/update', { method: 'POST', body: JSON.stringify({ pid, qty }) });
    fetchCart();
  };

  const totalItems = cartData.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const totalMrp = cartData.items?.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0) || 0;
  const totalSelling = cartData.items?.reduce((s, i) => s + parseFloat(i.total) * i.quantity, 0) || 0;
  const discount = totalMrp - totalSelling;

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ color: '#212121', fontSize: 24 }}><i className="bi bi-arrow-left"></i></Link>
        <h4 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>My Cart ({totalItems})</h4>
      </header>

      {cartData.items?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', marginTop: 8 }}>
          <div style={{ fontSize: 60, color: '#e0e0e0' }}><i className="bi bi-cart-x"></i></div>
          <h4 style={{ marginTop: 16 }}>Your cart is empty!</h4>
          <Link href="/" style={{ display: 'inline-block', marginTop: 16, backgroundColor: '#2874f0', color: '#fff', padding: '10px 30px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>
            Shop now
          </Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', marginTop: 8, paddingBottom: 8 }}>
            {cartData.items.map(item => (
              <div key={item.id} className="cart-item">
                <span style={{ color: '#26a541', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Top Discount of the Sale</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <img src={`${siteUrl}/assets/uploads/${item.image}`} alt={item.name}
                    style={{ width: 110, height: 110, objectFit: 'contain' }}
                    onError={e => { e.target.src = '/placeholder.png'; }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>{item.name}</p>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <strong>₹{Number(item.total).toLocaleString()}</strong>
                      <del style={{ color: '#878787', fontSize: 12 }}>₹{Number(item.price).toLocaleString()}</del>
                      <span style={{ color: '#388e3c', fontSize: 13 }}>{item.discount}% off</span>
                    </div>
                    <select className="form-select form-select-sm w-auto"
                      value={item.quantity}
                      onChange={e => updateQty(item.id, parseInt(e.target.value))}>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="action-buttons mt-2">
                  <button className="action-btn"><i className="bi bi-bookmark me-1"></i>Save for later</button>
                  <button className="action-btn" onClick={() => removeItem(item.id)}><i className="bi bi-trash3 me-1"></i>Remove</button>
                </div>
              </div>
            ))}

            {/* Price Details */}
            <div style={{ padding: 16, borderTop: '1px solid #f0f0f0', marginTop: 8 }}>
              <h6 className="fw-bold mb-3">Price Details</h6>
              <div className="d-flex justify-content-between mb-2"><span>Price ({totalItems} items)</span><span>₹{Math.round(totalMrp).toLocaleString()}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Discount</span><span style={{ color: '#388e3c' }}>- ₹{Math.round(discount).toLocaleString()}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Platform Fee</span><span>₹0</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-6"><span>Total Amount</span><span>₹{Math.round(totalSelling).toLocaleString()}</span></div>
              <div style={{ backgroundColor: '#eaf5ec', color: '#388e3c', padding: 12, borderRadius: 8, marginTop: 12, textAlign: 'center' }}>
                <i className="bi bi-tag-fill me-2"></i>You'll save ₹{Math.round(discount).toLocaleString()} on this order!
              </div>
            </div>
          </div>

          <div className="fixed-footer">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <del style={{ color: '#878787', fontSize: 12 }}>₹{Math.round(totalMrp).toLocaleString()}</del>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>₹{Math.round(totalSelling).toLocaleString()}</div>
              </div>
              <Link href="/address" style={{ textDecoration: 'none' }}>
                <button style={{ backgroundColor: '#fb641b', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: 4, fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>
                  Place Order
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
