import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
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
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import { InputPassword } from '../../../shared/components/form-controls/input-password/input-password';
import { InputText } from '../../../shared/components/form-controls/input-text/input-text';
import { UsuarioConsultaDTO } from '../../models/usuario-consulta.dto';
import { UsuarioGuardadoDTO } from '../../models/usuario-guardado.dto';
import { UsuarioService } from '../../services/usuario-service';

type ProfileFormModel = {
  nombre: FormControl<string>;
  primerApellido: FormControl<string>;
  segundoApellido: FormControl<string>;
  contrasenia: FormControl<string>;
};

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule, InputPassword, InputText, MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  // Orden: propiedades -> Constructor -> Métodos públicos -> Métodos privados

  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);

  // Datos iniciales
  profileValue: UsuarioGuardadoDTO = new UsuarioGuardadoDTO('', '', '', '', '', false);
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

  readonly nombre = new FormControl(this.profileValue.nombre, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.nombreMin),
      Validators.maxLength(this.nombreMax),
    ],
  });

  readonly primerApellido = new FormControl(this.profileValue.primerApellido, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.primerApellidoMin),
      Validators.maxLength(this.primerApellidoMax),
    ],
  });

  readonly segundoApellido = new FormControl(this.profileValue.segundoApellido, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.segundoApellidoMin),
      Validators.maxLength(this.segundoApellidoMax),
    ],
  });

  readonly contrasenia = new FormControl(this.profileValue.contrasenia, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.contraseniaMin),
      Validators.maxLength(this.contraseniaMax),
    ],
  });

  // Identificador del usuario
  private usuarioId: string | null = null;

  // FormGroup: representa el formulario como una unidad
  // A través de la interfaz declarada asignamos los FormControl indicados previamente
  // Esto nos garantiza que los tipos sean los correctos
  readonly profileForm: FormGroup<ProfileFormModel> = this.formBuilder.group({
    nombre: this.nombre,
    primerApellido: this.primerApellido,
    segundoApellido: this.segundoApellido,
    contrasenia: this.contrasenia,
  });

  ngOnInit(): void {
    // Recuperación del identificador del usuario
    this.usuarioId = this.localStorageService.get('idUsuario');
    if (!this.usuarioId) {
      // Debug
      console.log('ERROR AL RECUPERAR EL USUARIO');
    }

    // OBSERVABLE
    this.userService.findById(this.usuarioId!).subscribe({
      next: (usuarioData: UsuarioConsultaDTO) => {
        // NO se rellena la contraseña
        this.profileForm.patchValue({
          nombre: usuarioData.nombre,
          primerApellido: usuarioData.segundoApellido,
          segundoApellido: usuarioData.segundoApellido ?? '',
        });

        // Campos adicionales no incluidos en el formulario
        this.profileValue.correoCorporativo = usuarioData.correoCorporativo;
        this.profileValue.activo = usuarioData.activo;
      },
      error: (error: HttpErrorResponse) => {
        console.log('Ha ocurrido un error interno al recuperar el usuario');
      },
    });
  }

  async save(): Promise<void> {
    this.isValidForm = false;

    // Si el formulario es inválido, no continúa el proceso
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isValidForm = true;

    const formValue = this.profileForm.getRawValue();

    // Por defecto, se mandará el usuario marcado como activo
    this.profileValue = new UsuarioGuardadoDTO(
      formValue.nombre,
      formValue.primerApellido,
      formValue.segundoApellido,
      formValue.contrasenia,
      this.profileValue.correoCorporativo,
      this.profileValue.activo,
    );

    try {
      const profileResponse = await firstValueFrom(
        this.userService.update(this.usuarioId!, this.profileValue),
      );

      // Debug
      console.log(profileResponse);

      // Redirección
      this.router.navigateByUrl('mapa/visor');
    } catch (error: any) {
      console.log(error);
    }
  }
}
