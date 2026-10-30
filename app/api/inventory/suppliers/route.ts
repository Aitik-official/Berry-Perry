import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Supplier from '@/models/Supplier'
import { defaultSuppliers } from '@/lib/inventory-data'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    let suppliers = await Supplier.find().sort({ createdAt: -1 }).lean()

    if (!suppliers || suppliers.length === 0) {
      const seedDocs = defaultSuppliers.map((s) => ({
        supplierId: s.supplierId,
        name: s.name,
        code: s.code,
        contactPerson: s.contactPerson,
        email: s.email,
        phone: s.phone,
        gstin: s.gstin || '',
        paymentTerms: s.paymentTerms,
        status: s.status,
        productsCount: s.productsCount || 0,
      }))
      await Supplier.insertMany(seedDocs).catch(() => null)
      suppliers = await Supplier.find().sort({ createdAt: -1 }).lean()
    }

    return NextResponse.json({
      suppliers: suppliers.map((s: any) => ({
        supplierId: s.supplierId,
        name: s.name,
        code: s.code,
        contactPerson: s.contactPerson,
        email: s.email,
        phone: s.phone,
        gstin: s.gstin,
        paymentTerms: s.paymentTerms,
        status: s.status,
        productsCount: s.productsCount,
      })),
    })
  } catch (error: any) {
    console.error('GET /api/inventory/suppliers error:', error)
    return NextResponse.json({ suppliers: defaultSuppliers })
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const { name, code, contactPerson, email, phone, gstin, paymentTerms, address, city, state, pincode } = body

    if (!name || !code) {
      return NextResponse.json({ error: 'Supplier name and code are required' }, { status: 400 })
    }

    const supplierId = `SUP-${Math.floor(100 + Math.random() * 900)}`

    const newSupplier = await Supplier.create({
      supplierId,
      name,
      code,
      contactPerson: contactPerson || 'Primary Contact',
      email: email || 'contact@supplier.com',
      phone: phone || '+91 98000 00000',
      gstin: gstin || '',
      paymentTerms: paymentTerms || 'Net 30',
      status: 'ACTIVE',
      productsCount: 0,
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
    })

    return NextResponse.json({
      success: true,
      supplier: {
        supplierId: newSupplier.supplierId,
        name: newSupplier.name,
        code: newSupplier.code,
        contactPerson: newSupplier.contactPerson,
        email: newSupplier.email,
        phone: newSupplier.phone,
        gstin: newSupplier.gstin,
        paymentTerms: newSupplier.paymentTerms,
        status: newSupplier.status,
        productsCount: newSupplier.productsCount,
      },
    })
  } catch (err: any) {
    console.error('POST /api/inventory/suppliers error:', err)
    return NextResponse.json({ error: err.message || 'Failed to add supplier' }, { status: 500 })
  }
}
