import type { Product, ProductVariantItem } from '@/lib/products-data'

export type { ProductVariantItem }

export type InventorySubTab =
  | 'ledger'
  | 'adjust-stock'
  | 'po'
  | 'waste'
  | 'returns'
  | 'suppliers'

export type InventoryProduct = Product & {
  sku?: string
  supplierBarcode?: string
  warehouseBarcode?: string
  stockQuantity?: number
  lowStockThreshold?: number
  costPrice?: number
  supplier?: string
}

export interface InventoryManagementTabProps {
  products: InventoryProduct[]
  triggerToast?: (msg: string) => void
}
