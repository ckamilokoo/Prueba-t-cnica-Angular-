import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'contactos',
        loadComponent: () =>
          import('./features/contactos/lista/lista.component').then((m) => m.ListaComponent)
      },
      {
        path: 'contactos/nuevo',
        canActivate: [roleGuard],
        data: { perfiles: ['1', '2'] },
        loadComponent: () =>
          import('./features/contactos/form/form.component').then((m) => m.FormComponent)
      },
      {
        path: 'contactos/:id/editar',
        canActivate: [roleGuard],
        data: { perfiles: ['1', '2'] },
        loadComponent: () =>
          import('./features/contactos/form/form.component').then((m) => m.FormComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'contactos' }
];
