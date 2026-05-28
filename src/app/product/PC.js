'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PC() {
  const sp = useSearchParams();
  const router = useRouter();
  const pid = sp.get('pid');
  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [base, setBase] = useState('');
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pid) return;
    fetch('/api/settings').then(r => r.json()).then(d => { if (d.success) setBase(d.siteUrl ? d.siteUrl + '/assets/' : ''); });
    fetch(`/api/products?id=${pid}`).then(r => r.json()).then(d => {
      if (d.success) { setP(d.data); setRelated(d.related || []); setBase(d.siteUrl ? d.siteUrl + '/assets/' : ''); }
      setLoading(false);
    });
    fetch('/api/cart').then(r => r.json()).then(d => { if (d.success) setInCart(d.items?.some(i => i.id == pid)); });
  }, [pid]);

  const addCart = async () => {
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add', pid }) });
    setInCart(true);
    window.dispatchEvent(new Event('cartUpdate'));
  };
  const buyNow = async () => { await addCart(); router.push('/address'); };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;
  if (!p) return <div className="text-center p-5">Product not found</div>;

  const rating = parseFloat(p.star) || 4.0;
  const ratingCount = Math.floor(Math.random() * 50000) + 5000;
  const delivery = new Date(Date.now() + 2 * 864e5).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  const imgs = [p.image, p.image2, p.image3].filter(Boolean);

  return (
    <div style={{ maxWidth: 1248, margin: '0 auto', background: '#fff', minHeight: '100vh', paddingBottom: 70 }}>
      <header className="pg-header-back">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => router.back()} className="btn p-0" style={{ fontSize: 22, color: '#212121' }}><i className="bi bi-arrow-left" /></button>
          <span style={{ fontSize: 15, fontWeight: 500 }}>Product Details</span>
        </div>
        <Link href="/cart" style={{ color: '#212121', fontSize: 22 }}><i className="bi bi-cart3" /></Link>
      </header>

      {/* Image Carousel */}
      <div id="pcarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {imgs.map((img, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <img src={`${base}${img}`} style={{ width: '100%', height: 320, objectFit: 'contain', padding: 10 }} alt={p.name}
                onError={e => { e.target.src = 'https://placehold.co/300x300?text=...'; }} />
            </div>
          ))}
        </div>
        {imgs.length > 1 && <>
          <button className="carousel-control-prev" type="button" data-bs-target="#pcarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon" /></button>
          <button className="carousel-control-next" type="button" data-bs-target="#pcarousel" data-bs-slide="next"><span className="carousel-control-next-icon" /></button>
        </>}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ color: '#388e3c', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
          {Math.floor(Math.random() * 2000 + 800)} people ordered this in the last 30 minutes
        </div>
        <h1 style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4, color: '#212121' }}>{p.name}</h1>
        <div className="d-flex align-items-center mt-2 gap-2">
          <span style={{ background: '#388e3c', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>{rating.toFixed(1)} ★</span>
          <span style={{ color: '#878787', fontSize: 12 }}>{ratingCount.toLocaleString()} Ratings</span>
        </div>
        <div className="d-flex align-items-center mt-3 gap-2 flex-wrap">
          <span style={{ fontSize: 26, fontWeight: 700 }}>₹{Number(p.total).toLocaleString('en-IN')}</span>
          <del style={{ color: '#878787', fontSize: 14 }}>₹{Number(p.price).toLocaleString('en-IN')}</del>
          <span style={{ color: '#388e3c', fontWeight: 700 }}>{p.discount}% Off</span>
        </div>
        {p.size && p.size !== 'NULL' && p.size !== '' && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Available Sizes</p>
            <div className="d-flex gap-2 flex-wrap">
              {p.size.split(',').map(s => <button key={s} style={{ border: '1px solid #ddd', padding: '4px 12px', borderRadius: 20, fontSize: 12, background: '#fff', cursor: 'pointer' }}>{s.trim()}</button>)}
            </div>
          </div>
        )}
      </div>

      {/* Offers */}
      <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f0f0f0' }}>
        <p style={{ fontWeight: 700, margin: '12px 0 10px' }}>Available Offers</p>
        {['₹25 instant discount on first UPI txn on orders ₹250+', '5% Cashback on Axis Bank Card', '15% off with select coupons'].map((o, i) => (
          <div key={i} className="d-flex align-items-start mb-2">
            <i className="bi bi-tag-fill me-2" style={{ color: '#388e3c', marginTop: 2, fontSize: 12 }} />
            <span style={{ fontSize: 12 }}>{o}</span>
          </div>
        ))}
      </div>

      {/* Delivery */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <i className="bi bi-truck" style={{ fontSize: 20 }} />
        <div>
          <span style={{ color: '#388e3c', fontWeight: 700 }}>FREE Delivery </span>
          <span style={{ fontSize: 12, color: '#212121' }}>by <strong>{delivery}</strong></span>
        </div>
      </div>

      {/* Similar Products */}
      {related.length > 0 && (
        <div style={{ padding: 16, borderTop: '6px solid #f1f2f4' }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>Similar Products</p>
          <div className="suggestions-scroll">
            {related.map(r => (
              <Link key={r.id} href={`/product?pid=${r.id}`} className="sug-card">
                <img src={`${base}${r.image}`} alt={r.name} onError={e => { e.target.src = 'https://placehold.co/100?text=...'; }} />
                <p style={{ fontSize: 11, height: 30, overflow: 'hidden', margin: '6px 0' }}>{r.name}</p>
                <strong style={{ fontSize: 13 }}>₹{Number(r.total).toLocaleString()}</strong>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', zIndex: 100, boxShadow: '0 -2px 6px rgba(0,0,0,.12)', maxWidth: 1248, margin: '0 auto' }}>
        {inCart
          ? <Link href="/cart" style={{ flex: 1, textAlign: 'center', padding: 15, background: '#fff', color: '#2874f0', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Go To Cart</Link>
          : <button onClick={addCart} style={{ flex: 1, padding: 15, background: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Add To Cart</button>}
        <button onClick={buyNow} style={{ flex: 1, padding: 15, background: '#FB641B', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Buy Now</button>
      </div>
    </div>
  );
}
