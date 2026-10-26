const mongoose = require('mongoose');
const path = require('path');
const { defaultTaxonomyConfig } = require(path.resolve(__dirname, '../lib/store-taxonomy'));
const { defaultSiteAssets } = require(path.resolve(__dirname, '../lib/site-assets'));

const uri = 'mongodb+srv://infotechpranavi_db_user:qwBOjZdaT9k51OJy@cluster0.uqqw5ay.mongodb.net/virat_sports?retryWrites=true&w=majority';

async function syncTaxAndMedia() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // 1. Sync storetaxonomies (both active_taxonomy and main_store_taxonomy)
  console.log('Syncing storetaxonomies with FirstCry kids categories...');
  const taxCol = db.collection('storetaxonomies');

  await taxCol.updateOne(
    { key: 'active_taxonomy' },
    {
      $set: {
        ...defaultTaxonomyConfig,
        key: 'active_taxonomy',
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );

  await taxCol.updateOne(
    { key: 'main_store_taxonomy' },
    {
      $set: {
        ...defaultTaxonomyConfig,
        key: 'main_store_taxonomy',
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );

  console.log('Successfully updated storetaxonomies.');

  // 2. Sync sitemedias to have all kids sections enabled by default
  console.log('Syncing sitemedias with kids store sections...');
  const mediaCol = db.collection('sitemedias');
  const existingMedia = await mediaCol.findOne({ key: 'active_config' }) || {};

  const updatedMedia = {
    ...defaultSiteAssets,
    ...existingMedia,
    key: 'active_config',
    welcomeSection: {
      ...defaultSiteAssets.welcomeSection,
      ...(existingMedia.welcomeSection || {}),
    },
    boysGirlsSection: {
      ...defaultSiteAssets.boysGirlsSection,
      ...(existingMedia.boysGirlsSection || {}),
    },
    modernToysSection: {
      ...defaultSiteAssets.modernToysSection,
      ...(existingMedia.modernToysSection || {}),
    },
    kidsCollectionsSection: {
      ...defaultSiteAssets.kidsCollectionsSection,
      ...(existingMedia.kidsCollectionsSection || {}),
    },
    instagramSection: {
      ...defaultSiteAssets.instagramSection,
      ...(existingMedia.instagramSection || {}),
    },
    shopByAgeSection: {
      ...defaultSiteAssets.shopByAgeSection,
      ...(existingMedia.shopByAgeSection || {}),
    },
    updatedAt: new Date(),
  };

  await mediaCol.updateOne(
    { key: 'active_config' },
    { $set: updatedMedia },
    { upsert: true }
  );

  console.log('Successfully updated sitemedias active_config.');
  process.exit(0);
}

syncTaxAndMedia().catch(err => {
  console.error(err);
  process.exit(1);
});
