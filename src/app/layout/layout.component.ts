import { Component, inject, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    BreadcrumbModule,
    Button,
    ConfirmDialogModule,
    Dialog,
    PanelMenuModule,
    RouterOutlet,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  items: MenuItem[] = [];
  usuario: any;
  mostrarModalSesion: boolean = false;

  breadcrumbItems: MenuItem[] = [];
  home: MenuItem = { label: 'Inicio', routerLink: '/home' } as MenuItem;

  ngOnInit() {
    this.authService.sessionExpired$.subscribe(() => {
      this.mostrarModalSesion = true;
    });

    this.usuario = JSON.parse(localStorage.getItem('usuario')!) || 'Usuario';

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbItems = this.buildBreadcrumb();
      });

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

  buildBreadcrumb(): MenuItem[] {
    let route = this.route.root;
    const breadcrumbs: MenuItem[] = [];
    let url = '';

    while (route.firstChild) {
      route = route.firstChild;
      if (!route.snapshot.url.length) {
        continue;
      }

      const routeURL = route.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      url += `/${routeURL}`;

      const breadcrumbData = route.snapshot.data?.['breadcrumb'];

      if (breadcrumbData) {
        breadcrumbs.push({
          label:
            typeof breadcrumbData === 'string'
              ? breadcrumbData
              : breadcrumbData.label,
          icon:
            typeof breadcrumbData === 'object'
              ? breadcrumbData.icon
              : undefined,
          routerLink: url,
        });
      }
    }

    return breadcrumbs;
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
