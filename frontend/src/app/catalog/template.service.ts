import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CatalogFilters,
  CreateTemplatePayload,
  SelectedFilters,
  Template,
} from './template.model';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/templates`;

  // Catálogo público con filtros opcionales.
  getCatalog(filters: SelectedFilters = {}): Observable<Template[]> {
    let params = new HttpParams();
    if (filters.eventType) params = params.set('eventType', filters.eventType);
    if (filters.style) params = params.set('style', filters.style);
    if (filters.format) params = params.set('format', filters.format);
    return this.http.get<Template[]>(this.baseUrl, { params });
  }

  // Opciones de filtro con etiquetas legibles.
  getFilters(): Observable<CatalogFilters> {
    return this.http.get<CatalogFilters>(`${this.baseUrl}/filters`);
  }

  // Detalle / vista de ejemplo.
  getById(id: string): Observable<Template> {
    return this.http.get<Template>(`${this.baseUrl}/${id}`);
  }

  // --- Administración (sin auth todavía; se protegerá en la etapa de roles) ---

  getAllForAdmin(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.baseUrl}/admin/all`);
  }

  create(payload: CreateTemplatePayload): Observable<Template> {
    return this.http.post<Template>(this.baseUrl, payload);
  }

  setActive(id: string, isActive: boolean): Observable<Template> {
    return this.http.patch<Template>(`${this.baseUrl}/${id}/active`, { isActive });
  }
}
