import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SalaDTO } from '../../../sala/models/sala.dto';
import { SalaService } from '../../../sala/services/sala-service';
import { firstValueFrom } from 'rxjs';
import { MapaDTO } from '../../models/mapa.dto';

@Component({
  selector: 'app-mapa-visor',
  imports: [],
  templateUrl: './mapa-visor.html',
  styleUrl: './mapa-visor.scss',
})
export class MapaVisor implements OnInit {

  // Recuperación de las salas asociadas
  private readonly salaService = inject(SalaService);

  // Propiedades
  salaDTOList: WritableSignal<SalaDTO[]> = signal([]);
  mapaDTO: MapaDTO = new MapaDTO(null, null);

  ngOnInit(): void {
    this.cargarSalas();
  }

  establecerSala(idSala: string): void {
    const salaDTO = this.salaDTOList().find(s => s.id === idSala) ?? null;

    if (salaDTO === null) {
      // Debug
      console.log('HUBO UN PROBLEMA AL SELECCIONAR LA SALA');
    } else {
      this.mapaDTO.salaDTO = salaDTO;
      this.mapaDTO.rutaImagenSala = "http://localhost:3000/" + salaDTO.rutaImagen;
    }
  }

  private async cargarSalas(): Promise<void> {

    try {
      this.salaDTOList.set(await firstValueFrom(this.salaService.findAll()));
      // Debug 
      console.log(this.salaDTOList);
    } catch (error: any) {
      console.log("No hay salas que cargar");
    }
  }

}
