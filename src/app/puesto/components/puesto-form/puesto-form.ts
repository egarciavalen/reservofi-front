import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { InputText } from '../../../shared/components/form-controls/input-text/input-text';
import { PuestoGuardadoDTO } from '../../models/puesto-guardado.dto';
import { PuestoService } from '../../services/puesto-service';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';

type PuestoFormModel = {
  nombre: FormControl<string>;
};

@Component({
  selector: 'app-puesto-form',
  imports: [MatButtonModule, ReactiveFormsModule, CommonModule, MatDialogModule, InputText],
  templateUrl: './puesto-form.html',
  styleUrl: './puesto-form.scss',
})
export class PuestoForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly puestoService = inject(PuestoService);
  private readonly router = inject(Router);

  // Referente a los diálogos
  readonly data = inject<PuestoGuardadoDTO>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PuestoForm>);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  private puestoDTO: PuestoGuardadoDTO = new PuestoGuardadoDTO('', '', '', 0, 0, 0, 0);
  isValidForm: boolean | null = null;

  // Propiedades adicionales
  readonly nombreMin = 2;
  readonly nombreMax = 5;

  nombre = new FormControl(this.puestoDTO.nombre, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(this.nombreMin),
      Validators.maxLength(this.nombreMax),
    ],
  });

  readonly puestoForm: FormGroup<PuestoFormModel> = this.formBuilder.group({
    nombre: this.nombre,
  });

  ngOnInit(): void {
    this.puestoDTO = this.data;
  }

  async guardar(): Promise<void> {
    // Si el formulario NO es válido, finaliza el proceso
    this.isValidForm = false;
    if (this.puestoForm.invalid) {
      return;
    }
    this.isValidForm = true;

    const { nombre } = this.puestoForm.getRawValue();
    this.puestoDTO.nombre = nombre;

    try {
      const puestoResponse = await firstValueFrom(this.puestoService.create(this.puestoDTO));
      // Debug
      console.log(puestoResponse);
      this.abrirDialogoMensaje("¡Puesto creado correctamente!");
    } catch (error: any) {
      console.log(error);
      this.abrirDialogoMensaje("Ha ocurrido un error al crear el puesto.");
    }

    this.cerrarDialogo();
  }

  cerrarDialogo(): void {
    // Si se registra que se guarda el nombre, entonces se entiende que se crea el puesto correctamente
    if (this.puestoDTO.nombre.length > 0) {
      this.dialogRef.close(true);
    } else {
      // En caso contrario, indicamos false y NO se guardaría el puesto
      this.dialogRef.close(false);
    }
  }


  abrirDialogoMensaje(message: string): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      this.cerrarDialogo();
    });
  }

}
