import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SalaDTO } from '../models/sala.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlBlogUocApi = `http://localhost:3000/${this.controller}`;

  findAll(): Observable<SalaDTO[]> {
    return this.http.get<SalaDTO[]>(this.urlBlogUocApi + "/sala");
  }

}
