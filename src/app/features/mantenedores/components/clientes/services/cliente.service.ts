import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../../../shared/models/respuesta-proceso.model';
import { Cliente } from '../models/clientes.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private url = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  findAll(): Observable<RespuestaProceso<Cliente>> {
    return this.http.get<RespuestaProceso<Cliente>>(`${this.url}/clientes`);
  }

  findById(id: number): Observable<RespuestaProceso<Cliente>> {
    return this.http.get<RespuestaProceso<Cliente>>(
      `${this.url}/clientes/${id}`,
    );
  }

  searchClientes(query: string): Observable<RespuestaProceso<Cliente[]>> {
    return this.http.get<RespuestaProceso<Cliente[]>>(
      `${this.url}/clientes/buscar/texto`,
      {
        params: { query },
      },
    );
  }

  post(data: any): Observable<RespuestaProceso<Cliente>> {
    console.log(data);
    return this.http.post<RespuestaProceso<Cliente>>(
      `${this.url}/clientes`,
      data,
    );
  }

  patch(
    id: number,
    data: Partial<Cliente>,
  ): Observable<RespuestaProceso<Cliente>> {
    return this.http.patch<RespuestaProceso<Cliente>>(
      `${this.url}/clientes/${id}`,
      data,
    );
  }

  delete(id: number): Observable<RespuestaProceso<Cliente>> {
    return this.http.delete<RespuestaProceso<Cliente>>(
      `${this.url}/clientes/${id}`,
    );
  }
}
