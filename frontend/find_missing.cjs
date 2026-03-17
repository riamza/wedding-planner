const fs = require('fs');
const path = require('path');

function getKeys(dir) {
  let keys = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      keys.push(...getKeys(p));
    } else if (p.endsWith('.js') || p.endsWith('.jsx')) {
      const src = fs.readFileSync(p, 'utf8');
      const R = /t\([\'\"\`]([A-Za-z0-9_.-]+)[\'\"\`]\)/g;
      let m;
      while ((m = R.exec(src)) !== null) {
        keys.push(m[1]);
      }
    }
  }
  return keys;
}

const allKeys = [...new Set(getKeys(path.join(__dirname, 'src')))];
let i18n = fs.readFileSync(path.join(__dirname, 'src/i18n.js'), 'utf8');

const missing = allKeys.filter(k => 
  i18n.indexOf('"' + k + '":') === -1 && 
  i18n.indexOf(k + ':') === -1
);

console.log('Missing: ', missing);

if (missing.length > 0) {
  let injection = missing.map(k => '      "' + k + '": "' + k + '",').join('\n');
  i18n = i18n.replace(/en:\s*\{\s*translation:\s*\{/, 'en: {\n    translation: {\n' + injection);
  i18n = i18n.replace(/ro:\s*\{\s*translation:\s*\{/, 'ro: {\n    translation: {\n' + injection);
  fs.writeFileSync(path.join(__dirname, 'src/i18n.js'), i18n, 'utf8');
}
