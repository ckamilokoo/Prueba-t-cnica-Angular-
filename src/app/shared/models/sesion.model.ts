import { Perfil } from './usuario.model';

export interface Sesion {
  token: string;
  idUsuario: string;
  perfil: Perfil;
  nombre: string;
  apellido: string;
  emitidoEn: number;
  expiraEn: number;
}
