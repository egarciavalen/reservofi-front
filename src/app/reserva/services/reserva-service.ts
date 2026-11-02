import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservaDTO } from '../models/reserva.dto';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  create(reserva: ReservaDTO): Observable<ReservaDTO> {
    return this.http.post<ReservaDTO>(this.urlApi + '/reserva', reserva);
  }

  findById(id: string): Observable<ReservaDTO> {
    return this.http.get<ReservaDTO>(this.urlApi + '/reserva/' + id);
  }

  findByUsuarioId(idUsuario: string): Observable<ReservaDTO[]> {
    return this.http.get<ReservaDTO[]>(this.urlApi + '/reserva/usuario/' + idUsuario);
  }

  findAll(): Observable<ReservaDTO[]> {
    return this.http.get<ReservaDTO[]>(this.urlApi + "/reserva");
  }

  delete(id: string): Observable<void> {
    // TODO: ¿MANEJO DE EXCEPCIONES?
    return this.http.delete<void>(this.urlApi + '/reserva/' + id);
  }
}
