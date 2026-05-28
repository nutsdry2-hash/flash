import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { PRODUCTS, SITE_URL, UPI_ID } from '@/lib/data';

export async function GET(req) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type === 'address') return NextResponse.json({ success: true, address: session.address || null });

  if (type === 'payment') {
    if (!session.finalAmount) return NextResponse.json({ success: false }, { status: 400 });
    const orderId = session.orderId || ('ORD' + Date.now());
    session.orderId = orderId;
    await session.save();
    return NextResponse.json({ success: true, finalAmount: session.finalAmount, orderId, upiId: UPI_ID, address: session.address });
  }

  // Summary
  const cart = session.cart || {};
  const address = session.address;
  if (!Object.keys(cart).length || !address)
    return NextResponse.json({ success: false, message: 'Cart or address missing' }, { status: 400 });

  const ids = Object.keys(cart).map(Number);
  const prods = PRODUCTS.filter(p => ids.includes(p.id));

  let totalMrp = 0, totalQty = 0, expanded = [];
  prods.forEach(p => {
    const qty = cart[p.id] || 1;
    totalQty += qty;
    totalMrp += p.price * qty;
    for (let i = 0; i < qty; i++) expanded.push({ ...p });
  });

  const freeCount = totalQty >= 3 ? Math.floor(totalQty / 3) : 0;
  if (freeCount) {
    expanded.sort((a, b) => a.total - b.total);
    for (let i = 0; i < freeCount; i++) if (expanded[i]) expanded[i].isFree = true;
  }

  const processed = {};
  expanded.forEach(item => {
    if (!processed[item.id]) processed[item.id] = { ...item, quantity: 0, freeQty: 0, imageUrl: `${SITE_URL}/assets/${item.image}` };
    processed[item.id].quantity++;
    if (item.isFree) processed[item.id].freeQty++;
  });

  let sellingTotal = 0, payableTotal = 0;
  Object.values(processed).forEach(p => {
    sellingTotal += p.total * p.quantity;
    payableTotal += p.total * (p.quantity - p.freeQty);
  });

  const itemDiscount = totalMrp - sellingTotal;
  const offerDiscount = sellingTotal - payableTotal;
  const coupon = 20, protect = 20;
  const final = Math.round(payableTotal - coupon + protect);
  const savings = Math.round(itemDiscount + offerDiscount + coupon);

  session.finalAmount = final;
  await session.save();

  return NextResponse.json({
    success: true, address,
    items: Object.values(processed),
    pricing: {
      totalMrp: Math.round(totalMrp),
      itemDiscount: Math.round(itemDiscount),
      offerDiscount: Math.round(offerDiscount),
      coupon, protect, final, savings, totalQty, freeCount
    }
  });
}

export async function POST(req) {
  const session = await getSession();
  const body = await req.json();
  const { name, number, pin, state, city, flat, area, address_type } = body;
  session.address = { name, number, pincode: pin, state, city, flat, area, address_type: address_type || 'Home' };
  await session.save();
  return NextResponse.json({ success: true });
}
