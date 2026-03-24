import { Categoria } from "../../categorias/models/categoria.model";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock_actual?: number;
  categoria: Categoria;
  activo?: boolean;
}
