import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface AdminNavItem {
  readonly label: string;
  readonly route: string;
  readonly iconPath: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();

  protected readonly sidebarOpen = signal(false);
  protected readonly userName = computed(() => this.auth.user()?.name ?? 'Admin');
  protected readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());
  protected readonly navigation: readonly AdminNavItem[] = [
    {
      label: 'Dashboard',
      route: '/admin',
      iconPath: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
    },
    {
      label: 'Tables',
      route: '/admin/tables',
      iconPath: 'M5 8h14v7H5V8Zm3 7v5m8-5v5M3 11h2m14 0h2',
    },
    { label: 'Orders', route: '/admin/orders', iconPath: 'M6 3h12l1 18-7-3-7 3L6 3Zm3 5h6M9 12h6' },
    {
      label: 'Services',
      route: '/admin/services',
      iconPath: 'M5 4h14v16H5V4Zm4 0v16M12 8h4m-4 4h4m-4 4h3',
    },
    {
      label: 'Customers',
      route: '/admin/customers',
      iconPath:
        'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87',
    },
    {
      label: 'Staff',
      route: '/admin/staff',
      iconPath:
        'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m7.5-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6m3-3h-6',
    },
    { label: 'Reports', route: '/admin/reports', iconPath: 'M4 20V10m6 10V4m6 16v-7m5 7H2' },
    {
      label: 'Settings',
      route: '/admin/settings',
      iconPath:
        'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.2-6.2-1.4 1.4M6.7 17.3l-1.4 1.4m13.4 0-1.4-1.4M6.7 6.7 5.3 5.3',
    },
  ];

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
