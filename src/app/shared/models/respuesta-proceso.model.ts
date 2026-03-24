export class RespuestaProceso<T = any> {
  idEstado?: number;
  dsEstado?: string;
  totalRegistros?: number;
  datos?: T[];
  mensaje?: string;

  constructor(init?: Partial<RespuestaProceso<T>>) {
    Object.assign(this, init);
  }
}
