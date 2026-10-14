import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PuestoDTO } from '../models/puesto.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PuestoService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  findAll(): Observable<PuestoDTO[]> {
    return this.http.get<PuestoDTO[]>(this.urlApi + "/puesto");
  }

}
