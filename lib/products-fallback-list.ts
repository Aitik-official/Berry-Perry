import type { Product } from './products-data'
import { firstCryClothingProducts } from './firstcry-clothing-data'
import liveProductsRaw from '../scratch/firstcry_products_live.json'

// Export authentic FirstCry baby, toddler, and kids products
export const products: Product[] = [
  ...firstCryClothingProducts,
  ...(liveProductsRaw as unknown as Product[])
]

export const defaultProducts = products
