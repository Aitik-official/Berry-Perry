export type ImageSlot = { src?: string; alt?: string; caption?: string }

export type PromotionalSlide = {
  findGame?: string
  cricketAction?: string
}

export type CategoryAssets = {
  men: string
  women: string
  youth: string
  cap: string
  kitbags: string
  accessories: string
}

export type TeamwearSlideItem = {
  image: string
  alt?: string
}

export type PromotionalSectionAssets = {
  leftPoster: string
  rightPoster: string
}

export type ShowcaseProductItem = {
  productSlug: string
  tag: string
  quickDescription: string
  reel1Title: string
  reel1Label: string
  reel1Video: string
  reel2Title: string
  reel2Label: string
  reel2Video: string
}

export type WelcomeTrustBadge = {
  icon: 'shipping' | 'return' | 'payment' | 'support'
  title: string
  subtitle: string
}

export type HeroBannerSlideConfig = {
  backgroundImage: string
  taglineTop: string      // e.g. "SPRING COLLECTION"
  taglineBottom: string   // e.g. "FOR MODERN KIDS"
  buttonText?: string     // e.g. "SHOP NOW"
  buttonHref?: string     // e.g. "/products"
  topBadgeColor?: string  // e.g. "#40B4A6" (teal)
  bottomBadgeColor?: string // e.g. "#FF5A87" (coral pink)
}

export const defaultHeroBannerSlide: HeroBannerSlideConfig = {
  backgroundImage: '/images/kids_spring_banner_bg.jpg',
  taglineTop: 'SPRING COLLECTION',
  taglineBottom: 'FOR MODERN KIDS',
  buttonText: 'SHOP COLLECTION',
  buttonHref: '/products?badge=new',
  topBadgeColor: '#40B4A6',
  bottomBadgeColor: '#FF5A87',
}

export const defaultHeroSlides: HeroBannerSlideConfig[] = [
  {
    backgroundImage: '/images/kids_spring_banner_bg.jpg',
    taglineTop: 'SPRING COLLECTION',
    taglineBottom: 'FOR MODERN KIDS',
    buttonText: 'SHOP COLLECTION',
    buttonHref: '/products?badge=new',
    topBadgeColor: '#40B4A6',
    bottomBadgeColor: '#FF5A87',
  },
  {
    backgroundImage: '/images/kids_spring_banner_bg.jpg',
    taglineTop: 'SUMMER PLAYWEAR',
    taglineBottom: 'EXPLORE & PLAY',
    buttonText: 'EXPLORE NOW',
    buttonHref: '/products?category=boys-fashion',
    topBadgeColor: '#4361EE',
    bottomBadgeColor: '#FF8A00',
  },
  {
    backgroundImage: '/images/kids_spring_banner_bg.jpg',
    taglineTop: 'EXCLUSIVE DROPS',
    taglineBottom: 'PREMIUM QUALITY',
    buttonText: 'SHOP BEST SELLERS',
    buttonHref: '/products?category=girls-fashion',
    topBadgeColor: '#7928CA',
    bottomBadgeColor: '#00C853',
  },
]

export type WelcomeSectionConfig = {
  enabled: boolean
  title: string
  description1: string
  subheading: string
  description2: string
  buttonText: string
  buttonHref: string
  image: string
  trustBadges: WelcomeTrustBadge[]
}

export type BoysGirlsSectionConfig = {
  enabled: boolean
  boysImage: string
  boysTitle: string
  boysButtonText: string
  boysHref: string
  girlsImage: string
  girlsTitle: string
  girlsButtonText: string
  girlsHref: string
}

export type ModernToysCategoryCard = {
  title: string
  image: string
  href: string
}

export type ModernToysSectionConfig = {
  enabled: boolean
  headline: string
  description: string
  buttonText: string
  buttonHref: string
  bannerImage: string
  cards: ModernToysCategoryCard[]
}

export type KidsCollectionItem = {
  title: string
  subtitle: string
  image: string
  href: string
  icon?: string
}

export type KidsCollectionsSectionConfig = {
  enabled: boolean
  tagline: string
  title: string
  description: string
  clothing: KidsCollectionItem
  accessories: KidsCollectionItem
  books: KidsCollectionItem
  playthings: KidsCollectionItem
}

export type InstagramSectionConfig = {
  enabled: boolean
  tagline: string
  title: string
  handle: string
  handleHref?: string
  images: string[]
}

export type ShopByAgeCard = {
  title: string
  description: string
  image: string
  buttonText: string
  href: string
}

export type ShopByAgeSectionConfig = {
  enabled: boolean
  tagline: string
  title: string
  description: string
  cards: ShopByAgeCard[]
}

export type ShopByPriceCard = {
  label: string
  image: string
  href: string
}

export type ShopByPriceSectionConfig = {
  enabled: boolean
  title: string
  cards: ShopByPriceCard[]
}

export type SiteMediaAssets = {
  logo: string
  heroBanners: string[]
  heroBannerConfig?: HeroBannerSlideConfig
  heroSlides?: HeroBannerSlideConfig[]
  promotionalSlides: PromotionalSlide[]
  promotionalSection: PromotionalSectionAssets
  categories: CategoryAssets
  videoThumbnail: string
  mainVideo: string
  actionReelVideo: string
  teamwearBanner: string
  teamwearSlides: string[]
  partnerLogos: string[]
  showcaseProducts: ShowcaseProductItem[]
  welcomeSection?: WelcomeSectionConfig
  boysGirlsSection?: BoysGirlsSectionConfig
  modernToysSection?: ModernToysSectionConfig
  kidsCollectionsSection?: KidsCollectionsSectionConfig
  instagramSection?: InstagramSectionConfig
  shopByAgeSection?: ShopByAgeSectionConfig
  shopByPriceSection?: ShopByPriceSectionConfig
}

export const defaultShowcaseProducts: ShowcaseProductItem[] = [
  {
    productSlug: 'virat-pro-match-cricket-jersey',
    tag: 'Berry Perry Featured',
    quickDescription: 'Ultra-breathable micro-mesh engineered for maximum airflow and match intensity.',
    reel1Title: 'Cover Drive & Bat Speed Drill',
    reel1Label: 'Batting Reel',
    reel1Video: '/videos/display_video.mp4',
    reel2Title: 'Pitch Intensity & All-Round Agility',
    reel2Label: 'Action Reel',
    reel2Video: '/videos/jadeja.mp4',
  },
  {
    productSlug: 'virat-all-weather-performance-tracksuit',
    tag: 'All-Weather Kit',
    quickDescription: '4-way ergonomic stretch for sprint acceleration and weather resistance.',
    reel1Title: 'Pre-Match Warmups & Sprints',
    reel1Label: 'Agility Reel',
    reel1Video: '/videos/display_video.mp4',
    reel2Title: 'On-Field Sprint & Slide',
    reel2Label: 'Fielding Action',
    reel2Video: '/videos/jadeja.mp4',
  },
  {
    productSlug: 'virat-championship-curved-peak-cap',
    tag: 'Official Merch',
    quickDescription: 'Curved visor with UV 50+ protection and moisture-wicking sweatband.',
    reel1Title: 'Sunny Outfield High-Catch Drill',
    reel1Label: 'Fielding Reel',
    reel1Video: '/videos/display_video.mp4',
    reel2Title: 'Dynamic Pitch Movement',
    reel2Label: 'Match Action',
    reel2Video: '/videos/jadeja.mp4',
  },
]

export const defaultWelcomeSection: WelcomeSectionConfig = {
  enabled: false,
  title: 'Welcome to Berry Perry Kids Shop',
  description1:
    'Anyone who has visited a Berry Perry shop knows that its more than just a shop. It’s an incredible experience - history and fun all rolled into one. Here’s how that came to be.',
  subheading: 'What Berry Perry Promise?',
  description2:
    'All products sold on the Berry Perry website are certified for the highest quality of materials and child safety. We handpick toys, baby care, and apparel only from ethical and reputed brands. We don’t play around when it comes to quality.',
  buttonText: 'Read More',
  buttonHref: '/about',
  image: 'https://cdn.fcglcdn.com/brainbees/images/products/400x485/16310907a.jpg',
  trustBadges: [
    {
      icon: 'shipping',
      title: 'FREE SHIPPING',
      subtitle: 'When you spend $100+',
    },
    {
      icon: 'return',
      title: 'FREE RETURNS',
      subtitle: '30-days free return policy.',
    },
    {
      icon: 'payment',
      title: 'SECURED PAYMENTS',
      subtitle: 'We accept all credit cards.',
    },
    {
      icon: 'support',
      title: '24/7 HELP CENTER',
      subtitle: 'Dedicated 24/7 support.',
    },
  ],
}

export const defaultBoysGirlsSection: BoysGirlsSectionConfig = {
  enabled: true,
  boysImage: '/images/boys.jpg',
  boysTitle: 'For boys',
  boysButtonText: 'SHOP NOW →',
  boysHref: '/products?category=baby-kids-clothing&gender=boys',
  girlsImage: '/images/girls.jpg',
  girlsTitle: 'For girls',
  girlsButtonText: 'SHOP NOW →',
  girlsHref: '/products?category=baby-kids-clothing&gender=girls',
}

export const defaultModernToysSection: ModernToysSectionConfig = {
  enabled: true,
  headline: 'From classic to modern toys',
  description: 'Get 20% on all toys. Shop the Latest Styles: Stay ahead of the curve with our best sellers',
  buttonText: 'Shop Now',
  buttonHref: '/products?category=toys-gaming',
  bannerImage: '/images/sections/kid_wooden_blocks.png',
  cards: [
    {
      title: 'Baby Carry Cot',
      image: '/images/sections/card_baby_carry_cot.png',
      href: '/products?category=baby-gear',
    },
    {
      title: 'Baby Strollers',
      image: '/images/sections/card_baby_strollers.png',
      href: '/products?category=baby-gear',
    },
    {
      title: 'Kids Cars',
      image: '/images/sections/card_kids_cars.png',
      href: '/products?category=toys-gaming',
    },
  ],
}
export const defaultKidsCollectionsSection: KidsCollectionsSectionConfig = {
  enabled: true,
  tagline: "KIDS' COLLECTIONS",
  title: 'Shop by Category',
  description: 'Explore our amazing selection of toys, clothing, books, and accessories',
  clothing: {
    title: 'Clothing',
    subtitle: 'Comfy & Stylish',
    image: '/category/GIRL-DRESS.jpg',
    href: '/products?category=baby-kids-clothing',
  },
  accessories: {
    title: 'Accessories',
    subtitle: 'Cute & Trendy',
    image: '/category/kids-shoes.jpg',
    href: '/products?category=fashion-accessories',
    icon: '✨',
  },
  books: {
    title: 'Books',
    subtitle: 'Stories & Learning',
    image: '/category/kids-learning.jpg',
    href: '/products?category=school-supplies',
    icon: '📚',
  },
  playthings: {
    title: 'Playthings',
    subtitle: 'Fun & Educational',
    image: '/category/playtime-toys.jpg',
    href: '/products?category=toys-gaming',
  },
}

export const defaultInstagramSection: InstagramSectionConfig = {
  enabled: true,
  tagline: 'FOLLOW US',
  title: "We're on Instagram",
  handle: '@adornthemes',
  handleHref: 'https://instagram.com/adornthemes',
  images: [
    '/images/instagram/insta_1.jpg',
    '/images/instagram/insta_2.jpg',
    '/images/instagram/insta_3.jpg',
    '/images/instagram/insta_4.jpg',
    '/images/instagram/insta_5.jpg',
    '/images/instagram/insta_6.jpg',
    '/images/instagram/insta_7.jpg',
    '/images/instagram/insta_8.jpg',
    '/images/instagram/insta_9.jpg',
    '/images/instagram/insta_10.jpg',
  ],
}

export const defaultShopByAgeSection: ShopByAgeSectionConfig = {
  enabled: true,
  tagline: 'FIND THE PERFECT GIFT',
  title: 'Shop by Age',
  description: 'Browse by age group to find exactly what your child needs!',
  cards: [
    {
      title: 'Babies (0-12 months)',
      description: 'Soft toys, rattles, and sensory items perfect for newborns and infants.',
      image: '/images/shop_by_age/kido1.png',
      buttonText: 'SHOP NOW',
      href: '/products?category=baby-diapering',
    },
    {
      title: 'Toddlers (1-3 years)',
      description: 'Colorful toys, building blocks, and interactive games for curious toddlers.',
      image: '/images/shop_by_age/kido2.jpg',
      buttonText: 'SHOP NOW',
      href: '/products?category=toys-gaming',
    },
    {
      title: 'Young Kids (4-6 years)',
      description: 'Action figures, musical instruments, and educational fun for energetic youngsters.',
      image: '/images/shop_by_age/kido3.jpg',
      buttonText: 'SHOP NOW',
      href: '/products?category=toys-gaming',
    },
    {
      title: 'Kids (7-9 years)',
      description: 'Puzzles, board games, and creative challenges for curious growing minds.',
      image: '/images/shop_by_age/kido4.jpg',
      buttonText: 'SHOP NOW',
      href: '/products?category=baby-kids-clothing',
    },
    {
      title: 'Tweens & Teens (10-14 years)',
      description: 'Sports equipment, outdoor games, and active lifestyle gear for older kids.',
      image: '/images/shop_by_age/kido5.jpg',
      buttonText: 'SHOP NOW',
      href: '/products?category=school-supplies',
    },
  ],
}

export const defaultShopByPriceSection: ShopByPriceSectionConfig = {
  enabled: true,
  title: 'Shop by price',
  cards: [
    {
      label: 'Under $10',
      image: '/images/shop by price/kidi1.jpg',
      href: '/products?maxPrice=10',
    },
    {
      label: 'Under $20',
      image: '/images/shop by price/kidi2.jpg',
      href: '/products?maxPrice=20',
    },
    {
      label: 'Under $40',
      image: '/images/shop by price/kidi3.jpg',
      href: '/products?maxPrice=40',
    },
    {
      label: 'Under $60',
      image: '/images/shop by price/kidi4.jpg',
      href: '/products?maxPrice=60',
    },
    {
      label: 'Under $100',
      image: '/images/shop by price/kidi5.jpg',
      href: '/products?maxPrice=100',
    },
    {
      label: 'Over $100',
      image: '/images/shop by price/kidi6.jpg',
      href: '/products?minPrice=100',
    },
  ],
}

export const defaultSiteAssets: SiteMediaAssets = {
  logo: '/images/berryperry_logo.png',
  heroBanners: [
    '/images/kids_spring_banner_bg.jpg',
  ],
  heroBannerConfig: defaultHeroBannerSlide,
  heroSlides: defaultHeroSlides,
  promotionalSlides: [{ findGame: '/images/Rohit.jpeg', cricketAction: '/images/SKY.jpeg' }],
  promotionalSection: {
    leftPoster: '/images/Rohit.jpeg',
    rightPoster: '/images/SKY.jpeg',
  },
  categories: {
    men: '/images/category/mens.jpeg',
    women: '/images/category/women.png',
    youth: '/images/category/youth.jpg',
    cap: '/images/category/cap.png',
    kitbags: '/images/category/bagpack.png',
    accessories: '/images/category/ACCESSORIES.png',
  },
  videoThumbnail: '',
  mainVideo: '/videos/display_video.mp4',
  actionReelVideo: '/videos/jadeja.mp4',
  teamwearBanner: '/images/TeamWear/TeamWear1.png',
  teamwearSlides: [
    '/images/TeamWear/TeamWear4.png',
    '/images/TeamWear/TeamWear1.png',
    '/images/TeamWear/TeamWear2.png',
    '/images/TeamWear/TeamWare3.png',
  ],
  partnerLogos: [
    '/images/Partners/1.png',
    '/images/Partners/2.png',
    '/images/Partners/3.png',
    '/images/Partners/4.png',
    '/images/Partners/5.png',
    '/images/Partners/6.png',
    '/images/Partners/7.png',
    '/images/Partners/8.png',
    '/images/Partners/9.png',
    '/images/Partners/10.png',
    '/images/Partners/11.png',
    '/images/Partners/12.png',
  ],
  showcaseProducts: defaultShowcaseProducts,
  welcomeSection: defaultWelcomeSection,
  boysGirlsSection: defaultBoysGirlsSection,
  modernToysSection: defaultModernToysSection,
  kidsCollectionsSection: defaultKidsCollectionsSection,
  instagramSection: defaultInstagramSection,
  shopByAgeSection: defaultShopByAgeSection,
  shopByPriceSection: defaultShopByPriceSection,
}

export const MEDIA_STORAGE_KEY = 'berryperry_site_media_assets_v1'

/**
 * Returns either client-overridden media assets from localStorage
 * or default site assets.
 */
export function getActiveSiteAssets(): SiteMediaAssets {
  if (typeof window === 'undefined') {
    return defaultSiteAssets
  }
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...defaultSiteAssets,
        ...parsed,
        heroBannerConfig: {
          ...defaultHeroBannerSlide,
          ...(parsed.heroBannerConfig || {}),
        },
        heroSlides: parsed.heroSlides && parsed.heroSlides.length > 0
          ? parsed.heroSlides
          : defaultHeroSlides,
        promotionalSection: {
          ...defaultSiteAssets.promotionalSection,
          ...(parsed.promotionalSection || {}),
        },
        categories: { ...defaultSiteAssets.categories, ...(parsed.categories || {}) },
        showcaseProducts: parsed.showcaseProducts && parsed.showcaseProducts.length > 0
          ? parsed.showcaseProducts
          : defaultShowcaseProducts,
        welcomeSection: {
          ...defaultWelcomeSection,
          ...(parsed.welcomeSection || {}),
        },
        boysGirlsSection: {
          ...defaultBoysGirlsSection,
          ...(parsed.boysGirlsSection || {}),
        },
        modernToysSection: {
          ...defaultModernToysSection,
          ...(parsed.modernToysSection || {}),
        },
        kidsCollectionsSection: {
          ...defaultKidsCollectionsSection,
          ...(parsed.kidsCollectionsSection || {}),
        },
        instagramSection: {
          ...defaultInstagramSection,
          ...(parsed.instagramSection || {}),
        },
        shopByAgeSection: {
          ...defaultShopByAgeSection,
          ...(parsed.shopByAgeSection || {}),
        },
        shopByPriceSection: {
          ...defaultShopByPriceSection,
          ...(parsed.shopByPriceSection || {}),
        },
      }
    }
  } catch {
    // fallback
  }
  return defaultSiteAssets
}

/**
 * Fetch latest media configuration from MongoDB Atlas API endpoint
 * with fallback to local state / defaults.
 */
export async function fetchSiteAssetsAsync(): Promise<SiteMediaAssets> {
  try {
    const res = await fetch('/api/media')
    if (res.ok) {
      const data = await res.json()
      if (data.media) {
        const merged: SiteMediaAssets = {
          ...defaultSiteAssets,
          ...data.media,
          heroBannerConfig: {
            ...defaultHeroBannerSlide,
            ...(data.media.heroBannerConfig || {}),
          },
          heroSlides: data.media.heroSlides && data.media.heroSlides.length > 0
            ? data.media.heroSlides
            : defaultHeroSlides,
          promotionalSection: {
            ...defaultSiteAssets.promotionalSection,
            ...(data.media.promotionalSection || {}),
          },
          categories: { ...defaultSiteAssets.categories, ...(data.media.categories || {}) },
          showcaseProducts:
            data.media.showcaseProducts && data.media.showcaseProducts.length > 0
              ? data.media.showcaseProducts
              : defaultShowcaseProducts,
          welcomeSection: {
            ...defaultWelcomeSection,
            ...(data.media.welcomeSection || {}),
          },
          boysGirlsSection: {
            ...defaultBoysGirlsSection,
            ...(data.media.boysGirlsSection || {}),
          },
          modernToysSection: {
            ...defaultModernToysSection,
            ...(data.media.modernToysSection || {}),
          },
          kidsCollectionsSection: {
            ...defaultKidsCollectionsSection,
            ...(data.media.kidsCollectionsSection || {}),
          },
          instagramSection: {
            ...defaultInstagramSection,
            ...(data.media.instagramSection || {}),
          },
          shopByAgeSection: {
            ...defaultShopByAgeSection,
            ...(data.media.shopByAgeSection || {}),
          },
          shopByPriceSection: {
            ...defaultShopByPriceSection,
            ...(data.media.shopByPriceSection || {}),
          },
        }
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(merged))
          } catch {}
        }
        return merged
      }
    }
  } catch {
    // fallback to getActiveSiteAssets
  }
  return getActiveSiteAssets()
}

export const siteAssets = defaultSiteAssets
export const defaultSiteMedia = defaultSiteAssets

export type OptionalImageProps = { src?: string; alt: string }

export const validSources = (sources: readonly (string | undefined)[]) =>
  sources.filter((source): source is string => Boolean(source?.trim()))
