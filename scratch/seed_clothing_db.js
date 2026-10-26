const mongoose = require('mongoose');
const path = require('path');
const { firstCryClothingProducts } = require(path.resolve(__dirname, '../lib/firstcry-clothing-data'));
const uri = 'mongodb+srv://infotechpranavi_db_user:qwBOjZdaT9k51OJy@cluster0.uqqw5ay.mongodb.net/virat_sports?retryWrites=true&w=majority';

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const col = db.collection('products');

  console.log('Upserting FirstCry clothing products (' + firstCryClothingProducts.length + ' items)...');
  let count = 0;
  for (const item of firstCryClothingProducts) {
    const doc = {
      ...item,
      updatedAt: new Date(),
    };
    await col.updateOne(
      { id: item.id },
      { $set: doc },
      { upsert: true }
    );
    count++;
  }

  // Also remove any legacy Virat/cricket test items if any exist
  const removed = await col.deleteMany({
    $or: [
      { name: /virat/i },
      { slug: /virat/i },
      { sport: 'cricket' }
    ]
  });
  console.log('Cleaned up legacy cricket items:', removed.deletedCount);

  const total = await col.countDocuments();
  console.log('Total products currently in MongoDB:', total);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
