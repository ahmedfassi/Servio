import { afterNextRender, Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly sectionIds = ['home', 'services', 'about', 'policies'] as const;

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly activeSection = signal<(typeof this.sectionIds)[number]>('home');

  constructor() {
    afterNextRender(() => this.updateNavbarState());
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected updateNavbarState(): void {
    this.scrolled.set(window.scrollY > 24);
    const marker = window.scrollY + Math.min(220, window.innerHeight * 0.3);
    let active: (typeof this.sectionIds)[number] = 'home';

    this.sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top + window.scrollY <= marker) {
        active = id;
      }
    });
    this.activeSection.set(active);
  }

  protected activateSection(section: (typeof this.sectionIds)[number]): void {
    this.activeSection.set(section);
    this.closeMenu();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
