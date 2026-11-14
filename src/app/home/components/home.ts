import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DataGraph } from '../../shared/components/grahps/data-graph/data-graph';
import { LocalStorageService } from '../../auth/services/local-storage-service';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../shared/components/dialogs/message-dialog/message-dialog';

@Component({
  selector: 'app-home',
  imports: [DataGraph],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  
  private readonly localStorageService = inject(LocalStorageService);
  private readonly usuarioService = inject(UsuarioService);

  administrador: WritableSignal<boolean> = signal(false);

  // Inyección de los diálogos para mostrar mensajes al usuario
  readonly dialog = inject(MatDialog);

  async ngOnInit(): Promise<void> {
    try {
      this.administrador.set(await firstValueFrom(this.usuarioService.checkAdmin(this.localStorageService.get("idUsuario")!)));
    } catch (error) {
        if (error instanceof HttpErrorResponse) {
          this.abrirDialogoMensaje(error.error);
      }
    }
  }

  
  abrirDialogoMensaje(message: string): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: message,
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      // No aplican cambios
    });
  }
}
