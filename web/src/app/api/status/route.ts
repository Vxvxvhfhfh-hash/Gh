// @ts-nocheck
import { NextResponse } from 'next/server';

export async function GET() {
  const base = process.env.BOT_BASE_URL;
  if (!base) {
    return NextResponse.json({ ready: false, error: 'BOT_BASE_URL not configured' }, { status: 500 });
  }
  try {
    const res = await fetch(`${base}/status`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ ready: false }, { status: 502 });
  }
}