import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { MenuItem } from './menu.service';
import { RestaurantTable } from './table.service';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';

export interface OrderItem {
  readonly menuItem: MenuItem | string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

export interface Order {
  readonly _id: string;
  readonly table: RestaurantTable | string | null;
  readonly customer: OrderCustomer | string | null;
  readonly items: readonly OrderItem[];
  readonly status: OrderStatus;
  readonly totalAmount: number;
  readonly notes: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
export interface OrderCustomer {
  readonly _id: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
}

export interface OrderItemInput {
  readonly menuItem: string;
  readonly quantity: number;
}

export interface OrderInput {
  readonly table: string;
  readonly customer?: string | null;
  readonly items: readonly OrderItemInput[];
  readonly notes?: string;
  readonly status?: OrderStatus;
}

export type OrderUpdate = Partial<OrderInput>;

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<readonly Order[]> {
    return this.http.get<readonly Order[]>(`${API_BASE_URL}/orders`);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${API_BASE_URL}/orders/${id}`);
  }

  create(order: OrderInput): Observable<Order> {
    return this.http.post<Order>(`${API_BASE_URL}/orders`, order);
  }

  update(id: string, order: OrderUpdate): Observable<Order> {
    return this.http.put<Order>(`${API_BASE_URL}/orders/${id}`, order);
  }

  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${API_BASE_URL}/orders/${id}/status`, { status });
  }

  delete(id: string): Observable<{ readonly message: string }> {
    return this.http.delete<{ readonly message: string }>(`${API_BASE_URL}/orders/${id}`);
  }
}
