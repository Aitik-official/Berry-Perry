'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import type { InventoryProduct, InventorySubTab } from './types'

export interface InventoryAdjustStockSubtabProps {
  products: InventoryProduct[]
  setSubTab: (tab: InventorySubTab) => void
  onOpenAdjustModal: (product: InventoryProduct, initialType?: 'ADJUST' | 'RECEIVE' | 'DAMAGE', qty?: number, reason?: string) => void
  onInlineAdjust: (product: InventoryProduct, delta: number, type: 'ADJUST' | 'RECEIVE' | 'DAMAGE', reason?: string) => Promise<void>
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
  const [adjustSearch, setAdjustSearch] = useState<string>('')
  const [adjustCategoryFilter, setAdjustCategoryFilter] = useState<string>('all')
  const [adjustSportFilter, setAdjustSportFilter] = useState<string>('all')
  const [adjustStockStatusFilter, setAdjustStockStatusFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')

  const [inlineAdjustId, setInlineAdjustId] = useState<string | null>(null)
  const [inlineDelta, setInlineDelta] = useState<number>(5)
  const [inlineType, setInlineType] = useState<'ADJUST' | 'RECEIVE' | 'DAMAGE'>('ADJUST')
  const [inlineReason, setInlineReason] = useState<string>('Quick stock update')

  const filteredAdjustProducts = products.filter((p) => {
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

  const totalStockUnits = products.reduce((acc, p) => acc + (p.stockQuantity ?? 25), 0)
  const inStockCount = products.filter((p) => (p.stockQuantity ?? 25) > 0).length
  const outOfStockCount = products.length - inStockCount

  const handleApplyInline = async (product: InventoryProduct) => {
    await onInlineAdjust(product, inlineDelta, inlineType, inlineReason)
    setInlineAdjustId(null)
  }

  return (
    <div className="space-y-4">
      {/* Top Header Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Catalog Items
          </span>
          <p className="mt-1 text-xl sm:text-2xl font-black text-[#080d2d]">{products.length}</p>
          <span className="text-[10px] text-slate-400">Tracked for Adjustment</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Units On Hand
          </span>
          <p className="mt-1 text-xl sm:text-2xl font-black text-blue-600 font-mono">{totalStockUnits}</p>
          <span className="text-[10px] text-slate-400">Warehouse Inventory</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            In Stock SKUs
          </span>
          <p className="mt-1 text-xl sm:text-2xl font-black text-emerald-600">{inStockCount}</p>
          <span className="text-[10px] text-slate-400">Active Available</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            Out Of Stock
          </span>
          <p className="mt-1 text-xl sm:text-2xl font-black text-rose-600">{outOfStockCount}</p>
          <span className="text-[10px] text-slate-400">Requires Replenishment</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title, SKU, category, or sport to adjust..."
              value={adjustSearch}
              onChange={(e) => setAdjustSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-[#080d2d] outline-none transition focus:border-[#EB008B] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            <select
              value={adjustCategoryFilter}
              onChange={(e) => setAdjustCategoryFilter(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
            >
              <option value="all">Category: All</option>
              {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, ' ')}
                </option>
              ))}
            </select>

            <select
              value={adjustSportFilter}
              onChange={(e) => setAdjustSportFilter(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
            >
              <option value="all">Sport: All</option>
              {Array.from(new Set(products.map((p) => p.sport))).map((sport) => (
                <option key={sport} value={sport}>
                  {sport.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={adjustStockStatusFilter}
              onChange={(e) => setAdjustStockStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
            >
              <option value="all">Stock: All</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock Only</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setAdjustSearch('')
                setAdjustCategoryFilter('all')
                setAdjustSportFilter('all')
                setAdjustStockStatusFilter('all')
              }}
              title="Reset filters"
              className="flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 transition shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenScanner) onOpenScanner()
              }}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shrink-0 shadow-xs"
              title="Open Barcode Scanner (Inbound & Outbound)"
            >
              <Scan className="h-3.5 w-3.5" />
              <span>Scan Barcode</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('barcodes')}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-100 transition shrink-0 shadow-xs"
              title="View and generate serialized unit barcodes"
            >
              <Barcode className="h-3.5 w-3.5 text-indigo-600" />
              <span>Serials</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('marketplaces')}
              className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shrink-0 shadow-xs"
              title="Open Amazon & Flipkart sync hub"
            >
              <Globe className="h-3.5 w-3.5 text-amber-600" />
              <span>Marketplaces</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('ledger')}
              className="flex items-center gap-1.5 rounded-lg bg-[#080d2d] px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition shrink-0"
            >
              <ClipboardList className="h-3.5 w-3.5 text-blue-400" />
              <span>View Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Stock Adjustment Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#080d2d]">
            Stock Adjustment Catalog
            <span className="ml-2 font-bold text-[#EB008B]">({filteredAdjustProducts.length})</span>
          </h2>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Adjust counts directly or click Adjust for full cycle-count audit
          </span>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredAdjustProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium text-xs">
              No products found matching your search.
            </div>
          ) : (
            filteredAdjustProducts.map((product) => {
              const currentStock = product.stockQuantity ?? 25
              const isInlineOpen = inlineAdjustId === product.id

              return (
                <div key={product.id} className="p-3.5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
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
                        <Package className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-[#080d2d] line-clamp-2">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        SKU: {product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        {product.mainCategory && (
                          <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                            {product.mainCategory}
                          </span>
                        )}
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold capitalize text-slate-700">
                          {product.category.replace(/-/g, ' ')}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {product.sport}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Current Stock</span>
                      <div className="font-black text-sm text-[#080d2d] font-mono">
                        {currentStock} units
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
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
                        {currentStock > 0 ? 'In Stock' : 'Out'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSubTab('barcodes')}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
                        title={`View Unit Barcodes: ${product.name}`}
                      >
                        <Barcode className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSubTab('marketplaces')}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-amber-600 transition"
                        title={`Amazon / Flipkart Sync: ${product.name}`}
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenPrintBarcode) onOpenPrintBarcode(product)
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-[#EB008B] hover:border-slate-300 transition"
                        title={`Print Barcode: ${product.name}`}
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenAdjustModal(product, 'ADJUST', 10, 'Physical cycle-count audit')}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 hover:border-slate-300 transition"
                        title={`Adjust Stock: ${product.name}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline adjustment form on mobile */}
                  {isInlineOpen && (
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <select
                          value={inlineType}
                          onChange={(e) => setInlineType(e.target.value as any)}
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-[#080d2d]"
                        >
                          <option value="ADJUST">Reconcile (+/-)</option>
                          <option value="RECEIVE">Intake (+)</option>
                          <option value="DAMAGE">Scrap (-)</option>
                        </select>
                        <input
                          type="number"
                          value={inlineDelta}
                          onChange={(e) => setInlineDelta(Number(e.target.value))}
                          className="w-20 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-[#080d2d]"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setInlineAdjustId(null)}
                          className="rounded px-2.5 py-1 font-bold text-slate-500 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingInline}
                          onClick={() => handleApplyInline(product)}
                          className="rounded bg-[#080d2d] px-3 py-1 font-bold text-white disabled:opacity-50"
                        >
                          {isSubmittingInline ? 'Saving...' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
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
              {filteredAdjustProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAdjustProducts.map((product) => {
                  const currentStock = product.stockQuantity ?? 25
                  const isInlineOpen = inlineAdjustId === product.id

                  return (
                    <tr key={product.id} className="transition-colors hover:bg-slate-50/80">
                      {/* Product column with image and SKU */}
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
                            <div className="font-bold text-[#080d2d] line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              SKU: {product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`}
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
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </div>
                        )}
                      </td>

                      {/* Current Stock Count */}
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
                                onOpenAdjustModal(product, 'DAMAGE', 1, 'Physical discrepancy deduction')
                              }}
                              title="Deduct 1 unit"
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition"
                            >
                              -1
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onOpenAdjustModal(product, 'RECEIVE', 10, 'Quick intake addition')
                              }}
                              title="Add 10 units"
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition"
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
                              title="Quick inline edit"
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition"
                            >
                              Custom
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
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

                      {/* Actions column */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSubTab('barcodes')}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 hover:border-slate-300 transition shadow-xs"
                            title={`Serialized Unit Barcodes: ${product.name}`}
                          >
                            <Barcode className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSubTab('marketplaces')}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-amber-600 hover:border-slate-300 transition shadow-xs"
                            title={`Amazon / Flipkart Stock Feed: ${product.name}`}
                          >
                            <Globe className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenPrintBarcode) onOpenPrintBarcode(product)
                            }}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-[#EB008B] hover:border-slate-300 transition shadow-xs"
                            title={`Print Thermal Barcode: ${product.name}`}
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onOpenAdjustModal(product, 'ADJUST', 10, 'Physical cycle-count audit')
                            }}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 hover:border-slate-300 transition shadow-xs"
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
      </div>
    </div>
  )
}
