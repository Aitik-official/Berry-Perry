'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Banknote,
  Send,
  Loader2,
  Printer,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { PrintShippingInvoiceDialog } from '@/components/PrintShippingInvoiceDialog'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
  unitBarcode?: string
}

export interface CustomerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface OrderRecord {
  _id?: string
  orderNumber: string
  customer: CustomerDetails
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  codFee: number
  grandTotal: number
  paymentMethod: 'card' | 'upi' | 'cod'
  paymentStatus: 'paid' | 'pending' | 'cod'
  orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  trackingNumber?: string
  courier?: string
  returnReason?: string
  returnType?: 'RESTOCK' | 'DEFECTIVE'
  notes?: string
  createdAt: string
}

export function OrdersTab() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Interactive Order Return Lifecycle Modal
  const [returnModalOrder, setReturnModalOrder] = useState<OrderRecord | null>(null)
  const [returnType, setReturnType] = useState<'RESTOCK' | 'DEFECTIVE'>('RESTOCK')
  const [returnReason, setReturnReason] = useState('Customer size/fit mismatch')
  const [returnNotes, setReturnNotes] = useState('')
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false)

  // GST Invoice & Thermal Shipping Slip Print Modal
  const [printModalOrder, setPrintModalOrder] = useState<OrderRecord | null>(null)

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (res.ok && data.orders && data.orders.length > 0) {
        setOrders(data.orders)
        try {
          localStorage.setItem('berryperry_store_orders_v1', JSON.stringify(data.orders))
        } catch {}
      } else {
        // Fallback to local storage if DB is empty or offline
        const local = localStorage.getItem('berryperry_store_orders_v1') || localStorage.getItem('virat_store_orders_v1')
        if (local) {
          setOrders(JSON.parse(local))
        } else {
          setOrders([])
        }
      }
    } catch {
      const local = localStorage.getItem('berryperry_store_orders_v1') || localStorage.getItem('virat_store_orders_v1')
      if (local) setOrders(JSON.parse(local))
      else setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Keep selectedOrder in sync when orders list is updated
  useEffect(() => {
    if (selectedOrder) {
      const match = orders.find(
        (o) => (o._id && o._id === selectedOrder._id) || o.orderNumber === selectedOrder.orderNumber
      )
      if (match) {
        setSelectedOrder(match)
      }
    }
  }, [orders])

  // Lock body scroll and allow ESC key to close when drawer is open
  useEffect(() => {
    if (selectedOrder) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedOrder(null)
        }
      }
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [selectedOrder])

  const handleUpdateStatus = async (orderId: string, newStatus: OrderRecord['orderStatus']) => {
    setUpdatingId(orderId)
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      })
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: newStatus } : o))
      )
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
        setSelectedOrder((prev) => prev ? { ...prev, orderStatus: newStatus } : null)
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'))
      }
    } catch (err) {
      console.error('Failed to update status', err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Intercept status changes to launch Return triage when 'returned' is chosen
  const handleStatusChangeRequest = (order: OrderRecord, targetStatus: OrderRecord['orderStatus']) => {
    if (targetStatus === 'returned') {
      setReturnModalOrder(order)
      setReturnType('RESTOCK')
      setReturnReason('Customer size/fit mismatch')
      setReturnNotes('')
    } else {
      handleUpdateStatus(order._id || order.orderNumber, targetStatus)
    }
  }

  // Execute interactive return workflow
  const handleProcessReturn = async () => {
    if (!returnModalOrder) return
    setIsSubmittingReturn(true)
    const currentId = returnModalOrder._id || returnModalOrder.orderNumber

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: currentId,
          orderStatus: 'returned',
          returnType,
          returnReason,
          notes: returnNotes,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            (o._id === currentId || o.orderNumber === currentId)
              ? { ...o, orderStatus: 'returned', returnType, returnReason }
              : o
          )
        )
        if (selectedOrder && (selectedOrder._id === currentId || selectedOrder.orderNumber === currentId)) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, orderStatus: 'returned', returnType, returnReason } : null
          )
        }
        setReturnModalOrder(null)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        alert(data.error || 'Failed to process order return')
      }
    } catch (err: any) {
      alert(err.message || 'Error processing return')
    } finally {
      setIsSubmittingReturn(false)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) return false
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.customer?.firstName?.toLowerCase().includes(q) ||
      order.customer?.lastName?.toLowerCase().includes(q) ||
      order.customer?.email?.toLowerCase().includes(q) ||
      order.customer?.phone?.includes(q) ||
      order.customer?.city?.toLowerCase().includes(q)
    )
  })

  // Quick stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)
  const placedCount = orders.filter((o) => o.orderStatus === 'placed').length
  const shippedCount = orders.filter((o) => o.orderStatus === 'shipped').length

  const getStatusBadge = (status: OrderRecord['orderStatus']) => {
    switch (status) {
      case 'placed':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cancelled':
        return 'bg-slate-200 text-slate-800 border-slate-300'
      case 'returned':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Stats: 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl font-black text-[#1A1A1A]">{orders.length}</span>
            <span className="text-[11px] font-semibold text-slate-400">received</span>
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Action Needed</p>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl font-black text-amber-600">{placedCount}</span>
            <span className="text-[11px] font-semibold text-amber-600/70">pending</span>
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">In Transit</p>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl font-black text-purple-600">{shippedCount}</span>
            <span className="text-[11px] font-semibold text-purple-600/70">shipping</span>
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Sales</p>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 truncate">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Stacks on mobile with full width elements */}
      <div className="flex flex-col gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#EB008B] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="placed">Placed (New)</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned ({orders.filter(o => o.orderStatus === 'returned').length})</option>
          </select>

          <button
            onClick={fetchOrders}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shrink-0"
            title="Refresh orders"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin text-[#EB008B]' : ''}`} />
            <span className="hidden xs:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders List / Table */}
      {isLoading ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
          <Loader2 className="size-8 animate-spin text-[#EB008B] mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading incoming orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="size-14 sm:size-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 sm:mb-4">
            <ShoppingBag className="size-6 sm:size-8 text-slate-300" />
          </div>
          <h3 className="text-sm sm:text-base font-black uppercase text-[#1A1A1A]">No Orders Found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm px-4">
            {searchTerm || statusFilter !== 'all'
              ? 'No orders match your filter criteria.'
              : 'As soon as customers complete checkout, their order details and shipping address will automatically show up here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet: Column-based Structured Table */}
          <div className="hidden md:block overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 w-[160px]">Order ID</th>
                    <th className="py-3.5 px-4 min-w-[220px]">Product Name & Items</th>
                    <th className="py-3.5 px-4 min-w-[190px]">Customer Contact</th>
                    <th className="py-3.5 px-4 w-[140px] text-center">Status</th>
                    <th className="py-3.5 px-4 w-[150px] text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredOrders.map((order) => {
                    const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'
                    const timeStr = order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                    const idKey = order._id || order.orderNumber
                    const isSelected = selectedOrder && (selectedOrder._id === order._id || selectedOrder.orderNumber === order.orderNumber)
                    const firstItem = order.items?.[0]
                    const moreItemsCount = (order.items?.length || 0) - 1

                    return (
                      <tr
                        key={idKey}
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer transition hover:bg-slate-50/80 ${
                          isSelected ? 'bg-slate-50 ring-1 ring-inset ring-[#080d2d]' : ''
                        }`}
                      >
                        {/* 1. Order ID Column */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex flex-col">
                            <span className="font-mono font-black text-xs text-[#1A1A1A] group-hover:text-[#EB008B]">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              {dateStr} {timeStr}
                            </span>
                          </div>
                        </td>

                        {/* 2. Product Name Column */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-start gap-3">
                            <div className="relative size-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                              {firstItem?.image ? (
                                <img
                                  src={firstItem.image}
                                  alt={firstItem.name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <div className="size-full flex items-center justify-center text-slate-400">
                                  <ShoppingBag className="size-4 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-[#1A1A1A] line-clamp-1 text-xs" title={firstItem?.name || 'Package item'}>
                                {firstItem?.name || 'Order Item'}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                {firstItem?.size && (
                                  <span className="font-bold uppercase text-slate-600">
                                    Size: {firstItem.size}
                                  </span>
                                )}
                                {firstItem?.color && (
                                  <span>• {firstItem.color}</span>
                                )}
                                <span>• Qty: {firstItem?.quantity || 1}</span>
                              </div>
                              {moreItemsCount > 0 && (
                                <span className="inline-block mt-1 text-[10px] font-bold text-[#EB008B] bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                                  +{moreItemsCount} more item{moreItemsCount > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 3. Customer Contact Column */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1A1A1A] text-xs">
                              {order.customer?.firstName} {order.customer?.lastName}
                            </span>
                            {order.customer?.phone && (
                              <span className="text-[11px] font-medium text-slate-600 mt-0.5">
                                {order.customer.phone}
                              </span>
                            )}
                            {order.customer?.city && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                {order.customer.city}{order.customer.state ? `, ${order.customer.state}` : ''}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. Status Column */}
                        <td className="py-3.5 px-4 align-top text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <select
                              value={order.orderStatus}
                              disabled={updatingId === idKey}
                              onChange={(e) => handleStatusChangeRequest(order, e.target.value as OrderRecord['orderStatus'])}
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer transition shadow-2xs hover:shadow-xs focus:ring-2 focus:ring-[#080d2d]/20 ${getStatusBadge(
                                order.orderStatus
                              )}`}
                            >
                              <option value="placed">Placed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="returned">Returned</option>
                            </select>
                            <button
                              type="button"
                              title="Print GST Invoice / Shipping Slip"
                              onClick={() => setPrintModalOrder(order)}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800 transition"
                            >
                              <Printer className="size-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* 5. Price Column */}
                        <td className="py-3.5 px-4 align-top text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-black text-sm text-[#1A1A1A]">
                              ₹{order.grandTotal?.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold uppercase mt-0.5">
                              {order.paymentMethod === 'cod' ? (
                                <span className="text-amber-700">Cash on Delivery</span>
                              ) : (
                                <span className="text-emerald-700">{order.paymentMethod} (Paid)</span>
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View: Responsive Column-Based Cards */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => {
              const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'
              const idKey = order._id || order.orderNumber
              const isSelected = selectedOrder && (selectedOrder._id === order._id || selectedOrder.orderNumber === order.orderNumber)
              const firstItem = order.items?.[0]
              const moreItemsCount = (order.items?.length || 0) - 1

              return (
                <div
                  key={idKey}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer rounded-xl border bg-white p-4 shadow-xs transition hover:shadow-sm ${
                    isSelected ? 'border-[#080d2d] bg-slate-50 ring-1 ring-[#080d2d]' : 'border-slate-200'
                  }`}
                >
                  {/* Row 1: Order ID & Status */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Order ID</span>
                      <span className="font-mono font-black text-sm text-[#1A1A1A]">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === idKey}
                          onChange={(e) => handleStatusChangeRequest(order, e.target.value as OrderRecord['orderStatus'])}
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider outline-none cursor-pointer transition shadow-2xs ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                        </select>
                        <span className="block text-[9px] text-slate-400 mt-0.5">{dateStr}</span>
                      </div>
                      <button
                        type="button"
                        title="Print Shipping Slip"
                        onClick={() => setPrintModalOrder(order)}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 transition"
                      >
                        <Printer className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Product Name & Thumbnail */}
                  <div className="py-2.5 border-b border-slate-100 flex items-start gap-3">
                    <div className="relative size-11 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                      {firstItem?.image ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-slate-400">
                          <ShoppingBag className="size-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Product</span>
                      <p className="font-bold text-xs text-[#1A1A1A] line-clamp-1">
                        {firstItem?.name || 'Order Item'}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                        {firstItem?.size && <span>Size: {firstItem.size}</span>}
                        {firstItem?.color && <span>• {firstItem.color}</span>}
                        <span>• Qty: {firstItem?.quantity || 1}</span>
                      </div>
                      {moreItemsCount > 0 && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#EB008B] bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                          +{moreItemsCount} more item{moreItemsCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Customer Contact & Price */}
                  <div className="pt-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Contact</span>
                      <p className="font-bold text-xs text-[#1A1A1A]">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                      <p className="text-[10px] text-slate-500">{order.customer?.phone}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Price</span>
                      <span className="font-black text-sm text-[#1A1A1A]">
                        ₹{order.grandTotal?.toLocaleString()}
                      </span>
                      <span className="block text-[9px] font-bold uppercase text-slate-500">
                        {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Slide-over Right Drawer for Order Details - 100% width on mobile, max-w-xl on larger screens */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 transition-opacity animate-in fade-in duration-150"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Drawer Panel: full width on mobile */}
          <div className="relative z-10 flex h-full w-full sm:max-w-xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200 transform-gpu will-change-transform">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-[#EB008B] text-white shadow-md shadow-[#EB008B]/20">
                  <ShoppingBag className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-sm sm:text-base text-[#1A1A1A] truncate">Order #{selectedOrder.orderNumber}</h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 ${getStatusBadge(
                        selectedOrder.orderStatus
                      )}`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintModalOrder(selectedOrder)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  title="Print GST Tax Invoice & Thermal Shipping Slip"
                >
                  <Printer className="size-3.5 text-slate-600" />
                  <span className="hidden xs:inline">Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shadow-sm"
                  title="Close drawer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 sm:space-y-6 [webkit-overflow-scrolling:touch]">
              {/* Return Details Banner if already returned */}
              {selectedOrder.orderStatus === 'returned' && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-black text-rose-800 uppercase tracking-wider">
                    <RotateCcw className="size-3.5" />
                    <span>Order Returned ({selectedOrder.returnType || 'RESTOCK'})</span>
                  </div>
                  {selectedOrder.returnReason && (
                    <p className="text-slate-700 font-medium">Reason: {selectedOrder.returnReason}</p>
                  )}
                  {selectedOrder.notes && (
                    <p className="text-slate-500 text-[11px]">{selectedOrder.notes}</p>
                  )}
                </div>
              )}

              {/* Fulfillment Status Control */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm space-y-2.5 sm:space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <Truck className="size-3.5 text-blue-600" />
                  Update Fulfillment Status
                </h4>
                <p className="text-[11px] text-slate-500">
                  Click a status to transition the package fulfillment state:
                </p>
                <div className="grid grid-cols-2 xs:flex xs:flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {(['placed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'] as const).map((st) => {
                    const currentId = selectedOrder._id || selectedOrder.orderNumber
                    const isCurrent = selectedOrder.orderStatus === st
                    return (
                      <button
                        key={st}
                        disabled={updatingId === currentId || isCurrent}
                        onClick={() => handleStatusChangeRequest(selectedOrder, st)}
                        className={`rounded-xl px-3 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-center transition ${
                          isCurrent
                            ? 'bg-[#080d2d] text-white cursor-default shadow-sm'
                            : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-white hover:text-slate-900'
                        } disabled:opacity-50`}
                      >
                        {st}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <MapPin className="size-3.5 text-[#EB008B]" />
                  Customer & Shipping Address
                </h4>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 sm:p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Customer Name</span>
                    <span className="font-black text-[#1A1A1A] text-xs sm:text-sm">
                      {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                    </span>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                      <Phone className="size-3" /> Phone
                    </span>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${selectedOrder.customer?.phone}`} className="font-bold text-slate-700 hover:text-[#EB008B] underline">
                        {selectedOrder.customer?.phone}
                      </a>
                      <a
                        href={`https://wa.me/91${selectedOrder.customer?.phone?.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(
                          selectedOrder.customer?.firstName || 'there'
                        )},%20regarding%20your%20Berry%20Perry%20Order%20%23${selectedOrder.orderNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-500/20"
                      >
                        <Send className="size-2.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                      <Mail className="size-3" /> Email
                    </span>
                    <a
                      href={`mailto:${selectedOrder.customer?.email}`}
                      className="font-bold text-slate-700 hover:text-[#EB008B] underline truncate max-w-full xs:max-w-[200px]"
                    >
                      {selectedOrder.customer?.email}
                    </a>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Delivery Address</span>
                    <p className="font-medium text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/70 text-[11px] sm:text-xs">
                      {selectedOrder.customer?.address}
                      <br />
                      {selectedOrder.customer?.city}, {selectedOrder.customer?.state} – {selectedOrder.customer?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                </div>

                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white text-xs gap-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-10 sm:size-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="size-10 sm:size-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <ShoppingBag className="size-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-[#1A1A1A] truncate">{item.name}</p>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                            {item.size ? `Size: ${item.size}` : ''}
                            {item.color ? ` • ${item.color}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="text-[11px] font-bold text-slate-500">
                          {item.quantity} × ₹{item.price?.toLocaleString()}
                        </p>
                        <p className="font-black text-[#1A1A1A] text-xs sm:text-sm">
                          ₹{((item.quantity || 1) * (item.price || 0)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Order Summary */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Payment & Cost Summary
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Payment Method</span>
                    <span className="font-bold text-slate-800 uppercase">
                      {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Payment Status</span>
                    <span className="font-bold text-slate-800 uppercase">
                      {selectedOrder.paymentStatus || (selectedOrder.paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700">₹{(selectedOrder.subtotal || selectedOrder.grandTotal || 0).toLocaleString()}</span>
                  </div>
                  {selectedOrder.shipping ? (
                    <div className="flex justify-between text-slate-500">
                      <span>Shipping</span>
                      <span className="font-semibold text-slate-700">₹{selectedOrder.shipping.toLocaleString()}</span>
                    </div>
                  ) : null}
                  {selectedOrder.codFee ? (
                    <div className="flex justify-between text-slate-500">
                      <span>COD Fee</span>
                      <span className="font-semibold text-slate-700">₹{selectedOrder.codFee.toLocaleString()}</span>
                    </div>
                  ) : null}
                  {selectedOrder.discount ? (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  ) : null}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm">
                    <span className="font-black uppercase text-[#1A1A1A]">Total Amount</span>
                    <span className="text-base sm:text-lg font-black text-[#1A1A1A]">
                      ₹{selectedOrder.grandTotal?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">Order #{selectedOrder.orderNumber}</span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-[#1A1A1A] px-4 sm:px-5 py-2 text-xs font-bold text-white transition hover:bg-[#EB008B] shadow-sm shrink-0"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* INTERACTIVE ORDER RETURN LIFECYCLE MODAL                    */}
      {/* ============================================================ */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-purple-700">
              <RotateCcw className="h-5 w-5" />
              <h3 className="text-base font-black uppercase tracking-tight text-[#080d2d]">
                Process Order Return #{returnModalOrder.orderNumber}
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Customer: <span className="font-bold text-slate-800">{returnModalOrder.customer?.firstName} {returnModalOrder.customer?.lastName}</span> ({returnModalOrder.customer?.city})
            </p>

            {/* Line items preview */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5 max-h-32 overflow-y-auto">
              <p className="text-[10px] font-black uppercase text-slate-400">Returned Items:</p>
              {returnModalOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between font-medium text-slate-800">
                  <span>{it.quantity}x {it.name} {it.size ? `(${it.size})` : ''}</span>
                  <span className="font-mono">₹{(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Decision: RESTOCK vs DEFECTIVE */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-bold text-slate-700">Inventory Disposition Decision:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReturnType('RESTOCK')}
                  className={`flex flex-col rounded-xl border p-3 text-left transition ${
                    returnType === 'RESTOCK'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-emerald-800 uppercase">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Restock to Inventory</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 leading-tight">
                    Good Condition / Resellable. Units incremented back to warehouse available stock.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setReturnType('DEFECTIVE')}
                  className={`flex flex-col rounded-xl border p-3 text-left transition ${
                    returnType === 'DEFECTIVE'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-amber-800 uppercase">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Shift to Defective Piece</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 leading-tight">
                    Damaged / Flawed piece. Units written off to Damaged &amp; Waste ledger; stock stays deducted.
                  </p>
                </button>
              </div>
            </div>

            {/* Return Reason Selector */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-bold text-slate-700">Return Reason</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-[#080d2d] focus:bg-white"
              >
                <option value="Customer size/fit mismatch">Customer size/fit mismatch</option>
                <option value="Damaged in transit / courier mishandling">Damaged in transit / courier mishandling</option>
                <option value="Manufacturing flaw / fabric tear">Manufacturing flaw / fabric tear</option>
                <option value="Customer returned defective unit">Customer returned defective unit</option>
                <option value="Wrong product or color delivered">Wrong product or color delivered</option>
                <option value="Customer changed mind / buyer remorse">Customer changed mind / buyer remorse</option>
              </select>
            </div>

            {/* Notes */}
            <div className="mt-3 space-y-1">
              <label className="text-xs font-bold text-slate-700">Inspection Notes</label>
              <input
                type="text"
                placeholder="e.g. Tags attached, original polybag intact"
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-900 outline-none focus:border-[#080d2d] focus:bg-white"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingReturn}
                onClick={handleProcessReturn}
                className="flex items-center gap-2 rounded-xl bg-[#080d2d] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-50"
              >
                {isSubmittingReturn ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                <span>Confirm {returnType === 'RESTOCK' ? 'Restock & Return' : 'Defective Write-Off'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* GST INVOICE & THERMAL SHIPPING SLIP PRINT MODAL             */}
      {/* ============================================================ */}
      {printModalOrder && (
        <PrintShippingInvoiceDialog
          order={printModalOrder}
          isOpen={Boolean(printModalOrder)}
          onClose={() => setPrintModalOrder(null)}
        />
      )}
    </div>
  )
}
