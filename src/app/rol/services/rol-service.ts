import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaDTO } from '../../sala/models/sala.dto';
import { RolDTO } from '../models/rol.dto';

@Injectable({
  providedIn: 'root',
})
export class RolService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlBlogUocApi = `http://localhost:3000/${this.controller}`;

  findAll(): Observable<RolDTO[]> {
    return this.http.get<RolDTO[]>(this.urlBlogUocApi + "/rol");
  }

}
