import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../../../shared/models/respuesta-proceso.model';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private url = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  findAll(): Observable<RespuestaProceso<Categoria>> {
    return this.http.get<RespuestaProceso<Categoria>>(`${this.url}/categorias`);
  }

  findById(id: number): Observable<RespuestaProceso<Categoria>> {
    return this.http.get<RespuestaProceso<Categoria>>(
      `${this.url}/categorias/${id}`,
    );
  }

  searchCategorias(query: string): Observable<RespuestaProceso<Categoria[]>> {
    return this.http.get<RespuestaProceso<Categoria[]>>(
      `${this.url}/categorias/buscar/texto`,
      {
        params: { query },
      },
    );
  }

  post(data: Partial<Categoria>): Observable<RespuestaProceso<Categoria>> {
    return this.http.post<RespuestaProceso<Categoria>>(
      `${this.url}/categorias`,
      data,
    );
  }

  patch(
    id: number,
    data: Partial<Categoria>,
  ): Observable<RespuestaProceso<Categoria>> {
    return this.http.patch<RespuestaProceso<Categoria>>(
      `${this.url}/categorias/${id}`,
      data,
    );
  }

  delete(id: number): Observable<RespuestaProceso<Categoria>> {
    return this.http.delete<RespuestaProceso<Categoria>>(
      `${this.url}/categorias/${id}`,
    );
  }
}
