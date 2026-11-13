import { Component } from '@angular/core';
import { DataGraph } from '../../shared/components/grahps/data-graph/data-graph';

@Component({
  selector: 'app-home',
  imports: [DataGraph],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  
  // La lógica interna de cada gráfico se gestiona en su propio componente

}
