import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class ClientesComponent implements OnInit {

  ngOnInit(): void {
    
  }

}
