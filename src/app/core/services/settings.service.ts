import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { CurrentUserResponse } from '../auth/auth.models';
export interface RestaurantSettings {
  readonly _id: string;
  readonly businessName: string;
  readonly phone: string;
  readonly email: string;
  readonly address: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
export interface SettingsInput {
  readonly businessName: string;
  readonly phone: string;
  readonly email: string;
  readonly address: string;
}
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  get(): Observable<RestaurantSettings> {
    return this.http.get<RestaurantSettings>(`${API_BASE_URL}/settings`);
  }
  update(value: SettingsInput): Observable<RestaurantSettings> {
    return this.http.put<RestaurantSettings>(`${API_BASE_URL}/settings`, value);
  }
  updateProfile(name: string, email: string): Observable<CurrentUserResponse> {
    return this.http.put<CurrentUserResponse>(`${API_BASE_URL}/settings/admin-profile`, {
      name,
      email,
    });
  }
  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<{ readonly message: string }> {
    return this.http.put<{ readonly message: string }>(`${API_BASE_URL}/settings/password`, {
      currentPassword,
      newPassword,
    });
  }
}
