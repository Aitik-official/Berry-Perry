const fs = require('fs');

const html = fs.readFileSync('temp_diapers.html', 'utf8');

// Check JSON-LD
const jsonLds = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
console.log('JSON-LD blocks count:', jsonLds.length);
jsonLds.forEach((j, i) => {
  const content = j.replace(/<\/?script[^>]*>/gi, '').trim();
  try {
    const parsed = JSON.parse(content);
    console.log(`Block ${i + 1} @type:`, parsed['@type']);
    if (parsed['@type'] === 'ItemList' && parsed.itemListElement) {
      console.log('Found ItemList with items:', parsed.itemListElement.length);
      console.log('First 2 items:', JSON.stringify(parsed.itemListElement.slice(0, 2), null, 2));
    }
  } catch (err) {
    // ignore
  }
});

// Check img tags with cdn.fcglcdn.com
const fcImgs = [];
const imgRegex = /<img[^>]*src="([^"]*fcglcdn[^"]*)"[^>]*alt="([^"]*)"/gi;
let m;
while ((m = imgRegex.exec(html)) !== null) {
  fcImgs.push({ src: m[1], alt: m[2] });
}
console.log('Total fcglcdn product images found:', fcImgs.length);
fcImgs.slice(0, 5).forEach(img => console.log('  Image:', img.src, 'Alt:', img.alt));
