const https = require('https');
const fs = require('fs');

const categoriesToFetch = [
  { slug: 'baby-diapers', url: 'https://www.firstcry.com/baby-diapers/1/27?ref2=sitemap_fc', cat: 'Baby Diapering', sport: 'diapering', gender: 'unisex' },
  { slug: 'feeding-bottles', url: 'https://www.firstcry.com/bottles-and-accessories/2/32?ref2=sitemap_fc', cat: 'Feeding & Nursing', sport: 'feeding', gender: 'unisex' },
  { slug: 'baby-skin-care', url: 'https://www.firstcry.com/skin-care/3/81?ref2=sitemap_fc', cat: 'Bath & Skin Care', sport: 'skincare', gender: 'unisex' },
  { slug: 'learning-toys', url: 'https://www.firstcry.com/learning-and-activity-toys/5/42?ref2=sitemap_fc', cat: 'Toys & Gaming', sport: 'toys', gender: 'unisex' },
  { slug: 'tops-and-tees', url: 'https://www.firstcry.com/tops-and-tees/6/26?ref2=sitemap_fc', cat: 'Baby & Kids Clothing', sport: 'clothing', gender: 'unisex' },
  { slug: 'kids-footwear', url: 'https://www.firstcry.com/footwear/6/170?ref2=sitemap_fc', cat: 'Baby & Kids Footwear', sport: 'footwear', gender: 'unisex' },
  { slug: 'baby-strollers', url: 'https://www.firstcry.com/baby-strollers-prams/7/44?ref2=sitemap_fc', cat: 'Baby Gear', sport: 'gear', gender: 'unisex' },
  { slug: 'school-supplies', url: 'https://www.firstcry.com/school-bags-and-back-packs/10/110?ref2=sitemap_fc', cat: 'School Supplies', sport: 'school', gender: 'unisex' },
  { slug: 'maternity-wear', url: 'https://www.firstcry.com/maternity-tops/21/222?ref2=sitemap_fc', cat: 'Moms & Maternity', sport: 'maternity', gender: 'women' },
  { slug: 'fashion-accessories', url: 'https://www.firstcry.com/sunglasses/22/228?ref2=sitemap_fc', cat: 'Fashion Accessories', sport: 'accessories', gender: 'unisex' }
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

function fetchPage(target) {
  return new Promise((resolve) => {
    https.get(target.url, { headers }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({ target, html: data });
      });
    }).on('error', (err) => {
      console.error('Error fetching', target.slug, err.message);
      resolve({ target, html: '' });
    });
  });
}

function parseProducts(target, html) {
  const products = [];
  if (!html) return products;

  // Split by product block: class="list_img wifi" or data-pid
  const blocks = html.split('<div class="list_img');
  
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].slice(0, 4500);

    // Title & URL
    const titleMatch = block.match(/href='([^']+\/product-detail)'[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/i)
      || block.match(/href="([^"]+\/product-detail)"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/i);
    
    if (!titleMatch) continue;

    let prodUrl = titleMatch[1];
    if (!prodUrl.startsWith('http')) prodUrl = 'https:' + (prodUrl.startsWith('//') ? '' : '//') + prodUrl;
    
    let imgSrc = titleMatch[2];
    if (!imgSrc.startsWith('http')) imgSrc = 'https:' + (imgSrc.startsWith('//') ? '' : '//') + imgSrc;
    // Upgrade low-res image to high-res zoom or 400x485
    imgSrc = imgSrc.replace('/219x265/', '/400x485/');

    const title = titleMatch[3].trim();

    // Prices from aria-label="Sale price RS 1294.17 and Regular price RS 2248"
    const priceAria = block.match(/aria-label="Sale price RS ([0-9.]+)(?: and Regular price RS ([0-9.]+))?"/i);
    let price = 499;
    let originalPrice = undefined;
    if (priceAria) {
      price = Math.round(parseFloat(priceAria[1])) || 499;
      if (priceAria[2]) {
        originalPrice = Math.round(parseFloat(priceAria[2]));
      }
    }

    // Rating from data-rate="4.2"
    const rateMatch = block.match(/data-rate="([0-9.]+)"/i);
    const rating = rateMatch ? parseFloat(rateMatch[1]) : 4.6;

    // Review count from (131.1k Ratings)
    const revMatch = block.match(/\(([0-9.kK]+)\s*Ratings?\)/i);
    let reviewsCount = 42;
    if (revMatch) {
      const raw = revMatch[1].toLowerCase();
      if (raw.endsWith('k')) reviewsCount = Math.round(parseFloat(raw) * 1000);
      else reviewsCount = parseInt(raw, 10) || 42;
    }

    // Badge / Tag from cpn_inside
    const badgeMatch = block.match(/class="[^"]*tagline_block[^"]*"[^>]*><span[^>]*>([^<]+)<\/span>/i);
    const badge = badgeMatch ? badgeMatch[1].trim() : undefined;

    // Unique ID and slug
    const idMatch = block.match(/data-pid="([0-9]+)"/i);
    const fcPid = idMatch ? idMatch[1] : `fc-${Date.now()}-${i}`;
    const cleanSlug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 65) + '-' + fcPid;

    products.push({
      id: `fc-prod-${fcPid}`,
      name: title,
      slug: cleanSlug,
      gender: target.gender,
      category: target.cat,
      mainCategory: target.cat,
      subCategory: target.slug,
      sport: target.sport,
      price,
      originalPrice,
      badge,
      image: imgSrc,
      images: [imgSrc],
      description: `${title}. Premium quality authentic baby & kids merchandise engineered for comfort, safety, and durability. Certified non-toxic and hypoallergenic.`,
      features: [
        'Certified non-toxic, safe & child-friendly materials',
        'Engineered for long-lasting daily use and easy washing',
        'Hypoallergenic fabrics & tested skin-friendly components',
        'Authentic brand warranty & 30-day hassle-free return guarantee'
      ],
      sizes: ['Standard', 'Newborn', '0-6M', '6-12M', '1-2Y', 'Free Size'],
      colors: [
        { name: 'Vibrant Berry', hex: '#EB008B' },
        { name: 'Fresh Meadow', hex: '#5CB946' },
        { name: 'Sunny Pastel', hex: '#FFF000' }
      ],
      inStock: true,
      rating,
      reviewsCount,
      stockQuantity: 150,
      sourceUrl: prodUrl
    });

    if (products.length >= 6) break; // 6 products per category = 60 products total!
  }

  return products;
}

async function run() {
  console.log('Fetching FirstCry products from', categoriesToFetch.length, 'key categories...');
  const allProds = [];

  for (const cat of categoriesToFetch) {
    console.log(`Fetching ${cat.cat} (${cat.slug})...`);
    const { target, html } = await fetchPage(cat);
    const prods = parseProducts(target, html);
    console.log(` -> Found ${prods.length} products with images and pricing.`);
    allProds.push(...prods);
  }

  console.log('\nTotal FirstCry products extracted:', allProds.length);
  fs.writeFileSync('scratch/firstcry_products_live.json', JSON.stringify(allProds, null, 2));
  console.log('Saved to scratch/firstcry_products_live.json');
}

run();
