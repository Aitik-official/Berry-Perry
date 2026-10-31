'use client'

import { useState } from 'react'
import {
  Package,
  Globe,
  Radio,
  Barcode,
  Scan,
  ClipboardList,
  Truck,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  Layers,
  Zap,
  Crown,
} from 'lucide-react'
import type { InventorySubTab } from './types'

export interface InventoryTopBarProps {
  activeSubTab: InventorySubTab
  onSelectSubTab: (tab: InventorySubTab) => void
  onOpenScanner: () => void
  totalProductsCount: number
  barcodesCount: number
}

export function InventoryTopBar({
  activeSubTab,
  onSelectSubTab,
  onOpenScanner,
  totalProductsCount,
  barcodesCount,
}: InventoryTopBarProps) {
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false)

  const navItems = [
    {
      id: 'adjust-stock' as InventorySubTab,
      label: 'Catalog',
      icon: Package,
      badge: totalProductsCount,
    },
    {
      id: 'marketplaces' as InventorySubTab,
      label: 'Channels',
      icon: Radio,
      badge: '2 live',
    },
    {
      id: 'barcodes' as InventorySubTab,
      label: 'Barcodes',
      icon: Barcode,
      badge: barcodesCount,
    },
    {
      id: 'scanner-trigger',
      label: 'POS Scan',
      icon: Scan,
      isAction: true,
      onClick: onOpenScanner,
    },
    {
      id: 'ledger' as InventorySubTab,
      label: 'Inventory',
      icon: ClipboardList,
    },
    {
      id: 'po' as InventorySubTab,
      label: 'Orders',
      icon: Truck,
    },
  ]

  const moreItems = [
    {
      id: 'waste' as InventorySubTab,
      label: 'Damaged & Waste (Scrap)',
      icon: AlertTriangle,
    },
    {
      id: 'returns' as InventorySubTab,
      label: 'Returns & Credit Notes',
      icon: RotateCcw,
    },
    {
      id: 'suppliers' as InventorySubTab,
      label: 'Suppliers & Vendors',
      icon: Layers,
    },
  ]

  const isMoreActive = ['waste', 'returns', 'suppliers'].includes(activeSubTab)

  return (
    <div className="rounded-2xl bg-[#080d2d] text-white shadow-xl border border-slate-800 overflow-visible relative z-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 py-3 gap-3">
        {/* Brand identity on left */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#EB008B] to-pink-500 shadow-md shadow-[#EB008B]/30">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black italic tracking-tighter text-white">
                  BERRY PERRY<span className="text-[#EB008B] text-xs">™</span>
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-pink-300 border border-white/15">
                  ERP Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                Unified Serialized Barcode &amp; Warehouse Inventory
              </p>
            </div>
          </div>

          {/* Quick scan trigger on mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 rounded-xl bg-[#5CB946] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md active:scale-95"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Scan</span>
            </button>
          </div>
        </div>

        {/* Center navigation links */}
        <div className="flex flex-wrap items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = !item.isAction && activeSubTab === item.id

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition text-slate-300 hover:text-white hover:bg-white/10"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIsMoreDropdownOpen(false)
                  onSelectSubTab(item.id as InventorySubTab)
                }}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition ${
                  isActive
                    ? 'bg-white/20 text-white shadow-inner border border-white/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#EB008B]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-black ${
                      isActive ? 'bg-[#EB008B] text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}

          {/* "... More" dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black transition ${
                isMoreActive
                  ? 'bg-white/20 text-white border border-white/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>More</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isMoreDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsMoreDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-[#0e163b] p-1.5 shadow-2xl z-40 text-left">
                  {moreItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSubTab === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setIsMoreDropdownOpen(false)
                          onSelectSubTab(item.id)
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                          isActive
                            ? 'bg-[#EB008B] text-white'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side quick action and role badge */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5CB946] to-emerald-500 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/40 hover:opacity-95 transition active:scale-95"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Quick Scan</span>
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 border border-white/10">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-200">Super Admin</span>
            <span className="rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase px-1.5 py-0.5">
              ERP
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

