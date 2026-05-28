'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal"];

export default function AddressPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: '', number: '', pin: '', state: '', city: '', flat: '', area: '', address_type: 'Home' });
  const [err, setErr] = useState({});

  useEffect(() => {
    fetch('/api/order?type=address').then(r => r.json()).then(d => {
      if (d.success && d.address) setF(v => ({ ...v, ...d.address, pin: d.address.pincode || '' }));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.name.trim()) errs.name = 'Required';
    if (!/^\d{10}$/.test(f.number)) errs.number = 'Enter valid 10-digit number';
    if (!/^\d{6}$/.test(f.pin)) errs.pin = 'Enter valid 6-digit pincode';
    if (!f.state) errs.state = 'Required';
    if (!f.city.trim()) errs.city = 'Required';
    if (!f.flat.trim()) errs.flat = 'Required';
    if (Object.keys(errs).length) { setErr(errs); return; }
    const res = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    const d = await res.json();
    if (d.success) router.push('/order-summary');
  };

  const field = (id, label, type = 'text', extra = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, color: '#878787', marginBottom: 4, display: 'block' }}>{label}</label>
      <input type={type} className="form-control" value={f[id]} {...extra}
        onChange={e => setF(v => ({ ...v, [id]: e.target.value }))} />
      {err[id] && <div style={{ color: 'red', fontSize: 11, marginTop: 3 }}>{err[id]}</div>}
    </div>
  );

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header className="pg-header-back">
        <div className="d-flex align-items-center gap-2">
          <Link href="/cart" style={{ color: '#212121', fontSize: 22 }}><i className="bi bi-arrow-left" /></Link>
          <span style={{ fontSize: 16, fontWeight: 500 }}>Delivery Address</span>
        </div>
      </header>
      <div style={{ background: '#fff' }}>
        <div className="stepper">
          <div className="step active"><div className="step-circle">1</div><div className="step-label">Address</div></div>
          <div className="step"><div className="step-circle">2</div><div className="step-label">Order Summary</div></div>
          <div className="step"><div className="step-circle">3</div><div className="step-label">Payment</div></div>
        </div>
        <form onSubmit={submit} style={{ padding: 16, paddingBottom: 100 }}>
          {field('name', 'Full Name')}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#878787', marginBottom: 4, display: 'block' }}>+91 Mobile Number</label>
            <input type="tel" className="form-control" value={f.number} maxLength={10}
              onChange={e => setF(v => ({ ...v, number: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
            {err.number && <div style={{ color: 'red', fontSize: 11, marginTop: 3 }}>{err.number}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#878787', marginBottom: 4, display: 'block' }}>Pincode</label>
            <input type="tel" className="form-control" value={f.pin} maxLength={6}
              onChange={e => setF(v => ({ ...v, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))} />
            {err.pin && <div style={{ color: 'red', fontSize: 11, marginTop: 3 }}>{err.pin}</div>}
          </div>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label style={{ fontSize: 12, color: '#878787', marginBottom: 4, display: 'block' }}>City</label>
              <input type="text" className="form-control" value={f.city} onChange={e => setF(v => ({ ...v, city: e.target.value }))} />
              {err.city && <div style={{ color: 'red', fontSize: 11 }}>{err.city}</div>}
            </div>
            <div className="col-6">
              <label style={{ fontSize: 12, color: '#878787', marginBottom: 4, display: 'block' }}>State</label>
              <select className="form-select" value={f.state} onChange={e => setF(v => ({ ...v, state: e.target.value }))}>
                <option value="">Select</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {err.state && <div style={{ color: 'red', fontSize: 11 }}>{err.state}</div>}
            </div>
          </div>
          {field('flat', 'House No., Building Name')}
          {field('area', 'Road, Area, Colony')}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: '#878787', marginBottom: 8 }}>Address Type</p>
            <div className="d-flex gap-3">
              {['Home', 'Work'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: `1px solid ${f.address_type === t ? '#2874f0' : '#ddd'}`, padding: '7px 14px', borderRadius: 20, background: f.address_type === t ? '#f0f5ff' : '#fff', color: f.address_type === t ? '#2874f0' : '#212121', fontWeight: f.address_type === t ? 600 : 400, fontSize: 13 }}>
                  <input type="radio" style={{ display: 'none' }} checked={f.address_type === t} onChange={() => setF(v => ({ ...v, address_type: t }))} />
                  <i className={`bi bi-${t === 'Home' ? 'house-door-fill' : 'building-fill'}`} /> {t}
                </label>
              ))}
            </div>
          </div>
          <div className="fixed-btn">
            <button type="submit" className="btn-orange">Save and Deliver Here</button>
          </div>
        </form>
      </div>
    </div>
  );
}
