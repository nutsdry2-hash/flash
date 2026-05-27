'use client';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

function StarRating({ rating }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  for (let i = 0; i < full; i++) stars.push(<i key={`f${i}`} className="bi bi-star-fill"></i>);
  if (half) stars.push(<i key="h" className="bi bi-star-half"></i>);
  for (let i = stars.length; i < 5; i++) stars.push(<i key={`e${i}`} className="bi bi-star" style={{ color: '#e0e0e0' }}></i>);
  return <div className="rating-line">{stars}</div>;
}

export default function ProductCard({ product, siteUrl = '' }) {
  const wowPrice = Math.round(parseFloat(product.total) * 0.95);

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await apiFetch('/api/cart/add', { method: 'POST', body: JSON.stringify({ pid: product.id }) });
    window.location.reload();
  };

  return (
    <Link href={`/product?pid=${product.id}`} className="product-card-link">
      <div className="productcard">
        <div style={{ textAlign: 'center' }}>
          <img
            src={`${siteUrl}/assets/uploads/${product.image}`}
            className="productimage"
            alt={product.name}
            loading="lazy"
            onError={e => { e.target.src = '/placeholder.png'; }}
          />
        </div>
        <div>
          <p className="product-name">{product.name}</p>
          <div className="d-flex align-items-center flex-wrap">
            <span className="selling-price">₹{Number(product.total).toLocaleString('en-IN')}</span>
            <del className="mrp">₹{Number(product.price).toLocaleString('en-IN')}</del>
            <span className="discount">{product.discount}% off</span>
          </div>
          <div className="wow-offer">
            <span className="wow-price">₹{wowPrice.toLocaleString('en-IN')}</span>
            <span className="offer-text">with 2 offers</span>
          </div>
          <StarRating rating={parseFloat(product.star) || 4} />
        </div>
      </div>
    </Link>
  );
}
