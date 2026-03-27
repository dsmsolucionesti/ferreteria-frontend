import { Component, inject, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Button } from 'primeng/button';
import { AuthService } from '../core/services/auth.service';
import { Dialog } from "primeng/dialog";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    PanelMenuModule,
    ToastModule,
    ConfirmDialogModule,
    Button,
    Dialog
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  items: MenuItem[] = [];
  usuario: any;
  mostrarModalSesion: boolean = false;

  ngOnInit() {
    this.authService.sessionExpired$.subscribe(() => {
      this.mostrarModalSesion = true;
    });

    this.usuario = JSON.parse(localStorage.getItem('usuario')!) || 'Usuario';

    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/home']),
      },
      {
        label: 'Cotizaciones',
        icon: 'pi pi-file-check',
        items: [
          {
            label: 'Cotizaciones',
            icon: 'pi pi-file-check',
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
        disabled: true,
        visible: false,
      },
      {
        label: 'Pagos',
        icon: 'pi pi-credit-card',
        routerLink: '/pagos',
        disabled: true,
        visible: false,
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
            icon: 'pi pi-user-edit',
            routerLink: '/mantenedores/usuarios',
          },
        ],
      },
    ];
  }

  irALogin() {
    this.mostrarModalSesion = false;
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
