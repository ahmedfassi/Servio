import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Lang } from './content.model';
import { ContentService } from './content.service';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'servio-lang';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly contentService = inject(ContentService);

  readonly value = signal<Lang>(this.getInitialLang());

  constructor() {
    effect(() => {
      const current = this.value();
      if (!this.isBrowser) return;
      document.documentElement.setAttribute('lang', current);
      document.documentElement.setAttribute('dir', current === 'ar' ? 'rtl' : 'ltr');
      localStorage.setItem(this.storageKey, current);
    });
  }

  toggle(): void {
    this.value.set(this.value() === 'en' ? 'ar' : 'en');
  }

  /** Look up a translation key for the active language, sourced from
   *  ContentService (API-managed content when available, falling back
   *  to the built-in defaults otherwise). */
  t(key: string): string {
    return this.contentService.content().translations[this.value()][key] ?? key;
  }

  private getInitialLang(): Lang {
    if (!this.isBrowser) return 'en';
    const saved = localStorage.getItem(this.storageKey) as Lang | null;
    if (saved === 'en' || saved === 'ar') return saved;
    return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  }
}