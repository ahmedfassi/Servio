import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { HomeSectionData } from './section.model';

@Injectable({ providedIn: 'root' })
export class SectionsService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly apiUrl = 'http://localhost/servio-api/sections.php';

  readonly sections = signal<HomeSectionData[]>([]);
  readonly loaded = signal(false);
  readonly saving = signal(false);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.http.get<HomeSectionData[]>(this.apiUrl).pipe(
      tap((data) => {
        this.sections.set([...data].sort((a, b) => a.order - b.order));
        this.loaded.set(true);
      }),
      catchError((err) => {
        if (this.isBrowser) {
          console.warn('[SectionsService] Could not load sections:', err?.message ?? err);
        }
        this.loaded.set(true);
        return of(null);
      }),
    ).subscribe();
  }

  save(next: HomeSectionData[]) {
    this.saving.set(true);
    const ordered = next.map((s, i) => ({ ...s, order: i }));
    return this.http.put<HomeSectionData[]>(this.apiUrl, ordered).pipe(
      tap((saved) => {
        this.sections.set([...saved].sort((a, b) => a.order - b.order));
        this.saving.set(false);
      }),
      catchError((err) => {
        this.saving.set(false);
        throw err;
      }),
    );
  }

  /** Visible sections in display order, for the public homepage. */
  visibleSections(): HomeSectionData[] {
    return this.sections()
      .filter((s) => s.visible)
      .sort((a, b) => a.order - b.order);
  }
}
