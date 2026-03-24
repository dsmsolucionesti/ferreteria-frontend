import { Component, inject, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class CategoriaListComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  categorias: Categoria[] = [];
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
    this.loadingMessage = 'Cargando categorías';
    this.categoriaService.getAll().subscribe((res) => {
      if (res.idEstado === 0) {
        this.categorias = res.datos || [];
        this.loading = false;
        this.loadingMessage = '';
        return;
      }

      if (res.idEstado === 1) {
        this.loading = false;
        this.loadingMessage = 'Error al cargar las categorías';
      }
    });
  }

  guardarCategoria() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.categoriaService
      .create(this.form.value as Partial<Categoria>)
      .subscribe((res) => {
        if (res.idEstado === 0) {
          this.mensaje = 'Categoría creada correctamente';
          this.form.reset();
          this.cargarCategorias();
        }

        if (res.idEstado === 1) {
          this.mensaje = 'Error al crear la categoría';
        }
      });
  }
}
