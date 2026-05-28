'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function About() {
  const [brand, setBrand] = useState('Our Store');
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { if (d.success) setBrand(d.settings?.brand_name || 'Our Store'); });
  }, []);
  return (
    <div style={{ background: '#f1f2f4', minHeight: '100vh' }}>
      <header className="pg-header-back">
        <div className="d-flex align-items-center gap-2">
          <Link href="/" style={{ color: '#212121', fontSize: 22 }}><i className="bi bi-arrow-left" /></Link>
          <span style={{ fontSize: 16, fontWeight: 500 }}>About Us</span>
        </div>
      </header>
      <div style={{ background: '#fff', padding: 24, marginTop: 8 }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>About {brand}</h1>
        <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 14 }}>Welcome to <strong>{brand}</strong>, your premier destination for online shopping! We offer the best selection of fashion, electronics, home goods and much more at competitive prices.</p>
        <h2 style={{ fontSize: 17, marginBottom: 10 }}>Our Mission</h2>
        <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 14 }}>To make online shopping easy, enjoyable and accessible for everyone with high-quality products and exceptional service.</p>
        <h2 style={{ fontSize: 17, marginBottom: 10 }}>Why Choose Us</h2>
        <ul style={{ color: '#555', lineHeight: 2, paddingLeft: 20 }}>
          <li>Vast product selection across all categories</li>
          <li>Competitive prices and best deals</li>
          <li>Secure & safe payment options</li>
          <li>Fast & reliable delivery</li>
          <li>Dedicated customer support</li>
        </ul>
        <p style={{ color: '#555', lineHeight: 1.7, marginTop: 14 }}>Thank you for choosing <strong>{brand}</strong>!</p>
      </div>
    </div>
  );
}
