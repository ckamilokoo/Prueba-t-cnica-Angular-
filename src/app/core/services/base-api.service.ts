import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Clase base abstracta para todos los servicios HTTP.
 * Cumple requisito de herencia (extends) — ver requisitos técnicos.
 * Centraliza:
 *  - HttpClient injection
 *  - construcción de URL base
 *  - métodos GET/POST tipados
 */
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected abstract readonly resource: string;

  protected url(path: string): string {
    return `${environment.apiUrl}/${path}`;
  }

  protected get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.url(path));
  }

  protected post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }
}
