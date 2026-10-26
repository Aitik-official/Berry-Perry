'use client'

import { Layers, X, Loader2 } from 'lucide-react'

export interface AddSupplierModalProps {
  isOpen: boolean
  onClose: () => void
  supName: string
  setSupName: (name: string) => void
  supCode: string
  setSupCode: (code: string) => void
  supContact: string
  setSupContact: (contact: string) => void
  supEmail: string
  setSupEmail: (email: string) => void
  supPhone: string
  setSupPhone: (phone: string) => void
  supGstin: string
  setSupGstin: (gstin: string) => void
  supTerms: string
  setSupTerms: (terms: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isSubmitting: boolean
}

export function AddSupplierModal({
  isOpen,
  onClose,
  supName,
  setSupName,
  supCode,
  setSupCode,
  supContact,
  setSupContact,
  supEmail,
  setSupEmail,
  supPhone,
  setSupPhone,
  supGstin,
  setSupGstin,
  supTerms,
  setSupTerms,
  onSubmit,
  isSubmitting,
}: AddSupplierModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-600" />
            <h3 className="font-black text-sm uppercase text-[#080d2d]">Add New Supplier / Vendor</h3>
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
            <label className="block font-bold text-slate-700 mb-1">Company / Vendor Name</label>
            <input
              type="text"
              value={supName}
              onChange={(e) => setSupName(e.target.value)}
              placeholder="e.g. SpeedDry Technical Fabrics Ltd."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vendor Code</label>
              <input
                type="text"
                value={supCode}
                onChange={(e) => setSupCode(e.target.value)}
                placeholder="e.g. STF-04"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Terms</label>
              <select
                value={supTerms}
                onChange={(e) => setSupTerms(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Immediate">Immediate / Advance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={supContact}
                onChange={(e) => setSupContact(e.target.value)}
                placeholder="e.g. Amit Malhotra"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={supPhone}
                onChange={(e) => setSupPhone(e.target.value)}
                placeholder="+91 98..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={supEmail}
              onChange={(e) => setSupEmail(e.target.value)}
              placeholder="vendor@company.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#080d2d] outline-none focus:border-[#EB008B]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">GSTIN Tax Registration</label>
            <input
              type="text"
              value={supGstin}
              onChange={(e) => setSupGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 07AAAAA0000A1Z5"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
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
              className="flex items-center gap-1.5 rounded-lg bg-[#080d2d] px-4 py-2 font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Supplier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
