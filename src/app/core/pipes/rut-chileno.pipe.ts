import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea un RUT chileno con puntos y guión.
 * Acepta formatos sucios: "12345678-9", "12.345.678-9", "123456789", etc.
 */
@Pipe({ name: 'rutChileno', standalone: true })
export class RutChilenoPipe implements PipeTransform {
  transform(rut: string | null | undefined): string {
    if (!rut) return '';
    const limpio = rut.toString().replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 2) return limpio;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    const conPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${conPuntos}-${dv}`;
  }
}
