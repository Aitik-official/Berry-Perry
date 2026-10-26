'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  Eye,
  Flame,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
} from 'lucide-react'
import { products, type Product } from '@/lib/products-data'
import { firstCryClothingSections } from '@/lib/firstcry-clothing-data'
import {
  defaultSiteAssets,
  getActiveSiteAssets,
  type SiteMediaAssets,
  type HeroBannerSlideConfig,
  defaultHeroBannerSlide,
  defaultHeroSlides,
  defaultWelcomeSection,
  defaultBoysGirlsSection,
  defaultModernToysSection,
  defaultKidsCollectionsSection,
  defaultInstagramSection,
  defaultShopByAgeSection,
  defaultShopByPriceSection,
} from '@/lib/site-assets'
import { useCart } from '@/lib/cart-context'

function InstagramIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function AvoneHome() {
  const [siteAssets, setSiteAssets] = useState<SiteMediaAssets>(defaultSiteAssets)
  const [activeSlide, setActiveSlide] = useState(0)
  const [addedSlug, setAddedSlug] = useState<string | null>(null)
  const [liveProducts, setLiveProducts] = useState<Product[]>(products)
  const { addItem } = useCart()

  // Fetch live products from database on mount
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setLiveProducts(data.products)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setSiteAssets(getActiveSiteAssets())
    // Fetch live media assets from DB on mount so any CMS edits display dynamically
    import('@/lib/site-assets').then(({ fetchSiteAssetsAsync }) => {
      fetchSiteAssetsAsync()
        .then((fresh) => {
          if (fresh) setSiteAssets(fresh)
        })
        .catch(() => {})
    })
    const handleStorage = () => setSiteAssets(getActiveSiteAssets())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Scroll animations: automatically observe sections and reveal them with smooth pop-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            // Once revealed, unobserve so animation remains clean
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-card')
    revealElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [liveProducts.length, siteAssets])

  // Resolve Hero Slides (each slide has its own image, text badges, button text and target link)
  const heroSlides: HeroBannerSlideConfig[] = useMemo(() => {
    if (siteAssets.heroSlides && siteAssets.heroSlides.length > 0) {
      return siteAssets.heroSlides
    }
    // Fallback: If only heroBanners array exists, pair each image with default or configured badges
    const banners = siteAssets.heroBanners && siteAssets.heroBanners.length > 0
      ? siteAssets.heroBanners
      : ['/images/kids_spring_banner_bg.jpg']
    const baseConfig = siteAssets.heroBannerConfig || defaultHeroBannerSlide
    return banners.map((bg, idx) => {
      const defaultSlide = defaultHeroSlides[idx % defaultHeroSlides.length]
      return {
        backgroundImage: bg,
        taglineTop: idx === 0 ? (baseConfig.taglineTop || defaultSlide.taglineTop) : defaultSlide.taglineTop,
        taglineBottom: idx === 0 ? (baseConfig.taglineBottom || defaultSlide.taglineBottom) : defaultSlide.taglineBottom,
        buttonText: idx === 0 ? (baseConfig.buttonText || defaultSlide.buttonText) : defaultSlide.buttonText,
        buttonHref: idx === 0 ? (baseConfig.buttonHref || defaultSlide.buttonHref) : defaultSlide.buttonHref,
        topBadgeColor: idx === 0 ? (baseConfig.topBadgeColor || defaultSlide.topBadgeColor) : defaultSlide.topBadgeColor,
        bottomBadgeColor: idx === 0 ? (baseConfig.bottomBadgeColor || defaultSlide.bottomBadgeColor) : defaultSlide.bottomBadgeColor,
      }
    })
  }, [siteAssets.heroSlides, siteAssets.heroBanners, siteAssets.heroBannerConfig])

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  const welcome = siteAssets.welcomeSection || defaultWelcomeSection
  const boysGirls = siteAssets.boysGirlsSection || defaultBoysGirlsSection
  const modernToys = siteAssets.modernToysSection || defaultModernToysSection
  const kidsCollections = siteAssets.kidsCollectionsSection || defaultKidsCollectionsSection
  const instagram = siteAssets.instagramSection || defaultInstagramSection
  const shopByAge = siteAssets.shopByAgeSection || defaultShopByAgeSection
  const shopByPrice = siteAssets.shopByPriceSection || defaultShopByPriceSection
  const priceScrollRef = useRef<HTMLDivElement>(null)

  const scrollPriceCards = (direction: 'left' | 'right') => {
    if (priceScrollRef.current) {
      const scrollAmount = 300
      priceScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // FirstCry authentic clothing products for 4-column showcase (showing 4 items each)
  const newArrivals = ((firstCryClothingSections['New Arrivals'] && firstCryClothingSections['New Arrivals'].length > 0)
    ? firstCryClothingSections['New Arrivals']
    : liveProducts).slice(0, 4)
  const featuredItems = ((firstCryClothingSections['Featured Items'] && firstCryClothingSections['Featured Items'].length > 0)
    ? firstCryClothingSections['Featured Items']
    : liveProducts.slice(4)).slice(0, 4)
  const bestSellers = ((firstCryClothingSections['Best Sellers'] && firstCryClothingSections['Best Sellers'].length > 0)
    ? firstCryClothingSections['Best Sellers']
    : liveProducts).slice(0, 4)
  const onSale = ((firstCryClothingSections['On Sale'] && firstCryClothingSections['On Sale'].length > 0)
    ? firstCryClothingSections['On Sale']
    : liveProducts.slice(4)).slice(0, 4)

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes?.[0] || 'Standard'
    const defaultColor = product.colors?.[0]?.name || 'Standard'
    const colorHex = product.colors?.[0]?.hex || '#EB008B'
    addItem(product, defaultSize, defaultColor, 1, colorHex)
    setAddedSlug(product.slug)
    setTimeout(() => setAddedSlug(null), 2000)
  }

  // Marquee items
  const marqueeItems = [
    'SPRING COLLECTION FOR MODERN KIDS',
    'BERRY PERRY KIDS SHOP',
    'EXCLUSIVE OFFERS & DEALS',
    'EXPLORE VIBRANT COLLECTIONS',
    'PREMIUM BABY & KIDS ESSENTIALS',
    'NEW ARRIVALS EVERY WEEK',
  ]

  // Render trust icon
  const renderTrustIcon = (iconName: string) => {
    switch (iconName) {
      case 'shipping':
        return <Truck className="size-9 text-[#EB008B]" />
      case 'return':
        return <RotateCcw className="size-9 text-[#EB008B]" />
      case 'payment':
        return <CreditCard className="size-9 text-[#EB008B]" />
      case 'support':
      default:
        return <Headphones className="size-9 text-[#EB008B]" />
    }
  }

  // Instagram feed visual gallery
  const instaImages = [
    'https://cdn.fcglcdn.com/brainbees/images/products/400x485/16310907a.jpg',
    'https://cdn.fcglcdn.com/brainbees/images/products/400x485/21517725a.jpg',
    'https://cdn.fcglcdn.com/brainbees/images/products/400x485/9051892a.jpg',
    'https://cdn.fcglcdn.com/brainbees/images/products/400x485/20139636a.jpg',
    'https://cdn.fcglcdn.com/brainbees/images/products/400x485/21513307a.jpg',
    'https://cdn.fcglcdn.com/brainbees/images/products/300x364/23600800a.jpg',
  ]

  return (
    <div className="w-full bg-[#fbfbfb] text-[#1A1A1A]">
      {/* ========================================================
          SECTION 1: HERO BANNER (SPRING COLLECTION FOR MODERN KIDS)
          Funky, playful kids layout with background image & layered badges
          Each slide transitions its image AND matching text badges
          ======================================================== */}
      <section className="relative overflow-hidden bg-neutral-100">
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] min-h-[320px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[560px]">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === activeSlide
            const topBadgeText = slide.taglineTop || 'SPRING COLLECTION'
            const bottomBadgeText = slide.taglineBottom || 'FOR MODERN KIDS'
            const buttonText = slide.buttonText || 'SHOP COLLECTION'
            const buttonHref = slide.buttonHref || '/products?badge=new'
            const topBg = slide.topBadgeColor || '#40B4A6'
            const bottomBg = slide.bottomBadgeColor || '#FF5A87'
            const bannerSrc = slide.backgroundImage || '/images/kids_spring_banner_bg.jpg'

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 z-10 pointer-events-auto'
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Slide Background Image */}
                <Image
                  src={bannerSrc}
                  alt={`${topBadgeText} - ${bottomBadgeText}`}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center w-full h-full brightness-[0.98]"
                  sizes="100vw"
                />
                {/* Subtle vignette/contrast overlay so badges pop crisply */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

                {/* Per-Slide Funky Layered Text Badges & CTA */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 select-none">
                  <div
                    className={`pointer-events-auto flex flex-col items-center text-center max-w-[85vw] sm:max-w-md md:max-w-lg transform transition-all duration-700 ease-out hover:scale-[1.02] ${
                      isActive ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-3 opacity-0 scale-95'
                    }`}
                  >
                    {/* Top Funky Pill Badge */}
                    <div
                      style={{ backgroundColor: topBg }}
                      className="rounded-xl sm:rounded-2xl px-5 py-1.5 sm:px-8 sm:py-2.5 md:px-10 md:py-3 shadow-lg sm:shadow-xl border-2 sm:border-[3px] border-white/95 transform -rotate-1 hover:rotate-0 transition-all duration-300"
                    >
                      <h1 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] leading-none font-serif">
                        {topBadgeText}
                      </h1>
                    </div>

                    {/* Bottom Funky Pill Badge */}
                    <div
                      style={{ backgroundColor: bottomBg }}
                      className="mt-1.5 sm:mt-2.5 rounded-xl sm:rounded-2xl px-5 py-1.5 sm:px-8 sm:py-2.5 md:px-10 md:py-3 shadow-lg sm:shadow-xl border-2 sm:border-[3px] border-white/95 transform rotate-1 hover:rotate-0 transition-all duration-300"
                    >
                      <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] leading-none font-serif">
                        {bottomBadgeText}
                      </h2>
                    </div>

                    {/* Funky CTA Button */}
                    <div className="mt-3 sm:mt-4">
                      <Link
                        href={buttonHref}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 sm:px-6 sm:py-2.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#1A1A1A] shadow-md hover:shadow-xl hover:bg-[#FFF000] hover:text-[#1A1A1A] border-2 border-white transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>{buttonText}</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Slider Navigation Controls */}
          {heroSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  prevSlide()
                }}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-11 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-md backdrop-blur-md transition-all hover:bg-[#EB008B] hover:text-white sm:left-6 border border-slate-200"
              >
                <ChevronLeft className="size-5 sm:size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  nextSlide()
                }}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-11 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-md backdrop-blur-md transition-all hover:bg-[#EB008B] hover:text-white sm:right-6 border border-slate-200"
              >
                <ChevronRight className="size-5 sm:size-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveSlide(i)
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      i === activeSlide
                        ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#EB008B] shadow-md'
                        : 'size-2 sm:size-2.5 bg-white/80 hover:bg-[#EB008B]'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ========================================================
          ANIMATED VIBRANT MARQUEE TICKER
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#EB008B] via-[#EB008B] to-[#5CB946] py-3 text-white shadow-sm">
        <div className="flex w-max animate-[marquee_25s_linear_infinite] items-center space-x-8">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] drop-shadow-sm">
                {item}
              </span>
              <span className="inline-block size-2 rounded-full bg-[#FFF000]" />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          KIDS' COLLECTIONS: SHOP BY CATEGORY (NEW SECTION)
          Exact match to user's uploaded screenshot with images from public/category/
          ======================================================== */}
      {kidsCollections.enabled && (
        <section className="reveal-on-scroll mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#3b82f6]">
              {kidsCollections.tagline}
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#d6406e] tracking-tight">
              {kidsCollections.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-normal">
              {kidsCollections.description}
            </p>
          </div>

          {/* 3-Column Creative Masonry Grid */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            {/* Column 1 (Left Tall Card): Clothing */}
            <Link
              href={kidsCollections.clothing.href}
              className="reveal-card group relative block overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl md:col-span-4 min-h-[360px] sm:min-h-[460px] bg-neutral-100 hover:-translate-y-1.5"
              style={{ transitionDelay: '80ms' }}
            >
              <Image
                src={kidsCollections.clothing.image}
                alt={kidsCollections.clothing.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />

              {/* White Pill Badge */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-auto min-w-[160px] text-center">
                <div className="rounded-2xl bg-white px-5 py-2.5 shadow-md transition-transform duration-200 group-hover:scale-105">
                  <h4 className="text-sm font-black text-[#4361ee] leading-tight">
                    {kidsCollections.clothing.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] font-semibold text-neutral-500">
                    {kidsCollections.clothing.subtitle}
                  </p>
                </div>
              </div>
            </Link>

            {/* Column 2 (Middle 2 Stacked Cards): Accessories (Top) & Books (Bottom) */}
            <div className="flex flex-col gap-5 sm:gap-6 md:col-span-4">
              {/* Top: Accessories with Soft Pink Backdrop */}
              <Link
                href={kidsCollections.accessories.href}
                className="reveal-card group relative flex-1 block overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl min-h-[190px] sm:min-h-[218px] bg-[#fce4ec] hover:-translate-y-1.5"
                style={{ transitionDelay: '160ms' }}
              >
                <Image
                  src={kidsCollections.accessories.image}
                  alt={kidsCollections.accessories.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* White Pill Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-auto min-w-[140px] text-center">
                  <div className="rounded-2xl bg-white px-4 py-2 shadow-md transition-transform duration-200 group-hover:scale-105 flex items-center justify-center gap-1.5">
                    <span className="text-xs">✨</span>
                    <h4 className="text-xs sm:text-sm font-black text-[#4361ee] leading-tight">
                      {kidsCollections.accessories.title}
                    </h4>
                  </div>
                </div>
              </Link>

              {/* Bottom: Books */}
              <Link
                href={kidsCollections.books.href}
                className="reveal-card group relative flex-1 block overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl min-h-[190px] sm:min-h-[218px] bg-neutral-100 hover:-translate-y-1.5"
                style={{ transitionDelay: '240ms' }}
              >
                <Image
                  src={kidsCollections.books.image}
                  alt={kidsCollections.books.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />

                {/* White Pill Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-auto min-w-[150px] text-center">
                  <div className="rounded-2xl bg-white px-4 py-2 shadow-md transition-transform duration-200 group-hover:scale-105">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs">📚</span>
                      <h4 className="text-xs sm:text-sm font-black text-[#4361ee] leading-tight">
                        {kidsCollections.books.title}
                      </h4>
                    </div>
                    <p className="mt-0.5 text-[10px] font-semibold text-neutral-500">
                      {kidsCollections.books.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Column 3 (Right Tall Card): Playthings */}
            <Link
              href={kidsCollections.playthings.href}
              className="reveal-card group relative block overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl md:col-span-4 min-h-[360px] sm:min-h-[460px] bg-neutral-100 hover:-translate-y-1.5"
              style={{ transitionDelay: '320ms' }}
            >
              <Image
                src={kidsCollections.playthings.image}
                alt={kidsCollections.playthings.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />

              {/* White Pill Badge */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-auto min-w-[160px] text-center">
                <div className="rounded-2xl bg-white px-5 py-2.5 shadow-md transition-transform duration-200 group-hover:scale-105">
                  <h4 className="text-sm font-black text-[#4361ee] leading-tight">
                    {kidsCollections.playthings.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] font-semibold text-neutral-500">
                    {kidsCollections.playthings.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ========================================================
          SECTION 3: FOR BOYS / FOR GIRLS SPLIT SECTION
          Exact match to user's screenshot media_1792759571119.png
          ======================================================== */}
      {boysGirls.enabled && (
        <section className="reveal-on-scroll mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {/* Left: For Boys Card */}
            <div
              className="reveal-card group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl aspect-[21/14] sm:aspect-[21/13] bg-neutral-100 hover:-translate-y-1.5"
              style={{ transitionDelay: '80ms' }}
            >
              <Image
                src={boysGirls.boysImage || '/images/boys.jpg'}
                alt={boysGirls.boysTitle}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

              {/* Title & Button Overlay */}
              <div className="absolute bottom-6 sm:bottom-10 right-8 sm:right-12 flex flex-col items-start z-10">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#1c2c5b] drop-shadow-sm">
                  {boysGirls.boysTitle}
                </h3>
                <Link
                  href={boysGirls.boysHref}
                  className="mt-3 sm:mt-4 inline-flex items-center justify-center rounded-md bg-[#4cb7b5] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow transition-all duration-200 hover:bg-[#3ea2a0] hover:shadow-md"
                >
                  {boysGirls.boysButtonText}
                </Link>
              </div>
            </div>

            {/* Right: For Girls Card */}
            <div
              className="reveal-card group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl aspect-[21/14] sm:aspect-[21/13] bg-neutral-100 hover:-translate-y-1.5"
              style={{ transitionDelay: '180ms' }}
            >
              <Image
                src={boysGirls.girlsImage || '/images/girls.jpg'}
                alt={boysGirls.girlsTitle}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

              {/* Title & Button Overlay */}
              <div className="absolute bottom-6 sm:bottom-10 left-8 sm:left-12 flex flex-col items-start z-10">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#1c2c5b] drop-shadow-sm">
                  {boysGirls.girlsTitle}
                </h3>
                <Link
                  href={boysGirls.girlsHref}
                  className="mt-3 sm:mt-4 inline-flex items-center justify-center rounded-md bg-[#4cb7b5] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow transition-all duration-200 hover:bg-[#3ea2a0] hover:shadow-md"
                >
                  {boysGirls.girlsButtonText}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          SECTION 4: FROM CLASSIC TO MODERN TOYS + 3 SUBCATEGORY CARDS
          Exact match to user's screenshot media_1792759571494.png
          ======================================================== */}
      {modernToys.enabled && (
        <section className="reveal-on-scroll mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
          {/* Top Split Hero Banner */}
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm md:grid-cols-12 bg-[#6ea19d]">
            {/* Left: Kid Playing with Colorful Wooden Blocks */}
            <div className="relative aspect-[4/3] md:aspect-auto md:col-span-6 min-h-[260px] sm:min-h-[340px] lg:min-h-[400px]">
              <Image
                src={modernToys.bannerImage || '/images/sections/kid_wooden_blocks.png'}
                alt="Kid playing with wooden blocks"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Right: Modern Toys Teal Callout */}
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 text-center text-white md:col-span-6 bg-[#6ea19d]">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {modernToys.headline}
              </h2>
              <p className="mt-4 max-w-md text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed font-normal">
                {modernToys.description}
              </p>
              <div className="mt-6 sm:mt-8">
                <Link
                  href={modernToys.buttonHref}
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1A1A1A] shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                >
                  {modernToys.buttonText}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom 3 Subcategory Cards Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
            {modernToys.cards.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                className="reveal-card group relative block overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl aspect-[16/10] bg-neutral-100 hover:-translate-y-1.5"
                style={{ transitionDelay: `${(idx + 1) * 90}ms` }}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                {/* White Rounded Pill Title Overlay at Bottom Center */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-block rounded-full bg-white px-6 py-2 text-xs sm:text-sm font-bold text-[#1A1A1A] shadow-md transition-all duration-200 group-hover:bg-[#EB008B] group-hover:text-white group-hover:shadow-lg whitespace-nowrap">
                    {card.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          SHOP BY AGE SECTION (FIND THE PERFECT GIFT)
          Exact match to user's uploaded screenshot media_1792829603262.png
          ======================================================== */}
      {shopByAge.enabled && (
        <section id="shop-by-age" className="reveal-on-scroll w-full bg-[#f1edfc] py-14 sm:py-20 my-6 sm:my-8 scroll-mt-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#3b82f6]">
                {shopByAge.tagline}
              </span>
              <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#d6406e] tracking-tight">
                {shopByAge.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-normal">
                {shopByAge.description}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
              {(shopByAge.cards || []).map((card, idx) => (
                <div
                  key={idx}
                  className="reveal-card group flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                  style={{ transitionDelay: `${(idx + 1) * 80}ms` }}
                >
                  <div>
                    {/* Card Image with Rounded Corners */}
                    <div className="relative aspect-[16/13] w-full overflow-hidden rounded-t-3xl bg-neutral-100">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 text-center">
                      <h3 className="text-base sm:text-lg font-bold text-[#d6406e] tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-normal">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="px-6 pb-6 pt-0 text-center">
                    <Link
                      href={card.href}
                      className="inline-flex items-center justify-center rounded-full bg-[#5d47a8] hover:bg-[#4d3896] px-7 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                    >
                      {card.buttonText || 'SHOP NOW'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          SHOP BY PRICE SECTION
          Matching user's screenshot with pastel gradient background,
          curved cards, blue price labels, and carousel navigation
          ======================================================== */}
      {shopByPrice.enabled && (
        <section
          id="shop-by-price"
          className="reveal-on-scroll relative w-full py-12 sm:py-16 my-6 sm:my-8 overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #d8f5fc 0%, #ebf1fa 40%, #fae6ed 100%)',
          }}
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#37497d] tracking-tight">
                {shopByPrice.title || 'Shop by price'}
              </h2>
            </div>

            {/* Slider Container with Left & Right Arrow Buttons */}
            <div className="relative group/slider">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => scrollPriceCards('left')}
                aria-label="Previous price items"
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-md backdrop-blur-xs transition-all duration-200 hover:bg-white hover:scale-110 hover:shadow-lg focus:outline-none"
              >
                <ChevronLeft className="size-5 sm:size-6" />
              </button>

              {/* Scrollable Track */}
              <div
                ref={priceScrollRef}
                className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-2 pt-1 px-2 no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {(shopByPrice.cards || []).map((card, idx) => (
                  <Link
                    key={idx}
                    href={card.href || '/products'}
                    className="reveal-card group/card flex flex-col shrink-0 w-[240px] sm:w-[260px] md:w-[270px] overflow-hidden rounded-2xl bg-white shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
                    style={{ transitionDelay: `${(idx + 1) * 70}ms` }}
                  >
                    {/* Image Container with 1:1 Aspect Ratio matching the original design */}
                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 p-2 sm:p-2.5">
                      <div className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-100">
                        <Image
                          src={card.image}
                          alt={card.label}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
                          sizes="(max-width: 640px) 240px, 270px"
                        />
                      </div>
                    </div>

                    {/* Price Label Box with border top */}
                    <div className="py-3 px-4 text-center border-t border-neutral-100 bg-white">
                      <span className="text-sm sm:text-base font-bold text-[#0c709e] group-hover/card:text-[#09577c] transition-colors">
                        {card.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => scrollPriceCards('right')}
                aria-label="Next price items"
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-md backdrop-blur-xs transition-all duration-200 hover:bg-white hover:scale-110 hover:shadow-lg focus:outline-none"
              >
                <ChevronRight className="size-5 sm:size-6" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          SECTION 5: 4-COLUMN PRODUCTS SHOWCASE
          (NEW ARRIVALS / FEATURED ITEMS / BEST SELLERS / ON SALE)
          Exact match to user's screenshot media_1792759571012.png
          ======================================================== */}
      <section className="reveal-on-scroll mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-10 sm:py-14 bg-white/60">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: NEW ARRIVALS */}
          <div className="reveal-card" style={{ transitionDelay: '80ms' }}>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-neutral-200">
              NEW ARRIVALS
            </h3>
            <div className="mt-4 space-y-4">
              {newArrivals.map((product) => (
                <div key={product.id} className="group flex items-center gap-3.5 transition-transform duration-200 hover:translate-x-1">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 shadow-2xs">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block truncate text-xs sm:text-sm font-bold text-[#1A1A1A] transition-colors hover:text-[#EB008B]"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#3ea2a0]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="text-[11px] font-bold text-[#EB008B] hover:underline"
                      >
                        {addedSlug === product.slug ? 'Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: FEATURED ITEMS */}
          <div className="reveal-card" style={{ transitionDelay: '160ms' }}>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-neutral-200">
              FEATURED ITEMS
            </h3>
            <div className="mt-4 space-y-4">
              {featuredItems.map((product) => (
                <div key={product.id} className="group flex items-center gap-3.5 transition-transform duration-200 hover:translate-x-1">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 shadow-2xs">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block truncate text-xs sm:text-sm font-bold text-[#1A1A1A] transition-colors hover:text-[#EB008B]"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#3ea2a0]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="text-[11px] font-bold text-[#EB008B] hover:underline"
                      >
                        {addedSlug === product.slug ? 'Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: BEST SELLERS */}
          <div className="reveal-card" style={{ transitionDelay: '240ms' }}>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-neutral-200">
              BEST SELLERS
            </h3>
            <div className="mt-4 space-y-4">
              {bestSellers.map((product) => (
                <div key={product.id} className="group flex items-center gap-3.5 transition-transform duration-200 hover:translate-x-1">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 shadow-2xs">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block truncate text-xs sm:text-sm font-bold text-[#1A1A1A] transition-colors hover:text-[#EB008B]"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#3ea2a0]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="text-[11px] font-bold text-[#EB008B] hover:underline"
                      >
                        {addedSlug === product.slug ? 'Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: ON SALE */}
          <div className="reveal-card" style={{ transitionDelay: '320ms' }}>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-neutral-200">
              ON SALE
            </h3>
            <div className="mt-4 space-y-4">
              {onSale.map((product) => (
                <div key={product.id} className="group flex items-center gap-3.5 transition-transform duration-200 hover:translate-x-1">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 shadow-2xs">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block truncate text-xs sm:text-sm font-bold text-[#1A1A1A] transition-colors hover:text-[#EB008B]"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#3ea2a0]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="text-[11px] font-bold text-[#EB008B] hover:underline"
                      >
                        {addedSlug === product.slug ? 'Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: WE'RE ON INSTAGRAM (5-COLUMN 2-ROW GRID)
          Exact match to user's uploaded screenshot
          ======================================================== */}
      {instagram.enabled && (
        <section className="reveal-on-scroll mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#3b82f6]">
              {instagram.tagline || 'FOLLOW US'}
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#d6406e] tracking-tight">
              {instagram.title || "We're on Instagram"}
            </h2>
            {instagram.handle && (
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
                <a
                  href={instagram.handleHref || 'https://instagram.com/' + instagram.handle.replace('@', '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#EB008B] transition-colors"
                >
                  {instagram.handle}
                </a>
              </p>
            )}
          </div>

          {/* 10-Item Grid: 5 columns x 2 rows */}
          <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-5">
            {(instagram.images || []).map((src, idx) => (
              <a
                key={idx}
                href={instagram.handleHref || 'https://instagram.com/adornthemes'}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal-card group relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-100 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ transitionDelay: `${(idx % 5) * 60 + 60}ms` }}
              >
                <Image
                  src={src}
                  alt={`Instagram Post ${idx + 1}`}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[1px]">
                  <InstagramIcon className="size-6 text-white drop-shadow-md" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
