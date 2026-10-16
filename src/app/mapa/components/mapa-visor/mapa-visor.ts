import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SalaDTO } from '../../../sala/models/sala.dto';
import { SalaService } from '../../../sala/services/sala-service';
import { firstValueFrom } from 'rxjs';
import { MapaDTO } from '../../models/mapa.dto';
import { MapaPuntoOrigenDTO } from '../../models/mapa.punto.origen';

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

  // Listado de salas
  salaDTOList: WritableSignal<SalaDTO[]> = signal([]);
  // Mapa sobre el que se va a cargar la sala
  mapaDTO: MapaDTO = new MapaDTO(null, null);
  mapaPuntoOrigenDTO: MapaPuntoOrigenDTO = new MapaPuntoOrigenDTO(0, 0);
  creacion: boolean = false;

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

  // Eventos asociados al ratón
  pulsarRaton(e: MouseEvent) {
    this.creacion = true;
    console.log('estoy pulsando el ratón')

  }

  moverRaton(e: MouseEvent) {
    if (this.creacion){
      console.log('estoy moviendo el ratón')
    }
  }

  finalizarRaton() {
    // Se desactiva el modo creación y se deja el elemento creado como está
    this.creacion = false;
    console.log('he finalizado moviendo el ratón')
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
