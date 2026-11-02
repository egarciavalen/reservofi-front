import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaDTO } from '../models/sala.dto';

@Injectable({
  providedIn: 'root',
})
export class SalaService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  create(sala: FormData): Observable<SalaDTO> {
    return this.http.post<SalaDTO>(this.urlApi + '/sala', sala);
  }

  update(idSala: string, sala: FormData): Observable<SalaDTO> {
    return this.http.put<SalaDTO>(this.urlApi + '/sala/' + idSala, sala);
  }

  delete(id: string): Observable<void> {
    // TODO: ¿MANEJO DE EXCEPCIONES?
    return this.http.delete<void>(this.urlApi + '/sala/' + id);
  }

  findAll(): Observable<SalaDTO[]> {
    return this.http.get<SalaDTO[]>(this.urlApi + '/sala');
  }

  findById(id: string): Observable<SalaDTO> {
    return this.http.get<SalaDTO>(this.urlApi + '/sala/' + id);
  }
}
