'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function AboutPage() {
  const [brandName, setBrandName] = useState('YourStore');

  useEffect(() => {
    apiFetch('/api/settings').then(d => { if (d.success) setBrandName(d.settings?.brand_name || 'YourStore'); });
  }, []);

  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ color: '#212121', fontSize: 24 }}><i className="bi bi-arrow-left"></i></Link>
        <h4 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>About Us</h4>
      </header>

      <div style={{ background: '#fff', padding: 24, marginTop: 8 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>About {brandName}</h1>
        <p>Welcome to <strong>{brandName}</strong>, your premier destination for online shopping! We are dedicated to providing you with the best selection of fashion, electronics, home goods, and much more.</p>

        <h2 style={{ marginTop: 24, marginBottom: 12 }}>Our Mission</h2>
        <p>Our mission is to make online shopping easy, enjoyable, and accessible for everyone. We strive to offer a diverse range of high-quality products.</p>

        <h2 style={{ marginTop: 24, marginBottom: 12 }}>What We Offer</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>Vast Product Selection across various categories</li>
          <li style={{ marginBottom: 8 }}>Quality Assurance with carefully selected suppliers</li>
          <li style={{ marginBottom: 8 }}>Competitive Prices and best deals</li>
          <li style={{ marginBottom: 8 }}>Secure Shopping Experience</li>
          <li style={{ marginBottom: 8 }}>Fast & Reliable Delivery</li>
          <li style={{ marginBottom: 8 }}>Dedicated Customer Support</li>
        </ul>

        <p style={{ marginTop: 24 }}>Thank you for choosing <strong>{brandName}</strong>. We look forward to serving you!</p>
      </div>
    </div>
  );
}
