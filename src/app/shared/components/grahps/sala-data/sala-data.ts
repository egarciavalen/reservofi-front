import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SalaService } from '../../../../sala/services/sala-service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-sala-data',
  imports: [BaseChartDirective],
  templateUrl: './sala-data.html',
  styleUrl: './sala-data.scss',
})
export class SalaData implements OnInit {

  // Inyección de servicios
  private readonly salaService = inject(SalaService);

  // Propiedades del gráfico
  type!: ChartType;
  chartData!: ChartData;
  chartOptions!: ChartOptions;
  
  // Información a mostrar
  numeroSalas: number = 0;

  // Para indicarle a defer si la información ha sido procesada
  graficoActualizado:WritableSignal<boolean> = signal(false);

  ngOnInit(): void {

    // Obtener la información asociada al gráfico
    this.salaService.findAll().subscribe((salas) => {
      if (salas != null) {
        this.numeroSalas = salas.length;
      }
      this.setChartProperties();
      this.graficoActualizado.set(true);
    });
  }

  private setChartProperties(): void {

    // Tipo de gráfico
    this.type = 'bar';

    // Datos del gráfico
    this.chartData = {
      labels: ['Salas'],
      datasets: [
        {
          label: 'Salas de la oficina',
          data: [this.numeroSalas],
          backgroundColor: ['#810081'],
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
          text: 'Número de salas',
        },
      },
    };
  }


}
