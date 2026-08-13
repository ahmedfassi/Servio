import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-policies',
  imports: [],
  templateUrl: './policies.html',
  styleUrl: './policies.css',
})
export class Policies {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private copyTimer = 0;

  protected readonly t = inject(LanguageService).translations;
  protected readonly readingProgress = signal(0);
  protected readonly activeSection = signal('privacy');
  protected readonly copiedSection = signal<string | null>(null);
  protected readonly openSections = signal<readonly string[]>(['privacy']);

  constructor() {
    afterNextRender(() => this.updateReadingProgress());
    this.destroyRef.onDestroy(() => clearTimeout(this.copyTimer));
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected updateReadingProgress(): void {
    const scrollable =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    this.readingProgress.set(Math.min(100, Math.max(0, progress)));
    this.updateActiveSection();
  }

  protected isOpen(id: string): boolean {
    return this.openSections().includes(id);
  }

  protected toggleSection(id: string): void {
    this.openSections.update((open) =>
      open.includes(id) ? open.filter((sectionId) => sectionId !== id) : [...open, id],
    );
  }

  protected openSection(id: string): void {
    if (!this.isOpen(id)) {
      this.openSections.update((open) => [...open, id]);
    }
  }

  protected async copySectionLink(id: string): Promise<void> {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    this.copiedSection.set(id);
    window.clearTimeout(this.copyTimer);
    this.copyTimer = window.setTimeout(() => this.copiedSection.set(null), 1800);
  }

  private updateActiveSection(): void {
    const sections = this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.policy-section');
    let active = sections[0]?.id ?? 'privacy';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 180) {
        active = section.id;
      }
    });
    this.activeSection.set(active);
  }
}
