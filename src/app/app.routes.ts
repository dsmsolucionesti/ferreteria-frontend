import { Routes } from '@angular/router';
import { CATEGORIA_ROUTES } from './features/categorias/categoria.routes';
import { PRODUCTO_ROUTES } from './features/productos/producto.routes';
import { MANTENEDORES_ROUTES } from './features/mantenedores/mantenedores.routes';

export const routes: Routes = [
  {
    path: '',
    children: CATEGORIA_ROUTES,
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
  { path: '**', redirectTo: 'categorias' },
];
