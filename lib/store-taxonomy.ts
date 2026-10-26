export interface MainCategoryItem {
  id: string
  label: string
  value: string
  navAlias?: string // Short custom nickname/alias specifically displayed on the header navbar
  showOnNavbar?: boolean
  description?: string
  order?: number
}

export interface CategoryItem {
  id: string
  label: string
  value: string
  parentCategory?: string // slug value of MainCategoryItem (e.g. 'men', 'women', 'cricket', 'accessories')
  sport?: string
  description?: string
  image?: string
}

export interface TagBadgeItem {
  id: string
  name: string
  bgColor: string
  textColor: string
  description?: string
}

export interface SportItem {
  id: string
  label: string
  value: string
  icon?: string
}

export interface SiteAnnouncementItem {
  id?: string
  text: string
  linkText?: string
  linkHref?: string
}

export interface SiteAnnouncement {
  enabled: boolean
  text: string
  linkText?: string
  linkHref?: string
  items?: SiteAnnouncementItem[]
  bgColor?: string
  textColor?: string
}

export interface StoreContactInfo {
  email: string
  phone: string
  whatsapp: string
  address: string
  hours: string
  instagram: string
  youtube: string
  facebook: string
  twitter: string
}

export interface StoreTaxonomyConfig {
  mainCategories: MainCategoryItem[]
  categories: CategoryItem[]
  sports: SportItem[]
  badges: TagBadgeItem[]
  sizes: string[]
  announcement: SiteAnnouncement
  contactInfo: StoreContactInfo
}

export const TAXONOMY_STORAGE_KEY = 'berryperry_taxonomy_config_v1'

import { firstCryCategoryHierarchy } from './firstcry-categories'

export const defaultMainCategories: MainCategoryItem[] = firstCryCategoryHierarchy.map((cat, idx) => ({
  id: `main-${cat.slug}`,
  label: cat.name,
  value: cat.slug,
  showOnNavbar: idx < 10,
  description: `${cat.name} collections`,
  order: idx + 1,
}))

export const defaultCategories: CategoryItem[] = firstCryCategoryHierarchy.flatMap((cat) =>
  cat.children.map((sub, sIdx) => ({
    id: sub.id,
    label: sub.name,
    value: sub.slug,
    parentCategory: cat.slug,
    description: `${sub.name} under ${cat.name}`,
    image: '',
  }))
)

export const defaultSports: SportItem[] = [
  { id: 'sp-clothing', label: 'Baby & Kids Clothing', value: 'clothing' },
  { id: 'sp-diapering', label: 'Diapering & Hygiene', value: 'diapering' },
  { id: 'sp-toys', label: 'Toys & Gaming', value: 'toys' },
  { id: 'sp-footwear', label: 'Kids Footwear', value: 'footwear' },
  { id: 'sp-school', label: 'School Supplies', value: 'school' },
  { id: 'sp-maternity', label: 'Moms & Maternity', value: 'maternity' },
]

export const defaultBadges: TagBadgeItem[] = [
  { id: 'b-new', name: 'NEW', bgColor: '#EB008B', textColor: '#ffffff' },
  { id: 'b-bestseller', name: 'BESTSELLER', bgColor: '#1A1A1A', textColor: '#ffffff' },
  { id: 'b-hot', name: 'HOT', bgColor: '#FFF000', textColor: '#1A1A1A' },
  { id: 'b-limited', name: 'LIMITED', bgColor: '#6B21A8', textColor: '#ffffff' },
  { id: 'b-sale', name: 'SALE', bgColor: '#5CB946', textColor: '#ffffff' },
  { id: 'b-pro', name: 'PRO GRADE', bgColor: '#2563eb', textColor: '#ffffff' },
]

export const defaultSizes: string[] = [
  'Newborn', '0-3M', '3-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', 'Free Size'
]

export const defaultAnnouncement: SiteAnnouncement = {
  enabled: true,
  text: '👶 FREE ALL-INDIA SHIPPING ON ORDERS OVER ₹999 • USE CODE "BERRY10" FOR 10% OFF',
  linkText: 'Shop New Arrivals',
  linkHref: '/products?badge=new',
  items: [
    {
      id: 'ann-1',
      text: '👶 FREE ALL-INDIA SHIPPING ON ORDERS OVER ₹999 • USE CODE "BERRY10" FOR 10% OFF',
      linkText: 'Shop New Arrivals',
      linkHref: '/products?badge=new',
    },
    {
      id: 'ann-2',
      text: '🍼 PREMIUM BABY CARE, DIAPERS & NURSERY ESSENTIALS NOW IN STOCK',
      linkText: 'Explore Baby Care',
      linkHref: '/products?category=baby-diapers',
    },
    {
      id: 'ann-3',
      text: '🧸 FLAT 20% OFF ON ALL EDUCATIONAL TOYS & KIDS APPAREL THIS WEEK',
      linkText: 'Shop Kids Toys',
      linkHref: '/products?category=toys-gaming',
    },
  ],
  bgColor: '#1A1A1A',
  textColor: '#ffffff',
}

export const defaultContactInfo: StoreContactInfo = {
  email: 'support@berryperry.com',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  address: 'Plot 45, Fashion & Apparel District, New Delhi, India 110001',
  hours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  instagram: 'https://www.instagram.com/berryperryofficial/',
  youtube: 'https://www.youtube.com/@BerryPerryOfficial',
  facebook: 'https://www.facebook.com/BerryPerryOfficial/',
  twitter: 'https://x.com/berryperry',
}

export const defaultTaxonomyConfig: StoreTaxonomyConfig = {
  mainCategories: defaultMainCategories,
  categories: defaultCategories,
  sports: defaultSports,
  badges: defaultBadges,
  sizes: defaultSizes,
  announcement: defaultAnnouncement,
  contactInfo: defaultContactInfo,
}

export function getStoredTaxonomyConfig(): StoreTaxonomyConfig {
  if (typeof window === 'undefined') return defaultTaxonomyConfig
  try {
    const raw = localStorage.getItem(TAXONOMY_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const parsedAnnouncement = parsed.announcement || {}
      return {
        ...defaultTaxonomyConfig,
        ...parsed,
        mainCategories: parsed.mainCategories?.length ? parsed.mainCategories : defaultMainCategories,
        categories: parsed.categories?.length ? parsed.categories : defaultCategories,
        sports: parsed.sports?.length ? parsed.sports : defaultSports,
        badges: parsed.badges?.length ? parsed.badges : defaultBadges,
        sizes: parsed.sizes?.length ? parsed.sizes : defaultSizes,
        announcement: {
          ...defaultAnnouncement,
          ...parsedAnnouncement,
          items: Array.isArray(parsedAnnouncement.items) && parsedAnnouncement.items.length > 0
            ? parsedAnnouncement.items
            : (parsedAnnouncement.text ? [{ text: parsedAnnouncement.text, linkText: parsedAnnouncement.linkText, linkHref: parsedAnnouncement.linkHref }] : defaultAnnouncement.items),
        },
        contactInfo: { ...defaultContactInfo, ...(parsed.contactInfo || {}) },
      }
    }
  } catch {}
  return defaultTaxonomyConfig
}
