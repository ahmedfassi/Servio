import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Language, TRANSLATIONS } from './translations';

const LANGUAGE_STORAGE_KEY = 'servio_language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly language = signal<Language>('en');
  private readonly storageReady = signal(false);

  readonly currentLanguage = this.language.asReadonly();
  readonly translations = computed(() => TRANSLATIONS[this.language()]);

  constructor() {
    afterNextRender(() => {
      this.language.set(this.readStoredLanguage());
      this.storageReady.set(true);
    });

    effect(() => {
      const language = this.language();
      const translations = TRANSLATIONS[language];
      const storageReady = this.storageReady();

      this.document.documentElement.lang = language;
      this.document.title = translations.meta.title;
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', translations.meta.description);

      if (this.isBrowser && storageReady) {
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch {
          // The UI still works if storage is unavailable (for example in privacy mode).
        }
      }
    });
  }

  setLanguage(language: Language): void {
    this.language.set(language);
  }

  private readStoredLanguage(): Language {
    if (!this.isBrowser) {
      return 'en';
    }

    try {
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return storedLanguage === 'fr' || storedLanguage === 'en' ? storedLanguage : 'en';
    } catch {
      return 'en';
    }
  }
}
