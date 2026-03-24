import { Routes } from '@angular/router';
import { CATEGORIA_ROUTES } from './features/categorias/categoria.routes';

export const routes: Routes = [
  {
    path: 'categorias',
    children: CATEGORIA_ROUTES,
  },
];
