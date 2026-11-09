import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioConsultaDTO } from '../models/usuario-consulta.dto';
import { UsuarioGuardadoDTO } from '../models/usuario-guardado.dto';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

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
    return this.http.patch<UsuarioConsultaDTO>(this.urlApi + '/usuario/toggleActivo/', idUsuario);
  }
}
