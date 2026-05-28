'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CC() {
  const sp = useSearchParams();
  const router = useRouter();
  const name = sp.get('name') || '';
  const search = sp.get('search') || '';
  const [prods, setProds] = useState([]);
  const [base, setBase] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { if (d.success) setBase(d.siteUrl ? d.siteUrl + '/assets/' : ''); });
    fetch('/api/cart?type=count').then(r => r.json()).then(d => { if (d.success) setCartCount(d.count); });
    const url = search ? `/api/products?search=${encodeURIComponent(search)}` : `/api/products?category=${encodeURIComponent(name)}`;
    fetch(url).then(r => r.json()).then(d => { if (d.success) setProds(d.data); setLoading(false); });
  }, [name, search]);

  const title = search ? `"${search}"` : name;

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header className="pg-header-back">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => router.back()} className="btn p-0" style={{ fontSize: 22, color: '#212121' }}><i className="bi bi-arrow-left" /></button>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
        </div>
        <Link href="/cart" style={{ color: '#212121', position: 'relative', fontSize: 22 }}>
          <i className="bi bi-cart3" />
          {cartCount > 0 && <span className="badge bg-danger rounded-pill" style={{ position: 'absolute', top: -8, right: -10, fontSize: 9 }}>{cartCount}</span>}
        </Link>
      </header>
      {loading
        ? <div className="text-center p-5"><div className="spinner-border text-primary" /></div>
        : <div className="mainbody" style={{ marginTop: 1 }}>
            {prods.length > 0 ? prods.map(p => (
              <Link key={p.id} href={`/product?pid=${p.id}`} className="pcard">
                <div className="pcard-inner">
                  <img src={`${base}${p.image}`} className="pimg" alt={p.name} loading="lazy"
                    onError={e => { e.target.src = 'https://placehold.co/150x150?text=...'; }} />
                  <p className="pname">{p.name}</p>
                  <div className="d-flex align-items-center flex-wrap">
                    <span className="pprice">₹{Number(p.total).toLocaleString('en-IN')}</span>
                    <del className="pmrp">₹{Number(p.price).toLocaleString('en-IN')}</del>
                    <span className="pdisc">{p.discount}% off</span>
                  </div>
                </div>
              </Link>
            )) : <div style={{ gridColumn: '1/-1', padding: 40, background: '#fff', textAlign: 'center' }}>No products found.</div>}
          </div>}
    </div>
  );
}
