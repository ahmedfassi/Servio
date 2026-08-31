import { Component, inject, signal, effect, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionsService } from '../../services/sections.service';
import { HomeSectionData, newSection, newItem } from '../../services/section.model';

type EditLang = 'en' | 'ar';

@Component({
  selector: 'app-sections-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sections-manager.html',
  styleUrl: './sections-manager.css',
})
export class SectionsManager {
  private readonly sectionsService = inject(SectionsService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly lang = signal<EditLang>('en');
  readonly status = signal<string | null>(null);
  readonly expandedId = signal<string | null>(null);

  draft: HomeSectionData[] = [];
  private draftInitialized = false;

  constructor() {
    effect(() => {
      if (this.sectionsService.loaded() && !this.draftInitialized) {
        this.draft = clone(this.sectionsService.sections());
        this.draftInitialized = true;
        this.cdr.markForCheck();
      }
    });
  }

  setLang(lang: EditLang): void {
    this.lang.set(lang);
  }

  toggleExpanded(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  kindLabel(kind: HomeSectionData['kind']): string {
    if (kind === 'hero') return 'Fixed';
    if (kind === 'contact') return 'Fixed';
    return 'Content';
  }

  /** What to show as the row's main heading. Hero/Contact are fixed-content
   *  kinds with no title field of their own, so they get a proper label
   *  instead of falling back to an empty string. Content sections show
   *  their tag (the small eyebrow label) rather than the full title, since
   *  the tag is shorter and reads better as a list heading. */
  displayTitle(section: HomeSectionData): string {
    if (section.kind === 'hero') return 'Hero';
    if (section.kind === 'contact') return 'Contact form';
    return section.tag[this.lang()]?.trim() || 'Untitled section';
  }

  isUntitled(section: HomeSectionData): boolean {
    return section.kind === 'content' && !section.tag[this.lang()]?.trim();
  }

  canDelete(section: HomeSectionData): boolean {
    return section.kind === 'content';
  }

  addSection(): void {
    const section = newSection(this.draft.length);
    this.draft = [...this.draft, section];
    this.expandedId.set(section.id);
    this.status.set(null);
  }

  removeSection(id: string): void {
    this.draft = this.draft.filter((s) => s.id !== id);
    if (this.expandedId() === id) this.expandedId.set(null);
    this.status.set(null);
  }

  toggleVisible(section: HomeSectionData): void {
    section.visible = !section.visible;
  }

  moveUp(index: number): void {
    if (index <= 0) return;
    const copy = [...this.draft];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    this.draft = copy;
  }

  moveDown(index: number): void {
    if (index >= this.draft.length - 1) return;
    const copy = [...this.draft];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    this.draft = copy;
  }

  addItem(section: HomeSectionData): void {
    section.items = [...section.items, newItem()];
  }

  removeItem(section: HomeSectionData, itemId: string): void {
    section.items = section.items.filter((i) => i.id !== itemId);
  }

  moveItemUp(section: HomeSectionData, index: number): void {
    if (index <= 0) return;
    const items = [...section.items];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    section.items = items;
  }

  moveItemDown(section: HomeSectionData, index: number): void {
    if (index >= section.items.length - 1) return;
    const items = [...section.items];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    section.items = items;
  }

  save(): void {
    this.status.set(null);
    this.sectionsService.save(this.draft).subscribe({
      next: () => this.status.set('Saved.'),
      error: () => this.status.set('Could not save — is the backend running?'),
    });
  }

  resetFromServer(): void {
    this.draft = clone(this.sectionsService.sections());
    this.expandedId.set(null);
    this.status.set(null);
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}