'use client'

import { AlertTriangle, X, Loader2 } from 'lucide-react'
import type { InventoryProduct } from './types'

export interface RecordWasteModalProps {
  isOpen: boolean
  onClose: () => void
  products: InventoryProduct[]
  wasteProductId: string
  setWasteProductId: (id: string) => void
  wasteQuantity: number
  setWasteQuantity: (qty: number) => void
  wasteCategory: 'DAMAGED' | 'DEFECTIVE' | 'EXPIRED' | 'LOST' | 'OTHER'
  setWasteCategory: (cat: 'DAMAGED' | 'DEFECTIVE' | 'EXPIRED' | 'LOST' | 'OTHER') => void
  wasteReason: string
  setWasteReason: (reason: string) => void
  wasteDisposition: 'SCRAPPED' | 'RETURNED_TO_VENDOR' | 'RECYCLED'
  setWasteDisposition: (disp: 'SCRAPPED' | 'RETURNED_TO_VENDOR' | 'RECYCLED') => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isSubmitting: boolean
}

export function RecordWasteModal({
  isOpen,
  onClose,
  products,
  wasteProductId,
  setWasteProductId,
  wasteQuantity,
  setWasteQuantity,
  wasteCategory,
  setWasteCategory,
  wasteReason,
  setWasteReason,
  wasteDisposition,
  setWasteDisposition,
  onSubmit,
  isSubmitting,
}: RecordWasteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h3 className="font-black text-sm uppercase text-[#080d2d]">Record Scrapped / Damaged Stock</h3>
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
            <label className="block font-bold text-slate-700 mb-1">Damaged Product Item</label>
            <select
              value={wasteProductId}
              onChange={(e) => setWasteProductId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stockQuantity ?? 25})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Units Scrapped</label>
              <input
                type="number"
                min="1"
                value={wasteQuantity}
                onChange={(e) => setWasteQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Waste Category</label>
              <select
                value={wasteCategory}
                onChange={(e) => setWasteCategory(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              >
                <option value="DAMAGED">DAMAGED (Transit/Handling)</option>
                <option value="DEFECTIVE">DEFECTIVE (Stitch / Zipper Flaw)</option>
                <option value="EXPIRED">EXPIRED (Past Season Scrap)</option>
                <option value="LOST">LOST (Discrepancy)</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Damage / Loss</label>
            <input
              type="text"
              value={wasteReason}
              onChange={(e) => setWasteReason(e.target.value)}
              placeholder="e.g. Water damage during warehouse roof maintenance"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Disposition Action</label>
            <select
              value={wasteDisposition}
              onChange={(e) => setWasteDisposition(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
            >
              <option value="SCRAPPED">SCRAPPED (Dispose)</option>
              <option value="RETURNED_TO_VENDOR">RETURNED_TO_VENDOR (Supplier Credit)</option>
              <option value="RECYCLED">RECYCLED (Textile Recycling)</option>
            </select>
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
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Deduct &amp; Log Waste</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
