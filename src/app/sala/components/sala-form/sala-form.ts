import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaService } from '../../services/sala-service';
import { SalaCreacionDTO } from '../../models/sala.creacion.dto';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

type SalaFormModel = {
  nombre: FormControl<string>;
  imagen: FormControl<File | null>;
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
  nombreImagen = '';

  readonly nombre = new FormControl(this.salaCreacion.nombre, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.nombreMin), Validators.maxLength(this.nombreMax)],
  });

  readonly imagen = new FormControl(this.salaCreacion.imagen, {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly salaForm: FormGroup<SalaFormModel> = this.formBuilder.group({
    nombre: this.nombre,
    imagen: this.imagen,
  });

  async create(): Promise<void> {

    // Validación de los campos
    this.isValidForm = false;
    if (this.salaForm.invalid) {
      return;
    }
    this.isValidForm = true;

    // Obtención de valores y asignación al DTO
    const { nombre, imagen } = this.salaForm.getRawValue();
    this.salaCreacion.nombre = nombre;
    this.salaCreacion.imagen = imagen;

    // Creación de un FormData para poder mandar MultipartFile
    // Con un DTO normal se mandaría un JSON
    const formData = new FormData();
    formData.append("nombre", this.salaCreacion.nombre);
    if (this.salaCreacion.imagen != null) {
      formData.append("imagen", this.salaCreacion.imagen);
    }

    try {
      const salaResponse = await firstValueFrom(this.salaService.create(formData));
      // Debug 
      console.log(salaResponse);
    } catch (error: any) {
      console.log(error);
    }

  }

  mostrarNombreFichero(event: Event) {
    const input = event.target as HTMLInputElement;
    const file:File | undefined= input.files?.[0];

    if (file) {
      this.nombreImagen = file.name; // Marcar el nombre del fichero para aportar feedback
      this.imagen.setValue(file); // Desde formControl da problemas; se guarda el fichero en el evento
    }

  }
}
