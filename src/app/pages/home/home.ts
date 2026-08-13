import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { About } from '../about/about';
import { Policies } from '../policies/policies';
import { Services } from '../services/services';
import { LanguageService } from '../../core/i18n/language.service';

type TableStatus = 'available' | 'occupied' | 'preparing' | 'reserved' | 'paymentRequested';
type OrderStatus =
  | 'readyForGuests'
  | 'mainCoursesServed'
  | 'kitchenPlating'
  | 'arrivalAt'
  | 'drinksDelivered'
  | 'billSent'
  | 'resetComplete'
  | 'orderAccepted'
  | 'orderServed'
  | 'readyToSettle'
  | 'tableReset'
  | 'orderDelivered'
  | 'guestRequestedBill';

interface FloorTable {
  readonly number: number;
  readonly guests: number;
  readonly status: TableStatus;
  readonly orderStatus: OrderStatus;
  readonly amount: number;
  readonly elapsed: string;
  readonly position: string;
}

@Component({
  selector: 'app-home',
  imports: [Services, About, Policies],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private statsFrame = 0;
  private floorTick = 0;

  protected readonly t = inject(LanguageService).translations;
  protected readonly rotatingMessages = computed(() => this.t().home.hero.rotatingMessages);
  protected readonly messageIndex = signal(0);
  protected readonly statsAnimated = signal(false);
  protected readonly statValues = signal([0, 0, 0, 0]);
  protected readonly selectedTableNumber = signal(2);
  protected readonly liveUpdates = signal(true);
  protected readonly tables = signal<readonly FloorTable[]>([
    {
      number: 1,
      guests: 0,
      status: 'available',
      orderStatus: 'readyForGuests',
      amount: 0,
      elapsed: '—',
      position: 'table-a',
    },
    {
      number: 2,
      guests: 3,
      status: 'occupied',
      orderStatus: 'mainCoursesServed',
      amount: 86.5,
      elapsed: '31m',
      position: 'table-b',
    },
    {
      number: 3,
      guests: 2,
      status: 'preparing',
      orderStatus: 'kitchenPlating',
      amount: 48,
      elapsed: '12m',
      position: 'table-c',
    },
    {
      number: 4,
      guests: 4,
      status: 'reserved',
      orderStatus: 'arrivalAt',
      amount: 0,
      elapsed: '18m',
      position: 'table-d',
    },
    {
      number: 5,
      guests: 2,
      status: 'occupied',
      orderStatus: 'drinksDelivered',
      amount: 34.75,
      elapsed: '19m',
      position: 'table-e',
    },
    {
      number: 6,
      guests: 5,
      status: 'paymentRequested',
      orderStatus: 'billSent',
      amount: 124.2,
      elapsed: '54m',
      position: 'table-f',
    },
    {
      number: 7,
      guests: 0,
      status: 'available',
      orderStatus: 'resetComplete',
      amount: 0,
      elapsed: '—',
      position: 'table-g',
    },
    {
      number: 8,
      guests: 2,
      status: 'preparing',
      orderStatus: 'orderAccepted',
      amount: 57.4,
      elapsed: '8m',
      position: 'table-h',
    },
  ]);
  protected readonly selectedTable = computed(
    () =>
      this.tables().find((table) => table.number === this.selectedTableNumber()) ??
      this.tables()[0],
  );

  constructor() {
    afterNextRender(() => this.startEnhancements());
    this.destroyRef.onDestroy(() => {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.statsFrame);
      }
    });
  }

  protected scrollToFeatures(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById('features')
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  protected selectTable(number: number): void {
    this.selectedTableNumber.set(number);
  }

  protected toggleLiveUpdates(): void {
    this.liveUpdates.update((enabled) => !enabled);
  }

  protected statusClass(status: TableStatus): string {
    return status === 'paymentRequested' ? 'payment-requested' : status;
  }

  protected statValue(index: number): string {
    const value = this.statValues()[index];
    switch (index) {
      case 0:
        return `${Math.round(value)}%`;
      case 1:
        return `${value.toFixed(1)}%`;
      case 2:
        return `${Math.round(value)}+`;
      default:
        return `${Math.round(value)}/7`;
    }
  }

  private startEnhancements(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion) {
      const messageTimer = window.setInterval(
        () => this.messageIndex.update((index) => (index + 1) % this.rotatingMessages().length),
        3200,
      );
      this.destroyRef.onDestroy(() => window.clearInterval(messageTimer));
    }

    const floorTimer = window.setInterval(() => {
      if (this.liveUpdates()) {
        this.advanceFloorSample();
      }
    }, 7000);
    this.destroyRef.onDestroy(() => window.clearInterval(floorTimer));

    const stats = this.elementRef.nativeElement.querySelector('#features');
    if (!stats || !('IntersectionObserver' in window)) {
      this.animateStats(reducedMotion);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          this.animateStats(reducedMotion);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(stats);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private animateStats(reducedMotion: boolean): void {
    if (this.statsAnimated()) {
      return;
    }
    this.statsAnimated.set(true);
    const targets = [40, 99.9, 8, 24];
    if (reducedMotion) {
      this.statValues.set(targets);
      return;
    }

    const startedAt = performance.now();
    const update = (now: number): void => {
      const progress = Math.min(1, (now - startedAt) / 1050);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.statValues.set(targets.map((target) => target * eased));
      if (progress < 1) {
        this.statsFrame = requestAnimationFrame(update);
      }
    };
    this.statsFrame = requestAnimationFrame(update);
  }

  private advanceFloorSample(): void {
    const tableThreeStates: readonly Partial<FloorTable>[] = [
      { status: 'occupied', orderStatus: 'orderServed', elapsed: '18m' },
      { status: 'paymentRequested', orderStatus: 'readyToSettle', elapsed: '26m' },
      { status: 'available', guests: 0, orderStatus: 'tableReset', amount: 0, elapsed: '—' },
      {
        status: 'preparing',
        guests: 2,
        orderStatus: 'kitchenPlating',
        amount: 48,
        elapsed: '12m',
      },
    ];
    const tableEightStates: readonly Partial<FloorTable>[] = [
      { status: 'preparing', orderStatus: 'kitchenPlating', elapsed: '13m' },
      { status: 'occupied', orderStatus: 'orderDelivered', elapsed: '20m' },
      { status: 'paymentRequested', orderStatus: 'guestRequestedBill', elapsed: '33m' },
      { status: 'preparing', orderStatus: 'orderAccepted', elapsed: '8m' },
    ];
    const nextIndex = this.floorTick % tableThreeStates.length;
    this.tables.update((tables) =>
      tables.map((table) => {
        if (table.number === 3) return { ...table, ...tableThreeStates[nextIndex] };
        if (table.number === 8) return { ...table, ...tableEightStates[nextIndex] };
        return table;
      }),
    );
    this.floorTick += 1;
  }
}
