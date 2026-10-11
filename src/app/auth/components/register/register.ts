import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { UsuarioRegistroRequestDTO } from '../../models/usuario-registro-request';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

type RegisterFormModel = {
  nombre: FormControl<string>;
  primerApellido: FormControl<string>;
  segundoApellido: FormControl<string>;
  correoCorporativo: FormControl<string>;
  contrasenia: FormControl<string>;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
 // Orden: propiedades -> Constructor -> Métodos públicos -> Métodos privados

  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  // Datos iniciales
  registerValue: UsuarioRegistroRequestDTO = new UsuarioRegistroRequestDTO('', '', '', '', '', false);
  isValidForm: boolean | null = null;

  // Propiedades adicionales

  public readonly nombreMin = 3;
  public readonly nombreMax = 20;

  public readonly primerApellidoMin = 5;
  public readonly primerApellidoMax = 25;

  public readonly segundoApellidoMin = 5;
  public readonly segundoApellidoMax = 25;

  public readonly contraseniaMin = 5;
  public readonly contraseniaMax = 15;

  // Declaración e inicialización de FormControls

  // FormControl: represesenta un único campo del formulario
  // Se le asigna el valor del DTO y las validaciones correspondientes

  readonly nombre = new FormControl(this.registerValue.nombre, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.nombreMin), Validators.maxLength(this.nombreMax)],
  });

  readonly primerApellido = new FormControl(this.registerValue.primerApellido, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.primerApellidoMin), Validators.maxLength(this.primerApellidoMax)],
  });

  readonly segundoApellido = new FormControl(this.registerValue.segundoApellido, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.segundoApellidoMin), Validators.maxLength(this.segundoApellidoMax)],
  });


  readonly correoCorporativo = new FormControl(this.registerValue.correoCorporativo, {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  readonly contrasenia = new FormControl(this.registerValue.contrasenia, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.contraseniaMin), Validators.maxLength(this.contraseniaMax)],
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
    this.registerValue = new UsuarioRegistroRequestDTO(
      formValue.nombre,
      formValue.primerApellido,
      formValue.segundoApellido,
      formValue.correoCorporativo,
      formValue.contrasenia,
      true
    );

    // Primera versión: verificar que se comunica correctamente
    try {
      const registerResponse = await firstValueFrom(this.authService.register(this.registerValue));
      console.log(registerResponse);
    } catch (error: any) {
      console.log(error);
    }  
  }
}