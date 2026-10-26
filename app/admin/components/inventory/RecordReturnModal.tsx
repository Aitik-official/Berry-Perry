'use client'

import { RotateCcw, X, Loader2 } from 'lucide-react'
import type { InventoryProduct } from './types'

export interface RecordReturnModalProps {
  isOpen: boolean
  onClose: () => void
  products: InventoryProduct[]
  returnOrderNumber: string
  setReturnOrderNumber: (num: string) => void
  returnCustomerName: string
  setReturnCustomerName: (name: string) => void
  returnProductId: string
  setReturnProductId: (id: string) => void
  returnQuantity: number
  setReturnQuantity: (qty: number) => void
  returnReason: string
  setReturnReason: (reason: string) => void
  returnRestockable: boolean
  setReturnRestockable: (val: boolean) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isSubmitting: boolean
}

export function RecordReturnModal({
  isOpen,
  onClose,
  products,
  returnOrderNumber,
  setReturnOrderNumber,
  returnCustomerName,
  setReturnCustomerName,
  returnProductId,
  setReturnProductId,
  returnQuantity,
  setReturnQuantity,
  returnReason,
  setReturnReason,
  returnRestockable,
  setReturnRestockable,
  onSubmit,
  isSubmitting,
}: RecordReturnModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-purple-600" />
            <h3 className="font-black text-sm uppercase text-[#080d2d]">Record Return &amp; Credit Note</h3>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Order Number</label>
              <input
                type="text"
                value={returnOrderNumber}
                onChange={(e) => setReturnOrderNumber(e.target.value)}
                placeholder="e.g. ORD-VS98241"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={returnCustomerName}
                onChange={(e) => setReturnCustomerName(e.target.value)}
                placeholder="e.g. Rohit K."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Returned Product</label>
            <select
              value={returnProductId}
              onChange={(e) => setReturnProductId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity Returned</label>
              <input
                type="number"
                min="1"
                value={returnQuantity}
                onChange={(e) => setReturnQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
                required
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={returnRestockable}
                  onChange={(e) => setReturnRestockable(e.target.checked)}
                  className="rounded accent-purple-600"
                />
                <span>Restockable item</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Return Reason</label>
            <input
              type="text"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="e.g. Sizing too compact for thigh guard fit"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
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
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Generate Credit Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
