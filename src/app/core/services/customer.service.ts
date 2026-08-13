import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { Order } from './order.service';
export interface Customer {
  readonly _id: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly orderCount: number;
  readonly totalSpent: number;
  readonly firstOrder: string | null;
  readonly lastOrder: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
export interface CustomerInput {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
}
export interface CustomerDetail {
  readonly customer: Customer;
  readonly orders: readonly Order[];
}
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  getAll(): Observable<readonly Customer[]> {
    return this.http.get<readonly Customer[]>(`${API_BASE_URL}/customers`);
  }
  get(id: string): Observable<CustomerDetail> {
    return this.http.get<CustomerDetail>(`${API_BASE_URL}/customers/${id}`);
  }
  create(value: CustomerInput): Observable<Customer> {
    return this.http.post<Customer>(`${API_BASE_URL}/customers`, value);
  }
  update(id: string, value: CustomerInput): Observable<Customer> {
    return this.http.put<Customer>(`${API_BASE_URL}/customers/${id}`, value);
  }
  delete(id: string): Observable<{ readonly message: string }> {
    return this.http.delete<{ readonly message: string }>(`${API_BASE_URL}/customers/${id}`);
  }
}
