import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLayout } from '../../components/admin-layout/admin-layout';
import { AuthService } from '../../core/auth/auth.service';
import {
  Customer,
  CustomerDetail,
  CustomerInput,
  CustomerService,
} from '../../core/services/customer.service';
interface ApiErrorBody {
  readonly message?: unknown;
}
@Component({
  selector: 'app-admin-customers',
  imports: [AdminLayout, ReactiveFormsModule],
  templateUrl: './admin-customers.html',
  styleUrl: './admin-customers.css',
})
export class AdminCustomers {
  private readonly api = inject(CustomerService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  protected readonly customers = signal<readonly Customer[]>([]);
  protected readonly selected = signal<CustomerDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly formOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly search = signal('');
  protected readonly filtered = computed(() => {
    const term = this.search().toLowerCase();
    return this.customers().filter(
      (c) => !term || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(term),
    );
  });
  protected readonly totalSpent = computed(() =>
    this.customers().reduce((sum, c) => sum + c.totalSpent, 0),
  );
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
  });
  constructor() {
    this.load();
  }
  protected setSearch(e: Event): void {
    this.search.set((e.target as HTMLInputElement).value);
  }
  protected open(c?: Customer): void {
    this.editingId.set(c?._id ?? null);
    this.form.reset(
      c ? { name: c.name, phone: c.phone, email: c.email } : { name: '', phone: '', email: '' },
    );
    this.errorMessage.set('');
    this.formOpen.set(true);
  }
  protected close(): void {
    if (!this.saving()) this.formOpen.set(false);
  }
  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value: CustomerInput = this.form.getRawValue();
    const request = this.editingId()
      ? this.api.update(this.editingId()!, value)
      : this.api.create(value);
    this.saving.set(true);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.successMessage.set(this.editingId() ? 'Customer updated.' : 'Customer created.');
        this.load(false);
      },
      error: (e: HttpErrorResponse) => {
        this.saving.set(false);
        this.handle(e, 'Customer could not be saved.');
      },
    });
  }
  protected view(c: Customer): void {
    this.api
      .get(c._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => this.selected.set(d),
        error: (e: HttpErrorResponse) => this.handle(e, 'Customer details could not be loaded.'),
      });
  }
  protected closeDetail(): void {
    this.selected.set(null);
  }
  protected remove(c: Customer): void {
    if (this.deletingId() || !this.document.defaultView?.confirm(`Delete ${c.name}?`)) return;
    this.deletingId.set(c._id);
    this.api
      .delete(c._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingId.set(null);
          this.successMessage.set('Customer deleted.');
          this.load(false);
        },
        error: (e: HttpErrorResponse) => {
          this.deletingId.set(null);
          this.handle(e, 'Customer could not be deleted.');
        },
      });
  }
  protected reload(): void {
    this.load();
  }
  protected money(v: number): string {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(v);
  }
  protected date(v: string | null): string {
    return v ? new Intl.DateTimeFormat('en-TN', { dateStyle: 'medium' }).format(new Date(v)) : '—';
  }
  private load(clear = true): void {
    this.loading.set(true);
    this.errorMessage.set('');
    if (clear) this.successMessage.set('');
    this.api
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => {
          this.customers.set(c);
          this.loading.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.loading.set(false);
          this.handle(e, 'Customers could not be loaded.');
        },
      });
  }
  private handle(e: HttpErrorResponse, f: string): void {
    if (e.status === 401) {
      this.auth.logout();
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/customers' } });
      return;
    }
    if (e.status === 0) {
      this.errorMessage.set('The Serv.io server is unavailable.');
      return;
    }
    const b = e.error as ApiErrorBody | null;
    this.errorMessage.set(typeof b?.message === 'string' ? b.message : f);
  }
}
