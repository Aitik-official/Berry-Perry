'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  defaultSuppliers,
  defaultPurchaseOrders,
  defaultTransactions,
  defaultDamageWaste,
  defaultOrderReturns,
  type InventoryTransactionItem,
  type PurchaseOrderItem,
  type DamageWasteItem,
  type OrderReturnItem,
  type SupplierItem,
} from '@/lib/inventory-data'
import {
  type InventorySubTab,
  type InventoryProduct,
  type InventoryManagementTabProps,
  InventoryStatsBar,
  InventoryNavTabs,
  InventoryLedgerSubtab,
  InventoryAdjustStockSubtab,
  InventoryPurchaseOrdersSubtab,
  InventoryWasteSubtab,
  InventoryReturnsSubtab,
  InventorySuppliersSubtab,
  AdjustStockModal,
  CreatePOModal,
  RecordWasteModal,
  RecordReturnModal,
  AddSupplierModal,
  PrintBarcodeModal,
  BarcodeScannerModal,
} from './inventory'

export type { InventorySubTab, InventoryProduct, InventoryManagementTabProps }

export function InventoryManagementTab({
  products,
  triggerToast,
}: InventoryManagementTabProps) {
  const [subTab, setSubTab] = useState<InventorySubTab>('ledger')

  // Live datasets
  const [transactions, setTransactions] = useState<InventoryTransactionItem[]>(defaultTransactions)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderItem[]>(defaultPurchaseOrders)
  const [wasteLogs, setWasteLogs] = useState<DamageWasteItem[]>(defaultDamageWaste)
  const [returnsList, setReturnsList] = useState<OrderReturnItem[]>(defaultOrderReturns)
  const [suppliersList, setSuppliersList] = useState<SupplierItem[]>(defaultSuppliers)

  // Adjust Stock Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [adjustTargetProduct, setAdjustTargetProduct] = useState<InventoryProduct | null>(null)
  const [selectedVariantSku, setSelectedVariantSku] = useState<string>('ALL')
  const [adjustType, setAdjustType] = useState<'ADJUST' | 'RECEIVE' | 'DAMAGE' | 'TRANSFER'>('ADJUST')
  const [adjustQty, setAdjustQty] = useState<number>(10)
  const [adjustReason, setAdjustReason] = useState<string>('Physical cycle-count audit')
  const [adjustReference, setAdjustReference] = useState<string>('')
  const [isSubmittingAdjust, setIsSubmittingAdjust] = useState(false)

  // Inline adjustment state
  const [isSubmittingInline, setIsSubmittingInline] = useState(false)

  // Create PO Modal State
  const [isPOModalOpen, setIsPOModalOpen] = useState(false)
  const [poSupplierId, setPOSupplierId] = useState<string>('')
  const [poProductId, setPOProductId] = useState<string>('')
  const [poQuantity, setPOQuantity] = useState<number>(50)
  const [poUnitCost, setPOUnitCost] = useState<number>(850)
  const [poExpectedDate, setPOExpectedDate] = useState<string>('')
  const [poNotes, setPONotes] = useState<string>('')
  const [isSubmittingPO, setIsSubmittingPO] = useState(false)

  // Record Waste Modal State
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false)
  const [wasteProductId, setWasteProductId] = useState<string>('')
  const [wasteQuantity, setWasteQuantity] = useState<number>(1)
  const [wasteCategory, setWasteCategory] = useState<'DAMAGED' | 'DEFECTIVE' | 'EXPIRED' | 'LOST' | 'OTHER'>('DAMAGED')
  const [wasteReason, setWasteReason] = useState<string>('')
  const [wasteDisposition, setWasteDisposition] = useState<'SCRAPPED' | 'RETURNED_TO_VENDOR' | 'RECYCLED'>('SCRAPPED')
  const [isSubmittingWaste, setIsSubmittingWaste] = useState(false)

  // Customer Return Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [returnOrderNumber, setReturnOrderNumber] = useState<string>('')
  const [returnCustomerName, setReturnCustomerName] = useState<string>('')
  const [returnProductId, setReturnProductId] = useState<string>('')
  const [returnQuantity, setReturnQuantity] = useState<number>(1)
  const [returnReason, setReturnReason] = useState<string>('Size exchange')
  const [returnRestockable, setReturnRestockable] = useState<boolean>(true)
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false)

  // Supplier Modal State
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false)
  const [supName, setSupName] = useState('')
  const [supCode, setSupCode] = useState('')
  const [supContact, setSupContact] = useState('')
  const [supEmail, setSupEmail] = useState('')
  const [supPhone, setSupPhone] = useState('')
  const [supGstin, setSupGstin] = useState('')
  const [supTerms, setSupTerms] = useState('Net 30')
  const [isSubmittingSupplier, setIsSubmittingSupplier] = useState(false)

  // Barcode Modals State
  const [isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen] = useState(false)
  const [barcodeTargetProduct, setBarcodeTargetProduct] = useState<InventoryProduct | null>(null)
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false)

  const showToast = (msg: string) => {
    if (triggerToast) triggerToast(msg)
    else alert(msg)
  }

  // Fetch live sub-records on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [txnRes, poRes, wasteRes, retRes, supRes] = await Promise.all([
          fetch('/api/inventory/transactions').catch(() => null),
          fetch('/api/inventory/po').catch(() => null),
          fetch('/api/inventory/waste').catch(() => null),
          fetch('/api/returns').catch(() => null),
          fetch('/api/inventory/suppliers').catch(() => null),
        ])

        if (txnRes && txnRes.ok) {
          const data = await txnRes.json()
          if (data.transactions) setTransactions(data.transactions)
        }
        if (poRes && poRes.ok) {
          const data = await poRes.json()
          if (data.purchaseOrders) setPurchaseOrders(data.purchaseOrders)
        }
        if (wasteRes && wasteRes.ok) {
          const data = await wasteRes.json()
          if (data.wasteLogs) setWasteLogs(data.wasteLogs)
        }
        if (retRes && retRes.ok) {
          const data = await retRes.json()
          if (data.returns) setReturnsList(data.returns)
        }
        if (supRes && supRes.ok) {
          const data = await supRes.json()
          if (data.suppliers) setSuppliersList(data.suppliers)
        }
      } catch (err) {
        console.warn('Failed to load inventory records:', err)
      }
    }
    fetchData()
  }, [])

  // Execute Stock Adjustment (Modal)
  const handleExecuteAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustTargetProduct) return
    setIsSubmittingAdjust(true)

    try {
      const activeVariant = selectedVariantSku !== 'ALL' && adjustTargetProduct.variants
        ? adjustTargetProduct.variants.find((v) => v.sku === selectedVariantSku)
        : null

      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: adjustTargetProduct.id,
          type: adjustType,
          quantityChange: adjustType === 'DAMAGE' ? -Math.abs(adjustQty) : adjustQty,
          reason: adjustReason,
          reference: adjustReference,
          performedBy: 'Admin (Inventory Operations)',
          variantSku: selectedVariantSku !== 'ALL' ? selectedVariantSku : undefined,
          variantSize: activeVariant?.size,
          variantColor: activeVariant?.color,
        }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`Stock updated: ${adjustTargetProduct.name} (New count: ${data.product.stockQuantity})`)
        adjustTargetProduct.stockQuantity = data.product.stockQuantity
        adjustTargetProduct.inStock = data.product.inStock
        if (data.product.variants) {
          adjustTargetProduct.variants = data.product.variants
        }
        if (data.transaction) {
          setTransactions((prev) => [data.transaction, ...prev])
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
        setIsAdjustModalOpen(false)
      } else {
        alert(data.error || 'Failed to adjust stock')
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting stock adjustment')
    } finally {
      setIsSubmittingAdjust(false)
    }
  }

  // Execute Inline Row Stock Adjustment
  const handleExecuteInlineAdjust = async (
    product: InventoryProduct,
    delta: number,
    type: 'ADJUST' | 'RECEIVE' | 'DAMAGE',
    reason?: string
  ) => {
    setIsSubmittingInline(true)
    try {
      const change = type === 'DAMAGE' ? -Math.abs(delta) : delta
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          type: type,
          quantityChange: change,
          reason: reason || 'Quick stock update',
          reference: 'INLINE-ADJUST',
          performedBy: 'Admin (Operations)',
        }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`Stock updated: ${product.name} (New: ${data.product.stockQuantity})`)
        product.stockQuantity = data.product.stockQuantity
        product.inStock = data.product.inStock
        if (data.transaction) {
          setTransactions((prev) => [data.transaction, ...prev])
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to update stock')
      }
    } catch (err: any) {
      alert(err.message || 'Error updating stock')
    } finally {
      setIsSubmittingInline(false)
    }
  }

  // Create Purchase Order
  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedProduct = products.find((p) => p.id === poProductId) || products[0]
    const selectedSupplier = suppliersList.find((s) => s.supplierId === poSupplierId) || suppliersList[0]

    if (!selectedProduct || !selectedSupplier) {
      alert('Please select both a supplier and a product item.')
      return
    }

    setIsSubmittingPO(true)
    try {
      const res = await fetch('/api/inventory/po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: selectedSupplier.supplierId,
          supplierName: selectedSupplier.name,
          supplierGstin: selectedSupplier.gstin,
          expectedDate: poExpectedDate,
          notes: poNotes,
          items: [
            {
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              sku: selectedProduct.sku || `VS-${selectedProduct.id.slice(0, 8).toUpperCase()}`,
              quantity: poQuantity,
              unitCost: poUnitCost,
              totalCost: poQuantity * poUnitCost,
            },
          ],
        }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`Purchase Order ${data.purchaseOrder.poNumber} created successfully!`)
        setPurchaseOrders((prev) => [data.purchaseOrder, ...prev])
        setIsPOModalOpen(false)
      } else {
        alert(data.error || 'Failed to create PO')
      }
    } catch (err: any) {
      alert(err.message || 'Error creating Purchase Order')
    } finally {
      setIsSubmittingPO(false)
    }
  }

  // Receive PO Goods
  const handleReceivePO = async (poNumber: string) => {
    if (!window.confirm(`Mark ${poNumber} as RECEIVED and add ordered quantities into catalog stock?`)) return

    try {
      const res = await fetch('/api/inventory/po', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poNumber, action: 'RECEIVE' }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`PO ${poNumber} received and catalog stock credited!`)
        setPurchaseOrders((prev) => prev.map((p) => (p.poNumber === poNumber ? data.purchaseOrder : p)))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to receive goods')
      }
    } catch (err: any) {
      alert(err.message || 'Error receiving PO')
    }
  }

  // Record Scrap / Damaged Waste
  const handleRecordWaste = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedProduct = products.find((p) => p.id === wasteProductId) || products[0]
    if (!selectedProduct) return

    setIsSubmittingWaste(true)
    try {
      const res = await fetch('/api/inventory/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: wasteQuantity,
          category: wasteCategory,
          reason: wasteReason,
          disposition: wasteDisposition,
          reportedBy: 'Admin (Inventory Operations)',
        }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`Waste logged: ${wasteQuantity}x ${selectedProduct.name} deducted from inventory`)
        setWasteLogs((prev) => [data.wasteEntry, ...prev])
        selectedProduct.stockQuantity = data.product.stockQuantity
        selectedProduct.inStock = data.product.inStock
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
        setIsWasteModalOpen(false)
      } else {
        alert(data.error || 'Failed to record damage')
      }
    } catch (err: any) {
      alert(err.message || 'Error recording waste')
    } finally {
      setIsSubmittingWaste(false)
    }
  }

  // Record Customer Return
  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedProduct = products.find((p) => p.id === returnProductId) || products[0]
    if (!selectedProduct) return

    setIsSubmittingReturn(true)
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: returnOrderNumber.trim() || `ORD-VS${Math.floor(10000 + Math.random() * 90000)}`,
          customerName: returnCustomerName.trim() || 'Storefront Customer',
          items: [
            {
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              sku: selectedProduct.sku || `VS-${selectedProduct.id.slice(0, 8).toUpperCase()}`,
              quantity: returnQuantity,
              reason: returnReason,
              restockable: returnRestockable,
              unitRefund: selectedProduct.price,
            },
          ],
        }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`Return recorded with Credit Note ${data.returnRecord.creditNoteNumber}!`)
        setReturnsList((prev) => [data.returnRecord, ...prev])
        setIsReturnModalOpen(false)
      } else {
        alert(data.error || 'Failed to process return')
      }
    } catch (err: any) {
      alert(err.message || 'Error recording return')
    } finally {
      setIsSubmittingReturn(false)
    }
  }

  // Restock Return
  const handleRestockReturn = async (returnNumber: string) => {
    if (!window.confirm(`Restock returned items back into active warehouse inventory for ${returnNumber}?`)) return

    try {
      const res = await fetch('/api/returns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnNumber, action: 'RESTOCK' }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`Items from return ${returnNumber} restocked into catalog!`)
        setReturnsList((prev) => prev.map((r) => (r.returnNumber === returnNumber ? data.returnRecord : r)))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to restock return')
      }
    } catch (err: any) {
      alert(err.message || 'Error restocking return')
    }
  }

  // Create Supplier
  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supName.trim()) return
    setIsSubmittingSupplier(true)

    try {
      const res = await fetch('/api/inventory/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: supName.trim(),
          code: supCode.trim() || `SUP-${Math.floor(100 + Math.random() * 900)}`,
          contactPerson: supContact.trim(),
          email: supEmail.trim(),
          phone: supPhone.trim(),
          gstin: supGstin.trim(),
          paymentTerms: supTerms,
        }),
      })

      const data = await res.json()
      if (data.success) {
        showToast(`Supplier "${supName}" saved successfully!`)
        setSuppliersList((prev) => [data.supplier, ...prev])
        setSupName('')
        setSupCode('')
        setSupContact('')
        setSupEmail('')
        setSupPhone('')
        setSupGstin('')
        setIsSupplierModalOpen(false)
      } else {
        alert(data.error || 'Failed to save supplier')
      }
    } catch (err: any) {
      alert(err.message || 'Error saving supplier')
    } finally {
      setIsSubmittingSupplier(false)
    }
  }

  const totalStockUnits = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + (typeof p.stockQuantity === 'number' ? p.stockQuantity : (p.inStock ? 25 : 0)),
      0
    )
  }, [products])

  const openAdjustModalWithProduct = (
    product?: InventoryProduct,
    initialType: 'ADJUST' | 'RECEIVE' | 'DAMAGE' | 'TRANSFER' = 'ADJUST',
    qty: number = 10,
    reason: string = 'Physical cycle-count audit'
  ) => {
    const target = product || (products.length > 0 ? products[0] : null)
    setAdjustTargetProduct(target)
    setSelectedVariantSku('ALL')
    setAdjustType(initialType)
    setAdjustQty(qty)
    setAdjustReason(reason)
    setIsAdjustModalOpen(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. TOP STATS BAR */}
      <InventoryStatsBar
        totalStockUnits={totalStockUnits}
        purchaseOrdersCount={purchaseOrders.length}
        transactionsCount={transactions.length}
        wasteLogsCount={wasteLogs.length}
        suppliersCount={suppliersList.length}
      />

      {/* 2. SUBTAB NAVIGATION PILLS */}
      <InventoryNavTabs
        subTab={subTab}
        setSubTab={setSubTab}
        transactionsCount={transactions.length}
        purchaseOrdersCount={purchaseOrders.length}
        wasteLogsCount={wasteLogs.length}
        returnsCount={returnsList.length}
        suppliersCount={suppliersList.length}
        onOpenAdjustTab={() => {
          if (!adjustTargetProduct && products.length > 0) {
            setAdjustTargetProduct(products[0])
          }
        }}
      />

      {/* 3. SUBTAB: STOCK LEDGER */}
      {subTab === 'ledger' && (
        <InventoryLedgerSubtab
          transactions={transactions}
          products={products}
          setSubTab={setSubTab}
          onOpenAdjust={(product) => openAdjustModalWithProduct(product)}
        />
      )}

      {/* 4. SUBTAB: ADJUST STOCK COUNT */}
      {subTab === 'adjust-stock' && (
        <InventoryAdjustStockSubtab
          products={products}
          setSubTab={setSubTab}
          onOpenAdjustModal={(product, initialType, qty, reason) => {
            openAdjustModalWithProduct(product, initialType, qty, reason)
          }}
          onInlineAdjust={handleExecuteInlineAdjust}
          isSubmittingInline={isSubmittingInline}
          onOpenPrintBarcode={(product) => {
            setBarcodeTargetProduct(product)
            setIsPrintBarcodeModalOpen(true)
          }}
          onOpenScanner={() => setIsScannerModalOpen(true)}
        />
      )}

      {/* 5. SUBTAB: PURCHASE ORDERS */}
      {subTab === 'po' && (
        <InventoryPurchaseOrdersSubtab
          purchaseOrders={purchaseOrders}
          onOpenCreatePOModal={() => setIsPOModalOpen(true)}
          onReceivePO={handleReceivePO}
        />
      )}

      {/* 6. SUBTAB: DAMAGED STOCK & WASTE */}
      {subTab === 'waste' && (
        <InventoryWasteSubtab
          wasteLogs={wasteLogs}
          onOpenWasteModal={() => setIsWasteModalOpen(true)}
        />
      )}

      {/* 7. SUBTAB: RETURNS & CREDIT NOTES */}
      {subTab === 'returns' && (
        <InventoryReturnsSubtab
          returnsList={returnsList}
          onOpenReturnModal={() => setIsReturnModalOpen(true)}
          onRestockReturn={handleRestockReturn}
        />
      )}

      {/* 8. SUBTAB: SUPPLIERS DIRECTORY */}
      {subTab === 'suppliers' && (
        <InventorySuppliersSubtab
          suppliersList={suppliersList}
          onOpenSupplierModal={() => setIsSupplierModalOpen(true)}
          onIssuePOToSupplier={(supplierId) => {
            setPOSupplierId(supplierId)
            setIsPOModalOpen(true)
          }}
        />
      )}

      {/* MODALS */}
      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={adjustTargetProduct}
        adjustType={adjustType}
        setAdjustType={setAdjustType}
        adjustQty={adjustQty}
        setAdjustQty={setAdjustQty}
        adjustReason={adjustReason}
        setAdjustReason={setAdjustReason}
        adjustReference={adjustReference}
        setAdjustReference={setAdjustReference}
        selectedVariantSku={selectedVariantSku}
        setSelectedVariantSku={setSelectedVariantSku}
        onSubmit={handleExecuteAdjust}
        isSubmitting={isSubmittingAdjust}
      />

      <CreatePOModal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        suppliersList={suppliersList}
        products={products}
        poSupplierId={poSupplierId}
        setPOSupplierId={setPOSupplierId}
        poProductId={poProductId}
        setPOProductId={setPOProductId}
        poQuantity={poQuantity}
        setPOQuantity={setPOQuantity}
        poUnitCost={poUnitCost}
        setPOUnitCost={setPOUnitCost}
        poExpectedDate={poExpectedDate}
        setPOExpectedDate={setPOExpectedDate}
        poNotes={poNotes}
        setPONotes={setPONotes}
        onSubmit={handleCreatePO}
        isSubmitting={isSubmittingPO}
      />

      <RecordWasteModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
        products={products}
        wasteProductId={wasteProductId}
        setWasteProductId={setWasteProductId}
        wasteQuantity={wasteQuantity}
        setWasteQuantity={setWasteQuantity}
        wasteCategory={wasteCategory}
        setWasteCategory={setWasteCategory}
        wasteReason={wasteReason}
        setWasteReason={setWasteReason}
        wasteDisposition={wasteDisposition}
        setWasteDisposition={setWasteDisposition}
        onSubmit={handleRecordWaste}
        isSubmitting={isSubmittingWaste}
      />

      <RecordReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        products={products}
        returnOrderNumber={returnOrderNumber}
        setReturnOrderNumber={setReturnOrderNumber}
        returnCustomerName={returnCustomerName}
        setReturnCustomerName={setReturnCustomerName}
        returnProductId={returnProductId}
        setReturnProductId={setReturnProductId}
        returnQuantity={returnQuantity}
        setReturnQuantity={setReturnQuantity}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
        returnRestockable={returnRestockable}
        setReturnRestockable={setReturnRestockable}
        onSubmit={handleCreateReturn}
        isSubmitting={isSubmittingReturn}
      />

      <AddSupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        supName={supName}
        setSupName={setSupName}
        supCode={supCode}
        setSupCode={setSupCode}
        supContact={supContact}
        setSupContact={setSupContact}
        supEmail={supEmail}
        setSupEmail={setSupEmail}
        supPhone={supPhone}
        setSupPhone={setSupPhone}
        supGstin={supGstin}
        setSupGstin={setSupGstin}
        supTerms={supTerms}
        setSupTerms={setSupTerms}
        onSubmit={handleCreateSupplier}
        isSubmitting={isSubmittingSupplier}
      />

      {/* DUAL BARCODE ENGINE MODALS */}
      <PrintBarcodeModal
        isOpen={isPrintBarcodeModalOpen}
        onClose={() => setIsPrintBarcodeModalOpen(false)}
        product={barcodeTargetProduct}
      />

      <BarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        products={products}
        onAdjustStock={async (product, delta, type, reason, variantSku) => {
          const activeVariant = variantSku && product.variants
            ? product.variants.find((v) => v.sku === variantSku)
            : null

          const res = await fetch('/api/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              type,
              quantityChange: delta,
              reason,
              reference: 'BARCODE-SCAN',
              performedBy: 'Admin (Barcode Gun)',
              variantSku,
              variantSize: activeVariant?.size,
              variantColor: activeVariant?.color,
            }),
          })

          const data = await res.json()
          if (data.success) {
            showToast(`Scanned & Updated: ${product.name} (Stock: ${data.product.stockQuantity})`)
            product.stockQuantity = data.product.stockQuantity
            product.inStock = data.product.inStock
            if (data.product.variants) {
              product.variants = data.product.variants
            }
            if (data.transaction) {
              setTransactions((prev) => [data.transaction, ...prev])
            }
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('storage'))
            }
          } else {
            throw new Error(data.error || 'Failed to update stock via scanner')
          }
        }}
      />
    </div>
  )
}
