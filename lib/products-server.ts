import { connectToDatabase } from '@/lib/mongodb'
import ProductModel from '@/models/Product'
import type { Product } from '@/lib/products-data'
import { firstCryClothingProducts } from '@/lib/firstcry-clothing-data'
import { products as kidsProductsList } from '@/lib/products-fallback-list'

const fallbackProducts: Product[] = kidsProductsList.length > 0 ? kidsProductsList : firstCryClothingProducts

/**
 * Server-only helper to fetch a product by slug or id from MongoDB first,
 * falling back gracefully to static products if offline or unreachable.
 */
export async function getProductBySlugOrId(identifier: string): Promise<Product | null> {
  try {
    await connectToDatabase()
    const dbProduct = await ProductModel.findOne({
      $or: [{ id: identifier }, { slug: identifier }],
    }).lean<Product>()

    if (dbProduct) {
      return {
        id: dbProduct.id || String((dbProduct as { _id?: unknown })._id),
        name: dbProduct.name,
        slug: dbProduct.slug,
        gender: dbProduct.gender,
        category: dbProduct.category,
        mainCategory: dbProduct.mainCategory,
        subCategory: dbProduct.subCategory,
        sport: dbProduct.sport || 'clothing',
        sectionGroup: (dbProduct as unknown as { sectionGroup?: string }).sectionGroup,
        sourceUrl: (dbProduct as unknown as { sourceUrl?: string }).sourceUrl,
        stockQuantity: (dbProduct as unknown as { stockQuantity?: number }).stockQuantity ?? 50,
        price: Number(dbProduct.price),
        originalPrice: dbProduct.originalPrice ? Number(dbProduct.originalPrice) : undefined,
        badge: dbProduct.badge || undefined,
        image: dbProduct.image,
        images: dbProduct.images?.length ? [...dbProduct.images] : [dbProduct.image],
        description: dbProduct.description,
        features: dbProduct.features || [],
        sizes: dbProduct.sizes || ['S', 'M', 'L', 'XL'],
        colors: (dbProduct.colors || []).map((c) => ({ name: c.name, hex: c.hex, image: c.image })),
        inStock: dbProduct.inStock ?? true,
        rating: dbProduct.rating || 4.8,
        reviewsCount: dbProduct.reviewsCount || 0,
        videoUrl: dbProduct.videoUrl || undefined,
        actionVideoUrl: dbProduct.actionVideoUrl || undefined,
      }
    }

    // Fallback to static products if not in DB yet
    const fallback = fallbackProducts.find((p) => p.slug === identifier || p.id === identifier)
    return fallback || null
  } catch (error) {
    console.warn('getProductBySlugOrId database error, falling back:', error)
    const fallback = fallbackProducts.find((p) => p.slug === identifier || p.id === identifier)
    return fallback || null
  }
}

/**
 * Server-only helper to get all products from MongoDB
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    await connectToDatabase()
    const dbProducts = await ProductModel.find().sort({ createdAt: -1 }).lean<Product[]>()

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id || String((p as { _id?: unknown })._id),
        name: p.name,
        slug: p.slug,
        gender: p.gender,
        category: p.category,
        mainCategory: p.mainCategory,
        subCategory: p.subCategory,
        sport: p.sport || 'clothing',
        sectionGroup: (p as unknown as { sectionGroup?: string }).sectionGroup,
        sourceUrl: (p as unknown as { sourceUrl?: string }).sourceUrl,
        stockQuantity: (p as unknown as { stockQuantity?: number }).stockQuantity ?? 50,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        badge: p.badge || undefined,
        image: p.image,
        images: p.images?.length ? [...p.images] : (p.image ? [p.image] : []),
        description: p.description,
        features: p.features || [],
        sizes: p.sizes || ['S', 'M', 'L', 'XL'],
        colors: (p.colors || []).map((c) => ({ name: c.name, hex: c.hex, image: c.image })),
        inStock: p.inStock ?? true,
        rating: p.rating || 4.8,
        reviewsCount: p.reviewsCount || 0,
        videoUrl: p.videoUrl || undefined,
        actionVideoUrl: p.actionVideoUrl || undefined,
      }))
    }
  } catch (error) {
    console.warn('getAllProducts database error:', error)
  }

  return fallbackProducts
}

export async function getStoredProducts(): Promise<Product[]> {
  const dbList = await getAllProducts()
  return dbList.length > 0 ? dbList : fallbackProducts
}

export async function saveStoredProducts(updatedList: Product[]): Promise<void> {
  try {
    await connectToDatabase()
    for (const p of updatedList) {
      await ProductModel.findOneAndUpdate(
        { id: p.id },
        {
          ...p,
          images: p.images?.length ? p.images : [p.image],
        },
        { upsert: true, new: true }
      )
    }
  } catch (err) {
    console.warn('saveStoredProducts database error:', err)
  }
}
