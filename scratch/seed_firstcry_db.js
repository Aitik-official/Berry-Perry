const mongoose = require('mongoose');
const fs = require('fs');

const uri = 'mongodb+srv://infotechpranavi_db_user:qwBOjZdaT9k51OJy@cluster0.uqqw5ay.mongodb.net/virat_sports?retryWrites=true&w=majority';

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected!');

  const db = mongoose.connection.db;

  // 1. Seed Products from scratch/firstcry_products_live.json
  const fcProducts = JSON.parse(fs.readFileSync('scratch/firstcry_products_live.json', 'utf8'));
  console.log(`Read ${fcProducts.length} FirstCry products.`);

  const productsCol = db.collection('products');
  let prodsUpserted = 0;
  for (const p of fcProducts) {
    await productsCol.updateOne(
      { id: p.id },
      { $set: { ...p, updatedAt: new Date() } },
      { upsert: true }
    );
    prodsUpserted++;
  }
  console.log(`Successfully upserted ${prodsUpserted} FirstCry products into MongoDB 'products' collection.`);

  // 2. Seed StoreTaxonomies with FirstCry main categories & subcategories
  const fcCats = JSON.parse(fs.readFileSync('scratch/firstcry_sitemap_extracted.json', 'utf8'));
  console.log(`Read ${fcCats.length} FirstCry taxonomy categories.`);

  const mainCategories = fcCats.map((cat, idx) => {
    const slug = cat.mainTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      id: `main-${slug}`,
      label: cat.mainTitle,
      value: slug,
      showOnNavbar: idx < 10, // top 10 on navbar
      description: `${cat.mainTitle} products and accessories`,
      order: idx + 1
    };
  });

  const subCategories = [];
  fcCats.forEach((cat) => {
    const parentSlug = cat.mainTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    cat.subcategories.forEach((sub, sIdx) => {
      const subSlug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      subCategories.push({
        id: `cat-${parentSlug}-${subSlug || sIdx}`,
        label: sub.title,
        value: subSlug,
        parentCategory: parentSlug,
        description: `${sub.title} under ${cat.mainTitle}`,
        image: ''
      });
    });
  });

  console.log(`Prepared ${mainCategories.length} main categories and ${subCategories.length} subcategories.`);

  const taxCol = db.collection('storetaxonomies');
  
  // Read existing doc if any to keep announcements/contact intact
  const existingTax = await taxCol.findOne({ key: 'main_store_taxonomy' });

  const updatedTaxonomy = {
    key: 'main_store_taxonomy',
    mainCategories,
    categories: subCategories,
    sports: [
      { id: 'sp-baby', label: 'Baby & Infant', value: 'baby' },
      { id: 'sp-toddler', label: 'Toddlers', value: 'toddler' },
      { id: 'sp-kids', label: 'Kids & Teens', value: 'kids' },
      { id: 'sp-moms', label: 'Moms & Maternity', value: 'moms' },
      { id: 'sp-cricket', label: 'Cricket & Sports', value: 'cricket' }
    ],
    badges: [
      { id: 'badge-1', name: "Mom's Pick", bgColor: '#EB008B', textColor: '#ffffff', description: "Top recommended by mothers" },
      { id: 'badge-2', name: 'Bestseller', bgColor: '#5CB946', textColor: '#ffffff', description: 'Most popular item' },
      { id: 'badge-3', name: 'Top Rated', bgColor: '#FFF000', textColor: '#1A1A1A', description: 'Highest verified reviews' },
      { id: 'badge-4', name: '50% OFF', bgColor: '#ff6b9d', textColor: '#ffffff', description: 'Seasonal promotion' }
    ],
    sizes: ['Newborn', '0-6M', '6-12M', '1-2Y', '2-4Y', '4-6Y', 'Free Size'],
    announcement: existingTax?.announcement || {
      enabled: true,
      text: 'Free Shipping on Orders Over $50! Shop Now 🎉',
      linkText: 'Shop Now',
      linkHref: '/products?badge=deal',
      items: [
        { text: 'Free Shipping on Orders Over $50! Shop Now 🎉', linkText: 'Shop Now', linkHref: '/products?badge=deal' },
        { text: 'New FirstCry Baby Care & Toys Collection is Live!', linkText: 'Explore', linkHref: '/products' }
      ],
      bgColor: '#ff6b9d',
      textColor: '#ffffff'
    },
    contactInfo: existingTax?.contactInfo || {
      email: 'support@berryperry.com',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      address: 'Berry Perry Kidswear & Activewear Hub, India',
      hours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
      instagram: 'https://instagram.com/berryperryofficial',
      youtube: 'https://youtube.com',
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com'
    },
    updatedAt: new Date()
  };

  await taxCol.updateOne(
    { key: 'main_store_taxonomy' },
    { $set: updatedTaxonomy },
    { upsert: true }
  );

  console.log('Successfully seeded FirstCry categories into MongoDB storetaxonomies collection!');
  
  const totalInDb = await productsCol.countDocuments();
  console.log(`Total products currently in MongoDB: ${totalInDb}`);

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
