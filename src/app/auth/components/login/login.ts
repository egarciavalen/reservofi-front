import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequestDTO } from '../../models/login-request.dto';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage-service';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { InputEmail } from '../../../shared/components/form-controls/input-email/input-email';
import { InputPassword } from '../../../shared/components/form-controls/input-password/input-password';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';
import { UsuarioService } from '../../../usuario/services/usuario-service';
import { HttpErrorResponse } from '@angular/common/http';

type LoginFormModel = {
  correoCorporativo: FormControl<string>;
  contrasenia: FormControl<string>;
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, InputEmail, InputPassword, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Orden: propiedades -> Constructor -> Métodos públicos -> Métodos privados

  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);


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

    try {

      // Se elimina el contenido de localStorageService antes de solicitar un nuevo token
      // Esto se hace para evitar casos de tokens caducados que provoquen excepciones
      this.localStorageService.remove('idUsuario');
      this.localStorageService.remove('token');

      const loginResponse = await firstValueFrom(this.authService.login(this.loginUser));
      
      // Se guarda en el local storage el token de autenticación
      this.localStorageService.set('idUsuario', loginResponse.idUsuario);
      this.localStorageService.set('token', loginResponse.token);

      this.abrirDialogoMensaje("¡Inicio de sesión correcto!", true);


    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        this.abrirDialogoMensaje(error.error, false);
      }
    }
  }


  abrirDialogoMensaje(message: string, redirection: boolean): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (redirection) {
        // Opciones de menú para el usuario autenticado 
        Header.usuarioAutenticado.set(true);
        // Opciones de menú para el usuario administrador
        const admin = await firstValueFrom(this.usuarioService.checkAdmin(this.localStorageService.get("idUsuario")!))
        Header.usuarioAdministrador.set(admin);

        // Redirección
        this.router.navigateByUrl('mapa');
      }
    });
  }
}
