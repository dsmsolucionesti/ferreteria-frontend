import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../../../shared/models/respuesta-proceso.model';
import { Usuario } from '../models/usuarios.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  findAll(): Observable<RespuestaProceso<Usuario>> {
    return this.http.get<RespuestaProceso<Usuario>>(
      `${this.url}/usuarios`,
    );
  }

  findById(id: number): Observable<RespuestaProceso<Usuario>> {
    return this.http.get<RespuestaProceso<Usuario>>(
      `${this.url}/usuarios/${id}`,
    );
  }

  post(data: any): Observable<RespuestaProceso<Usuario>> {
    console.log(data);
    return this.http.post<RespuestaProceso<Usuario>>(
      `${this.url}/usuarios`,
      data,
    );
  }

  patch(
    id: number,
    data: Partial<Usuario>,
  ): Observable<RespuestaProceso<Usuario>> {
    return this.http.patch<RespuestaProceso<Usuario>>(
      `${this.url}/usuarios/${id}`,
      data,
    );
  }

  delete(id: number): Observable<RespuestaProceso<Usuario>> {
    return this.http.delete<RespuestaProceso<Usuario>>(
      `${this.url}/usuarios/${id}`,
    );
  }
}
