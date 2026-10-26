/**
 * FirstCry Complete Product Category Hierarchy
 * 
 * Extracted directly from official FirstCry reference sources:
 * - https://www.firstcry.com/sitemap
 * - https://www.firstcry.com/products-directory
 * - https://www.firstcry.com/
 * 
 * Each category includes verified destination URLs, internal application routing fallbacks,
 * parent-child relations, and structured nesting.
 */

export interface FirstCrySubCategory {
  id: string
  name: string
  slug: string
  parentId: string
  sourceUrl: string
  internalHref: string
  description?: string
}

export interface FirstCryCategory {
  id: string
  name: string
  slug: string
  order: number
  sourceUrl: string
  internalHref: string
  childrenCount: number
  description?: string
  children: FirstCrySubCategory[]
}

export const firstCryCategoryHierarchy: FirstCryCategory[] = [
  {
    id: "fc-cat-baby-diapering",
    name: "Baby Diapering",
    slug: "baby-diapering",
    order: 1,
    sourceUrl: "https://www.firstcry.com/diapering?ref2=sitemap_fc",
    internalHref: "/products?category=baby-diapering",
    childrenCount: 6,
    children: [
      {
        id: "fc-sub-baby-diapering-baby-diapers",
        name: "Baby Diapers",
        slug: "baby-diapers",
        parentId: "fc-cat-baby-diapering",
        sourceUrl: "https://www.firstcry.com/baby-diapers/1/27?ref2=sitemap_fc",
        internalHref: "/products?category=baby-diapers"
      },
      {
        id: "fc-sub-baby-diapering-baby-wipes",
        name: "Baby Wipes",
        slug: "baby-wipes",
        parentId: "fc-cat-baby-diapering",
        sourceUrl: "https://www.firstcry.com/baby-wipes/1/29?ref2=sitemap_fc",
        internalHref: "/products?category=baby-wipes"
      },
      {
        id: "fc-sub-baby-diapering-cloth-diapers-baby-nappies",
        name: "Cloth Diapers & Baby Nappies",
        slug: "cloth-diapers-baby-nappies",
        parentId: "fc-cat-baby-diapering",
        sourceUrl: "https://www.firstcry.com/cloth-diapers-nappies/1/30?ref2=sitemap_fc",
        internalHref: "/products?category=cloth-diapers-baby-nappies"
      },
      {
        id: "fc-sub-baby-diapering-diaper-rash-creams",
        name: "Diaper Rash Creams",
        slug: "diaper-rash-creams",
        parentId: "fc-cat-baby-diapering",
        sourceUrl: "https://www.firstcry.com/diaper-changing-pads-mats/1/31?ref2=sitemap_fc",
        internalHref: "/products?category=diaper-rash-creams"
      },
      {
        id: "fc-sub-baby-diapering-diapers-bags",
        name: "Diapers Bags",
        slug: "diapers-bags",
        parentId: "fc-cat-baby-diapering",
        sourceUrl: "https://www.firstcry.com/diaper-bag/1/87?ref2=sitemap_fc",
        internalHref: "/products?category=diapers-bags"
      },
      {
        id: "fc-sub-baby-diapering-baby-potty-seats-chairs",
        name: "Baby Potty Seats & Chairs",
        slug: "baby-potty-seats-chairs",
        parentId: "fc-cat-baby-diapering",
        sourceUrl: "https://www.firstcry.com/potty-training/1/28?ref2=sitemap_fc",
        internalHref: "/products?category=baby-potty-seats-chairs"
      }
    ]
  },
  {
    id: "fc-cat-feeding-nursing",
    name: "Feeding & Nursing",
    slug: "feeding-nursing",
    order: 2,
    sourceUrl: "https://www.firstcry.com/feeding-and-nursing?ref2=sitemap_fc",
    internalHref: "/products?category=feeding-nursing",
    childrenCount: 8,
    children: [
      {
        id: "fc-sub-feeding-nursing-breastfeeding-products",
        name: "Breastfeeding Products",
        slug: "breastfeeding-products",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/breast-feeding/2/37?ref2=sitemap_fc",
        internalHref: "/products?category=breastfeeding-products"
      },
      {
        id: "fc-sub-feeding-nursing-teethers-soothers",
        name: "Teethers & Soothers",
        slug: "teethers-soothers",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/teethers-and-soothers/5/98?ref2=sitemap_fc",
        internalHref: "/products?category=teethers-soothers"
      },
      {
        id: "fc-sub-feeding-nursing-feeding-bottles-accessories",
        name: "Feeding Bottles & Accessories",
        slug: "feeding-bottles-accessories",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/bottles-and-accessories/2/32?ref2=sitemap_fc",
        internalHref: "/products?category=feeding-bottles-accessories"
      },
      {
        id: "fc-sub-feeding-nursing-bottle-cleaning-sterilisation",
        name: "Bottle Cleaning & Sterilisation",
        slug: "bottle-cleaning-sterilisation",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/bottle-cleaning-and-sterilisation/2/133?ref2=sitemap_fc",
        internalHref: "/products?category=bottle-cleaning-sterilisation"
      },
      {
        id: "fc-sub-feeding-nursing-bibs-hankies",
        name: "Bibs & Hankies",
        slug: "bibs-hankies",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/bibs-hankies/6/38?ref2=sitemap_fc",
        internalHref: "/products?category=bibs-hankies"
      },
      {
        id: "fc-sub-feeding-nursing-baby-food-infant-formula",
        name: "Baby Food & Infant Formula",
        slug: "baby-food-infant-formula",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/baby-food-and-infant-formula/2/36?ref2=sitemap_fc",
        internalHref: "/products?category=baby-food-infant-formula"
      },
      {
        id: "fc-sub-feeding-nursing-dishes-utensils",
        name: "Dishes & Utensils",
        slug: "dishes-utensils",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/dishes-and-utensils/2/34?ref2=sitemap_fc",
        internalHref: "/products?category=dishes-utensils"
      },
      {
        id: "fc-sub-feeding-nursing-sippers-cups",
        name: "Sippers & Cups",
        slug: "sippers-cups",
        parentId: "fc-cat-feeding-nursing",
        sourceUrl: "https://www.firstcry.com/sippers-and-cups/2/33?ref2=sitemap_fc",
        internalHref: "/products?category=sippers-cups"
      }
    ]
  },
  {
    id: "fc-cat-bath-skin-care-products",
    name: "Bath & Skin Care Products",
    slug: "bath-skin-care-products",
    order: 3,
    sourceUrl: "https://www.firstcry.com/bath-and-skin-care?ref2=sitemap_fc",
    internalHref: "/products?category=bath-skin-care-products",
    childrenCount: 6,
    children: [
      {
        id: "fc-sub-bath-skin-care-products-baby-bathing",
        name: "Baby Bathing",
        slug: "baby-bathing",
        parentId: "fc-cat-bath-skin-care-products",
        sourceUrl: "https://www.firstcry.com/bathing/3/80?ref2=sitemap_fc",
        internalHref: "/products?category=baby-bathing"
      },
      {
        id: "fc-sub-bath-skin-care-products-baby-skin-care",
        name: "Baby Skin Care",
        slug: "baby-skin-care",
        parentId: "fc-cat-bath-skin-care-products",
        sourceUrl: "https://www.firstcry.com/skin-care/3/81?ref2=sitemap_fc",
        internalHref: "/products?category=baby-skin-care"
      },
      {
        id: "fc-sub-bath-skin-care-products-baby-hair-care",
        name: "Baby Hair Care",
        slug: "baby-hair-care",
        parentId: "fc-cat-bath-skin-care-products",
        sourceUrl: "https://www.firstcry.com/hair-care/3/124?ref2=sitemap_fc",
        internalHref: "/products?category=baby-hair-care"
      },
      {
        id: "fc-sub-bath-skin-care-products-baby-oral-care",
        name: "Baby Oral Care",
        slug: "baby-oral-care",
        parentId: "fc-cat-bath-skin-care-products",
        sourceUrl: "https://www.firstcry.com/oral-care/3/125?ref2=sitemap_fc",
        internalHref: "/products?category=baby-oral-care"
      },
      {
        id: "fc-sub-bath-skin-care-products-baby-grooming",
        name: "Baby Grooming",
        slug: "baby-grooming",
        parentId: "fc-cat-bath-skin-care-products",
        sourceUrl: "https://www.firstcry.com/grooming/3/82?ref2=sitemap_fc",
        internalHref: "/products?category=baby-grooming"
      },
      {
        id: "fc-sub-bath-skin-care-products-bath-time-accessories",
        name: "Bath Time Accessories",
        slug: "bath-time-accessories",
        parentId: "fc-cat-bath-skin-care-products",
        sourceUrl: "https://www.firstcry.com/bath-time/6/169?ref2=sitemap_fc",
        internalHref: "/products?category=bath-time-accessories"
      }
    ]
  },
  {
    id: "fc-cat-health-safety-products",
    name: "Health & Safety Products",
    slug: "health-safety-products",
    order: 4,
    sourceUrl: "https://www.firstcry.com/health-and-safety?ref2=sitemap_fc",
    internalHref: "/products?category=health-safety-products",
    childrenCount: 6,
    children: [
      {
        id: "fc-sub-health-safety-products-baby-safety-and-baby-proofing",
        name: "Baby Safety and Baby Proofing",
        slug: "baby-safety-and-baby-proofing",
        parentId: "fc-cat-health-safety-products",
        sourceUrl: "https://www.firstcry.com/safety-and-proofing/4/85?ref2=sitemap_fc",
        internalHref: "/products?category=baby-safety-and-baby-proofing"
      },
      {
        id: "fc-sub-health-safety-products-baby-mosquito-nets-and-repellents",
        name: "Baby Mosquito Nets and Repellents",
        slug: "baby-mosquito-nets-and-repellents",
        parentId: "fc-cat-health-safety-products",
        sourceUrl: "https://www.firstcry.com/mosquito-nets-and-repellents/4/127?ref2=sitemap_fc",
        internalHref: "/products?category=baby-mosquito-nets-and-repellents"
      },
      {
        id: "fc-sub-health-safety-products-baby-oral-health-care",
        name: "Baby Oral Health Care",
        slug: "baby-oral-health-care",
        parentId: "fc-cat-health-safety-products",
        sourceUrl: "https://www.firstcry.com/oral-health-care/4/128?ref2=sitemap_fc",
        internalHref: "/products?category=baby-oral-health-care"
      },
      {
        id: "fc-sub-health-safety-products-baby-ear-and-nose-care",
        name: "Baby Ear and Nose Care",
        slug: "baby-ear-and-nose-care",
        parentId: "fc-cat-health-safety-products",
        sourceUrl: "https://www.firstcry.com/ear-and-nose-care/4/84?ref2=sitemap_fc",
        internalHref: "/products?category=baby-ear-and-nose-care"
      },
      {
        id: "fc-sub-health-safety-products-baby-detergents-and-cleansers",
        name: "Baby Detergents and Cleansers",
        slug: "baby-detergents-and-cleansers",
        parentId: "fc-cat-health-safety-products",
        sourceUrl: "https://www.firstcry.com/detergents-and-cleansers/4/86?ref2=sitemap_fc",
        internalHref: "/products?category=baby-detergents-and-cleansers"
      },
      {
        id: "fc-sub-health-safety-products-baby-thermometers",
        name: "Baby Thermometers",
        slug: "baby-thermometers",
        parentId: "fc-cat-health-safety-products",
        sourceUrl: "https://www.firstcry.com/thermometers/4/83?ref2=sitemap_fc",
        internalHref: "/products?category=baby-thermometers"
      }
    ]
  },
  {
    id: "fc-cat-toys-gaming",
    name: "Toys & Gaming",
    slug: "toys-gaming",
    order: 5,
    sourceUrl: "https://www.firstcry.com/toys-and-gaming?ref2=sitemap_fc",
    internalHref: "/products?category=toys-gaming",
    childrenCount: 25,
    children: [
      {
        id: "fc-sub-toys-gaming-teethers-soothers",
        name: "Teethers & Soothers",
        slug: "teethers-soothers",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/teethers-and-soothers/5/98?ref2=sitemap_fc",
        internalHref: "/products?category=teethers-soothers"
      },
      {
        id: "fc-sub-toys-gaming-baby-rattles",
        name: "Baby Rattles",
        slug: "baby-rattles",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/baby-rattles/5/99?ref2=sitemap_fc",
        internalHref: "/products?category=baby-rattles"
      },
      {
        id: "fc-sub-toys-gaming-pull-along-toys",
        name: "Pull Along Toys",
        slug: "pull-along-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/pull-along-toys/5/102?ref2=sitemap_fc",
        internalHref: "/products?category=pull-along-toys"
      },
      {
        id: "fc-sub-toys-gaming-bath-toys",
        name: "Bath Toys",
        slug: "bath-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/bath-toys/5/51?ref2=sitemap_fc",
        internalHref: "/products?category=bath-toys"
      },
      {
        id: "fc-sub-toys-gaming-infant-play-gyms",
        name: "Infant Play Gyms",
        slug: "infant-play-gyms",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/infant-play-gyms/5/49?ref2=sitemap_fc",
        internalHref: "/products?category=infant-play-gyms"
      },
      {
        id: "fc-sub-toys-gaming-soft-toys",
        name: "Soft Toys",
        slug: "soft-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/soft-toys/5/101?ref2=sitemap_fc",
        internalHref: "/products?category=soft-toys"
      },
      {
        id: "fc-sub-toys-gaming-dolls-dollhouses",
        name: "Dolls & Dollhouses",
        slug: "dolls-dollhouses",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/dolls-and-dollhouses/5/91?ref2=sitemap_fc",
        internalHref: "/products?category=dolls-dollhouses"
      },
      {
        id: "fc-sub-toys-gaming-fun-toys",
        name: "Fun Toys",
        slug: "fun-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/fun-toys/5/138?ref2=sitemap_fc",
        internalHref: "/products?category=fun-toys"
      },
      {
        id: "fc-sub-toys-gaming-learning-activity-toys",
        name: "Learning & Activity Toys",
        slug: "learning-activity-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/learning-and-activity-toys/5/42?ref2=sitemap_fc",
        internalHref: "/products?category=learning-activity-toys"
      },
      {
        id: "fc-sub-toys-gaming-blocks-stacking-games",
        name: "Blocks & Stacking Games",
        slug: "blocks-stacking-games",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/blocks-and-stacking-games/5/135?ref2=sitemap_fc",
        internalHref: "/products?category=blocks-stacking-games"
      },
      {
        id: "fc-sub-toys-gaming-musical-toys",
        name: "Musical Toys",
        slug: "musical-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/musical-toys/5/134?ref2=sitemap_fc",
        internalHref: "/products?category=musical-toys"
      },
      {
        id: "fc-sub-toys-gaming-trains-automobiles-models",
        name: "Trains, Automobiles & Models",
        slug: "trains-automobiles-models",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/trains-automobiles-and-models/5/94?ref2=sitemap_fc",
        internalHref: "/products?category=trains-automobiles-models"
      },
      {
        id: "fc-sub-toys-gaming-pretend-play",
        name: "Pretend Play",
        slug: "pretend-play",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/pretend-play/5/100?ref2=sitemap_fc",
        internalHref: "/products?category=pretend-play"
      },
      {
        id: "fc-sub-toys-gaming-outdoor-play-equipment",
        name: "Outdoor Play Equipment",
        slug: "outdoor-play-equipment",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/outdoor-play/5/352?ref2=sitemap_fc",
        internalHref: "/products?category=outdoor-play-equipment"
      },
      {
        id: "fc-sub-toys-gaming-remote-controlled-rc-toys",
        name: "Remote Controlled (RC) Toys",
        slug: "remote-controlled-rc-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/remote-controlled-toy/5/119?ref2=sitemap_fc",
        internalHref: "/products?category=remote-controlled-rc-toys"
      },
      {
        id: "fc-sub-toys-gaming-pc-console-gaming",
        name: "PC Console Gaming",
        slug: "pc-console-gaming",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/pc-console-gaming/5/118?ref2=sitemap_fc",
        internalHref: "/products?category=pc-console-gaming"
      },
      {
        id: "fc-sub-toys-gaming-art-creativity-toys",
        name: "Art & Creativity Toys",
        slug: "art-creativity-toys",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/art-and-creativity/5/50?ref2=sitemap_fc",
        internalHref: "/products?category=art-creativity-toys"
      },
      {
        id: "fc-sub-toys-gaming-educational-games",
        name: "Educational Games",
        slug: "educational-games",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/educational-games/5/106?ref2=sitemap_fc",
        internalHref: "/products?category=educational-games"
      },
      {
        id: "fc-sub-toys-gaming-puzzles-games",
        name: "Puzzles Games",
        slug: "puzzles-games",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/puzzles/5/92?ref2=sitemap_fc",
        internalHref: "/products?category=puzzles-games"
      },
      {
        id: "fc-sub-toys-gaming-building-construction-sets",
        name: "Building & Construction Sets",
        slug: "building-construction-sets",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/blocks-and-construction-sets/5/93?ref2=sitemap_fc",
        internalHref: "/products?category=building-construction-sets"
      },
      {
        id: "fc-sub-toys-gaming-musical-instruments",
        name: "Musical Instruments",
        slug: "musical-instruments",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/musical-instruments/5/95?ref2=sitemap_fc",
        internalHref: "/products?category=musical-instruments"
      },
      {
        id: "fc-sub-toys-gaming-figures-playsets",
        name: "Figures & Playsets",
        slug: "figures-playsets",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/figures-and-playsets/5/132?ref2=sitemap_fc",
        internalHref: "/products?category=figures-playsets"
      },
      {
        id: "fc-sub-toys-gaming-sports-equipment",
        name: "Sports Equipment",
        slug: "sports-equipment",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/sports-equipment/5/129?ref2=sitemap_fc",
        internalHref: "/products?category=sports-equipment"
      },
      {
        id: "fc-sub-toys-gaming-toy-guns",
        name: "Toy Guns",
        slug: "toy-guns",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/guns/5/97?ref2=sitemap_fc",
        internalHref: "/products?category=toy-guns"
      },
      {
        id: "fc-sub-toys-gaming-board-games",
        name: "Board Games",
        slug: "board-games",
        parentId: "fc-cat-toys-gaming",
        sourceUrl: "https://www.firstcry.com/board-games/5/103?ref2=sitemap_fc",
        internalHref: "/products?category=board-games"
      }
    ]
  },
  {
    id: "fc-cat-baby-kids-clothing",
    name: "Baby & Kids Clothing",
    slug: "baby-kids-clothing",
    order: 6,
    sourceUrl: "https://www.firstcry.com/clothes-and-shoes/6/0/0?ref2=sitemap_fc",
    internalHref: "/products?category=baby-kids-clothing",
    childrenCount: 23,
    children: [
      {
        id: "fc-sub-baby-kids-clothing-baby-girls-frocks",
        name: "Baby & Girls Frocks",
        slug: "baby-girls-frocks",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/frocks/6/168?ref2=sitemap_fc",
        internalHref: "/products?category=baby-girls-frocks"
      },
      {
        id: "fc-sub-baby-kids-clothing-tops-t-shirts",
        name: "Tops & T-Shirts",
        slug: "tops-t-shirts",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/tops-and-tees/6/26?ref2=sitemap_fc",
        internalHref: "/products?category=tops-t-shirts"
      },
      {
        id: "fc-sub-baby-kids-clothing-sets-suits",
        name: "Sets & Suits",
        slug: "sets-suits",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/sets-and-suits/6/166?ref2=sitemap_fc",
        internalHref: "/products?category=sets-suits"
      },
      {
        id: "fc-sub-baby-kids-clothing-pajamas-leggings",
        name: "Pajamas & Leggings",
        slug: "pajamas-leggings",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/pajamas-and-leggings/6/269?ref2=sitemap_fc",
        internalHref: "/products?category=pajamas-leggings"
      },
      {
        id: "fc-sub-baby-kids-clothing-onesies-rompers",
        name: "Onesies & Rompers",
        slug: "onesies-rompers",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/onesies-and-rompers/6/164?ref2=sitemap_fc",
        internalHref: "/products?category=onesies-rompers"
      },
      {
        id: "fc-sub-baby-kids-clothing-sweat-shirts-jackets",
        name: "Sweat Shirts & Jackets",
        slug: "sweat-shirts-jackets",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/sweat-shirts-and-jackets/6/267?ref2=sitemap_fc",
        internalHref: "/products?category=sweat-shirts-jackets"
      },
      {
        id: "fc-sub-baby-kids-clothing-baby-kids-sweaters",
        name: "Baby & Kids Sweaters",
        slug: "baby-kids-sweaters",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/sweaters/6/219?ref2=sitemap_fc",
        internalHref: "/products?category=baby-kids-sweaters"
      },
      {
        id: "fc-sub-baby-kids-clothing-party-wear",
        name: "Party Wear",
        slug: "party-wear",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/party-wear/6/243?ref2=sitemap_fc",
        internalHref: "/products?category=party-wear"
      },
      {
        id: "fc-sub-baby-kids-clothing-kids-ethnic-wear",
        name: "Kids Ethnic Wear",
        slug: "kids-ethnic-wear",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/ethnic-wear/6/246?ref2=sitemap_fc",
        internalHref: "/products?category=kids-ethnic-wear"
      },
      {
        id: "fc-sub-baby-kids-clothing-night-wear",
        name: "Night Wear",
        slug: "night-wear",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/nightwear/6/165?ref2=sitemap_fc",
        internalHref: "/products?category=night-wear"
      },
      {
        id: "fc-sub-baby-kids-clothing-shorts-skirts-jeans",
        name: "Shorts, Skirts & Jeans",
        slug: "shorts-skirts-jeans",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/shorts-skirts-and-jeans/6/221?ref2=sitemap_fc",
        internalHref: "/products?category=shorts-skirts-jeans"
      },
      {
        id: "fc-sub-baby-kids-clothing-shirts",
        name: "Shirts",
        slug: "shirts",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/shirts/6/220?ref2=sitemap_fc",
        internalHref: "/products?category=shirts"
      },
      {
        id: "fc-sub-baby-kids-clothing-inner-wear-thermals",
        name: "Inner Wear & Thermals",
        slug: "inner-wear-thermals",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/inner-wear-and-thermals/6/163?ref2=sitemap_fc",
        internalHref: "/products?category=inner-wear-thermals"
      },
      {
        id: "fc-sub-baby-kids-clothing-theme-costumes",
        name: "Theme Costumes",
        slug: "theme-costumes",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/theme-costumes/6/295?ref2=sitemap_fc",
        internalHref: "/products?category=theme-costumes"
      },
      {
        id: "fc-sub-baby-kids-clothing-baby-blankets-quilts-wraps",
        name: "Baby Blankets, Quilts & Wraps",
        slug: "baby-blankets-quilts-wraps",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/blankets-quilts-wraps/6/107?ref2=sitemap_fc",
        internalHref: "/products?category=baby-blankets-quilts-wraps"
      },
      {
        id: "fc-sub-baby-kids-clothing-caps-gloves-mittens",
        name: "Caps, Gloves & Mittens",
        slug: "caps-gloves-mittens",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/caps-gloves-and-mittens/6/22?ref2=sitemap_fc",
        internalHref: "/products?category=caps-gloves-mittens"
      },
      {
        id: "fc-sub-baby-kids-clothing-socks-tights",
        name: "Socks & Tights",
        slug: "socks-tights",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/socks-and-tights/6/238?ref2=sitemap_fc",
        internalHref: "/products?category=socks-tights"
      },
      {
        id: "fc-sub-baby-kids-clothing-bath-time-accessories",
        name: "Bath Time Accessories",
        slug: "bath-time-accessories",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/bath-time/6/169?ref2=sitemap_fc",
        internalHref: "/products?category=bath-time-accessories"
      },
      {
        id: "fc-sub-baby-kids-clothing-baby-bibs-hankies",
        name: "Baby Bibs & Hankies",
        slug: "baby-bibs-hankies",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/bibs-hankies/6/38?ref2=sitemap_fc",
        internalHref: "/products?category=baby-bibs-hankies"
      },
      {
        id: "fc-sub-baby-kids-clothing-kids-swimwear",
        name: "Kids Swimwear",
        slug: "kids-swimwear",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/swim-wear/6/276?ref2=sitemap_fc",
        internalHref: "/products?category=kids-swimwear"
      },
      {
        id: "fc-sub-baby-kids-clothing-rainwear",
        name: "Rainwear",
        slug: "rainwear",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/rainwear/6/172?ref2=sitemap_fc",
        internalHref: "/products?category=rainwear"
      },
      {
        id: "fc-sub-baby-kids-clothing-baby-kids-footwear",
        name: "Baby & Kids Footwear",
        slug: "baby-kids-footwear",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?ref2=sitemap_fc",
        internalHref: "/products?category=baby-kids-footwear"
      },
      {
        id: "fc-sub-baby-kids-clothing-kids-umbrellas",
        name: "Kids Umbrellas",
        slug: "kids-umbrellas",
        parentId: "fc-cat-baby-kids-clothing",
        sourceUrl: "https://www.firstcry.com/kids-umbrellas/6/377?ref2=sitemap_fc",
        internalHref: "/products?category=kids-umbrellas"
      }
    ]
  },
  {
    id: "fc-cat-fashion-accessories",
    name: "Fashion Accessories",
    slug: "fashion-accessories",
    order: 7,
    sourceUrl: "https://www.firstcry.com/all-products?catid=22&cname=fashion-accessories&pi=1",
    internalHref: "/products?category=fashion-accessories",
    childrenCount: 8,
    children: [
      {
        id: "fc-sub-fashion-accessories-hair-bands-clips-bows",
        name: "Hair Bands, Clips & Bows",
        slug: "hair-bands-clips-bows",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/hair-bands-and-clips/22/225?ref2=sitemap_fc",
        internalHref: "/products?category=hair-bands-clips-bows"
      },
      {
        id: "fc-sub-fashion-accessories-kids-sunglasses",
        name: "Kids Sunglasses",
        slug: "kids-sunglasses",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/sunglasses/22/228?ref2=sitemap_fc",
        internalHref: "/products?category=kids-sunglasses"
      },
      {
        id: "fc-sub-fashion-accessories-kids-bags-purses",
        name: "Kids Bags & Purses",
        slug: "kids-bags-purses",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/kids-bags-and-purses/22/224?ref2=sitemap_fc",
        internalHref: "/products?category=kids-bags-purses"
      },
      {
        id: "fc-sub-fashion-accessories-kids-caps-gloves",
        name: "Kids Caps & Gloves",
        slug: "kids-caps-gloves",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/caps-and-gloves/22/223?ref2=sitemap_fc",
        internalHref: "/products?category=kids-caps-gloves"
      },
      {
        id: "fc-sub-fashion-accessories-kids-jewellery",
        name: "Kids Jewellery",
        slug: "kids-jewellery",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/kids-jewellery/22/226?ref2=sitemap_fc",
        internalHref: "/products?category=kids-jewellery"
      },
      {
        id: "fc-sub-fashion-accessories-kids-watches",
        name: "Kids Watches",
        slug: "kids-watches",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/watches/22/275?ref2=sitemap_fc",
        internalHref: "/products?category=kids-watches"
      },
      {
        id: "fc-sub-fashion-accessories-make-up-cosmetics",
        name: "Make Up & Cosmetics",
        slug: "make-up-cosmetics",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/make-up-and-cosmetics/22/227?ref2=sitemap_fc",
        internalHref: "/products?category=make-up-cosmetics"
      },
      {
        id: "fc-sub-fashion-accessories-ties-belts-suspenders",
        name: "Ties, Belts & Suspenders",
        slug: "ties-belts-suspenders",
        parentId: "fc-cat-fashion-accessories",
        sourceUrl: "https://www.firstcry.com/ties-belts-and-suspenders/6/245?ref2=sitemap_fc",
        internalHref: "/products?category=ties-belts-suspenders"
      }
    ]
  },
  {
    id: "fc-cat-baby-kids-footwear",
    name: "Baby & Kids Footwear",
    slug: "baby-kids-footwear",
    order: 8,
    sourceUrl: "https://www.firstcry.com/baby-kids-footwear",
    internalHref: "/products?category=baby-kids-footwear",
    childrenCount: 10,
    children: [
      {
        id: "fc-sub-baby-kids-footwear-baby-booties",
        name: "Baby Booties",
        slug: "baby-booties",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~2454,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=baby-booties"
      },
      {
        id: "fc-sub-baby-kids-footwear-kids-sandals",
        name: "Kids Sandals",
        slug: "kids-sandals",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~415,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=kids-sandals"
      },
      {
        id: "fc-sub-baby-kids-footwear-school-shoes",
        name: "School Shoes",
        slug: "school-shoes",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~417,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=school-shoes"
      },
      {
        id: "fc-sub-baby-kids-footwear-kids-slippers-flip-flops",
        name: "Kids Slippers / Flip Flops",
        slug: "kids-slippers-flip-flops",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~1960,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=kids-slippers-flip-flops"
      },
      {
        id: "fc-sub-baby-kids-footwear-kids-sneakers-sports-shoes",
        name: "Kids Sneakers & Sports Shoes",
        slug: "kids-sneakers-sports-shoes",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~761,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=kids-sneakers-sports-shoes"
      },
      {
        id: "fc-sub-baby-kids-footwear-kids-boots",
        name: "Kids Boots",
        slug: "kids-boots",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~416,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=kids-boots"
      },
      {
        id: "fc-sub-baby-kids-footwear-kids-clogs",
        name: "Kids Clogs",
        slug: "kids-clogs",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~1961,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=kids-clogs"
      },
      {
        id: "fc-sub-baby-kids-footwear-formal-party-wear-shoes",
        name: "Formal & Party Wear Shoes",
        slug: "formal-party-wear-shoes",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~3509,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=formal-party-wear-shoes"
      },
      {
        id: "fc-sub-baby-kids-footwear-casual-shoes",
        name: "Casual Shoes",
        slug: "casual-shoes",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~414,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=casual-shoes"
      },
      {
        id: "fc-sub-baby-kids-footwear-led-shoes",
        name: "LED Shoes",
        slug: "led-shoes",
        parentId: "fc-cat-baby-kids-footwear",
        sourceUrl: "https://www.firstcry.com/footwear/6/170?scat=170@~4164,@,@,@,@,@@@B@@1@0@20@@@@@&sort=popularity",
        internalHref: "/products?category=led-shoes"
      }
    ]
  },
  {
    id: "fc-cat-nursery-furniture-decor",
    name: "Nursery Furniture & Decor",
    slug: "nursery-furniture-decor",
    order: 9,
    sourceUrl: "https://www.firstcry.com/nursery-furniture-decor?ref2=sitemap_fc",
    internalHref: "/products?category=nursery-furniture-decor",
    childrenCount: 11,
    children: [
      {
        id: "fc-sub-nursery-furniture-decor-baby-furniture",
        name: "Baby Furniture",
        slug: "baby-furniture",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/baby-furniture/8/136?ref2=sitemap_fc",
        internalHref: "/products?category=baby-furniture"
      },
      {
        id: "fc-sub-nursery-furniture-decor-kids-furniture",
        name: "Kids Furniture",
        slug: "kids-furniture",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/kids-furniture/8/68?ref2=sitemap_fc",
        internalHref: "/products?category=kids-furniture"
      },
      {
        id: "fc-sub-nursery-furniture-decor-storage-organization",
        name: "Storage & Organization",
        slug: "storage-organization",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/storage-and-organization/8/364?ref2=sitemap_fc",
        internalHref: "/products?category=storage-organization"
      },
      {
        id: "fc-sub-nursery-furniture-decor-kids-accessories",
        name: "Kids Accessories",
        slug: "kids-accessories",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/kids-accessories/8/146?ref2=sitemap_fc",
        internalHref: "/products?category=kids-accessories"
      },
      {
        id: "fc-sub-nursery-furniture-decor-wall-paper-stickers",
        name: "Wall Paper & Stickers",
        slug: "wall-paper-stickers",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/wall-paper-and-sticker/8/236?ref2=sitemap_fc",
        internalHref: "/products?category=wall-paper-stickers"
      },
      {
        id: "fc-sub-nursery-furniture-decor-baby-bedding-sets-pillows",
        name: "Baby Bedding Sets & Pillows",
        slug: "baby-bedding-sets-pillows",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/baby-bedding-sets-and-pillows/8/65?ref2=sitemap_fc",
        internalHref: "/products?category=baby-bedding-sets-pillows"
      },
      {
        id: "fc-sub-nursery-furniture-decor-baby-blankets-quilts-wraps",
        name: "Baby Blankets, Quilts & Wraps",
        slug: "baby-blankets-quilts-wraps",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/blankets-quilts-and-wraps/8/107?ref2=sitemap_fc",
        internalHref: "/products?category=baby-blankets-quilts-wraps"
      },
      {
        id: "fc-sub-nursery-furniture-decor-travel-accessories",
        name: "Travel Accessories",
        slug: "travel-accessories",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/travel-accessories/8/147?ref2=sitemap_fc",
        internalHref: "/products?category=travel-accessories"
      },
      {
        id: "fc-sub-nursery-furniture-decor-baby-mattresses",
        name: "Baby Mattresses",
        slug: "baby-mattresses",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/baby-mattresses/8/66?ref2=sitemap_fc",
        internalHref: "/products?category=baby-mattresses"
      },
      {
        id: "fc-sub-nursery-furniture-decor-mosquito-nets",
        name: "Mosquito Nets",
        slug: "mosquito-nets",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/mosquito-nets/8/67?ref2=sitemap_fc",
        internalHref: "/products?category=mosquito-nets"
      },
      {
        id: "fc-sub-nursery-furniture-decor-nursery-lamps-lighting",
        name: "Nursery Lamps & Lighting",
        slug: "nursery-lamps-lighting",
        parentId: "fc-cat-nursery-furniture-decor",
        sourceUrl: "https://www.firstcry.com/lamps-and-lighting/8/237?ref2=sitemap_fc",
        internalHref: "/products?category=nursery-lamps-lighting"
      }
    ]
  },
  {
    id: "fc-cat-baby-gear",
    name: "Baby Gear",
    slug: "baby-gear",
    order: 10,
    sourceUrl: "https://www.firstcry.com/baby-gear?ref2=sitemap_fc",
    internalHref: "/products?category=baby-gear",
    childrenCount: 8,
    children: [
      {
        id: "fc-sub-baby-gear-baby-carriers",
        name: "Baby Carriers",
        slug: "baby-carriers",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/baby-carriers/7/41?ref2=sitemap_fc",
        internalHref: "/products?category=baby-carriers"
      },
      {
        id: "fc-sub-baby-gear-baby-carrycots",
        name: "Baby Carrycots",
        slug: "baby-carrycots",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/baby-carrycots/7/810?ref2=sitemap_fc",
        internalHref: "/products?category=baby-carrycots"
      },
      {
        id: "fc-sub-baby-gear-bouncers-rockers-swings",
        name: "Bouncers, Rockers & Swings",
        slug: "bouncers-rockers-swings",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/bouncers,-rockers-and-swings/7/365?ref2=sitemap_fc",
        internalHref: "/products?category=bouncers-rockers-swings"
      },
      {
        id: "fc-sub-baby-gear-baby-strollers-prams",
        name: "Baby Strollers & Prams",
        slug: "baby-strollers-prams",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/baby-strollers-prams/7/44?ref2=sitemap_fc",
        internalHref: "/products?category=baby-strollers-prams"
      },
      {
        id: "fc-sub-baby-gear-baby-car-seat",
        name: "Baby Car Seat",
        slug: "baby-car-seat",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/baby-car-seat/7/809?ref2=sitemap_fc",
        internalHref: "/products?category=baby-car-seat"
      },
      {
        id: "fc-sub-baby-gear-high-chairs-booster-seats",
        name: "High Chairs & Booster Seats",
        slug: "high-chairs-booster-seats",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/high-chairs-and-booster-seats/7/43?ref2=sitemap_fc",
        internalHref: "/products?category=high-chairs-booster-seats"
      },
      {
        id: "fc-sub-baby-gear-baby-walkers",
        name: "Baby Walkers",
        slug: "baby-walkers",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/baby-walkers/7/366?ref2=sitemap_fc",
        internalHref: "/products?category=baby-walkers"
      },
      {
        id: "fc-sub-baby-gear-kids-bikes-ride-ons",
        name: "Kids Bikes & Ride Ons",
        slug: "kids-bikes-ride-ons",
        parentId: "fc-cat-baby-gear",
        sourceUrl: "https://www.firstcry.com/bikes-and-ride-ons/7/90?ref2=sitemap_fc",
        internalHref: "/products?category=kids-bikes-ride-ons"
      }
    ]
  },
  {
    id: "fc-cat-birthday-party-supplies",
    name: "Birthday Party Supplies",
    slug: "birthday-party-supplies",
    order: 11,
    sourceUrl: "https://www.firstcry.com/birthday-party-supplies?ref2=cat_footer",
    internalHref: "/products?category=birthday-party-supplies",
    childrenCount: 11,
    children: [
      {
        id: "fc-sub-birthday-party-supplies-birthday-kits",
        name: "Birthday Kits",
        slug: "birthday-kits",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/birthday-kit/14/174?ref2=sitemap_fc",
        internalHref: "/products?category=birthday-kits"
      },
      {
        id: "fc-sub-birthday-party-supplies-wall-decor-balloons",
        name: "Wall Decor and Balloons",
        slug: "wall-decor-balloons",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/wall-decor-and-balloons/14/151?ref2=sitemap_fc",
        internalHref: "/products?category=wall-decor-balloons"
      },
      {
        id: "fc-sub-birthday-party-supplies-invitation-cards",
        name: "Invitation Cards",
        slug: "invitation-cards",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/invitation/14/154?ref2=sitemap_fc",
        internalHref: "/products?category=invitation-cards"
      },
      {
        id: "fc-sub-birthday-party-supplies-table-cover-decor",
        name: "Table Cover and Decor",
        slug: "table-cover-decor",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/table-cover-and-decor/14/150?ref2=sitemap_fc",
        internalHref: "/products?category=table-cover-decor"
      },
      {
        id: "fc-sub-birthday-party-supplies-theme-candles",
        name: "Theme Candles",
        slug: "theme-candles",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/theme-candles/14/149?ref2=sitemap_fc",
        internalHref: "/products?category=theme-candles"
      },
      {
        id: "fc-sub-birthday-party-supplies-hats-hand-fan",
        name: "Hats and Hand Fan",
        slug: "hats-hand-fan",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/hats-and-hand-fan/14/153?ref2=sitemap_fc",
        internalHref: "/products?category=hats-hand-fan"
      },
      {
        id: "fc-sub-birthday-party-supplies-birthday-gift-bags",
        name: "Birthday Gift Bags",
        slug: "birthday-gift-bags",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/carry-bags/14/157?ref2=sitemap_fc",
        internalHref: "/products?category=birthday-gift-bags"
      },
      {
        id: "fc-sub-birthday-party-supplies-plates-cups-treat-sacks",
        name: "Plates, Cups and Treat Sacks",
        slug: "plates-cups-treat-sacks",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/plates-cups-and-treat-sacks/14/155?ref2=sitemap_fc",
        internalHref: "/products?category=plates-cups-treat-sacks"
      },
      {
        id: "fc-sub-birthday-party-supplies-party-props-favors",
        name: "Party Props & Favors",
        slug: "party-props-favors",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/party-props-and-favors/14/156?ref2=sitemap_fc",
        internalHref: "/products?category=party-props-favors"
      },
      {
        id: "fc-sub-birthday-party-supplies-return-gifts",
        name: "Return Gifts",
        slug: "return-gifts",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/return-gifts/14/158?ref2=sitemap_fc",
        internalHref: "/products?category=return-gifts"
      },
      {
        id: "fc-sub-birthday-party-supplies-confetti-poppers",
        name: "Confetti Poppers & Banners",
        slug: "confetti-poppers",
        parentId: "fc-cat-birthday-party-supplies",
        sourceUrl: "https://www.firstcry.com/banners-and-cutouts/14/152?ref2=sitemap_fc",
        internalHref: "/products?category=confetti-poppers"
      }
    ]
  },
  {
    id: "fc-cat-baby-kids-gifts",
    name: "Baby & Kids Gifts",
    slug: "baby-kids-gifts",
    order: 12,
    sourceUrl: "https://www.firstcry.com/baby-kids-gifts",
    internalHref: "/products?category=baby-kids-gifts",
    childrenCount: 4,
    children: [
      {
        id: "fc-sub-baby-kids-gifts-baby-gifts",
        name: "Baby Gifts",
        slug: "baby-gifts",
        parentId: "fc-cat-baby-kids-gifts",
        sourceUrl: "https://www.firstcry.com/baby-gift-set/12/108?ref2=sitemap_fc",
        internalHref: "/products?category=baby-gifts"
      },
      {
        id: "fc-sub-baby-kids-gifts-kids-gifts",
        name: "Kid's Gifts",
        slug: "kids-gifts",
        parentId: "fc-cat-baby-kids-gifts",
        sourceUrl: "https://www.firstcry.com/topoffers?moid=291&ref2=sitemap_fc",
        internalHref: "/products?category=kids-gifts"
      },
      {
        id: "fc-sub-baby-kids-gifts-photo-frame-albums",
        name: "Photo Frame & Albums",
        slug: "photo-frame-albums",
        parentId: "fc-cat-baby-kids-gifts",
        sourceUrl: "https://www.firstcry.com/photo-frame-and-albums/12/161?ref2=sitemap_fc",
        internalHref: "/products?category=photo-frame-albums"
      },
      {
        id: "fc-sub-baby-kids-gifts-firstcry-gift-certificate",
        name: "Firstcry Gift Certificate",
        slug: "firstcry-gift-certificate",
        parentId: "fc-cat-baby-kids-gifts",
        sourceUrl: "https://www.firstcry.com/firstcry_gift_certificate?ref2=sitemap_fc",
        internalHref: "/products?category=firstcry-gift-certificate"
      }
    ]
  },
  {
    id: "fc-cat-kids-books-cds",
    name: "Kids Books & CD's",
    slug: "kids-books-cds",
    order: 13,
    sourceUrl: "https://www.firstcry.com/books-and-cds/11/0/0?ref2=sitemap_fc",
    internalHref: "/products?category=kids-books-cds",
    childrenCount: 12,
    children: [
      {
        id: "fc-sub-kids-books-cds-fun-learn-cd-dvd-movies",
        name: "Fun & Learn CD/DVD/Movies",
        slug: "fun-learn-cd-dvd-movies",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/fun-and-learn-cd-dvd-movies/11/113?ref2=sitemap_fc",
        internalHref: "/products?category=fun-learn-cd-dvd-movies"
      },
      {
        id: "fc-sub-kids-books-cds-story-books",
        name: "Story Books",
        slug: "story-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/story-book/11/139?ref2=sitemap_fc",
        internalHref: "/products?category=story-books"
      },
      {
        id: "fc-sub-kids-books-cds-read-learn-books",
        name: "Read & Learn Books",
        slug: "read-learn-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/read-and-learn/11/141?ref2=sitemap_fc",
        internalHref: "/products?category=read-learn-books"
      },
      {
        id: "fc-sub-kids-books-cds-activity-books",
        name: "Activity Books",
        slug: "activity-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/activity-book/11/112?ref2=sitemap_fc",
        internalHref: "/products?category=activity-books"
      },
      {
        id: "fc-sub-kids-books-cds-books-with-music",
        name: "Books with Music",
        slug: "books-with-music",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/books-with-music/11/144?ref2=sitemap_fc",
        internalHref: "/products?category=books-with-music"
      },
      {
        id: "fc-sub-kids-books-cds-puzzle-books",
        name: "Puzzle Books",
        slug: "puzzle-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/puzzle-book/11/143?ref2=sitemap_fc",
        internalHref: "/products?category=puzzle-books"
      },
      {
        id: "fc-sub-kids-books-cds-tag-books",
        name: "Tag Books",
        slug: "tag-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/tag-books/11/148?ref2=sitemap_fc",
        internalHref: "/products?category=tag-books"
      },
      {
        id: "fc-sub-kids-books-cds-knowledge-books",
        name: "Knowledge Books",
        slug: "knowledge-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/knowledge-book/11/142?ref2=sitemap_fc",
        internalHref: "/products?category=knowledge-books"
      },
      {
        id: "fc-sub-kids-books-cds-colouring-books",
        name: "Colouring Books",
        slug: "colouring-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/colouring-book/11/140?ref2=sitemap_fc",
        internalHref: "/products?category=colouring-books"
      },
      {
        id: "fc-sub-kids-books-cds-audio-stories",
        name: "Audio Stories",
        slug: "audio-stories",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/audio-stories/11/114?ref2=sitemap_fc",
        internalHref: "/products?category=audio-stories"
      },
      {
        id: "fc-sub-kids-books-cds-school-curriculum-books",
        name: "School Curriculum Books",
        slug: "school-curriculum-books",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/school-books/11/240?ref2=sitemap_fc",
        internalHref: "/products?category=school-curriculum-books"
      },
      {
        id: "fc-sub-kids-books-cds-flash-cards",
        name: "Flash Cards",
        slug: "flash-cards",
        parentId: "fc-cat-kids-books-cds",
        sourceUrl: "https://www.firstcry.com/flash-cards/11/241?ref2=sitemap_fc",
        internalHref: "/products?category=flash-cards"
      }
    ]
  },
  {
    id: "fc-cat-school-supplies",
    name: "School Supplies",
    slug: "school-supplies",
    order: 14,
    sourceUrl: "https://www.firstcry.com/school-supplies/10/0/0?ref2=sitemap_fc",
    internalHref: "/products?category=school-supplies",
    childrenCount: 6,
    children: [
      {
        id: "fc-sub-school-supplies-water-bottles",
        name: "Water Bottles",
        slug: "water-bottles",
        parentId: "fc-cat-school-supplies",
        sourceUrl: "https://www.firstcry.com/water-bottles/10/109?ref2=sitemap_fc",
        internalHref: "/products?category=water-bottles"
      },
      {
        id: "fc-sub-school-supplies-school-bags-back-packs",
        name: "School Bags & Back Packs",
        slug: "school-bags-back-packs",
        parentId: "fc-cat-school-supplies",
        sourceUrl: "https://www.firstcry.com/school-bags-and-back-packs/10/110?ref2=sitemap_fc",
        internalHref: "/products?category=school-bags-back-packs"
      },
      {
        id: "fc-sub-school-supplies-kids-stationery",
        name: "Kids Stationery",
        slug: "kids-stationery",
        parentId: "fc-cat-school-supplies",
        sourceUrl: "https://www.firstcry.com/stationery/10/111?ref2=sitemap_fc",
        internalHref: "/products?category=kids-stationery"
      },
      {
        id: "fc-sub-school-supplies-lunch-boxes-bags",
        name: "Lunch Boxes & Bags",
        slug: "lunch-boxes-bags",
        parentId: "fc-cat-school-supplies",
        sourceUrl: "https://www.firstcry.com/lunch-box/10/120?ref2=sitemap_fc",
        internalHref: "/products?category=lunch-boxes-bags"
      },
      {
        id: "fc-sub-school-supplies-school-kits",
        name: "School Kits",
        slug: "school-kits",
        parentId: "fc-cat-school-supplies",
        sourceUrl: "https://www.firstcry.com/school-kit/10/145?ref2=sitemap_fc",
        internalHref: "/products?category=school-kits"
      },
      {
        id: "fc-sub-school-supplies-computer-accessories",
        name: "Computer Accessories",
        slug: "computer-accessories",
        parentId: "fc-cat-school-supplies",
        sourceUrl: "https://www.firstcry.com/computer-accessories/10/263?ref2=sitemap_fc",
        internalHref: "/products?category=computer-accessories"
      }
    ]
  },
  {
    id: "fc-cat-moms-maternity",
    name: "Moms & Maternity",
    slug: "moms-maternity",
    order: 15,
    sourceUrl: "https://www.firstcry.com/maternity-clothing-and-care?ref2=cat_footer",
    internalHref: "/products?category=moms-maternity",
    childrenCount: 11,
    children: [
      {
        id: "fc-sub-moms-maternity-nursing-nightwear",
        name: "Nursing & Nightwear",
        slug: "nursing-nightwear",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/nursing-sleep-wear/21/229?ref2=sitemap_fc",
        internalHref: "/products?category=nursing-nightwear"
      },
      {
        id: "fc-sub-moms-maternity-maternity-tops-t-shirts-tunics",
        name: "Maternity Tops, T Shirts & Tunics",
        slug: "maternity-tops-t-shirts-tunics",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-tops/21/222?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-tops-t-shirts-tunics"
      },
      {
        id: "fc-sub-moms-maternity-formal-maternity-wear",
        name: "Formal Maternity Wear",
        slug: "formal-maternity-wear",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/formal-wear/21/231?ref2=sitemap_fc",
        internalHref: "/products?category=formal-maternity-wear"
      },
      {
        id: "fc-sub-moms-maternity-maternity-dresses-skirts",
        name: "Maternity Dresses & Skirts",
        slug: "maternity-dresses-skirts",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-dresses-skirts/21/230?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-dresses-skirts"
      },
      {
        id: "fc-sub-moms-maternity-maternity-bras-panties",
        name: "Maternity Bras & Panties",
        slug: "maternity-bras-panties",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-lingerie/21/273?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-bras-panties"
      },
      {
        id: "fc-sub-moms-maternity-maternity-jeans-pants-leggings",
        name: "Maternity Jeans, Pants & Leggings",
        slug: "maternity-jeans-pants-leggings",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-bottom-wear/21/382?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-jeans-pants-leggings"
      },
      {
        id: "fc-sub-moms-maternity-maternity-ethnic-wear",
        name: "Maternity Ethnic Wear",
        slug: "maternity-ethnic-wear",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-ethenic-wear/21/383?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-ethnic-wear"
      },
      {
        id: "fc-sub-moms-maternity-maternity-personal-care-products",
        name: "Maternity Personal Care Products",
        slug: "maternity-personal-care-products",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-personal-care/21/367?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-personal-care-products"
      },
      {
        id: "fc-sub-moms-maternity-maternity-skin-care",
        name: "Maternity Skin Care",
        slug: "maternity-skin-care",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-skin-care/21/274?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-skin-care"
      },
      {
        id: "fc-sub-moms-maternity-maternity-pillows-support",
        name: "Maternity Pillows & Support",
        slug: "maternity-pillows-support",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/maternity-support-and-pillows/21/232?ref2=sitemap_fc",
        internalHref: "/products?category=maternity-pillows-support"
      },
      {
        id: "fc-sub-moms-maternity-postpartum-care",
        name: "Postpartum Care",
        slug: "postpartum-care",
        parentId: "fc-cat-moms-maternity",
        sourceUrl: "https://www.firstcry.com/postpartum-care/21/233?ref2=sitemap_fc",
        internalHref: "/products?category=postpartum-care"
      }
    ]
  },
  {
    id: "fc-cat-combo-packs",
    name: "Combo Packs & Offers",
    slug: "combo-packs",
    order: 16,
    sourceUrl: "https://www.firstcry.com/combopacklist?ref2=sitemap_fc",
    internalHref: "/products?category=combo-packs",
    childrenCount: 6,
    children: [
      {
        id: "fc-sub-combo-packs-combo-packs",
        name: "Combo Packs",
        slug: "combo-packs",
        parentId: "fc-cat-combo-packs",
        sourceUrl: "https://www.firstcry.com/combopacklist?ref2=sitemap_fc",
        internalHref: "/products?category=combo-packs"
      },
      {
        id: "fc-sub-combo-packs-custom-combos",
        name: "Custom Combos",
        slug: "custom-combos",
        parentId: "fc-cat-combo-packs",
        sourceUrl: "https://www.firstcry.com/combopacklist?ref2=sitemap_fc",
        internalHref: "/products?category=custom-combos"
      },
      {
        id: "fc-sub-combo-packs-free-offers",
        name: "Free Offers",
        slug: "free-offers",
        parentId: "fc-cat-combo-packs",
        sourceUrl: "https://www.firstcry.com/searchresult?searchstring=freeoffer&ref2=sitemap_fc",
        internalHref: "/products?category=free-offers"
      },
      {
        id: "fc-sub-combo-packs-offers-deals",
        name: "Offers & Deals",
        slug: "offers-deals",
        parentId: "fc-cat-combo-packs",
        sourceUrl: "https://www.firstcry.com/mega-sale",
        internalHref: "/products?outlet=true"
      },
      {
        id: "fc-sub-combo-packs-firstcry-coupons",
        name: "Firstcry Coupons",
        slug: "firstcry-coupons",
        parentId: "fc-cat-combo-packs",
        sourceUrl: "https://www.firstcry.com/discountcoupons?ref2=sitemap_fc",
        internalHref: "/products?badge=deal"
      },
      {
        id: "fc-sub-combo-packs-firstcry-deals",
        name: "Firstcry Deals",
        slug: "firstcry-deals",
        parentId: "fc-cat-combo-packs",
        sourceUrl: "https://www.firstcry.com/deals?ref2=sitemap_fc",
        internalHref: "/products?outlet=true"
      }
    ]
  },
  {
    id: "fc-cat-guaranteed-savings-offer",
    name: "Guaranteed Savings & Brands",
    slug: "guaranteed-savings-offer",
    order: 17,
    sourceUrl: "https://www.firstcry.com/guaranteed-savings-offer?ref2=sitemap_fc",
    internalHref: "/products?category=guaranteed-savings-offer",
    childrenCount: 11,
    children: [
      {
        id: "fc-sub-guaranteed-savings-offer-huggies",
        name: "Huggies Store",
        slug: "huggies",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/huggies-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=huggies"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-pampers",
        name: "Pampers Store",
        slug: "pampers",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/pampers-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=pampers"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-mamy-poko",
        name: "Mamy Poko Store",
        slug: "mamy-poko",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/mamy-poko-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=mamy-poko"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-chicco",
        name: "Chicco Store",
        slug: "chicco",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/chicco-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=chicco"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-mee-mee",
        name: "Mee Mee Store",
        slug: "mee-mee",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/mee-mee-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=mee-mee"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-babyhug",
        name: "Babyhug Store",
        slug: "babyhug",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/babyhug-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=babyhug"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-libero",
        name: "Libero Store",
        slug: "libero",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/libero-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=libero"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-clothes-shoes",
        name: "Clothes & Shoes Savings",
        slug: "clothes-shoes",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/fc-fashion-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?category=clothes-shoes"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-pampers-premium-care",
        name: "Pampers Premium Care",
        slug: "pampers-premium-care",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/pampers-premium-care-pants-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=pampers"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-sebamed",
        name: "Sebamed Store",
        slug: "sebamed",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/sebamed-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=sebamed"
      },
      {
        id: "fc-sub-guaranteed-savings-offer-bella-baby-happy",
        name: "Bella Baby Happy",
        slug: "bella-baby-happy",
        parentId: "fc-cat-guaranteed-savings-offer",
        sourceUrl: "https://www.firstcry.com/bella-baby-happy-guaranteed-savings-offer?ref2=sitemap_fc",
        internalHref: "/products?brand=bella"
      }
    ]
  }
]

/**
 * Total categories count summary
 */
export const firstCryTaxonomySummary = {
  totalMainCategories: firstCryCategoryHierarchy.length,
  totalSubCategories: firstCryCategoryHierarchy.reduce((acc, cat) => acc + cat.childrenCount, 0),
  extractedFrom: [
    'https://www.firstcry.com/',
    'https://www.firstcry.com/products-directory',
    'https://www.firstcry.com/sitemap'
  ]
}

/**
 * Adapter helper: transforms FirstCry categories into MegaMenuData format
 * compatible with the project's site navigation or dynamic mega-menus.
 */
export function getFirstCryMegaMenu(catSlug: string) {
  const cat = firstCryCategoryHierarchy.find(c => c.slug === catSlug || c.id === catSlug)
  if (!cat) return null

  // Divide subcategories across 3 or 4 balanced columns
  const colsCount = 3
  const perCol = Math.ceil(cat.children.length / colsCount)
  const columns = []

  for (let i = 0; i < colsCount; i++) {
    const slice = cat.children.slice(i * perCol, (i + 1) * perCol)
    if (slice.length > 0) {
      columns.push({
        title: i === 0 ? `${cat.name.toUpperCase()} POPULAR` : i === 1 ? 'MORE CATEGORIES' : 'EXPLORE ALL',
        items: slice.map(item => ({
          label: item.name.toUpperCase(),
          href: item.internalHref
        }))
      })
    }
  }

  return {
    label: cat.name.toUpperCase(),
    exploreTitle: cat.name.toUpperCase(),
    exploreHref: cat.internalHref,
    watermarkText: cat.name.toUpperCase(),
    columns
  }
}
