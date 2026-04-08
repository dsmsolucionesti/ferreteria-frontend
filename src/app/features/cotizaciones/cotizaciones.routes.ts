import { Routes } from '@angular/router';

export const COTIZACIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cotizaciones-list/cotizaciones-list.component').then(
        (m) => m.CotizacionesListComponent,
      ),
    data: { breadcrumb: { label: 'Cotizaciones' } },
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/cotizaciones-form/cotizaciones-form.component').then(
        (m) => m.CotizacionesFormComponent,
      ),
    data: { breadcrumb: { label: 'Nueva cotización' } },
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/cotizaciones-edit/cotizaciones-edit.component').then(
        (m) => m.CotizacionesEditComponent,
      ),
    data: { breadcrumb: { label: 'Editar cotización' } },
  },
];
