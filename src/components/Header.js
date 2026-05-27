'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function Header({ siteUrl = '' }) {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    apiFetch('/api/cart/count').then(d => { if (d.success) setCartCount(d.count); });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <header className="page-header">
      <div className="top-bar">
        <div className="d-flex align-items-center gap-2">
          <button className="btn p-0 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu">
            <i className="bi bi-list" style={{ fontSize: 24, color: '#212121' }}></i>
          </button>
          <Link href="/">
            <img src={`${siteUrl}/assets/catogary/svg-image-1.svg`} alt="Logo" className="logo-img"
              onError={e => { e.target.style.display = 'none'; }} />
          </Link>
        </div>
        <Link href="/cart" style={{ color: '#212121', position: 'relative' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#212121">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-1.45-5c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.24 17 6.5 17h12v-2H6.5c-.25 0-.42-.21-.38-.45l.93-1.68h7.45z"/>
          </svg>
          {cartCount > 0 && (
            <span className="badge bg-danger rounded-pill" style={{ position: 'absolute', top: -8, right: -10, fontSize: 10 }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      <form onSubmit={handleSearch}>
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6, marginRight: 12 }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" placeholder="Search for Products" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </form>
    </header>
  );
}
