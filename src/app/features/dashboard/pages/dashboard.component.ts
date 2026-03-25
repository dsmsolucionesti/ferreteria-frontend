import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
   menu = [
    { label: 'Cotizaciones', icon: 'speedometer2', route: '/cotizaciones' },
    { label: 'Nota de venta', icon: 'table', route: '/nota-venta' },
    { label: 'Pagos', icon: 'grid', route: '/pagos' },
    { label: 'Productos', icon: 'grid', route: '/productos' },
    { label: 'Categorías', icon: 'grid', route: '/categorias' },
    { label: 'Mantenedores', icon: 'people-circle', route: '/mantenedores' }
  ];
}
