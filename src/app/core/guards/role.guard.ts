import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Perfil } from '../../shared/models/usuario.model';
import { SessionService } from '../services/session.service';
import { ToastService } from '../services/toast.service';

export const roleGuard: CanActivateFn = (route) => {
  const session = inject(SessionService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const permitidos = (route.data?.['perfiles'] ?? []) as Perfil[];
  const perfil = session.perfil();

  if (perfil && permitidos.includes(perfil)) {
    return true;
  }
  toast.warning('Tu perfil no tiene acceso a esta sección');
  return router.createUrlTree(['/contactos']);
};
