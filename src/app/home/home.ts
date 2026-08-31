import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { I18nService } from '../services/i18n.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ScrollRevealDirective } from '../scroll-reveal';
import { ContentService } from '../services/content.service';
import { SectionsService } from '../services/sections.service';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'checkout';

@Component({
  selector: 'app-root',
  imports: [TranslatePipe, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit, OnDestroy {
  content = inject(ContentService);
  sections = inject(SectionsService);
  theme = inject(ThemeService);
  i18n = inject(I18nService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Live floor widget state
  readonly tables = signal(this.buildInitialTables());
  private intervalId?: ReturnType<typeof setInterval>;
  private reduceMotion = false;
  // Mobile navbar state
  readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  /** Height of the sticky header, used to offset scroll targets so section
   *  titles don't end up hidden underneath it. Keep in sync with .site-header
   *  height in home.css. */
  private readonly headerOffset = 76;

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      const state = history.state as { scrollTo?: string } | null;
      if (state?.scrollTo) {
        this.scrollToId(state.scrollTo);
        history.replaceState({ ...history.state, scrollTo: undefined }, '');
      }
    });
  }

  private scrollToId(id: string): void {
    const target = document.getElementById(id);
    if (!target) return;
    const targetY = target.getBoundingClientRect().top + window.scrollY - this.headerOffset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  scrollToSection(id: string, event: Event): void {
    event.preventDefault();
    if (!this.isBrowser) return;
    this.scrollToId(id);
  }

  navigateToSection(id: string, event: Event): void {
    this.scrollToSection(id, event);
    this.closeMobileMenu();
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reduceMotion) {
      this.intervalId = setInterval(() => this.randomizeOneTable(), 2200);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private buildInitialTables(): { id: number; status: TableStatus }[] {
    const layout: TableStatus[] = [
      'available', 'available', 'available', 'available', 'available',
      'occupied', 'occupied', 'occupied', 'occupied',
      'reserved', 'reserved',
      'checkout',
    ];
    return layout.map((status, i) => ({ id: i + 1, status }));
  }

  private randomizeOneTable(): void {
    const statuses: TableStatus[] = ['available', 'occupied', 'reserved', 'checkout'];
    const current = this.tables();
    const idx = Math.floor(Math.random() * current.length);
    const next = statuses[Math.floor(Math.random() * statuses.length)];
    this.tables.set(
      current.map((t, i) => (i === idx ? { ...t, status: next } : t))
    );
  }
}
