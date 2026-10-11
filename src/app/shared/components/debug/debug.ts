import { Component, inject, OnInit } from '@angular/core';
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
  rolDTOList: RolDTO[] = [];
  usuarioDTOList: UsuarioDTO[] = [];
  salaDTOList: SalaDTO[] = [];
  puestoDTOList: PuestoDTO[] = [];
  reservaDTOList: ReservaDTO[] = [];

  async ngOnInit(): Promise<void> {

    // Cargar los valores en la aplicación
    this.rolDTOList = await firstValueFrom(this.rolService.findAll());
    this.usuarioDTOList = await firstValueFrom(this.usuarioService.findAll());
    this.salaDTOList = await firstValueFrom(this.salaService.findAll());
    this.puestoDTOList = await firstValueFrom(this.puestoService.findAll());
    this.reservaDTOList = await firstValueFrom(this.reservaService.findAll());

  }


}
