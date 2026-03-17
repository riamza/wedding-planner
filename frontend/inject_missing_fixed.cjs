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

const missing = allKeys.filter(k => {
  const reg = new RegExp(`['"\`]?${k}['"\`]?\\s*:`);
  return !reg.test(i18n);
});

console.log('Found missing keys: ' + missing.length);

if (missing.length > 0) {
  let injection = missing.map(k => `      "${k}": "${k}",`).join('\n');
  
  if (i18n.includes('en: {\n    translation: {')) {
     i18n = i18n.replace('en: {\n    translation: {', 'en: {\n    translation: {\n' + injection);
  } else {
     console.log('Could not find EN injection point!');
  }

  if (i18n.includes('ro: {\n    translation: {')) {
     i18n = i18n.replace('ro: {\n    translation: {', 'ro: {\n    translation: {\n' + injection);
  } else {
     console.log('Could not find RO injection point!');
  }

  fs.writeFileSync(path.join(__dirname, 'src', 'i18n.js'), i18n, 'utf8');
  console.log('Successfully injected missing keys.');
} else {
  console.log('No missing keys found.');
}
