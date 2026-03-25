import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mantenedores',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mantenedores.component.html',
  styleUrls: ['./mantenedores.component.css'],
})
export class MantenedoresComponent {
  title = 'Mantenedores';

  items = [
    {
      label: 'Clientes',
      description: 'Gestión de clientes',
      icon: 'pi pi-users',
      route: '/mantenedores/clientes',
    },
    {
      label: 'Usuarios',
      description: 'Gestión de usuarios',
      icon: 'pi pi-user',
      route: '/mantenedores/usuarios',
    },
    {
      label: 'Roles',
      description: 'Gestión de roles',
      icon: 'pi pi-shield',
      route: '/mantenedores/roles',
    },
    {
      label: 'Permisos',
      description: 'Gestión de permisos',
      icon: 'pi pi-key',
      route: '/mantenedores/permisos',
    },
    {
      label: 'Tipos de documento',
      description: 'Gestión de tipos de documento',
      icon: 'pi pi-file',
      route: '/mantenedores/tipos-documento',
    },
    {
      label: 'Tipos de cliente',
      description: 'Gestión de tipos de cliente',
      icon: 'pi pi-user',
      route: '/mantenedores/tipos-cliente',
    }
  ];
}
