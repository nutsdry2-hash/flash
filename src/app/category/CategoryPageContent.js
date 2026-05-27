'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { apiFetch } from '@/lib/api';

export default function CategoryPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const name = params.get('name') || '';
  const [products, setProducts] = useState([]);
  const [siteUrl, setSiteUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!name) return;
    apiFetch('/api/settings').then(d => { if (d.success) setSiteUrl(d.siteUrl?.replace(/\/$/, '') || ''); });
    apiFetch(`/api/products/category/${encodeURIComponent(name)}`).then(d => {
      if (d.success) setProducts(d.data);
      setLoading(false);
    });
    apiFetch('/api/cart/count').then(d => { if (d.success) setCartCount(d.count); });
  }, [name]);

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => router.back()} className="btn p-0" style={{ fontSize: 24, color: '#212121' }}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <img src={`${siteUrl}/assets/catogary/logo.png`} alt="Logo" style={{ height: 32 }}
            onError={e => { e.target.style.display = 'none'; }} />
          <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{name}</h1>
        </div>
        <Link href="/cart" style={{ color: '#212121', position: 'relative', fontSize: 24 }}>
          <i className="bi bi-cart3"></i>
          {cartCount > 0 && <span className="badge bg-danger rounded-pill" style={{ position: 'absolute', top: -8, right: -10, fontSize: 10 }}>{cartCount}</span>}
        </Link>
      </header>

      {loading ? (
        <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="mainbody" style={{ marginTop: 1 }}>
          {products.length > 0 ? products.map(p => (
            <ProductCard key={p.id} product={p} siteUrl={siteUrl} />
          )) : (
            <div style={{ gridColumn: '1 / -1', padding: 40, background: '#fff', textAlign: 'center' }}>
              No products found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
