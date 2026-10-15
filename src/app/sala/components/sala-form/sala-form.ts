import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SalaGuardadoDTO } from '../../models/sala.guardado.dto';
import { SalaService } from '../../services/sala-service';

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
export class SalaForm implements OnInit {
  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly salaService = inject(SalaService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly salaGuardadoDTO: SalaGuardadoDTO = new SalaGuardadoDTO('', null);
  isValidForm: boolean | null = null;

  // Propiedades adicionales
  readonly nombreMin = 5;
  readonly nombreMax = 30;
  nombreImagen = '';

  // Para determinar si se edita o crea una sala nueva
  idSala = this.activatedRoute.snapshot.paramMap.get('id');

  nombre = new FormControl(this.salaGuardadoDTO.nombre, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.nombreMin),
      Validators.maxLength(this.nombreMax),
    ],
  });

  // Si ya existe la sala, entonces la validación deja de ser obligatoria y se oculta del formulario
  readonly imagen = new FormControl(this.salaGuardadoDTO.imagen, {
    nonNullable: true,
    validators: this.idSala != null ? [] : [Validators.required],
  });

  readonly salaForm: FormGroup<SalaFormModel> = this.formBuilder.group({
    nombre: this.nombre,
    imagen: this.imagen,
  });

  async ngOnInit(): Promise<void> {
    // Si es una actualización, se rellenan los campos correspondientes
    if (this.idSala) {
      const salaCreada = await firstValueFrom(this.salaService.findById(this.idSala));
      // Debug
      console.log(salaCreada);
      this.salaForm.controls.nombre.setValue(salaCreada.nombre);
      this.nombreImagen = salaCreada.nombreImagen;
    }
  }

  async guardar(): Promise<void> {
    // Validación de los campos
    this.isValidForm = false;
    if (this.salaForm.invalid) {
      return;
    }
    this.isValidForm = true;

    // Creación de un FormData con la información necesaria
    const formData: FormData = this.getFormData();

    if (this.idSala) {
      // Actualización
      try {
        const salaResponse = await firstValueFrom(this.salaService.update(this.idSala, formData));
        // Debug
        console.log(salaResponse);
      } catch (error: any) {
        console.log(error);
      }
    } else {
      // Creación
      try {
        const salaResponse = await firstValueFrom(this.salaService.create(formData));
        // Debug
        console.log(salaResponse);
      } catch (error: any) {
        console.log(error);
      }
    }

    // Regreso al listado de salas
    this.router.navigateByUrl('sala/list');
  }

  mostrarNombreFichero(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];

    if (file) {
      this.nombreImagen = file.name; // Marcar el nombre del fichero para aportar feedback
      this.imagen.setValue(file); // Desde formControl da problemas; se guarda el fichero en el evento
    }
  }

  async borrarSala(): Promise<void> {
    if (this.idSala) {
      await firstValueFrom(this.salaService.delete(this.idSala));
      // Debug
      console.log('Sala borrada!');
      this.router.navigateByUrl('/sala/list');
    }
  }

  private getFormData(): FormData {
    // Obtención de valores y asignación al DTO
    const { nombre, imagen } = this.salaForm.getRawValue();
    this.salaGuardadoDTO.nombre = nombre;
    this.salaGuardadoDTO.imagen = imagen;

    // Creación de un FormData para poder mandar MultipartFile
    const formData: FormData = new FormData();
    formData.append('nombre', this.salaGuardadoDTO.nombre);
    if (this.salaGuardadoDTO.imagen != null) {
      formData.append('imagen', this.salaGuardadoDTO.imagen);
    }
    return formData;
  }
}
