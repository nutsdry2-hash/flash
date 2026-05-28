'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderSummary() {
  const [data, setData] = useState(null);
  const [base, setBase] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { if (d.success) setBase(d.siteUrl ? d.siteUrl + '/assets/' : ''); });
    fetch('/api/order').then(r => r.json()).then(d => {
      if (d.success) setData(d); else router.push('/address');
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;
  if (!data) return null;

  const { address, items, pricing } = data;

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh', paddingBottom: 80 }}>
      <header className="pg-header-back">
        <div className="d-flex align-items-center gap-2">
          <Link href="/address" style={{ color: '#212121', fontSize: 22 }}><i className="bi bi-arrow-left" /></Link>
          <span style={{ fontSize: 16, fontWeight: 500 }}>Order Summary</span>
        </div>
      </header>

      <div className="stepper" style={{ background: '#fff' }}>
        <div className="step done"><div className="step-circle">✓</div><div className="step-label">Address</div></div>
        <div className="step active"><div className="step-circle">2</div><div className="step-label">Order Summary</div></div>
        <div className="step"><div className="step-circle">3</div><div className="step-label">Payment</div></div>
      </div>

      {/* Address */}
      <div style={{ background: '#fff', padding: 16, borderBottom: '8px solid #f1f2f4' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>Deliver to:</strong>
          <Link href="/address" style={{ border: '1px solid #2874f0', color: '#2874f0', padding: '3px 10px', borderRadius: 3, fontSize: 12 }}>Change</Link>
        </div>
        <p style={{ fontWeight: 600, marginBottom: 3 }}>{address.name} <span style={{ background: '#f0f2f5', padding: '1px 5px', fontSize: 10, borderRadius: 2, marginLeft: 6 }}>{(address.address_type || '').toUpperCase()}</span></p>
        <p style={{ color: '#565656', fontSize: 12, margin: 0 }}>{address.flat}, {address.area}, {address.city}, {address.state} - {address.pincode}</p>
        <p style={{ color: '#565656', fontSize: 12, margin: 0 }}>📞 {address.number}</p>
      </div>

      {/* Items */}
      <div style={{ background: '#fff', padding: 16, borderBottom: '8px solid #f1f2f4' }}>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
            <img src={`${base}${item.image}`} alt={item.name} style={{ width: 90, height: 90, objectFit: 'contain' }}
              onError={e => { e.target.src = 'https://placehold.co/90?text=...'; }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{item.name}</p>
              <div className="d-flex align-items-center gap-2 mb-2">
                <strong style={{ fontSize: 14 }}>₹{Number(item.total).toLocaleString()}</strong>
                <del style={{ color: '#878787', fontSize: 11 }}>₹{Number(item.price).toLocaleString()}</del>
                <span style={{ color: '#388e3c', fontSize: 11 }}>{item.discount}% off</span>
              </div>
              <span style={{ fontSize: 12, color: '#565656' }}>Qty: {item.quantity}</span>
              {item.freeQty > 0 && (
                <div style={{ background: '#e8f5e9', padding: '6px 10px', borderRadius: 4, borderLeft: '4px solid #388e3c', fontSize: 11, color: '#388e3c', fontWeight: 600, marginTop: 6 }}>
                  🎁 Buy 2 Get 1 Free — {item.freeQty} item(s) FREE!
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div style={{ background: '#fff', padding: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 12 }}>Price Details</p>
        <div className="d-flex justify-content-between mb-2"><span>MRP ({pricing.totalQty} items)</span><span>₹{pricing.totalMrp.toLocaleString()}</span></div>
        <div className="d-flex justify-content-between mb-2"><span>Discount</span><span style={{ color: '#388e3c' }}>- ₹{(pricing.itemDiscount + pricing.offerDiscount).toLocaleString()}</span></div>
        <div className="d-flex justify-content-between mb-2"><span>Coupon Discount</span><span style={{ color: '#388e3c' }}>- ₹{pricing.coupon}</span></div>
        <div className="d-flex justify-content-between mb-2"><span>Secure Packaging</span><span>₹{pricing.protect}</span></div>
        <hr />
        <div className="d-flex justify-content-between fw-bold mb-2"><span>Total Amount</span><span>₹{pricing.final.toLocaleString()}</span></div>
        <div style={{ background: '#e8f5e9', color: '#388e3c', padding: 10, borderRadius: 6, textAlign: 'center', fontWeight: 600, fontSize: 13 }}>
          🎉 You save ₹{pricing.savings.toLocaleString()} on this order!
        </div>
      </div>

      <div className="fixed-btn">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontSize: 11, color: '#878787' }}>Total</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>₹{pricing.final.toLocaleString()}</div>
          </div>
          <Link href="/payment"><button className="btn-orange" style={{ width: 'auto', padding: '12px 28px' }}>Continue</button></Link>
        </div>
      </div>
    </div>
  );
}
