import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AdminLayout } from '../../components/admin-layout/admin-layout';
import { AuthService } from '../../core/auth/auth.service';
import { Order, OrderService, OrderStatus } from '../../core/services/order.service';

interface ApiErrorBody {
  readonly message?: unknown;
}

@Component({
  selector: 'app-admin-orders',
  imports: [AdminLayout],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly ordersApi = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly orders = signal<readonly Order[]>([]);
  protected readonly loading = signal(true);
  protected readonly changingId = signal<string | null>(null);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly search = signal('');
  protected readonly statusFilter = signal<OrderStatus | 'all'>('all');
  protected readonly statuses: readonly OrderStatus[] = [
    'pending',
    'preparing',
    'ready',
    'served',
    'paid',
    'cancelled',
  ];

  protected readonly filteredOrders = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.orders().filter((order) => {
      const statusMatches = this.statusFilter() === 'all' || order.status === this.statusFilter();
      const table = this.tableLabel(order).toLowerCase();
      const items = order.items
        .map((item) => item.name)
        .join(' ')
        .toLowerCase();
      return (
        statusMatches &&
        (!term ||
          order._id.toLowerCase().includes(term) ||
          table.includes(term) ||
          items.includes(term))
      );
    });
  });
  protected readonly pendingCount = computed(
    () => this.orders().filter((order) => order.status === 'pending').length,
  );
  protected readonly completedCount = computed(
    () =>
      this.orders().filter((order) => order.status === 'served' || order.status === 'paid').length,
  );
  protected readonly paidRevenue = computed(() =>
    this.orders()
      .filter((order) => order.status === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0),
  );

  constructor() {
    this.loadOrders();
  }

  protected setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
  protected setFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as OrderStatus | 'all');
  }

  protected changeStatus(order: Order, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as OrderStatus;
    if (status === order.status || this.changingId()) return;
    this.changingId.set(order._id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.ordersApi
      .updateStatus(order._id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.changingId.set(null);
          this.successMessage.set('Order status updated.');
          this.loadOrders(false);
        },
        error: (error: HttpErrorResponse) => {
          this.changingId.set(null);
          this.handleError(error, 'Order status could not be updated.');
        },
      });
  }

  protected deleteOrder(order: Order): void {
    if (
      this.deletingId() ||
      !this.document.defaultView?.confirm(`Delete order #${order._id.slice(-6).toUpperCase()}?`)
    )
      return;
    this.deletingId.set(order._id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.ordersApi
      .delete(order._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingId.set(null);
          this.successMessage.set('Order deleted successfully.');
          this.loadOrders(false);
        },
        error: (error: HttpErrorResponse) => {
          this.deletingId.set(null);
          this.handleError(error, 'Order could not be deleted.');
        },
      });
  }

  protected reload(): void {
    this.loadOrders();
  }
  protected tableLabel(order: Order): string {
    return order.table && typeof order.table !== 'string'
      ? `Table ${order.table.number}`
      : 'Table unavailable';
  }
  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(value);
  }
  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('en-TN', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );
  }

  private loadOrders(clearMessages = true): void {
    this.loading.set(true);
    this.errorMessage.set('');
    if (clearMessages) this.successMessage.set('');
    this.ordersApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.handleError(error, 'Orders could not be loaded.');
        },
      });
  }

  private handleError(error: HttpErrorResponse, fallback: string): void {
    if (error.status === 401) {
      this.auth.logout();
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/orders' } });
      return;
    }
    if (error.status === 0) {
      this.errorMessage.set('The Serv.io server is unavailable.');
      return;
    }
    const body = error.error as ApiErrorBody | null;
    this.errorMessage.set(typeof body?.message === 'string' ? body.message : fallback);
  }
}
