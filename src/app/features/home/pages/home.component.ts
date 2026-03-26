import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { ChartModule } from 'primeng/chart';
import { CategoriaService } from '../../cotizaciones/components/categorias/services/categoria.service';
import { Categoria } from '../../cotizaciones/components/categorias/models/categoria.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  data: any;
  options: any;
  categorias: any = [];

  private categoriaService = inject(CategoriaService);

  ngOnInit() {
    this.initChart();
    this.categoriaService.findAll().subscribe({
      next: (response) => {
        this.categorias = response.datos;
        console.log(this.categorias)
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color',
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color',
    );

    this.data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
      datasets: [
        {
          label: 'Ventas',
          data: [15000, 22000, 18000, 25000],
          backgroundColor: [
            'rgba(249, 115, 22, 0.2)',
            'rgba(6, 182, 212, 0.2)',
            'rgb(107, 114, 128, 0.2)',
            'rgba(139, 92, 246, 0.2)',
          ],
          borderColor: [
            'rgb(249, 115, 22)',
            'rgb(6, 182, 212)',
            'rgb(107, 114, 128)',
            'rgb(139, 92, 246)',
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
