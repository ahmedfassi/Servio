import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';

interface Service {
  readonly name: string;
  readonly kicker: string;
  readonly description: string;
  readonly icon: string;
  readonly position: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  protected readonly t = inject(LanguageService).translations;
  protected readonly activeService = signal<string | null>(null);
  private readonly serviceLayout = [
    { icon: '≡', position: 'north' },
    { icon: '⌗', position: 'north-east' },
    { icon: '◎', position: 'east' },
    { icon: '↗', position: 'south-east' },
    { icon: '◇', position: 'south' },
    { icon: '→', position: 'south-west' },
    { icon: '▦', position: 'west' },
    { icon: '⌁', position: 'north-west' },
  ] as const;
  protected readonly services = computed<readonly Service[]>(() =>
    this.serviceLayout.map((layout, index) => ({ ...layout, ...this.t().services.items[index] })),
  );

  protected toggleService(id: string): void {
    this.activeService.update((active) => (active === id ? null : id));
  }
}
