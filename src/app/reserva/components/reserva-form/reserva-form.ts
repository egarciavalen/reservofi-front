import { CommonModule, formatDate } from '@angular/common';
import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
import { UsuarioService } from '../../../usuario/services/usuario-service';
import { MatInputModule } from '@angular/material/input';
import { UsuarioConsultaDTO } from '../../../usuario/models/usuario-consulta.dto';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InputDateTime } from '../../../shared/components/form-controls/input-date-time/input-date-time';

type ReservaFormModel = {
  fechaInicio: FormControl<Date>;
  horaInicio: FormControl<Date>;
  fechaFin: FormControl<Date>;
  horaFin: FormControl<Date>;
  correoCorporativo: FormControl<string>;
};
@Component({
  selector: 'app-reserva-form',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, InputDate, MatButtonModule, MatInputModule, ReactiveFormsModule, MatAutocompleteModule, InputDateTime],
  templateUrl: './reserva-form.html',
  styleUrl: './reserva-form.scss',
})
export class ReservaForm implements OnInit {
  // Inyección de dependencias
  private readonly formBuilder = inject(FormBuilder);
  private readonly reservaService = inject(ReservaService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly usuarioService = inject(UsuarioService);

  // Determina si el formulario tendrá campos adicionales
  administrador: WritableSignal<boolean> = signal(false);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  private readonly reservaDTO: ReservaGuardadoDTO = new ReservaGuardadoDTO('', '', '', '', '');
  isValidForm: boolean | null = null;

  // Lista de usuarios en el sistema
  usuarioConsultaDTOList: WritableSignal<UsuarioConsultaDTO[]> = signal([]);

  // Referente a los diálogos
  readonly data = inject<string>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ReservaForm>);

  fechaInicio = new FormControl(new Date(), {
    nonNullable: true,
    validators: [Validators.required],
  });

  horaInicio = new FormControl(new Date(), {
    nonNullable: true,
    validators: [Validators.required],
  });

  fechaFin = new FormControl(new Date(), {
    nonNullable: true,
    validators: [Validators.required],
  });

  horaFin = new FormControl(new Date(), {
    nonNullable: true,
    validators: [Validators.required],
  });

  correoCorporativo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  readonly reservaForm: FormGroup<ReservaFormModel> = this.formBuilder.group({
    fechaInicio: this.fechaInicio,
    horaInicio: this.horaInicio,
    fechaFin: this.fechaFin,
    horaFin: this.horaFin,
    correoCorporativo: this.correoCorporativo
  });

  async ngOnInit(): Promise<void> {
    // Cargar lista de usuarios en el sistema
    this.cargarListaUsuarios();

    // Gestión del administrador
    try {
      this.administrador.set(await firstValueFrom(this.usuarioService.checkAdmin(this.localStorageService.get("idUsuario")!)));
    } catch (error) {
      // DEBUG
     console.log('Ha ocurrido un error interno al buscar si el usuario es un administrador');      
    }

    // Recuperación del identificador de la sala
    this.reservaDTO.idPuesto = this.data;
  }

  async guardar(): Promise<void> {
    // Si el formulario NO es válido, finaliza el proceso
    this.isValidForm = false;
    if (this.reservaForm.invalid) {
      return;
    }
    this.isValidForm = true;

    const { fechaInicio, horaInicio, fechaFin, horaFin, correoCorporativo } = this.reservaForm.getRawValue();

    // Guardar el formato de las fechas
    fechaInicio.setHours(horaInicio.getHours());
    fechaFin.setHours(horaFin.getHours());

    console.log(fechaInicio);
    console.log(fechaFin);

    this.reservaDTO.fechaInicio = formatDate(fechaInicio, 'yyyy-MM-ddTHH:mm', 'en');
    this.reservaDTO.fechaFin = formatDate(fechaFin, 'yyyy-MM-ddTHH:mm', 'en');

    const usuarioReservado = this.usuarioConsultaDTOList().find(usuario => usuario.correoCorporativo == correoCorporativo);
    this.reservaDTO.idUsuario = usuarioReservado!.id;

    // DEBUG
    console.log(this.reservaDTO);

    try {
      const reservaResponse = await firstValueFrom(this.reservaService.create(this.reservaDTO));
      // Debug
      console.log(reservaResponse);
      this.abrirDialogoMensaje("¡Reserva creada correctamente!");

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

  // Gestión adicional de los usuarios

  private async cargarListaUsuarios() {
    const usuarios = await firstValueFrom(this.usuarioService.findAll());
    this.usuarioConsultaDTOList.set(usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre))); 

    // Recuperación y gestión del identificador del usuario
    const idUsuario = this.localStorageService.get('idUsuario');
    // Si NO es el administrador y tiene ID de usuario
    if (idUsuario && !this.administrador()) {
        const usuario = this.usuarioConsultaDTOList().find(usuario => usuario.id == idUsuario);
        this.correoCorporativo.setValue(usuario!.correoCorporativo);
    } else {
      // Debug
      console.log('ERROR AL RECUPERAR EL USUARIO');
    }
  }

  protected usuariosFiltrados = computed<UsuarioConsultaDTO[]>(() => {
    const value = this.correoCorporativo.value;
    return this.usuarioConsultaDTOList().filter(usuario => usuario.correoCorporativo.toLowerCase().includes(value));
  });

}
