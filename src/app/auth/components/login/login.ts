import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequestDTO } from '../../models/login-request.dto';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage-service';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';

type LoginFormModel = {
  correoCorporativo: FormControl<string>;
  contrasenia: FormControl<string>;
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Orden: propiedades -> Constructor -> Métodos públicos -> Métodos privados

  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  private readonly loginUser: LoginRequestDTO = new LoginRequestDTO('', '');
  isValidForm: boolean | null = null;

  // Propiedades adicionales
  readonly contraseniaMin = 5;
  readonly contraseniaMax = 15;

  readonly correoCorporativo = new FormControl(this.loginUser.correoCorporativo, {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  readonly contrasenia = new FormControl(this.loginUser.contrasenia, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.contraseniaMin), Validators.maxLength(this.contraseniaMax)],
  });

  readonly loginForm: FormGroup<LoginFormModel> = this.formBuilder.group({
    correoCorporativo: this.correoCorporativo,
    contrasenia: this.contrasenia,
  });

  async login(): Promise<void> {
    // Si el formulario NO es válido, finaliza el proceso
    this.isValidForm = false;
    if (this.loginForm.invalid) {
      return;
    }

    this.isValidForm = true;

    const { correoCorporativo, contrasenia } = this.loginForm.getRawValue();

    this.loginUser.correoCorporativo = correoCorporativo;
    this.loginUser.contrasenia = contrasenia;

    // Primera versión: verificar que se comunica correctamente
    try {
      const loginResponse = await firstValueFrom(this.authService.login(this.loginUser));
      
      // Debug 
      console.log(loginResponse);

      // Se guarda en el local storage el token de autenticación
      this.localStorageService.set('idUsuario', loginResponse.idUsuario);
      this.localStorageService.set('token', loginResponse.token);

      // Opciones de menú para el usuario autenticado 
      Header.usuarioAutenticado.set(true);

      // Redirección
      this.router.navigateByUrl('home');

    } catch (error: any) {
      console.log(error);
    }
  }

}
