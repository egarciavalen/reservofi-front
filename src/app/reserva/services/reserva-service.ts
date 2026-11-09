import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservaConsultaDTO } from '../models/reserva-consulta.dto';
import { ReservaGuardadoDTO } from '../models/reserva-guardado.dto';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  create(reserva: ReservaGuardadoDTO): Observable<ReservaGuardadoDTO> {
    return this.http.post<ReservaGuardadoDTO>(this.urlApi + '/reserva', reserva);
  }

  findById(id: string): Observable<ReservaConsultaDTO> {
    return this.http.get<ReservaConsultaDTO>(this.urlApi + '/reserva/' + id);
  }

  findByUsuarioId(idUsuario: string): Observable<ReservaConsultaDTO[]> {
    return this.http.get<ReservaConsultaDTO[]>(this.urlApi + '/reserva/usuario/' + idUsuario);
  }

  findAll(): Observable<ReservaConsultaDTO[]> {
    return this.http.get<ReservaConsultaDTO[]>(this.urlApi + '/reserva');
  }

  delete(id: string): Observable<void> {
    // TODO: ¿MANEJO DE EXCEPCIONES?
    return this.http.delete<void>(this.urlApi + '/reserva/' + id);
  }
}
