const fs = require('fs');

const html = fs.readFileSync('temp_diapers.html', 'utf8');

// Find the snippet further down after list_img
const idx = html.indexOf('2855491/product-detail');
if (idx !== -1) {
  console.log('Snippet 1800 to 3500:');
  console.log(html.slice(idx + 1500, idx + 3500));
}
