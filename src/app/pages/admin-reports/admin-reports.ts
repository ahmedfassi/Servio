import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AdminLayout } from '../../components/admin-layout/admin-layout';
import { AuthService } from '../../core/auth/auth.service';
import { Report, ReportService } from '../../core/services/report.service';
interface ApiErrorBody {
  readonly message?: unknown;
}
@Component({
  selector: 'app-admin-reports',
  imports: [AdminLayout],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports {
  private readonly api = inject(ReportService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  protected readonly report = signal<Report | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly range = signal('30');
  protected readonly from = signal('');
  protected readonly to = signal('');
  protected readonly maxStatus = computed(() =>
    Math.max(1, ...(this.report()?.statuses.map((v) => v.count) ?? [1])),
  );
  protected readonly maxDaily = computed(() =>
    Math.max(1, ...(this.report()?.daily.map((v) => v.orders) ?? [1])),
  );
  protected readonly topItems = computed(() => this.report()?.items.slice(0, 5) ?? []);
  protected readonly leastItems = computed(() =>
    [...(this.report()?.items ?? [])].sort((a, b) => a.quantity - b.quantity).slice(0, 5),
  );
  constructor() {
    this.load();
  }
  protected changeRange(e: Event): void {
    this.range.set((e.target as HTMLSelectElement).value);
    if (this.range() !== 'custom') this.load();
  }
  protected setFrom(e: Event): void {
    this.from.set((e.target as HTMLInputElement).value);
  }
  protected setTo(e: Event): void {
    this.to.set((e.target as HTMLInputElement).value);
  }
  protected apply(): void {
    this.load();
  }
  protected money(v: number): string {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(v);
  }
  protected width(v: number, max: number): string {
    return `${Math.max(3, (v / max) * 100)}%`;
  }
  private load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    let from: string | undefined;
    let to: string | undefined;
    if (this.range() === 'custom') {
      from = this.from() ? new Date(`${this.from()}T00:00:00`).toISOString() : undefined;
      to = this.to() ? new Date(`${this.to()}T23:59:59.999`).toISOString() : undefined;
    } else if (this.range() !== 'all') {
      const days = Number(this.range());
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (days - 1));
      from = date.toISOString();
    }
    this.api
      .get(from, to)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.report.set(r);
          this.loading.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.loading.set(false);
          if (e.status === 401) {
            this.auth.logout();
            void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/reports' } });
            return;
          }
          const b = e.error as ApiErrorBody | null;
          this.errorMessage.set(
            typeof b?.message === 'string' ? b.message : 'Reports could not be loaded.',
          );
        },
      });
  }
}
