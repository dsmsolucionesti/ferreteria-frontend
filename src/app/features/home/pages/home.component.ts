import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { CategoriaService } from '../../cotizaciones/components/categorias/services/categoria.service';
import { ProductoService } from '../../cotizaciones/components/productos/services/producto.service';
import { SpinnerComponent } from '../../../shared/components/spinner/pages/spinner.component';
import { CotizacionesService } from '../../cotizaciones/services/cotizaciones.service';
import { EstadoCotizacionName } from '../../cotizaciones/cotizaciones.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartModule, TagModule, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  options: any;
  categorias: any = [];
  productos: any = [];
  cotizaciones: any = [];
  estadoCotizaciones: any = [];
  cantidadCotizaciones: number = 0;

  categoriasChart: any;
  productosChart: any;

  loading: boolean = false;

  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  private cotizacionesSerivice = inject(CotizacionesService);

  ngOnInit() {
    this.loading = true;
    forkJoin({
      categorias: this.categoriaService.findAll(),
      productos: this.productoService.findAll(),
      cotizaciones: this.cotizacionesSerivice.findAll(),
    }).subscribe({
      next: ({ categorias, productos, cotizaciones }) => {
        this.categorias = categorias.datos;
        this.productos = productos.datos;
        this.cotizaciones = cotizaciones.datos;

        this.estadoCotizaciones = this.mapearEstados();
        this.cantidadCotizaciones = this.estadoCotizaciones.reduce((acc: number, estado: any) => acc + estado.cantidad, 0);

        this.buildCharts();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  buildCharts() {
    this.categoriasChart = {
      labels: this.categorias.map((c: any) => c.nombre),
      datasets: [
        {
          label: 'Categorías',
          data: this.categorias.map(() => 1),
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#EF5350',
            '#AB47BC',
            '#26C6DA',
          ],
          borderColor: [
            '#1E88E5',
            '#43A047',
            '#FB8C00',
            '#E53935',
            '#8E24AA',
            '#00ACC1',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.productosChart = {
      labels: this.productos.map((p: any) => p.nombre),
      datasets: [
        {
          label: 'Stock',
          data: this.productos.map((p: any) => p.stock_actual),
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#EF5350',
            '#AB47BC',
            '#26C6DA',
          ],
          borderColor: [
            '#1E88E5',
            '#43A047',
            '#FB8C00',
            '#E53935',
            '#8E24AA',
            '#00ACC1',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      aspectRatio: 1,
      maintainAspectRatio: false,
    };
  }

  mapearEstados() {
    const estadosBase = {
      Pendiente: { cantidad: 0, severity: 'secondary' },
      Enviada: { cantidad: 0, severity: 'info' },
      Aceptada: { cantidad: 0, severity: 'success' },
      Rechazada: { cantidad: 0, severity: 'danger' },
      Vencida: { cantidad: 0, severity: 'warn' },
      Cancelada: { cantidad: 0, severity: 'contrast' },
    };

    const estadosMap = {
      [EstadoCotizacionName.PENDIENTE]: 'Pendiente',
      [EstadoCotizacionName.ENVIADA]: 'Enviada',
      [EstadoCotizacionName.ACEPTADA]: 'Aceptada',
      [EstadoCotizacionName.RECHAZADA]: 'Rechazada',
      [EstadoCotizacionName.VENCIDA]: 'Vencida',
      [EstadoCotizacionName.CANCELADA]: 'Cancelada',
    };

    const resumen = this.cotizaciones.reduce(
      (acc: any, cotizacion: any) => {
        const estado =
          estadosMap[
            cotizacion.estadoCotizacion.nombre as keyof typeof estadosMap
          ];

        if (!estado) return acc;

        acc[estado].cantidad++;

        return acc;
      },
      { ...estadosBase },
    );
    const resultado = Object.keys(resumen).map((key) => ({
      nombre: key + 's',
      cantidad: resumen[key].cantidad,
      severity: resumen[key].severity,
    }));

    return resultado;
  }
}
