'use client'

import { useState } from 'react'
import { firstCryCategoryHierarchy } from '@/lib/firstcry-categories'
import { Link as LinkIcon, Edit3 } from 'lucide-react'

export interface CategoryLinkSelectorProps {
  value: string
  onChange: (newHref: string) => void
  label?: string
  placeholder?: string
  className?: string
}

const KNOWN_PRESETS = [
  '/products',
  '/products?badge=new',
  '/products?badge=sale',
  '/products?badge=bestseller',
  '/products?maxPrice=10',
  '/products?maxPrice=20',
  '/products?maxPrice=40',
  '/products?maxPrice=50',
  '/products?maxPrice=60',
  '/products?maxPrice=100',
  '/products?minPrice=100',
  '/products?category=baby-kids-clothing&gender=boys',
  '/products?category=baby-kids-clothing&gender=girls',
]

function isKnownCategoryUrl(url: string): boolean {
  if (!url) return true
  if (KNOWN_PRESETS.includes(url)) return true
  return firstCryCategoryHierarchy.some(
    (cat) =>
      cat.internalHref === url ||
      cat.children.some((sub) => sub.internalHref === url)
  )
}

export function CategoryLinkSelector({
  value,
  onChange,
  label = 'Target Category Link',
  placeholder = 'Select destination category...',
  className = '',
}: CategoryLinkSelectorProps) {
  // Only show custom text input if user explicitly clicked 'Custom URL',
  // OR if the URL is truly a custom external/special URL that isn't one of our known presets or categories.
  const known = isKnownCategoryUrl(value)
  const [forceCustom, setForceCustom] = useState(false)
  const isInputMode = forceCustom || (!known && Boolean(value))

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setForceCustom(!isInputMode)}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EB008B] hover:underline"
          title="Toggle custom URL input"
        >
          <Edit3 className="size-2.5" />
          <span>{isInputMode ? 'Use Dropdown' : 'Custom URL'}</span>
        </button>
      </div>

      {isInputMode ? (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/products?category=..."
            className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#EB008B]"
          />
        </div>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded border border-slate-300 bg-white px-2.5 py-1.5 pr-8 text-xs font-semibold text-slate-800 outline-none focus:border-[#EB008B] cursor-pointer"
          >
            <option value="">{placeholder}</option>

            {/* General Preset Destinations */}
            <optgroup label="🌟 General Pages">
              <option value="/products">All Products Catalog (/products)</option>
              <option value="/products?badge=new">New Arrivals (/products?badge=new)</option>
              <option value="/products?badge=sale">On Sale (/products?badge=sale)</option>
              <option value="/products?badge=bestseller">Best Sellers (/products?badge=bestseller)</option>
            </optgroup>

            {/* Price Presets */}
            <optgroup label="💰 Shop By Price Brackets">
              <option value="/products?maxPrice=10">Under $10</option>
              <option value="/products?maxPrice=20">Under $20</option>
              <option value="/products?maxPrice=40">Under $40</option>
              <option value="/products?maxPrice=50">Under $50</option>
              <option value="/products?maxPrice=60">Under $60</option>
              <option value="/products?maxPrice=100">Under $100</option>
              <option value="/products?minPrice=100">Over $100</option>
            </optgroup>

            {/* Gender Brackets */}
            <optgroup label="👦👧 Gender Brackets">
              <option value="/products?category=baby-kids-clothing&gender=boys">
                For Boys Clothing
              </option>
              <option value="/products?category=baby-kids-clothing&gender=girls">
                For Girls Clothing
              </option>
            </optgroup>

            {/* Main & Sub Categories from FirstCry Hierarchy */}
            {firstCryCategoryHierarchy.map((cat) => (
              <optgroup key={cat.id} label={`📁 ${cat.name}`}>
                <option value={cat.internalHref}>All {cat.name}</option>
                {cat.children.map((sub) => (
                  <option key={sub.id} value={sub.internalHref}>
                    └ {sub.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Custom Select Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Helper text showing selected path */}
      {value && (
        <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate" title={value}>
          <LinkIcon className="size-2.5 shrink-0" />
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  )
}
