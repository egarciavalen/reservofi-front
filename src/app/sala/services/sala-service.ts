import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SalaDTO } from '../models/sala.dto';
import { Observable } from 'rxjs';
import { SalaCreacionDTO } from '../models/sala.creacion.dto';

@Injectable({
  providedIn: 'root',
})
export class SalaService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlBlogUocApi = `http://localhost:3000/${this.controller}`;

  create(sala: FormData): Observable<SalaDTO> {
    return this.http.post<SalaDTO>(this.urlBlogUocApi +"/sala", sala);
  }

  findAll(): Observable<SalaDTO[]> {
    return this.http.get<SalaDTO[]>(this.urlBlogUocApi + "/sala");
  }

}
