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

type TableStatus = 'Available' | 'Occupied' | 'Preparing' | 'Reserved' | 'Payment requested';

interface FloorTable {
  readonly number: number;
  readonly guests: number;
  readonly status: TableStatus;
  readonly orderStatus: string;
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

  protected readonly rotatingMessages = ['Manage faster', 'Serve smarter', 'Grow effortlessly'];
  protected readonly messageIndex = signal(0);
  protected readonly statsAnimated = signal(false);
  protected readonly statValues = signal([0, 0, 0, 0]);
  protected readonly selectedTableNumber = signal(2);
  protected readonly liveUpdates = signal(true);
  protected readonly tables = signal<readonly FloorTable[]>([
    {
      number: 1,
      guests: 0,
      status: 'Available',
      orderStatus: 'Ready for guests',
      amount: 0,
      elapsed: '—',
      position: 'table-a',
    },
    {
      number: 2,
      guests: 3,
      status: 'Occupied',
      orderStatus: 'Main courses served',
      amount: 86.5,
      elapsed: '31m',
      position: 'table-b',
    },
    {
      number: 3,
      guests: 2,
      status: 'Preparing',
      orderStatus: 'Kitchen is plating',
      amount: 48,
      elapsed: '12m',
      position: 'table-c',
    },
    {
      number: 4,
      guests: 4,
      status: 'Reserved',
      orderStatus: 'Arrival at 20:00',
      amount: 0,
      elapsed: '18m',
      position: 'table-d',
    },
    {
      number: 5,
      guests: 2,
      status: 'Occupied',
      orderStatus: 'Drinks delivered',
      amount: 34.75,
      elapsed: '19m',
      position: 'table-e',
    },
    {
      number: 6,
      guests: 5,
      status: 'Payment requested',
      orderStatus: 'Bill sent to table',
      amount: 124.2,
      elapsed: '54m',
      position: 'table-f',
    },
    {
      number: 7,
      guests: 0,
      status: 'Available',
      orderStatus: 'Reset complete',
      amount: 0,
      elapsed: '—',
      position: 'table-g',
    },
    {
      number: 8,
      guests: 2,
      status: 'Preparing',
      orderStatus: 'Order accepted',
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
    return status.toLowerCase().replaceAll(' ', '-');
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
        () => this.messageIndex.update((index) => (index + 1) % this.rotatingMessages.length),
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
      { status: 'Occupied', orderStatus: 'Order served', elapsed: '18m' },
      { status: 'Payment requested', orderStatus: 'Ready to settle', elapsed: '26m' },
      { status: 'Available', guests: 0, orderStatus: 'Table reset', amount: 0, elapsed: '—' },
      {
        status: 'Preparing',
        guests: 2,
        orderStatus: 'Kitchen is plating',
        amount: 48,
        elapsed: '12m',
      },
    ];
    const tableEightStates: readonly Partial<FloorTable>[] = [
      { status: 'Preparing', orderStatus: 'Kitchen is plating', elapsed: '13m' },
      { status: 'Occupied', orderStatus: 'Order delivered', elapsed: '20m' },
      { status: 'Payment requested', orderStatus: 'Guest requested bill', elapsed: '33m' },
      { status: 'Preparing', orderStatus: 'Order accepted', elapsed: '8m' },
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
