import { NextResponse } from 'next/server'
import { defaultSuppliers, type SupplierItem } from '@/lib/inventory-data'

let inMemorySuppliers = [...defaultSuppliers]

export async function GET() {
  return NextResponse.json({ suppliers: inMemorySuppliers })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, code, contactPerson, email, phone, gstin, paymentTerms } = body

    if (!name || !code) {
      return NextResponse.json({ error: 'Supplier name and code are required' }, { status: 400 })
    }

    const newSupplier: SupplierItem = {
      supplierId: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name,
      code,
      contactPerson: contactPerson || 'Primary Contact',
      email: email || 'contact@supplier.com',
      phone: phone || '+91 98000 00000',
      gstin: gstin || undefined,
      paymentTerms: paymentTerms || 'Net 30',
      status: 'ACTIVE',
      productsCount: 0,
    }

    inMemorySuppliers.unshift(newSupplier)

    return NextResponse.json({
      success: true,
      supplier: newSupplier,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add supplier' }, { status: 500 })
  }
}
