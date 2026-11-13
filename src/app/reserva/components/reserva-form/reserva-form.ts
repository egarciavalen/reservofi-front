import { CommonModule, formatDate } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import { InputDate } from '../../../shared/components/form-controls/input-date/input-date';
import { ReservaGuardadoDTO } from '../../models/reserva-guardado.dto';
import { ReservaService } from '../../services/reserva-service';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';

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
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  private readonly reservaDTO: ReservaGuardadoDTO = new ReservaGuardadoDTO('', '', '', '', '');
  isValidForm: boolean | null = null;

  // Referente a los diálogos
  readonly data = inject<string>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ReservaForm>);

  fechaInicio = new FormControl(formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'en'), {
    nonNullable: true,
    validators: [Validators.required],
  });

  fechaFin = new FormControl(formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'en'), {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly reservaForm: FormGroup<ReservaFormModel> = this.formBuilder.group({
    fechaInicio: this.fechaInicio,
    fechaFin: this.fechaFin,
  });

  async ngOnInit(): Promise<void> {
    // Recuperación del identificador de la sala
    this.reservaDTO.idPuesto = this.data;

    // Recuperación del identificador del usuario
    const idUsuario = this.localStorageService.get('idUsuario');
    if (idUsuario) {
      this.reservaDTO.idUsuario = idUsuario;
    } else {
      // Debug
      console.log('ERROR AL RECUPERAR EL USUARIO');
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
      this.abrirDialogoMensaje("Reserva creada correctamente!");

    } catch (error: any) {
      console.log(error);
      this.abrirDialogoMensaje("Ha ocurrido un error al crear la reserva.");
    }

    this.cerrarDialogo();
  }

  cerrarDialogo(): void {
    this.dialogRef.close();
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
