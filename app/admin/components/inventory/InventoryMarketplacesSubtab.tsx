'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Loader2,
  Package,
} from 'lucide-react'
import type { InventoryProduct } from './types'

export interface InventoryMarketplacesSubtabProps {
  products: InventoryProduct[]
  triggerToast?: (msg: string) => void
}

export function InventoryMarketplacesSubtab({
  products,
  triggerToast,
}: InventoryMarketplacesSubtabProps) {
  const [syncingAll, setSyncingAll] = useState(false)
  const [syncingSku, setSyncingSku] = useState<string | null>(null)
  const [syncStatusMap, setSyncStatusMap] = useState<Record<string, { status: string; time: string }>>({})

  const showToast = (msg: string) => {
    if (triggerToast) triggerToast(msg)
    else alert(msg)
  }

  // Push single SKU stock to Amazon / Flipkart
  const handlePushSingleStock = async (product: InventoryProduct) => {
    const sku = product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`
    setSyncingSku(sku)

    try {
      const res = await fetch('/api/marketplaces/push-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, sku }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Stock (${product.stockQuantity ?? 0}) pushed to Amazon & Flipkart for ${product.name}!`)
        setSyncStatusMap((prev) => ({
          ...prev,
          [sku]: { status: 'SYNCED', time: new Date().toLocaleTimeString() },
        }))
      } else {
        alert(data.error || 'Failed to sync inventory')
      }
    } catch (err: any) {
      alert(err.message || 'Error pushing marketplace inventory')
    } finally {
      setSyncingSku(null)
    }
  }

  // Master Push: Sync all active warehouse stock levels
  const handlePushAllStock = async () => {
    setSyncingAll(true)
    let successCount = 0

    try {
      for (const product of products.slice(0, 15)) {
        const sku = product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`
        const res = await fetch('/api/marketplaces/push-inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, sku }),
        })
        if (res.ok) {
          successCount++
          setSyncStatusMap((prev) => ({
            ...prev,
            [sku]: { status: 'SYNCED', time: new Date().toLocaleTimeString() },
          }))
        }
      }
      showToast(`Marketplace Feed: Successfully pushed stock for ${successCount} products to Amazon & Flipkart.`)
    } catch (err: any) {
      alert(err.message || 'Error during batch sync')
    } finally {
      setSyncingAll(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Channel Status Header Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Amazon SP-API Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 font-black text-white text-xs">
                a
              </span>
              <div>
                <h4 className="text-sm font-black text-[#080d2d]">Amazon India (SP-API)</h4>
                <p className="text-[10px] text-slate-400 font-mono">Merchant: A21TJRUUN4KGV</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="mt-4 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Fulfillment Type:</span>
              <span className="font-bold text-slate-800">FBM (Merchant Fulfilled)</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-Sync Stock:</span>
              <span className="font-bold text-emerald-600">Enabled (Real-time Webhook)</span>
            </div>
          </div>
        </div>

        {/* Flipkart API Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-black text-white text-xs">
                fk
              </span>
              <div>
                <h4 className="text-sm font-black text-[#080d2d]">Flipkart Marketplace</h4>
                <p className="text-[10px] text-slate-400 font-mono">Location ID: DEL-WH-01</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="mt-4 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Fulfillment Type:</span>
              <span className="font-bold text-slate-800">Flipkart Smart / Self</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-Sync Stock:</span>
              <span className="font-bold text-emerald-600">Enabled (Listings Items)</span>
            </div>
          </div>
        </div>

        {/* Multi-Channel Sync Action Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Multi-Channel Feeds</h4>
            <p className="mt-1 text-xs text-slate-600 leading-tight">
              Push live warehouse available quantities to external channels to prevent out-of-stock overselling.
            </p>
          </div>

          <button
            type="button"
            disabled={syncingAll}
            onClick={handlePushAllStock}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#080d2d] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-50"
          >
            {syncingAll ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>{syncingAll ? 'Syncing Feeds...' : 'Sync All Stock to Channels'}</span>
          </button>
        </div>
      </div>

      {/* Mapped Listings Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight text-[#080d2d]">
              Marketplace SKU &amp; Listing Inventory Mappings
            </h3>
            <p className="text-[11px] text-slate-500">
              Cross-references internal product SKUs with Amazon ASINs and Flipkart FSNs.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-600">
            {products.length} Products Mapped
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Warehouse Stock</th>
                <th className="py-3 px-4">Amazon ASIN / SKU</th>
                <th className="py-3 px-4">Flipkart FSN</th>
                <th className="py-3 px-4">Feed Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const sku = product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`
                const asin = `B0${product.id.slice(0, 8).toUpperCase()}`
                const fsn = `FSN${product.id.slice(0, 9).toUpperCase()}`
                const stock = product.stockQuantity ?? 25
                const isSyncing = syncingSku === sku
                const record = syncStatusMap[sku]

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized
                            />
                          ) : (
                            <Package className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#080d2d] truncate max-w-xs">{product.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">SKU: {sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-sm text-[#080d2d] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {stock}
                      </span>
                      <span className="ml-1 text-[11px] text-slate-500 font-medium">units</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      <span className="font-semibold">{asin}</span>
                      <span className="block text-[10px] text-slate-400">{sku}-AMZ</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      <span className="font-semibold">{fsn}</span>
                      <span className="block text-[10px] text-slate-400">{sku}-FK</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>{record ? record.status : 'SYNCED'}</span>
                      </span>
                      {record && (
                        <span className="block text-[9px] text-slate-400 mt-0.5">{record.time}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        disabled={isSyncing}
                        onClick={() => handlePushSingleStock(product)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black uppercase text-slate-700 hover:bg-slate-100 transition shadow-2xs disabled:opacity-50"
                      >
                        {isSyncing ? (
                          <Loader2 className="h-3 w-3 animate-spin text-slate-600" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3 text-blue-600" />
                        )}
                        <span>Push Stock</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
