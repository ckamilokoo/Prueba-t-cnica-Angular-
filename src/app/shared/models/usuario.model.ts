export type Perfil = '1' | '2' | '3';

export interface UsuarioApi {
  idUsuario: string;
  nombre: string;
  apellido: string;
  perfil: string;
}

export interface LoginRequest {
  usuario: string;
  clave: string;
}

export const PERFIL_NOMBRES: Record<Perfil, string> = {
  '1': 'Administrador',
  '2': 'Editor',
  '3': 'Consulta'
};

export const PUEDE_CREAR: Perfil[] = ['1', '2'];
export const PUEDE_EDITAR: Perfil[] = ['1', '2'];
export const PUEDE_ELIMINAR: Perfil[] = ['1'];
