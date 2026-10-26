import { NextResponse } from 'next/server'
import { defaultPurchaseOrders, type PurchaseOrderItem } from '@/lib/inventory-data'
import { getStoredProducts, saveStoredProducts } from '@/lib/products-server'

let inMemoryPOs = [...defaultPurchaseOrders]

export async function GET() {
  return NextResponse.json({ purchaseOrders: inMemoryPOs })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { supplierId, supplierName, supplierGstin, items, expectedDate, notes } = body

    if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required purchase order fields' }, { status: 400 })
    }

    const totalAmount = items.reduce((sum: number, it: any) => sum + (it.unitCost * it.quantity), 0)

    const newPO: PurchaseOrderItem = {
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      supplierId,
      supplierName: supplierName || 'Supplier',
      supplierGstin: supplierGstin || undefined,
      items,
      totalAmount,
      status: 'ORDERED',
      expectedDate: expectedDate || undefined,
      createdAt: new Date().toISOString(),
      notes: notes || undefined,
    }

    inMemoryPOs.unshift(newPO)

    return NextResponse.json({
      success: true,
      purchaseOrder: newPO,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create PO' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { poNumber, action } = body

    const targetPO = inMemoryPOs.find((p) => p.poNumber === poNumber)
    if (!targetPO) {
      return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 })
    }

    if (action === 'RECEIVE') {
      targetPO.status = 'RECEIVED'
      targetPO.receivedDate = new Date().toISOString().split('T')[0]

      const products = await getStoredProducts()
      for (const item of targetPO.items) {
        const prod = products.find((p) => p.id === item.productId)
        if (prod) {
          const currentStock = typeof prod.stockQuantity === 'number' ? prod.stockQuantity : (prod.inStock ? 25 : 0)
          prod.stockQuantity = currentStock + item.quantity
          prod.inStock = prod.stockQuantity > 0
        }
      }
      await saveStoredProducts(products)

      return NextResponse.json({
        success: true,
        purchaseOrder: targetPO,
      })
    }

    return NextResponse.json({ error: 'Invalid PO action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process PO action' }, { status: 500 })
  }
}
