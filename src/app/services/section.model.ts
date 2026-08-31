export type SectionKind = 'hero' | 'contact' | 'content';
export type SectionLayout = 'text' | 'grid' | 'steps';

export interface Bilingual {
  en: string;
  ar: string;
}

export interface SectionItemData {
  id: string;
  icon: string;
  title: Bilingual;
  body: Bilingual;
}

export interface HomeSectionData {
  id: string;
  kind: SectionKind;
  layout: SectionLayout;
  visible: boolean;
  order: number;
  icon: string;
  tag: Bilingual;
  title: Bilingual;
  body: Bilingual;
  /** Explanatory note shown for fixed (hero/contact) sections in the editor.
   *  Empty for 'content' sections — they use tag/title/body instead. */
  note: Bilingual;
  items: SectionItemData[];
}

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function newSection(order: number): HomeSectionData {
  return {
    id: randomId('sec'),
    kind: 'content',
    layout: 'text',
    visible: true,
    order,
    icon: '✨',
    tag: { en: '', ar: '' },
    title: { en: 'New section', ar: 'قسم جديد' },
    body: { en: '', ar: '' },
    note: { en: '', ar: '' },
    items: [],
  };
}

export function newItem(): SectionItemData {
  return {
    id: randomId('item'),
    icon: '⭐',
    title: { en: '', ar: '' },
    body: { en: '', ar: '' },
  };
}