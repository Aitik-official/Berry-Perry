import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'
import UnitBarcode from '@/models/UnitBarcode'
import InventoryTransaction from '@/models/InventoryTransaction'
import Waste from '@/models/Waste'
import Order from '@/models/Order'
import { defaultOrderReturns, type OrderReturnItem } from '@/lib/inventory-data'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { findProductDocument } from '@/lib/products-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// In-memory cache fallback if returns collection is empty
let inMemoryReturns = [...defaultOrderReturns]

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  return NextResponse.json({ returns: inMemoryReturns })
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse('Admin authentication required')
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const { orderNumber, customerName, items, returnType = 'RESTOCK', reason = 'Customer return' } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing return request items' }, { status: 400 })
    }

    const totalRefund = items.reduce((sum: number, it: any) => sum + ((it.unitRefund || it.price || 0) * it.quantity), 0)
    const returnNumber = `RET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    const creditNoteNumber = `CN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

    // Process each item according to returnType
    for (const item of items) {
      const product = await findProductDocument(item.productId)

      if (returnType === 'RESTOCK' || item.restockable) {
        // Restock to available sellable inventory
        if (product) {
          const currentStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : 25
          const newStock = currentStock + (item.quantity || 1)
          product.stockQuantity = newStock
          product.inStock = true
          await product.save()

          await InventoryTransaction.create({
            transactionId: `TXN-${Date.now().toString().slice(-6)}`,
            productId: product.id,
            productName: product.name,
            sku: item.sku || (product as any).sku || `VS-${product.id.slice(0, 8).toUpperCase()}`,
            type: 'RETURN',
            quantityChange: item.quantity || 1,
            previousStock: currentStock,
            newStock,
            reference: orderNumber || returnNumber,
            reason: reason || 'Customer return restocked to inventory',
            performedBy: 'Admin (Returns Hub)',
          })
        }

        if (item.unitBarcode) {
          await UnitBarcode.updateOne(
            { barcode: item.unitBarcode },
            { $set: { status: 'AVAILABLE', soldAt: null, reason: '' } }
          )
        }
      } else {
        // Shift to defective / waste write-off
        if (product) {
          const currentStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : 25
          const productSku = item.sku || (product as any).sku || `VS-${product.id.slice(0, 8).toUpperCase()}`

          // Waste record
          await Waste.create({
            wasteId: `WST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            productId: product.id,
            productName: product.name,
            sku: productSku,
            unitBarcode: item.unitBarcode || undefined,
            quantity: item.quantity || 1,
            category: 'DEFECTIVE',
            estimatedLoss: Math.round(Number(product.price) * 0.55 * (item.quantity || 1)),
            reason: reason || 'Customer returned damaged/defective unit',
            disposition: 'SCRAPPED',
            reportedBy: 'Admin (Returns Hub)',
          })

          await InventoryTransaction.create({
            transactionId: `TXN-${Date.now().toString().slice(-6)}`,
            productId: product.id,
            productName: product.name,
            sku: productSku,
            type: 'DAMAGE',
            quantityChange: 0, // already deducted at sale time, so zero net balance change to available
            previousStock: currentStock,
            newStock: currentStock,
            reference: orderNumber || returnNumber,
            reason: reason || 'Customer return shifted to defective waste',
            performedBy: 'Admin (Returns Hub)',
          })
        }

        if (item.unitBarcode) {
          await UnitBarcode.updateOne(
            { barcode: item.unitBarcode },
            { $set: { status: 'DAMAGED', reason: reason || 'Customer return defective' } }
          )
        }
      }
    }

    // Update Order if orderNumber provided
    if (orderNumber) {
      await Order.updateOne(
        { orderNumber },
        {
          $set: {
            orderStatus: 'returned',
            returnReason: reason,
            returnType,
            notes: `Return processed (${returnType}): ${returnNumber}. Credit Note: ${creditNoteNumber}`,
          },
        }
      )
    }

    const returnRecord: OrderReturnItem = {
      returnNumber,
      orderNumber: orderNumber || 'MANUAL',
      customerName: customerName || 'Customer',
      items,
      creditNoteNumber,
      creditNoteAmt: totalRefund,
      status: returnType === 'RESTOCK' ? 'RESTOCKED' : 'SCRAPPED',
      timestamp: new Date().toISOString(),
    }

    inMemoryReturns.unshift(returnRecord)

    return NextResponse.json({
      success: true,
      returnRecord,
      message: `Return ${returnNumber} processed successfully as ${returnType}.`,
    })
  } catch (err: any) {
    console.error('POST /api/returns error:', err)
    return NextResponse.json({ error: err.message || 'Failed to record return' }, { status: 500 })
  }
}
