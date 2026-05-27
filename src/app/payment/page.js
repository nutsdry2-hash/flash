'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function PaymentPage() {
  const [payInfo, setPayInfo] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [selected, setSelected] = useState('phonepe');
  const [showLoader, setShowLoader] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(null);

  useEffect(() => {
    apiFetch('/api/order/payment-info').then(d => { if (d.success) setPayInfo(d); });
    apiFetch('/api/settings').then(d => { if (d.success) setUpiId(d.upiId || ''); });
  }, []);

  const handlePay = () => {
    if (!payInfo) return;
    const amt = payInfo.finalAmount;
    const orderId = payInfo.orderId;
    let url = '';

    switch (selected) {
      case 'phonepe':
        url = `phonepe://pay?ver=01&mode=19&pa=${upiId}&pn=Verified%20Seller&tr=${orderId}&cu=INR&mc=4215&qrMedium=04&tn=${orderId}&am=${amt}`;
        break;
      case 'paytm':
        url = `paytmmp://cash_wallet?pa=${upiId}&pn=Verified%20Seller&tr=${orderId}&am=${amt}&cu=INR&tn=Online+Shopping`;
        break;
      case 'upi':
        url = `https://upi2qr.in/pay?name=Online+Payment&upiId=${upiId}&amount=${amt}&description=Pay_${orderId}`;
        break;
      default:
        return;
    }

    setShowLoader(true);
    window.location.href = url;
    const timer = setTimeout(() => { window.location.href = '/'; }, 15000);
    setRedirectTimer(timer);
  };

  const closeLoader = () => {
    setShowLoader(false);
    if (redirectTimer) clearTimeout(redirectTimer);
  };

  const amt = payInfo?.finalAmount || 0;

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      {showLoader && (
        <div className="loader-overlay">
          <button onClick={closeLoader} style={{ position: 'absolute', top: 20, right: 20, background: '#e0e0e0', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 20 }}>
            <i className="bi bi-x-lg"></i>
          </button>
          <div className="loader"></div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#555' }}>Processing your payment...</div>
          <div style={{ fontSize: 12, color: '#878787' }}>Please complete the payment in your UPI app.</div>
        </div>
      )}

      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff' }}>
        <header style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0' }}>
          <div className="d-flex align-items-center gap-3">
            <Link href="/order-summary" style={{ color: '#212121', fontSize: 20 }}><i className="bi bi-arrow-left"></i></Link>
            <span style={{ fontSize: 15, fontWeight: 500 }}>Payment</span>
          </div>
          <div style={{ background: '#f0f2f5', padding: '6px 10px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
            <i className="bi bi-lock-fill me-1"></i>100% Secure
          </div>
        </header>

        <main style={{ paddingBottom: 100 }}>
          {/* UPI Options */}
          <div style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="https://i.ibb.co/9mXRgLBm/pay.webp" height="24" alt="UPI" onError={e => { e.target.style.display = 'none'; }} />
              <strong>UPI Payment</strong>
            </div>

            {[
              { value: 'phonepe', label: 'PhonePe', img: '', note: '20% Extra Discount By PhonePe', color: '#581c87' },
              { value: 'paytm', label: 'Paytm', img: '', note: '20% Extra Discount By Paytm', color: '#388e3c' },
              { value: 'upi', label: 'Pay With QR', img: '', note: '', color: '' },
            ].map(opt => (
              <div key={opt.value} onClick={() => setSelected(opt.value)}
                style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                <input type="radio" name="pay" value={opt.value} checked={selected === opt.value} onChange={() => setSelected(opt.value)}
                  style={{ width: 20, height: 20, marginRight: 16, accentColor: '#2874f0' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>₹{Number(amt).toLocaleString()} | {opt.label}</div>
                  {opt.note && <div style={{ fontSize: 11, color: opt.color || '#388e3c', fontWeight: 500 }}>{opt.note}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Price */}
          <div style={{ padding: 16 }}>
            <h6 className="fw-bold mb-3">Price Details</h6>
            <div className="d-flex justify-content-between mb-3"><span>Price</span><span>₹{Number(amt).toLocaleString()}</span></div>
            <div className="d-flex justify-content-between mb-3"><span>Delivery Charges</span><span style={{ color: '#388e3c' }}>FREE</span></div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-6"><span>Total Amount</span><span>₹{Number(amt).toLocaleString()}</span></div>
          </div>
        </main>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 600, margin: '0 auto', background: '#fff', borderTop: '1px solid #e0e0e0', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)', zIndex: 100 }}>
          <span style={{ fontSize: 17, fontWeight: 'bold' }}>₹{Number(amt).toLocaleString()}</span>
          <button onClick={handlePay}
            style={{ backgroundColor: '#fb641b', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: 4, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
