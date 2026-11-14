import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolConsultaDTO } from '../models/rol-consulta.dto';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = environment.url + `${this.controller}`;

  findAll(): Observable<RolConsultaDTO[]> {
    return this.http.get<RolConsultaDTO[]>(this.urlApi + '/rol');
  }
}
