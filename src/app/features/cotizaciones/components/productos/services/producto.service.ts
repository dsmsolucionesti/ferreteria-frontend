import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../../../shared/models/respuesta-proceso.model';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  findAll(): Observable<RespuestaProceso<Producto>> {
    return this.http.get<RespuestaProceso<Producto>>(`${this.url}/producto`);
  }

  findById(id: number): Observable<RespuestaProceso<Producto>> {
    return this.http.get<RespuestaProceso<Producto>>(
      `${this.url}/producto/${id}`,
    );
  }

  post(data: any): Observable<RespuestaProceso<Producto>> {
    console.log(data);
    return this.http.post<RespuestaProceso<Producto>>(
      `${this.url}/producto`,
      data,
    );
  }

  searchProductos(query: string): Observable<RespuestaProceso<Producto[]>> {
    return this.http.get<RespuestaProceso<Producto[]>>(
      `${this.url}/producto/buscar/texto`,
      {
        params: { query },
      },
    );
  }

  patch(
    id: number,
    data: Partial<Producto>,
  ): Observable<RespuestaProceso<Producto>> {
    return this.http.patch<RespuestaProceso<Producto>>(
      `${this.url}/producto/${id}`,
      data,
    );
  }

  delete(id: number): Observable<RespuestaProceso<Producto>> {
    return this.http.delete<RespuestaProceso<Producto>>(
      `${this.url}/producto/${id}`,
    );
  }
}
