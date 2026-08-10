import { TRANSLATIONS } from '../src/app/services/translations.ts';
import { writeFileSync } from 'node:fs';

const seed = {
  translations: TRANSLATIONS,
  sectionVisibility: { about: true, features: true, flow: true, contact: true },
};

writeFileSync('content-data.json', JSON.stringify(seed, null, 2), 'utf8');
console.log('Wrote content-data.json — copy this into your XAMPP servio-api folder.');