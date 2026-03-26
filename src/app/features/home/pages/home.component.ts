import { Component, inject, OnInit } from '@angular/core';

import { ChartModule } from 'primeng/chart';
import { CategoriaService } from '../../cotizaciones/components/categorias/services/categoria.service';
import { ProductoService } from '../../cotizaciones/components/productos/services/producto.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  options: any;
  categorias: any = [];
  productos: any = [];

  categoriasChart: any;
  productosChart: any;

  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);

  ngOnInit() {
    this.categoriaService.findAll().subscribe({
      next: (response) => {
        this.categorias = response.datos;
        this.buildCategoriasChart();
      },
    });

    this.productoService.findAll().subscribe({
      next: (response) => {
        this.productos = response.datos;
        this.buildProductosChart();
      },
    });
  }

  buildCategoriasChart() {
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

    this.options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    };
  }

  buildProductosChart() {
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
    };
  }
}
