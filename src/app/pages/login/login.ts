import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal(
    this.route.snapshot.queryParamMap.get('reason') === 'admin'
      ? 'Administrator access is required for the dashboard.'
      : '',
  );

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.loginForm.invalid || this.submitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    const { email, password } = this.loginForm.getRawValue();

    this.auth
      .login(email.trim(), password)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: ({ user }) => {
          if (user.role !== 'admin') {
            this.auth.logout();
            this.errorMessage.set('This account does not have administrator access.');
            return;
          }

          const requestedUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const destination = requestedUrl?.startsWith('/admin') ? requestedUrl : '/admin';
          void this.router.navigateByUrl(destination);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.errorMessage.set('The Serv.io server is unavailable. Please try again shortly.');
          } else if (error.status === 401) {
            this.errorMessage.set('Invalid email or password.');
          } else if (error.status === 403) {
            this.errorMessage.set('Administrator access is required.');
          } else {
            this.errorMessage.set('Unable to sign in right now. Please try again.');
          }
        },
      });
  }
}
