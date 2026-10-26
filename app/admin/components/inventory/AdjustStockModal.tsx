'use client'

import { SlidersHorizontal, X, Loader2 } from 'lucide-react'
import type { InventoryProduct } from './types'

export interface AdjustStockModalProps {
  isOpen: boolean
  onClose: () => void
  product: InventoryProduct | null
  products?: InventoryProduct[]
  onSelectProduct?: (product: InventoryProduct) => void
  adjustType: 'ADJUST' | 'RECEIVE' | 'DAMAGE' | 'TRANSFER'
  setAdjustType: (type: 'ADJUST' | 'RECEIVE' | 'DAMAGE' | 'TRANSFER') => void
  adjustQty: number
  setAdjustQty: (qty: number) => void
  adjustReason: string
  setAdjustReason: (reason: string) => void
  adjustReference: string
  setAdjustReference: (ref: string) => void
  selectedVariantSku?: string
  setSelectedVariantSku?: (sku: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isSubmitting: boolean
}

export function AdjustStockModal({
  isOpen,
  onClose,
  product,
  adjustType,
  setAdjustType,
  adjustQty,
  setAdjustQty,
  adjustReason,
  setAdjustReason,
  adjustReference,
  setAdjustReference,
  selectedVariantSku = 'ALL',
  setSelectedVariantSku,
  onSubmit,
  isSubmitting,
}: AdjustStockModalProps) {
  if (!isOpen || !product) return null

  // Calculate available variant combinations if not already set
  const sizes = product.sizes?.length ? product.sizes : []
  const colors = product.colors?.length ? product.colors.map((c) => c.name) : []
  const hasVariants = sizes.length > 0 || colors.length > 0

  const computedVariants = product.variants && product.variants.length > 0
    ? product.variants
    : (() => {
        const list: { sku: string; size: string; color: string; stockQuantity: number }[] = []
        const useColors = colors.length ? colors : ['Standard']
        const useSizes = sizes.length ? sizes : ['Standard']
        const total = product.stockQuantity ?? 25
        const count = useColors.length * useSizes.length
        const per = Math.max(1, Math.floor(total / count))

        for (const c of useColors) {
          for (const s of useSizes) {
            const colCode = c.slice(0, 3).toUpperCase()
            const szCode = s.toUpperCase()
            list.push({
              sku: `${product.sku || 'VS-' + product.id.slice(0, 5).toUpperCase()}-${colCode}-${szCode}`,
              size: s,
              color: c,
              stockQuantity: per,
            })
          }
        }
        return list
      })()

  const activeVariant = computedVariants.find((v) => v.sku === selectedVariantSku)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            <h3 className="font-black text-sm uppercase text-[#080d2d]">Adjust Stock Count</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Product Card (Locked to the item clicked) */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="h-12 w-12 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-[#080d2d] truncate">{product.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[10px] text-slate-400">
                SKU: {product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-bold text-[#080d2d]">
                Total: <span className="font-mono text-blue-600">{product.stockQuantity ?? 25}</span> units
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          {/* Target Variant Scope: Whole product vs Specific Size/Color */}
          {hasVariants && setSelectedVariantSku && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Variant Scope (Color &amp; Size)
              </label>
              <select
                value={selectedVariantSku}
                onChange={(e) => setSelectedVariantSku(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              >
                <option value="ALL">Entire Product (All Variants / General Pool)</option>
                {computedVariants.map((v) => (
                  <option key={v.sku} value={v.sku}>
                    {v.color} / Size {v.size} — Stock: {v.stockQuantity} (SKU: {v.sku})
                  </option>
                ))}
              </select>
              {activeVariant && (
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  Targeting <span className="font-bold text-[#080d2d]">{activeVariant.color} / {activeVariant.size}</span> (Current count: <span className="font-mono font-bold text-blue-600">{activeVariant.stockQuantity}</span> units)
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Adjustment Type</label>
            <select
              value={adjustType}
              onChange={(e) => setAdjustType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
            >
              <option value="ADJUST">ADJUST - Cycle Count Reconciliation (+/-)</option>
              <option value="RECEIVE">RECEIVE - Add Intake Stock (+)</option>
              <option value="DAMAGE">DAMAGE - Deduct Scrapped Units (-)</option>
              <option value="TRANSFER">TRANSFER - Warehouse Location Move (+/-)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Quantity Delta ({adjustType === 'DAMAGE' ? 'Deduct Units' : '+ or - Change'})
            </label>
            <input
              type="number"
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason / Description</label>
            <input
              type="text"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="e.g. Physical inventory count verified"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reference ID (Optional)</label>
            <input
              type="text"
              value={adjustReference}
              onChange={(e) => setAdjustReference(e.target.value)}
              placeholder="e.g. AUDIT-OCT-26"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-[#080d2d] outline-none focus:border-[#EB008B]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-[#080d2d] px-4 py-2 font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Commit Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
