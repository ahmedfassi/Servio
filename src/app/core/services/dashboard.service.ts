import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { Order } from './order.service';

export interface DashboardStats {
  readonly menuItems: number;
  readonly tables: number;
  readonly orders: number;
  readonly pendingOrders: number;
  readonly completedOrders: number;
  readonly users: number;
  readonly revenue: number;
}
export interface DashboardTopItem {
  readonly name: string;
  readonly orders: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${API_BASE_URL}/dashboard/stats`);
  }

  getRecentOrders(limit = 5): Observable<readonly Order[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<readonly Order[]>(`${API_BASE_URL}/dashboard/recent-orders`, { params });
  }

  getTopItems(): Observable<readonly DashboardTopItem[]> {
    return this.http.get<readonly DashboardTopItem[]>(`${API_BASE_URL}/dashboard/top-items`);
  }
}
