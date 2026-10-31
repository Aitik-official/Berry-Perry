'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Package,
  Search,
  RotateCcw,
  ClipboardList,
  Edit2,
  Printer,
  Scan,
  Barcode,
  Globe,
  LayoutGrid,
  List,
  Zap,
  ChevronRight,
  Truck,
  Plus,
} from 'lucide-react'
import type { InventoryProduct, InventorySubTab } from './types'
import { InventoryPagination } from './InventoryPagination'

export interface InventoryAdjustStockSubtabProps {
  products: InventoryProduct[]
  setSubTab: (tab: InventorySubTab) => void
  onOpenAdjustModal: (
    product: InventoryProduct,
    initialType?: 'ADJUST' | 'RECEIVE' | 'DAMAGE',
    qty?: number,
    reason?: string
  ) => void
  onInlineAdjust: (
    product: InventoryProduct,
    delta: number,
    type: 'ADJUST' | 'RECEIVE' | 'DAMAGE',
    reason?: string
  ) => Promise<void>
  isSubmittingInline: boolean
  onOpenPrintBarcode?: (product: InventoryProduct) => void
  onOpenScanner?: () => void
}

export function InventoryAdjustStockSubtab({
  products,
  setSubTab,
  onOpenAdjustModal,
  onInlineAdjust,
  isSubmittingInline,
  onOpenPrintBarcode,
  onOpenScanner,
}: InventoryAdjustStockSubtabProps) {
  // View mode: 'cards' (matching original screenshot) or 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  // Search & Filters
  const [adjustSearch, setAdjustSearch] = useState<string>('')
  const [adjustCategoryFilter, setAdjustCategoryFilter] = useState<string>('all')
  const [adjustSportFilter, setAdjustSportFilter] = useState<string>('all')
  const [adjustStockStatusFilter, setAdjustStockStatusFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(9) // 9 cards = 3x3 grid

  // Inline adjustment state (for table)
  const [inlineAdjustId, setInlineAdjustId] = useState<string | null>(null)
  const [inlineDelta, setInlineDelta] = useState<number>(5)
  const [inlineType, setInlineType] = useState<'ADJUST' | 'RECEIVE' | 'DAMAGE'>('ADJUST')
  const [inlineReason, setInlineReason] = useState<string>('Quick stock update')

  // Filter products
  const filteredAdjustProducts = useMemo(() => {
    return products.filter((p) => {
      if (adjustSearch) {
        const q = adjustSearch.toLowerCase()
        const matchName = p.name.toLowerCase().includes(q)
        const matchId = p.id.toLowerCase().includes(q)
        const matchSku = (p.sku || '').toLowerCase().includes(q)
        const matchCat = p.category.toLowerCase().includes(q)
        const matchSport = p.sport.toLowerCase().includes(q)
        if (!matchName && !matchId && !matchSku && !matchCat && !matchSport) return false
      }
      if (adjustCategoryFilter !== 'all' && p.category !== adjustCategoryFilter) return false
      if (adjustSportFilter !== 'all' && p.sport !== adjustSportFilter) return false
      if (adjustStockStatusFilter === 'in_stock' && !((p.stockQuantity ?? 25) > 0)) return false
      if (adjustStockStatusFilter === 'out_of_stock' && ((p.stockQuantity ?? 25) > 0)) return false
      return true
    })
  }, [products, adjustSearch, adjustCategoryFilter, adjustSportFilter, adjustStockStatusFilter])

  // Paginated items
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredAdjustProducts.slice(start, start + pageSize)
  }, [filteredAdjustProducts, currentPage, pageSize])

  const totalStockUnits = products.reduce((acc, p) => acc + (p.stockQuantity ?? 25), 0)
  const inStockCount = products.filter((p) => (p.stockQuantity ?? 25) > 0).length
  const outOfStockCount = products.length - inStockCount

  const handleApplyInline = async (product: InventoryProduct) => {
    await onInlineAdjust(product, inlineDelta, inlineType, inlineReason)
    setInlineAdjustId(null)
  }

  const handleResetFilters = () => {
    setAdjustSearch('')
    setAdjustCategoryFilter('all')
    setAdjustSportFilter('all')
    setAdjustStockStatusFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* UNIFIED COMPACT HEADER & CONTROLS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#080d2d] text-white shadow-sm shrink-0">
              <Package className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-[#080d2d]">
                Products &amp; Warehouse Hierarchy
              </h2>
              <p className="text-xs text-slate-500">
                {products.length} Products Catalog • {inStockCount} In Stock • {outOfStockCount} Out of Stock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher: Cards vs Table */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setViewMode('cards')
                  setPageSize(9)
                  setCurrentPage(1)
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'cards'
                    ? 'bg-[#080d2d] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('table')
                  setPageSize(10)
                  setCurrentPage(1)
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'table'
                    ? 'bg-[#080d2d] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (products.length > 0) {
                  onOpenAdjustModal(products[0], 'ADJUST', 10, 'Physical cycle-count audit')
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#080d2d] hover:bg-slate-800 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition active:scale-95"
            >
              <Plus className="h-3.5 w-3.5 text-[#EB008B]" />
              <span>Adjust Stock</span>
            </button>
          </div>
        </div>

        {/* Filter inputs in the same card */}
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center lg:justify-between border-t border-slate-100 pt-3.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title, SKU, brand, category..."
              value={adjustSearch}
              onChange={(e) => {
                setAdjustSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs font-medium text-[#080d2d] outline-none transition focus:border-[#EB008B] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            <select
              value={adjustCategoryFilter}
              onChange={(e) => {
                setAdjustCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
            >
              <option value="all">Category: All ({products.length})</option>
              {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, ' ')}
                </option>
              ))}
            </select>

            <select
              value={adjustStockStatusFilter}
              onChange={(e) => {
                setAdjustStockStatusFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
            >
              <option value="all">Stock: All</option>
              <option value="in_stock">In Stock ({inStockCount})</option>
              <option value="out_of_stock">Out of Stock ({outOfStockCount})</option>
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset filters"
              className="flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. VIEW A: PRODUCT CARDS VIEW (CLEAN LIGHT THEMED CARDS) */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {paginatedProducts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-bold text-slate-700">No matching products found</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {paginatedProducts.map((product) => {
                const currentStock = product.stockQuantity ?? 25
                const skuCode = product.sku || `BP-${product.id.slice(0, 8).toUpperCase()}`
                const barcodeTag = `BP-BAR-${product.id.slice(0, 10).toUpperCase()}`

                return (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition duration-200"
                  >
                    <div>
                      {/* Top Header: Category & Name */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                              unoptimized
                            />
                          ) : (
                            <Package className="h-6 w-6 text-slate-400" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="inline-block rounded bg-pink-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#EB008B] border border-pink-200/60 mb-1">
                            {product.mainCategory || product.category.replace(/-/g, ' ')}
                          </span>
                          <h4 className="font-black text-xs sm:text-sm uppercase tracking-tight text-[#080d2d] line-clamp-2">
                            {product.name}
                          </h4>
                        </div>
                      </div>

                      {/* Website Status Row */}
                      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                        <span className="text-[11px] text-slate-400">Website:</span>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider ${
                              currentStock > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {currentStock > 0 ? `${currentStock} In Stock` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* 2-Column Metrics Box */}
                      <div className="mt-3.5 grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 border border-slate-200/80 p-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Offer Price
                          </span>
                          <p className="mt-0.5 text-base sm:text-lg font-black text-[#080d2d] font-mono">
                            ₹{product.price}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            In Stock
                          </span>
                          <p className="mt-0.5 text-base sm:text-lg font-black text-emerald-600 font-mono">
                            {currentStock} <span className="text-xs font-normal text-slate-500">Units</span>
                          </p>
                          <span className="text-[9px] text-slate-400 block font-medium">Per-Unit Serialized</span>
                        </div>
                      </div>

                      {/* SKU & Barcode Tag */}
                      <div className="mt-3.5 space-y-1 text-[11px] font-mono text-slate-500">
                        <div className="flex justify-between">
                          <span>SKU Code:</span>
                          <span className="font-bold text-[#080d2d]">{skuCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Barcode Tag:</span>
                          <span className="font-bold text-slate-600 truncate max-w-[140px]">{barcodeTag}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => onOpenAdjustModal(product, 'RECEIVE', 10, 'Stock refill addition')}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#5CB946] hover:bg-emerald-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white transition active:scale-95 shadow-xs"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>Refill (+10)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenAdjustModal(product, 'ADJUST', 10, 'Physical cycle-count audit')}
                        className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#080d2d] transition"
                        title="View details & audit"
                      >
                        <span>Details</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenPrintBarcode) onOpenPrintBarcode(product)
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:text-[#080d2d] hover:bg-slate-100 transition"
                        title="Print Barcode Thermal Label"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Cards View Pagination */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <InventoryPagination
              currentPage={currentPage}
              totalItems={filteredAdjustProducts.length}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setCurrentPage(1)
              }}
              pageSizeOptions={[6, 9, 18, 36]}
            />
          </div>
        </div>
      )}

      {/* 5. VIEW B: DATA TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#080d2d]">
              Stock Adjustment Table
              <span className="ml-2 font-bold text-[#EB008B]">({filteredAdjustProducts.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Showing page {currentPage} of {Math.max(1, Math.ceil(filteredAdjustProducts.length / pageSize))}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category &amp; Sport</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-center">Stock Level</th>
                  <th className="px-4 py-3 text-center">Quick Adjust</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#080d2d]">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No products found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => {
                    const currentStock = product.stockQuantity ?? 25
                    const isInlineOpen = inlineAdjustId === product.id

                    return (
                      <tr key={product.id} className="transition-colors hover:bg-slate-50/80">
                        {/* Product column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                  unoptimized
                                />
                              ) : (
                                <Package className="h-5 w-5 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-[#080d2d] line-clamp-1">{product.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                SKU: {product.sku || `BP-${product.id.slice(0, 8).toUpperCase()}`}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Sport */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {product.mainCategory && (
                              <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                                {product.mainCategory}
                              </span>
                            )}
                            <span className="font-bold capitalize text-slate-800 text-xs">
                              {product.category.replace(/-/g, ' ')}
                            </span>
                          </div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                            {product.sport}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <div className="font-black text-[#080d2d]">₹{product.price}</div>
                        </td>

                        {/* Current Stock */}
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono text-sm font-black text-[#080d2d] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            {currentStock}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1 font-medium">units</div>
                        </td>

                        {/* Quick Inline Increment / Decrement */}
                        <td className="px-4 py-3">
                          {isInlineOpen ? (
                            <div className="flex items-center justify-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                              <select
                                value={inlineType}
                                onChange={(e) => setInlineType(e.target.value as any)}
                                className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[11px] font-bold text-[#080d2d]"
                              >
                                <option value="ADJUST">Reconcile (+/-)</option>
                                <option value="RECEIVE">Intake (+)</option>
                                <option value="DAMAGE">Scrap (-)</option>
                              </select>
                              <input
                                type="number"
                                value={inlineDelta}
                                onChange={(e) => setInlineDelta(Number(e.target.value))}
                                className="w-16 rounded border border-slate-300 bg-white px-1.5 py-1 text-xs font-bold text-[#080d2d]"
                              />
                              <button
                                type="button"
                                disabled={isSubmittingInline}
                                onClick={() => handleApplyInline(product)}
                                className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                              >
                                {isSubmittingInline ? '...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setInlineAdjustId(null)}
                                className="rounded border border-slate-300 px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenAdjustModal(product, 'DAMAGE', 1, 'Discrepancy deduction')
                                }}
                                title="Deduct 1 unit"
                                className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                              >
                                -1
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenAdjustModal(product, 'RECEIVE', 10, 'Quick intake addition')
                                }}
                                title="Add 10 units"
                                className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition"
                              >
                                +10
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setInlineAdjustId(product.id)
                                  setInlineDelta(5)
                                  setInlineType('ADJUST')
                                  setInlineReason('Quick stock update')
                                }}
                                title="Custom inline edit"
                                className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition"
                              >
                                Custom
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                              currentStock > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                currentStock > 0 ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                            {currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSubTab('barcodes')}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition shadow-xs"
                              title={`Serialized Barcodes: ${product.name}`}
                            >
                              <Barcode className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenPrintBarcode) onOpenPrintBarcode(product)
                              }}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-[#EB008B] transition shadow-xs"
                              title={`Print Thermal Barcode: ${product.name}`}
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onOpenAdjustModal(product, 'ADJUST', 10, 'Physical cycle-count audit')
                              }}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition shadow-xs"
                              title={`Adjust Stock: ${product.name}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table View Pagination */}
          <InventoryPagination
            currentPage={currentPage}
            totalItems={filteredAdjustProducts.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setCurrentPage(1)
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </div>
      )}
    </div>
  )
}
