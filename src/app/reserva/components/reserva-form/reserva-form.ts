import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservaService } from '../../services/reserva-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaDTO } from '../../models/reserva.dto';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../auth/services/local-storage-service';

type ReservaFormModel = {
  fechaInicio: FormControl<string>;
  fechaFin: FormControl<string>;
};
@Component({
  selector: 'app-reserva-form',
  imports: [ReactiveFormsModule, CommonModule],
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


  // Para determinar si se edita o crea una sala nueva
  idReserva = this.activatedRoute.snapshot.paramMap.get('id');

  fechaInicio = new FormControl(this.reservaDTO.fechaInicio, {
    nonNullable: true,
    validators: [
      Validators.required
    ],
  });

  fechaFin = new FormControl(this.reservaDTO.fechaFin, {
    nonNullable: true,
    validators: [
      Validators.required
    ],
  });

  readonly reservaForm: FormGroup<ReservaFormModel> = this.formBuilder.group({
    fechaInicio: this.fechaInicio,
    fechaFin: this.fechaFin,
  });
  

  constructor() {
    // En OnInit currentNavigation pierde el valor
     // Recuperación de la información enviada por parámetros
    const state = this.router.currentNavigation()?.extras.state?.['idPuesto'] as string;
    this.reservaDTO.idPuesto = state;

    const idUsuario = this.localStorageService.get("idUsuario");
    if (idUsuario) {
      this.reservaDTO.idUsuario = idUsuario;
    } else {
      // Debug
      console.log("ERROR AL RECUPERAR EL USUARIO");
    }
  }

  async ngOnInit(): Promise<void> {
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
    try {
      const reservaResponse = await firstValueFrom(this.reservaService.create(this.reservaDTO));
      // Debug 
      console.log(reservaResponse);
      // Redirección al mapa
      this.router.navigateByUrl('mapa/visor');
    } catch (error: any) {
      console.log(error);
    }
  }


  async borrarReserva(): Promise<void> {
    if (this.idReserva) {
      await firstValueFrom(this.reservaService.delete(this.idReserva));
      // Debug
      console.log('Reserva borrada!');
      this.router.navigateByUrl('/mapa/visor');
    }
  }
}
