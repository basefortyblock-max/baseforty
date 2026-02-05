// app/api/paymaster/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.PAYMASTER_URL) {
      return NextResponse.json({ error: 'Paymaster not configured' }, { status: 500 });
    }

    const body = await req.json();
    
    const response = await fetch(process.env.PAYMASTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Paymaster error:', error);
    return NextResponse.json({ error: 'Paymaster request failed' }, { status: 500 });
  }
}