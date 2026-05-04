import { Injectable, inject } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, Perfil, UsuarioApi } from '../../shared/models/usuario.model';
import { Sesion } from '../../shared/models/sesion.model';
import { BaseApiService } from './base-api.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {
  protected readonly resource = 'Auth';
  private readonly session = inject(SessionService);
  private readonly tokenSvc = inject(TokenService);

  login(credenciales: LoginRequest): Observable<Sesion> {
    return this.post<UsuarioApi[]>('Login', credenciales).pipe(
      map((respuesta) => {
        const usuario = Array.isArray(respuesta) ? respuesta[0] : null;
        if (!usuario || usuario.idUsuario === '0' || usuario.perfil === '0') {
          throw new Error('Credenciales inválidas');
        }
        const perfil = usuario.perfil as Perfil;
        const ahora = Date.now();
        const sesion: Sesion = {
          token: this.tokenSvc.generar(usuario.idUsuario, perfil),
          idUsuario: usuario.idUsuario,
          perfil,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          emitidoEn: ahora,
          expiraEn: ahora + environment.tokenTtlMinutes * 60 * 1000
        };
        this.session.set(sesion);
        return sesion;
      })
    );
  }

  logout(): void {
    this.session.clear();
  }
}
