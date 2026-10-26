'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronRight, Filter, RotateCcw, ShoppingBag, SlidersHorizontal, Star, Tag } from 'lucide-react'
import { genderOptions, type Product } from '@/lib/products-data'
import { defaultTaxonomyConfig, type StoreTaxonomyConfig } from '@/lib/store-taxonomy'

export function ProductsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [productsList, setProductsList] = useState<Product[]>([])
  const [taxonomyConfig, setTaxonomyConfig] = useState<StoreTaxonomyConfig>(defaultTaxonomyConfig)
  const [isLoading, setIsLoading] = useState(true)

  // Reactive state derived from searchParams so navbar links update the page immediately
  const paramGender = searchParams.get('gender') || 'all'
  const paramCategory = searchParams.get('category') || 'all'
  const paramSport = searchParams.get('sport') || 'all'
  const paramSearch = searchParams.get('search') || ''
  const paramBadge = searchParams.get('badge') || ''
  const paramOutlet = searchParams.get('outlet') === 'true'
  const paramStock = searchParams.get('stock') || 'all'
  const paramPriceMax = searchParams.get('priceMax') || ''
  const paramMinRating = searchParams.get('rating') || ''

  const [selectedGender, setSelectedGender] = useState<string>(paramGender)
  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory)
  const [selectedSport, setSelectedSport] = useState<string>(paramSport)
  const [search, setSearch] = useState<string>(paramSearch)
  const [selectedBadge, setSelectedBadge] = useState<string>(paramBadge)
  const [selectedOutlet, setSelectedOutlet] = useState<boolean>(paramOutlet)
  const [selectedStock, setSelectedStock] = useState<string>(paramStock)
  const [selectedPriceMax, setSelectedPriceMax] = useState<string>(paramPriceMax)
  const [selectedMinRating, setSelectedMinRating] = useState<string>(paramMinRating)
  const [sortBy, setSortBy] = useState<string>('featured')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [expandedMainCat, setExpandedMainCat] = useState<string | null>(null)

  // Whenever the URL changes (e.g. clicking navbar dropdown items), sync states immediately
  useEffect(() => {
    setSelectedGender(searchParams.get('gender') || 'all')
    setSelectedCategory(searchParams.get('category') || 'all')
    setSelectedSport(searchParams.get('sport') || 'all')
    setSearch(searchParams.get('search') || '')
    setSelectedBadge(searchParams.get('badge') || '')
    setSelectedOutlet(searchParams.get('outlet') === 'true')
    setSelectedStock(searchParams.get('stock') || 'all')
    setSelectedPriceMax(searchParams.get('priceMax') || '')
    setSelectedMinRating(searchParams.get('rating') || '')
  }, [searchParams])

  useEffect(() => {
    let isMounted = true

    // Fetch directly from database API for products
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.products && Array.isArray(data.products)) {
          setProductsList(data.products)
          try {
            localStorage.setItem('virat_admin_products_v1', JSON.stringify(data.products))
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    // Fetch store taxonomy dynamically
    fetch('/api/taxonomy')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.taxonomy) {
          setTaxonomyConfig(data.taxonomy)
        }
      })
      .catch(() => {})

    const sync = () => {
      try {
        const stored = localStorage.getItem('virat_admin_products_v1')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setProductsList(parsed)
          }
        }
      } catch {}
    }

    window.addEventListener('storage', sync)
    return () => {
      isMounted = false
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Helper to update URL query params when sidebar filters change
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all' || value === 'false') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    const queryString = params.toString()
    router.push(queryString ? `/products?${queryString}` : '/products')
  }

  const handleGenderChange = (val: string) => {
    setSelectedGender(val)
    updateQuery({ gender: val })
  }

  const handleSportChange = (val: string) => {
    setSelectedSport(val)
    updateQuery({ sport: val })
  }

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val)
    updateQuery({ category: val })
  }

  const handlePriceMaxChange = (val: string) => {
    setSelectedPriceMax(val)
    updateQuery({ priceMax: val ? val : null })
  }

  const handleRatingChange = (val: string) => {
    setSelectedMinRating(val)
    updateQuery({ rating: val ? val : null })
  }

  const handleSearchSubmit = (val: string) => {
    setSearch(val)
    updateQuery({ search: val.trim() ? val.trim() : null })
  }

  const handleStockChange = (val: string) => {
    setSelectedStock(val)
    updateQuery({ stock: val !== 'all' ? val : null })
  }

  const resetFilters = () => {
    setSelectedGender('all')
    setSelectedCategory('all')
    setSelectedSport('all')
    setSearch('')
    setSelectedBadge('')
    setSelectedOutlet(false)
    setSelectedStock('all')
    setSelectedPriceMax('')
    setSelectedMinRating('')
    setSortBy('featured')
    router.push('/products')
  }

  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        // Stock status filter
        if (selectedStock === 'in_stock' && !product.inStock) {
          return false
        }
        if (selectedStock === 'out_of_stock' && product.inStock) {
          return false
        }
        // Gender filter
        if (selectedGender !== 'all') {
          const productGender = (product.gender || '').toLowerCase()
          const filterGender = selectedGender.toLowerCase()
          if (productGender !== filterGender && productGender !== 'unisex') {
            return false
          }
        }

        // Category filter (support category, subCategory, or mainCategory match with slug normalization)
        if (selectedCategory !== 'all') {
          const cat = selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const pCat = (product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const pSubCat = (product.subCategory || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const pMainCat = (product.mainCategory || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const matchesCategory =
            pCat === cat ||
            pSubCat === cat ||
            pMainCat === cat ||
            pCat.includes(cat) ||
            pSubCat.includes(cat) ||
            pMainCat.includes(cat)
          if (!matchesCategory) {
            return false
          }
        }

        // Sport filter (seamlessly match if sport is assigned as sport, category, subCategory, or mainCategory)
        if (selectedSport !== 'all') {
          const sp = selectedSport.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const pSport = (product.sport || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const pCat = (product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const pSubCat = (product.subCategory || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const pMainCat = (product.mainCategory || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const matchesSport =
            pSport === sp ||
            pCat === sp ||
            pSubCat === sp ||
            pMainCat === sp ||
            pSport.includes(sp)
          if (!matchesSport) {
            return false
          }
        }

        // Price Max filter
        if (selectedPriceMax) {
          const max = parseFloat(selectedPriceMax)
          if (!isNaN(max) && product.price > max) {
            return false
          }
        }

        // Minimum Rating filter
        if (selectedMinRating) {
          const minR = parseFloat(selectedMinRating)
          if (!isNaN(minR) && (product.rating || 0) < minR) {
            return false
          }
        }

        // Badge filter (e.g. badge=new, badge=bestseller, badge=pro)
        if (selectedBadge) {
          const badgeLower = selectedBadge.toLowerCase()
          const pBadge = (product.badge || '').toLowerCase()
          if (!pBadge.includes(badgeLower)) {
            return false
          }
        }

        // Outlet filter (discounted products with originalPrice > price)
        if (selectedOutlet) {
          if (!product.originalPrice || product.originalPrice <= product.price) {
            return false
          }
        }

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase()
          const matchName = product.name.toLowerCase().includes(q)
          const matchDesc = (product.description || '').toLowerCase().includes(q)
          const matchCat = (product.category || '').toLowerCase().includes(q)
          const matchSubCat = (product.subCategory || '').toLowerCase().includes(q)
          const matchSport = (product.sport || '').toLowerCase().includes(q)
          if (!matchName && !matchDesc && !matchCat && !matchSubCat && !matchSport) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)

        // Featured default: prioritize baby clothing, footwear, toys, and nursery over diapers
        const isDiaper = (p: Product) => {
          const cat = (p.category || '').toLowerCase()
          const subCat = (p.subCategory || '').toLowerCase()
          const mainCat = (p.mainCategory || '').toLowerCase()
          const name = (p.name || '').toLowerCase()
          return (
            cat.includes('diaper') ||
            subCat.includes('diaper') ||
            mainCat.includes('diaper') ||
            name.includes('diaper') ||
            name.includes('pants extra absorb') ||
            name.includes('wonder pants')
          )
        }

        const aIsDiaper = isDiaper(a)
        const bIsDiaper = isDiaper(b)
        if (aIsDiaper && !bIsDiaper) return 1
        if (!aIsDiaper && bIsDiaper) return -1
        return 0
      })
  }, [productsList, selectedGender, selectedCategory, selectedSport, selectedBadge, selectedOutlet, selectedStock, selectedPriceMax, selectedMinRating, search, sortBy])

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-12">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Link href="/" className="hover:text-[#1A1A1A]">Home</Link>
            <span>/</span>
            <Link href="/products" className="text-[#EB008B] hover:underline">Products</Link>
            {selectedGender !== 'all' && (
              <>
                <span>/</span>
                <span className="text-[#1A1A1A] uppercase">{selectedGender}</span>
              </>
            )}
            {selectedSport !== 'all' && (
              <>
                <span>/</span>
                <span className="text-[#1A1A1A] uppercase">{selectedSport}</span>
              </>
            )}
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-[#1A1A1A] uppercase">{selectedCategory.replace(/-/g, ' ')}</span>
              </>
            )}
            {selectedBadge && (
              <>
                <span>/</span>
                <span className="text-[#EB008B] uppercase font-bold">{selectedBadge}</span>
              </>
            )}
            {selectedOutlet && (
              <>
                <span>/</span>
                <span className="text-[#EB008B] uppercase font-bold">Outlet</span>
              </>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#1A1A1A] sm:text-3xl">
            {selectedBadge
              ? `${selectedBadge.toUpperCase()} COLLECTION`
              : selectedOutlet
              ? 'OUTLET & CLEARANCE'
              : selectedCategory !== 'all'
              ? `${selectedCategory.replace(/-/g, ' ')}`
              : selectedSport !== 'all'
              ? `${selectedSport} Collection`
              : selectedGender !== 'all'
              ? `${selectedGender}’s Collection`
              : 'All Products'}
            {!isLoading && (
              <span className="ml-2.5 text-base font-bold text-[#EB008B]">({filteredProducts.length})</span>
            )}
          </h1>
        </div>

        {/* Top Controls: Search + Sort + Mobile Filter Button */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Filter by keyword..."
            value={search}
            onChange={(e) => handleSearchSubmit(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] outline-none focus:border-[#EB008B]"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold uppercase text-[#1A1A1A] outline-none focus:border-[#EB008B]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold uppercase text-[#1A1A1A] hover:border-[#1A1A1A] md:hidden"
          >
            <Filter className="size-3.5 text-[#EB008B]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden space-y-6 md:block sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#1A1A1A]">
              <SlidersHorizontal className="size-4 text-[#EB008B]" />
              Filters
            </h2>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#EB008B]"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">Gender</h3>
            <div className="flex flex-col gap-1.5">
              {genderOptions.map((g) => (
                <label
                  key={g.value}
                  className="flex cursor-pointer items-center gap-2.5 text-xs font-bold capitalize text-slate-600 transition-colors hover:text-[#1A1A1A]"
                >
                  <input
                    type="radio"
                    name="gender"
                    checked={selectedGender === g.value}
                    onChange={() => handleGenderChange(g.value)}
                    className="accent-[#EB008B]"
                  />
                  <span>{g.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability / Stock Status Filter */}
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">Availability</h3>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'All Items', value: 'all' },
                { label: 'In Stock Only', value: 'in_stock' },
                { label: 'Out of Stock', value: 'out_of_stock' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-slate-600 transition-colors hover:text-[#1A1A1A]"
                >
                  <input
                    type="radio"
                    name="stock"
                    checked={selectedStock === opt.value}
                    onChange={() => handleStockChange(opt.value)}
                    className="accent-[#EB008B]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Deals & Offers Filter */}
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">Deals &amp; Offers</h3>
            <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-slate-700 transition-colors hover:text-[#EB008B]">
              <input
                type="checkbox"
                checked={selectedOutlet}
                onChange={(e) => {
                  setSelectedOutlet(e.target.checked)
                  updateQuery({ outlet: e.target.checked ? 'true' : null })
                }}
                className="size-4 accent-[#EB008B] rounded"
              />
              <span className="flex items-center gap-1.5">
                <span>On Sale / Outlet</span>
                <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-black text-[#EB008B]">SALE</span>
              </span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">Price Range</h3>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'All Prices', value: '' },
                { label: 'Under ₹500', value: '500' },
                { label: 'Under ₹1,000', value: '1000' },
                { label: 'Under ₹2,500', value: '2500' },
                { label: 'Under ₹5,000', value: '5000' },
              ].map((pOpt) => (
                <label
                  key={pOpt.value}
                  className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-slate-600 transition-colors hover:text-[#1A1A1A]"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceMax === pOpt.value}
                    onChange={() => handlePriceMaxChange(pOpt.value)}
                    className="accent-[#EB008B]"
                  />
                  <span>{pOpt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">Customer Rating</h3>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'All Ratings', value: '' },
                { label: '4.5★ & Above', value: '4.5' },
                { label: '4.0★ & Above', value: '4.0' },
              ].map((rOpt) => (
                <label
                  key={rOpt.value}
                  className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-slate-600 transition-colors hover:text-[#1A1A1A]"
                >
                  <input
                    type="radio"
                    name="customerRating"
                    checked={selectedMinRating === rOpt.value}
                    onChange={() => handleRatingChange(rOpt.value)}
                    className="accent-[#EB008B]"
                  />
                  <span className="flex items-center gap-1">
                    {rOpt.value && <Star className="size-3 fill-amber-400 text-amber-400 inline" />}
                    <span>{rOpt.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories Accordion / Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">Categories</h3>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  className="text-[10px] font-bold text-[#EB008B] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#EB008B]/10 text-[#EB008B]'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'all'}
                  onChange={() => handleCategoryChange('all')}
                  className="accent-[#EB008B]"
                />
                <span>All Categories</span>
              </label>

              {(taxonomyConfig.mainCategories || []).map((mainCat) => {
                const subCats = (taxonomyConfig.categories || []).filter(
                  (sc) => sc.parentCategory === mainCat.value
                )
                const isSelected = selectedCategory === mainCat.value
                const isExpanded = expandedMainCat === mainCat.value || isSelected || subCats.some(s => s.value === selectedCategory)

                return (
                  <div key={mainCat.value} className="rounded-md border border-slate-100">
                    <div
                      className={`flex items-center justify-between px-2 py-1.5 transition-colors ${
                        isSelected ? 'bg-[#EB008B]/10 text-[#EB008B]' : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(mainCat.value)}
                        className="flex-1 text-left text-xs font-black uppercase tracking-tight"
                      >
                        {mainCat.label}
                      </button>
                      {subCats.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedMainCat(isExpanded ? null : mainCat.value)
                          }}
                          className="p-1 text-slate-400 hover:text-[#1A1A1A]"
                          aria-label={`Toggle ${mainCat.label}`}
                        >
                          {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                        </button>
                      )}
                    </div>

                    {/* Subcategories list */}
                    {isExpanded && subCats.length > 0 && (
                      <div className="space-y-1 bg-slate-50/70 p-2 pl-3 border-t border-slate-100">
                        {subCats.map((sub) => {
                          const isSubSelected = selectedCategory === sub.value
                          return (
                            <label
                              key={sub.value}
                              className={`flex cursor-pointer items-center gap-2 text-[11px] font-semibold transition-colors ${
                                isSubSelected ? 'text-[#EB008B] font-bold' : 'text-slate-600 hover:text-[#1A1A1A]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="category"
                                checked={isSubSelected}
                                onChange={() => handleCategoryChange(sub.value)}
                                className="accent-[#EB008B]"
                              />
                              <span>{sub.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer Modal */}
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm md:hidden">
            <div className="ml-auto flex size-full max-w-xs flex-col bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-sm font-black uppercase text-[#1A1A1A]">Filter Products</span>
                <button onClick={() => setFilterDrawerOpen(false)} aria-label="Close filters">
                  <RotateCcw className="size-4" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto py-4">
                {/* Availability / Stock */}
                <div className="border-b border-slate-100 pb-3">
                  <p className="text-xs font-black uppercase text-[#1A1A1A]">Availability</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {[
                      { label: 'All Items', value: 'all' },
                      { label: 'In Stock Only', value: 'in_stock' },
                      { label: 'Out of Stock', value: 'out_of_stock' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="mobile-stock"
                          checked={selectedStock === opt.value}
                          onChange={() => handleStockChange(opt.value)}
                          className="accent-[#EB008B]"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="border-b border-slate-100 pb-3">
                  <p className="text-xs font-black uppercase text-[#1A1A1A]">Price Range</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {[
                      { label: 'All Prices', value: '' },
                      { label: 'Under ₹500', value: '500' },
                      { label: 'Under ₹1,000', value: '1000' },
                      { label: 'Under ₹2,500', value: '2500' },
                    ].map((pOpt) => (
                      <label key={pOpt.value} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="mobile-price"
                          checked={selectedPriceMax === pOpt.value}
                          onChange={() => handlePriceMaxChange(pOpt.value)}
                          className="accent-[#EB008B]"
                        />
                        {pOpt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-xs font-black uppercase text-[#1A1A1A]">Category</p>
                  <div className="mt-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <input
                        type="radio"
                        name="mobile-category"
                        checked={selectedCategory === 'all'}
                        onChange={() => handleCategoryChange('all')}
                        className="accent-[#EB008B]"
                      />
                      All Categories
                    </label>
                    {(taxonomyConfig.mainCategories || []).map((c) => (
                      <label key={c.value} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="mobile-category"
                          checked={selectedCategory === c.value}
                          onChange={() => handleCategoryChange(c.value)}
                          className="accent-[#EB008B]"
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-full rounded-xl bg-[#EB008B] py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-[#EB008B]/20 transition hover:bg-[#d4007d]"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <main>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
              <p className="text-lg font-black uppercase text-[#1A1A1A]">No products found</p>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
              <button
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-[#EB008B] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#EB008B]/20 transition hover:bg-[#d4007d]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs p-3.5 animate-card-shimmer">
      {/* Blank image stage with soft gradient pulse */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center">
        <div className="size-11 rounded-full bg-white/80 shadow-xs flex items-center justify-center animate-pulse">
          <ShoppingBag className="size-5 text-[#EB008B]/40" />
        </div>
      </div>

      {/* Info placeholder lines */}
      <div className="flex flex-1 flex-col pt-3.5 pb-1">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3 w-12 rounded-full bg-slate-200 animate-pulse" />
        </div>
        <div className="mt-3 h-4 w-4/5 rounded-md bg-slate-200 animate-pulse" />
        <div className="mt-2 h-3 w-full rounded-md bg-slate-100 animate-pulse" />
        <div className="mt-1.5 h-3 w-2/3 rounded-md bg-slate-100 animate-pulse" />

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="h-5 w-20 rounded-md bg-slate-200 animate-pulse" />
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-slate-200 animate-pulse" />
            <div className="size-3 rounded-full bg-slate-200 animate-pulse" />
            <div className="size-3 rounded-full bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#EB008B] hover:shadow-xl hover:shadow-[#EB008B]/10"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#f9fafb] to-[#f1f3f6]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105 ${
              !product.inStock ? 'grayscale opacity-75' : ''
            }`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <ShoppingBag className="w-10 h-10 mb-1 opacity-50" />
            <span className="text-[10px] uppercase font-bold text-slate-400">No Image</span>
          </div>
        )}

        {/* Badges: Out of Stock or Promotional */}
        {!product.inStock ? (
          <span className="absolute left-3 top-3 rounded-md bg-[#1A1A1A] border border-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            Out of Stock
          </span>
        ) : product.badge ? (
          <span className="absolute left-3 top-3 rounded-md bg-[#EB008B] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
            {product.badge}
          </span>
        ) : null}

        {/* Quick View Tag on hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center rounded-lg bg-[#EB008B]/95 py-2 text-xs font-black uppercase tracking-wider text-white opacity-0 backdrop-blur-sm shadow-md transition-opacity duration-300 group-hover:opacity-100">
          {product.inStock ? 'View Product Details' : 'View (Out of Stock)'}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#5CB946]">
          <span>{product.sport}</span>
          <span className="flex items-center gap-1 text-slate-700">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-1 text-sm font-black uppercase text-[#1A1A1A] transition-colors group-hover:text-[#EB008B]">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
          {product.description}
        </p>

        {/* Price & Colors */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="size-3 rounded-full border border-slate-300"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
