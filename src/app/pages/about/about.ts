import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';

interface ValueNode {
  readonly name: string;
  readonly description: string;
  readonly symbol: string;
  readonly position: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly t = inject(LanguageService).translations;
  protected readonly activeValue = signal('value-west');
  private readonly valueLayout = [
    { symbol: '01', position: 'value-north' },
    { symbol: '02', position: 'value-east' },
    { symbol: '03', position: 'value-south-east' },
    { symbol: '04', position: 'value-south-west' },
    { symbol: '05', position: 'value-west' },
  ] as const;
  protected readonly valueNodes = computed<readonly ValueNode[]>(() =>
    this.valueLayout.map((layout, index) => ({ ...layout, ...this.t().about.values[index] })),
  );

  constructor() {
    afterNextRender(() => this.setupJourneyReveal());
  }

  protected selectValue(id: string): void {
    this.activeValue.set(id);
  }

  private setupJourneyReveal(): void {
    const host = this.elementRef.nativeElement;
    const steps = host.querySelectorAll<HTMLElement>('.journey-step');
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      steps.forEach((step) => step.classList.add('is-visible'));
      return;
    }

    host.classList.add('reveal-enabled');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.22, rootMargin: '0px 0px -8% 0px' },
    );
    steps.forEach((step) => observer.observe(step));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
