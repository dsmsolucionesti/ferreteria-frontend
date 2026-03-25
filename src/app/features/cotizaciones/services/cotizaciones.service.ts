import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaProceso } from '../../../shared/models/respuesta-proceso.model';
import { Cotizaciones } from '../models/cotizaciones.model';

@Injectable({ providedIn: 'root' })
export class CotizacionesService {
  private url = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  getAll(): Observable<RespuestaProceso<Cotizaciones>> {
    return this.http.get<RespuestaProceso<Cotizaciones>>(`${this.url}/cotizaciones`);
  }

  create(data: Partial<Cotizaciones>): Observable<RespuestaProceso<Cotizaciones>> {
    return this.http.post<RespuestaProceso<Cotizaciones>>(
      `${this.url}/cotizaciones`,
      data,
    );
  }
}
