import { Component, inject, signal } from '@angular/core';
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

  readonly lang = signal<Lang>('en');
  readonly status = signal<string | null>(null);

  // Local editable copy — snapshotted so typing doesn't affect the live
  // site until "Save" is pressed.
  draft = clone(this.contentService.content().translations);

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  get groups(): { prefix: string; keys: string[] }[] {
    const keys = Object.keys(this.draft[this.lang()] ?? {}).sort();
    const map = new Map<string, string[]>();
    for (const key of keys) {
      const prefix = key.split('.')[0];
      if (!map.has(prefix)) map.set(prefix, []);
      map.get(prefix)!.push(key);
    }
    return Array.from(map.entries()).map(([prefix, keys]) => ({ prefix, keys }));
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