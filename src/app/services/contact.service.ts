import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactSubmitResponse {
  ok: boolean;
  saved: boolean;
  emailSent: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  // Adjust the host/port if your XAMPP vhost differs from the default,
  // same as ContentService/AuthService.
  private readonly apiUrl = 'http://localhost/servio-api/contact.php';

  submit(payload: ContactSubmission): Observable<ContactSubmitResponse> {
    return this.http.post<ContactSubmitResponse>(this.apiUrl, payload);
  }
}
