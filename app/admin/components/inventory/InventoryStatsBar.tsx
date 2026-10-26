import { Package, Truck, ClipboardList, AlertTriangle, Layers } from 'lucide-react'

export interface InventoryStatsBarProps {
  totalStockUnits: number
  purchaseOrdersCount: number
  transactionsCount: number
  wasteLogsCount: number
  suppliersCount: number
}

export function InventoryStatsBar({
  totalStockUnits,
  purchaseOrdersCount,
  transactionsCount,
  wasteLogsCount,
  suppliersCount,
}: InventoryStatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4 lg:grid-cols-5">
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Units</span>
          <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
        </div>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-black text-[#080d2d]">{totalStockUnits}</p>
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">Warehouse Count</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Purchase Orders</span>
          <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
        </div>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-black text-emerald-600">{purchaseOrdersCount}</p>
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">Procurement Orders</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Ledger Moves</span>
          <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
        </div>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-black text-[#080d2d]">{transactionsCount}</p>
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">Audit Trail Entries</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Damaged / Waste</span>
          <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600" />
        </div>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-black text-rose-600">{wasteLogsCount}</p>
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">Scrap Logged</span>
      </div>

      <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Suppliers</span>
          <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-600" />
        </div>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-black text-[#080d2d]">{suppliersCount}</p>
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">Active Vendors</span>
      </div>
    </div>
  )
}
