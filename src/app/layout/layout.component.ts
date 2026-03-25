import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, PanelMenuModule, ButtonModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  menu: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/',
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
