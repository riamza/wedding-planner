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
      // Look for t("key") or t('key') or t(`key`)
      // Also handles spaces like t( "key" )
      const R = /t\(\s*[\'\"\`]([A-Za-z0-9_.-]+)[\'\"\`]\s*\)/g;
      let m;
      while ((m = R.exec(src)) !== null) {
        keys.push(m[1]);
      }
    }
  }
  return keys;
}

const allKeys = [...new Set(getKeys(path.join(__dirname, 'src')))];
let i18n = fs.readFileSync(path.join(__dirname, 'src', 'i18n.js'), 'utf8');

// Also check if the key is defined with or without quotes
// e.g. "my_key": or my_key: or 'my_key':
const missing = allKeys.filter(k => {
  const reg = new RegExp(`['"\`]?${k}['"\`]?\\s*:`);
  return !reg.test(i18n);
});

console.log('Found missing keys:', missing.join(', '));

if (missing.length > 0) {
  let injection = missing.map(k => `      "${k}": "${k}",`).join('\n');
  i18n = i18n.replace(/en:\s*\{\s*translation:\s*\{/, 'en: {\n    translation: {\n' + injection);
  i18n = i18n.replace(/ro:\s*\{\s*translation:\s*\{/, 'ro: {\n    translation: {\n' + injection);
  fs.writeFileSync(path.join(__dirname, 'src', 'i18n.js'), i18n, 'utf8');
  console.log('Successfully injected missing keys.');
} else {
  console.log('No missing keys found.');
}
