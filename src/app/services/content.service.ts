import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { SiteContent, buildDefaultContent, SectionId } from './content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Adjust the host/port if your XAMPP vhost differs from the default.
  private readonly apiUrl = 'http://localhost/servio-api/content.php';

  readonly content = signal<SiteContent>(buildDefaultContent());
  readonly loaded = signal(false);
  readonly saving = signal(false);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.http.get<SiteContent>(this.apiUrl).pipe(
      tap((data) => {
        this.content.set(data);
        this.loaded.set(true);
      }),
      catchError((err) => {
        if (this.isBrowser) {
          console.warn('[ContentService] Using default content (XAMPP API not reachable):', err?.message ?? err);
        }
        this.loaded.set(true);
        return of(null);
      }),
    ).subscribe();
  }

  save(next: SiteContent) {
    this.saving.set(true);
    return this.http.put<SiteContent>(this.apiUrl, next).pipe(
      tap((saved) => {
        this.content.set(saved);
        this.saving.set(false);
      }),
      catchError((err) => {
        this.saving.set(false);
        throw err;
      }),
    );
  }

  sectionVisible(id: SectionId): boolean {
    return this.content().sectionVisibility[id] ?? true;
  }
}