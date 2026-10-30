import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Waste from '@/models/Waste'
import Product from '@/models/Product'
import InventoryTransaction from '@/models/InventoryTransaction'
import { defaultDamageWaste } from '@/lib/inventory-data'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    let wasteLogs = await Waste.find().sort({ createdAt: -1 }).limit(100).lean()

    if (!wasteLogs || wasteLogs.length === 0) {
      const seedDocs = defaultDamageWaste.map((w) => ({
        wasteId: w.wasteId,
        productId: w.productId,
        productName: w.productName,
        sku: w.sku,
        quantity: w.quantity,
        category: w.category,
        estimatedLoss: w.estimatedLoss,
        reason: w.reason,
        disposition: w.disposition,
        reportedBy: w.reportedBy,
        createdAt: new Date(w.timestamp),
      }))
      await Waste.insertMany(seedDocs).catch(() => null)
      wasteLogs = await Waste.find().sort({ createdAt: -1 }).lean()
    }

    return NextResponse.json({
      wasteLogs: wasteLogs.map((w: any) => ({
        wasteId: w.wasteId,
        productId: w.productId,
        productName: w.productName,
        sku: w.sku,
        quantity: w.quantity,
        category: w.category,
        estimatedLoss: w.estimatedLoss,
        reason: w.reason,
        disposition: w.disposition,
        reportedBy: w.reportedBy,
        timestamp: w.createdAt ? new Date(w.createdAt).toISOString() : new Date().toISOString(),
      })),
    })
  } catch (error: any) {
    console.error('GET /api/inventory/waste error:', error)
    return NextResponse.json({ wasteLogs: defaultDamageWaste })
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const { productId, quantity, category, reason, disposition, reportedBy, unitBarcode } = body

    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid product or scrap quantity' }, { status: 400 })
    }

    const product = await Product.findOne({
      $or: [{ id: productId }, { _id: productId }],
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const currentStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : 25
    const newStock = Math.max(0, currentStock - quantity)
    product.stockQuantity = newStock
    product.inStock = newStock > 0
    await product.save()

    const wasteId = `WST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    const productSku = (product as any).sku || `VS-${product.id.slice(0, 8).toUpperCase()}`
    const estimatedLoss = Math.round(Number(product.price) * 0.55 * quantity)

    const wasteEntry = await Waste.create({
      wasteId,
      productId: product.id,
      productName: product.name,
      sku: productSku,
      unitBarcode: unitBarcode || undefined,
      quantity,
      category: category || 'DAMAGED',
      estimatedLoss,
      reason: reason || 'Defective piece write-off',
      disposition: disposition || 'SCRAPPED',
      reportedBy: reportedBy || 'Warehouse Staff',
    })

    // Log double-entry inventory ledger
    await InventoryTransaction.create({
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      productId: product.id,
      productName: product.name,
      sku: productSku,
      type: 'DAMAGE',
      quantityChange: -quantity,
      previousStock: currentStock,
      newStock,
      reference: wasteId,
      reason: reason || 'Defective/Damaged write-off',
      performedBy: reportedBy || 'Warehouse Staff',
    })

    return NextResponse.json({
      success: true,
      wasteEntry: {
        wasteId: wasteEntry.wasteId,
        productId: wasteEntry.productId,
        productName: wasteEntry.productName,
        sku: wasteEntry.sku,
        quantity: wasteEntry.quantity,
        category: wasteEntry.category,
        estimatedLoss: wasteEntry.estimatedLoss,
        reason: wasteEntry.reason,
        disposition: wasteEntry.disposition,
        reportedBy: wasteEntry.reportedBy,
        timestamp: wasteEntry.createdAt.toISOString(),
      },
      product,
    })
  } catch (err: any) {
    console.error('POST /api/inventory/waste error:', err)
    return NextResponse.json({ error: err.message || 'Failed to record damage' }, { status: 500 })
  }
}
