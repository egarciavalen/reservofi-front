import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaConsultaDTO } from '../models/sala-consulta.dto';
import { SalaGuardadoDTO } from '../models/sala-guardado.dto';

@Injectable({
  providedIn: 'root',
})
export class SalaService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  create(sala: FormData): Observable<SalaConsultaDTO> {
    return this.http.post<SalaConsultaDTO>(this.urlApi + '/sala', sala);
  }

  update(idSala: string, sala: FormData): Observable<SalaConsultaDTO> {
    return this.http.put<SalaConsultaDTO>(this.urlApi + '/sala/' + idSala, sala);
  }

  delete(id: string): Observable<void> {
    // TODO: ¿MANEJO DE EXCEPCIONES?
    return this.http.delete<void>(this.urlApi + '/sala/' + id);
  }

  findAll(): Observable<SalaConsultaDTO[]> {
    return this.http.get<SalaConsultaDTO[]>(this.urlApi + '/sala');
  }

  findById(id: string): Observable<SalaConsultaDTO> {
    return this.http.get<SalaConsultaDTO>(this.urlApi + '/sala/' + id);
  }
}
