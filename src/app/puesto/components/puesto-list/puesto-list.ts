import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { PuestoService } from '../../services/puesto-service';
import { PuestoConsultaDTO } from '../../models/puesto-consulta.dto';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ChooseDialog } from '../../../shared/components/dialogs/choose-dialog/choose-dialog';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-puesto-list',
  imports: [MatIconModule, MatCardModule, MatButtonModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './puesto-list.html',
  styleUrl: './puesto-list.scss',
})
export class PuestoList {
 // Inyección de servicios
  private readonly router = inject(Router);
  private readonly puestoService = inject(PuestoService);
  
  // Lista de puestos a cargar
  puestoConsultaDTOList: WritableSignal<PuestoConsultaDTO[]> = signal([]);
  // Lista de puestos a mostrar
  puestoVistaDTOList: WritableSignal<PuestoConsultaDTO[]> = signal([]);


  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);
  
  // Para el filtrado en función de la sala
  readonly searchValue = new FormControl("");


  private readonly urlImages = "http://localhost:3000/";

  ngOnInit(): void {
    this.cargarPuestos();

    // Configuración del searchValue
    this.searchValue.valueChanges.subscribe(value => this.filter(value))
  }

  private async cargarPuestos(): Promise<void> {
    try {
      this.puestoConsultaDTOList.set(
      await firstValueFrom(this.puestoService.findAll()));
      this.actualizarRutasSalas();

      // Debug
      console.log(this.puestoConsultaDTOList);
      // Cargar en la vista
      this.puestoVistaDTOList.set(this.puestoConsultaDTOList());
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

  async borrarReserva(idPuesto: string) {
    // El resultado del mensaje de aviso determina la acción a realizar
    this.abrirDialogoAviso("¿Seguro que desea borrar el puesto? Se eliminarán las reservas asignadas.", idPuesto);
  }

  async abrirDialogoAviso(message: string, idPuesto: string) {
    const dialogRef = this.dialog.open(ChooseDialog, {
      data: message,
    });
  

  dialogRef.afterClosed().subscribe(async (result) => {
      // En el caso que se tenga un resultado con éxito
      if (result) {
        await firstValueFrom(this.puestoService.delete(idPuesto));
        this.router.navigateByUrl('/puesto/list');  
         // Se recarga la lista de reservas
        this.cargarPuestos();
      }  
    });
  }

  // FILTROS

  filter(value: string | null) {
    if (value != null) {
      const puestosFiltrados = this.puestoConsultaDTOList().filter(puesto => puesto.nombreSala.toLowerCase().includes(value.trim().toLowerCase()))
      this.puestoVistaDTOList.set(puestosFiltrados);
    }
  }
}
