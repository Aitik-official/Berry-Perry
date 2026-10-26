const https = require('https');
const fs = require('fs');

const missingCats = [
  { slug: 'feeding-bottles', url: 'https://www.firstcry.com/feeding-and-nursing/2/0/0?sort=bestseller', cat: 'Feeding & Nursing', sport: 'feeding', gender: 'unisex' },
  { slug: 'baby-skin-care', url: 'https://www.firstcry.com/bath-and-skincare/3/0/0?sort=bestseller', cat: 'Bath & Skin Care', sport: 'skincare', gender: 'unisex' },
  { slug: 'learning-toys', url: 'https://www.firstcry.com/toys-and-gaming/5/0/0?sort=bestseller', cat: 'Toys & Gaming', sport: 'toys', gender: 'unisex' },
  { slug: 'tops-and-tees', url: 'https://www.firstcry.com/clothes-and-shoes/6/0/0?sort=bestseller', cat: 'Baby & Kids Clothing', sport: 'clothing', gender: 'unisex' },
  { slug: 'nursery-furniture', url: 'https://www.firstcry.com/nursery/8/0/0?sort=bestseller', cat: 'Nursery Furniture', sport: 'nursery', gender: 'unisex' }
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
      res.on('end', () => resolve({ target, html: data }));
    }).on('error', () => resolve({ target, html: '' }));
  });
}

function parseProducts(target, html) {
  const products = [];
  if (!html) return products;

  const imgRegex = /<img[^>]*src="([^"]*cdn\.fcglcdn\.com\/brainbees\/images\/products\/[^"]+)"[^>]*alt="([^"]+)"[^>]*>/gi;
  let m;
  const seenUrls = new Set();

  while ((m = imgRegex.exec(html)) !== null) {
    let imgSrc = m[1];
    if (!imgSrc.startsWith('http')) imgSrc = 'https:' + (imgSrc.startsWith('//') ? '' : '//') + imgSrc;
    imgSrc = imgSrc.replace('/219x265/', '/400x485/');

    const title = m[2].trim();
    if (title.length < 5 || title.includes('loader') || title.includes('logo')) continue;

    const pos = m.index;
    const surrounding = html.slice(Math.max(0, pos - 500), Math.min(html.length, pos + 2500));

    const urlMatch = surrounding.match(/href=["']([^"']*\/product-detail)["']/i);
    let prodUrl = urlMatch ? urlMatch[1] : `https://www.firstcry.com/${target.slug}/product-detail`;
    if (!prodUrl.startsWith('http')) prodUrl = 'https:' + (prodUrl.startsWith('//') ? '' : '//') + prodUrl;

    if (seenUrls.has(title)) continue;
    seenUrls.add(title);

    const priceAria = surrounding.match(/aria-label="Sale price RS ([0-9.]+)(?: and Regular price RS ([0-9.]+))?"/i)
      || surrounding.match(/(?:RS|₹)\s*([0-9.]+)/i);
    let price = 399 + (products.length * 90);
    let originalPrice = undefined;
    if (priceAria) {
      const parsedPrice = Math.round(parseFloat(priceAria[1]));
      if (parsedPrice > 50 && parsedPrice < 50000) price = parsedPrice;
      if (priceAria[2]) originalPrice = Math.round(parseFloat(priceAria[2]));
    }

    const rateMatch = surrounding.match(/data-rate="([0-9.]+)"/i) || surrounding.match(/([45]\.[0-9])/);
    const rating = rateMatch ? parseFloat(rateMatch[1]) : 4.8;

    const pidMatch = prodUrl.match(/\/([0-9]{5,10})\/product-detail/) || surrounding.match(/data-pid="([0-9]+)"/i);
    const fcPid = pidMatch ? pidMatch[1] : `fc-${Date.now()}-${products.length}`;
    
    const cleanSlug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) + '-' + fcPid;

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
      originalPrice: originalPrice || Math.round(price * 1.35),
      badge: products.length % 2 === 0 ? "Mom's Pick" : products.length % 3 === 0 ? "Bestseller" : "Top Rated",
      image: imgSrc,
      images: [imgSrc],
      description: `${title}. Premium quality authentic baby & kids merchandise engineered for safety, comfort, and durability. Certified non-toxic and hypoallergenic.`,
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
      rating: rating || 4.8,
      reviewsCount: 95 + (products.length * 42),
      stockQuantity: 120,
      sourceUrl: prodUrl
    });

    if (products.length >= 6) break;
  }

  return products;
}

async function run() {
  const existing = JSON.parse(fs.readFileSync('scratch/firstcry_products_live.json', 'utf8'));
  for (const cat of missingCats) {
    console.log(`Fetching ${cat.cat}...`);
    const { target, html } = await fetchPage(cat);
    const prods = parseProducts(target, html);
    console.log(` -> Found ${prods.length} products.`);
    existing.push(...prods);
  }

  console.log('Total FirstCry products extracted:', existing.length);
  fs.writeFileSync('scratch/firstcry_products_live.json', JSON.stringify(existing, null, 2));
}

run();
