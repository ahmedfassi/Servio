import { TRANSLATIONS , Lang } from './translations';

export type { Lang };

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
    // Deep-clone so admin-panel edits never mutate the static defaults.
    translations: JSON.parse(JSON.stringify(TRANSLATIONS)),
    sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
  };
}