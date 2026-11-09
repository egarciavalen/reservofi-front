import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { PuestoService } from '../../services/puesto-service';
import { PuestoConsultaDTO } from '../../models/puesto-consulta.dto';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-puesto-list',
  imports: [MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './puesto-list.html',
  styleUrl: './puesto-list.scss',
})
export class PuestoList {
 // Inyección de servicios
  private readonly router = inject(Router);
  private readonly puestoService = inject(PuestoService);
  puestoConsultaDTOList: WritableSignal<PuestoConsultaDTO[]> = signal([]);

  private readonly urlImages = "http://localhost:3000/";

  ngOnInit(): void {
    this.cargarPuestos();
  }

  private async cargarPuestos(): Promise<void> {
    try {
      this.puestoConsultaDTOList.set(
      await firstValueFrom(this.puestoService.findAll()));
      this.actualizarRutasSalas();

      // Debug
      console.log(this.puestoConsultaDTOList);
    } catch (error: any) {
      console.log('No hay reservas que cargar');
      this.puestoConsultaDTOList.set([]);
    }
  }

  private actualizarRutasSalas(): void {
    for (const puesto of this.puestoConsultaDTOList()) {
      puesto.rutaImagen = this.urlImages + puesto.rutaImagen;
    }
  }

  crearSala(): void {
    this.router.navigateByUrl('/reserva/form');
  }

  async borrarReserva(idReserva: string) {
    await firstValueFrom(this.puestoService.delete(idReserva));
    // Debug
    console.log('Puesto borrado!');
    this.router.navigateByUrl('/puesto/list');  

    // Se recarga la lista de reservas
    this.cargarPuestos();
  }

}
