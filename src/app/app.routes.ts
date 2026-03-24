import { Routes } from '@angular/router';
import { CATEGORIA_ROUTES } from './features/categorias/categoria.routes';
import { DashboardComponent } from './features/dashboard/pages/dashboard.component';
import { PRODUCTO_ROUTES } from './features/productos/producto.routes';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'categorias',
    children: CATEGORIA_ROUTES,
  },
  {
    path: 'productos',
    children: PRODUCTO_ROUTES,
  },
];
