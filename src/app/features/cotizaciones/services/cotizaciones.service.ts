import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../shared/models/respuesta-proceso.model';
import { Cotizaciones } from '../models/cotizaciones.model';

@Injectable({ providedIn: 'root' })
export class CotizacionesService {
  private url = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  findAll(): Observable<RespuestaProceso<Cotizaciones>> {
    return this.http.get<RespuestaProceso<Cotizaciones>>(
      `${this.url}/cotizaciones`,
    );
  }

  findById(id: number): Observable<RespuestaProceso<Cotizaciones>> {
    return this.http.get<RespuestaProceso<Cotizaciones>>(
      `${this.url}/cotizaciones/${id}`,
    );
  }

  post(data: any): Observable<RespuestaProceso<Cotizaciones>> {
    console.log(data);
    return this.http.post<RespuestaProceso<Cotizaciones>>(
      `${this.url}/cotizaciones`,
      data,
    );
  }

  patch(
    id: number,
    data: Partial<Cotizaciones>,
  ): Observable<RespuestaProceso<Cotizaciones>> {
    return this.http.patch<RespuestaProceso<Cotizaciones>>(
      `${this.url}/cotizaciones/${id}`,
      data,
    );
  }

  delete(id: number): Observable<RespuestaProceso<Cotizaciones>> {
    return this.http.delete<RespuestaProceso<Cotizaciones>>(
      `${this.url}/cotizaciones/${id}`,
    );
  }
}
