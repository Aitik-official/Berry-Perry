const mongoose = require('mongoose');

// We have lib/firstcry-categories.ts which exports firstCryCategoryHierarchy!
// Let's run with ts-node or transpiled require
const uri = 'mongodb+srv://infotechpranavi_db_user:qwBOjZdaT9k51OJy@cluster0.uqqw5ay.mongodb.net/virat_sports?retryWrites=true&w=majority';

// Read firstCryCategoryHierarchy by reading the json structure or parsing lib/firstcry-categories.ts
const fs = require('fs');
const content = fs.readFileSync('lib/firstcry-categories.ts', 'utf8');

const jsonMatch = content.match(/export const firstCryCategoryHierarchy: FirstCryCategory\[\] = (\[[\s\S]*?\]);\n\n\/\*\*/);
if (!jsonMatch) {
  console.error('Could not find firstCryCategoryHierarchy in lib/firstcry-categories.ts');
  process.exit(1);
}

const firstCryCategories = eval(jsonMatch[1]);
console.log(`Loaded ${firstCryCategories.length} categories from lib/firstcry-categories.ts`);

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected!');

  const db = mongoose.connection.db;

  const mainCategories = firstCryCategories.map((cat, idx) => ({
    id: `main-${cat.slug}`,
    label: cat.name,
    value: cat.slug,
    showOnNavbar: idx < 10,
    description: `${cat.name} products and collections`,
    order: idx + 1
  }));

  const subCategories = [];
  firstCryCategories.forEach((cat) => {
    cat.children.forEach((sub, sIdx) => {
      subCategories.push({
        id: sub.id,
        label: sub.name,
        value: sub.slug,
        parentCategory: cat.slug,
        description: `${sub.name} under ${cat.name}`,
        image: ''
      });
    });
  });

  console.log(`Seeding ${mainCategories.length} main categories and ${subCategories.length} subcategories.`);

  const taxCol = db.collection('storetaxonomies');
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
      { id: 'sp-clothing', label: 'Fashion & Clothing', value: 'clothing' }
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
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
