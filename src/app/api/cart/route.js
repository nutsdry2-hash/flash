import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { PRODUCTS, SITE_URL } from '@/lib/data';

export async function GET(req) {
  const session = await getSession();
  const cart = session.cart || {};
  const { searchParams } = new URL(req.url);

  if (searchParams.get('type') === 'count') {
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    return NextResponse.json({ success: true, count });
  }

  const ids = Object.keys(cart).map(Number);
  if (!ids.length) return NextResponse.json({ success: true, items: [], subtotal: 0, count: 0 });

  const items = PRODUCTS.filter(p => ids.includes(p.id)).map(p => ({
    ...p,
    quantity: cart[p.id] || 1,
    imageUrl: `${SITE_URL}/assets/${p.image}`
  }));

  const subtotal = items.reduce((s, i) => s + i.total * i.quantity, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return NextResponse.json({ success: true, items, subtotal: subtotal.toFixed(2), count });
}

export async function POST(req) {
  const session = await getSession();
  const { action, pid, qty } = await req.json();
  if (!session.cart) session.cart = {};
  const id = parseInt(pid);

  if (action === 'add') session.cart[id] = (session.cart[id] || 0) + 1;
  else if (action === 'remove') delete session.cart[id];
  else if (action === 'increase') session.cart[id] = (session.cart[id] || 0) + 1;
  else if (action === 'decrease') {
    session.cart[id] = (session.cart[id] || 1) - 1;
    if (session.cart[id] <= 0) delete session.cart[id];
  } else if (action === 'set') {
    const q = parseInt(qty);
    if (q <= 0) delete session.cart[id]; else session.cart[id] = q;
  }

  await session.save();
  const count = Object.values(session.cart).reduce((a, b) => a + b, 0);
  return NextResponse.json({ success: true, count });
}
