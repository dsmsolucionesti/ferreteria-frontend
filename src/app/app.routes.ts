import { Routes } from '@angular/router';
import { CATEGORIA_ROUTES } from './features/cotizaciones/components/categorias/categoria.routes';
import { PRODUCTO_ROUTES } from './features/cotizaciones/components/productos/producto.routes';
import { MANTENEDORES_ROUTES } from './features/mantenedores/mantenedores.routes';
import { COTIZACIONES_ROUTES } from './features/cotizaciones/cotizaciones.routes';
import { HOME_ROUTES } from './features/home/home.routes';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/pages/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'home',
        children: HOME_ROUTES,
      },
      {
        path: 'cotizaciones',
        children: COTIZACIONES_ROUTES,
      },
      {
        path: 'categorias',
        children: CATEGORIA_ROUTES,
      },
      {
        path: 'productos',
        children: PRODUCTO_ROUTES,
      },
      {
        path: 'mantenedores',
        children: MANTENEDORES_ROUTES,
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
