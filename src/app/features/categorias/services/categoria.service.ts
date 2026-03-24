import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../shared/models/respuesta-proceso.model';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RespuestaProceso<Categoria>> {
    return this.http.get<RespuestaProceso<Categoria>>(`${this.url}/categorias`);
  }

  create(data: Partial<Categoria>): Observable<RespuestaProceso<Categoria>> {
    console.log(data)
    return this.http.post<RespuestaProceso<Categoria>>(`${this.url}/categorias`, data);
  }
}
