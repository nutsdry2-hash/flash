import { NextResponse } from 'next/server';
import { PRODUCTS, SITE_URL } from '@/lib/data';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (id) {
    const p = PRODUCTS.find(p => p.id === parseInt(id));
    if (!p) return NextResponse.json({ success: false });
    const related = PRODUCTS.filter(r => r.category === p.category && r.id !== p.id)
      .sort(() => Math.random() - 0.5).slice(0, 8);
    return NextResponse.json({ success: true, data: p, related, siteUrl: SITE_URL });
  }

  if (type === 'categories') {
    const cats = [...new Set(PRODUCTS.map(p => p.category).filter(Boolean))].sort();
    return NextResponse.json({ success: true, data: cats });
  }

  if (search) {
    const q = search.toLowerCase();
    const data = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 30);
    return NextResponse.json({ success: true, data, siteUrl: SITE_URL });
  }

  if (category) {
    const data = PRODUCTS.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    return NextResponse.json({ success: true, data, siteUrl: SITE_URL });
  }

  const data = PRODUCTS.slice((page - 1) * limit, page * limit);
  return NextResponse.json({ success: true, data, siteUrl: SITE_URL, hasMore: page * limit < PRODUCTS.length });
}
