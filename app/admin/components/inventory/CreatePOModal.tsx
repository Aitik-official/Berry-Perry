'use client'

import { Truck, X, Loader2 } from 'lucide-react'
import type { SupplierItem } from '@/lib/inventory-data'
import type { InventoryProduct } from './types'

export interface CreatePOModalProps {
  isOpen: boolean
  onClose: () => void
  suppliersList: SupplierItem[]
  products: InventoryProduct[]
  poSupplierId: string
  setPOSupplierId: (id: string) => void
  poProductId: string
  setPOProductId: (id: string) => void
  poQuantity: number
  setPOQuantity: (qty: number) => void
  poUnitCost: number
  setPOUnitCost: (cost: number) => void
  poExpectedDate: string
  setPOExpectedDate: (date: string) => void
  poNotes: string
  setPONotes: (notes: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isSubmitting: boolean
}

export function CreatePOModal({
  isOpen,
  onClose,
  suppliersList,
  products,
  poSupplierId,
  setPOSupplierId,
  poProductId,
  setPOProductId,
  poQuantity,
  setPOQuantity,
  poUnitCost,
  setPOUnitCost,
  poExpectedDate,
  setPOExpectedDate,
  poNotes,
  setPONotes,
  onSubmit,
  isSubmitting,
}: CreatePOModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-black text-sm uppercase text-[#080d2d]">Create Purchase Order</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Supplier</label>
            <select
              value={poSupplierId}
              onChange={(e) => setPOSupplierId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            >
              <option value="">-- Choose Supplier --</option>
              {suppliersList.map((s) => (
                <option key={s.supplierId} value={s.supplierId}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catalog Item to Order</label>
            <select
              value={poProductId}
              onChange={(e) => {
                setPOProductId(e.target.value)
                const p = products.find((item) => item.id === e.target.value)
                if (p && p.costPrice) setPOUnitCost(p.costPrice)
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current Stock: {p.stockQuantity ?? 25})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Order Quantity (Units)</label>
              <input
                type="number"
                min="1"
                value={poQuantity}
                onChange={(e) => setPOQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Agreed Unit Cost (₹)</label>
              <input
                type="number"
                min="0"
                value={poUnitCost}
                onChange={(e) => setPOUnitCost(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
                required
              />
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50 p-2.5 flex items-center justify-between text-emerald-900 font-bold">
            <span>Estimated PO Value:</span>
            <span className="text-sm font-black">₹{(poQuantity * poUnitCost).toLocaleString('en-IN')}</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Expected Delivery Date</label>
            <input
              type="date"
              value={poExpectedDate}
              onChange={(e) => setPOExpectedDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Procurement Notes</label>
            <input
              type="text"
              value={poNotes}
              onChange={(e) => setPONotes(e.target.value)}
              placeholder="e.g. Express air freight requested"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
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
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Issue Purchase Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
