import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PuestoGuardadoDTO } from '../models/puesto-guardado.dto';
import { PuestoConsultaDTO } from '../models/puesto-consulta.dto';

@Injectable({
  providedIn: 'root',
})
export class PuestoService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  create(puesto: PuestoGuardadoDTO): Observable<PuestoConsultaDTO> {
    return this.http.post<PuestoGuardadoDTO>(this.urlApi + '/puesto', puesto);
  }

  findAll(): Observable<PuestoConsultaDTO[]> {
    return this.http.get<PuestoConsultaDTO[]>(this.urlApi + '/puesto');
  }
}
