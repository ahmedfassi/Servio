import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
export interface ReportSummary {
  readonly totalOrders: number;
  readonly completedOrders: number;
  readonly pendingOrders: number;
  readonly revenue: number;
  readonly averageOrderValue: number;
}
export interface ReportStatus {
  readonly status: string;
  readonly count: number;
}
export interface DailyReport {
  readonly date: string;
  readonly orders: number;
  readonly revenue: number;
}
export interface ItemReport {
  readonly _id: string;
  readonly name: string;
  readonly quantity: number;
  readonly sales: number;
}
export interface TableReport {
  readonly tableId: string;
  readonly number?: number;
  readonly orders: number;
  readonly revenue: number;
}
export interface CategoryReport {
  readonly category: string;
  readonly quantity: number;
  readonly sales: number;
}
export interface Report {
  readonly summary: ReportSummary;
  readonly statuses: readonly ReportStatus[];
  readonly daily: readonly DailyReport[];
  readonly items: readonly ItemReport[];
  readonly tables: readonly TableReport[];
  readonly categories: readonly CategoryReport[];
}
@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  get(from?: string, to?: string): Observable<Report> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<Report>(`${API_BASE_URL}/reports`, { params });
  }
}
