export interface ContactoListItem {
  idContacto: string;
  rutContacto: string;
  nombreContacto: string;
}

export interface ContactoDetalle extends ContactoListItem {
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface ContactoCreatePayload {
  idUsuario: string;
  idContacto: '0';
  rutContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface ContactoUpdatePayload {
  idUsuario: string;
  idContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface ContactoDeletePayload {
  idUsuario: string;
  idContacto: string;
}
