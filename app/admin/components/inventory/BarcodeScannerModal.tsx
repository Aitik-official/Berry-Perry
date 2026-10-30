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

export type ScannerMode = 'INBOUND' | 'OUTBOUND' | 'LOOKUP' | 'VERIFY'

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
  const [matchedType, setMatchedType] = useState<'SUPPLIER' | 'WAREHOUSE' | 'SKU' | 'UNIT' | 'ORDER' | null>(null)
  const [actionQty, setActionQty] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanHistory, setScanHistory] = useState<
    { code: string; name: string; time: string; type: string; qty: number }[]
  >([])

  // Dispatch Verification State
  const [verifyOrder, setVerifyOrder] = useState<any | null>(null)
  const [verifyUnit, setVerifyUnit] = useState<any | null>(null)
  const [verifyStatus, setVerifyStatus] = useState<'WAITING_ORDER' | 'WAITING_UNIT' | 'SUCCESS' | 'MISMATCH' | null>('WAITING_ORDER')
  const [verifyMessage, setVerifyMessage] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null)

  const playAudioTone = (frequency: number, duration: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = frequency
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      setTimeout(() => {
        osc.stop()
        ctx.close()
      }, duration * 1000 + 50)
    } catch {}
  }

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
  const processBarcodeScan = async (codeToSearch: string) => {
    const raw = codeToSearch.trim()
    if (!raw) return

    setLastScannedCode(raw)
    const q = raw.toLowerCase()

    // Handle Dispatch Verification Mode
    if (scannerMode === 'VERIFY') {
      if (!verifyOrder) {
        // Step 1: Scan Order Number
        try {
          const res = await fetch(`/api/scan/verify?barcode=${encodeURIComponent(raw)}`)
          const data = await res.json()
          if (res.ok && data.type === 'ORDER') {
            setVerifyOrder(data.data)
            setVerifyStatus('WAITING_UNIT')
            setVerifyMessage(`Order #${data.data.orderNumber} loaded. Now scan item unit barcode.`)
            playAudioTone(880, 0.12)
          } else {
            setVerifyStatus('MISMATCH')
            setVerifyMessage(`Code "${raw}" is not an active order shipping number.`)
            playAudioTone(220, 0.3)
          }
        } catch {
          setVerifyStatus('MISMATCH')
          setVerifyMessage(`Failed to look up order "${raw}".`)
        }
      } else {
        // Step 2: Scan Unit Barcode and verify with order items
        try {
          const res = await fetch(`/api/scan/verify?barcode=${encodeURIComponent(raw)}`)
          const data = await res.json()
          const scannedSku = data.type === 'UNIT_BARCODE' ? data.data.sku : raw
          const isMatch = verifyOrder.items?.some((it: any) =>
            it.productId === data.data?.productId ||
            it.unitBarcode === raw ||
            (it.sku && it.sku.toLowerCase() === scannedSku.toLowerCase()) ||
            it.name.toLowerCase().includes(scannedSku.toLowerCase())
          )

          if (isMatch) {
            setVerifyUnit(data.data || { barcode: raw })
            setVerifyStatus('SUCCESS')
            setVerifyMessage(`MATCH CONFIRMED! Unit #${data.data?.serialNumber || raw} verified for order #${verifyOrder.orderNumber}.`)
            playAudioTone(880, 0.1)
            setTimeout(() => playAudioTone(1320, 0.2), 120)

            // Auto-advance order status to shipped
            await fetch('/api/orders', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: verifyOrder._id || verifyOrder.orderNumber,
                orderStatus: 'shipped',
              }),
            })
          } else {
            setVerifyStatus('MISMATCH')
            setVerifyMessage(`MISMATCH! Unit ${raw} does NOT belong to order #${verifyOrder.orderNumber}.`)
            playAudioTone(220, 0.35)
          }
        } catch {
          setVerifyStatus('MISMATCH')
          setVerifyMessage(`Error verifying unit barcode "${raw}".`)
        }
      }
      setScannedInput('')
      return
    }

    let foundProduct: InventoryProduct | null = null
    let foundVariant: any = null
    let matchSource: 'SUPPLIER' | 'WAREHOUSE' | 'SKU' | null = null

    for (const p of products) {
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

    if (foundProduct) {
      setMatchedProduct(foundProduct)
      setMatchedVariant(foundVariant)
      setMatchedType(matchSource)
      playAudioTone(660, 0.08)
    } else {
      // Query backend scan verification API
      try {
        const res = await fetch(`/api/scan/verify?barcode=${encodeURIComponent(raw)}`)
        const data = await res.json()
        if (res.ok && data.success) {
          if (data.type === 'PRODUCT') {
            setMatchedProduct(data.data)
            setMatchedType('SKU')
          } else if (data.type === 'UNIT_BARCODE') {
            const prod = products.find((p) => p.id === data.data.productId)
            if (prod) {
              setMatchedProduct(prod)
              setMatchedType('UNIT')
            }
          }
          playAudioTone(660, 0.08)
        }
      } catch {}
    }

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => {
              setScannerMode('INBOUND')
              inputRef.current?.focus()
            }}
            className={`flex items-center justify-center gap-1.5 rounded-xl p-2 text-[11px] font-black uppercase tracking-wider transition border ${
              scannerMode === 'INBOUND'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
            <span>1. Inbound</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScannerMode('OUTBOUND')
              inputRef.current?.focus()
            }}
            className={`flex items-center justify-center gap-1.5 rounded-xl p-2 text-[11px] font-black uppercase tracking-wider transition border ${
              scannerMode === 'OUTBOUND'
                ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
            <span>2. Outbound</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScannerMode('VERIFY')
              setVerifyOrder(null)
              setVerifyUnit(null)
              setVerifyStatus('WAITING_ORDER')
              setVerifyMessage('Scan order shipping barcode or enter order ID')
              inputRef.current?.focus()
            }}
            className={`flex items-center justify-center gap-1.5 rounded-xl p-2 text-[11px] font-black uppercase tracking-wider transition border ${
              scannerMode === 'VERIFY'
                ? 'border-purple-600 bg-purple-50 text-purple-800 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
            <span>3. POS Verify</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScannerMode('LOOKUP')
              inputRef.current?.focus()
            }}
            className={`flex items-center justify-center gap-1.5 rounded-xl p-2 text-[11px] font-black uppercase tracking-wider transition border ${
              scannerMode === 'LOOKUP'
                ? 'border-[#080d2d] bg-[#080d2d] text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Barcode className="h-3.5 w-3.5" />
            <span>Lookup</span>
          </button>
        </div>

        {/* Dispatch Verification Banner when in VERIFY mode */}
        {scannerMode === 'VERIFY' && (
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black uppercase text-purple-900 tracking-wider">
                {verifyOrder ? `Order #${verifyOrder.orderNumber}` : 'Step 1: Scan Order Barcode'}
              </span>
              <span className="font-bold text-[10px] text-purple-700">
                {verifyStatus === 'SUCCESS' ? 'VERIFIED ✓' : verifyStatus === 'MISMATCH' ? 'ERROR ✗' : 'PENDING SCAN'}
              </span>
            </div>
            <p className="text-slate-600 font-medium text-[11px]">{verifyMessage}</p>

            {verifyOrder && (
              <div className="mt-2 space-y-1 rounded-lg border border-purple-100 bg-white p-2">
                <p className="font-bold text-slate-800">
                  {verifyOrder.customer?.firstName} {verifyOrder.customer?.lastName} ({verifyOrder.customer?.city})
                </p>
                <div className="text-[10px] text-slate-500">
                  Expected items: {verifyOrder.items?.map((it: any) => `${it.quantity}x ${it.name}`).join(', ')}
                </div>
              </div>
            )}
          </div>
        )}

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
