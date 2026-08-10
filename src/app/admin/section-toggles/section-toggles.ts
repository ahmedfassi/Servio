import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { SectionId } from '../../services/content.model';

interface SectionMeta {
  id: SectionId;
  label: string;
  hint: string;
}

@Component({
  selector: 'app-section-toggles',
  standalone: true,
  imports: [],
  templateUrl: './section-toggles.html',
  styleUrl: './section-toggles.css',
})
export class SectionToggles {
  private readonly contentService = inject(ContentService);

  readonly sections: SectionMeta[] = [
    { id: 'about', label: 'About', hint: 'The "what is Serv.io" section, right after the hero.' },
    { id: 'features', label: 'Features', hint: 'The 8-item feature grid.' },
    { id: 'flow', label: 'How it flows', hint: 'The 5-step ticket/process section.' },
    { id: 'contact', label: 'Contact', hint: 'The contact form and quick-info section.' },
  ];

  readonly status = signal<string | null>(null);

  isVisible(id: SectionId): boolean {
    return this.contentService.content().sectionVisibility[id];
  }

  toggle(id: SectionId): void {
    const current = this.contentService.content();
    const next = {
      ...current,
      sectionVisibility: {
        ...current.sectionVisibility,
        [id]: !current.sectionVisibility[id],
      },
    };
    this.status.set(null);
    this.contentService.save(next).subscribe({
      next: () => this.status.set('Saved.'),
      error: () => this.status.set('Could not save — is XAMPP/Apache running?'),
    });
  }
}