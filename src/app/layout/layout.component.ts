import { Component, inject, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, PanelMenuModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);

  items: MenuItem[] = [];

  ngOnInit() {
    let v;

    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/']),
      },
      {
        label: 'Cotizaciones',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Cotizaciones',
            icon: 'pi pi-file',
            routerLink: '/cotizaciones',
          },
          {
            label: 'Productos',
            icon: 'pi pi-barcode',
            routerLink: '/productos',
          },
          {
            label: 'Categorías',
            icon: 'pi pi-list',
            routerLink: '/categorias',
          },
        ],
      },
      {
        label: 'Nota de venta',
        icon: 'pi pi-shopping-cart',
        routerLink: '/nota-venta',
      },
      {
        label: 'Pagos',
        icon: 'pi pi-credit-card',
        routerLink: '/pagos',
      },
      {
        label: 'Mantenedores',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Clientes',
            icon: 'pi pi-users',
            routerLink: '/mantenedores/clientes',
          },
          {
            label: 'Usuarios',
            icon: 'pi pi-user',
            routerLink: '/mantenedores/usuarios',
          },
          {
            label: 'Ver todos',
            icon: 'pi pi-angle-double-down',
            routerLink: '/mantenedores',
          },
        ],
      },
    ];
  }

  // menu: MenuItem[] = [];
}
