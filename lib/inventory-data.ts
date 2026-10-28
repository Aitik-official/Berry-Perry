export interface InventoryTransactionItem {
  transactionId: string
  productId: string
  productName: string
  sku: string
  type: 'RECEIVE' | 'SALE' | 'RETURN' | 'ADJUST' | 'DAMAGE' | 'TRANSFER'
  quantityChange: number
  previousStock: number
  newStock: number
  reference?: string
  reason: string
  performedBy: string
  timestamp: string
}

export interface PurchaseOrderItem {
  poNumber: string
  supplierId: string
  supplierName: string
  supplierGstin?: string
  items: {
    productId: string
    productName: string
    sku: string
    quantity: number
    unitCost: number
    totalCost: number
  }[]
  totalAmount: number
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED'
  expectedDate?: string
  receivedDate?: string
  createdAt: string
  notes?: string
}

export interface DamageWasteItem {
  wasteId: string
  productId: string
  productName: string
  sku: string
  quantity: number
  category: 'DAMAGED' | 'DEFECTIVE' | 'EXPIRED' | 'LOST' | 'OTHER'
  estimatedLoss: number
  reason: string
  disposition: 'SCRAPPED' | 'RETURNED_TO_VENDOR' | 'RECYCLED'
  reportedBy: string
  timestamp: string
}

export interface OrderReturnItem {
  returnNumber: string
  orderNumber: string
  customerName: string
  items: {
    productId: string
    productName: string
    sku: string
    quantity: number
    reason: string
    restockable: boolean
    unitRefund: number
  }[]
  creditNoteNumber: string
  creditNoteAmt: number
  status: 'PENDING' | 'INSPECTED' | 'RESTOCKED' | 'SCRAPPED'
  timestamp: string
}

export interface SupplierItem {
  supplierId: string
  name: string
  code: string
  contactPerson: string
  email: string
  phone: string
  gstin?: string
  paymentTerms: string
  status: 'ACTIVE' | 'INACTIVE'
  productsCount?: number
}

export const defaultSuppliers: SupplierItem[] = [
  {
    supplierId: 'SUP-001',
    name: 'Berry Perry Elite Apparel & Goods Ltd.',
    code: 'BPE-01',
    contactPerson: 'Karan Mehra',
    email: 'supply@berryperry.com',
    phone: '+91 98201 11223',
    gstin: '07AAAAA1234A1Z5',
    paymentTerms: 'Net 30',
    status: 'ACTIVE',
    productsCount: 14,
  },
  {
    supplierId: 'SUP-002',
    name: 'AeroDry Technical Fabrics Pvt. Ltd.',
    code: 'ATF-02',
    contactPerson: 'Suresh Raina',
    email: 'orders@aerodry.in',
    phone: '+91 98402 44556',
    gstin: '27AABCT9876C1Z2',
    paymentTerms: 'Net 15',
    status: 'ACTIVE',
    productsCount: 9,
  },
  {
    supplierId: 'SUP-003',
    name: 'Titanium Guard Helmets & Gear Works',
    code: 'TGH-03',
    contactPerson: 'Vikram Joshi',
    email: 'contact@titaniumgear.in',
    phone: '+91 98110 99887',
    gstin: '06BBBBB5432B1Z8',
    paymentTerms: 'Immediate',
    status: 'ACTIVE',
    productsCount: 5,
  },
]

export const defaultTransactions: InventoryTransactionItem[] = [
  {
    transactionId: 'TXN-90812',
    productId: 'virat-cricket-jersey',
    productName: "Men's Pro Performance Cricket Jersey",
    sku: 'VS-CRK-001',
    type: 'RECEIVE',
    quantityChange: 50,
    previousStock: 15,
    newStock: 65,
    reference: 'PO-2026-004',
    reason: 'Incoming shipment batch intake from factory',
    performedBy: 'Warehouse Manager (Admin)',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    transactionId: 'TXN-90811',
    productId: 'virat-batting-gloves',
    productName: 'Club Pro Batting Gloves',
    sku: 'VS-CRK-002',
    type: 'SALE',
    quantityChange: -2,
    previousStock: 28,
    newStock: 26,
    reference: 'ORD-VS98241',
    reason: 'Storefront Customer Online Checkout',
    performedBy: 'System Automation',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    transactionId: 'TXN-90810',
    productId: 'virat-lightweight-vest',
    productName: 'Lightweight Sleeveless Gym Vest',
    sku: 'VS-FIT-004',
    type: 'DAMAGE',
    quantityChange: -1,
    previousStock: 40,
    newStock: 39,
    reference: 'WST-2026-01',
    reason: 'Defective seam stitching identified in pre-pack check',
    performedBy: 'Quality Controller',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    transactionId: 'TXN-90809',
    productId: 'virat-batting-pads',
    productName: 'Pro Match Batting Leg Guards',
    sku: 'VS-CRK-003',
    type: 'RETURN',
    quantityChange: 1,
    previousStock: 12,
    newStock: 13,
    reference: 'RET-2026-003',
    reason: 'Customer RMA size exchange',
    performedBy: 'Support Team',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
]

export const defaultPurchaseOrders: PurchaseOrderItem[] = [
  {
    poNumber: 'PO-2026-004',
    supplierId: 'SUP-001',
    supplierName: 'Berry Perry Elite Apparel & Goods Ltd.',
    supplierGstin: '07AAAAA1234A1Z5',
    items: [
      {
        productId: 'virat-cricket-jersey',
        productName: "Men's Pro Performance Cricket Jersey",
        sku: 'VS-CRK-001',
        quantity: 50,
        unitCost: 850,
        totalCost: 42500,
      },
    ],
    totalAmount: 42500,
    status: 'RECEIVED',
    expectedDate: '2026-10-21',
    receivedDate: '2026-10-22',
    createdAt: '2026-10-18T10:00:00.000Z',
    notes: 'Match season jersey replenishment',
  },
  {
    poNumber: 'PO-2026-005',
    supplierId: 'SUP-002',
    supplierName: 'AeroDry Technical Fabrics Pvt. Ltd.',
    supplierGstin: '27AABCT9876C1Z2',
    items: [
      {
        productId: 'virat-mens-agility-shorts',
        productName: "Men's Agility Quick-Dry Shorts",
        sku: 'VS-FIT-002',
        quantity: 100,
        unitCost: 550,
        totalCost: 55000,
      },
    ],
    totalAmount: 55000,
    status: 'ORDERED',
    expectedDate: '2026-10-28',
    createdAt: '2026-10-21T14:30:00.000Z',
    notes: 'Express courier priority intake',
  },
]

export const defaultDamageWaste: DamageWasteItem[] = [
  {
    wasteId: 'WST-2026-01',
    productId: 'virat-lightweight-vest',
    productName: 'Lightweight Sleeveless Gym Vest',
    sku: 'VS-FIT-004',
    quantity: 1,
    category: 'DEFECTIVE',
    estimatedLoss: 450,
    reason: 'Zipper thread snag during warehouse moving',
    disposition: 'SCRAPPED',
    reportedBy: 'Warehouse Staff',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
]

export const defaultOrderReturns: OrderReturnItem[] = [
  {
    returnNumber: 'RET-2026-003',
    orderNumber: 'ORD-VS98241',
    customerName: 'Rohit K.',
    items: [
      {
        productId: 'virat-batting-pads',
        productName: 'Pro Match Batting Leg Guards',
        sku: 'VS-CRK-003',
        quantity: 1,
        reason: 'Sizing too compact for thigh guard fit',
        restockable: true,
        unitRefund: 3499,
      },
    ],
    creditNoteNumber: 'CN-2026-003',
    creditNoteAmt: 3499,
    status: 'RESTOCKED',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
]
