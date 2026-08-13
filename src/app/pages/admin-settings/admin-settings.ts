import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLayout } from '../../components/admin-layout/admin-layout';
import { AuthService } from '../../core/auth/auth.service';
import { SettingsInput, SettingsService } from '../../core/services/settings.service';
interface ApiErrorBody {
  readonly message?: unknown;
}
@Component({
  selector: 'app-admin-settings',
  imports: [AdminLayout, ReactiveFormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
})
export class AdminSettings {
  private readonly api = inject(SettingsService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  protected readonly loading = signal(true);
  protected readonly saving = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly restaurantForm = new FormGroup({
    businessName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    address: new FormControl('', { nonNullable: true }),
  });
  protected readonly profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  protected readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  constructor() {
    this.load();
  }
  protected saveRestaurant(): void {
    if (this.restaurantForm.invalid) {
      this.restaurantForm.markAllAsTouched();
      return;
    }
    this.run(
      'restaurant',
      this.api.update(this.restaurantForm.getRawValue() as SettingsInput),
      'Restaurant settings saved.',
    );
  }
  protected saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const v = this.profileForm.getRawValue();
    this.saving.set('profile');
    this.api
      .updateProfile(v.name, v.email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.auth.getMe().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
          this.saving.set(null);
          this.successMessage.set('Admin profile updated.');
        },
        error: (e: HttpErrorResponse) => {
          this.saving.set(null);
          this.handle(e, 'Profile could not be updated.');
        },
      });
  }
  protected changePassword(): void {
    const v = this.passwordForm.getRawValue();
    if (this.passwordForm.invalid || v.newPassword !== v.confirmPassword) {
      this.errorMessage.set(
        v.newPassword !== v.confirmPassword
          ? 'New passwords do not match.'
          : 'Complete all password fields.',
      );
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.saving.set('password');
    this.api
      .changePassword(v.currentPassword, v.newPassword)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(null);
          this.passwordForm.reset();
          this.successMessage.set('Password changed successfully.');
        },
        error: (e: HttpErrorResponse) => {
          this.saving.set(null);
          this.handle(e, 'Password could not be changed.');
        },
      });
  }
  private run(kind: string, request: ReturnType<SettingsService['update']>, message: string): void {
    this.saving.set(kind);
    this.errorMessage.set('');
    this.successMessage.set('');
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(null);
        this.successMessage.set(message);
      },
      error: (e: HttpErrorResponse) => {
        this.saving.set(null);
        this.handle(e, 'Settings could not be saved.');
      },
    });
  }
  private load(): void {
    this.loading.set(true);
    const user = this.auth.getCurrentUser();
    if (user) this.profileForm.reset({ name: user.name, email: user.email });
    this.api
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.restaurantForm.reset({
            businessName: s.businessName,
            phone: s.phone,
            email: s.email,
            address: s.address,
          });
          this.loading.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.loading.set(false);
          this.handle(e, 'Settings could not be loaded.');
        },
      });
  }
  private handle(e: HttpErrorResponse, f: string): void {
    if (e.status === 401) {
      this.auth.logout();
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/settings' } });
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
