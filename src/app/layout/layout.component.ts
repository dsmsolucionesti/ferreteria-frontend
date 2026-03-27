import { Component, inject, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Button } from 'primeng/button';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    PanelMenuModule,
    ToastModule,
    ConfirmDialogModule,
    Button,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  items: MenuItem[] = [];
  usuario: any;

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!) || 'Usuario';

    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/home']),
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
          }
        ],
      },
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
