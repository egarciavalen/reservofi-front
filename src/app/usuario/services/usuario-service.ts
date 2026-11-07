import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.dto';
import { Observable } from 'rxjs';
import { UsuarioPerfilDTO } from '../models/usuario-perfil.dto';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  findAll(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.urlApi + "/usuario");
  }

  findById(id: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(this.urlApi + '/usuario/' + id);
  }

  update(idUsuario: string, usuario: UsuarioPerfilDTO): Observable<UsuarioPerfilDTO> {
    return this.http.put<UsuarioPerfilDTO>(this.urlApi + '/usuario/' + idUsuario, usuario);
  }
}
