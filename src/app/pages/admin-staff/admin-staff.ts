import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLayout } from '../../components/admin-layout/admin-layout';
import { AuthService } from '../../core/auth/auth.service';
import { StaffInput, StaffMember, StaffService } from '../../core/services/staff.service';
interface ApiErrorBody {
  readonly message?: unknown;
}
@Component({
  selector: 'app-admin-staff',
  imports: [AdminLayout, ReactiveFormsModule],
  templateUrl: './admin-staff.html',
  styleUrl: './admin-staff.css',
})
export class AdminStaff {
  private readonly auth = inject(AuthService);
  private readonly api = inject(StaffService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  protected readonly staff = signal<readonly StaffMember[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly search = signal('');
  protected readonly filtered = computed(() => {
    const term = this.search().toLowerCase();
    return this.staff().filter(
      (member) => !term || `${member.name} ${member.email}`.toLowerCase().includes(term),
    );
  });
  protected readonly activeCount = computed(
    () => this.staff().filter((member) => member.active).length,
  );
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.minLength(6)] }),
    active: new FormControl(true, { nonNullable: true }),
  });
  constructor() {
    this.load();
  }
  protected setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
  protected open(member?: StaffMember): void {
    this.editingId.set(member?._id ?? null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.reset(
      member
        ? { name: member.name, email: member.email, password: '', active: member.active }
        : { name: '', email: '', password: '', active: true },
    );
    this.formOpen.set(true);
  }
  protected close(): void {
    if (!this.saving()) this.formOpen.set(false);
  }
  protected save(): void {
    if (this.form.invalid || (!this.editingId() && !this.form.controls.password.value)) {
      this.form.markAllAsTouched();
      return;
    }
    const value: StaffInput = this.form.getRawValue();
    const request = this.editingId()
      ? this.api.update(this.editingId()!, value)
      : this.api.create(value);
    this.saving.set(true);
    this.errorMessage.set('');
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.successMessage.set(
          this.editingId() ? 'Staff member updated.' : 'Staff member created.',
        );
        this.load(false);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.handle(error, 'Staff member could not be saved.');
      },
    });
  }
  protected toggle(member: StaffMember): void {
    this.api
      .update(member._id, { name: member.name, email: member.email, active: !member.active })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Account status updated.');
          this.load(false);
        },
        error: (error: HttpErrorResponse) =>
          this.handle(error, 'Account status could not be updated.'),
      });
  }
  protected remove(member: StaffMember): void {
    if (
      this.deletingId() ||
      !this.document.defaultView?.confirm(`Remove staff account ${member.name}?`)
    )
      return;
    this.deletingId.set(member._id);
    this.api
      .delete(member._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingId.set(null);
          this.successMessage.set('Staff member removed.');
          this.load(false);
        },
        error: (error: HttpErrorResponse) => {
          this.deletingId.set(null);
          this.handle(error, 'Staff member could not be removed.');
        },
      });
  }
  protected reload(): void {
    this.load();
  }
  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('en-TN', { dateStyle: 'medium' }).format(new Date(value));
  }
  private load(clear = true): void {
    this.loading.set(true);
    this.errorMessage.set('');
    if (clear) this.successMessage.set('');
    this.api
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (staff) => {
          this.staff.set(staff);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.handle(error, 'Staff could not be loaded.');
        },
      });
  }
  private handle(error: HttpErrorResponse, fallback: string): void {
    if (error.status === 401) {
      this.auth.logout();
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/staff' } });
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
