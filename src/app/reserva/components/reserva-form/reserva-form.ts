import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservaService } from '../../services/reserva-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaDTO } from '../../models/reserva.dto';
import { firstValueFrom } from 'rxjs';
import { CommonModule, formatDate } from '@angular/common';
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputDate } from '../../../shared/components/form-controls/input-date/input-date';
import { MatButtonModule } from '@angular/material/button';

type ReservaFormModel = {
  fechaInicio: FormControl<string>;
  fechaFin: FormControl<string>;
};
@Component({
  selector: 'app-reserva-form',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, InputDate, MatButtonModule],
  templateUrl: './reserva-form.html',
  styleUrl: './reserva-form.scss',
})
export class ReservaForm implements OnInit {

  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly reservaService = inject(ReservaService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  private readonly reservaDTO: ReservaDTO = new ReservaDTO("", "", "", "", "");
  isValidForm: boolean | null = null;

  // Referente a los diálogos
  readonly data = inject<string>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ReservaForm>);


  // Para determinar si se edita o crea una reserva
  idReserva = this.activatedRoute.snapshot.paramMap.get('id');

  fechaInicio = new FormControl(formatDate(new Date(), "yyyy-MM-ddTHH:mm", "en"), {
    nonNullable: true,
    validators: [
      Validators.required
    ],
  });

  fechaFin = new FormControl(formatDate(new Date(), "yyyy-MM-ddTHH:mm", "en"), {
    nonNullable: true,
    validators: [
      Validators.required
    ],
  });

  readonly reservaForm: FormGroup<ReservaFormModel> = this.formBuilder.group({
    fechaInicio: this.fechaInicio,
    fechaFin: this.fechaFin,
  });
  

  async ngOnInit(): Promise<void> {
    // Recuperación del identificador de la sala
    this.reservaDTO.idPuesto = this.data;

    // Recuperación del identificador del usuario
    const idUsuario = this.localStorageService.get("idUsuario");
    if (idUsuario) {
      this.reservaDTO.idUsuario = idUsuario;
    } else {
      // Debug
      console.log("ERROR AL RECUPERAR EL USUARIO");
    }

    // Si es una actualización, se rellenan los campos correspondientes
    if (this.idReserva) {
      const reservaCreada = await firstValueFrom(this.reservaService.findById(this.idReserva));
      // Debug
      console.log(reservaCreada);
      this.reservaForm.controls.fechaInicio.setValue(reservaCreada.fechaInicio);
      this.reservaForm.controls.fechaFin.setValue(reservaCreada.fechaFin);

      // Se desactivan los controles de formulario
      this.fechaInicio.disable();
      this.fechaFin.disable();
    }
  }


  async guardar(): Promise<void> {
    // Si el formulario NO es válido, finaliza el proceso
    this.isValidForm = false;
    if (this.reservaForm.invalid) {
      return;
    }
    this.isValidForm = true;

    const { fechaInicio, fechaFin } = this.reservaForm.getRawValue();
    this.reservaDTO.fechaInicio = fechaInicio;
    this.reservaDTO.fechaFin = fechaFin;

    console.log(this.reservaDTO);
    try {
      const reservaResponse = await firstValueFrom(this.reservaService.create(this.reservaDTO));
      // Debug 
      console.log(reservaResponse);
      // Redirección al mapa
      this.router.navigateByUrl('mapa/visor');
    } catch (error: any) {
      console.log(error);
    }

    // Cierre del diálogo
    this.dialogRef.close();
  }
}
