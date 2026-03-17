const fs = require('fs');
let code = fs.readFileSync('src/i18n.js', 'utf8');

const dict = {
  'AcasÄƒ': 'Acasă',
  'PreÈ›uri': 'Prețuri',
  'Prezentare generalÄƒ': 'Prezentare generală',
  'InvitaÈ›i': 'Invitați',
  'AÈ™ezare': 'Așezare',
  'Atribuie InvitaÈ›i': 'Atribuie Invitați',
  'ziua perfectÄƒ': 'ziua perfectă',
  'dragoste.': 'dragoste.',
  'ContacteazÄƒ-ne': 'Contactează-ne',
  'Ã®ntrebÄƒri': 'întrebări',
  'sÄƒ stÄƒm': 'să stăm',
  'È™i': 'și',
  'Ã®È›i': 'îți',
  'rÄƒspunde': 'răspunde',
  'Ã®n': 'în',
  'ÃŽncepe': 'Începe',
  'PlanificÄƒ': 'Planifică',
  'plÄƒÈ›ile': 'plățile',
  'funcÈ›ioneazÄƒ': 'funcționează',
  'Unelte complet': 'Unelte complet',
  'menite sÄƒ reducÄƒ': 'menite să reducă',
  'stresul È™i sÄƒ facÄƒ': 'stresul și să facă',
  'planificarea nunÈ›ii plÄƒcutÄƒ': 'planificarea nunții plăcută',
  'ObÈ›ine': 'Obține',
  'planificÄƒri': 'planificări',
  'Management InvitaÈ›i': 'Management Invitați',
  'GestioneazÄƒ uÈ™or': 'Gestionează ușor',
  'confirmÄƒrile': 'confirmările',
  'UrmÄƒrire': 'Urmărire',
  'platÄƒ': 'plată',
  'Èšine toÈ›i': 'Ține toți',
  'notiÈ›ele': 'notițele',
  'CombinÄƒm': 'Combinăm',
  'experienÈ›Äƒ perfectÄƒ': 'experiență perfectă',
  'planificare a nunÈ›ii': 'planificare a nunții',
  'sÄƒ Ã®ncepi': 'să începi',
  'AlÄƒturÄƒ-te': 'Alătură-te',
  'CreeazÄƒ': 'Creează',
  'NouÄƒ': 'Nouă',
  'ÃŽntrebÄƒri': 'Întrebări',
  'sÄƒ È™tii': 'să știi',
  'sÄƒ Ã®l': 'să îl',
  'LocaÈ›ia': 'Locația',
  'AnuleazÄƒ': 'Anulează',
  'AdaugÄƒ': 'Adaugă',
  'AdulÈ›i/Copii (ÃŽnsoÈ›itori)': 'Adulți/Copii (Însoțitori)',
  'SalveazÄƒ': 'Salvează',
  'ÃŽnsoÈ›itori': 'Însoțitori',
  'InvitaÈ›ie': 'Invitație',
  'AcÈ›iuni': 'Acțiuni',
  'CopiazÄƒ': 'Copiază',
  'EditeazÄƒ': 'Editează',
  'gÄƒsit': 'găsit',
  'InformaÈ›ii': 'Informații',
  'DietÄƒ': 'Dietă',
  'CerinÈ›e': 'Cerințe',
  'Ã®nregistratÄƒ': 'înregistrată',
  'invitaÈ›i': 'invitați',
  'rÄƒspunsurile': 'răspunsurile',
  'CautÄƒ': 'Caută',
  'FiltreazÄƒ dupÄƒ': 'Filtrează după',
  'singurÄƒ persoanÄƒ': 'singură persoană',
  'AdulÈ›i': 'Adulți',
  'aÈ™teptare': 'așteptare',
  'SetÄƒri': 'Setări',
  'LuminoasÄƒ': 'Luminoasă',
  'ÃŽnapoi': 'Înapoi',
  'TemÄƒ': 'Temă',
  'IÅ½napoi' : 'Înapoi',
};

// also regular regex replacement for individual stray characters
let regexFixes = [
  [/Äƒ/g, "ă"],
  [/Ä‚/g, "Ă"],
  [/È™/g, "ș"],
  [/È˜/g, "Ș"],
  [/È›/g, "ț"],
  [/Èš/g, "Ț"],
  [/Ã¢/g, "â"],
  [/Ã‚/g, "Â"],
  [/Ã®/g, "î"],
  [/ÃŽ/g, "Î"],
];

for(const [bad, good] of Object.entries(dict)) {
   code = code.split(bad).join(good);
}
for(const [reg, good] of regexFixes) {
   code = code.replace(reg, good);
}

fs.writeFileSync('src/i18n.js', code, 'utf8');
console.log('Fixed correctly from CJS with true UTF-8 strings!');
