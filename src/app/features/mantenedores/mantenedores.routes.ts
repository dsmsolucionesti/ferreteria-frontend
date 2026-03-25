import { Routes } from '@angular/router';

export const MANTENEDORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/mantenedores.component').then(
        (m) => m.MantenedoresComponent,
      ),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./components/clientes/pages/clientes.component').then(
        (m) => m.ClientesComponent,
      ),
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./components/usuarios/pages/usuarios.component').then(
        (m) => m.UsuariosComponent,
      ),
  },
];
