import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioConsultaDTO } from '../models/usuario-consulta.dto';
import { UsuarioGuardadoDTO } from '../models/usuario-guardado.dto';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = environment.url + `${this.controller}`;

  findAll(): Observable<UsuarioConsultaDTO[]> {
    return this.http.get<UsuarioConsultaDTO[]>(this.urlApi + '/usuario');
  }

  findById(id: string): Observable<UsuarioConsultaDTO> {
    return this.http.get<UsuarioConsultaDTO>(this.urlApi + '/usuario/' + id);
  }

  update(idUsuario: string, usuario: UsuarioGuardadoDTO): Observable<UsuarioConsultaDTO> {
    return this.http.put<UsuarioConsultaDTO>(this.urlApi + '/usuario/' + idUsuario, usuario);
  }

  toggleActivo(idUsuario: string): Observable<UsuarioConsultaDTO> {
    // Únicamente se modifica un campo: activo
    return this.http.post<UsuarioConsultaDTO>(this.urlApi + '/usuario/' + idUsuario + '/toggleActivo', null);
  }

  toggleAdmin(idUsuario: string): Observable<UsuarioConsultaDTO> {
    // Únicamente se modifica un campo: el rol de admin
    return this.http.post<UsuarioConsultaDTO>(this.urlApi + '/usuario/' + idUsuario + '/toggleAdmin', null);
  }

  checkAdmin(idUsuario: string): Observable<boolean> {
    return this.http.get<boolean>(this.urlApi + '/usuario/' + idUsuario + '/checkAdmin');
  }
}
