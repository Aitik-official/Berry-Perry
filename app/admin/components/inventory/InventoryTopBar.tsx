'use client'

import { useState } from 'react'
import {
  Package,
  Radio,
  Barcode,
  Scan,
  ClipboardList,
  Truck,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  Layers,
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
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-1.5 sm:p-2 overflow-visible relative z-20">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = !item.isAction && activeSubTab === item.id

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-600" />
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
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
                isActive
                  ? 'bg-[#080d2d] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#080d2d] hover:bg-slate-100'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-black ${
                    isActive ? 'bg-[#EB008B] text-white' : 'bg-slate-100 text-slate-600'
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
            className={`flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
              isMoreActive
                ? 'bg-[#080d2d] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#080d2d] hover:bg-slate-100'
            }`}
          >
            <span>More</span>
            <ChevronDown className={`h-3.5 w-3.5 ${isMoreActive ? 'text-white' : 'text-slate-400'}`} />
          </button>

          {isMoreDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsMoreDropdownOpen(false)}
              />
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-40 text-left">
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
                          ? 'bg-[#080d2d] text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#080d2d]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
