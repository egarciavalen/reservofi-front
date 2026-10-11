import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlBlogUocApi = `http://localhost:3000/${this.controller}`;

  findAll(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.urlBlogUocApi + "/usuario");
  }
}
