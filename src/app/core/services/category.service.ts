import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface Category {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CategoryInput {
  readonly name: string;
  readonly description?: string;
  readonly active?: boolean;
}

export type CategoryUpdate = Partial<CategoryInput>;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<readonly Category[]> {
    return this.http.get<readonly Category[]>(`${API_BASE_URL}/categories`);
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${API_BASE_URL}/categories/${id}`);
  }

  create(category: CategoryInput): Observable<Category> {
    return this.http.post<Category>(`${API_BASE_URL}/categories`, category);
  }

  update(id: string, category: CategoryUpdate): Observable<Category> {
    return this.http.put<Category>(`${API_BASE_URL}/categories/${id}`, category);
  }

  delete(id: string): Observable<{ readonly message: string }> {
    return this.http.delete<{ readonly message: string }>(`${API_BASE_URL}/categories/${id}`);
  }
}
