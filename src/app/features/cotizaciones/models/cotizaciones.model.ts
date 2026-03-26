import { Cliente } from "../../mantenedores/components/clientes/models/clientes.model";
import { Usuario } from "../../mantenedores/components/usuarios/models/usuarios.model";
import { EstadoCotizacion } from "../cotizaciones.enum";

export interface Cotizaciones {
  id: number;
  fechaCreacion?: string;
  total?: number;
  estadoCotizacion?: EstadoCotizacion;
  usuario?: Usuario;
  cliente?: Cliente;
}
