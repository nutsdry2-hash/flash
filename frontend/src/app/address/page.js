'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal"];

export default function AddressPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', number: '', pin: '', state: '', city: '', flat: '', area: '', address_type: 'Home' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    apiFetch('/api/order/address').then(d => { if (d.success && d.address) setForm(f => ({ ...f, ...d.address, pin: d.address.pincode || '' })); });
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^\d{10}$/.test(form.number)) e.number = 'Enter valid 10-digit number';
    if (!/^\d{6}$/.test(form.pin)) e.pin = 'Enter valid 6-digit pincode';
    if (!form.state) e.state = 'Select state';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.flat.trim()) e.flat = 'House/Building is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const res = await apiFetch('/api/order/address', { method: 'POST', body: JSON.stringify(form) });
    if (res.success) router.push('/order-summary');
  };

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#fff', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/cart" style={{ color: '#212121', fontSize: 24 }}><i className="bi bi-arrow-left"></i></Link>
        <h4 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Address</h4>
      </header>

      <div style={{ background: '#fff', marginTop: 0 }}>
        {/* Stepper */}
        <div className="stepper">
          <div className="step active"><div className="step-circle">1</div><div className="step-label">Address</div></div>
          <div className="step"><div className="step-circle">2</div><div className="step-label">Order Summary</div></div>
          <div className="step"><div className="step-circle">3</div><div className="step-label">Payment</div></div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 16, paddingBottom: 100 }}>
          {[
            { id: 'name', label: 'Full Name', type: 'text' },
          ].map(f => (
            <div key={f.id} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#878787', marginBottom: 4, display: 'block' }}>{f.label}</label>
              <input type={f.type} className="form-control" value={form[f.id]}
                onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} />
              {errors[f.id] && <div style={{ color: 'red', fontSize: 12 }}>{errors[f.id]}</div>}
            </div>
          ))}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#878787', marginBottom: 4, display: 'block' }}>+91 Mobile Number</label>
            <input type="tel" className="form-control" value={form.number} maxLength={10}
              onChange={e => setForm(p => ({ ...p, number: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
            {errors.number && <div style={{ color: 'red', fontSize: 12 }}>{errors.number}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#878787', marginBottom: 4, display: 'block' }}>Pincode</label>
            <input type="tel" className="form-control" value={form.pin} maxLength={6}
              onChange={e => setForm(p => ({ ...p, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))} />
            {errors.pin && <div style={{ color: 'red', fontSize: 12 }}>{errors.pin}</div>}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label style={{ fontSize: 13, color: '#878787', marginBottom: 4, display: 'block' }}>City</label>
              <input type="text" className="form-control" value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
              {errors.city && <div style={{ color: 'red', fontSize: 12 }}>{errors.city}</div>}
            </div>
            <div className="col-6">
              <label style={{ fontSize: 13, color: '#878787', marginBottom: 4, display: 'block' }}>State</label>
              <select className="form-select" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}>
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <div style={{ color: 'red', fontSize: 12 }}>{errors.state}</div>}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#878787', marginBottom: 4, display: 'block' }}>House No., Building Name</label>
            <input type="text" className="form-control" value={form.flat}
              onChange={e => setForm(p => ({ ...p, flat: e.target.value }))} />
            {errors.flat && <div style={{ color: 'red', fontSize: 12 }}>{errors.flat}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#878787', marginBottom: 4, display: 'block' }}>Road name, Area, Colony</label>
            <input type="text" className="form-control" value={form.area}
              onChange={e => setForm(p => ({ ...p, area: e.target.value }))} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#878787', marginBottom: 8 }}>Type of address</p>
            <div className="d-flex gap-3">
              {['Home', 'Work'].map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: `1px solid ${form.address_type === type ? '#2874f0' : '#dcdcdc'}`, padding: '8px 16px', borderRadius: 20, backgroundColor: form.address_type === type ? '#f0f5ff' : '#fff', color: form.address_type === type ? '#2874f0' : '#212121', fontWeight: form.address_type === type ? 500 : 400, fontSize: 14 }}>
                  <input type="radio" name="address_type" value={type} checked={form.address_type === type} onChange={e => setForm(p => ({ ...p, address_type: type }))} style={{ display: 'none' }} />
                  <i className={`bi bi-${type === 'Home' ? 'house-door-fill' : 'building-fill'}`}></i> {type}
                </label>
              ))}
            </div>
          </div>

          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', padding: '12px 16px', borderTop: '1px solid #e0e0e0', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)', zIndex: 100 }}>
            <button type="submit" style={{ width: '100%', backgroundColor: '#fb641b', color: '#fff', border: 'none', padding: 14, fontSize: 16, fontWeight: 500, borderRadius: 4, cursor: 'pointer' }}>
              Save and Deliver Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
