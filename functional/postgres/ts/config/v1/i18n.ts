import i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: ['en', 'es'], // Supported languages
  directory: path.join(__dirname, '../../locales'),
  defaultLocale: 'en',
  autoReload: true,
  updateFiles: false,
  syncFiles: false,
  header: 'accept-language',
  objectNotation: true,
});

export default i18n;
