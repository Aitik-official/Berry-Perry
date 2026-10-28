'use client'

import { useMemo } from 'react'
import { firstCryCategoryHierarchy } from '@/lib/firstcry-categories'
import { Link as LinkIcon, ChevronDown } from 'lucide-react'

export interface CategoryLinkSelectorProps {
  value: string
  onChange: (newHref: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export function CategoryLinkSelector({
  value,
  onChange,
  label = 'Destination Category / Link',
  placeholder = 'Select destination category / link...',
  className = '',
}: CategoryLinkSelectorProps) {
  // Collect all predefined values to verify if current value is known
  const isCustomValue = useMemo(() => {
    if (!value) return false
    const standardValues = [
      '/products',
      '/products?badge=new',
      '/products?badge=bestseller',
      '/products?badge=sale',
      '/products?badge=hot',
      '/products?category=boys-fashion',
      '/products?category=girls-fashion',
      '/products?category=baby-kids-clothing&gender=boys',
      '/products?category=baby-kids-clothing&gender=girls',
      '/products?category=baby-kids-footwear&gender=boys',
      '/products?category=baby-kids-footwear&gender=girls',
      '/products?category=ladies-wear',
      '/products?category=ladies-tops-tees',
      '/products?category=ladies-dresses',
      '/products?category=ladies-activewear',
      '/products?priceMax=500',
      '/products?priceMax=1000',
      '/products?priceMax=2500',
      '/products?priceMax=5000',
      '/products?maxPrice=10',
      '/products?maxPrice=20',
      '/products?maxPrice=40',
      '/products?maxPrice=50',
      '/products?maxPrice=60',
      '/products?maxPrice=100',
      '/products?minPrice=100',
    ]

    if (standardValues.includes(value)) return false

    const matchesHierarchy = firstCryCategoryHierarchy.some(
      (cat) =>
        cat.internalHref === value ||
        cat.children.some((sub) => sub.internalHref === value)
    )

    return !matchesHierarchy
  }, [value])

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-xs font-semibold text-slate-800 shadow-xs outline-none transition focus:border-[#EB008B] focus:ring-1 focus:ring-[#EB008B] cursor-pointer hover:border-slate-400"
        >
          <option value="">{placeholder}</option>

          {/* If the current value is custom/legacy, dynamically show it as selected */}
          {isCustomValue && value && (
            <optgroup label="📌 Current Selection">
              <option value={value}>{value}</option>
            </optgroup>
          )}

          {/* General Preset Destinations */}
          <optgroup label="🌟 General Pages & Badges">
            <option value="/products">All Products Catalog (/products)</option>
            <option value="/products?badge=new">New Arrivals (/products?badge=new)</option>
            <option value="/products?badge=bestseller">Best Sellers (/products?badge=bestseller)</option>
            <option value="/products?badge=sale">On Sale (/products?badge=sale)</option>
            <option value="/products?badge=hot">Hot Trending (/products?badge=hot)</option>
          </optgroup>

          {/* Gender & Kids Fashion Specials */}
          <optgroup label="👦👧 Kids & Fashion Specials">
            <option value="/products?category=boys-fashion">Boys Fashion (/products?category=boys-fashion)</option>
            <option value="/products?category=girls-fashion">Girls Fashion (/products?category=girls-fashion)</option>
            <option value="/products?category=baby-kids-clothing&gender=boys">
              Boys Clothing (/products?category=baby-kids-clothing&gender=boys)
            </option>
            <option value="/products?category=baby-kids-clothing&gender=girls">
              Girls Clothing (/products?category=baby-kids-clothing&gender=girls)
            </option>
            <option value="/products?category=baby-kids-footwear&gender=boys">
              Boys Footwear (/products?category=baby-kids-footwear&gender=boys)
            </option>
            <option value="/products?category=baby-kids-footwear&gender=girls">
              Girls Footwear (/products?category=baby-kids-footwear&gender=girls)
            </option>
          </optgroup>

          {/* Ladies Wear Collections */}
          <optgroup label="👗 Ladies Wear Collections">
            <option value="/products?category=ladies-wear">All Ladies Wear (/products?category=ladies-wear)</option>
            <option value="/products?category=ladies-tops-tees">
              └ Tops & T-Shirts (/products?category=ladies-tops-tees)
            </option>
            <option value="/products?category=ladies-dresses">
              └ Dresses & Jumpsuits (/products?category=ladies-dresses)
            </option>
            <option value="/products?category=ladies-activewear">
              └ Activewear & Leggings (/products?category=ladies-activewear)
            </option>
          </optgroup>

          {/* Price Presets */}
          <optgroup label="💰 Shop By Price Brackets">
            <option value="/products?priceMax=500">Under ₹500</option>
            <option value="/products?priceMax=1000">Under ₹1,000</option>
            <option value="/products?priceMax=2500">Under ₹2,500</option>
            <option value="/products?priceMax=5000">Under ₹5,000</option>
            <option value="/products?maxPrice=10">Under $10</option>
            <option value="/products?maxPrice=20">Under $20</option>
            <option value="/products?maxPrice=40">Under $40</option>
            <option value="/products?maxPrice=50">Under $50</option>
            <option value="/products?maxPrice=60">Under $60</option>
            <option value="/products?maxPrice=100">Under $100</option>
            <option value="/products?minPrice=100">Over $100</option>
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

        {/* Dropdown Chevron Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
          <ChevronDown className="size-4" />
        </div>
      </div>

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
