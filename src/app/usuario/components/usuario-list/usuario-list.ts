import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { UsuarioConsultaDTO } from '../../models/usuario-consulta.dto';
import { UsuarioService } from '../../services/usuario-service';
import { firstValueFrom } from 'rxjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import { UsuarioGuardadoDTO } from '../../models/usuario-guardado.dto';

@Component({
  selector: 'app-usuario-list',
  imports: [MatTableModule, MatCheckboxModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss',
})
export class UsuarioList implements OnInit {

  private readonly usuarioService = inject(UsuarioService);

  usuarioConsultaDTOList: WritableSignal<UsuarioConsultaDTO[]> = signal([]);
  columnsToDisplay = ['nombre', 'primerApellido', 'segundoApellido', 'correoCorporativo', 'activo'];

  async ngOnInit() {
    this.cargarListaUsuarios();
  }

  private async cargarListaUsuarios() {
    this.usuarioConsultaDTOList.set(await firstValueFrom(this.usuarioService.findAll())); 
  }

  update(idUsuario: string) {
    this.usuarioService.toggleActivo(idUsuario);
    this.cargarListaUsuarios();
  }

}
