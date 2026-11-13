import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { UsuarioConsultaDTO } from '../../models/usuario-consulta.dto';
import { UsuarioService } from '../../services/usuario-service';
import { firstValueFrom } from 'rxjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../../shared/components/dialogs/message-dialog/message-dialog';
@Component({
  selector: 'app-usuario-list',
  imports: [MatTableModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss',
})
export class UsuarioList implements OnInit {

  private readonly usuarioService = inject(UsuarioService);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  usuarioConsultaDTOList: WritableSignal<UsuarioConsultaDTO[]> = signal([]);
  columnsToDisplay = ['nombre', 'primerApellido', 'segundoApellido', 'correoCorporativo', 'activo', 'button'];

  async ngOnInit() {
    this.cargarListaUsuarios();
  }

  private async cargarListaUsuarios() {
    const usuarios = await firstValueFrom(this.usuarioService.findAll());
    this.usuarioConsultaDTOList.set(usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre))); 
  }

  async toggleActivo(usuario: UsuarioConsultaDTO) {
    let message = "";
    if (usuario.activo) {
      message = "¡Usuario desactivado correctamente!";
    } else {
      message = "¡Usuario activado correctamente!";
    }

    try {
      await firstValueFrom(this.usuarioService.toggleActivo(usuario.id));
      this.abrirDialogoMensaje(message);   
    } catch (error) {
      // Debug
      console.log(error);
      this.abrirDialogoMensaje("Ha ocurrido un error al cambiar el estado del usuario.");   
    }
  }

  async toggleAdmin(usuario: UsuarioConsultaDTO) {
    
    let message = "";
    if (!this.isAdmin(usuario)) {
      message = "¡Usuario promovido a administrador!";
    } else {
      message = "¡Usuario rebajado a empleado!";
    }

    try {
      await firstValueFrom(this.usuarioService.toggleAdmin(usuario.id));
      this.abrirDialogoMensaje(message);   
    } catch (error) {
      // Debug
      console.log(error);
      this.abrirDialogoMensaje("Ha ocurrido un error al cambiar el estado del usuario.");   
    }
  }

  isAdmin(usuario: UsuarioConsultaDTO): boolean {
    if (usuario.roles != null) {
      for (const rol of usuario.roles) {
        if (rol.nombre === "Administrador") {

          return true;
        }
      }
    }
    return false;
  }

  abrirDialogoMensaje(message: string): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      this.cargarListaUsuarios();
    });
  }
}
