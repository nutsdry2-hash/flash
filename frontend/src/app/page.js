'use client';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [settings, setSettings] = useState({});
  const [siteUrl, setSiteUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [timer, setTimer] = useState(338);

  const categories_config = [
    { name: 'Mobile', img: 'mob.webp', label: 'Mobiles' },
    { name: 'Electronics', img: 'ele.webp', label: 'Electronics' },
    { name: 'Appliances', img: 'kit.webp', label: 'Appliances' },
    { name: 'Furniture', img: 'fur.webp', label: 'Furniture' },
    { name: 'kurtis', img: 'kur.webp', label: 'Sarees' },
    { name: 'Western Wear', img: 'west.webp', label: 'Western Wear' },
    { name: 'crocs', img: 'cro.webp', label: 'Sandals' },
    { name: 'Shoes', img: 'shoes.webp', label: 'Sport Shoes' },
    { name: 'Grocery', img: 'gro.webp', label: 'Grocery' },
    { name: 'dryfruit', img: 'dryfruit.webp', label: 'Dryfruit' },
  ];

  useEffect(() => {
    apiFetch('/api/settings').then(d => {
      if (d.success) {
        setSettings(d.settings);
        setSiteUrl(d.siteUrl?.replace(/\/$/, '') || '');
      }
    });
    apiFetch('/api/products/meta/categories').then(d => {
      if (d.success) setCategories(d.data);
    });
    loadProducts(1);

    const interval = setInterval(() => setTimer(t => t <= 0 ? 338 : t - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = useCallback(async (p) => {
    if (loading || allLoaded) return;
    setLoading(true);
    const data = await apiFetch(`/api/products?page=${p}&limit=10`);
    if (data.success && data.data.length > 0) {
      setProducts(prev => [...prev, ...data.data]);
      setPage(p + 1);
    } else {
      setAllLoaded(true);
    }
    setLoading(false);
  }, [loading, allLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadProducts(page);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loadProducts]);

  const timerDisplay = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;

  return (
    <>
      <div className="main-container">
        <Header siteUrl={siteUrl} />
        <main>
          {/* Banner */}
          <div className="p-2">
            <div id="mainCarousel" className="carousel slide rounded-3 overflow-hidden" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={`${siteUrl}/assets/catogary/banner1.webp`} className="d-block w-100" alt="Banner 1"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
                <div className="carousel-item">
                  <img src={`${siteUrl}/assets/catogary/banner2.webp`} className="d-block w-100" alt="Banner 2"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div style={{ padding: '5px', background: '#fff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
              {categories_config.map(cat => (
                <div key={cat.name} style={{ textAlign: 'center' }}>
                  <Link href={`/category?name=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none', color: '#333' }}>
                    <img src={`${siteUrl}/assets/catogary/${cat.img}`} alt={cat.label}
                      style={{ width: 42, height: 42, objectFit: 'contain', marginBottom: 4 }}
                      onError={e => { e.target.style.display = 'none'; }} />
                    <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{cat.label}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Deal Banner */}
          <div className="deal-banner">
            <div>
              <div className="deal-title">Deals of the Day</div>
              <div style={{ fontSize: 15, color: '#1a73e8' }}>{timerDisplay}</div>
            </div>
            <div className="sale-badge">SALE IS LIVE</div>
          </div>

          {/* Products */}
          <section style={{ backgroundColor: '#f1f2f4', paddingTop: 1 }}>
            <div className="mainbody">
              {products.map(p => (
                <ProductCard key={p.id} product={p} siteUrl={siteUrl} />
              ))}
            </div>
            {loading && (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer brandName={settings.brand_name || 'YourStore'} categories={categories} />
    </>
  );
}
