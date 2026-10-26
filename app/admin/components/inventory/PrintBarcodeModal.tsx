'use client'

import { useState, useMemo } from 'react'
import { Printer, X, Tag, Sparkles } from 'lucide-react'
import type { InventoryProduct } from './types'
import { generateBarcodeSvg } from '@/lib/barcode'

export type ThermalLabelSize = '50x30' | '75x50' | '100x50'

export interface PrintBarcodeModalProps {
  isOpen: boolean
  onClose: () => void
  product: InventoryProduct | null
}

export function PrintBarcodeModal({
  isOpen,
  onClose,
  product,
}: PrintBarcodeModalProps) {
  const [labelSize, setLabelSize] = useState<ThermalLabelSize>('50x30')
  const [selectedVariantSku, setSelectedVariantSku] = useState<string>('DEFAULT')
  const [printCopies, setPrintCopies] = useState<number>(1)
  const [includePrice, setIncludePrice] = useState<boolean>(true)
  const [includeBrand, setIncludeBrand] = useState<boolean>(true)

  // Compute full variant combinations from product sizes and colors if product.variants array is empty
  const variants = useMemo(() => {
    if (!product) return []
    if (product.variants && product.variants.length > 0) return product.variants

    const sizes = product.sizes?.length ? product.sizes : ['Standard']
    const colors = product.colors?.length ? product.colors.map((c) => c.name) : ['Standard']
    if (sizes.length <= 1 && colors.length <= 1 && sizes[0] === 'Standard' && colors[0] === 'Standard') {
      return []
    }

    const list: { sku: string; size: string; color: string; stockQuantity: number }[] = []
    for (const c of colors) {
      for (const s of sizes) {
        const colCode = c.slice(0, 3).toUpperCase()
        const szCode = s.toUpperCase()
        list.push({
          sku: `${product.sku || 'VS-' + product.id.slice(0, 6).toUpperCase()}-${colCode}-${szCode}`,
          size: s,
          color: c,
          stockQuantity: product.stockQuantity ?? 25,
        })
      }
    }
    return list
  }, [product])

  const activeVariant = variants.find((v) => v.sku === selectedVariantSku)

  // Use Warehouse barcode if set, else SKU
  const barcodeValue = product
    ? (activeVariant
        ? (((activeVariant as { warehouseBarcode?: string }).warehouseBarcode) || activeVariant.sku)
        : (product.warehouseBarcode || product.sku || `VS-${product.id.slice(0, 8).toUpperCase()}`))
    : ''

  const displaySku = activeVariant ? activeVariant.sku : (product?.sku || (product ? `VS-${product.id.slice(0, 8).toUpperCase()}` : ''))
  const displayColor = activeVariant?.color || (product?.colors?.[0]?.name ?? '')
  const displaySize = activeVariant?.size || (product?.sizes?.[0] ?? '')

  const svgDataUrl = useMemo(() => {
    if (!barcodeValue) return ''
    const rawSvg = generateBarcodeSvg({
      text: barcodeValue,
      height: labelSize === '50x30' ? 44 : 56,
      barWidth: labelSize === '50x30' ? 2 : 2.5,
      includeText: true,
    })
    return `data:image/svg+xml;utf8,${encodeURIComponent(rawSvg)}`
  }, [barcodeValue, labelSize])

  if (!isOpen || !product) return null

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=600')
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to print thermal labels.')
      return
    }

    // Determine dimensions in mm
    let widthMm = '50mm'
    let heightMm = '30mm'
    if (labelSize === '75x50') {
      widthMm = '75mm'
      heightMm = '50mm'
    } else if (labelSize === '100x50') {
      widthMm = '100mm'
      heightMm = '50mm'
    }

    const labelsHtml = Array.from({ length: printCopies })
      .map(
        () => `
        <div class="label-page">
          ${includeBrand ? `<div class="brand">BERRY PERRY ACTIVEWEAR</div>` : ''}
          <div class="title">${product.name}</div>
          <div class="meta">
            ${displayColor ? `<span>Color: <b>${displayColor}</b></span>` : ''}
            ${displaySize ? `<span>Size: <b>${displaySize}</b></span>` : ''}
            ${includePrice ? `<span>MRP: <b>₹${product.price}</b></span>` : ''}
          </div>
          <div class="barcode-container">
            <img src="${svgDataUrl}" alt="${barcodeValue}" />
          </div>
          <div class="sku-footer">SKU: ${displaySku}</div>
        </div>
      `
      )
      .join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Thermal Barcode Label - ${displaySku}</title>
          <style>
            @page {
              size: ${widthMm} ${heightMm};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background: #fff;
              color: #000;
            }
            .label-page {
              width: ${widthMm};
              height: ${heightMm};
              box-sizing: border-box;
              padding: 2mm 3mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              page-break-after: always;
            }
            .brand {
              font-size: 8pt;
              font-weight: 900;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            .title {
              font-size: 7.5pt;
              font-weight: 700;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .meta {
              font-size: 6.5pt;
              display: flex;
              justify-content: space-around;
              margin: 1mm 0;
              border-top: 0.5px solid #000;
              border-bottom: 0.5px solid #000;
              padding: 0.5mm 0;
            }
            .barcode-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .barcode-container img {
              max-width: 95%;
              max-height: 12mm;
              object-fit: contain;
            }
            .sku-footer {
              font-family: monospace;
              font-size: 6pt;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${labelsHtml}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-[#EB008B]" />
            <div>
              <h3 className="font-black text-sm uppercase text-[#080d2d]">Print Thermal Barcode Label</h3>
              <p className="text-[11px] text-slate-400">Outbound Shipping &amp; Hangtag Label Generator</p>
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

        {/* Live Thermal Label Preview (Simulated Paper) */}
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Thermal Sticker Preview ({labelSize} mm)
          </span>

          <div
            className={`bg-white rounded-lg border-2 border-dashed border-slate-300 shadow-sm p-3 text-center flex flex-col justify-between transition-all ${
              labelSize === '50x30' ? 'w-64 h-36' : 'w-72 h-44'
            }`}
          >
            {includeBrand && (
              <div className="text-[10px] font-black uppercase tracking-wider text-[#1A1A1A]">
                BERRY PERRY ACTIVEWEAR
              </div>
            )}
            <div className="text-xs font-bold text-[#080d2d] truncate px-1">
              {product.name}
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 border-y border-slate-200 py-0.5">
              {displayColor && <span>Color: <b className="text-[#080d2d]">{displayColor}</b></span>}
              {displaySize && <span>Size: <b className="text-[#080d2d]">{displaySize}</b></span>}
              {includePrice && <span>MRP: <b className="text-[#080d2d]">₹{product.price}</b></span>}
            </div>

            {/* Generated SVG Barcode */}
            <div className="flex items-center justify-center py-1">
              <img
                src={svgDataUrl}
                alt={barcodeValue}
                className="max-h-12 max-w-[90%] object-contain"
              />
            </div>

            <div className="text-[9px] font-mono font-bold text-slate-500">
              SKU: {displaySku}
            </div>
          </div>
        </div>

        {/* Label Settings Controls */}
        <div className="space-y-3 text-xs">
          {variants.length > 0 && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Specific Variant</label>
              <select
                value={selectedVariantSku}
                onChange={(e) => setSelectedVariantSku(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              >
                <option value="DEFAULT">Parent Product Tag ({product.sku || 'Default SKU'})</option>
                {variants.map((v) => (
                  <option key={v.sku} value={v.sku}>
                    {v.color} / Size {v.size} — SKU: {v.sku}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thermal Label Size</label>
              <select
                value={labelSize}
                onChange={(e) => setLabelSize(e.target.value as ThermalLabelSize)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              >
                <option value="50x30">50 × 30 mm (Standard Retail Hangtag)</option>
                <option value="75x50">75 × 50 mm (Warehouse Bin / Box)</option>
                <option value="100x50">100 × 50 mm (Master Shipping Carton)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Print Copies</label>
              <input
                type="number"
                min="1"
                max="500"
                value={printCopies}
                onChange={(e) => setPrintCopies(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-[#080d2d] outline-none focus:border-[#EB008B]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={includePrice}
                onChange={(e) => setIncludePrice(e.target.checked)}
                className="rounded accent-[#EB008B]"
              />
              <span>Show MRP Price</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={includeBrand}
                onChange={(e) => setIncludeBrand(e.target.checked)}
                className="rounded accent-[#EB008B]"
              />
              <span>Show Brand Header</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-[#080d2d] px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-slate-800 shadow-md transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print {printCopies} {printCopies === 1 ? 'Sticker' : 'Stickers'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
