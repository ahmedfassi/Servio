import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
export interface StaffMember {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'staff';
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
export interface StaffInput {
  readonly name: string;
  readonly email: string;
  readonly password?: string;
  readonly active: boolean;
}
@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly http = inject(HttpClient);
  getAll(): Observable<readonly StaffMember[]> {
    return this.http.get<readonly StaffMember[]>(`${API_BASE_URL}/staff`);
  }
  create(value: StaffInput): Observable<StaffMember> {
    return this.http.post<StaffMember>(`${API_BASE_URL}/staff`, value);
  }
  update(id: string, value: StaffInput): Observable<StaffMember> {
    return this.http.put<StaffMember>(`${API_BASE_URL}/staff/${id}`, value);
  }
  delete(id: string): Observable<{ readonly message: string }> {
    return this.http.delete<{ readonly message: string }>(`${API_BASE_URL}/staff/${id}`);
  }
}
