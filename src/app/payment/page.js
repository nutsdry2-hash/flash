'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Payment() {
  const [info, setInfo] = useState(null);
  const [method, setMethod] = useState('phonepe');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    fetch('/api/order?type=payment').then(r => r.json()).then(d => { if (d.success) setInfo(d); });
  }, []);

  const pay = () => {
    if (!info) return;
    const { finalAmount: amt, orderId, upiId } = info;
    const urls = {
      phonepe: `phonepe://pay?ver=01&mode=19&pa=${upiId}&pn=Verified+Seller&tr=${orderId}&cu=INR&am=${amt}`,
      paytm: `paytmmp://cash_wallet?pa=${upiId}&pn=Verified+Seller&tr=${orderId}&am=${amt}&cu=INR`,
      gpay: `tez://upi/pay?pa=${upiId}&pn=Verified+Seller&tr=${orderId}&am=${amt}&cu=INR`,
      upi: `upi://pay?pa=${upiId}&pn=Verified+Seller&tr=${orderId}&am=${amt}&cu=INR`,
    };
    setShowLoader(true);
    window.location.href = urls[method];
    setTimeout(() => { window.location.href = '/'; }, 20000);
  };

  const amt = info?.finalAmount || 0;

  const payMethods = [
    { id: 'phonepe', label: 'PhonePe', note: '20% Extra Cashback via PhonePe', color: '#7c3aed' },
    { id: 'paytm', label: 'Paytm', note: '20% Extra Cashback via Paytm', color: '#00baf2' },
    { id: 'gpay', label: 'Google Pay', note: '', color: '#4285F4' },
    { id: 'upi', label: 'Other UPI / QR Code', note: '', color: '#555' },
  ];

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      {showLoader && (
        <div className="loader-overlay">
          <button onClick={() => setShowLoader(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#eee', border: 'none', borderRadius: '50%', width: 38, height: 38, fontSize: 18, cursor: 'pointer' }}>✕</button>
          <div className="loader" />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>Opening payment app...</div>
          <div style={{ fontSize: 12, color: '#878787' }}>Complete payment in your UPI app</div>
        </div>
      )}
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', minHeight: '100vh', paddingBottom: 80 }}>
        <header className="pg-header-back">
          <div className="d-flex align-items-center gap-2">
            <Link href="/order-summary" style={{ color: '#212121', fontSize: 22 }}><i className="bi bi-arrow-left" /></Link>
            <span style={{ fontSize: 16, fontWeight: 500 }}>Payment</span>
          </div>
          <span style={{ background: '#f0f2f5', padding: '5px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
            <i className="bi bi-lock-fill me-1" />100% Secure
          </span>
        </header>

        <div style={{ padding: 16 }}>
          <p style={{ fontWeight: 700, marginBottom: 14 }}>Select Payment Method</p>
          {payMethods.map(m => (
            <div key={m.id} onClick={() => setMethod(m.id)}
              style={{ display: 'flex', alignItems: 'center', padding: '14px 12px', borderRadius: 8, border: `2px solid ${method === m.id ? '#2874f0' : '#e0e0e0'}`, marginBottom: 10, cursor: 'pointer', background: method === m.id ? '#f0f5ff' : '#fff' }}>
              <input type="radio" checked={method === m.id} readOnly style={{ marginRight: 12, accentColor: '#2874f0', width: 18, height: 18 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: m.color }}>{m.label}</div>
                {m.note && <div style={{ fontSize: 11, color: '#388e3c', fontWeight: 500, marginTop: 2 }}>{m.note}</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>Price Details</p>
          <div className="d-flex justify-content-between mb-2"><span>Order Amount</span><span>₹{Number(amt).toLocaleString()}</span></div>
          <div className="d-flex justify-content-between mb-2"><span>Delivery</span><span style={{ color: '#388e3c' }}>FREE</span></div>
          <hr />
          <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{Number(amt).toLocaleString()}</span></div>
        </div>

        <div className="fixed-btn" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div style={{ fontSize: 11, color: '#878787' }}>Pay</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>₹{Number(amt).toLocaleString()}</div>
            </div>
            <button onClick={pay} className="btn-orange" style={{ width: 'auto', padding: '12px 28px' }}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
