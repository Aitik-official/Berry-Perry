import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShowcaseProductItem {
  productSlug: string;
  tag: string;
  quickDescription: string;
  reel1Title: string;
  reel1Label: string;
  reel1Video: string;
  reel2Title: string;
  reel2Label: string;
  reel2Video: string;
}

export interface ISiteMedia extends Document {
  key: string; // Identifier like "active_config"
  logo: string;
  heroBanners: string[];
  heroBannerConfig?: any;
  heroSlides?: any[];
  promotionalSlides: Array<{ findGame?: string; cricketAction?: string }>;
  promotionalSection: {
    leftPoster: string;
    rightPoster: string;
  };
  categories: {
    men: string;
    women: string;
    youth: string;
    cap: string;
    kitbags: string;
    accessories: string;
  };
  videoThumbnail: string;
  mainVideo: string;
  actionReelVideo: string;
  teamwearBanner: string;
  teamwearSlides: string[];
  partnerLogos: string[];
  showcaseProducts: IShowcaseProductItem[];
  welcomeSection?: {
    enabled: boolean;
    title: string;
    description1: string;
    subheading: string;
    description2: string;
    buttonText: string;
    buttonHref: string;
    image: string;
    trustBadges: Array<{
      icon: 'shipping' | 'return' | 'payment' | 'support';
      title: string;
      subtitle: string;
    }>;
  };
  boysGirlsSection?: {
    enabled: boolean;
    boysImage: string;
    boysTitle: string;
    boysButtonText: string;
    boysHref: string;
    girlsImage: string;
    girlsTitle: string;
    girlsButtonText: string;
    girlsHref: string;
  };
  modernToysSection?: {
    enabled: boolean;
    headline: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    bannerImage: string;
    cards: Array<{
      title: string;
      image: string;
      href: string;
    }>;
  };
  kidsCollectionsSection?: {
    enabled: boolean;
    tagline: string;
    title: string;
    description: string;
    clothing: {
      title: string;
      subtitle: string;
      image: string;
      href: string;
    };
    accessories: {
      title: string;
      subtitle: string;
      image: string;
      href: string;
      icon?: string;
    };
    books: {
      title: string;
      subtitle: string;
      image: string;
      href: string;
      icon?: string;
    };
    playthings: {
      title: string;
      subtitle: string;
      image: string;
      href: string;
    };
  };
  instagramSection?: {
    enabled: boolean;
    tagline: string;
    title: string;
    handle: string;
    handleHref?: string;
    images: string[];
  };
  shopByAgeSection?: {
    enabled: boolean;
    tagline: string;
    title: string;
    description: string;
    cards: Array<{
      title: string;
      description: string;
      image: string;
      buttonText: string;
      href: string;
    }>;
  };
  shopByPriceSection?: {
    enabled: boolean;
    title: string;
    cards: Array<{
      label: string;
      image: string;
      href: string;
    }>;
  };
  updatedAt: Date;
}

const ShowcaseProductSchema = new Schema<IShowcaseProductItem>(
  {
    productSlug: { type: String, required: true },
    tag: { type: String, default: "" },
    quickDescription: { type: String, default: "" },
    reel1Title: { type: String, default: "" },
    reel1Label: { type: String, default: "" },
    reel1Video: { type: String, default: "" },
    reel2Title: { type: String, default: "" },
    reel2Label: { type: String, default: "" },
    reel2Video: { type: String, default: "" },
  },
  { _id: false }
);

const SiteMediaSchema = new Schema<ISiteMedia>(
  {
    key: { type: String, default: "active_config", unique: true },
    logo: { type: String, default: "/images/logo.png" },
    heroBanners: { type: [String], default: [] },
    heroBannerConfig: { type: Schema.Types.Mixed, default: null },
    heroSlides: { type: Schema.Types.Mixed, default: null },
    promotionalSlides: { type: Schema.Types.Mixed, default: [] },
    promotionalSection: {
      leftPoster: { type: String, default: "" },
      rightPoster: { type: String, default: "" },
    },
    categories: {
      men: { type: String, default: "" },
      women: { type: String, default: "" },
      youth: { type: String, default: "" },
      cap: { type: String, default: "" },
      kitbags: { type: String, default: "" },
      accessories: { type: String, default: "" },
    },
    videoThumbnail: { type: String, default: "" },
    mainVideo: { type: String, default: "" },
    actionReelVideo: { type: String, default: "" },
    teamwearBanner: { type: String, default: "" },
    teamwearSlides: { type: [String], default: [] },
    partnerLogos: { type: [String], default: [] },
    showcaseProducts: { type: [ShowcaseProductSchema], default: [] },
    welcomeSection: { type: Schema.Types.Mixed, default: null },
    boysGirlsSection: { type: Schema.Types.Mixed, default: null },
    modernToysSection: { type: Schema.Types.Mixed, default: null },
    kidsCollectionsSection: { type: Schema.Types.Mixed, default: null },
    instagramSection: { type: Schema.Types.Mixed, default: null },
    shopByAgeSection: { type: Schema.Types.Mixed, default: null },
    shopByPriceSection: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
    strict: false,
  }
);

if (mongoose.models.SiteMedia) {
  delete mongoose.models.SiteMedia;
}

export const SiteMedia: Model<ISiteMedia> =
  mongoose.models.SiteMedia || mongoose.model<ISiteMedia>("SiteMedia", SiteMediaSchema);

export default SiteMedia;
