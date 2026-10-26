const fs = require('fs');

const html = fs.readFileSync('temp_diapers.html', 'utf8');

// Find the snippet around Huggies Complete Comfort
const idx = html.indexOf('2855491/product-detail');
if (idx !== -1) {
  console.log('Snippet around first product:');
  console.log(html.slice(idx - 200, idx + 1800));
}
