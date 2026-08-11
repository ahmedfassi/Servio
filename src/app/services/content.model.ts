export type Lang = 'en' | 'ar';

export type SectionId = 'about' | 'features' | 'flow' | 'contact';

export interface SiteContent {
  translations: Record<Lang, Record<string, string>>;
  sectionVisibility: Record<SectionId, boolean>;
}

export const DEFAULT_SECTION_VISIBILITY: Record<SectionId, boolean> = {
  about: true,
  features: true,
  flow: true,
  contact: true,
};

export function buildDefaultContent(): SiteContent {
  return {
    // Empty until the API responds. Content now lives entirely in the
    // database — see ContentService — so there's no static fallback text
    // anymore. TranslatePipe/I18nService.t() falls back to showing the raw
    // key if a translation isn't loaded yet.
    translations: { en: {}, ar: {} },
    sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
  };
}