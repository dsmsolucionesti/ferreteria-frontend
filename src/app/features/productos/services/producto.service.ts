import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../shared/models/respuesta-proceso.model';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RespuestaProceso<Producto>> {
    return this.http.get<RespuestaProceso<Producto>>(`${this.url}/producto`);
  }

  create(data: any): Observable<RespuestaProceso<Producto>> {
    console.log(data);
    return this.http.post<RespuestaProceso<Producto>>(
      `${this.url}/producto`,
      data,
    );
  }
}
