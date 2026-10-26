'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Mail, Phone } from 'lucide-react'
import {
  defaultContactInfo,
  getStoredTaxonomyConfig,
  type StoreContactInfo,
} from '@/lib/store-taxonomy'

// Inline SVG social icons (lucide-react doesn't ship brand icons)
function IgIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function XIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.23H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function FbIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/products?badge=new' },
    { label: 'Baby & Kids Clothing', href: '/products?category=baby-kids-clothing' },
    { label: 'Baby Diapering & Care', href: '/products?category=baby-diapers' },
    { label: 'Educational & Fun Toys', href: '/products?category=toys-gaming' },
    { label: 'Kids Footwear', href: '/products?category=fashion-accessories' },
    { label: 'Moms & Maternity Wear', href: '/products?category=moms-maternity' },
  ],
  categories: [
    { label: 'Rompers & Onesies', href: '/products?category=baby-kids-clothing' },
    { label: 'Frocks & Dresses', href: '/products?category=baby-kids-clothing' },
    { label: 'Pant Style Diapers', href: '/products?category=baby-diapers' },
    { label: 'Baby Strollers & Gear', href: '/products?category=strollers-prams' },
    { label: 'School Bags & Backpacks', href: '/products?category=school-supplies' },
    { label: 'Feeding & Nursing Bottles', href: '/products?category=feeding-nursing' },
  ],
  company: [
    { label: 'About Berry Perry Kids', href: '/about' },
    { label: 'Our Quality Standards', href: '/about' },
    { label: 'Shop by Age Finder', href: '/#shop-by-age' },
    { label: 'Shop by Price', href: '/#shop-by-price' },
    { label: 'Kids Play Collections', href: '/#kids-collections' },
    { label: 'We on Instagram', href: '/#instagram-feed' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchange Policy', href: '/returns' },
    { label: 'Kids Size & Fit Chart', href: '/size-guide' },
  ],
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#EB008B] sm:mb-5">{title}</h3>
      <ul className="flex flex-col gap-2.5 sm:gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group flex items-center gap-2 text-xs font-semibold text-neutral-600 transition-colors duration-200 hover:text-[#EB008B]"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-[#5CB946] transition-transform duration-200 group-hover:scale-150 group-hover:bg-[#EB008B]" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  const [contact, setContact] = useState<StoreContactInfo>(defaultContactInfo)
  const [logoSrc, setLogoSrc] = useState<string>('/images/berryperry_logo.png')

  useEffect(() => {
    // Initial sync from localStorage
    const conf = getStoredTaxonomyConfig()
    if (conf?.contactInfo) {
      setContact(conf.contactInfo)
    }

    // Initial media assets sync
    import('@/lib/site-assets').then(({ getActiveSiteAssets, fetchSiteAssetsAsync }) => {
      const initial = getActiveSiteAssets()
      if (initial?.logo) setLogoSrc(initial.logo)
      fetchSiteAssetsAsync().then((fresh) => {
        if (fresh?.logo) setLogoSrc(fresh.logo)
      }).catch(() => {})
    })

    // Listen to real-time Admin updates via storage event
    const handleSync = () => {
      const updated = getStoredTaxonomyConfig()
      if (updated?.contactInfo) {
        setContact(updated.contactInfo)
      }
      import('@/lib/site-assets').then(({ getActiveSiteAssets }) => {
        const fresh = getActiveSiteAssets()
        if (fresh?.logo) setLogoSrc(fresh.logo)
      })
    }
    window.addEventListener('storage', handleSync)

    // Background fetch from MongoDB API
    fetch('/api/taxonomy')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.taxonomy?.contactInfo) {
          setContact({ ...defaultContactInfo, ...data.taxonomy.contactInfo })
        }
      })
      .catch(() => {})

    return () => window.removeEventListener('storage', handleSync)
  }, [])

  const email = contact.email || defaultContactInfo.email
  const phone = contact.phone || defaultContactInfo.phone
  const address = contact.address || defaultContactInfo.address

  return (
    <footer className="border-t border-[#f0ece1] bg-[#faf8f5] text-[#1A1A1A]">
      {/* Light Newsletter Strip with playful brand accents */}
      <div className="border-b border-[#f0ece1] bg-[#fffbf2]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 px-4 py-5 sm:gap-4 sm:px-6 md:flex-row md:items-center md:px-12 md:py-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#5CB946]" />
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#EB008B]">For Little Smiles &amp; Happy Days</p>
            </div>
            <h2 className="mt-1 text-base font-black tracking-tight text-[#1A1A1A] sm:text-lg md:text-xl">
              Get exclusive Berry Perry kids deals &amp; new arrivals
            </h2>
          </div>
          <form
            className="flex w-full max-w-md overflow-hidden rounded-full border-2 border-[#5CB946]/40 bg-white shadow-xs transition-colors duration-300 focus-within:border-[#EB008B]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email for 15% off"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-xs text-[#1A1A1A] placeholder-neutral-400 outline-none"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 bg-[#EB008B] px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#5CB946]"
            >
              Subscribe <ArrowRight className="size-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:px-12 md:py-14">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 lg:pr-8">
            <Link href="/" aria-label="Berry Perry home">
              <div className="relative h-16 sm:h-20 w-48 sm:w-56 overflow-hidden rounded-2xl bg-white p-2 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
                <Image
                  src={logoSrc || '/images/berryperry_logo.png'}
                  alt="Berry Perry Kids"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 192px, 224px"
                />
              </div>
            </Link>

            <p className="mt-4 max-w-xs text-xs leading-relaxed text-neutral-600 font-medium">
              India&apos;s joyful destination for certified safe baby clothing, educational toys, nursery essentials, and comfortable maternity wear.
            </p>

            {/* Dynamic Contact info from Admin */}
            <ul className="mt-5 flex flex-col gap-2.5 text-xs text-neutral-700">
              <li className="flex items-center gap-2.5">
                <div className="flex size-6 items-center justify-center rounded-full bg-[#EB008B]/10 text-[#EB008B]">
                  <Mail className="size-3.5 shrink-0" />
                </div>
                <a href={`mailto:${email}`} className="font-semibold transition-colors hover:text-[#EB008B]">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex size-6 items-center justify-center rounded-full bg-[#5CB946]/10 text-[#5CB946]">
                  <Phone className="size-3.5 shrink-0" />
                </div>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-semibold transition-colors hover:text-[#5CB946]">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="flex size-6 items-center justify-center rounded-full bg-[#FFF000]/40 text-[#c28e00]">
                  <MapPin className="size-3.5 shrink-0" />
                </div>
                <span className="leading-snug">{address}</span>
              </li>
            </ul>

            {/* Social Icons with Dynamic Links */}
            <div className="mt-6 flex gap-2.5">
              {[
                { Icon: IgIcon, label: 'Instagram', href: contact.instagram || 'https://www.instagram.com/berryperryofficial/' },
                { Icon: XIcon, label: 'X (Twitter)', href: contact.twitter || 'https://x.com' },
                { Icon: FbIcon, label: 'Facebook', href: contact.facebook || 'https://www.facebook.com/BerryPerryOfficial/' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-all duration-200 hover:border-[#EB008B] hover:bg-[#EB008B] hover:text-white hover:scale-105"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Shop" links={footerLinks.shop} />
          <FooterCol title="Categories" links={footerLinks.categories} />
          <FooterCol title="Company" links={footerLinks.company} />
          <FooterCol title="Support" links={footerLinks.support} />
        </div>

        {/* Divider + Bottom Bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-[#f0ece1] pt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500 sm:mt-14 sm:gap-5 sm:pt-7 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Berry Perry Kids. All Rights Reserved.</span>
          <div className="flex flex-wrap gap-4 sm:gap-6 font-semibold">
            <Link href="/privacy" className="transition-colors hover:text-[#EB008B]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#EB008B]">
              Terms &amp; Conditions
            </Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-[#EB008B]">
              Cookie Policy
            </Link>
          </div>
          <span className="font-extrabold tracking-wider text-[#5CB946] flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#EB008B]" />
            Loved by Kids &amp; Parents
          </span>
        </div>
      </div>
    </footer>
  )
}
