import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemplateService } from '../template.service';
import { CatalogFilters, SelectedFilters, Template } from '../template.model';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage implements OnInit {
  private readonly service = inject(TemplateService);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly templates = signal<Template[]>([]);
  protected readonly filters = signal<CatalogFilters | null>(null);
  protected readonly selected = signal<SelectedFilters>({});

  ngOnInit(): void {
    // Carga las opciones de filtro una sola vez.
    this.service.getFilters().subscribe({
      next: (f) => this.filters.set(f),
      error: () => this.error.set(true),
    });
    this.loadCatalog();
  }

  private loadCatalog(): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getCatalog(this.selected()).subscribe({
      next: (list) => {
        this.templates.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // Actualiza un filtro ('' = sin filtro) y recarga el catálogo.
  onFilterChange(key: keyof SelectedFilters, value: string): void {
    const next: SelectedFilters = { ...this.selected() };
    if (value) {
      next[key] = value;
    } else {
      delete next[key];
    }
    this.selected.set(next);
    this.loadCatalog();
  }

  clearFilters(): void {
    this.selected.set({});
    this.loadCatalog();
  }

  protected hasActiveFilters(): boolean {
    return Object.keys(this.selected()).length > 0;
  }

  // Etiqueta legible de un estilo a partir de las opciones cargadas.
  protected styleLabel(value: string): string {
    return this.filters()?.styles.find((s) => s.value === value)?.label ?? value;
  }
}
