import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PuestoGuardadoDTO } from '../models/puesto-guardado.dto';
import { PuestoConsultaDTO } from '../models/puesto-consulta.dto';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PuestoService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = environment.url + `${this.controller}`;

  create(puesto: PuestoGuardadoDTO): Observable<PuestoConsultaDTO> {
    return this.http.post<PuestoConsultaDTO>(this.urlApi + '/puesto', puesto);
  }

  findAll(): Observable<PuestoConsultaDTO[]> {
    return this.http.get<PuestoConsultaDTO[]>(this.urlApi + '/puesto');
  }

  delete(id: string): Observable<void> {
    // TODO: ¿MANEJO DE EXCEPCIONES?
    return this.http.delete<void>(this.urlApi + '/puesto/' + id);
  }
}
