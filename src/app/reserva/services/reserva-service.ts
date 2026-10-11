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
  private readonly urlBlogUocApi = `http://localhost:3000/${this.controller}`;

  findAll(): Observable<ReservaDTO[]> {
    return this.http.get<ReservaDTO[]>(this.urlBlogUocApi + "/reserva");
  }
}
