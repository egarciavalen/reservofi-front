  import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { InputEmail } from '../../../shared/components/form-controls/input-email/input-email';
import { InputPassword } from '../../../shared/components/form-controls/input-password/input-password';
import { InputText } from '../../../shared/components/form-controls/input-text/input-text';
import { RegistroRequestDTO } from '../../models/registro-request';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';
import { HttpErrorResponse } from '@angular/common/http';

type RegisterFormModel = {
  nombre: FormControl<string>;
  primerApellido: FormControl<string>;
  segundoApellido: FormControl<string>;
  correoCorporativo: FormControl<string>;
  contrasenia: FormControl<string>;
};

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputEmail,
    InputPassword,
    InputText,
    MatButtonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  // Orden: propiedades -> Constructor -> Métodos públicos -> Métodos privados

  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);


  // Datos iniciales
  registerValue: RegistroRequestDTO = new RegistroRequestDTO(
    '',
    '',
    '',
    '',
    '',
    false,
  );
  isValidForm: boolean | null = null;

  // Propiedades adicionales

  readonly nombreMin = 3;
  readonly nombreMax = 20;

  readonly primerApellidoMin = 5;
  readonly primerApellidoMax = 25;

  readonly segundoApellidoMin = 5;
  readonly segundoApellidoMax = 25;

  readonly contraseniaMin = 5;
  readonly contraseniaMax = 15;

  // Declaración e inicialización de FormControls

  // FormControl: represesenta un único campo del formulario
  // Se le asigna el valor del DTO y las validaciones correspondientes

  readonly nombre = new FormControl(this.registerValue.nombre, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.nombreMin),
      Validators.maxLength(this.nombreMax),
    ],
  });

  readonly primerApellido = new FormControl(this.registerValue.primerApellido, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.primerApellidoMin),
      Validators.maxLength(this.primerApellidoMax),
    ],
  });

  readonly segundoApellido = new FormControl(this.registerValue.segundoApellido, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.segundoApellidoMin),
      Validators.maxLength(this.segundoApellidoMax),
    ],
  });

  readonly correoCorporativo = new FormControl(this.registerValue.correoCorporativo, {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  readonly contrasenia = new FormControl(this.registerValue.contrasenia, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.contraseniaMin),
      Validators.maxLength(this.contraseniaMax),
    ],
  });

  // FormGroup: representa el formulario como una unidad
  // A través de la interfaz declarada asignamos los FormControl indicados previamente
  // Esto nos garantiza que los tipos sean los correctos
  readonly registerForm: FormGroup<RegisterFormModel> = this.formBuilder.group({
    nombre: this.nombre,
    primerApellido: this.primerApellido,
    segundoApellido: this.segundoApellido,
    correoCorporativo: this.correoCorporativo,
    contrasenia: this.contrasenia,
  });

  async register(): Promise<void> {
    this.isValidForm = false;

    // Si el formulario es inválido, no continúa el proceso
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isValidForm = true;

    const formValue = this.registerForm.getRawValue();

    // Por defecto, se mandará el usuario marcado como activo
    this.registerValue = new RegistroRequestDTO(
      formValue.nombre,
      formValue.primerApellido,
      formValue.segundoApellido,
      formValue.correoCorporativo,
      formValue.contrasenia,
      false,
    );

    try {
      // Se elimina el contenido de localStorageService antes de registrar al usuario
      // Esto se hace para evitar casos de tokens antiguos almacenados que puedan provocar errores
      this.localStorageService.remove('idUsuario');
      this.localStorageService.remove('token');

      await firstValueFrom(this.authService.register(this.registerValue));
      this.abrirDialogoMensaje("¡Usuario creado correctamente!", true);

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
  
    dialogRef.afterClosed().subscribe((result) => {
      if (redirection) {
        this.router.navigateByUrl('login');
      }
    });
  }
}
