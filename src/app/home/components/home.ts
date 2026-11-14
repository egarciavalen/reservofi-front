import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DataGraph } from '../../shared/components/grahps/data-graph/data-graph';
import { LocalStorageService } from '../../auth/services/local-storage-service';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-home',
  imports: [DataGraph],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  
  private readonly localStorageService = inject(LocalStorageService);
  private readonly usuarioService = inject(UsuarioService);

  // La lógica interna de cada gráfico se gestiona en su propio componente
  administrador: WritableSignal<boolean> = signal(false);

  async ngOnInit(): Promise<void> {
    try {
      this.administrador.set(await firstValueFrom(this.usuarioService.checkAdmin(this.localStorageService.get("idUsuario")!)));
    } catch (error) {
      // DEBUG
     console.log('Ha ocurrido un error interno al buscar si el usuario es un administrador');      
    }
    
  }

}
