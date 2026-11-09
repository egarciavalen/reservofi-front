import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolConsultaDTO } from '../models/rol-consulta.dto';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  findAll(): Observable<RolConsultaDTO[]> {
    return this.http.get<RolConsultaDTO[]>(this.urlApi + '/rol');
  }
}
