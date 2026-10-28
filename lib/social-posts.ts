export type SocialPlatform = 'instagram' | 'facebook' | 'x'

export type SocialPost = {
  id: string
  platform: SocialPlatform
  accountName: string
  profileImage?: string
  imageUrl?: string
  videoUrl?: string
  caption?: string
  postUrl?: string
  publishedAt?: string
  likeCount?: number
  mediaType: 'image' | 'video'
}

export const socialPosts: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    accountName: 'berryperryofficial',
    imageUrl: '/images/banner1.jpeg',
    caption: '✨ Everyday adventures await. Dress up in premium comfort built for little ones and active moms. #BerryPerry #HappyMoments',
    publishedAt: '2 days ago',
    likeCount: 4821,
    mediaType: 'image',
    postUrl: '#see-it-in-action',
  },
  {
    id: 'post-2',
    platform: 'instagram',
    accountName: 'berryperryofficial',
    imageUrl: '/images/banner2.jpeg',
    caption: '⚡ Style meets comfort. Our new collection is here — explore softest fabrics and trendy looks. #BerryPerryStyle',
    publishedAt: '4 days ago',
    likeCount: 3650,
    mediaType: 'image',
    postUrl: '#see-it-in-action',
  },
  {
    id: 'post-3',
    platform: 'facebook',
    accountName: 'Berry Perry Official',
    imageUrl: '/images/banner3.jpeg',
    caption: 'Play hard, smile wider. Crafted with love, designed for smiles. Shop the latest collection now.',
    publishedAt: '5 days ago',
    likeCount: 2190,
    mediaType: 'image',
    postUrl: '#see-it-in-action',
  },
  {
    id: 'post-4',
    platform: 'x',
    accountName: '@berryperry',
    imageUrl: '/images/banner4.jpeg',
    caption: 'Pure comfort and endless joy. New season. New arrivals. Same unmatched quality. ✨👶 #BerryPerry #KidsFashion',
    publishedAt: '1 week ago',
    likeCount: 1870,
    mediaType: 'image',
    postUrl: '#see-it-in-action',
  },
  {
    id: 'post-5',
    platform: 'instagram',
    accountName: 'berryperryofficial',
    imageUrl: '/images/banner5.jpeg',
    caption: '🌟 Every day is a new playground. Make every moment count in Berry Perry favorites. #BerryPerryLife',
    publishedAt: '1 week ago',
    likeCount: 5340,
    mediaType: 'image',
    postUrl: '#see-it-in-action',
  },
  {
    id: 'post-6',
    platform: 'facebook',
    accountName: 'Berry Perry Official',
    imageUrl: '/images/banner6.jpeg',
    caption: 'Made with hypoallergenic cotton and loving care. Explore our nursery, clothing, and ladies wear ranges.',
    publishedAt: '10 days ago',
    likeCount: 2780,
    mediaType: 'image',
    postUrl: '#see-it-in-action',
  },
  {
    id: 'post-7',
    platform: 'x',
    accountName: '@berryperry',
    imageUrl: '/images/banner7.jpeg',
    caption: 'From playtime to bedtime — Berry Perry has you covered every step of the way. 🙌 #BerryPerryLove',
    publishedAt: '2 weeks ago',
    likeCount: 3120,
    mediaType: 'image',
    postUrl: '#see-it-in-action',
  },
]

export const contactDetails = {
  intro: 'Have a question about an order, teamwear, or sizing? Leave us a message and our support team will get back to you.',
  email: '',
  phone: '',
  address: '',
  hours: '',
}

export const footerConfig = {
  logo: '',
  tagline: 'Performance wear for the game. Sportswear for everything after it.',
  shop: ['New arrivals', "Men's", 'Women', 'Cricket', 'Accessories'],
  sports: ['Cricket', 'Football', 'Shooting', 'Training', 'India merchandise', 'Shop outlet'],
  categories: ['Tops', 'Polos', 'Sleeveless', 'Long sleeves', 'Jackets & hoodies', 'Shorts', 'Pants & leggings', 'Tracksuits'],
  support: ['Contact', 'Shipping', 'Returns', 'Size guide'],
}

export const platformLabels: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
}
