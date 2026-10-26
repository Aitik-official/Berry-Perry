'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Scan,
  X,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Truck,
  Barcode,
} from 'lucide-react'
import type { InventoryProduct } from './types'

export type ScannerMode = 'INBOUND' | 'OUTBOUND' | 'LOOKUP'

export interface BarcodeScannerModalProps {
  isOpen: boolean
  onClose: () => void
  products: InventoryProduct[]
  onAdjustStock: (
    product: InventoryProduct,
    delta: number,
    type: 'RECEIVE' | 'DAMAGE' | 'ADJUST' | 'TRANSFER',
    reason: string,
    variantSku?: string
  ) => Promise<void>
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  products,
  onAdjustStock,
}: BarcodeScannerModalProps) {
  const [scannerMode, setScannerMode] = useState<ScannerMode>('INBOUND')
  const [scannedInput, setScannedInput] = useState<string>('')
  const [lastScannedCode, setLastScannedCode] = useState<string>('')
  const [matchedProduct, setMatchedProduct] = useState<InventoryProduct | null>(null)
  const [matchedVariant, setMatchedVariant] = useState<{
    sku: string
    size: string
    color: string
    stockQuantity: number
  } | null>(null)
  const [matchedType, setMatchedType] = useState<'SUPPLIER' | 'WAREHOUSE' | 'SKU' | null>(null)
  const [actionQty, setActionQty] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanHistory, setScanHistory] = useState<
    { code: string; name: string; time: string; type: string; qty: number }[]
  >([])

  const inputRef = useRef<HTMLInputElement>(null)

  // Keep input focused automatically for USB hardware wedge scanners
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Lookup code against supplier barcode, warehouse barcode, SKU, or Product ID
  const processBarcodeScan = (codeToSearch: string) => {
    const raw = codeToSearch.trim()
    if (!raw) return

    setLastScannedCode(raw)
    const q = raw.toLowerCase()

    let foundProduct: InventoryProduct | null = null
    let foundVariant: any = null
    let matchSource: 'SUPPLIER' | 'WAREHOUSE' | 'SKU' | null = null

    for (const p of products) {
      // 1. Check Product-level barcodes
      if (p.supplierBarcode && p.supplierBarcode.toLowerCase() === q) {
        foundProduct = p
        matchSource = 'SUPPLIER'
        break
      }
      if (p.warehouseBarcode && p.warehouseBarcode.toLowerCase() === q) {
        foundProduct = p
        matchSource = 'WAREHOUSE'
        break
      }
      if (p.sku && p.sku.toLowerCase() === q) {
        foundProduct = p
        matchSource = 'SKU'
        break
      }
      if (p.id.toLowerCase() === q) {
        foundProduct = p
        matchSource = 'SKU'
        break
      }

      // 2. Check Variant-level barcodes
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          if (v.supplierBarcode && v.supplierBarcode.toLowerCase() === q) {
            foundProduct = p
            foundVariant = v
            matchSource = 'SUPPLIER'
            break
          }
          if (v.warehouseBarcode && v.warehouseBarcode.toLowerCase() === q) {
            foundProduct = p
            foundVariant = v
            matchSource = 'WAREHOUSE'
            break
          }
          if (v.sku && v.sku.toLowerCase() === q) {
            foundProduct = p
            foundVariant = v
            matchSource = 'SKU'
            break
          }
        }
        if (foundProduct) break
      }
    }

    setMatchedProduct(foundProduct)
    setMatchedVariant(foundVariant)
    setMatchedType(matchSource)
    setScannedInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      processBarcodeScan(scannedInput)
    }
  }

  // Execute quick stock update via scanner
  const handleQuickAction = async (deltaSign: 1 | -1) => {
    if (!matchedProduct) return
    setIsProcessing(true)

    const delta = actionQty * deltaSign
    const type = delta > 0 ? 'RECEIVE' : 'ADJUST'
    const reason =
      scannerMode === 'INBOUND'
        ? 'Inbound supplier barcode intake scan'
        : scannerMode === 'OUTBOUND'
        ? 'Outbound shipping / dispatch scan'
        : 'Cycle audit barcode scan'

    try {
      await onAdjustStock(
        matchedProduct,
        delta,
        type,
        reason,
        matchedVariant ? matchedVariant.sku : undefined
      )

      setScanHistory((prev) => [
        {
          code: lastScannedCode,
          name: `${matchedProduct.name} ${matchedVariant ? `(${matchedVariant.color}/${matchedVariant.size})` : ''}`,
          time: new Date().toLocaleTimeString(),
          type: delta > 0 ? '+ Intake' : '- Deduct',
          qty: Math.abs(delta),
        },
        ...prev.slice(0, 7),
      ])

      // Clear for next scan
      setMatchedProduct(null)
      setMatchedVariant(null)
      setMatchedType(null)
      setActionQty(1)
      inputRef.current?.focus()
    } catch (err: any) {
      alert(err.message || 'Error processing barcode action')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-blue-600 animate-pulse" />
            <div>
              <h3 className="font-black text-sm uppercase text-[#080d2d]">Barcode Scanner Engine</h3>
              <p className="text-[11px] text-slate-400">
                Inbound Supplier Receiving &amp; Outbound Warehouse Dispatch
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setScannerMode('INBOUND')
              inputRef.current?.focus()
            }}
            className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-black uppercase tracking-wider transition border ${
              scannerMode === 'INBOUND'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
            <span>1. Inbound (Supplier)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScannerMode('OUTBOUND')
              inputRef.current?.focus()
            }}
            className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-black uppercase tracking-wider transition border ${
              scannerMode === 'OUTBOUND'
                ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
            <span>2. Outbound (Ship)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScannerMode('LOOKUP')
              inputRef.current?.focus()
            }}
            className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-black uppercase tracking-wider transition border ${
              scannerMode === 'LOOKUP'
                ? 'border-[#080d2d] bg-[#080d2d] text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Barcode className="h-4 w-4" />
            <span>Quick Lookup</span>
          </button>
        </div>

        {/* Hardware Wedge Scanner Input Box */}
        <div className="relative">
          <Barcode className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={scannedInput}
            onChange={(e) => setScannedInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scan barcode with laser gun (or type code and press Enter)..."
            className="w-full rounded-xl border-2 border-blue-500 bg-blue-50/20 py-3 pl-11 pr-24 font-mono text-sm font-bold text-[#080d2d] outline-none shadow-inner focus:bg-white"
          />
          <button
            type="button"
            onClick={() => processBarcodeScan(scannedInput)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#080d2d] px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            Verify
          </button>
        </div>

        {/* Scan Match Result Display */}
        {lastScannedCode && (
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-500">
                Scanned: <span className="text-[#080d2d]">{lastScannedCode}</span>
              </span>
              {matchedProduct ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Matched via {matchedType} Barcode
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-rose-800">
                  <AlertCircle className="h-3 w-3" /> Not Found
                </span>
              )}
            </div>

            {matchedProduct ? (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  {matchedProduct.image && (
                    <img
                      src={matchedProduct.image}
                      alt={matchedProduct.name}
                      className="h-14 w-14 rounded-lg object-cover border border-slate-200 bg-white"
                    />
                  )}
                  <div className="min-w-0 flex-1 text-xs">
                    <h4 className="font-bold text-[#080d2d] truncate">{matchedProduct.name}</h4>
                    <div className="text-slate-500 mt-0.5 flex flex-wrap gap-2">
                      <span className="font-mono text-[10px]">
                        SKU: <b>{matchedVariant ? matchedVariant.sku : matchedProduct.sku}</b>
                      </span>
                      {matchedVariant && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {matchedVariant.color} / {matchedVariant.size}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 mt-1">
                      Current Units On Hand:{' '}
                      <b className="font-mono text-emerald-600">
                        {matchedVariant
                          ? matchedVariant.stockQuantity
                          : (matchedProduct.stockQuantity ?? 25)}
                      </b>{' '}
                      units
                    </div>
                  </div>
                </div>

                {/* Instant Actions based on Mode */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Units:</span>
                    <input
                      type="number"
                      min="1"
                      value={actionQty}
                      onChange={(e) => setActionQty(Math.max(1, Number(e.target.value)))}
                      className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-[#080d2d]"
                    />
                  </div>

                  <div className="flex-1 flex justify-end gap-2">
                    {scannerMode === 'INBOUND' && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleQuickAction(1)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-black uppercase text-white hover:bg-emerald-700 shadow-xs"
                      >
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                        <span>Receive +{actionQty} Stock</span>
                      </button>
                    )}

                    {scannerMode === 'OUTBOUND' && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleQuickAction(-1)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-black uppercase text-white hover:bg-blue-700 shadow-xs"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Ship / Deduct -{actionQty}</span>
                      </button>
                    )}

                    {scannerMode === 'LOOKUP' && (
                      <div className="text-xs font-bold text-slate-500">
                        Item ready in catalog
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 pt-1">
                No catalog item matched this code. You can assign this barcode as the Supplier Barcode or Vendor Code in the Product Editor.
              </p>
            )}
          </div>
        )}

        {/* Scan Log Activity */}
        {scanHistory.length > 0 && (
          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Recent Scans in this Session
            </span>
            <div className="max-h-28 overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
              {scanHistory.map((h, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 text-[11px]">
                  <div>
                    <span className="font-bold text-[#080d2d]">{h.name}</span>
                    <span className="ml-2 font-mono text-[10px] text-slate-400">({h.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-700">{h.type} {h.qty}</span>
                    <span className="text-slate-400 text-[10px]">{h.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          <span>Plug any standard USB / Bluetooth Barcode Gun or type code.</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-1.5 font-bold text-slate-600 hover:bg-slate-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
