import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { LoginRequestDTO } from '../models/login-request.dto';
import { LoginResponseDTO } from '../models/login-response.dto';
import { UsuarioRegistroRequestDTO } from '../models/usuario-registro-request';
import { UsuarioRegistroResponseDTO } from '../models/usuario-registro-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly controller = 'api/auth';
  private readonly urlApi = `http://localhost:3000/${this.controller}`;

  // Registro del usuario
  register(register: UsuarioRegistroRequestDTO): Observable<UsuarioRegistroResponseDTO> {
    return this.http.post<UsuarioRegistroResponseDTO>(this.urlApi + "/register", register);
  }

  // Autenticación del usuario
  login(login: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(this.urlApi + "/login", login);
  }
}
