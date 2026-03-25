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
    {
      label: 'Cotizaciones',
      route: '',
      dropdown: true,
      child: [
        { label: 'Cotizaciones', route: '/cotizaciones' },
        { label: 'Productos', route: '/productos' },
        { label: 'Categorías', route: '/categorias' },
      ],
    },
    { label: 'Nota de venta', route: '/nota-venta', dropdown: false },
    { label: 'Pagos', route: '/pagos', dropdown: false },
    {
      label: 'Mantenedores',
      route: '/mantenedores',
      dropdown: true,
      child: [
        { label: 'Clientes', route: '/mantenedores/clientes' },
        { label: 'Usuarios', route: '/mantenedores/usuarios' },
        { label: 'Ver todos', route: '/mantenedores' },
      ],
    },
  ];
}
