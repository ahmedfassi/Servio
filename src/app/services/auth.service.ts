import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';

interface LoginResponse {
  token: string;
  username: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = 'servio-admin-token';
  // Adjust if your XAMPP vhost differs from the default.
  private readonly apiBase = 'http://localhost/servio-api';

  readonly token = signal<string | null>(this.getStoredToken());
  readonly username = signal<string | null>(null);
  /** True once the initial stored-token verification has finished. Guards
   *  can wait on this to avoid flashing the login page unnecessarily. */
  readonly checked = signal(false);

  constructor() {
    if (this.token()) {
      this.verify();
    } else {
      this.checked.set(true);
    }
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiBase}/login.php`, { username, password }).pipe(
      tap((res) => {
        this.token.set(res.token);
        this.username.set(res.username);
        this.setStoredToken(res.token);
      }),
    );
  }

  logout(): void {
    const hadToken = !!this.token();
    this.token.set(null);
    this.username.set(null);
    this.setStoredToken(null);
    if (hadToken) {
      // Best-effort — don't block the UI on this.
      this.http.post(`${this.apiBase}/logout.php`, {}).subscribe({ error: () => {} });
    }
  }

  private verify(): void {
    this.http.get<{ username: string | null }>(`${this.apiBase}/verify.php`).pipe(
      tap((res) => this.username.set(res.username)),
      catchError(() => {
        // Token expired or invalid — clear it so the guard redirects to login.
        this.token.set(null);
        this.setStoredToken(null);
        return of(null);
      }),
    ).subscribe(() => this.checked.set(true));
  }

  private getStoredToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.storageKey);
  }

  private setStoredToken(token: string | null): void {
    if (!this.isBrowser) return;
    if (token) {
      localStorage.setItem(this.storageKey, token);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }
}
