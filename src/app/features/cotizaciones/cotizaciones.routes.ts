import { Routes } from '@angular/router';

export const COTIZACIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cotizaciones-list/cotizaciones-list.component').then(
        (m) => m.CotizacionesListComponent,
      ),
  },
];