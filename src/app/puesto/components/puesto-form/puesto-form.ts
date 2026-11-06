import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PuestoService } from '../../services/puesto-service';
import { Router } from '@angular/router';
import { PuestoDTO } from '../../models/puesto.dto';
import { firstValueFrom } from 'rxjs';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputText } from '../../../shared/components/form-controls/input-text/input-text';
import {MatButtonModule} from '@angular/material/button';

type PuestoFormModel = {
  nombre: FormControl<string>;
};

@Component({
  selector: 'app-puesto-form',
  imports: [MatButtonModule, ReactiveFormsModule, CommonModule, MatDialogModule, InputText],
  templateUrl: './puesto-form.html',
  styleUrl: './puesto-form.scss',
})
export class PuestoForm {

  private readonly formBuilder = inject(FormBuilder);
  private readonly puestoService = inject(PuestoService);
  private readonly router = inject(Router);

  // Referente a los diálogos
  readonly data = inject<PuestoDTO>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PuestoForm>);

  private puestoDTO: PuestoDTO = new PuestoDTO('', '', '', 0, 0, 0, 0);
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
    nombre: this.nombre
  });

  constructor() {
    // En OnInit currentNavigation pierde el valor
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
      // Redirección al mapa
      this.router.navigateByUrl('mapa/visor');
    } catch (error: any) {
      console.log(error);
    }

    // Cierre del diálogo
    this.dialogRef.close();
  }

}
