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
import { SalaGuardadoDTO } from '../../models/sala-guardado.dto';
import { SalaService } from '../../services/sala-service';
import { InputText } from '../../../shared/components/form-controls/input-text/input-text';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ChooseDialog } from '../../../shared/components/dialogs/choose-dialog/choose-dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

type SalaFormModel = {
  nombre: FormControl<string>;
  imagen: FormControl<File | null>;
};
@Component({
  selector: 'app-sala-form',
  imports: [ReactiveFormsModule, CommonModule, InputText, MatButtonModule, MatIconModule],
  templateUrl: './sala-form.html',
  styleUrl: './sala-form.scss',
})
export class SalaForm implements OnInit {
  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly salaService = inject(SalaService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  private readonly salaGuardadoDTO: SalaGuardadoDTO = new SalaGuardadoDTO('', null);
  isValidForm: boolean | null = null;

  // Propiedades adicionales
  readonly nombreMin = 5;
  readonly nombreMax = 30;
  nombreImagen = '';
  rutaMostrarImagen = '';

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
      this.salaForm.controls.nombre.setValue(salaCreada.nombre);
      this.nombreImagen = salaCreada.nombreImagen;
      // TODO: CAMBIAR POR PARÁMETRO CUANDO NO ESTÉS EN LOCAL
      this.rutaMostrarImagen = environment.url + salaCreada.rutaImagen;
    }
  }

  mostrarNombreFichero(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];

    if (file) {
      this.nombreImagen = file.name; // Marcar el nombre del fichero para aportar feedback
      this.imagen.setValue(file); // Desde formControl da problemas; se guarda el fichero en el evento
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
        await firstValueFrom(this.salaService.update(this.idSala, formData));
        this.abrirDialogoMensaje("¡Sala actualizada correctamente!", true);
      } catch (error: any) {
        if (error instanceof HttpErrorResponse) {
          this.abrirDialogoMensaje(error.error, false);
        }
      }
    } else {
      // Creación
      try {
        await firstValueFrom(this.salaService.create(formData));
        this.abrirDialogoMensaje("¡Sala creada correctamente!", true);
      } catch (error: any) {
        if (error instanceof HttpErrorResponse) {
          this.abrirDialogoMensaje(error.error, false);
        }      
      }
    }
  }

  async borrarSala(): Promise<void> {
    // El resultado del mensaje de aviso determina la acción a realizar
    this.abrirDialogoAviso("¿Seguro que desea borrar la sala? Se eliminarán los puestos y reservas asignados.");
  }

  abrirDialogoMensaje(message: string, redirection: boolean): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (redirection) {
        this.router.navigateByUrl('sala/list');
      }
    });
  }

  async abrirDialogoAviso(message: string) {
    const dialogRef = this.dialog.open(ChooseDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
        // En el caso que se tenga un resultado con éxito y se haya seleccionado un ID
        if (result && this.idSala) {
          await firstValueFrom(this.salaService.delete(this.idSala));
          this.router.navigateByUrl('/sala/list');
        }  
      });
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
