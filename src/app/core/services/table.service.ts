import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface RestaurantTable {
  readonly _id: string;
  readonly number: number;
  readonly capacity: number;
  readonly status: TableStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TableInput {
  readonly number: number;
  readonly capacity: number;
  readonly status?: TableStatus;
}

export type TableUpdate = Partial<TableInput>;

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<readonly RestaurantTable[]> {
    return this.http.get<readonly RestaurantTable[]>(`${API_BASE_URL}/tables`);
  }

  getById(id: string): Observable<RestaurantTable> {
    return this.http.get<RestaurantTable>(`${API_BASE_URL}/tables/${id}`);
  }

  create(table: TableInput): Observable<RestaurantTable> {
    return this.http.post<RestaurantTable>(`${API_BASE_URL}/tables`, table);
  }

  update(id: string, table: TableUpdate): Observable<RestaurantTable> {
    return this.http.put<RestaurantTable>(`${API_BASE_URL}/tables/${id}`, table);
  }

  delete(id: string): Observable<{ readonly message: string }> {
    return this.http.delete<{ readonly message: string }>(`${API_BASE_URL}/tables/${id}`);
  }
}
