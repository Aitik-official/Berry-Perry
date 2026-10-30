import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'
import InventoryTransaction from '@/models/InventoryTransaction'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to access inventory")
  }

  try {
    await connectToDatabase()
    const transactions = await InventoryTransaction.find().sort({ createdAt: -1 }).limit(100).lean()
    return NextResponse.json({
      transactions: transactions.map((t: any) => ({
        transactionId: t.transactionId,
        productId: t.productId,
        productName: t.productName,
        sku: t.sku,
        type: t.type,
        quantityChange: t.quantityChange,
        previousStock: t.previousStock,
        newStock: t.newStock,
        reference: t.reference,
        reason: t.reason,
        performedBy: t.performedBy,
        timestamp: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
      })),
    })
  } catch (err: any) {
    console.error('GET /api/inventory error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to adjust inventory")
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const { productId, type, quantityChange, reason, reference, performedBy, variantSku, variantSize, variantColor } = body

    if (!productId || !type || typeof quantityChange !== 'number') {
      return NextResponse.json({ error: 'Missing required inventory adjustment fields' }, { status: 400 })
    }

    const product = await Product.findOne({
      $or: [{ id: productId }, { _id: productId }],
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let previousStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : 25
    let newStock = Math.max(0, previousStock + quantityChange)

    product.stockQuantity = newStock
    product.inStock = newStock > 0
    await product.save()

    const transactionSku = variantSku || (product as any).sku || `VS-${product.id.slice(0, 8).toUpperCase()}`
    const variantTag = variantSize && variantColor ? ` [${variantColor} / ${variantSize}]` : ''

    const transactionId = `TXN-${Date.now().toString().slice(-6)}`
    const createdTxn = await InventoryTransaction.create({
      transactionId,
      productId: product.id,
      productName: `${product.name}${variantTag}`,
      sku: transactionSku,
      type,
      quantityChange,
      previousStock,
      newStock,
      reference: reference || '',
      reason: reason || 'Manual inventory update',
      performedBy: performedBy || 'Admin Console',
    })

    return NextResponse.json({
      success: true,
      product,
      transaction: {
        transactionId: createdTxn.transactionId,
        productId: createdTxn.productId,
        productName: createdTxn.productName,
        sku: createdTxn.sku,
        type: createdTxn.type,
        quantityChange: createdTxn.quantityChange,
        previousStock: createdTxn.previousStock,
        newStock: createdTxn.newStock,
        reference: createdTxn.reference,
        reason: createdTxn.reason,
        performedBy: createdTxn.performedBy,
        timestamp: createdTxn.createdAt.toISOString(),
      },
    })
  } catch (error: any) {
    console.error('POST /api/inventory error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update inventory' }, { status: 500 })
  }
}
