import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class UsuariosComponent implements OnInit {
  ngOnInit(): void {}
}
