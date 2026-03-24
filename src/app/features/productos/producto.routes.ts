import { Routes } from '@angular/router';

export const PRODUCTO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/producto-list/producto-list.component').then(
        (m) => m.ProductoListComponent,
      ),
  },
];
