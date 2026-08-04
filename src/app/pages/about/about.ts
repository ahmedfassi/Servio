import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';

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

  protected readonly activeValue = signal('Hospitality');
  protected readonly valueNodes: readonly ValueNode[] = [
    {
      name: 'Simplicity',
      description: 'Complex operations, made instinctive.',
      symbol: '01',
      position: 'value-north',
    },
    {
      name: 'Speed',
      description: 'Every tap respects the pace of service.',
      symbol: '02',
      position: 'value-east',
    },
    {
      name: 'Reliability',
      description: 'Steady technology for the busiest hours.',
      symbol: '03',
      position: 'value-south-east',
    },
    {
      name: 'Insight',
      description: 'Clear signals that lead to better decisions.',
      symbol: '04',
      position: 'value-south-west',
    },
    {
      name: 'Hospitality',
      description: 'Technology that keeps people at the center.',
      symbol: '05',
      position: 'value-west',
    },
  ];

  constructor() {
    afterNextRender(() => this.setupJourneyReveal());
  }

  protected selectValue(name: string): void {
    this.activeValue.set(name);
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
