import { NextResponse } from 'next/server';
import { SETTINGS, SITE_URL, UPI_ID } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ success: true, settings: SETTINGS, siteUrl: SITE_URL, upiId: UPI_ID });
}
