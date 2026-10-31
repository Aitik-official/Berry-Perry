'use client'

import { useMemo, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import type { InventoryTransactionItem } from '@/lib/inventory-data'
import type { InventoryProduct, InventorySubTab } from './types'
import { InventoryPagination } from './InventoryPagination'

export interface InventoryLedgerSubtabProps {
  transactions: InventoryTransactionItem[]
  products: InventoryProduct[]
  setSubTab: (tab: InventorySubTab) => void
  onOpenAdjust: (product?: InventoryProduct) => void
}

export function InventoryLedgerSubtab({
  transactions,
  products,
  setSubTab,
  onOpenAdjust,
}: InventoryLedgerSubtabProps) {
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>('ALL')
  const [ledgerSearch, setLedgerSearch] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(15)

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (ledgerTypeFilter !== 'ALL' && t.type !== ledgerTypeFilter) return false
      if (ledgerSearch.trim()) {
        const q = ledgerSearch.toLowerCase()
        return (
          t.productName.toLowerCase().includes(q) ||
          t.sku.toLowerCase().includes(q) ||
          (t.reference && t.reference.toLowerCase().includes(q)) ||
          t.reason.toLowerCase().includes(q) ||
          t.transactionId.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [transactions, ledgerTypeFilter, ledgerSearch])

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTransactions.slice(start, start + pageSize)
  }, [filteredTransactions, currentPage, pageSize])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ledger by transaction ID, SKU, product, reference..."
            value={ledgerSearch}
            onChange={(e) => setLedgerSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-[#080d2d] outline-none focus:border-[#EB008B]"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={ledgerTypeFilter}
            onChange={(e) => setLedgerTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
          >
            <option value="ALL">All Types</option>
            <option value="RECEIVE">RECEIVE (Intake)</option>
            <option value="SALE">SALE (Orders)</option>
            <option value="RETURN">RETURN (Customer)</option>
            <option value="ADJUST">ADJUST (Reconciliation)</option>
            <option value="DAMAGE">DAMAGE (Scrapped)</option>
            <option value="TRANSFER">TRANSFER (Movement)</option>
          </select>

          <button
            type="button"
            onClick={() => {
              if (products.length > 0) {
                onOpenAdjust(products[0])
              }
              setSubTab('adjust-stock')
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#080d2d] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-blue-400" />
            <span>Adjust Stock Count</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Txn ID &amp; Time</th>
                <th className="px-4 py-3">Product / SKU</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Previous</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">New Balance</th>
                <th className="px-4 py-3">Reason / Ref</th>
                <th className="px-4 py-3">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    No transactions recorded matching your search.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t) => {
                  let typeBadge = (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {t.type}
                    </span>
                  )
                  if (t.type === 'RECEIVE') {
                    typeBadge = (
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1 w-fit">
                        <ArrowUpRight className="h-3 w-3" /> RECEIVE
                      </span>
                    )
                  } else if (t.type === 'SALE') {
                    typeBadge = (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 flex items-center gap-1 w-fit">
                        <ArrowDownRight className="h-3 w-3" /> SALE
                      </span>
                    )
                  } else if (t.type === 'RETURN') {
                    typeBadge = (
                      <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 flex items-center gap-1 w-fit">
                        <RotateCcw className="h-3 w-3" /> RETURN
                      </span>
                    )
                  } else if (t.type === 'DAMAGE') {
                    typeBadge = (
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 flex items-center gap-1 w-fit">
                        <AlertTriangle className="h-3 w-3" /> DAMAGE
                      </span>
                    )
                  } else if (t.type === 'ADJUST') {
                    typeBadge = (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 flex items-center gap-1 w-fit">
                        <SlidersHorizontal className="h-3 w-3" /> ADJUST
                      </span>
                    )
                  }

                  return (
                    <tr key={t.transactionId} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-[#080d2d]">{t.transactionId}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(t.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#080d2d]">{t.productName}</div>
                        <div className="text-[10px] font-mono text-slate-400">SKU: {t.sku}</div>
                      </td>
                      <td className="px-4 py-3">{typeBadge}</td>
                      <td className="px-4 py-3 font-semibold text-slate-500">{t.previousStock}</td>
                      <td className="px-4 py-3 font-black">
                        <span className={t.quantityChange > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-black text-[#080d2d]">{t.newStock}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 line-clamp-1">{t.reason}</div>
                        {t.reference && (
                          <div className="text-[10px] font-mono text-blue-600 font-bold">Ref: {t.reference}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-medium">{t.performedBy}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Table Pagination */}
        <InventoryPagination
          currentPage={currentPage}
          totalItems={filteredTransactions.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          pageSizeOptions={[15, 30, 50, 100]}
        />
      </div>
    </div>
  )
}
