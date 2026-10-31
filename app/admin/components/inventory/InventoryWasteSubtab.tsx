'use client'

import { useState, useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { DamageWasteItem } from '@/lib/inventory-data'
import { InventoryPagination } from './InventoryPagination'

export interface InventoryWasteSubtabProps {
  wasteLogs: DamageWasteItem[]
  onOpenWasteModal: () => void
}

export function InventoryWasteSubtab({
  wasteLogs,
  onOpenWasteModal,
}: InventoryWasteSubtabProps) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const paginatedWasteLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return wasteLogs.slice(start, start + pageSize)
  }, [wasteLogs, currentPage, pageSize])
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#080d2d]">
            Damaged Stock, Scrap &amp; Waste Management
          </h3>
          <p className="text-xs text-slate-400">
            Audit scrap units (Damaged, Defective, Expired, Lost) with automatic inventory reduction.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenWasteModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-rose-700 transition"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Record Damaged Units</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Waste Log ID</th>
                <th className="px-4 py-3">Product Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Quantity Scrapped</th>
                <th className="px-4 py-3">Est. Financial Loss</th>
                <th className="px-4 py-3">Reason / Disposition</th>
                <th className="px-4 py-3">Reported By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wasteLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    Zero damage or scrap waste logged.
                  </td>
                </tr>
              ) : (
                paginatedWasteLogs.map((w) => (
                  <tr key={w.wasteId} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{w.wasteId}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#080d2d]">{w.productName}</div>
                      <div className="text-[10px] font-mono text-slate-400">SKU: {w.sku}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                        {w.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-rose-600">-{w.quantity} units</td>
                    <td className="px-4 py-3 font-bold text-[#080d2d]">₹{w.estimatedLoss}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 line-clamp-1">{w.reason}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Action: {w.disposition}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{w.reportedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Waste Table Pagination */}
        <InventoryPagination
          currentPage={currentPage}
          totalItems={wasteLogs.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>
    </div>
  )
}
