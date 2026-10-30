import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import PurchaseOrder from '@/models/PurchaseOrder'
import Product from '@/models/Product'
import InventoryTransaction from '@/models/InventoryTransaction'
import { defaultPurchaseOrders } from '@/lib/inventory-data'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    let purchaseOrders = await PurchaseOrder.find().sort({ createdAt: -1 }).lean()

    if (!purchaseOrders || purchaseOrders.length === 0) {
      const seedDocs = defaultPurchaseOrders.map((p) => ({
        poNumber: p.poNumber,
        supplierId: p.supplierId,
        supplierName: p.supplierName,
        supplierGstin: p.supplierGstin || '',
        items: p.items,
        totalAmount: p.totalAmount,
        status: p.status,
        expectedDate: p.expectedDate,
        receivedDate: p.receivedDate,
        createdAt: new Date(p.createdAt),
        notes: p.notes || '',
      }))
      await PurchaseOrder.insertMany(seedDocs).catch(() => null)
      purchaseOrders = await PurchaseOrder.find().sort({ createdAt: -1 }).lean()
    }

    return NextResponse.json({
      purchaseOrders: purchaseOrders.map((p: any) => ({
        poNumber: p.poNumber,
        supplierId: p.supplierId,
        supplierName: p.supplierName,
        supplierGstin: p.supplierGstin,
        items: p.items,
        totalAmount: p.totalAmount,
        status: p.status,
        expectedDate: p.expectedDate,
        receivedDate: p.receivedDate,
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        notes: p.notes,
      })),
    })
  } catch (error: any) {
    console.error('GET /api/inventory/po error:', error)
    return NextResponse.json({ purchaseOrders: defaultPurchaseOrders })
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const { supplierId, supplierName, supplierGstin, items, expectedDate, notes } = body

    if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required purchase order fields' }, { status: 400 })
    }

    const totalAmount = items.reduce((sum: number, it: any) => sum + (it.unitCost * it.quantity), 0)
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

    const newPO = await PurchaseOrder.create({
      poNumber,
      supplierId,
      supplierName: supplierName || 'Supplier',
      supplierGstin: supplierGstin || '',
      items,
      totalAmount,
      status: 'ORDERED',
      expectedDate: expectedDate || undefined,
      notes: notes || '',
    })

    return NextResponse.json({
      success: true,
      purchaseOrder: {
        poNumber: newPO.poNumber,
        supplierId: newPO.supplierId,
        supplierName: newPO.supplierName,
        supplierGstin: newPO.supplierGstin,
        items: newPO.items,
        totalAmount: newPO.totalAmount,
        status: newPO.status,
        expectedDate: newPO.expectedDate,
        createdAt: newPO.createdAt.toISOString(),
        notes: newPO.notes,
      },
    })
  } catch (err: any) {
    console.error('POST /api/inventory/po error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create PO' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const { poNumber, action } = body

    const targetPO = await PurchaseOrder.findOne({ poNumber })
    if (!targetPO) {
      return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 })
    }

    if (action === 'RECEIVE') {
      targetPO.status = 'RECEIVED'
      targetPO.receivedDate = new Date().toISOString().split('T')[0]
      await targetPO.save()

      for (const item of targetPO.items) {
        const product = await Product.findOne({
          $or: [{ id: item.productId }, { _id: item.productId }],
        })
        if (product) {
          const currentStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : 25
          const newStock = currentStock + item.quantity
          product.stockQuantity = newStock
          product.inStock = true
          await product.save()

          await InventoryTransaction.create({
            transactionId: `TXN-${Date.now().toString().slice(-6)}`,
            productId: product.id,
            productName: product.name,
            sku: item.sku,
            type: 'RECEIVE',
            quantityChange: item.quantity,
            previousStock: currentStock,
            newStock,
            reference: targetPO.poNumber,
            reason: `PO goods receipt from ${targetPO.supplierName}`,
            performedBy: 'Admin',
          })
        }
      }

      return NextResponse.json({
        success: true,
        purchaseOrder: targetPO,
      })
    }

    return NextResponse.json({ error: 'Invalid PO action' }, { status: 400 })
  } catch (err: any) {
    console.error('PUT /api/inventory/po error:', err)
    return NextResponse.json({ error: err.message || 'Failed to process PO action' }, { status: 500 })
  }
}
