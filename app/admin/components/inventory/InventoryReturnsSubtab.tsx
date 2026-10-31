'use client'

import { useState, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import type { OrderReturnItem } from '@/lib/inventory-data'
import { InventoryPagination } from './InventoryPagination'

export interface InventoryReturnsSubtabProps {
  returnsList: OrderReturnItem[]
  onOpenReturnModal: () => void
  onRestockReturn: (returnNumber: string) => void
}

export function InventoryReturnsSubtab({
  returnsList,
  onOpenReturnModal,
  onRestockReturn,
}: InventoryReturnsSubtabProps) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const paginatedReturnsList = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return returnsList.slice(start, start + pageSize)
  }, [returnsList, currentPage, pageSize])
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#080d2d]">
            Customer Order Returns &amp; Credit Notes
          </h3>
          <p className="text-xs text-slate-400">
            Track return merchandise authorization (RMA), auto-generate Credit Notes (CN-XXXXX), and restock items.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReturnModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#080d2d] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Record Order Return</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Return ID</th>
                <th className="px-4 py-3">Order Ref / Customer</th>
                <th className="px-4 py-3">Returned Items</th>
                <th className="px-4 py-3">Credit Note</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returnsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No customer returns recorded.
                  </td>
                </tr>
              ) : (
                paginatedReturnsList.map((ret) => {
                  const isRestocked = ret.status === 'RESTOCKED'
                  return (
                    <tr key={ret.returnNumber} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-mono font-bold text-[#080d2d]">{ret.returnNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#080d2d]">{ret.customerName}</div>
                        <div className="text-[10px] text-blue-600 font-mono font-bold">Order: {ret.orderNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        {ret.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700">
                            • {it.productName} ({it.quantity}x) - <span className="text-slate-500">{it.reason}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-purple-700">{ret.creditNoteNumber}</div>
                        <div className="font-black text-[#080d2d]">₹{ret.creditNoteAmt}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isRestocked
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ret.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isRestocked ? (
                          <button
                            type="button"
                            onClick={() => onRestockReturn(ret.returnNumber)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-purple-700 shadow-sm transition"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Restock Units</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700">✓ Restocked into Catalog</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Returns Table Pagination */}
        <InventoryPagination
          currentPage={currentPage}
          totalItems={returnsList.length}
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
