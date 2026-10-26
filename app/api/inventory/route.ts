import { NextResponse } from 'next/server'
import { defaultTransactions, defaultPurchaseOrders, defaultDamageWaste, defaultOrderReturns, defaultSuppliers } from '@/lib/inventory-data'
import { getStoredProducts, saveStoredProducts } from '@/lib/products-server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

let inMemoryTransactions = [...defaultTransactions]

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to access inventory")
  }
  return NextResponse.json({ transactions: inMemoryTransactions })
}

export async function POST(req: Request) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to adjust inventory")
  }

  try {
    const body = await req.json()
    const { productId, type, quantityChange, reason, reference, performedBy, variantSku, variantSize, variantColor } = body

    if (!productId || !type || typeof quantityChange !== 'number') {
      return NextResponse.json({ error: 'Missing required inventory adjustment fields' }, { status: 400 })
    }

    const products = await getStoredProducts()
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Initialize variants array if product has colors and sizes but no variants initialized yet
    if (!product.variants && (product.sizes?.length || product.colors?.length)) {
      const sizes = product.sizes?.length ? product.sizes : ['Standard']
      const colors = product.colors?.length ? product.colors.map((c: { name: string }) => c.name) : ['Standard']
      const baseUnits = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 25 : 0)
      const perVariant = Math.max(1, Math.floor(baseUnits / (sizes.length * colors.length)))
      
      product.variants = []
      for (const col of colors) {
        for (const sz of sizes) {
          const colCode = col.slice(0, 3).toUpperCase()
          const szCode = sz.toUpperCase()
          product.variants.push({
            sku: `${product.sku || 'VS-' + product.id.slice(0, 5).toUpperCase()}-${colCode}-${szCode}`,
            size: sz,
            color: col,
            stockQuantity: perVariant,
          })
        }
      }
    }

    let previousStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 25 : 0)
    let newStock = previousStock

    if (variantSku && product.variants && product.variants.length > 0) {
      const v = product.variants.find((item: { sku: string; stockQuantity: number }) => item.sku === variantSku)
      if (v) {
        previousStock = v.stockQuantity
        const vNewStock = Math.max(0, v.stockQuantity + quantityChange)
        v.stockQuantity = vNewStock
        newStock = vNewStock
        // Recalculate parent total stockQuantity
        product.stockQuantity = product.variants.reduce((sum: number, item: { stockQuantity: number }) => sum + item.stockQuantity, 0)
        product.inStock = product.stockQuantity > 0
      } else {
        newStock = Math.max(0, previousStock + quantityChange)
        product.stockQuantity = newStock
        product.inStock = newStock > 0
      }
    } else {
      newStock = Math.max(0, previousStock + quantityChange)
      product.stockQuantity = newStock
      product.inStock = newStock > 0
    }

    await saveStoredProducts(products)

    const transactionSku = variantSku || product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`
    const variantTag = variantSize && variantColor ? ` [${variantColor} / ${variantSize}]` : ''

    const transaction = {
      transactionId: `TXN-${Date.now().toString().slice(-5)}`,
      productId: product.id,
      productName: `${product.name}${variantTag}`,
      sku: transactionSku,
      type,
      quantityChange,
      previousStock,
      newStock,
      reference: reference || undefined,
      reason: reason || 'Manual inventory update',
      performedBy: performedBy || 'Admin Console',
      timestamp: new Date().toISOString(),
    }

    inMemoryTransactions.unshift(transaction)

    return NextResponse.json({
      success: true,
      product,
      transaction,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update inventory' }, { status: 500 })
  }
}
