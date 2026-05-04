import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  tipo: ToastTipo;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private contador = 0;
  readonly toasts = signal<Toast[]>([]);

  success(mensaje: string) { this.push('success', mensaje); }
  error(mensaje: string) { this.push('error', mensaje); }
  warning(mensaje: string) { this.push('warning', mensaje); }
  info(mensaje: string) { this.push('info', mensaje); }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(tipo: ToastTipo, mensaje: string) {
    const id = ++this.contador;
    this.toasts.update((list) => [...list, { id, tipo, mensaje }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
