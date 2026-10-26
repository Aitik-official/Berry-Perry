import { NextResponse } from 'next/server'
import { defaultTransactions } from '@/lib/inventory-data'

export async function GET() {
  return NextResponse.json({ transactions: defaultTransactions })
}
