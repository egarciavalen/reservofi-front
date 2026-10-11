import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { RolService } from '../../../rol/services/rol-service';
import { UsuarioService } from '../../../usuario/services/usuario-service';
import { PuestoService } from '../../../puesto/services/puesto-service';
import { SalaService } from '../../../sala/services/sala-service';
import { ReservaService } from '../../../reserva/services/reserva-service';
import { RolDTO } from '../../../rol/models/rol.dto';
import { firstValueFrom } from 'rxjs';
import { UsuarioDTO } from '../../../usuario/models/usuario.dto';
import { SalaDTO } from '../../../sala/models/sala.dto';
import { PuestoDTO } from '../../../puesto/models/puesto.dto';
import { ReservaDTO } from '../../../reserva/models/reserva.dto';

@Component({
  selector: 'app-debug',
  imports: [],
  templateUrl: './debug.html',
  styleUrl: './debug.scss',
})
export class Debug implements OnInit {
  
  // Inyección de servicios
  private readonly rolService = inject(RolService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly salaService = inject(SalaService);
  private readonly puestoService = inject(PuestoService);
  private readonly reservaService = inject(ReservaService);

  // Propiedades
  rolDTOList: WritableSignal<RolDTO[]> =  signal([]);
  usuarioDTOList: WritableSignal<UsuarioDTO[]> = signal([]);
  salaDTOList: WritableSignal<SalaDTO[]> = signal([]);
  puestoDTOList: WritableSignal<PuestoDTO[]> = signal([]);
  reservaDTOList: WritableSignal<ReservaDTO[]> = signal([]);

  async ngOnInit(): Promise<void> {

    // Cargar los valores en la aplicación
    this.rolDTOList.set(await firstValueFrom(this.rolService.findAll()));
    this.usuarioDTOList.set(await firstValueFrom(this.usuarioService.findAll()));
    
    console.log(this.usuarioDTOList());
    this.salaDTOList.set(await firstValueFrom(this.salaService.findAll()));
    this.puestoDTOList.set(await firstValueFrom(this.puestoService.findAll()));
    this.reservaDTOList.set(await firstValueFrom(this.reservaService.findAll()));

  }


}
