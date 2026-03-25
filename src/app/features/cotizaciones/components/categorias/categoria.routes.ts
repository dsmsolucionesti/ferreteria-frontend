import { Routes } from '@angular/router';

export const CATEGORIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/categoria-list/categoria-list.component').then(
        (m) => m.CategoriaListComponent,
      ),
  },
];