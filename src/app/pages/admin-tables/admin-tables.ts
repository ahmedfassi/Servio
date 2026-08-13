import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import {
  RestaurantTable,
  TableInput,
  TableService,
  TableStatus,
} from '../../core/services/table.service';

interface SidebarItem {
  readonly label: string;
  readonly iconPath: string;
  readonly route: string;
}

interface ApiErrorBody {
  readonly message?: unknown;
}

@Component({
  selector: 'app-admin-tables',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-tables.html',
  styleUrl: './admin-tables.css',
})
export class AdminTables {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly tableService = inject(TableService);

  protected readonly sidebarOpen = signal(false);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly formOpen = signal(false);
  protected readonly formSubmitted = signal(false);
  protected readonly editingTableId = signal<string | null>(null);
  protected readonly tables = signal<readonly RestaurantTable[]>([]);
  protected readonly currentUser = this.auth.user;
  protected readonly userName = computed(() => this.currentUser()?.name ?? 'Admin');
  protected readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());
  protected readonly isEditing = computed(() => this.editingTableId() !== null);
  protected readonly formTitle = computed(() => (this.isEditing() ? 'Edit Table' : 'Add Table'));

  protected readonly statuses: readonly TableStatus[] = ['available', 'occupied', 'reserved'];
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
        'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 1 0 7.75',
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

  protected readonly tableForm = new FormGroup({
    number: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    capacity: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    status: new FormControl<TableStatus>('available', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    this.loadTables();
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected openCreateForm(): void {
    this.editingTableId.set(null);
    this.formSubmitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.tableForm.reset({ number: 1, capacity: 1, status: 'available' });
    this.formOpen.set(true);
  }

  protected openEditForm(table: RestaurantTable): void {
    this.editingTableId.set(table._id);
    this.formSubmitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.tableForm.reset({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
    });
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    if (!this.saving()) this.formOpen.set(false);
  }

  protected saveTable(): void {
    this.formSubmitted.set(true);
    if (this.tableForm.invalid || this.saving()) {
      this.tableForm.markAllAsTouched();
      return;
    }

    const input: TableInput = this.tableForm.getRawValue();
    const editingId = this.editingTableId();
    const request = editingId
      ? this.tableService.update(editingId, input)
      : this.tableService.create(input);

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.successMessage.set(
          editingId ? 'Table updated successfully.' : 'Table added successfully.',
        );
        this.loadTables(false);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.handleError(error, 'The table could not be saved. Please try again.');
      },
    });
  }

  protected deleteTable(table: RestaurantTable): void {
    if (this.deletingId()) return;

    const confirmed = this.document.defaultView?.confirm(
      `Delete Table ${table.number}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    this.deletingId.set(table._id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.tableService
      .delete(table._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingId.set(null);
          this.successMessage.set(`Table ${table.number} deleted successfully.`);
          this.loadTables(false);
        },
        error: (error: HttpErrorResponse) => {
          this.deletingId.set(null);
          this.handleError(error, 'The table could not be deleted. Please try again.');
        },
      });
  }

  protected reload(): void {
    this.loadTables();
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  protected statusLabel(status: TableStatus): string {
    return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('en-TN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  private loadTables(clearMessages = true): void {
    this.loading.set(true);
    this.errorMessage.set('');
    if (clearMessages) this.successMessage.set('');

    this.tableService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tables) => {
          this.tables.set(tables);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.handleError(error, 'Tables could not be loaded. Please try again.');
        },
      });
  }

  private handleError(error: HttpErrorResponse, fallback: string): void {
    if (error.status === 401) {
      this.auth.logout();
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/tables' } });
      return;
    }

    if (error.status === 0) {
      this.errorMessage.set('The Serv.io server is unavailable. Please try again shortly.');
      return;
    }

    const body = error.error as ApiErrorBody | null;
    this.errorMessage.set(typeof body?.message === 'string' ? body.message : fallback);
  }
}
