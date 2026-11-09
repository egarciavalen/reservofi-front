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

  crearSala(): void {
    this.router.navigateByUrl('/reserva/form');
  }

  async borrarReserva(idReserva: string) {
    await firstValueFrom(this.reservaService.delete(idReserva));
    // Debug
    console.log('Reserva borrada!');
    this.router.navigateByUrl('/reserva/list');  

    // Se recarga la lista de reservas
    this.cargarReservas();
  }
}
