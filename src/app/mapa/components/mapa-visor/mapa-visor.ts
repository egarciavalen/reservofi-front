import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PuestoForm } from '../../../puesto/components/puesto-form/puesto-form';
import { PuestoGuardadoDTO } from '../../../puesto/models/puesto-guardado.dto';
import { PuestoService } from '../../../puesto/services/puesto-service';
import { ReservaForm } from '../../../reserva/components/reserva-form/reserva-form';
import { SalaConsultaDTO } from '../../../sala/models/sala-consulta.dto';
import { SalaService } from '../../../sala/services/sala-service';
import { MapaPuntoDTO } from '../../models/mapa-punto';
import { MapaDTO } from '../../models/mapa.dto';
import { PuestoConsultaDTO } from '../../../puesto/models/puesto-consulta.dto';

@Component({
  selector: 'app-mapa-visor',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './mapa-visor.html',
  styleUrl: './mapa-visor.scss',
})
export class MapaVisor implements OnInit {
  // Recuperación de las salas asociadas
  private readonly salaService = inject(SalaService);
  private readonly puestoService = inject(PuestoService);
  private readonly router = inject(Router);

  // Propiedades

  // Listado de salas
  salaDTOList: WritableSignal<SalaConsultaDTO[]> = signal([]);
  // Listado de puestos sobre las salas
  puestoDTOTotalList: PuestoConsultaDTO[] = [];
  puestoDTOFiltradoList: WritableSignal<PuestoConsultaDTO[]> = signal([]);
  // Puesto actual que se que quiere incluir (signal puesto que se irá actualizando en la pantalla)
  puestoActualDTO: WritableSignal<PuestoGuardadoDTO | null> = signal(null);
  // Mapa sobre el que se va a cargar la sala
  mapaDTO: MapaDTO = new MapaDTO(null, null);
  // Punto de origen sobre el cual empezamos a crear el puesto
  origenDTO: MapaPuntoDTO = new MapaPuntoDTO(0, 0);
  // Campos booleanos que limitarán el alcance de los eventos MouseX
  ratonPulsado: boolean = false;
  modoEdicion: boolean = false;

  // Referente a la gestión de diálogos
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.cargarSalas();
    this.cargarPuestos();
  }

  private async cargarSalas(): Promise<void> {
    try {
      this.salaDTOList.set(await firstValueFrom(this.salaService.findAll()));
    } catch (error: any) {
      console.log('No hay salas que cargar');
    }
  }
  private async cargarPuestos(): Promise<void> {
    try {
      this.puestoDTOTotalList = await firstValueFrom(this.puestoService.findAll());
      // Actualiza los puestos a mostrar
      this.actualizarPuestosSala();
    } catch (error: any) {
      console.log('No hay salas que cargar');
    }
  }

  establecerSala(idSala: string): void {
    const salaDTO = this.salaDTOList().find((s) => s.id === idSala) ?? null;
    if (salaDTO === null) {
      // Debug
      console.log('HUBO UN PROBLEMA AL SELECCIONAR LA SALA');
    } else {
      this.mapaDTO.idSala = salaDTO.id;
      // Cambiar localhost al actualizar a servidor en producción
      this.mapaDTO.rutaImagenSala = 'http://localhost:3000/' + salaDTO.rutaImagen;
      // Actualiza los puestos actuales a mostrar
      this.actualizarPuestosSala();
    }
  }

  actualizarPuestosSala() {
    // Actualiza los puestos filtrados
    this.puestoDTOFiltradoList.set(
      this.puestoDTOTotalList.filter((puesto) => puesto.idSala == this.mapaDTO.idSala),
    );
  }

  alternarModoEdicion(): void {
    this.modoEdicion = !this.modoEdicion;
  }

  // *** EVENTOS ASOCIADOS AL RATÓN ***

  pulsarRaton(e: MouseEvent) {
    if (this.modoEdicion) {
      // Se activa el modo creación
      this.ratonPulsado = true;
      // Es necesario marcar cual sería la coordenada de origen
      this.origenDTO = this.ubicacionActual(e);
      // Se procede a crear un objeto de tipo MapaPuestoDTO siempre que se haya seleccionado previamente una sala
      this.puestoActualDTO.set(
        new PuestoGuardadoDTO(
          '',
          this.mapaDTO.idSala !== null ? this.mapaDTO.idSala : '',
          '',
          this.origenDTO.coordenadaX,
          this.origenDTO.coordenadaY,
          0,
          0,
        ),
      );
    }
  }

  moverRaton(e: MouseEvent) {
    if (this.modoEdicion && this.ratonPulsado) {
      // En este punto lo que hay que hacer es actualizar las coordenadas del puesto creado
      const ubicacionActual = this.ubicacionActual(e);

      // Primero se revisan las coordenadas X e Y para determinar cuál es el origen real
      // Esto es porque si coges el ratón y arrastras por encima del punto de origen, debería poder crearte el rectángulo
      const nuevaCoordenadaX = Math.min(this.origenDTO.coordenadaX, ubicacionActual.coordenadaX);
      const nuevaCoordenadaY = Math.min(this.origenDTO.coordenadaY, ubicacionActual.coordenadaY);
      // Se obtiene el ancho y alto comparando con el punto de origen
      // Uso de Math.abs porque si no, si se arrastra a la derecha toma valores negativos y no lo registra bien
      const nuevoAncho = Math.abs(this.origenDTO.coordenadaX - ubicacionActual.coordenadaX);
      const nuevoAlto = Math.abs(this.origenDTO.coordenadaY - ubicacionActual.coordenadaY);
      this.puestoActualDTO.update((puesto) => ({
        ...puesto,
        id: '',
        idSala: puesto !== null && puesto.idSala !== null ? puesto.idSala : '',
        nombre: puesto !== null ? puesto.nombre : '',
        coordenadaX: nuevaCoordenadaX,
        coordenadaY: nuevaCoordenadaY,
        ancho: nuevoAncho,
        alto: nuevoAlto,
      }));
    }
  }

  finalizarRaton() {
    if (this.modoEdicion) {
      // Se desactiva el modo creación y se deja el elemento creado como está
      this.ratonPulsado = false;
      // Se abre el diálogo para crear un puesto
      this.abrirDialogoPuesto();
    }
  }

  private ubicacionActual(e: MouseEvent): MapaPuntoDTO {
    // Búsqueda del punto actual en pantalla
    // Se resta el contenido de la pantalla (viewport) menos el del contenedor sobre el que se está aplicando el event
    // Esto se hace porque el elementoContenedor cuenta las coordenadas desde el viewport
    // Adicionalmente, se buscan los PORCENTAJES para que se redimensionen los elementos en función de la pantalla
    const elementoContenedor = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const coordenadaX = ((e.clientX - elementoContenedor.left) / elementoContenedor.width) * 100;
    const coordenadaY = ((e.clientY - elementoContenedor.top) / elementoContenedor.height) * 100;
    return new MapaPuntoDTO(coordenadaX, coordenadaY);
  }

  // Código relativo a los diálogos

  private abrirDialogoPuesto(): void {
    const dialogRef = this.dialog.open(PuestoForm, {
      data: this.puestoActualDTO(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      // En el caso que se tenga un resultado con éxito
      if (result) {
        this.cargarPuestos();
      }
      // Se reinician los valores de la edición
      this.puestoActualDTO.set(null);
      this.origenDTO = new MapaPuntoDTO(0, 0);
    });
  }

  abrirDialogoReserva(idPuesto: string): void {
    const dialogRef = this.dialog.open(ReservaForm, {
      data: idPuesto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // No aplica ninguna acción adicional, se gestiona todo desde las reservas
    });
  }
}
