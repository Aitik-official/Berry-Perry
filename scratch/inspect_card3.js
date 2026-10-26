const fs = require('fs');

const html = fs.readFileSync('temp_diapers.html', 'utf8');

// Find the snippet further down after small_st1
const idx = html.indexOf('2855491/product-detail');
if (idx !== -1) {
  console.log('Snippet 3500 to 5000:');
  console.log(html.slice(idx + 3300, idx + 4500));
}
