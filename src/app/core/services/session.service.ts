import { Injectable, computed, signal } from '@angular/core';
import { Sesion } from '../../shared/models/sesion.model';
import { Perfil } from '../../shared/models/usuario.model';

const STORAGE_KEY = 'cordillera.sesion';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sesion = signal<Sesion | null>(this.read());

  readonly current = this.sesion.asReadonly();
  readonly isAuthenticated = computed(() => {
    const s = this.sesion();
    if (!s) return false;
    return s.expiraEn > Date.now();
  });
  readonly idUsuario = computed(() => this.sesion()?.idUsuario ?? null);
  readonly perfil = computed<Perfil | null>(() => this.sesion()?.perfil ?? null);
  readonly token = computed(() => this.sesion()?.token ?? null);
  readonly nombreCompleto = computed(() => {
    const s = this.sesion();
    return s ? `${s.nombre} ${s.apellido}`.trim() : '';
  });
  readonly iniciales = computed(() => {
    const s = this.sesion();
    if (!s) return '';
    const a = s.nombre?.[0] ?? '';
    const b = s.apellido?.[0] ?? '';
    return (a + b).toUpperCase();
  });

  set(sesion: Sesion): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
    this.sesion.set(sesion);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sesion.set(null);
  }

  private read(): Sesion | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Sesion;
      if (!parsed?.token || !parsed?.idUsuario) return null;
      if (parsed.expiraEn <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
