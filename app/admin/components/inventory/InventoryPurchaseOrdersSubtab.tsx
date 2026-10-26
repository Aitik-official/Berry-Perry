'use client'

import { Plus, Check } from 'lucide-react'
import type { PurchaseOrderItem } from '@/lib/inventory-data'

export interface InventoryPurchaseOrdersSubtabProps {
  purchaseOrders: PurchaseOrderItem[]
  onOpenCreatePOModal: () => void
  onReceivePO: (poNumber: string) => void
}

export function InventoryPurchaseOrdersSubtab({
  purchaseOrders,
  onOpenCreatePOModal,
  onReceivePO,
}: InventoryPurchaseOrdersSubtabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#080d2d]">
            Procurement &amp; Supplier Purchase Orders
          </h3>
          <p className="text-xs text-slate-400">Generate factory purchase orders and receive incoming batches.</p>
        </div>
        <button
          type="button"
          onClick={onOpenCreatePOModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#080d2d] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">PO Number</th>
                <th className="px-4 py-3">Supplier / Vendor</th>
                <th className="px-4 py-3">Items &amp; Quantities</th>
                <th className="px-4 py-3">Total Value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Expected Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No purchase orders recorded yet.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => {
                  const isReceived = po.status === 'RECEIVED'
                  return (
                    <tr key={po.poNumber} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-mono font-bold text-[#080d2d]">{po.poNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#080d2d]">{po.supplierName}</div>
                        {po.supplierGstin && (
                          <div className="text-[10px] text-slate-400 font-mono">GSTIN: {po.supplierGstin}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {po.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700">
                            • {it.productName} <span className="font-bold">({it.quantity} units)</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 font-black text-[#080d2d]">₹{po.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isReceived
                              ? 'bg-emerald-100 text-emerald-800'
                              : po.status === 'ORDERED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-medium">
                        {po.expectedDate || 'Not specified'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isReceived ? (
                          <button
                            type="button"
                            onClick={() => onReceivePO(po.poNumber)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-sm transition"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Receive Goods</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700">✓ Intake Completed</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
