import { NextResponse } from 'next/server'
import { defaultOrderReturns, type OrderReturnItem } from '@/lib/inventory-data'
import { getStoredProducts, saveStoredProducts } from '@/lib/products-server'

let inMemoryReturns = [...defaultOrderReturns]

export async function GET() {
  return NextResponse.json({ returns: inMemoryReturns })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderNumber, customerName, items } = body

    if (!orderNumber || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing return request details' }, { status: 400 })
    }

    const totalRefund = items.reduce((sum: number, it: any) => sum + (it.unitRefund * it.quantity), 0)

    const returnRecord: OrderReturnItem = {
      returnNumber: `RET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber,
      customerName: customerName || 'Customer',
      items,
      creditNoteNumber: `CN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      creditNoteAmt: totalRefund,
      status: 'INSPECTED',
      timestamp: new Date().toISOString(),
    }

    inMemoryReturns.unshift(returnRecord)

    return NextResponse.json({
      success: true,
      returnRecord,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record return' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { returnNumber, action } = body

    const targetReturn = inMemoryReturns.find((r) => r.returnNumber === returnNumber)
    if (!targetReturn) {
      return NextResponse.json({ error: 'Return record not found' }, { status: 404 })
    }

    if (action === 'RESTOCK') {
      targetReturn.status = 'RESTOCKED'

      const products = await getStoredProducts()
      for (const item of targetReturn.items) {
        if (item.restockable) {
          const prod = products.find((p) => p.id === item.productId)
          if (prod) {
            const currentStock = typeof prod.stockQuantity === 'number' ? prod.stockQuantity : (prod.inStock ? 25 : 0)
            prod.stockQuantity = currentStock + item.quantity
            prod.inStock = prod.stockQuantity > 0
          }
        }
      }
      await saveStoredProducts(products)

      return NextResponse.json({
        success: true,
        returnRecord: targetReturn,
      })
    }

    return NextResponse.json({ error: 'Invalid return action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update return' }, { status: 500 })
  }
}
