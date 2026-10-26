'use client'

import {
  ClipboardList,
  SlidersHorizontal,
  Truck,
  AlertTriangle,
  RotateCcw,
  Layers,
} from 'lucide-react'
import type { InventorySubTab } from './types'

export interface InventoryNavTabsProps {
  subTab: InventorySubTab
  setSubTab: (tab: InventorySubTab) => void
  transactionsCount: number
  purchaseOrdersCount: number
  wasteLogsCount: number
  returnsCount: number
  suppliersCount: number
  onOpenAdjustTab?: () => void
}

export function InventoryNavTabs({
  subTab,
  setSubTab,
  transactionsCount,
  purchaseOrdersCount,
  wasteLogsCount,
  returnsCount,
  suppliersCount,
  onOpenAdjustTab,
}: InventoryNavTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2">
      <button
        type="button"
        onClick={() => setSubTab('ledger')}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
          subTab === 'ledger'
            ? 'bg-[#080d2d] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
        <span>Stock Ledger ({transactionsCount})</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (onOpenAdjustTab) onOpenAdjustTab()
          setSubTab('adjust-stock')
        }}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
          subTab === 'adjust-stock'
            ? 'bg-[#080d2d] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-blue-400" />
        <span>Adjust Stock</span>
      </button>

      <button
        type="button"
        onClick={() => setSubTab('po')}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
          subTab === 'po'
            ? 'bg-[#080d2d] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <Truck className="h-3.5 w-3.5 text-emerald-500" />
        <span>Purchase Orders ({purchaseOrdersCount})</span>
      </button>

      <button
        type="button"
        onClick={() => setSubTab('waste')}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
          subTab === 'waste'
            ? 'bg-[#080d2d] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        <span>Damaged &amp; Waste ({wasteLogsCount})</span>
      </button>

      <button
        type="button"
        onClick={() => setSubTab('returns')}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
          subTab === 'returns'
            ? 'bg-[#080d2d] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <RotateCcw className="h-3.5 w-3.5 text-purple-500" />
        <span>Returns &amp; Credit Notes ({returnsCount})</span>
      </button>

      <button
        type="button"
        onClick={() => setSubTab('suppliers')}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
          subTab === 'suppliers'
            ? 'bg-[#080d2d] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <Layers className="h-3.5 w-3.5 text-cyan-500" />
        <span>Suppliers ({suppliersCount})</span>
      </button>
    </div>
  )
}
