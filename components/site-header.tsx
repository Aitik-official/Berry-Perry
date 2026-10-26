'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import {
  getStoredTaxonomyConfig,
  type SiteAnnouncement,
  type StoreTaxonomyConfig,
  type MainCategoryItem,
  defaultTaxonomyConfig,
} from '@/lib/store-taxonomy'
import { getActiveSiteAssets } from '@/lib/site-assets'

export function SiteHeader() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalCount } = useCart()
  const [taxonomyConfig, setTaxonomyConfig] = useState<StoreTaxonomyConfig>(defaultTaxonomyConfig)
  const [logoSrc, setLogoSrc] = useState<string>('/images/berryperry_logo.png')
  const [announcement, setAnnouncement] = useState<SiteAnnouncement | null>(null)
  const [desktopAnnouncementIndex, setDesktopAnnouncementIndex] = useState(0)

  // Derive list of announcements
  const announcementItems =
    announcement?.items && announcement.items.length > 0
      ? announcement.items
      : announcement?.text
      ? [{ text: announcement.text, linkText: announcement.linkText, linkHref: announcement.linkHref }]
      : []

  // Auto-slide on desktop/tablet every 4.5 seconds
  useEffect(() => {
    if (announcementItems.length <= 1) return
    const timer = setInterval(() => {
      setDesktopAnnouncementIndex((prev) => (prev + 1) % announcementItems.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [announcementItems.length])

  // Reset indices if out of bounds
  useEffect(() => {
    if (desktopAnnouncementIndex >= announcementItems.length && announcementItems.length > 0) {
      setDesktopAnnouncementIndex(0)
    }
  }, [announcementItems.length, desktopAnnouncementIndex])

  useEffect(() => {
    // Initial read
    const conf = getStoredTaxonomyConfig()
    setTaxonomyConfig(conf)
    if (conf?.announcement) setAnnouncement(conf.announcement)
    const initialAssets = getActiveSiteAssets()
    if (initialAssets?.logo) setLogoSrc(initialAssets.logo)

    // Listen to changes from Admin
    const handleStorageChange = () => {
      const updatedConf = getStoredTaxonomyConfig()
      setTaxonomyConfig(updatedConf)
      if (updatedConf?.announcement) setAnnouncement(updatedConf.announcement)
      const freshAssets = getActiveSiteAssets()
      if (freshAssets?.logo) setLogoSrc(freshAssets.logo)
    }
    window.addEventListener('storage', handleStorageChange)

    // Also fetch latest media assets from DB
    import('@/lib/site-assets').then(({ fetchSiteAssetsAsync }) => {
      fetchSiteAssetsAsync().then((assets) => {
        if (assets?.logo) setLogoSrc(assets.logo)
      }).catch(() => {})
    })

    // Also fetch latest from API in background
    fetch('/api/taxonomy')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.taxonomy) {
          const apiAnnouncement = data.taxonomy.announcement || {}
          const merged: StoreTaxonomyConfig = {
            ...defaultTaxonomyConfig,
            ...data.taxonomy,
            mainCategories: data.taxonomy.mainCategories?.length
              ? data.taxonomy.mainCategories
              : defaultTaxonomyConfig.mainCategories,
            categories: data.taxonomy.categories?.length
              ? data.taxonomy.categories
              : defaultTaxonomyConfig.categories,
            announcement: {
              ...defaultTaxonomyConfig.announcement,
              ...apiAnnouncement,
              items:
                Array.isArray(apiAnnouncement.items) && apiAnnouncement.items.length > 0
                  ? apiAnnouncement.items
                  : apiAnnouncement.text
                  ? [
                      {
                        text: apiAnnouncement.text,
                        linkText: apiAnnouncement.linkText,
                        linkHref: apiAnnouncement.linkHref,
                      },
                    ]
                  : defaultTaxonomyConfig.announcement.items,
            },
          }
          setTaxonomyConfig(merged)
          if (merged.announcement) setAnnouncement(merged.announcement)
        }
      })
      .catch(() => {})

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Build dynamic navigation items
  interface NavItem {
    name: string
    href: string
    hasDropdown: boolean
    value?: string
    isMegaCatalog?: boolean
    isAccent?: boolean
  }

  // Dynamic Main Categories from Admin Taxonomy:
  // 1. Honor showOnNavbar flag: users can select which categories appear directly on the navbar
  // 2. Fall back to first 4 categories if no showOnNavbar is flagged
  const allMainCats = taxonomyConfig.mainCategories || []
  const explicitNavbarCats = allMainCats.filter((mc) => mc.showOnNavbar === true)
  const navbarCats = explicitNavbarCats.length > 0 ? explicitNavbarCats : allMainCats.slice(0, 4)
  const otherCatsForMegaMenu = allMainCats.filter((mc) => !navbarCats.some((nc) => nc.id === mc.id))

  // Helper to resolve display label on navbar:
  // 1. Uses explicit custom navAlias (nickname) if set in Admin!
  // 2. Otherwise uses category label or intelligent concise fallback
  const getNavLabel = (mc: MainCategoryItem) => {
    if (mc.navAlias && mc.navAlias.trim()) {
      return mc.navAlias.trim().toUpperCase()
    }
    const l = mc.label.trim()
    if (/diaper/i.test(l)) return 'DIAPERING'
    if (/feeding/i.test(l)) return 'FEEDING'
    if (/bath/i.test(l)) return 'BATH & SKIN'
    if (/health/i.test(l)) return 'HEALTH & SAFETY'
    if (/toy/i.test(l)) return 'TOYS & GAMING'
    if (/cloth/i.test(l)) return 'CLOTHING'
    if (/footwear/i.test(l)) return 'FOOTWEAR'
    if (/maternity/i.test(l)) return 'MOMS'
    if (/gear/i.test(l)) return 'BABY GEAR'
    return l.replace(/\s+products$/i, '').toUpperCase()
  }

  const dynamicNavItems: NavItem[] = [
    { name: 'SHOP ALL', href: '/products', hasDropdown: false },
    ...navbarCats.map((mc) => ({
      name: getNavLabel(mc),
      value: mc.value,
      href: `/products?category=${mc.value.toLowerCase()}`,
      hasDropdown: true,
      isMegaCatalog: false,
    })),
    {
      name: 'ALL CATEGORIES',
      href: '/products',
      hasDropdown: true,
      isMegaCatalog: true,
      isAccent: true,
    },
    { name: 'ABOUT', href: '/about', hasDropdown: false },
  ]

  // Resolve mega-menu content dynamically for either individual categories OR the unified All Categories mega menu
  const getMegaDataForActiveMenu = (menuName: string) => {
    // 1. Unified "ALL CATEGORIES" Mega Menu
    if (menuName === 'ALL CATEGORIES') {
      const catsToDisplay =
        otherCatsForMegaMenu.length > 0 ? otherCatsForMegaMenu : allMainCats

      return {
        isAllCategoriesMega: true,
        label: 'ALL CATEGORIES',
        exploreTitle: 'COMPLETE CATALOG',
        exploreHref: '/products',
        watermarkText: 'BERRY PERRY',
        categoriesList: catsToDisplay.map((cat) => {
          const subCats = (taxonomyConfig.categories || [])
            .filter((c) => c.parentCategory === cat.value)
            .slice(0, 5)
          return {
            title: cat.label.toUpperCase(),
            href: `/products?category=${cat.value}`,
            subItems: subCats.map((s) => ({
              label: s.label,
              href: `/products?category=${s.value}`,
            })),
          }
        }),
      }
    }

    // 2. Individual Category Dropdown
    const mainCat = allMainCats.find(
      (m) =>
        m.label.toUpperCase() === menuName ||
        m.value.toUpperCase() === menuName ||
        (m.navAlias && m.navAlias.trim().toUpperCase() === menuName) ||
        getNavLabel(m) === menuName
    )
    if (!mainCat) return null

    // Fetch all sub-categories assigned to this category
    const subCats = (taxonomyConfig.categories || []).filter(
      (c) => c.parentCategory === mainCat.value
    )

    const allItems = subCats.map((sc) => ({
      label: sc.label.toUpperCase(),
      href: `/products?category=${sc.value}`,
    }))

    if (allItems.length === 0) {
      allItems.push(
        { label: 'ALL ITEMS', href: `/products?category=${mainCat.value}` },
        { label: 'NEW ARRIVALS', href: `/products?category=${mainCat.value}&badge=new` }
      )
    }

    // Split sub-categories evenly across 3 or 4 columns
    const colCount = allItems.length > 12 ? 4 : allItems.length > 6 ? 3 : 2
    const perCol = Math.ceil(allItems.length / colCount)
    const columns = []

    for (let c = 0; c < colCount; c++) {
      const slice = allItems.slice(c * perCol, (c + 1) * perCol)
      if (slice.length > 0) {
        columns.push({
          title:
            c === 0
              ? `${mainCat.label.toUpperCase()} POPULAR`
              : c === 1
              ? 'FEATURED STYLES'
              : c === 2
              ? 'ESSENTIALS'
              : 'EXPLORE MORE',
          items: slice,
        })
      }
    }

    return {
      isAllCategoriesMega: false,
      label: mainCat.label.toUpperCase(),
      exploreTitle: mainCat.label.toUpperCase(),
      exploreHref: `/products?category=${mainCat.value}`,
      watermarkText: mainCat.label.toUpperCase(),
      columns,
    }
  }

  const currentMegaData = activeMenu ? getMegaDataForActiveMenu(activeMenu) : null

  return (
    <>
      {/* AVONE STYLE TOP BAR: Slimmer Vibrant Pink with Scalloped Wavy Edge */}
      <div className="relative z-50 bg-[#ff6b9d] text-white select-none">
        <div className="mx-auto flex h-7 sm:h-8 max-w-[1440px] items-center justify-center px-3 sm:px-4 text-center">
          {announcementItems.length > 0 ? (
            <Link
              href={announcementItems[desktopAnnouncementIndex]?.linkHref || '/products?badge=new'}
              className="group inline-flex items-center gap-1.5 text-[10px] sm:text-[11.5px] font-semibold tracking-wide text-white hover:underline truncate max-w-[95vw]"
            >
              <span className="truncate">{announcementItems[desktopAnnouncementIndex]?.text}</span>
              {announcementItems[desktopAnnouncementIndex]?.linkText && (
                <span className="shrink-0 font-bold underline ml-1">
                  {announcementItems[desktopAnnouncementIndex]?.linkText}
                </span>
              )}
            </Link>
          ) : (
            <Link
              href="/products?badge=new"
              className="group inline-flex items-center gap-1.5 text-[10px] sm:text-[11.5px] font-semibold tracking-wide text-white hover:underline truncate max-w-[95vw]"
            >
              <span className="truncate">👶 Free All-India Shipping on Orders Over ₹999 • Use Code &quot;BERRY10&quot;</span>
              <span className="text-xs transition-transform group-hover:scale-125 shrink-0">🎉</span>
            </Link>
          )}
        </div>

        {/* Scalloped Wavy Bottom Border */}
        <div
          className="absolute -bottom-[5px] left-0 w-full h-[5px] pointer-events-none z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 8' preserveAspectRatio='none'%3E%3Cpath d='M0,0 L24,0 C20,0 20,8 16,8 C12,8 12,0 8,0 C4,0 4,8 0,8 Z' fill='%23ff6b9d'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '16px 5px',
          }}
        />
      </div>

      <header
        className="sticky top-0 z-40 border-b border-[#f0ece1] bg-[#fbf9f4] shadow-xs transition-all pt-0.5"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="mx-auto flex h-22 sm:h-24 md:h-28 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-12">
          {/* Left: Brand Logo / Text */}
          <Link href="/" className="relative flex items-center shrink-0 py-1.5" aria-label="Berry Perry home">
            <Image
              src={logoSrc || '/images/berryperry_logo.png'}
              alt="Berry Perry"
              width={320}
              height={120}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-200 hover:scale-105"
              priority
            />
          </Link>

          {/* Center: Desktop Navigation with Exactly 4 Categories + All Categories Mega Menu */}
          <nav className="hidden items-center gap-4 lg:flex xl:gap-6 2xl:gap-7" aria-label="Primary navigation">
            {dynamicNavItems.map((item) => {
              const isMenuOpen = activeMenu === item.name
              const isAccent = item.isAccent

              return (
                <div
                  key={item.name}
                  className="relative py-7"
                  onMouseEnter={() => {
                    if (item.hasDropdown) setActiveMenu(item.name)
                    else setActiveMenu(null)
                  }}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-1.5 text-[12.5px] font-extrabold uppercase tracking-wider transition-colors ${
                      isMenuOpen
                        ? 'text-[#ff6b9d]'
                        : isAccent
                        ? 'text-[#EB008B] hover:text-[#ff6b9d]'
                        : 'text-[#1A1A1A] hover:text-[#ff6b9d]'
                    }`}
                  >
                    {isAccent && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-[#EB008B] text-white">
                        <Menu className="size-2.5" />
                      </span>
                    )}

                    <span>{item.name}</span>

                    {/* Accent pill for All Categories */}
                    {isAccent && (
                      <span className="rounded-full bg-[#5CB946] px-1.5 py-0.2 text-[8px] font-black uppercase text-white shadow-xs">
                        MORE
                      </span>
                    )}

                    {item.hasDropdown && (
                      <ChevronDown
                        className={`size-3 text-[#777] transition-transform duration-200 ${
                          isMenuOpen ? 'rotate-180 text-[#ff6b9d]' : ''
                        }`}
                      />
                    )}

                    {/* Active bottom underline indicator */}
                    {isMenuOpen && (
                      <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#ff6b9d]" />
                    )}
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Right Action Icons: Search + User + Wishlist + Cart */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="fixed inset-x-0 top-0 z-50 flex items-center gap-2 bg-[#fbf9f4] px-4 py-3 shadow-md sm:static sm:z-auto sm:p-0 sm:shadow-none">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (searchQuery.trim()) {
                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
                        setSearchOpen(false)
                      }
                    }}
                    className="flex flex-1 items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 shadow-xs sm:flex-initial"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent text-xs text-[#1A1A1A] outline-none sm:w-44"
                    />
                    <button type="submit" aria-label="Submit search">
                      <Search className="size-4 text-[#ff6b9d]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      aria-label="Close search"
                    >
                      <X className="size-4 text-neutral-400" />
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="text-[#1A1A1A] transition-colors hover:text-[#ff6b9d]"
                >
                  <Search className="size-[19px] stroke-[1.8]" />
                </button>
              )}
            </div>

            {/* User Account Icon */}
            <Link
              href="/admin"
              aria-label="User Account"
              className="hidden sm:flex text-[#1A1A1A] transition-colors hover:text-[#ff6b9d]"
              title="Account / Admin"
            >
              <UserRound className="size-[19px] stroke-[1.8]" />
            </Link>

            {/* Wishlist Icon with Badge */}
            <Link
              href="/products?badge=new"
              aria-label="Wishlist"
              className="relative flex items-center justify-center text-[#1A1A1A] transition-colors hover:text-[#ff6b9d]"
            >
              <Heart className="size-[19px] stroke-[1.8]" />
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#ff6b9d] text-[9px] font-bold text-white shadow-xs">
                0
              </span>
            </Link>

            {/* Cart with Badge */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative flex items-center justify-center text-[#1A1A1A] transition-colors hover:text-[#ff6b9d]"
            >
              <ShoppingBag className="size-[19px] stroke-[1.8]" />
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#ff6b9d] text-[9px] font-bold text-white shadow-xs">
                {totalCount}
              </span>
            </Link>

            {/* Mobile menu hamburger */}
            <button
              type="button"
              className="text-[#1A1A1A] lg:hidden ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        {currentMegaData && (
          <div
            className="absolute left-0 top-full w-full border-b border-t border-slate-200 bg-[#f8f9fa] shadow-2xl transition-all duration-200"
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {/* If it's the "ALL CATEGORIES" Mega Menu with every other category */}
            {currentMegaData.isAllCategoriesMega && currentMegaData.categoriesList ? (
              <div className="relative mx-auto flex max-w-[1440px] items-start overflow-hidden px-8 py-6 lg:px-14 lg:py-8">
                {/* Background Watermark */}
                <div className="pointer-events-none absolute -bottom-4 left-4 select-none text-[65px] font-black uppercase leading-[0.8] tracking-tighter text-[#080d2d]/[0.03] lg:left-8 lg:text-[85px]">
                  BERRY PERRY
                </div>

                {/* Left Column: EXPLORE ALL */}
                <div className="relative z-10 w-56 shrink-0 border-r border-slate-200 pr-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EB008B]">
                    COMPLETE DIRECTORY
                  </span>
                  <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#1A1A1A] lg:text-3xl">
                    All Categories
                  </h2>
                  <p className="mt-1 text-[11px] font-bold text-slate-500">
                    Explore all baby, kids, toys, nursery, clothing &amp; essentials in one place.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setActiveMenu(null)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#EB008B] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-[#d4007d]"
                  >
                    <span>View All</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {/* Right Columns: Multi-Column Category & Subcategory Directory */}
                <div className="relative z-10 grid flex-1 grid-cols-2 gap-6 pl-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 lg:pl-10">
                  {currentMegaData.categoriesList.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <Link
                        href={cat.href}
                        onClick={() => setActiveMenu(null)}
                        className="group flex items-center gap-2 border-b border-slate-200/90 pb-1 text-xs font-black uppercase tracking-wider text-[#1A1A1A] hover:text-[#EB008B]"
                      >
                        <span className="size-1.5 rounded-full bg-[#EB008B]" />
                        <span className="truncate">{cat.title}</span>
                      </Link>

                      {/* Sub-items */}
                      {cat.subItems && cat.subItems.length > 0 && (
                        <ul className="space-y-1.5 pt-0.5">
                          {cat.subItems.map((sub, sIdx) => (
                            <li key={sIdx}>
                              <Link
                                href={sub.href}
                                onClick={() => setActiveMenu(null)}
                                className="group flex items-center gap-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:text-[#1A1A1A]"
                              >
                                <span className="size-1 shrink-0 rounded-full bg-[#5CB946]" />
                                <span className="truncate transition-transform group-hover:translate-x-0.5">
                                  {sub.label}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Specific 4-Category Mega Menu */
              <div className="relative mx-auto flex max-w-[1440px] items-start overflow-hidden px-8 py-5 lg:px-14 lg:py-6">
                <div className="pointer-events-none absolute -bottom-4 left-4 select-none text-[65px] font-black uppercase leading-[0.8] tracking-tighter text-[#080d2d]/[0.03] lg:left-8 lg:text-[85px]">
                  {currentMegaData.watermarkText}
                </div>

                <div className="relative z-10 w-56 shrink-0 border-r border-slate-200 pr-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EB008B]">
                    EXPLORE
                  </span>
                  <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#1A1A1A] lg:text-3xl">
                    {currentMegaData.exploreTitle}
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    COLLECTION
                  </p>
                  <Link
                    href={currentMegaData.exploreHref}
                    onClick={() => setActiveMenu(null)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1A1A1A] transition-colors hover:text-[#EB008B]"
                  >
                    <span>SHOP ALL</span>
                    <span className="text-sm">↗</span>
                  </Link>
                </div>

                <div
                  className={`relative z-10 grid flex-1 gap-6 pl-8 lg:gap-8 lg:pl-10 ${
                    currentMegaData.columns?.length === 1
                      ? 'grid-cols-1 max-w-xs'
                      : currentMegaData.columns?.length === 2
                      ? 'grid-cols-2 max-w-xl'
                      : currentMegaData.columns?.length === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}
                >
                  {currentMegaData.columns?.map((column, colIdx) => (
                    <div key={colIdx} className="space-y-2.5">
                      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1.5">
                        <span className="size-1.5 rounded-full bg-[#EB008B]" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-[#1A1A1A]">
                          {column.title}
                        </h3>
                      </div>

                      <ul className="space-y-2">
                        {column.items.map((item, itIdx) => (
                          <li key={itIdx}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveMenu(null)}
                              className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#4b5563] transition-colors hover:text-[#1A1A1A]"
                            >
                              <span className="size-1.5 shrink-0 rounded-full bg-[#5CB946] transition-transform duration-200 group-hover:scale-125 group-hover:bg-[#EB008B]" />
                              <span className="transition-transform duration-200 group-hover:translate-x-1">
                                {item.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <nav
            className="max-h-[85vh] overflow-y-auto border-t border-slate-200 bg-white px-6 py-6 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-4">
              {dynamicNavItems.map((item) => {
                const mega = getMegaDataForActiveMenu(item.name)
                return (
                  <div key={item.name} className="border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between">
                      <Link
                        onClick={() => setMobileMenuOpen(false)}
                        href={item.href}
                        className="text-sm font-black uppercase tracking-wider text-[#1A1A1A]"
                      >
                        {item.name}
                      </Link>
                      {item.hasDropdown && (
                        <button
                          type="button"
                          onClick={() => setActiveMenu(activeMenu === item.name ? null : item.name)}
                          className="p-1 text-slate-400"
                          aria-label={`Toggle ${item.name} subcategories`}
                        >
                          {activeMenu === item.name ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Mobile Dropdown Accordion */}
                    {item.hasDropdown && activeMenu === item.name && mega && (
                      <div className="mt-3 space-y-3 rounded-lg bg-[#f8f9fa] p-4 text-xs">
                        {mega.isAllCategoriesMega && mega.categoriesList ? (
                          <div className="space-y-3">
                            {mega.categoriesList.map((cat, cIdx) => (
                              <div key={cIdx} className="space-y-1">
                                <Link
                                  href={cat.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="font-extrabold uppercase text-[#EB008B] block"
                                >
                                  {cat.title}
                                </Link>
                                <div className="flex flex-col gap-1 pl-2">
                                  {cat.subItems?.map((it, iIdx) => (
                                    <Link
                                      key={iIdx}
                                      href={it.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="text-slate-600 hover:text-[#1A1A1A]"
                                    >
                                      • {it.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          mega.columns?.map((col, cIdx) => (
                            <div key={cIdx} className="space-y-1.5">
                              <p className="font-extrabold uppercase text-[#EB008B]">{col.title}</p>
                              <div className="flex flex-col gap-1 pl-2">
                                {col.items.map((it, iIdx) => (
                                  <Link
                                    key={iIdx}
                                    href={it.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-slate-600 hover:text-[#1A1A1A]"
                                  >
                                    • {it.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="pt-2">
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg bg-[#1A1A1A] px-4 py-3 text-sm font-bold uppercase text-white shadow-md hover:bg-[#EB008B] transition"
                >
                  <span>View Bag</span>
                  <span className="rounded-full bg-[#EB008B] px-2 py-0.5 text-xs font-black">
                    {totalCount} items
                  </span>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
