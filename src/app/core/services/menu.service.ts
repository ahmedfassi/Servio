import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface MenuItem {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly image: string;
  readonly available: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MenuItemInput {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly image?: string;
  readonly available?: boolean;
}

export type MenuItemUpdate = Partial<MenuItemInput>;

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<readonly MenuItem[]> {
    return this.http.get<readonly MenuItem[]>(`${API_BASE_URL}/menu`);
  }

  getById(id: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${API_BASE_URL}/menu/${id}`);
  }

  create(item: MenuItemInput): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${API_BASE_URL}/menu`, item);
  }

  update(id: string, item: MenuItemUpdate): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${API_BASE_URL}/menu/${id}`, item);
  }

  delete(id: string): Observable<{ readonly message: string }> {
    return this.http.delete<{ readonly message: string }>(`${API_BASE_URL}/menu/${id}`);
  }
}
