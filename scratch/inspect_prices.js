const fs = require('fs');

const html = fs.readFileSync('temp_diapers.html', 'utf8');

// Search for price patterns, e.g. R32_42, B16_42, rupe, price, or data-price
const priceRegex = /<span[^>]*class="[^"]*(?:rupee|price)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;
let m;
const prices = [];
while ((m = priceRegex.exec(html)) !== null) {
  const p = m[1].replace(/<[^>]+>/g, '').trim();
  if (p) prices.push(p);
}
console.log('Price elements found:', prices.slice(0, 10));

// Also let's inspect product title links
const prodLinkRegex = /<a[^>]*href="([^"]*product-detail[^"]*)"[^>]*title="([^"]*)"[^>]*>/gi;
const prodLinks = [];
while ((m = prodLinkRegex.exec(html)) !== null) {
  prodLinks.push({ url: m[1], title: m[2] });
}
console.log('Product links with title found:', prodLinks.length);
prodLinks.slice(0, 5).forEach(p => console.log('Title:', p.title, 'URL:', p.url));
