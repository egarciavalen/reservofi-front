import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SalaDTO } from '../../models/sala.dto';
import { SalaService } from '../../services/sala-service';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';import { firstValueFrom } from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-sala-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './sala-list.html',
  styleUrl: './sala-list.scss',
})
export class SalaList implements OnInit {

  // Inyección de servicios
  private readonly router = inject(Router);
  private readonly salaService = inject(SalaService);

  salaDTOList: WritableSignal<SalaDTO[]> = signal([]);

  private readonly urlImages = "http://localhost:3000/";


  ngOnInit(): void {
    this.cargarSalas();
  }

  private async cargarSalas(): Promise<void> {

    try {
      this.salaDTOList.set(await firstValueFrom(this.salaService.findAll()));
      this.actualizarRutasSalas();
      // Debug 
      console.log(this.salaDTOList);
    } catch (error: any) {
      console.log("No hay salas que cargar");
    }
    
  }

  private actualizarRutasSalas(): void {
    for (const sala of this.salaDTOList()) {
      sala.rutaImagen = this.urlImages + sala.rutaImagen;
    }
  }

  crearSala(): void {
    this.router.navigateByUrl('/sala/form');
  }

  editarSala(id: string): void {
    this.router.navigateByUrl('/sala/form/' + id);
  }

}
