import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { PuestoDTO } from '../models/puesto.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PuestoService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  create(puesto: PuestoDTO): Observable<PuestoDTO> {
    return this.http.post<PuestoDTO>(this.urlApi + '/puesto', puesto);
  }

  findAll(): Observable<PuestoDTO[]> {
    return this.http.get<PuestoDTO[]>(this.urlApi + "/puesto");
  }

}
