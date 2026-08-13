import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { AuthResponse, AuthUser, CurrentUserResponse } from './auth.models';

const TOKEN_KEY = 'servio_token';
const USER_KEY = 'servio_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userState = signal<AuthUser | null>(this.readStoredUser());

  readonly user = this.userState.asReadonly();

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(tap((response) => this.saveSession(response)));
  }

  getMe(): Observable<AuthUser> {
    return this.http.get<CurrentUserResponse>(`${API_BASE_URL}/auth/me`).pipe(
      map((response) => response.user),
      tap((user) => this.saveUser(user)),
    );
  }

  logout(): void {
    const storage = this.getStorage();
    storage?.removeItem(TOKEN_KEY);
    storage?.removeItem(USER_KEY);
    this.userState.set(null);
  }

  getToken(): string | null {
    return this.getStorage()?.getItem(TOKEN_KEY) ?? null;
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  getCurrentUser(): AuthUser | null {
    return this.userState();
  }

  private saveSession(response: AuthResponse): void {
    const storage = this.getStorage();
    storage?.setItem(TOKEN_KEY, response.token);
    this.saveUser(response.user);
  }

  private saveUser(user: AuthUser): void {
    this.userState.set(user);
    this.getStorage()?.setItem(USER_KEY, JSON.stringify(user));
  }

  private readStoredUser(): AuthUser | null {
    const value = this.getStorage()?.getItem(USER_KEY);
    if (!value) return null;

    try {
      return JSON.parse(value) as AuthUser;
    } catch {
      this.getStorage()?.removeItem(USER_KEY);
      return null;
    }
  }

  private getStorage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }
}
