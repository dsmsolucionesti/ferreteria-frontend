
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mantenedores',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mantenedores.component.html',
  styleUrls: ['./mantenedores.component.css'],
})
export class MantenedoresComponent {
  items = [
    {
      label: 'Clientes',
      description: 'Gestión de clientes',
      route: '/mantenedores/clientes',
    },
    {
      label: 'Usuarios',
      description: 'Gestión de usuarios',
      route: '/mantenedores/usuarios',
    },
  ];
}
