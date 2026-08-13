import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { AdminLayout } from '../../components/admin-layout/admin-layout';
import { AuthService } from '../../core/auth/auth.service';
import { Category, CategoryInput, CategoryService } from '../../core/services/category.service';
import { MenuItem, MenuItemInput, MenuService } from '../../core/services/menu.service';

interface ApiErrorBody {
  readonly message?: unknown;
}
type FormKind = 'item' | 'category' | null;

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
    this.editingId.set(item?._id ?? null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.itemForm.reset(
      item
        ? {
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            available: item.available,
          }
        : {
            name: '',
            description: '',
            price: 0,
            category: this.categories().find((category) => category.active)?.name ?? '',
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
    this.saveRequest(
      this.editingId()
        ? this.categoriesApi.update(this.editingId()!, value)
        : this.categoriesApi.create(value),
      this.editingId() ? 'Category updated.' : 'Category added.',
    );
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
    if (clearMessages) this.successMessage.set('');
    forkJoin({ items: this.menuApi.getAll(), categories: this.categoriesApi.getAll() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ items, categories }) => {
          this.items.set(items);
          this.categories.set(categories);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.handleError(error, 'Menu data could not be loaded.');
        },
      });
  }
  private handleError(error: HttpErrorResponse, fallback: string): void {
    if (error.status === 401) {
      this.auth.logout();
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin/services' } });
      return;
    }
    if (error.status === 0) {
      this.errorMessage.set('The Serv.io server is unavailable.');
      return;
    }
    const body = error.error as ApiErrorBody | null;
    this.errorMessage.set(typeof body?.message === 'string' ? body.message : fallback);
  }
}
