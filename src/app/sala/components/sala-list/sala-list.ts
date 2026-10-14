import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SalaDTO } from '../../models/sala.dto';
import { SalaService } from '../../services/sala-service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sala-list',
  imports: [],
  templateUrl: './sala-list.html',
  styleUrl: './sala-list.scss',
})
export class SalaList implements OnInit {

  // Inyección de servicios
  private readonly salaService = inject(SalaService);

  salaDTOList: WritableSignal<SalaDTO[]> = signal([]);


  ngOnInit(): void {
    this.cargarSalas();
  }

  private async cargarSalas(): Promise<void> {

    try {
      this.salaDTOList.set(await firstValueFrom(this.salaService.findAll()));
      // Debug 
      console.log(this.salaDTOList);
    } catch (error: any) {
      console.log(error);
    }
    
  }





}
