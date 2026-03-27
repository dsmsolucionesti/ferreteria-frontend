import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { ChartModule } from 'primeng/chart';
import { CategoriaService } from '../../cotizaciones/components/categorias/services/categoria.service';
import { ProductoService } from '../../cotizaciones/components/productos/services/producto.service';
import { SpinnerComponent } from '../../../shared/components/spinner/pages/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartModule, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  options: any;
  categorias: any = [];
  productos: any = [];

  categoriasChart: any;
  productosChart: any;

  loading: boolean = false;

  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);

  ngOnInit() {
    this.loading = true;
    forkJoin({
      categorias: this.categoriaService.findAll(),
      productos: this.productoService.findAll(),
    }).subscribe({
      next: ({ categorias, productos }) => {
        this.categorias = categorias.datos;
        this.productos = productos.datos;

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
}