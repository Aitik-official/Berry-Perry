'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Barcode,
  Search,
  Plus,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Printer,
  CheckCircle2,
  Layers,
  Filter,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { generateBarcodeSvg } from '@/lib/barcode'
import { getSessionCache, setSessionCache } from '@/lib/sessionCache'
import type { InventoryProduct } from './types'
import { InventoryPagination } from './InventoryPagination'

export interface UnitBarcodeItem {
  _id: string
  barcode: string
  serialNumber: number
  productId: string
  productVariantId?: string
  productName: string
  sku: string
  batchNumber?: string
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'DAMAGED' | 'RETIRED'
  reason?: string
  printedAt?: string
  soldAt?: string
  orderNumber?: string
  createdAt: string
}

export interface InventoryBarcodesSubtabProps {
  products: InventoryProduct[]
  triggerToast?: (msg: string) => void
  onOpenPrintModal?: (product: InventoryProduct) => void
}

export function InventoryBarcodesSubtab({
  products,
  triggerToast,
}: InventoryBarcodesSubtabProps) {
  const [barcodes, setBarcodes] = useState<UnitBarcodeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(15)
  const [stats, setStats] = useState({
    TOTAL: 0,
    AVAILABLE: 0,
    SOLD: 0,
    RESERVED: 0,
    DAMAGED: 0,
    RETIRED: 0,
  })

  const paginatedBarcodes = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return barcodes.slice(start, start + pageSize)
  }, [barcodes, currentPage, pageSize])

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [genProductId, setGenProductId] = useState(products[0]?.id || '')
  const [genCount, setGenCount] = useState<number>(10)
  const [genPrefix, setGenPrefix] = useState('BP')
  const [genBatch, setGenBatch] = useState(`BATCH-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}`)
  const [isGenerating, setIsGenerating] = useState(false)

  // Defective modal
  const [defectiveTarget, setDefectiveTarget] = useState<UnitBarcodeItem | null>(null)
  const [defectReason, setDefectReason] = useState('Damaged in transit / handling')
  const [isSubmittingDefect, setIsSubmittingDefect] = useState(false)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<UnitBarcodeItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Quick print single label
  const [printSingleUnit, setPrintSingleUnit] = useState<UnitBarcodeItem | null>(null)

  const showToast = (msg: string) => {
    if (triggerToast) triggerToast(msg)
    else alert(msg)
  }

  // Load from sessionCache instantly for 0ms rehydration, then fetch fresh
  const fetchBarcodes = async (silent = false) => {
    if (!silent) {
      const cached = getSessionCache<{ barcodes: UnitBarcodeItem[]; stats: any }>('barcodes_registry_list')
      if (cached) {
        setBarcodes(cached.barcodes)
        setStats(cached.stats)
        setIsLoading(false)
      } else {
        setIsLoading(true)
      }
    }

    try {
      const url = `/api/barcodes?limit=100${statusFilter !== 'ALL' ? `&status=${statusFilter}` : ''}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok && data.barcodes) {
        setBarcodes(data.barcodes)
        if (data.stats) setStats(data.stats)
        setSessionCache('barcodes_registry_list', { barcodes: data.barcodes, stats: data.stats })
      }
    } catch (err) {
      console.warn('Failed to fetch barcodes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBarcodes()
  }, [statusFilter])

  // Handle Defective piece shifting
  const handleConfirmDefective = async () => {
    if (!defectiveTarget) return
    setIsSubmittingDefect(true)
    try {
      const res = await fetch('/api/barcodes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: defectiveTarget._id,
          status: 'DAMAGED',
          reason: defectReason,
          performedBy: 'Admin (Barcodes Subtab)',
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Unit ${defectiveTarget.barcode} shifted to Defective Pieces. Inventory aligned.`)
        setDefectiveTarget(null)
        fetchBarcodes(true)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to shift to defective')
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status')
    } finally {
      setIsSubmittingDefect(false)
    }
  }

  // Handle Restore to Available
  const handleRestoreToAvailable = async (unit: UnitBarcodeItem) => {
    try {
      const res = await fetch('/api/barcodes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: unit._id,
          status: 'AVAILABLE',
          reason: '',
          performedBy: 'Admin (Barcodes Subtab)',
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Unit ${unit.barcode} restored to Available stock!`)
        fetchBarcodes(true)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to restore unit')
      }
    } catch (err: any) {
      alert(err.message || 'Error restoring unit')
    }
  }

  // Handle Delete Unit Barcode
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/barcodes?id=${deleteTarget._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Unit ${deleteTarget.barcode} deleted. Inventory updated.`)
        setDeleteTarget(null)
        fetchBarcodes(true)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to delete unit')
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting unit')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle Generate Sequential Barcodes
  const handleGenerateBarcodes = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!genProductId) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/barcodes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: genProductId,
          count: genCount,
          prefix: genPrefix,
          batchNumber: genBatch,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Generated ${data.count} unit barcodes successfully!`)
        setIsGenerateModalOpen(false)
        fetchBarcodes(true)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to generate barcodes')
      }
    } catch (err: any) {
      alert(err.message || 'Error generating barcodes')
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusBadge = (status: UnitBarcodeItem['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'DAMAGED':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'SOLD':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'RESERVED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Banner / Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Unit Barcodes</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#080d2d]">{stats.TOTAL}</span>
            <span className="text-xs text-slate-400">registered units</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Available / Sellable</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{stats.AVAILABLE}</span>
            <span className="text-xs text-emerald-600 font-medium">ready to pick</span>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">Defective / Damaged</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800">{stats.DAMAGED}</span>
            <span className="text-xs text-amber-600 font-medium">quarantined pieces</span>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-blue-700">Fulfilled / Sold</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-800">{stats.SOLD}</span>
            <span className="text-xs text-blue-600 font-medium">shipped to buyers</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search barcode, serial, SKU, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBarcodes()}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-[#080d2d] focus:bg-white"
          />
        </div>

        {/* Status Filter & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-black">
            {['ALL', 'AVAILABLE', 'DAMAGED', 'SOLD'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-3 py-1.5 transition ${
                  statusFilter === st
                    ? 'bg-[#080d2d] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchBarcodes()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#080d2d] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Barcodes</span>
          </button>
        </div>
      </div>

      {/* Barcodes Registry Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Serial / Barcode</th>
                <th className="py-3 px-4">Product Name &amp; SKU</th>
                <th className="py-3 px-4">Batch No.</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Defect Reason / Notes</th>
                <th className="py-3 px-4">Generated Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#080d2d]" />
                    <p className="mt-2 text-xs font-semibold">Loading unit barcodes registry...</p>
                  </td>
                </tr>
              ) : barcodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Barcode className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 font-bold text-slate-600">No unit barcodes found</p>
                    <p className="text-xs">Click "Generate Barcodes" above to create serial unit barcodes for your products.</p>
                  </td>
                </tr>
              ) : (
                paginatedBarcodes.map((unit) => (
                  <tr key={unit._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-black text-slate-700">
                          #{unit.serialNumber}
                        </span>
                        <span className="font-mono font-bold text-[#080d2d]">{unit.barcode}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{unit.productName}</p>
                      <p className="font-mono text-[10px] text-slate-500">SKU: {unit.sku}</p>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {unit.batchNumber || 'BATCH-01'}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusBadge(unit.status)}`}>
                        {unit.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {unit.reason ? (
                        <span className="text-amber-700 font-medium">{unit.reason}</span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(unit.createdAt).toLocaleDateString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Thermal Print */}
                        <button
                          type="button"
                          title="Print Thermal Label"
                          onClick={() => setPrintSingleUnit(unit)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>

                        {/* Defective Shifting Button */}
                        {unit.status === 'AVAILABLE' && (
                          <button
                            type="button"
                            title="Shift to Defective Piece"
                            onClick={() => setDefectiveTarget(unit)}
                            className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-800 hover:bg-amber-100 transition"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            <span>Defective</span>
                          </button>
                        )}

                        {/* Restore Button */}
                        {unit.status === 'DAMAGED' && (
                          <button
                            type="button"
                            title="Restore to Available Stock"
                            onClick={() => handleRestoreToAvailable(unit)}
                            className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-800 hover:bg-emerald-100 transition"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Restore</span>
                          </button>
                        )}

                        {/* Delete Barcode Button */}
                        <button
                          type="button"
                          title="Delete Barcode"
                          onClick={() => setDeleteTarget(unit)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Barcodes Table Pagination */}
        <InventoryPagination
          currentPage={currentPage}
          totalItems={barcodes.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          pageSizeOptions={[15, 30, 50, 100]}
        />
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: GENERATE SEQUENTIAL UNIT BARCODES                   */}
      {/* ============================================================ */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-[#080d2d]">
              Generate Serialized Unit Barcodes
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Creates unique serial numbered barcodes (`BP-[SKU]-[SERIAL]`) and increments available warehouse stock.
            </p>

            <form onSubmit={handleGenerateBarcodes} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Target Product</label>
                <select
                  value={genProductId}
                  onChange={(e) => setGenProductId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-[#080d2d] focus:bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stockQuantity ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Barcode Prefix</label>
                  <input
                    type="text"
                    value={genPrefix}
                    onChange={(e) => setGenPrefix(e.target.value.toUpperCase())}
                    placeholder="BP"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#080d2d] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Quantity of Units</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={genCount}
                    onChange={(e) => setGenCount(parseInt(e.target.value, 10) || 1)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-[#080d2d] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Batch Number / Lot</label>
                <input
                  type="text"
                  value={genBatch}
                  onChange={(e) => setGenBatch(e.target.value)}
                  placeholder="BATCH-20261030"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono font-medium text-slate-900 outline-none focus:border-[#080d2d] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-xl bg-[#080d2d] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>{isGenerating ? 'Generating...' : `Generate ${genCount} Units`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: SHIFT TO DEFECTIVE PIECE (DAMAGED)                  */}
      {/* ============================================================ */}
      {defectiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-base font-black uppercase tracking-tight text-[#080d2d]">
                Shift Piece to Defective
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Flags unit <span className="font-mono font-bold text-slate-800">{defectiveTarget.barcode}</span> as defective, removes 1 unit from sellable inventory, and records it in the Damaged &amp; Waste audit ledger.
            </p>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs">
              <p className="font-bold text-amber-900">{defectiveTarget.productName}</p>
              <p className="text-[11px] font-mono text-amber-700">Serial #{defectiveTarget.serialNumber} | SKU: {defectiveTarget.sku}</p>
            </div>

            <div className="mt-4 space-y-3">
              <label className="text-xs font-bold text-slate-700">Defect Reason</label>
              <select
                value={defectReason}
                onChange={(e) => setDefectReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-[#080d2d] focus:bg-white"
              >
                <option value="Damaged in transit / handling">Damaged in transit / handling</option>
                <option value="Manufacturing flaw / hardware failure">Manufacturing flaw / hardware failure</option>
                <option value="Customer return defective">Customer return defective</option>
                <option value="Cosmetic scratch / stitching defect">Cosmetic scratch / stitching defect</option>
                <option value="Fabric tear or water stain">Fabric tear or water stain</option>
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDefectiveTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingDefect}
                onClick={handleConfirmDefective}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-amber-700 transition disabled:opacity-50"
              >
                {isSubmittingDefect ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                <span>Confirm Defective</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: DELETE UNIT BARCODE                                 */}
      {/* ============================================================ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-rose-600">
              Permanently Delete Unit Barcode?
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Are you sure you want to delete unit <span className="font-mono font-bold text-slate-900">{deleteTarget.barcode}</span>?
              {deleteTarget.status === 'AVAILABLE' && (
                <span className="block mt-1 font-bold text-amber-700">
                  Note: Because this unit is currently AVAILABLE, sellable warehouse stock will be decremented by 1 to maintain physical alignment.
                </span>
              )}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>Delete Unit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: QUICK THERMAL LABEL PREVIEW & PRINT                */}
      {/* ============================================================ */}
      {printSingleUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-[#080d2d]">
              Thermal Label (50×25mm)
            </h3>
            <p className="text-xs text-slate-500">Unit #{printSingleUnit.serialNumber} Hangtag Preview</p>

            <div className="my-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-4 bg-slate-50">
              <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">{printSingleUnit.productName}</p>
              <p className="text-[9px] font-mono text-slate-500">SKU: {printSingleUnit.sku} | Lot: {printSingleUnit.batchNumber || 'B1'}</p>
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: generateBarcodeSvg({
                    text: printSingleUnit.barcode,
                    height: 42,
                    barWidth: 1.5,
                    includeText: true,
                  }),
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPrintSingleUnit(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print()
                }}
                className="flex items-center gap-2 rounded-xl bg-[#080d2d] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

