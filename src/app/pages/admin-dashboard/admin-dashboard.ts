import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import {
  DashboardService,
  DashboardStats,
  DashboardTopItem,
} from '../../core/services/dashboard.service';
import { Order } from '../../core/services/order.service';
import {
  RestaurantTable as ApiRestaurantTable,
  TableService,
} from '../../core/services/table.service';

type DisplayOrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Paid' | 'Cancelled';
type RestaurantTableStatus = 'Occupied' | 'Free' | 'Reserved';

interface SidebarItem {
  readonly label: string;
  readonly iconPath: string;
  readonly route: string;
}

interface DashboardStat {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly iconPath: string;
  readonly tone: string;
}

interface RecentOrder {
  readonly id: string;
  readonly table: string;
  readonly amount: string;
  readonly status: DisplayOrderStatus;
  readonly time: string;
}

interface RestaurantTable {
  readonly number: number;
  readonly status: RestaurantTableStatus;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private readonly auth = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly tableService = inject(TableService);

  protected readonly sidebarOpen = signal(false);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly currentUser = this.auth.user;
  protected readonly userName = computed(() => this.currentUser()?.name ?? 'Admin');
  protected readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());
  private readonly dashboardStats = signal<DashboardStats | null>(null);
  private readonly recentOrderData = signal<readonly Order[]>([]);
  private readonly tableData = signal<readonly ApiRestaurantTable[]>([]);

  protected readonly sidebarItems: readonly SidebarItem[] = [
    {
      label: 'Dashboard',
      iconPath: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
      route: '/admin',
    },
    {
      label: 'Tables',
      iconPath: 'M5 8h14v7H5V8Zm3 7v5m8-5v5M3 11h2m14 0h2',
      route: '/admin/tables',
    },
    {
      label: 'Orders',
      iconPath: 'M6 3h12l1 18-7-3-7 3L6 3Zm3 5h6M9 12h6',
      route: '/admin/orders',
    },
    {
      label: 'Services',
      iconPath: 'M5 4h14v16H5V4Zm4 0v16M12 8h4m-4 4h4m-4 4h3',
      route: '/admin/services',
    },
    {
      label: 'Customers',
      iconPath:
        'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75',
      route: '/admin/customers',
    },
    {
      label: 'Staff',
      iconPath:
        'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75',
      route: '/admin/staff',
    },
    {
      label: 'Reports',
      iconPath: 'M4 20V10m6 10V4m6 16v-7m5 7H2',
      route: '/admin/reports',
    },
    {
      label: 'Settings',
      iconPath:
        'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.2-6.2-1.4 1.4M6.7 17.3l-1.4 1.4m13.4 0-1.4-1.4M6.7 6.7 5.3 5.3',
      route: '/admin/settings',
    },
  ];

  protected readonly stats = computed<readonly DashboardStat[]>(() => {
    const stats = this.dashboardStats();
    if (!stats) return [];

    return [
      {
        label: 'Total Orders',
        value: this.formatNumber(stats.orders),
        detail: 'All recorded orders',
        iconPath: 'M5 4h14l-1 17-6-3-6 3L5 4Zm4 5h6m-6 4h6',
        tone: 'orange',
      },
      {
        label: 'Menu Items',
        value: this.formatNumber(stats.menuItems),
        detail: 'Items in the digital menu',
        iconPath: 'M4 5h16M4 12h16M4 19h16',
        tone: 'green',
      },
      {
        label: 'Tables',
        value: this.formatNumber(stats.tables),
        detail: 'Dining room tables',
        iconPath: 'M5 8h14v7H5V8Zm3 7v5m8-5v5M3 11h2m14 0h2',
        tone: 'blue',
      },
      {
        label: 'Pending Orders',
        value: this.formatNumber(stats.pendingOrders),
        detail: 'Waiting to be prepared',
        iconPath: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
        tone: 'amber',
      },
      {
        label: 'Completed Orders',
        value: this.formatNumber(stats.completedOrders),
        detail: 'Served or paid orders',
        iconPath: 'm5 12 4 4L19 6',
        tone: 'green',
      },
      {
        label: 'Users',
        value: this.formatNumber(stats.users),
        detail: 'Admin and staff accounts',
        iconPath:
          'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87',
        tone: 'blue',
      },
      {
        label: 'Revenue',
        value: this.formatCurrency(stats.revenue),
        detail: 'Revenue from paid orders',
        iconPath: 'M12 2v20m5-16.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
        tone: 'amber',
      },
    ];
  });

  protected readonly recentOrders = computed<readonly RecentOrder[]>(() =>
    this.recentOrderData().map((order) => ({
      id: `#${order._id.slice(-6).toUpperCase()}`,
      table: this.tableLabel(order),
      amount: this.formatCurrency(order.totalAmount),
      status: this.displayOrderStatus(order.status),
      time: new Intl.DateTimeFormat('en-TN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(order.createdAt)),
    })),
  );

  protected readonly topSellingItems = signal<readonly DashboardTopItem[]>([]);

  protected readonly restaurantTables = computed<readonly RestaurantTable[]>(() =>
    this.tableData().map((table) => ({
      number: table.number,
      status:
        table.status === 'available'
          ? 'Free'
          : table.status === 'occupied'
            ? 'Occupied'
            : 'Reserved',
    })),
  );

  constructor() {
    this.loadDashboard();
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected reload(): void {
    this.loadDashboard();
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  protected statusClass(status: DisplayOrderStatus | RestaurantTableStatus): string {
    return status.toLowerCase().replaceAll(' ', '-');
  }

  private loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      stats: this.dashboardService.getStats(),
      orders: this.dashboardService.getRecentOrders(),
      topItems: this.dashboardService.getTopItems(),
      tables: this.tableService.getAll(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ stats, orders, topItems, tables }) => {
          this.dashboardStats.set(stats);
          this.recentOrderData.set(orders);
          this.topSellingItems.set(topItems);
          this.tableData.set(tables);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          if (error.status === 401) {
            this.auth.logout();
            void this.router.navigate(['/login']);
          } else if (error.status === 403) {
            this.errorMessage.set('Your account does not have permission to view this dashboard.');
          } else if (error.status === 0) {
            this.errorMessage.set('The Serv.io server is unavailable. Please try again shortly.');
          } else {
            this.errorMessage.set('Dashboard data could not be loaded. Please try again.');
          }
        },
      });
  }

  private tableLabel(order: Order): string {
    return order.table && typeof order.table !== 'string'
      ? `Table ${order.table.number}`
      : 'Table unavailable';
  }

  private displayOrderStatus(status: Order['status']): DisplayOrderStatus {
    return this.capitalize(status) as DisplayOrderStatus;
  }

  private capitalize(value: string): string {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('en-TN').format(value);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(value);
  }
}
