'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function OrderSummaryPage() {
  const [summary, setSummary] = useState(null);
  const [siteUrl, setSiteUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiFetch('/api/settings').then(d => { if (d.success) setSiteUrl(d.siteUrl?.replace(/\/$/, '') || ''); });
    apiFetch('/api/order/summary').then(d => {
      if (d.success) setSummary(d);
      else router.push('/address');
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
  if (!summary) return null;

  const { address, items, pricing } = summary;

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh', paddingBottom: 100 }}>
      <header style={{ backgroundColor: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/address" style={{ color: '#212121', fontSize: 24 }}><i className="bi bi-arrow-left"></i></Link>
        <h4 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>Order Summary</h4>
      </header>

      {/* Stepper */}
      <div className="stepper" style={{ background: '#fff' }}>
        <div className="step done"><div className="step-circle">✓</div><div className="step-label">Address</div></div>
        <div className="step active"><div className="step-circle">2</div><div className="step-label">Order Summary</div></div>
        <div className="step"><div className="step-circle">3</div><div className="step-label">Payment</div></div>
      </div>

      {/* Address */}
      <div style={{ background: '#fff', padding: 16, borderBottom: '8px solid #f1f2f4' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 fw-bold">Deliver to:</h6>
          <Link href="/address" style={{ border: '1px solid #2874f0', color: '#2874f0', padding: '4px 12px', borderRadius: 4, fontSize: 13, textDecoration: 'none' }}>Change</Link>
        </div>
        <p className="mb-1 fw-bold">{address.name} <span style={{ background: '#f0f2f5', padding: '2px 6px', fontSize: 10, borderRadius: 2, marginLeft: 8 }}>{(address.address_type || '').toUpperCase()}</span></p>
        <p style={{ color: '#565656', fontSize: 13, margin: '0 0 4px' }}>{address.flat}, {address.area}, {address.city}</p>
        <p style={{ color: '#565656', fontSize: 13, margin: 0 }}>{address.number}</p>
      </div>

      {/* Items */}
      <div style={{ background: '#fff', padding: 16, borderBottom: '8px solid #f1f2f4' }}>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <img src={`${siteUrl}/assets/uploads/${item.image}`} alt={item.name}
              style={{ width: 100, height: 100, objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>{item.name}</p>
              <div className="d-flex align-items-center gap-2 mb-2">
                <strong>₹{Number(item.total).toLocaleString()}</strong>
                <del style={{ color: '#878787', fontSize: 12 }}>₹{Number(item.price).toLocaleString()}</del>
                <span style={{ color: '#388e3c', fontSize: 12 }}>{item.discount}% off</span>
              </div>
              {item.freeQuantity > 0 && (
                <div style={{ background: '#eaf5ec', padding: '8px 12px', borderRadius: 5, borderLeft: '5px solid #198754', fontSize: 12, color: '#388e3c', fontWeight: 'bold' }}>
                  <i className="bi bi-tag-fill me-1"></i>Buy 2 Get 1 Free Applied ({item.freeQuantity} FREE)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div style={{ background: '#fff', padding: 16 }}>
        <h6 className="fw-bold mb-3">Price Details</h6>
        <div className="d-flex justify-content-between mb-3"><span>Price ({pricing.totalQuantity} items)</span><span>₹{pricing.totalMrp.toLocaleString()}</span></div>
        <div className="d-flex justify-content-between mb-3"><span>Discount</span><span style={{ color: '#388e3c' }}>- ₹{(pricing.totalItemDiscount + pricing.offerDiscount).toLocaleString()}</span></div>
        <div className="d-flex justify-content-between mb-3"><span>Coupons for you</span><span style={{ color: '#388e3c' }}>- ₹{pricing.couponDiscount}</span></div>
        <div className="d-flex justify-content-between mb-3"><span>Secure Packaging Fee</span><span>₹{pricing.protectFee}</span></div>
        <hr />
        <div className="d-flex justify-content-between fw-bold fs-6 mb-3"><span>Total Amount</span><span>₹{pricing.finalAmount.toLocaleString()}</span></div>
        <div style={{ background: '#e4f8e8', color: '#388e3c', padding: 12, borderRadius: 8, textAlign: 'center', fontWeight: 500 }}>
          <i className="bi bi-tag-fill me-2"></i>You will save ₹{pricing.totalSavings.toLocaleString()} on this order!
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e0e0e0', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)', zIndex: 101 }}>
        <div>
          <del style={{ color: '#878787', fontSize: 12 }}>₹{pricing.totalMrp.toLocaleString()}</del>
          <div style={{ fontSize: 17, fontWeight: 'bold' }}>₹{pricing.finalAmount.toLocaleString()}</div>
        </div>
        <Link href="/payment" style={{ textDecoration: 'none', width: '50%' }}>
          <button style={{ width: '100%', backgroundColor: '#ffc107', color: '#000', border: 'none', padding: 12, fontSize: 15, fontWeight: 500, borderRadius: 4, cursor: 'pointer' }}>
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
}
