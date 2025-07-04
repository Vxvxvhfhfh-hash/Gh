// @ts-nocheck

import { NextResponse } from 'next/server';

export async function GET() {
  const base = process.env.BOT_BASE_URL;
  if (!base) {
    return new NextResponse('BOT_BASE_URL not configured', { status: 500 });
  }
  try {
    const res = await fetch(`${base}/qr`);
    const data = await res.text();
    return new NextResponse(data, { status: res.status });
  } catch (err) {
    return new NextResponse('Error contacting bot service', { status: 502 });
  }
}