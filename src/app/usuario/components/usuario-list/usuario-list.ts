import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { UsuarioConsultaDTO } from '../../models/usuario-consulta.dto';
import { UsuarioService } from '../../services/usuario-service';
import { firstValueFrom } from 'rxjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { UsuarioRolConsultaDTO } from '../../models/usuario-rol-consulta.dto';
@Component({
  selector: 'app-usuario-list',
  imports: [MatTableModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss',
})
export class UsuarioList implements OnInit {

  private readonly usuarioService = inject(UsuarioService);

  usuarioConsultaDTOList: WritableSignal<UsuarioConsultaDTO[]> = signal([]);
  columnsToDisplay = ['nombre', 'primerApellido', 'segundoApellido', 'correoCorporativo', 'activo', 'button'];

  async ngOnInit() {
    this.cargarListaUsuarios();
  }

  private async cargarListaUsuarios() {
    this.usuarioConsultaDTOList.set(await firstValueFrom(this.usuarioService.findAll())); 
  }

  async toggleActivo(idUsuario: string) {
    await firstValueFrom(this.usuarioService.toggleActivo(idUsuario));
    this.cargarListaUsuarios();
  }

  async toggleAdmin(idUsuario: string) {
    await firstValueFrom(this.usuarioService.toggleAdmin(idUsuario));
    this.cargarListaUsuarios();
  }

  isAdmin(usuario: UsuarioConsultaDTO): boolean {
    for (const rol of usuario.roles) {
      if (rol.nombre === "Administrador") {
        return true;
      }
    }
    return false;
  }
}
