import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategoriaListComponent } from '../../categorias/pages/categoria-list/categoria-list.component';
import { ProductoListComponent } from '../../productos/pages/producto-list/producto-list.component';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CategoriaListComponent, ProductoListComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
