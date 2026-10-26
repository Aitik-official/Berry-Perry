'use client'

import { Plus, ChevronRight } from 'lucide-react'
import type { SupplierItem } from '@/lib/inventory-data'

export interface InventorySuppliersSubtabProps {
  suppliersList: SupplierItem[]
  onOpenSupplierModal: () => void
  onIssuePOToSupplier: (supplierId: string) => void
}

export function InventorySuppliersSubtab({
  suppliersList,
  onOpenSupplierModal,
  onIssuePOToSupplier,
}: InventorySuppliersSubtabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#080d2d]">
            Suppliers &amp; Manufacturers Directory
          </h3>
          <p className="text-xs text-slate-400">Manage apparel textile mills, protective gear manufacturers, and partners.</p>
        </div>
        <button
          type="button"
          onClick={onOpenSupplierModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#080d2d] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliersList.map((sup) => (
          <div key={sup.supplierId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#080d2d]">{sup.name}</h4>
                <span className="text-[10px] font-mono font-bold text-slate-400">Code: {sup.code}</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-800">
                {sup.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-500">Contact: </span>
                {sup.contactPerson}
              </div>
              <div>
                <span className="font-bold text-slate-500">Phone: </span>
                {sup.phone}
              </div>
              <div>
                <span className="font-bold text-slate-500">Email: </span>
                {sup.email}
              </div>
              {sup.gstin && (
                <div>
                  <span className="font-bold text-slate-500">GSTIN: </span>
                  <span className="font-mono">{sup.gstin}</span>
                </div>
              )}
              <div>
                <span className="font-bold text-slate-500">Payment Terms: </span>
                <span className="font-bold text-blue-600">{sup.paymentTerms}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{sup.productsCount || 8} Active SKUs</span>
              <button
                type="button"
                onClick={() => onIssuePOToSupplier(sup.supplierId)}
                className="font-bold text-[#EB008B] hover:underline flex items-center gap-1"
              >
                <span>Issue PO</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
