import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.lang = 'en';
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the shared Serv.io navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo')?.textContent).toContain('Serv.io');
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should default safely to English when no language is stored', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const homeLink = fixture.nativeElement.querySelector('.nav-links a') as HTMLAnchorElement;
    expect(homeLink.textContent?.trim()).toBe('Home');
    expect(localStorage.getItem('servio_language')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('should restore French from localStorage after the initial render', async () => {
    localStorage.setItem('servio_language', 'fr');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const homeLink = fixture.nativeElement.querySelector('.nav-links a') as HTMLAnchorElement;
    expect(homeLink.textContent?.trim()).toBe('Accueil');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('should switch language immediately and persist the selection', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const frenchButton = fixture.nativeElement.querySelector(
      '.language-switcher button:last-child',
    ) as HTMLButtonElement;
    frenchButton.click();
    fixture.detectChanges();

    const homeLink = fixture.nativeElement.querySelector('.nav-links a') as HTMLAnchorElement;
    expect(homeLink.textContent?.trim()).toBe('Accueil');
    expect(localStorage.getItem('servio_language')).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
  });
});
