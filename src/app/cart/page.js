'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [data, setData] = useState({ items: [], subtotal: 0, count: 0 });
  const [base, setBase] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/settings').then(r => r.json()).then(d => { if (d.success) setBase(d.siteUrl ? d.siteUrl + '/assets/' : ''); });
    fetch('/api/cart').then(r => r.json()).then(d => { if (d.success) setData(d); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const remove = async (pid) => {
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'remove', pid }) });
    load();
  };
  const setQty = async (pid, qty) => {
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'set', pid, qty }) });
    load();
  };

  const totalMrp = data.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const totalSell = data.items?.reduce((s, i) => s + i.total * i.quantity, 0) || 0;
  const saved = totalMrp - totalSell;

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header className="pg-header-back">
        <div className="d-flex align-items-center gap-2">
          <Link href="/" style={{ color: '#212121', fontSize: 22 }}><i className="bi bi-arrow-left" /></Link>
          <span style={{ fontSize: 16, fontWeight: 500 }}>My Cart ({data.count || 0})</span>
        </div>
      </header>

      {!data.items?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', marginTop: 8 }}>
          <i className="bi bi-cart-x" style={{ fontSize: 60, color: '#e0e0e0' }} />
          <h4 style={{ marginTop: 16 }}>Your cart is empty!</h4>
          <Link href="/" style={{ display: 'inline-block', marginTop: 16, background: '#2874f0', color: '#fff', padding: '10px 28px', borderRadius: 4, fontWeight: 600 }}>Shop Now</Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', marginTop: 8 }}>
            {data.items.map(item => (
              <div key={item.id} style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <img src={`${base}${item.image}`} alt={item.name} style={{ width: 110, height: 110, objectFit: 'contain' }}
                    onError={e => { e.target.src = 'https://placehold.co/110?text=...'; }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 8 }}>{item.name}</p>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <strong>₹{Number(item.total).toLocaleString()}</strong>
                      <del style={{ color: '#878787', fontSize: 12 }}>₹{Number(item.price).toLocaleString()}</del>
                      <span style={{ color: '#388e3c', fontSize: 12 }}>{item.discount}% off</span>
                    </div>
                    <select className="form-select form-select-sm w-auto" value={item.quantity} onChange={e => setQty(item.id, parseInt(e.target.value))}>
                      {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', borderTop: '1px solid #f0f0f0', marginTop: 10 }}>
                  <button style={{ flex: 1, border: 'none', background: '#fff', padding: 10, fontSize: 13, cursor: 'pointer', color: '#565656' }}>
                    <i className="bi bi-bookmark me-1" />Save for later
                  </button>
                  <button onClick={() => remove(item.id)} style={{ flex: 1, border: 'none', borderLeft: '1px solid #f0f0f0', background: '#fff', padding: 10, fontSize: 13, cursor: 'pointer', color: '#565656' }}>
                    <i className="bi bi-trash3 me-1" />Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Price details */}
            <div style={{ padding: 16 }}>
              <p style={{ fontWeight: 700, marginBottom: 12 }}>Price Details</p>
              <div className="d-flex justify-content-between mb-2"><span>Price ({data.count} items)</span><span>₹{Math.round(totalMrp).toLocaleString()}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Discount</span><span style={{ color: '#388e3c' }}>- ₹{Math.round(saved).toLocaleString()}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Delivery</span><span style={{ color: '#388e3c' }}>FREE</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{Math.round(totalSell).toLocaleString()}</span></div>
              {saved > 0 && <div style={{ background: '#e8f5e9', color: '#388e3c', padding: 10, borderRadius: 6, marginTop: 12, textAlign: 'center', fontSize: 13 }}>
                You will save ₹{Math.round(saved).toLocaleString()} on this order!
              </div>}
            </div>
          </div>

          <div className="fixed-btn">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <del style={{ color: '#878787', fontSize: 12 }}>₹{Math.round(totalMrp).toLocaleString()}</del>
                <div style={{ fontSize: 18, fontWeight: 700 }}>₹{Math.round(totalSell).toLocaleString()}</div>
              </div>
              <Link href="/address"><button className="btn-orange" style={{ width: 'auto', padding: '12px 28px' }}>Place Order</button></Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
