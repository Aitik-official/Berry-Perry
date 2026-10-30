'use client'

import { useState } from 'react'
import {
  X,
  Printer,
  FileText,
  Truck,
  Check,
  Building,
  User,
  Package,
} from 'lucide-react'
import { generateBarcodeSvg } from '@/lib/barcode'

export interface InvoiceOrderData {
  orderNumber: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  items: Array<{
    productId?: string
    name: string
    price: number
    quantity: number
    size?: string
    color?: string
    unitBarcode?: string
  }>
  subtotal: number
  discount: number
  shipping: number
  codFee: number
  grandTotal: number
  paymentMethod: string
  paymentStatus: string
  createdAt?: string
  trackingNumber?: string
  courier?: string
}

export interface PrintShippingInvoiceDialogProps {
  order: InvoiceOrderData
  isOpen: boolean
  onClose: () => void
  companySettings?: {
    companyName?: string
    tradeName?: string
    gstin?: string
    email?: string
    phone?: string
    addressLine1?: string
    city?: string
    state?: string
    pincode?: string
    invoicePrefix?: string
    bankDetails?: {
      bankName?: string
      accountNumber?: string
      ifsc?: string
      branch?: string
    }
  }
}

export function PrintShippingInvoiceDialog({
  order,
  isOpen,
  onClose,
  companySettings,
}: PrintShippingInvoiceDialogProps) {
  const [printMode, setPrintMode] = useState<'INVOICE' | 'SHIPPING_SLIP'>('INVOICE')

  if (!isOpen) return null

  const company = companySettings || {
    companyName: 'Berry Perry India Pvt. Ltd.',
    tradeName: 'Berry Perry Cricket & Activewear',
    gstin: '07AAAAA1234A1Z5',
    email: 'support@berryperry.com',
    phone: '+91 98000 12345',
    addressLine1: 'Plot 42, Sportswear Tech Park, Phase II',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110020',
    invoicePrefix: 'BP-INV',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0001234',
      branch: 'Connaught Place, New Delhi',
    },
  }

  const invoiceNumber = `${company.invoicePrefix || 'BP-INV'}-${order.orderNumber}`
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')
  const trackingNumber = order.trackingNumber || `DEL-${order.orderNumber.slice(-6)}-IN`
  const courierName = order.courier || 'Delhivery Surface Express'

  const orderBarcodeSvg = generateBarcodeSvg({
    text: order.orderNumber,
    height: 48,
    barWidth: 2,
    includeText: true,
  })

  const trackingBarcodeSvg = generateBarcodeSvg({
    text: trackingNumber,
    height: 52,
    barWidth: 2,
    includeText: true,
  })

  const handlePrint = () => {
    window.print()
  }

  // GST calculations
  const taxableAmount = Math.round((order.subtotal / 1.18) * 100) / 100
  const totalTax = Math.round((order.subtotal - taxableAmount) * 100) / 100
  const isInterState = order.customer.state.toLowerCase() !== 'delhi'
  const cgst = isInterState ? 0 : Math.round((totalTax / 2) * 100) / 100
  const sgst = isInterState ? 0 : Math.round((totalTax / 2) * 100) / 100
  const igst = isInterState ? totalTax : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      {/* Print-only CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-document-container, #print-document-container * {
            visibility: visible;
          }
          #print-document-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: ${printMode === 'SHIPPING_SLIP' ? '0' : '10mm'};
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: ${printMode === 'SHIPPING_SLIP' ? '100mm 150mm' : 'A4'};
            margin: 0;
          }
        }
      `}} />

      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Toolbar (hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Document Type:</span>
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setPrintMode('INVOICE')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-black transition ${
                  printMode === 'INVOICE'
                    ? 'bg-[#080d2d] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>GST Tax Invoice (A4)</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('SHIPPING_SLIP')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-black transition ${
                  printMode === 'SHIPPING_SLIP'
                    ? 'bg-[#080d2d] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Thermal Shipping Slip (100×150mm)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div id="print-document-container" className="bg-white text-slate-900 shadow-md">

            {/* ============================================================ */}
            {/* VIEW 1: A4 GST TAX INVOICE                                   */}
            {/* ============================================================ */}
            {printMode === 'INVOICE' && (
              <div className="w-[794px] min-h-[1123px] p-10 font-sans text-xs flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
                    <div>
                      <h1 className="text-2xl font-black uppercase tracking-tight text-[#080d2d]">
                        {company.companyName}
                      </h1>
                      <p className="font-semibold text-slate-600">{company.tradeName}</p>
                      <p className="mt-1 text-[11px] text-slate-600">
                        {company.addressLine1}, {company.city}, {company.state} - {company.pincode}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        GSTIN: <span className="font-mono font-bold text-slate-900">{company.gstin}</span> | Phone: {company.phone}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="inline-block rounded-md bg-[#080d2d] px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                        TAX INVOICE
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Invoice No: <span className="font-mono">{invoiceNumber}</span>
                      </p>
                      <p className="text-xs text-slate-600">Date: {orderDate}</p>
                      <div className="mt-2 flex justify-end" dangerouslySetInnerHTML={{ __html: orderBarcodeSvg }} />
                    </div>
                  </div>

                  {/* Customer / Consignee Details */}
                  <div className="mt-5 grid grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Billed &amp; Shipped To (Customer):</p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-slate-700">{order.customer.address}</p>
                      <p className="text-xs text-slate-700">
                        {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Phone: <span className="font-mono font-semibold">{order.customer.phone}</span>
                      </p>
                      <p className="text-xs text-slate-600">Email: {order.customer.email}</p>
                    </div>

                    <div className="border-l border-slate-200 pl-6">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Order &amp; Shipping Details:</p>
                      <p className="mt-1 text-xs text-slate-700">
                        Order ID: <span className="font-mono font-bold">{order.orderNumber}</span>
                      </p>
                      <p className="text-xs text-slate-700">
                        Courier: <span className="font-semibold">{courierName}</span>
                      </p>
                      <p className="text-xs text-slate-700">
                        Tracking AWB: <span className="font-mono font-bold text-slate-900">{trackingNumber}</span>
                      </p>
                      <p className="text-xs text-slate-700">
                        Payment Mode: <span className="font-bold uppercase text-slate-900">{order.paymentMethod}</span> ({order.paymentStatus})
                      </p>
                      <p className="text-xs text-slate-700">
                        Place of Supply: <span className="font-semibold">{order.customer.state}</span>
                      </p>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="mt-6">
                    <table className="w-full text-left border-collapse border border-slate-200">
                      <thead>
                        <tr className="bg-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-700">
                          <th className="border border-slate-200 p-2 text-center w-10">#</th>
                          <th className="border border-slate-200 p-2">Item Description</th>
                          <th className="border border-slate-200 p-2 text-center w-20">HSN</th>
                          <th className="border border-slate-200 p-2 text-center w-14">Qty</th>
                          <th className="border border-slate-200 p-2 text-right w-24">Unit Rate</th>
                          <th className="border border-slate-200 p-2 text-right w-24">Taxable</th>
                          <th className="border border-slate-200 p-2 text-right w-24">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => {
                          const itemTotal = item.price * item.quantity
                          const itemTaxable = Math.round((itemTotal / 1.18) * 100) / 100
                          return (
                            <tr key={idx} className="border-b border-slate-200 text-xs">
                              <td className="border border-slate-200 p-2 text-center text-slate-500">{idx + 1}</td>
                              <td className="border border-slate-200 p-2">
                                <p className="font-bold text-slate-900">{item.name}</p>
                                <p className="text-[10px] text-slate-500">
                                  {item.color && `Color: ${item.color}`} {item.size && `| Size: ${item.size}`}
                                  {item.unitBarcode && ` | Serial: ${item.unitBarcode}`}
                                </p>
                              </td>
                              <td className="border border-slate-200 p-2 text-center font-mono text-slate-600">610910</td>
                              <td className="border border-slate-200 p-2 text-center font-bold">{item.quantity}</td>
                              <td className="border border-slate-200 p-2 text-right font-mono">₹{item.price.toFixed(2)}</td>
                              <td className="border border-slate-200 p-2 text-right font-mono">₹{itemTaxable.toFixed(2)}</td>
                              <td className="border border-slate-200 p-2 text-right font-mono font-bold text-slate-900">
                                ₹{itemTotal.toFixed(2)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Summary */}
                  <div className="mt-4 flex justify-between">
                    {/* Bank Details */}
                    <div className="w-1/2 rounded-xl border border-slate-200 p-3 bg-slate-50 text-[11px]">
                      <p className="font-black uppercase tracking-wider text-slate-600">Bank Transfer / NEFT Details:</p>
                      <p className="mt-1 font-semibold text-slate-800">Bank: {company.bankDetails?.bankName}</p>
                      <p className="font-mono text-slate-700">A/C: {company.bankDetails?.accountNumber}</p>
                      <p className="font-mono text-slate-700">IFSC: {company.bankDetails?.ifsc}</p>
                      <p className="text-slate-600">Branch: {company.bankDetails?.branch}</p>
                    </div>

                    {/* Tax Breakdown */}
                    <div className="w-2/5 space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 text-slate-600">
                        <span>Taxable Value:</span>
                        <span className="font-mono">₹{taxableAmount.toFixed(2)}</span>
                      </div>
                      {!isInterState ? (
                        <>
                          <div className="flex justify-between py-0.5 text-slate-600">
                            <span>CGST (9%):</span>
                            <span className="font-mono">₹{cgst.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-0.5 text-slate-600">
                            <span>SGST (9%):</span>
                            <span className="font-mono">₹{sgst.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between py-0.5 text-slate-600">
                          <span>IGST (18%):</span>
                          <span className="font-mono">₹{igst.toFixed(2)}</span>
                        </div>
                      )}
                      {order.shipping > 0 && (
                        <div className="flex justify-between py-0.5 text-slate-600">
                          <span>Shipping Charges:</span>
                          <span className="font-mono">₹{order.shipping.toFixed(2)}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between py-0.5 text-emerald-600 font-bold">
                          <span>Coupon Discount:</span>
                          <span className="font-mono">-₹{order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm font-black text-slate-900">
                        <span>Grand Total (INR):</span>
                        <span className="font-mono text-base">₹{order.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Signoff */}
                <div className="mt-8 border-t border-slate-200 pt-6 flex justify-between items-end">
                  <div className="text-[10px] text-slate-500 max-w-sm">
                    <p className="font-bold text-slate-700">Declaration &amp; Terms:</p>
                    <p>We declare that this invoice shows actual price of the goods described and that all particulars are true and correct. Computer generated invoice; no physical signature required.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-800">For {company.companyName}</p>
                    <div className="mt-8 border-t border-dashed border-slate-400 pt-1 text-[10px] font-bold text-slate-600">
                      Authorized Signatory
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 2: 100x150mm (4x6 INCH) THERMAL SHIPPING LABEL          */}
            {/* ============================================================ */}
            {printMode === 'SHIPPING_SLIP' && (
              <div className="w-[378px] h-[567px] p-4 font-sans text-xs flex flex-col justify-between border-2 border-slate-900 bg-white">
                <div>
                  {/* Carrier Header */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div>
                      <p className="text-base font-black tracking-tight uppercase text-black">{courierName}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black">Priority Surface Cargo</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-md border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-black">
                        {order.paymentMethod === 'cod' ? 'COD - COLLECT ₹' + order.grandTotal : 'PREPAID'}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Barcode */}
                  <div className="mt-2.5 flex flex-col items-center justify-center border-b-2 border-black pb-2">
                    <div dangerouslySetInnerHTML={{ __html: trackingBarcodeSvg }} />
                    <p className="mt-1 text-[11px] font-mono font-black tracking-widest text-black">AWB: {trackingNumber}</p>
                  </div>

                  {/* Consignee / Delivery Address */}
                  <div className="mt-2 border-b-2 border-black pb-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-black">Deliver To:</p>
                    <p className="text-sm font-black text-black leading-tight">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-black leading-tight">{order.customer.address}</p>
                    <p className="text-xs font-black text-black">
                      {order.customer.city}, {order.customer.state}
                    </p>
                    <p className="mt-1 text-sm font-mono font-black text-black">
                      PIN: {order.customer.pincode}
                    </p>
                    <p className="text-[11px] font-bold text-black">
                      Phone: <span className="font-mono">{order.customer.phone}</span>
                    </p>
                  </div>

                  {/* Items summary */}
                  <div className="mt-2 text-[10px]">
                    <div className="flex justify-between font-bold border-b border-black pb-0.5">
                      <span>Item / Qty</span>
                      <span>Order #{order.orderNumber}</span>
                    </div>
                    <div className="mt-1 space-y-0.5 max-h-16 overflow-hidden">
                      {order.items.slice(0, 3).map((it, idx) => (
                        <p key={idx} className="truncate text-black">
                          {it.quantity}x {it.name} {it.size ? `(${it.size})` : ''}
                        </p>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-[9px] font-bold italic">+ {order.items.length - 3} more items</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Return Address & Order Barcode Footer */}
                <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                  <div className="text-[9px] text-black leading-tight">
                    <p className="font-black uppercase">If undelivered return to:</p>
                    <p className="font-bold">{company.tradeName || company.companyName}</p>
                    <p>{company.city}, {company.state} - {company.pincode}</p>
                  </div>
                  <div className="scale-75 origin-right" dangerouslySetInnerHTML={{ __html: orderBarcodeSvg }} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

