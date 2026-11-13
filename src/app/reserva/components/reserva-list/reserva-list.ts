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

@Component({
  selector: 'app-reserva-list',
  imports: [FormatDatePipe, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.scss',
})
export class ReservaList {
  // Inyección de servicios
  private readonly router = inject(Router);
  private readonly reservaService = inject(ReservaService);
  private readonly localStorageService = inject(LocalStorageService);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  reservaConsultaDTOList: WritableSignal<ReservaConsultaDTO[]> = signal([]);

  private readonly urlImages = "http://localhost:3000/";

  ngOnInit(): void {
    this.cargarReservas();
  }

  private async cargarReservas(): Promise<void> {
    const idUsuario = this.localStorageService.get('idUsuario');

    if (idUsuario != null) {
      try {
        this.reservaConsultaDTOList.set(
          await firstValueFrom(this.reservaService.findByUsuarioId(idUsuario)),
        );
        this.actualizarRutasSalas();

        // Debug
        console.log(this.reservaConsultaDTOList);
      } catch (error: any) {
        console.log('No hay reservas que cargar');
        this.reservaConsultaDTOList.set([]);
      }
    } else {
      // Debug
      console.log('HA OCURRIDO UN PROBLEMA AL RECUPERAR AL USUARIO');
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

  async abrirDialogoAviso(message: string, idReserva: string) {
    const dialogRef = this.dialog.open(ChooseDialog, {
      data: message,
    });
  

  dialogRef.afterClosed().subscribe(async (result) => {
      // En el caso que se tenga un resultado con éxito
      if (result) {
        await firstValueFrom(this.reservaService.delete(idReserva));
        // Debug
        this.router.navigateByUrl('/reserva/list');  
        // Se recarga la lista de reservas
        this.cargarReservas();
      }  
    });
  }
}
