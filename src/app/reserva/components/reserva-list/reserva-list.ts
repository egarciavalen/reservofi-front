import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva-service';
import { ReservaDTO } from '../../models/reserva.dto';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import { formatDate } from '@angular/common';
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-reserva-list',
  imports: [FormatDatePipe],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.scss',
})
export class ReservaList {

  // Inyección de servicios
  private readonly router = inject(Router);
  private readonly reservaService = inject(ReservaService);
  private readonly localStorageService = inject(LocalStorageService);

  reservaDTOList: WritableSignal<ReservaDTO[]> = signal([]);


  ngOnInit(): void {
    this.cargarReservas();
  }

  private async cargarReservas(): Promise<void> {

    const idUsuario = this.localStorageService.get("idUsuario");

    if (idUsuario != null) {
      try {
        this.reservaDTOList.set(await firstValueFrom(this.reservaService.findByUsuarioId(idUsuario)));
        // Debug 
        console.log(this.reservaDTOList);
      } catch (error: any) {
        console.log("No hay reservas que cargar");
      }
    } else {
      // Debug
      console.log("HA OCURRIDO UN PROBLEMA AL RECUPERAR AL USUARIO");
    }
  }

  crearSala(): void {
    this.router.navigateByUrl('/reserva/form');
  }

  editarReserva(id: string): void {
    this.router.navigateByUrl('/reserva/form/' + id);
  }

}
