import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';
import { ReservaConsultaDTO } from '../../models/reserva-consulta.dto';
import { ReservaService } from '../../services/reserva-service';
import { MatDialog } from '@angular/material/dialog';
import { ChooseDialog } from '../../../shared/components/dialogs/choose-dialog/choose-dialog';
import { UsuarioService } from '../../../usuario/services/usuario-service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';

@Component({
  selector: 'app-reserva-list',
  imports: [FormatDatePipe, MatIconModule, MatCardModule, MatButtonModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.scss',
})
export class ReservaList {
  // Inyección de servicios
  private readonly router = inject(Router);
  private readonly reservaService = inject(ReservaService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly formBuilder = inject(FormBuilder);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  // Determina si sale el buscador para filtrar por el usuario
  administrador: WritableSignal<boolean> = signal(false);

  // Lista de reservas a cargar
  reservaConsultaDTOList: WritableSignal<ReservaConsultaDTO[]> = signal([]);
  // Lista de reservas a mostrar al usuario
  reservaVistaDTOList: WritableSignal<ReservaConsultaDTO[]> = signal([]);

  private readonly urlImages = "http://localhost:3000/";

  // Para el filtrado en función del correo corporativo
  readonly searchValue = new FormControl("");


  async ngOnInit(): Promise<void> {
    try {
      this.administrador.set(await firstValueFrom(this.usuarioService.checkAdmin(this.localStorageService.get("idUsuario")!)));
      this.cargarReservas();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.abrirDialogoMensaje(error.error);
      }  
    } 

    // Configuración del searchValue
    this.searchValue.valueChanges.subscribe(value => this.filter(value))
  }

  private async cargarReservas(): Promise<void> {

    // Si NO es un administrador, recupera la lista entera de reservas
    if (!this.administrador()) {
        const idUsuario = this.localStorageService.get('idUsuario');
        if (idUsuario != null) {
          try {
            this.reservaConsultaDTOList.set(
              await firstValueFrom(this.reservaService.findByUsuarioId(idUsuario)),
            );
            this.actualizarRutasSalas();
            // Asignación de las reservas
            this.reservaVistaDTOList.set(this.reservaConsultaDTOList());
          } catch (error: any) {
            if (error instanceof HttpErrorResponse) {
              this.abrirDialogoMensaje(error.error);
            } 
          }
        } else {
          this.abrirDialogoMensaje("Ha ocurrido un error interno al recuperar el usuario.");
        }
    } else {
      try {
        this.reservaConsultaDTOList.set(await firstValueFrom(this.reservaService.findAll()));
        this.actualizarRutasSalas();
        // Asignación de las reservas
        this.reservaVistaDTOList.set(this.reservaConsultaDTOList());
      } catch (error: any) {
        if (error instanceof HttpErrorResponse) {
          this.abrirDialogoMensaje(error.error);
        } 
      }  
    }
  }

  private actualizarRutasSalas(): void {
    for (const reserva of this.reservaConsultaDTOList()) {
      reserva.rutaImagen = this.urlImages + reserva.rutaImagen;
    }
  }

  async borrarReserva(idReserva: string) {
    // El resultado del mensaje de aviso determina la acción a realizar
    this.abrirDialogoAviso("¿Seguro que desea borrar la reserva?", idReserva);
  }


  abrirDialogoMensaje(message: string): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      // No aplica cambios
    });
  }

  async abrirDialogoAviso(message: string, idReserva: string) {
    const dialogRef = this.dialog.open(ChooseDialog, {
      data: message,
    });
  

  dialogRef.afterClosed().subscribe(async (result) => {
      // En el caso que se tenga un resultado con éxito
      if (result) {
        await firstValueFrom(this.reservaService.delete(idReserva));
        this.router.navigateByUrl('/reserva/list');  
        // Se recarga la lista de reservas
        this.cargarReservas();
      }  
    });
  }

  // FILTROS

  filter(value: string | null) {
    if (value != null) {
      const reservasFiltradas = this.reservaConsultaDTOList().filter(reserva => reserva.correoCorporativo.toLowerCase().includes(value.trim().toLowerCase()))
      this.reservaVistaDTOList.set(reservasFiltradas);
    }
  }
}
