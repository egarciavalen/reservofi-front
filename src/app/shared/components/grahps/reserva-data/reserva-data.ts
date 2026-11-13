import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ReservaService } from '../../../../reserva/services/reserva-service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-reserva-data',
  imports: [BaseChartDirective],
  templateUrl: './reserva-data.html',
  styleUrl: './reserva-data.scss',
})
export class ReservaData implements OnInit {

  // Inyección de servicios
  private readonly reservaService = inject(ReservaService);

  // Propiedades del gráfico
  type!: ChartType;
  chartData!: ChartData;
  chartOptions!: ChartOptions;

  // Información a mostrar
  numeroReservas: number = 0;

  // Para indicarle a defer si la información ha sido procesada
  graficoActualizado:WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    // Obtener la información asociada al gráfico
    this.reservaService.findAll().subscribe((reservas) => {
      if (reservas != null) {
        this.numeroReservas = reservas.length;
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
      labels: ['Reservas'],
      datasets: [
        {
          label: 'Reservas de la oficina',
          data: [this.numeroReservas],
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
          text: 'Número de reservas',
        },
      },
    };
  }

 
}
