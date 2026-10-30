import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import InventoryTransaction from '@/models/InventoryTransaction'
import { defaultTransactions } from '@/lib/inventory-data'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    let transactions = await InventoryTransaction.find().sort({ createdAt: -1 }).limit(100).lean()

    if (!transactions || transactions.length === 0) {
      // Seed default transactions
      const seedDocs = defaultTransactions.map((t) => ({
        transactionId: t.transactionId,
        productId: t.productId,
        productName: t.productName,
        sku: t.sku,
        type: t.type,
        quantityChange: t.quantityChange,
        previousStock: t.previousStock,
        newStock: t.newStock,
        reference: t.reference || '',
        reason: t.reason,
        performedBy: t.performedBy,
        createdAt: new Date(t.timestamp),
      }))
      await InventoryTransaction.insertMany(seedDocs).catch(() => null)
      transactions = await InventoryTransaction.find().sort({ createdAt: -1 }).lean()
    }

    return NextResponse.json({
      success: true,
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
  } catch (error: any) {
    console.error('GET /api/inventory/transactions error:', error)
    return NextResponse.json({ transactions: defaultTransactions })
  }
}
