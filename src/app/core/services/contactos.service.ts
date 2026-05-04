import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ContactoCreatePayload,
  ContactoDeletePayload,
  ContactoDetalle,
  ContactoListItem,
  ContactoUpdatePayload
} from '../../shared/models/contacto.model';
import { BaseApiService } from './base-api.service';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class ContactosService extends BaseApiService {
  protected readonly resource = 'Contactos';
  private readonly session = inject(SessionService);

  listar(): Observable<ContactoListItem[]> {
    const idUsuario = this.requireUsuario();
    return this.get<ContactoListItem[]>(`ListarContactos/${idUsuario}`);
  }

  detalle(idContacto: string): Observable<ContactoDetalle | null> {
    const idUsuario = this.requireUsuario();
    return this.get<ContactoDetalle[]>(`ListaContacto/${idUsuario}/${idContacto}`).pipe(
      map((arr) => (arr && arr.length > 0 ? arr[0] : null))
    );
  }

  crear(input: Omit<ContactoCreatePayload, 'idUsuario' | 'idContacto'>): Observable<boolean> {
    const idUsuario = this.requireUsuario();
    const payload: ContactoCreatePayload = {
      idUsuario,
      idContacto: '0',
      ...input
    };
    return this.post<string>('CreaContacto', payload).pipe(map(this.parseFlag));
  }

  actualizar(input: Omit<ContactoUpdatePayload, 'idUsuario'>): Observable<boolean> {
    const idUsuario = this.requireUsuario();
    const payload: ContactoUpdatePayload = { idUsuario, ...input };
    return this.post<string>('UpdateContacto', payload).pipe(map(this.parseFlag));
  }

  eliminar(idContacto: string): Observable<boolean> {
    const idUsuario = this.requireUsuario();
    const payload: ContactoDeletePayload = { idUsuario, idContacto };
    return this.post<string>('DeleteContacto', payload).pipe(map(this.parseFlag));
  }

  private parseFlag(respuesta: unknown): boolean {
    return respuesta === '1' || respuesta === 1;
  }

  private requireUsuario(): string {
    const id = this.session.idUsuario();
    if (!id) {
      throw new Error('Sin sesión activa');
    }
    return id;
  }
}
