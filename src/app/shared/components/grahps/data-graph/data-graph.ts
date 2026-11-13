import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ReservaService } from '../../../../reserva/services/reserva-service';
import { PuestoService } from '../../../../puesto/services/puesto-service';
import { SalaService } from '../../../../sala/services/sala-service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { firstValueFrom } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-data-graph',
  imports: [BaseChartDirective],
  templateUrl: './data-graph.html',
  styleUrl: './data-graph.scss',
})
export class DataGraph {

  // Inyección de servicios
  private readonly salaService = inject(SalaService);
  private readonly puestoService = inject(PuestoService);
  private readonly reservaService = inject(ReservaService);

  // Propiedades del gráfico
  type!: ChartType;
  chartData!: ChartData;
  chartOptions!: ChartOptions;

  // Información a mostrar
  numeroSalas: number = 0;
  numeroPuestos: number = 0;
  numeroReservas: number = 0;

  // Para indicarle a defer si la información ha sido procesada
  graficoActualizado:WritableSignal<boolean> = signal(false);

  async ngOnInit() {

    // Salas
    const salaList = await firstValueFrom(this.salaService.findAll());
    if (salaList != null) {
      this.numeroSalas = salaList.length;
    }
    
    // Puestos
    const puestoList = await firstValueFrom(this.puestoService.findAll());
    if (puestoList != null) {
      this.numeroPuestos = puestoList.length;
    }
    
    // Reservas
    const reservaList = await firstValueFrom(this.reservaService.findAll());
    if (reservaList != null) {
      this.numeroReservas = reservaList.length;
    }
    
    // Con todos los datos, se carga el gráfico
    this.setChartProperties();
    // Se muestra el gráfico
    this.graficoActualizado.set(true);
  }

  private setChartProperties(): void {

    // Tipo de gráfico
    this.type = 'bar';

    // Datos del gráfico
    this.chartData = {
      labels: ['Elementos'],
      datasets: [
        {
          label: 'Salas',
          data: [this.numeroSalas],
          backgroundColor: ['#00ff40'],
        },
        {
          label: 'Puestos',
          data: [this.numeroPuestos],
          backgroundColor: ['#1900ff'],
        },
        {
          label: 'Reservas',
          data: [this.numeroReservas],
          backgroundColor: ['#ff0000'],
        },
      ],
    };

    // Opciones adicionales
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Elementos del sistema',
        },
      },
    };
  }

}
