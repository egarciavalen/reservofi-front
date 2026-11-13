import { Component, OnInit } from '@angular/core';
import { SalaData } from '../../shared/components/grahps/sala-data/sala-data';
import { PuestoData } from '../../shared/components/grahps/puesto-data/puesto-data';
import { ReservaData } from '../../shared/components/grahps/reserva-data/reserva-data';

@Component({
  selector: 'app-home',
  imports: [SalaData, PuestoData, ReservaData],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  
  // La lógica interna de cada gráfico se gestiona en su propio componente

}
