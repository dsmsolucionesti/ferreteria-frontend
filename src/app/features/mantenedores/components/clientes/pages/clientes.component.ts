import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class ClientesComponent implements OnInit {

  ngOnInit(): void {
    
  }

}
