import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../models/Charts';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  @ViewChild('chartBar') chartbar!: ChartComponent;
  @ViewChild('chartmultiline') chartmultiline!: ChartComponent;
  public chartOptionsMultiline: Partial<ChartOptions>;
  public chartOptionsBar: Partial<ChartOptions>;
  constructor(private reporteService: ReportesService) {
    this.chartOptionsMultiline = {
      series: [], // Se llenará con datos del backend
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#77B6EA', '#545454'], // Puedes agregar más colores según la cantidad de usuarios
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Ventas diarias por usuario',
        align: 'left',
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [], // Se llenará con datos del backend
        title: {
          text: 'Date',
        },
      },
      yaxis: {
        title: {
          text: 'Ventas',
        },
        min: 0, // Puedes ajustar el mínimo según tus datos
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    };
    this.chartOptionsBar = {
      series: [
        {
          name: 'distibuted',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: ['#008FFB'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      title: {
        text: 'Productos mas Vendidos',
        align: 'left',
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: ['#008FFB'],
            fontSize: '12px',
          },
        },
      },
    };
  }
  ngOnInit(): void {
    this.reporteService.getVentasReporte().subscribe((data) => {
      console.log(data);
      this.chartOptionsMultiline.series = data.series;
      this.chartOptionsMultiline.xaxis!.categories = data.fechas;
    });
    this.reporteService.getproductosMasVendidos().subscribe((data) => {
      this.chartOptionsBar.series = [{ name: 'Ventas', data: data.cantidades }];
      this.chartOptionsBar.xaxis!.categories = data.nombres;
    });
  }
}
