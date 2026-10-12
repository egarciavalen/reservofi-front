import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaService } from '../../services/sala-service';
import { SalaCreacionDTO } from '../../models/sala.creacion.dto';
import { CommonModule } from '@angular/common';

type SalaFormModel = {
  nombre: FormControl<string>;
  fichero: FormControl<File | null>;
};
@Component({
  selector: 'app-sala-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sala-form.html',
  styleUrl: './sala-form.scss',
})
export class SalaForm {

  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly salaService = inject(SalaService);

  private readonly salaCreacion: SalaCreacionDTO = new SalaCreacionDTO('', null);
  isValidForm: boolean | null = null;

  // Propiedades adicionales
  readonly nombreMin = 5;
  readonly nombreMax = 30;
  nombreFichero = '';

  readonly nombre = new FormControl(this.salaCreacion.nombre, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.nombreMin), Validators.maxLength(this.nombreMax)],
  });

  readonly fichero = new FormControl(this.salaCreacion.fichero, {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly salaForm: FormGroup<SalaFormModel> = this.formBuilder.group({
    nombre: this.nombre,
    fichero: this.fichero,
  });

  async create(): Promise<void> {

    this.isValidForm = false;
    if (this.salaForm.invalid) {
      return;
    }
    this.isValidForm = true;

    const { nombre, fichero } = this.salaForm.getRawValue();

    // Debug
    console.log(nombre);
    console.log(fichero);

  }

  mostrarNombreFichero(event: Event) {
    const input = event.target as HTMLInputElement;
    const file:File | undefined= input.files?.[0];

    if (file) {
      this.nombreFichero = file.name; // Marcar el nombre del fichero para aportar feedback
      this.fichero.setValue(file); // Desde formControl da problemas; se guarda el fichero en el evento
    }

  }
}
