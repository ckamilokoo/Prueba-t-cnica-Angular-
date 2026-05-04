import { Injectable } from '@angular/core';
import { Perfil } from '../../shared/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  generar(idUsuario: string, perfil: Perfil): string {
    const header = this.b64url({ alg: 'LOCAL', typ: 'JWT-FAKE' });
    const payload = this.b64url({
      sub: idUsuario,
      perfil,
      iat: Math.floor(Date.now() / 1000),
      jti: this.uuid()
    });
    const signature = this.b64url(`${header}.${payload}.cordillera`);
    return `${header}.${payload}.${signature}`;
  }

  decode(token: string): Record<string, unknown> | null {
    try {
      const [, payload] = token.split('.');
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private b64url(value: unknown): string {
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/=+$/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private uuid(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxxxxxx4xxx'.replace(/[xy]/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    );
  }
}
