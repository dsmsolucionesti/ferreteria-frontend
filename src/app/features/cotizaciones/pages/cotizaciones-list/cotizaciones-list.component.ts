import { Component, inject, OnInit } from '@angular/core';

import { CotizacionesService } from '../../services/cotizaciones.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Cotizaciones } from '../../models/cotizaciones.model';

@Component({
  selector: 'app-cotizaciones-list',
  templateUrl: './cotizaciones-list.component.html',
  styleUrls: ['./cotizaciones-list.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class CotizacionesListComponent implements OnInit {
  private categoriaService = inject(CotizacionesService);
  private fb = inject(FormBuilder);

  categorias: Cotizaciones[] = [];
  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  mensaje: string = '';
  loading: boolean = false;
  loadingMessage: string = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.loading = true;
    this.loadingMessage = 'Cargando cotizaciones';
    this.categoriaService.getAll().subscribe((res) => {
      if (res.idEstado === 0) {
        this.categorias = res.datos || [];
        this.loading = false;
        this.loadingMessage = '';
        return;
      }

      if (res.idEstado === 1) {
        this.loading = false;
        this.loadingMessage = 'Error al cargar las cotizaciones';
      }
    });
  }

  guardarCategoria() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.categoriaService
      .create(this.form.value as Partial<Cotizaciones>)
      .subscribe((res) => {
        if (res.idEstado === 0) {
          this.mensaje = 'Cotización creada correctamente';
          this.form.reset();
          this.cargarCategorias();
        }

        if (res.idEstado === 1) {
          this.mensaje = 'Error al crear la cotización';
        }
      });
  }
}
