import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SalaConsultaDTO } from '../../models/sala-consulta.dto';
import { SalaService } from '../../services/sala-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';

@Component({
  selector: 'app-sala-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './sala-list.html',
  styleUrl: './sala-list.scss',
})
export class SalaList implements OnInit {
  // Inyección de servicios
  private readonly router = inject(Router);
  private readonly salaService = inject(SalaService);

  // Lista de salas a cargar
  salaConsultaDTOList: WritableSignal<SalaConsultaDTO[]> = signal([]);
  // Lista de salas a mostrar
  salaVistaDTOList: WritableSignal<SalaConsultaDTO[]> = signal([]);

  // Para el filtrado en función de la sala
  readonly searchValue = new FormControl("");

  private readonly urlImages = 'http://localhost:3000/';

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.cargarSalas();
    // Configuración del searchValue
    this.searchValue.valueChanges.subscribe(value => this.filter(value))
  }

  private async cargarSalas(): Promise<void> {
    try {
      this.salaConsultaDTOList.set(await firstValueFrom(this.salaService.findAll()));
      this.actualizarRutasSalas();
      // Cargar en la vista
      this.salaVistaDTOList.set(this.salaConsultaDTOList());
    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        this.abrirDialogoMensaje(error.error, false);
      }
    }
  }

  private actualizarRutasSalas(): void {
    for (const sala of this.salaConsultaDTOList()) {
      sala.rutaImagen = this.urlImages + sala.rutaImagen;
    }
  }

  crearSala(): void {
    this.router.navigateByUrl('/sala/form');
  }

  editarSala(id: string): void {
    this.router.navigateByUrl('/sala/form/' + id);
  }

  // FILTROS

  filter(value: string | null) {
    if (value != null) {
      const salasFiltradas = this.salaConsultaDTOList().filter(sala => sala.nombre.toLowerCase().includes(value.trim().toLowerCase()))
      this.salaVistaDTOList.set(salasFiltradas);
    }
  }


  // DIÁLOGOS

  abrirDialogoMensaje(message: string, redirection: boolean): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (redirection) {
        this.router.navigateByUrl('sala/list');
      }
    });
  }
}
