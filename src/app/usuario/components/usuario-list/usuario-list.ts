import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { UsuarioConsultaDTO } from '../../models/usuario-consulta.dto';
import { UsuarioService } from '../../services/usuario-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-usuario-list',
  imports: [MatTableModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss',
})
export class UsuarioList implements OnInit {

  private readonly usuarioService = inject(UsuarioService);

  usuarioConsultaDTOList: WritableSignal<UsuarioConsultaDTO[]> = signal([]);
  columnsToDisplay = ['nombre', 'primerApellido', 'segundoApellido', 'correoCorporativo'];

  async ngOnInit() {
    this.usuarioConsultaDTOList.set(await firstValueFrom(this.usuarioService.findAll())); 
  }

}
