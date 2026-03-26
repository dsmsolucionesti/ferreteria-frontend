import { Producto } from "../components/productos/models/producto.model";

export interface DetalleCotizacion {
  id?: number;
  idCotizacion: number;
  idProducto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
