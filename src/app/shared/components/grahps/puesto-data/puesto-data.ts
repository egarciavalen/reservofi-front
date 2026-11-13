import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { PuestoService } from '../../../../puesto/services/puesto-service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-puesto-data',
  imports: [BaseChartDirective],
  templateUrl: './puesto-data.html',
  styleUrl: './puesto-data.scss',
})
export class PuestoData implements OnInit{

  // Inyección de servicios
  private readonly puestoService = inject(PuestoService);

  // Propiedades del gráfico
  type!: ChartType;
  chartData!: ChartData;
  chartOptions!: ChartOptions;

  // Información a mostrar
  numeroPuestos: number = 0;

  // Para indicarle a defer si la información ha sido procesada
  graficoActualizado:WritableSignal<boolean> = signal(false);

  ngOnInit(): void {

    // Obtener la información asociada al gráfico
    this.puestoService.findAll().subscribe((puestos) => {
      if (puestos != null) {
        this.numeroPuestos = puestos.length;
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
      labels: ['Puestos'],
      datasets: [
        {
          label: 'Puestos de la oficina',
          data: [this.numeroPuestos],
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
          text: 'Número de puestos',
        },
      },
    };
  }

}
