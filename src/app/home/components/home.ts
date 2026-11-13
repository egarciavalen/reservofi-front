import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DataGraph } from '../../shared/components/grahps/data-graph/data-graph';
import { LocalStorageService } from '../../auth/services/local-storage-service';

@Component({
  selector: 'app-home',
  imports: [DataGraph],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  
  private readonly localStorageService = inject(LocalStorageService);

  // La lógica interna de cada gráfico se gestiona en su propio componente
  autenticado: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    if (this.localStorageService.get("idUsuario")) {
      this.autenticado.set(true);
    } else {
      this.autenticado.set(false);
    }
    
  }

}
