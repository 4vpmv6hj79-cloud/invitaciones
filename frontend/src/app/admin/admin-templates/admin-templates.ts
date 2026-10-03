import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemplateService } from '../../catalog/template.service';
import {
  CatalogFilters,
  CreateTemplatePayload,
  Template,
} from '../../catalog/template.model';

@Component({
  selector: 'app-admin-templates',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-templates.html',
  styleUrl: './admin-templates.scss',
})
export class AdminTemplates implements OnInit {
  private readonly service = inject(TemplateService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly templates = signal<Template[]>([]);
  protected readonly filters = signal<CatalogFilters | null>(null);
  protected readonly saving = signal(false);

  // Formulario de creación. eventType es un único valor que se envía como arreglo.
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    eventType: ['', Validators.required],
    style: ['', Validators.required],
    format: ['web', Validators.required],
  });

  ngOnInit(): void {
    this.service.getFilters().subscribe({
      next: (f) => this.filters.set(f),
      error: () => this.error.set('No se pudieron cargar las opciones de filtro.'),
    });
    this.loadTemplates();
  }

  private loadTemplates(): void {
    this.loading.set(true);
    this.service.getAllForAdmin().subscribe({
      next: (list) => {
        this.templates.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de plantillas.');
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: CreateTemplatePayload = {
      name: v.name,
      description: v.description,
      eventTypes: [v.eventType],
      style: v.style,
      format: v.format as CreateTemplatePayload['format'],
    };

    this.saving.set(true);
    this.service.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset({ format: 'web', eventType: '', style: '', name: '', description: '' });
        this.loadTemplates();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudo crear la plantilla.');
      },
    });
  }

  toggleActive(t: Template): void {
    this.service.setActive(t.id, !t.isActive).subscribe({
      next: (updated) => {
        this.templates.update((list) =>
          list.map((x) => (x.id === updated.id ? updated : x)),
        );
      },
      error: () => this.error.set('No se pudo actualizar el estado.'),
    });
  }
}
