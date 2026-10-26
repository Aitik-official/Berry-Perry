import { NextResponse } from 'next/server'
import { defaultDamageWaste, type DamageWasteItem } from '@/lib/inventory-data'
import { getStoredProducts, saveStoredProducts } from '@/lib/products-server'

let inMemoryWaste = [...defaultDamageWaste]

export async function GET() {
  return NextResponse.json({ wasteLogs: inMemoryWaste })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, quantity, category, reason, disposition, reportedBy } = body

    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid product or scrap quantity' }, { status: 400 })
    }

    const products = await getStoredProducts()
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const currentStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 25 : 0)
    const newStock = Math.max(0, currentStock - quantity)
    product.stockQuantity = newStock
    product.inStock = newStock > 0

    await saveStoredProducts(products)

    const wasteEntry: DamageWasteItem = {
      wasteId: `WST-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`,
      quantity,
      category: category || 'DAMAGED',
      estimatedLoss: Math.round(Number(product.price) * 0.55 * quantity),
      reason: reason || 'Defective/Damaged in handling',
      disposition: disposition || 'SCRAPPED',
      reportedBy: reportedBy || 'Warehouse Staff',
      timestamp: new Date().toISOString(),
    }

    inMemoryWaste.unshift(wasteEntry)

    return NextResponse.json({
      success: true,
      wasteEntry,
      product,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record damage' }, { status: 500 })
  }
}
