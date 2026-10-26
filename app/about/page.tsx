import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'About Berry Perry | Joyful Baby & Kids Clothing, Toys & Nursery Essentials',
  description:
    'Berry Perry is dedicated to bringing moms, babies, and kids premium apparel, ultra-soft newborn essentials, educational toys, and baby care designed for everyday comfort and smiles.',
}

const corePillars = [
  {
    number: '01',
    title: 'GENTLE & CERTIFIED SAFE',
    description:
      'Ultra-soft 100% organic cotton, non-toxic dyes, and dermatologist-tested materials crafted specifically for sensitive baby skin.',
  },
  {
    number: '02',
    title: 'DESIGNED FOR PLAY & GROWTH',
    description:
      'Comfortable fits, stretchable rompers, durable stitching, and easy snap-buttons that make dressing and diaper changes effortless.',
  },
  {
    number: '03',
    title: 'PARENT-TRUSTED EVERY DAY',
    description:
      'From newborn hospital bags to toddler adventures and school days, Berry Perry is with your family at every developmental milestone.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#080d2d]">
      <SiteHeader />

      <main className="relative overflow-hidden">
        {/* Top Section */}
        <section className="relative mx-auto max-w-[1440px] px-6 pt-10 pb-20 md:px-12 lg:px-16 lg:pt-14 lg:pb-28">
          {/* Subtle Watermark Number in top right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 select-none font-black text-[#080d2d]/[0.035] sm:right-10 sm:top-2 text-[140px] sm:text-[220px] md:text-[300px] lg:text-[380px] leading-none tracking-tighter"
          >
            BP
          </div>

          {/* Breadcrumb / Top Header Label Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-neutral-200/80 pb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#6b7280]">
            <span className="text-[#080d2d]">ABOUT BERRY PERRY</span>
            <span className="tracking-[0.25em] text-[#9ca3af]">FOR BABIES & KIDS</span>
          </div>

          {/* Hero Statement Block */}
          <div className="relative z-10 mt-14 grid grid-cols-1 items-end gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              {/* Category pill / tag */}
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#EB008B]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#EB008B]">
                  LOVED BY MOMS & BABIES
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#080d2d] sm:text-6xl md:text-7xl lg:text-[86px] lg:leading-[0.92]">
                GROWING UP
                <br />
                WITH JOY.
              </h1>
            </div>

            {/* Intro paragraph with left accent border */}
            <div className="lg:col-span-4 lg:pb-3">
              <div className="border-l-2 border-[#EB008B] pl-6">
                <p className="text-base font-medium leading-relaxed text-[#4b5563] sm:text-lg">
                  <strong className="font-semibold text-[#080d2d]">Berry Perry was created for families</strong> — curating the softest baby clothes, safe educational toys, and daily parenting essentials all in one warm, welcoming place.
                </p>
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="relative z-10 mt-24 border-t border-neutral-200/80 pt-16 lg:mt-32 lg:pt-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Section Sub-label */}
              <div className="lg:col-span-3">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#9ca3af]">
                  01 — OUR STORY
                </span>
              </div>

              {/* Main Headline & Two-column narrative */}
              <div className="lg:col-span-9">
                <h2 className="text-3xl font-black uppercase tracking-tight text-[#080d2d] sm:text-4xl md:text-5xl lg:leading-[1.1]">
                  SOFTNESS YOU CAN FEEL.
                  <br />
                  <span className="text-[#EB008B]">SMILES YOU CAN CHERISH.</span>
                </h2>

                <div className="mt-8 grid grid-cols-1 gap-8 text-[15px] leading-relaxed text-[#4b5563] sm:grid-cols-2 lg:mt-10 lg:gap-12">
                  <p>
                    Berry Perry is India’s dedicated shopping hub for babies, kids, and mothers. Just like how parents look for the most delicate fabrics and safe designs, every single outfit, toy, and nursery piece in our catalog is thoughtfully handpicked and quality-checked.
                  </p>
                  <p>
                    We believe parenting should be full of delight and peace of mind. From organic cotton onesies and cozy bedtime sleepsuits to sensory toys and trendy kids fashion, Berry Perry brings comfort straight to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars Grid */}
          <div className="relative z-10 mt-20 border-t border-neutral-200/80 pt-14 lg:mt-28">
            <div className="grid grid-cols-1 divide-y divide-neutral-200/80 md:grid-cols-3 md:divide-x md:divide-y-0">
              {corePillars.map((pillar, idx) => (
                <div
                  key={pillar.number}
                  className={`flex flex-col justify-between py-8 md:py-6 ${
                    idx === 0
                      ? 'md:pr-8'
                      : idx === 1
                      ? 'md:px-8'
                      : 'md:pl-8'
                  }`}
                >
                  <div>
                    <span className="text-[12px] font-black tracking-wider text-[#EB008B]">
                      {pillar.number}
                    </span>
                    <h3 className="mt-4 text-base font-black uppercase tracking-tight text-[#080d2d] sm:text-lg">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bold Statement & CTA */}
          <div className="relative z-10 mt-24 border-t border-neutral-200/80 pt-16 lg:mt-32 lg:pt-20">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tight text-[#080d2d] sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.95]">
                  EVERY LITTLE STEP
                  <br />
                  DESERVES
                  <br />
                  <span className="text-[#EB008B]">
                    THE GENTLEST
                    <br />
                    TOUCH.
                  </span>
                </h2>
              </div>

              <div className="pb-2">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#080d2d] transition-colors duration-200 hover:text-[#EB008B]"
                >
                  <span>SHOP BABY & KIDS</span>
                  <ArrowUpRight className="size-4 text-[#EB008B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
