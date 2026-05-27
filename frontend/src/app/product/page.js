'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

function StarRating({ rating }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  for (let i = 0; i < full; i++) stars.push(<i key={`f${i}`} className="bi bi-star-fill" style={{ color: '#26a541' }}></i>);
  if (half) stars.push(<i key="h" className="bi bi-star-half" style={{ color: '#26a541' }}></i>);
  for (let i = stars.length; i < 5; i++) stars.push(<i key={`e${i}`} className="bi bi-star" style={{ color: '#e0e0e0' }}></i>);
  return <>{stars}</>;
}

export default function ProductPage() {
  const params = useSearchParams();
  const router = useRouter();
  const pid = params.get('pid');
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [siteUrl, setSiteUrl] = useState('');
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pid) return;
    apiFetch('/api/settings').then(d => { if (d.success) setSiteUrl(d.siteUrl?.replace(/\/$/, '') || ''); });
    apiFetch(`/api/products/${pid}`).then(d => {
      if (d.success) { setProduct(d.data); setRelated(d.related || []); }
      setLoading(false);
    });
    apiFetch('/api/cart').then(d => {
      if (d.success) setInCart(d.items?.some(i => i.id == pid));
    });
  }, [pid]);

  const addToCart = async () => {
    await apiFetch('/api/cart/add', { method: 'POST', body: JSON.stringify({ pid }) });
    setInCart(true);
  };

  const buyNow = async () => {
    await apiFetch('/api/cart/add', { method: 'POST', body: JSON.stringify({ pid }) });
    router.push('/address');
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
  if (!product) return <div className="text-center p-5">Product not found</div>;

  const rating = parseFloat(product.star) || 4.5;
  const totalRatings = Math.floor(Math.random() * 90000) + 10000;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="main-container">
      <header className="page-header">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => router.back()} className="btn p-0" style={{ color: '#212121', fontSize: 24 }}>
            <span className="material-icons">arrow_back</span>
          </button>
          <img src={`${siteUrl}/assets/catogary/logo.png`} alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; }} />
        </div>
        <Link href="/cart" style={{ color: '#212121' }}>
          <span className="material-icons">shopping_cart</span>
        </Link>
      </header>

      <main>
        {/* Product Image */}
        <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={`${siteUrl}/assets/uploads/${product.image}`} className="d-block"
                style={{ width: '100%', height: 350, objectFit: 'contain', padding: 10 }} alt={product.name} />
            </div>
            {[2,3,4,5,6].map(i => product[`image${i}`] ? (
              <div key={i} className="carousel-item">
                <img src={`${siteUrl}/assets/uploads/${product['image'+i]}`} className="d-block"
                  style={{ width: '100%', height: 350, objectFit: 'contain', padding: 10 }} alt={`${product.name} view ${i}`} />
              </div>
            ) : null)}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>

        {/* Product Details */}
        <div style={{ padding: '16px' }}>
          <div style={{ color: '#388e3c', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
            {Math.floor(Math.random() * 2500 + 1500)} people ordered this in the last 30 minutes
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 500 }}>{product.name}</h1>
          <div className="d-flex align-items-center mt-2 gap-2">
            <span style={{ backgroundColor: '#388e3c', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 14 }}>
              {rating.toFixed(1)} <i className="material-icons" style={{ fontSize: 12 }}>star</i>
            </span>
            <span style={{ color: '#878787' }}>{totalRatings.toLocaleString()} Ratings</span>
          </div>
          <div className="d-flex align-items-center mt-3">
            <span style={{ fontSize: 28, fontWeight: 'bold' }}>₹{Number(product.total).toLocaleString('en-IN')}</span>
            <del style={{ color: '#878787', margin: '0 12px' }}>₹{Number(product.price).toLocaleString('en-IN')}</del>
            <span style={{ color: '#388e3c', fontWeight: 'bold' }}>{product.discount}% Off</span>
          </div>
        </div>

        {/* Offers */}
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f0f0f0', marginTop: 8 }}>
          <h6 className="fw-bold mb-3 mt-3">Available offers</h6>
          {[
            'Get ₹25 instant discount on first UPI txns on orders ₹250+',
            '5% Cashback on Axis Bank Card',
            'Get extra 15% off (price inclusive of cashback/coupon)'
          ].map((offer, i) => (
            <div key={i} className="d-flex align-items-start mb-2">
              <span className="material-icons me-2" style={{ color: '#388e3c', fontSize: 18 }}>sell</span>
              <span style={{ fontSize: 14 }}>{offer}</span>
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div className="d-flex align-items-center p-3" style={{ borderTop: '1px solid #f0f0f0' }}>
          <span className="material-icons me-3">local_shipping</span>
          <div>
            <div><span style={{ color: '#388e3c', fontWeight: 'bold' }}>FREE Delivery</span> <del style={{ color: '#878787' }}>₹75</del></div>
            <div>Delivery by • <strong>{deliveryDate}</strong></div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div style={{ padding: 16, borderTop: '6px solid #f1f2f4' }}>
            <h4 className="fw-bold mb-3">Product Details</h4>
            <div style={{ color: '#555' }} dangerouslySetInnerHTML={{ __html: product.description }}></div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ padding: 16, borderTop: '6px solid #f1f2f4' }}>
            <h5 className="fw-bold mb-3">Similar Products</h5>
            <div className="suggestions-scroll">
              {related.map(p => (
                <Link key={p.id} href={`/product?pid=${p.id}`} className="suggested-card text-decoration-none text-dark">
                  <img src={`${siteUrl}/assets/uploads/${p.image}`} alt={p.name} onError={e => { e.target.style.display = 'none'; }} />
                  <p style={{ fontSize: 13, height: 36, overflow: 'hidden', margin: '8px 0' }}>{p.name}</p>
                  <div><strong>₹{Number(p.total).toLocaleString()}</strong> <del style={{ color: '#878787', fontSize: 12 }}>₹{Number(p.price).toLocaleString()}</del></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Buttons */}
      <div style={{ height: 60 }}></div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', zIndex: 100, boxShadow: '0 -2px 5px rgba(0,0,0,0.1)', maxWidth: 1248, margin: '0 auto' }}>
        {inCart ? (
          <Link href="/cart" style={{ flex: 1, textAlign: 'center', padding: 16, backgroundColor: '#fff', fontWeight: 500, textDecoration: 'none', color: '#212121', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Go To Cart
          </Link>
        ) : (
          <button onClick={addToCart} style={{ flex: 1, padding: 16, backgroundColor: '#fff', border: 'none', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>
            Add To Cart
          </button>
        )}
        <button onClick={buyNow} style={{ flex: 1, padding: 16, backgroundColor: '#FB641B', color: '#fff', border: 'none', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>
          Buy Now
        </button>
      </div>
    </div>
  );
}
