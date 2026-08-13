import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { AdminLayout } from '../../components/admin-layout/admin-layout';
import { AuthService } from '../../core/auth/auth.service';
import { Category, CategoryInput, CategoryService } from '../../core/services/category.service';
import { MenuItem, MenuItemInput, MenuService } from '../../core/services/menu.service';

interface ApiErrorBody {
  readonly message?: unknown;
}
type FormKind = 'item' | 'category' | null;
type LoadResult<T> =
  | { readonly value: T; readonly error: null }
  | { readonly value: null; readonly error: HttpErrorResponse };

@Component({
  selector: 'app-admin-services',
  imports: [AdminLayout, ReactiveFormsModule],
  templateUrl: './admin-services.html',
  styleUrl: './admin-services.css',
})
export class AdminServices {
  private readonly auth = inject(AuthService);
  private readonly categoriesApi = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly menuApi = inject(MenuService);
  private readonly router = inject(Router);
  protected readonly items = signal<readonly MenuItem[]>([]);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly categoryErrorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly formKind = signal<FormKind>(null);
  protected readonly editingId = signal<string | null>(null);
  protected readonly search = signal('');
  protected readonly filteredItems = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.items().filter(
      (item) =>
        !term || `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(term),
    );
  });
  protected readonly availableCount = computed(
    () => this.items().filter((item) => item.available).length,
  );
  protected readonly hasCategories = computed(() => this.categories().length > 0);
  protected readonly canAddMenuItem = computed(() => !this.loading() && this.hasCategories());
  protected readonly menuItemActionHint = computed(() => {
    if (this.loading()) return 'Categories are still loading.';
    if (this.hasCategories()) return '';
    return this.categoryErrorMessage()
      ? 'Categories could not be loaded. Refresh the page before adding menu items.'
      : 'Create at least one category before adding menu items.';
  });
  protected readonly itemForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    image: new FormControl('', { nonNullable: true }),
    available: new FormControl(true, { nonNullable: true }),
  });
  protected readonly categoryForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });
  constructor() {
    this.load();
  }
  protected setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
  protected openItem(item?: MenuItem): void {
    if (!this.canAddMenuItem()) {
      if (!this.loading()) this.errorMessage.set(this.menuItemActionHint());
      return;
    }
    this.editingId.set(item?._id ?? null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.itemForm.reset(
      item
        ? {
            name: item.name,
            description: item.description,
            price: item.price,
            category: this.categoryExists(item.category) ? item.category : this.preferredCategory(),
            image: item.image,
            available: item.available,
          }
        : {
            name: '',
            description: '',
            price: 0,
            category: this.preferredCategory(),
            image: '',
            available: true,
          },
    );
    this.formKind.set('item');
  }
  protected openCategory(category?: Category): void {
    this.editingId.set(category?._id ?? null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.categoryForm.reset(
      category
        ? { name: category.name, description: category.description, active: category.active }
        : { name: '', description: '', active: true },
    );
    this.formKind.set('category');
  }
  protected closeForm(): void {
    if (!this.saving()) this.formKind.set(null);
  }
  protected saveItem(): void {
    if (!this.canAddMenuItem()) {
      this.errorMessage.set(this.menuItemActionHint());
      return;
    }
    const categoryControl = this.itemForm.controls.category;
    if (!this.categoryExists(categoryControl.value)) {
      categoryControl.setErrors({ categoryUnavailable: true });
      this.errorMessage.set('Select one of the available categories before saving.');
      return;
    }
    if (this.itemForm.invalid || this.saving()) {
      this.itemForm.markAllAsTouched();
      return;
    }
    const value: MenuItemInput = this.itemForm.getRawValue();
    this.saveRequest(
      this.editingId() ? this.menuApi.update(this.editingId()!, value) : this.menuApi.create(value),
      this.editingId() ? 'Menu item updated.' : 'Menu item added.',
    );
  }
  protected saveCategory(): void {
    if (this.categoryForm.invalid || this.saving()) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    const value: CategoryInput = this.categoryForm.getRawValue();
    const editingId = this.editingId();
    const request = editingId
      ? this.categoriesApi.update(editingId, value)
      : this.categoriesApi.create(value);
    this.saving.set(true);
    this.errorMessage.set('');
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (category) => {
        const categories = editingId
          ? this.categories().map((current) => (current._id === editingId ? category : current))
          : [...this.categories(), category];
        this.setCategories(categories);
        this.saving.set(false);
        this.formKind.set(null);
        this.successMessage.set(editingId ? 'Category updated.' : 'Category added.');
        this.refreshCategories();
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.handleError(error, 'Category could not be saved.');
      },
    });
  }
  protected toggleAvailability(item: MenuItem): void {
    this.saving.set(true);
    this.menuApi
      .update(item._id, { available: !item.available })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Availability updated.');
          this.load(false);
        },
        error: (error: HttpErrorResponse) => {
          this.saving.set(false);
          this.handleError(error, 'Availability could not be updated.');
        },
      });
  }
  protected deleteItem(item: MenuItem): void {
    if (!this.confirmDelete(`Delete ${item.name}?`)) return;
    this.deleteRequest(item._id, this.menuApi.delete(item._id), 'Menu item deleted.');
  }
  protected deleteCategory(category: Category): void {
    if (
      !this.confirmDelete(
        `Delete category ${category.name}? Existing menu items keep their category text.`,
      )
    )
      return;
    this.deleteRequest(category._id, this.categoriesApi.delete(category._id), 'Category deleted.');
  }
  protected reload(): void {
    this.load();
  }
  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(value);
  }
  private saveRequest(request: Observable<unknown>, message: string): void {
    this.saving.set(true);
    this.errorMessage.set('');
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.formKind.set(null);
        this.successMessage.set(message);
        this.load(false);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.handleError(error, 'Changes could not be saved.');
      },
    });
  }
  private deleteRequest(id: string, request: Observable<unknown>, message: string): void {
    this.deletingId.set(id);
    this.errorMessage.set('');
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.successMessage.set(message);
        this.load(false);
      },
      error: (error: HttpErrorResponse) => {
        this.deletingId.set(null);
        this.handleError(error, 'The record could not be deleted.');
      },
    });
  }
  private confirmDelete(message: string): boolean {
    return !this.deletingId() && Boolean(this.document.defaultView?.confirm(message));
  }
  private load(clearMessages = true): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.categoryErrorMessage.set('');
    if (clearMessages) this.successMessage.set('');
    forkJoin({
      items: this.captureLoad(this.menuApi.getAll()),
      categories: this.captureLoad(this.categoriesApi.getAll()),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ items, categories }) => {
          if (items.value) this.items.set(items.value);
          else this.handleError(items.error, 'Menu items could not be loaded.');

          if (categories.value) this.setCategories(categories.value);
          else {
            const message = this.errorText(
              categories.error,
              'Categories could not be loaded. Add Menu Item is unavailable until categories load.',
            );
            this.categoryErrorMessage.set(message);
            this.handleError(categories.error, message);
          }
          this.loading.set(false);
        },
      });
  }
  private captureLoad<T>(request: Observable<T>): Observable<LoadResult<T>> {
    return request.pipe(
      map((value) => ({ value, error: null }) as LoadResult<T>),
      catchError((error: HttpErrorResponse) => of({ value: null, error } as LoadResult<T>)),
    );
  }
  private refreshCategories(): void {
    this.categoryErrorMessage.set('');
    this.categoriesApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => this.setCategories(categories),
        error: (error: HttpErrorResponse) => {
          const message = this.errorText(error, 'Categories could not be refreshed.');
          this.categoryErrorMessage.set(message);
          this.handleError(error, message);
        },
      });
  }
  private setCategories(categories: readonly Category[]): void {
    const sorted = [...categories].sort((first, second) => first.name.localeCompare(second.name));
    this.categories.set(sorted);
    if (this.formKind() !== 'item') return;
    if (sorted.length === 0) {
      this.formKind.set(null);
      this.errorMessage.set('Create at least one category before adding menu items.');
      return;
    }
    const categoryControl = this.itemForm.controls.category;
    if (!this.categoryExists(categoryControl.value)) {
      categoryControl.setValue(this.preferredCategory());
    }
  }
  private preferredCategory(): string {
    return (
      this.categories().find((category) => category.active)?.name ??
      this.categories()[0]?.name ??
      ''
    );
  }
  private categoryExists(name: string): boolean {
    return this.categories().some((category) => category.name === name);
  }
  private errorText(error: HttpErrorResponse, fallback: string): string {
    if (error.status === 0) return 'The Serv.io server is unavailable.';
    const body = error.error as ApiErrorBody | null;
    return typeof body?.message === 'string' ? body.message : fallback;
  }
  private handleError(error: HttpErrorResponse, fallback: string): void {
    if (error.status === 401) {
      this.auth.logout();
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/services' } });
      return;
    }
    this.errorMessage.set(this.errorText(error, fallback));
  }
}
