import type { Product } from './products-data'
import { firstCryClothingProducts } from './firstcry-clothing-data'
import liveProductsRaw from '../scratch/firstcry_products_live.json'
import { ladiesWearProducts } from './ladies-wear-data'

// Export authentic baby, kids, and ladies wear products
export const products: Product[] = [
  ...ladiesWearProducts,
  ...firstCryClothingProducts,
  ...(liveProductsRaw as unknown as Product[])
]

export const defaultProducts = products
