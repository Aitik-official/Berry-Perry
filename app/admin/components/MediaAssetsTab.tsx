'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Eye, Plus, Trash2 } from 'lucide-react'
import { ImageAssetCard, VideoAssetCard } from './AssetCards'
import { CategoryLinkSelector } from './CategoryLinkSelector'
import { WelcomeSectionEditor } from './media/WelcomeSectionEditor'
import { InstagramSectionEditor } from './media/InstagramSectionEditor'
import type { SiteMediaAssets, HeroBannerSlideConfig, ShopByPriceSectionConfig } from '@/lib/site-assets'
import {
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
import type { Product } from '@/lib/products-data'

export interface MediaAssetsTabProps {
  mediaAssets: SiteMediaAssets
  saveMediaAssets: (assets: SiteMediaAssets) => void
  products: Product[]
  unshowcasedProducts: Product[]
  selectedSlugToAdd: string
  setSelectedSlugToAdd: (slug: string) => void
  onAddProductToShowcase: () => void
  onRemoveProductFromShowcase: (slug: string) => void
  onUpdateShowcaseVideo: (productSlug: string, reelNumber: 1 | 2, newSrc: string) => void
}

export function MediaAssetsTab({
  mediaAssets,
  saveMediaAssets,
  products,
  unshowcasedProducts,
  selectedSlugToAdd,
  setSelectedSlugToAdd,
  onAddProductToShowcase,
  onRemoveProductFromShowcase,
  onUpdateShowcaseVideo,
}: MediaAssetsTabProps) {
  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#EB008B]">
            Unified Homepage Visual CMS
          </span>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#1A1A1A]">
            Homepage Section-by-Section Media Manager
          </h2>
          <p className="text-xs text-slate-500">
            Replace and update images and videos visually across all homepage sections.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#EB008B] transition shrink-0"
        >
          <Eye className="h-4 w-4 text-[#5CB946]" />
          <span>Preview Live Changes</span>
        </Link>
      </div>

      {/* SECTION 1: HERO CAROUSEL BANNERS (PER-SLIDE IMAGE & TEXT) */}
      {(() => {
        // Resolve slides list: use mediaAssets.heroSlides if available; otherwise construct from heroBanners + heroBannerConfig
        const resolvedSlides: HeroBannerSlideConfig[] =
          mediaAssets.heroSlides && mediaAssets.heroSlides.length > 0
            ? mediaAssets.heroSlides
            : (mediaAssets.heroBanners && mediaAssets.heroBanners.length > 0
                ? mediaAssets.heroBanners.map((bg, idx) => {
                    const fallback = defaultHeroSlides[idx % defaultHeroSlides.length]
                    const heroConf = mediaAssets.heroBannerConfig || defaultHeroBannerSlide
                    return {
                      backgroundImage: bg,
                      taglineTop: idx === 0 ? (heroConf.taglineTop || fallback.taglineTop) : fallback.taglineTop,
                      taglineBottom: idx === 0 ? (heroConf.taglineBottom || fallback.taglineBottom) : fallback.taglineBottom,
                      buttonText: idx === 0 ? (heroConf.buttonText || fallback.buttonText) : fallback.buttonText,
                      buttonHref: idx === 0 ? (heroConf.buttonHref || fallback.buttonHref) : fallback.buttonHref,
                      topBadgeColor: idx === 0 ? (heroConf.topBadgeColor || fallback.topBadgeColor) : fallback.topBadgeColor,
                      bottomBadgeColor: idx === 0 ? (heroConf.bottomBadgeColor || fallback.bottomBadgeColor) : fallback.bottomBadgeColor,
                    }
                  })
                : defaultHeroSlides)

        const saveSlides = (newSlides: HeroBannerSlideConfig[]) => {
          saveMediaAssets({
            ...mediaAssets,
            heroSlides: newSlides,
            heroBanners: newSlides.map((s) => s.backgroundImage),
            heroBannerConfig: newSlides[0] || defaultHeroBannerSlide,
          })
        }

        const updateSlide = (idx: number, patch: Partial<HeroBannerSlideConfig>) => {
          const next = resolvedSlides.map((slide, i) => (i === idx ? { ...slide, ...patch } : slide))
          saveSlides(next)
        }

        const addSlide = () => {
          const nextIndex = resolvedSlides.length
          const template = defaultHeroSlides[nextIndex % defaultHeroSlides.length]
          const newSlide: HeroBannerSlideConfig = {
            backgroundImage: '/images/kids_spring_banner_bg.jpg',
            taglineTop: template.taglineTop || 'NEW COLLECTION',
            taglineBottom: template.taglineBottom || 'FOR LITTLE ONES',
            buttonText: 'SHOP NOW',
            buttonHref: '/products?badge=new',
            topBadgeColor: template.topBadgeColor || '#40B4A6',
            bottomBadgeColor: template.bottomBadgeColor || '#FF5A87',
          }
          saveSlides([...resolvedSlides, newSlide])
        }

        const removeSlide = (idx: number) => {
          if (resolvedSlides.length <= 1) return
          saveSlides(resolvedSlides.filter((_, i) => i !== idx))
        }

        return (
          <section id="sec-hero" className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#EB008B]">
                  Section 01 • Top of Homepage
                </span>
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-[#1A1A1A]">
                  Hero Banner Slides ({resolvedSlides.length} Slides)
                </h3>
                <p className="text-xs text-slate-400">
                  Each slide has its own customizable background photograph, funky top and bottom text badges, colors, and CTA button. The text updates automatically as slides transition.
                </p>
              </div>
              <button
                type="button"
                onClick={addSlide}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#EB008B] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#d4007d] transition shrink-0 self-start sm:self-auto shadow-md shadow-[#EB008B]/20"
              >
                <Plus className="h-4 w-4 text-white" />
                <span>Add Hero Slide</span>
              </button>
            </div>

            {/* Slides Cards List */}
            <div className="space-y-6">
              {resolvedSlides.map((slide, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-[#EB008B] text-[11px] font-black text-white">
                        {index + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                        Slide #{index + 1}: &ldquo;{slide.taglineTop || 'Banner'}&rdquo;
                      </span>
                    </div>
                    {resolvedSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlide(index)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Remove Slide</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left: Background Image Uploader & Preview (5 cols) */}
                    <div className="lg:col-span-5">
                      <ImageAssetCard
                        label={`Slide #${index + 1} Background`}
                        sublabel="Hero Slide Background Image"
                        currentSrc={slide.backgroundImage}
                        aspectRatio="aspect-[21/9]"
                        onUpdate={(newSrc) => updateSlide(index, { backgroundImage: newSrc })}
                      />
                    </div>

                    {/* Right: Badges, Colors, and CTA button editor (7 cols) */}
                    <div className="lg:col-span-7 space-y-3.5 bg-white p-4 rounded-xl border border-slate-200/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Top Badge */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase text-slate-700">
                            Top Badge Text
                          </label>
                          <input
                            type="text"
                            value={slide.taglineTop || ''}
                            onChange={(e) => updateSlide(index, { taglineTop: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:border-[#EB008B] focus:outline-none"
                            placeholder="e.g. SPRING COLLECTION"
                          />
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] font-semibold text-slate-500">Badge Color:</span>
                            <input
                              type="color"
                              value={slide.topBadgeColor || '#40B4A6'}
                              onChange={(e) => updateSlide(index, { topBadgeColor: e.target.value })}
                              className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
                            />
                            <span className="text-[11px] font-mono font-bold text-slate-600">
                              {slide.topBadgeColor || '#40B4A6'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Badge */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase text-slate-700">
                            Bottom Badge Text
                          </label>
                          <input
                            type="text"
                            value={slide.taglineBottom || ''}
                            onChange={(e) => updateSlide(index, { taglineBottom: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:border-[#EB008B] focus:outline-none"
                            placeholder="e.g. FOR MODERN KIDS"
                          />
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] font-semibold text-slate-500">Badge Color:</span>
                            <input
                              type="color"
                              value={slide.bottomBadgeColor || '#FF5A87'}
                              onChange={(e) => updateSlide(index, { bottomBadgeColor: e.target.value })}
                              className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
                            />
                            <span className="text-[11px] font-mono font-bold text-slate-600">
                              {slide.bottomBadgeColor || '#FF5A87'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button Text & Destination Link */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              CTA Button Label
                            </label>
                            <input
                              type="text"
                              value={slide.buttonText || ''}
                              onChange={(e) => updateSlide(index, { buttonText: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:border-[#EB008B] focus:outline-none"
                              placeholder="e.g. SHOP COLLECTION"
                            />
                          </div>
                          <div>
                            <CategoryLinkSelector
                              label="Destination Category / Link"
                              value={slide.buttonHref || ''}
                              onChange={(newHref) => updateSlide(index, { buttonHref: newHref })}
                              placeholder="Select category or link..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Live Mini Preview pill of badges */}
                      <div className="mt-2 rounded-lg bg-slate-900/5 p-3 flex flex-wrap items-center justify-center gap-2">
                        <span
                          style={{ backgroundColor: slide.topBadgeColor || '#40B4A6' }}
                          className="rounded-full px-3 py-1 text-[10px] font-black uppercase text-white shadow-sm border border-white/60 -rotate-1"
                        >
                          {slide.taglineTop || 'TOP BADGE'}
                        </span>
                        <span
                          style={{ backgroundColor: slide.bottomBadgeColor || '#FF5A87' }}
                          className="rounded-full px-3 py-1 text-[10px] font-black uppercase text-white shadow-sm border border-white/60 rotate-1"
                        >
                          {slide.taglineBottom || 'BOTTOM BADGE'}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[9px] font-bold uppercase text-slate-700 shadow-sm border border-slate-200">
                          {slide.buttonText || 'BUTTON'} →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })()}

      {/* SECTION 2: KIDS' COLLECTIONS - SHOP BY CATEGORY MASONRY */}
      {(() => {
        const kidsCol = mediaAssets.kidsCollectionsSection || defaultKidsCollectionsSection
        const updateKidsCol = (updates: Partial<typeof kidsCol>) => {
          saveMediaAssets({
            ...mediaAssets,
            kidsCollectionsSection: {
              ...kidsCol,
              ...updates,
            },
          })
        }

        return (
          <section id="sec-kids-collections" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4361ee]">
                  Section 02 • Kids&apos; Collections Masonry
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-[#1A1A1A]">
                  Shop by Category (Clothing, Accessories, Books, Playthings)
                </h3>
                <p className="text-xs text-slate-400">
                  Control images, pill badge titles, subtitles, and link targets for the homepage 3-column category masonry.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={kidsCol.enabled}
                  onChange={(e) => updateKidsCol({ enabled: e.target.checked })}
                  className="accent-[#EB008B] size-4 rounded"
                />
                <span className="text-xs font-bold text-slate-700">Section Enabled</span>
              </label>
            </div>

            {/* Header Titles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={kidsCol.tagline}
                  onChange={(e) => updateKidsCol({ tagline: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  placeholder="KIDS' COLLECTIONS"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={kidsCol.title}
                  onChange={(e) => updateKidsCol({ title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  placeholder="Shop by Category"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle / Description</label>
                <input
                  type="text"
                  value={kidsCol.description}
                  onChange={(e) => updateKidsCol({ description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                  placeholder="Explore our amazing selection of toys..."
                />
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Clothing */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-600">Left Tall: Clothing</span>
                  <span className="text-[10px] text-slate-400">/category/GIRL-DRESS.jpg</span>
                </div>
                <ImageAssetCard
                  label="Clothing Card Image"
                  sublabel="Girl with Leaves"
                  currentSrc={kidsCol.clothing.image}
                  aspectRatio="aspect-[4/5]"
                  onUpdate={(newSrc) =>
                    updateKidsCol({
                      clothing: { ...kidsCol.clothing, image: newSrc },
                    })
                  }
                />
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Title</label>
                  <input
                    type="text"
                    value={kidsCol.clothing.title}
                    onChange={(e) =>
                      updateKidsCol({
                        clothing: { ...kidsCol.clothing, title: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={kidsCol.clothing.subtitle}
                    onChange={(e) =>
                      updateKidsCol({
                        clothing: { ...kidsCol.clothing, subtitle: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none"
                  />
                </div>
                <CategoryLinkSelector
                  label="Target Category Link"
                  value={kidsCol.clothing.href}
                  onChange={(newHref) =>
                    updateKidsCol({
                      clothing: { ...kidsCol.clothing, href: newHref },
                    })
                  }
                />
              </div>

              {/* Card 2: Accessories */}
              <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-pink-600">Mid Top: Accessories</span>
                  <span className="text-[10px] text-slate-400">/category/kids-shoes.jpg</span>
                </div>
                <ImageAssetCard
                  label="Accessories Card Image"
                  sublabel="Pastel Sandals"
                  currentSrc={kidsCol.accessories.image}
                  aspectRatio="aspect-[16/10]"
                  onUpdate={(newSrc) =>
                    updateKidsCol({
                      accessories: { ...kidsCol.accessories, image: newSrc },
                    })
                  }
                />
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Title</label>
                  <input
                    type="text"
                    value={kidsCol.accessories.title}
                    onChange={(e) =>
                      updateKidsCol({
                        accessories: { ...kidsCol.accessories, title: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
                <CategoryLinkSelector
                  label="Target Category Link"
                  value={kidsCol.accessories.href}
                  onChange={(newHref) =>
                    updateKidsCol({
                      accessories: { ...kidsCol.accessories, href: newHref },
                    })
                  }
                />
              </div>

              {/* Card 3: Books */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-600">Mid Bottom: Books</span>
                  <span className="text-[10px] text-slate-400">/category/toy-books.jpg</span>
                </div>
                <ImageAssetCard
                  label="Books Card Image"
                  sublabel="Children's Books"
                  currentSrc={kidsCol.books.image}
                  aspectRatio="aspect-[16/10]"
                  onUpdate={(newSrc) =>
                    updateKidsCol({
                      books: { ...kidsCol.books, image: newSrc },
                    })
                  }
                />
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Title</label>
                  <input
                    type="text"
                    value={kidsCol.books.title}
                    onChange={(e) =>
                      updateKidsCol({
                        books: { ...kidsCol.books, title: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={kidsCol.books.subtitle}
                    onChange={(e) =>
                      updateKidsCol({
                        books: { ...kidsCol.books, subtitle: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none"
                  />
                </div>
                <CategoryLinkSelector
                  label="Target Category Link"
                  value={kidsCol.books.href}
                  onChange={(newHref) =>
                    updateKidsCol({
                      books: { ...kidsCol.books, href: newHref },
                    })
                  }
                />
              </div>

              {/* Card 4: Playthings */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-600">Right Tall: Playthings</span>
                  <span className="text-[10px] text-slate-400">/category/playtime-toys.jpg</span>
                </div>
                <ImageAssetCard
                  label="Playthings Card Image"
                  sublabel="Plush Toys in Basket"
                  currentSrc={kidsCol.playthings.image}
                  aspectRatio="aspect-[4/5]"
                  onUpdate={(newSrc) =>
                    updateKidsCol({
                      playthings: { ...kidsCol.playthings, image: newSrc },
                    })
                  }
                />
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Title</label>
                  <input
                    type="text"
                    value={kidsCol.playthings.title}
                    onChange={(e) =>
                      updateKidsCol({
                        playthings: { ...kidsCol.playthings, title: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={kidsCol.playthings.subtitle}
                    onChange={(e) =>
                      updateKidsCol({
                        playthings: { ...kidsCol.playthings, subtitle: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none"
                  />
                </div>
                <CategoryLinkSelector
                  label="Target Category Link"
                  value={kidsCol.playthings.href}
                  onChange={(newHref) =>
                    updateKidsCol({
                      playthings: { ...kidsCol.playthings, href: newHref },
                    })
                  }
                />
              </div>
            </div>
          </section>
        )
      })()}

      {/* SECTION 2.6: FOR BOYS / FOR GIRLS SPLIT SECTION CMS */}
      {(() => {
        const boysGirls = mediaAssets.boysGirlsSection || defaultBoysGirlsSection
        const updateBoysGirls = (updates: Partial<typeof boysGirls>) => {
          saveMediaAssets({
            ...mediaAssets,
            boysGirlsSection: {
              ...boysGirls,
              ...updates,
            },
          })
        }

        return (
          <section id="sec-boys-girls" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#EB008B]">
                  Section 03 • Promotional Split
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-[#1A1A1A]">
                  For Boys &amp; For Girls Banners
                </h3>
                <p className="text-xs text-slate-400">
                  Control images, headings, button text, and link URLs for the boys and girls split banners.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={boysGirls.enabled}
                  onChange={(e) => updateBoysGirls({ enabled: e.target.checked })}
                  className="accent-[#EB008B] size-4 rounded"
                />
                <span className="text-xs font-bold text-slate-700">Section Enabled</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* For Boys Column */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#3ea2a0]">
                  Boys Banner Card
                </span>
                <ImageAssetCard
                  label="For Boys Banner Image"
                  sublabel="Hero Boy with Cape"
                  currentSrc={boysGirls.boysImage}
                  aspectRatio="aspect-[21/13]"
                  onUpdate={(newSrc) => updateBoysGirls({ boysImage: newSrc })}
                />
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={boysGirls.boysTitle}
                    onChange={(e) => updateBoysGirls({ boysTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={boysGirls.boysButtonText}
                    onChange={(e) => updateBoysGirls({ boysButtonText: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <CategoryLinkSelector
                    label="Target Category Link"
                    value={boysGirls.boysHref}
                    onChange={(newHref) => updateBoysGirls({ boysHref: newHref })}
                  />
                </div>
              </div>

              {/* For Girls Column */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#EB008B]">
                  Girls Banner Card
                </span>
                <ImageAssetCard
                  label="For Girls Banner Image"
                  sublabel="Hero Girl with Cape"
                  currentSrc={boysGirls.girlsImage}
                  aspectRatio="aspect-[21/13]"
                  onUpdate={(newSrc) => updateBoysGirls({ girlsImage: newSrc })}
                />
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={boysGirls.girlsTitle}
                    onChange={(e) => updateBoysGirls({ girlsTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={boysGirls.girlsButtonText}
                    onChange={(e) => updateBoysGirls({ girlsButtonText: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  />
                  <CategoryLinkSelector
                    label="Target Category Link"
                    value={boysGirls.girlsHref}
                    onChange={(newHref) => updateBoysGirls({ girlsHref: newHref })}
                  />
                </div>
              </div>
            </div>
          </section>
        )
      })()}

      {/* SECTION 2.7: FROM CLASSIC TO MODERN TOYS CMS */}
      {(() => {
        const modernToys = mediaAssets.modernToysSection || defaultModernToysSection
        const updateToys = (updates: Partial<typeof modernToys>) => {
          saveMediaAssets({
            ...mediaAssets,
            modernToysSection: {
              ...modernToys,
              ...updates,
            },
          })
        }

        return (
          <section id="sec-modern-toys" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5CB946]">
                  Section 04 • Toys &amp; Gear Showcase
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-[#1A1A1A]">
                  From Classic to Modern Toys &amp; Category Cards
                </h3>
                <p className="text-xs text-slate-400">
                  Manage headline, promotional copy, kid blocks image, and 3 category visual cards.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={modernToys.enabled}
                  onChange={(e) => updateToys({ enabled: e.target.checked })}
                  className="accent-[#5CB946] size-4 rounded"
                />
                <span className="text-xs font-bold text-slate-700">Section Enabled</span>
              </label>
            </div>

            {/* Top Banner Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <ImageAssetCard
                  label="Kid Playing Blocks Image"
                  sublabel="Top Banner Feature"
                  currentSrc={modernToys.bannerImage}
                  aspectRatio="aspect-[4/3]"
                  onUpdate={(newSrc) => updateToys({ bannerImage: newSrc })}
                />
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={modernToys.headline}
                    onChange={(e) => updateToys({ headline: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Promotional Description</label>
                  <textarea
                    rows={2}
                    value={modernToys.description}
                    onChange={(e) => updateToys({ description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Button Label</label>
                    <input
                      type="text"
                      value={modernToys.buttonText}
                      onChange={(e) => updateToys({ buttonText: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <CategoryLinkSelector
                      label="Button Destination Category"
                      value={modernToys.buttonHref}
                      onChange={(newHref) => updateToys({ buttonHref: newHref })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Category Cards */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-4">
                Category Cards (3 Pillars)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modernToys.cards.map((card, cIdx) => (
                  <div key={cIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <ImageAssetCard
                      label={`Card 0${cIdx + 1} Image`}
                      sublabel={card.title}
                      currentSrc={card.image}
                      aspectRatio="aspect-[16/10]"
                      onUpdate={(newSrc) => {
                        const updated = [...modernToys.cards]
                        updated[cIdx] = { ...updated[cIdx], image: newSrc }
                        updateToys({ cards: updated })
                      }}
                    />
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...modernToys.cards]
                          updated[cIdx] = { ...updated[cIdx], title: e.target.value }
                          updateToys({ cards: updated })
                        }}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <CategoryLinkSelector
                      label="Target Category Link"
                      value={card.href}
                      onChange={(newHref) => {
                        const updated = [...modernToys.cards]
                        updated[cIdx] = { ...updated[cIdx], href: newHref }
                        updateToys({ cards: updated })
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* SECTION 7: SHOP BY AGE CMS */}
      {(() => {
        const sba = mediaAssets.shopByAgeSection || defaultShopByAgeSection
        const updateSba = (updates: Partial<typeof sba>) => {
          saveMediaAssets({
            ...mediaAssets,
            shopByAgeSection: {
              ...sba,
              ...updates,
            },
          })
        }

        const updateCard = (index: number, cardUpdates: Partial<(typeof sba.cards)[0]>) => {
          const updatedCards = [...sba.cards]
          updatedCards[index] = {
            ...updatedCards[index],
            ...cardUpdates,
          }
          updateSba({ cards: updatedCards })
        }

        return (
          <section id="sec-shop-by-age" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6]">
                  Section 05 • Age Group Filtering
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-[#1A1A1A]">
                  Shop by Age (Gift Finder Cards)
                </h3>
                <p className="text-xs text-slate-400">
                  Manage headline, subtitle, cards (images, age groups, descriptions, button labels, and link URLs).
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={sba.enabled}
                  onChange={(e) => updateSba({ enabled: e.target.checked })}
                  className="accent-[#EB008B] size-4 rounded"
                />
                <span className="text-xs font-bold text-slate-700">Section Enabled</span>
              </label>
            </div>

            {/* Header Titles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={sba.tagline}
                  onChange={(e) => updateSba({ tagline: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#3b82f6]"
                  placeholder="FIND THE PERFECT GIFT"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={sba.title}
                  onChange={(e) => updateSba({ title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#d6406e]"
                  placeholder="Shop by Age"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Subtitle</label>
                <input
                  type="text"
                  value={sba.description}
                  onChange={(e) => updateSba({ description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#5d47a8]"
                  placeholder="Browse by age group to find exactly what your child needs!"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-3">
                Age Group Cards ({sba.cards?.length || 5} Cards)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {(sba.cards || []).map((card, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex flex-col space-y-3">
                    <ImageAssetCard
                      label={`Card #${idx + 1}`}
                      sublabel={card.title}
                      currentSrc={card.image}
                      aspectRatio="aspect-[4/3]"
                      onUpdate={(newSrc) => updateCard(idx, { image: newSrc })}
                    />
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateCard(idx, { title: e.target.value })}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Description</label>
                      <textarea
                        rows={3}
                        value={card.description}
                        onChange={(e) => updateCard(idx, { description: e.target.value })}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Button Text</label>
                      <input
                        type="text"
                        value={card.buttonText}
                        onChange={(e) => updateCard(idx, { buttonText: e.target.value })}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none"
                      />
                    </div>
                    <CategoryLinkSelector
                      label="Target Category Link"
                      value={card.href}
                      onChange={(newHref) => updateCard(idx, { href: newHref })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* SECTION 8: SHOP BY PRICE CMS */}
      {(() => {
        const sbp = mediaAssets.shopByPriceSection || defaultShopByPriceSection
        const updateSbp = (partial: Partial<ShopByPriceSectionConfig>) => {
          saveMediaAssets({
            ...mediaAssets,
            shopByPriceSection: {
              ...sbp,
              ...partial,
            },
          })
        }
        const updateCard = (index: number, cardPartial: Partial<typeof sbp.cards[0]>) => {
          const updatedCards = [...(sbp.cards || [])]
          updatedCards[index] = {
            ...updatedCards[index],
            ...cardPartial,
          }
          updateSbp({ cards: updatedCards })
        }
        const addCard = () => {
          const updatedCards = [
            ...(sbp.cards || []),
            {
              label: 'Under $50',
              image: '/images/shop by price/kidi1.jpg',
              href: '/products?maxPrice=50',
            },
          ]
          updateSbp({ cards: updatedCards })
        }
        const removeCard = (index: number) => {
          const updatedCards = (sbp.cards || []).filter((_, i) => i !== index)
          updateSbp({ cards: updatedCards })
        }

        return (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6]">
                  Section 06 • Price Bracket Filtering
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-[#1A1A1A]">
                  Shop by Price (Price Slider Cards)
                </h3>
                <p className="text-xs text-slate-400">
                  Manage section title, price cards (images, labels, and target links).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={addCard}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0c709e] px-3 py-1.5 text-xs font-bold transition border border-blue-200/60"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Price Card</span>
                </button>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={sbp.enabled}
                    onChange={(e) => updateSbp({ enabled: e.target.checked })}
                    className="accent-[#EB008B] size-4 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">Section Enabled</span>
                </label>
              </div>
            </div>

            {/* Header Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Heading</label>
              <input
                type="text"
                value={sbp.title}
                onChange={(e) => updateSbp({ title: e.target.value })}
                className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#37497d]"
                placeholder="Shop by price"
              />
            </div>

            {/* Price Cards Grid */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-3">
                Price Cards ({(sbp.cards || []).length} Cards)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {(sbp.cards || []).map((card, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex flex-col space-y-3">
                    <ImageAssetCard
                      label={`Card #${idx + 1}`}
                      sublabel={card.label}
                      currentSrc={card.image}
                      aspectRatio="aspect-square"
                      onUpdate={(newSrc) => updateCard(idx, { image: newSrc })}
                      onRemove={(sbp.cards || []).length > 1 ? () => removeCard(idx) : undefined}
                    />
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Price Label</label>
                      <input
                        type="text"
                        value={card.label}
                        onChange={(e) => updateCard(idx, { label: e.target.value })}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none"
                        placeholder="Under $10"
                      />
                    </div>
                    <CategoryLinkSelector
                      label="Target Category Link"
                      value={card.href}
                      onChange={(newHref) => updateCard(idx, { href: newHref })}
                      placeholder="Select category or price bracket..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* SECTION 06: WE'RE ON INSTAGRAM CMS */}
      <InstagramSectionEditor
        mediaAssets={mediaAssets}
        saveMediaAssets={saveMediaAssets}
      />

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 sm:bottom-6 z-30 flex flex-col xs:flex-row items-center justify-between rounded-xl sm:rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 text-[#1A1A1A] shadow-xl gap-3">
        <div className="text-center xs:text-left">
          <span className="font-bold text-xs sm:text-sm block">All Homepage Sections Active</span>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Changes take effect instantly on the live website.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="w-full xs:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#EB008B] px-5 sm:px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-[#EB008B]/25 transition hover:bg-[#d4007d] shrink-0"
        >
          <Eye className="h-4 w-4" />
          <span>Preview Storefront</span>
        </Link>
      </div>
    </div>
  )
}
