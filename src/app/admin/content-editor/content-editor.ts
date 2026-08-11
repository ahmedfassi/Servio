import { Component, inject, signal, effect, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { Lang } from '../../services/content.model';

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './content-editor.html',
  styleUrl: './content-editor.css',
})
export class ContentEditor {
  private readonly contentService = inject(ContentService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly lang = signal<Lang>('en');
  readonly status = signal<string | null>(null);

  draft: Record<Lang, Record<string, string>> = { en: {}, ar: {} };
  private draftInitialized = false;

  constructor() {
    effect(() => {
      if (this.contentService.loaded() && !this.draftInitialized) {
        this.draft = clone(this.contentService.content().translations);
        this.draftInitialized = true;
        this.cdr.markForCheck(); // tell Angular this component needs re-rendering
      }
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  get groups(): { prefix: string; label: string; keys: string[] }[] {
    const keys = Object.keys(this.draft[this.lang()] ?? {}).sort();
    const map = new Map<string, string[]>();
    for (const key of keys) {
      const prefix = key.split('.')[0];
      if (!map.has(prefix)) map.set(prefix, []);
      map.get(prefix)!.push(key);
    }
    return Array.from(map.entries()).map(([prefix, keys]) => ({
      prefix,
      label: humanize(prefix),
      keys,
    }));
  }

  fieldLabel(key: string): string {
    const parts = key.split('.');
    const suffix = parts.length > 1 ? parts.slice(1).join('.') : key;
    return humanize(suffix);
  }

  save(): void {
    this.status.set(null);
    const current = this.contentService.content();
    this.contentService.save({ ...current, translations: this.draft }).subscribe({
      next: () => this.status.set('Saved.'),
      error: () => this.status.set('Could not save — is the backend running?'),
    });
  }

  resetFromServer(): void {
    this.draft = clone(this.contentService.content().translations);
    this.status.set(null);
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function humanize(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}