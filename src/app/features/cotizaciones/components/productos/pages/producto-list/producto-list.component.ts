import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { Categoria } from '../../../categorias/models/categoria.model';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { CategoriaService } from '../../../categorias/services/categoria.service';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { SpinnerComponent } from '../../../../../../shared/components/spinner/pages/spinner.component';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TableModule,
    TooltipModule,
    Button,
  ],
  standalone: true,
})
export class ProductoListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    precio: [0, [Validators.required]],
    stock_actual: [0, [Validators.required]],
    categoria: [0, [Validators.required]],
  });

  mensaje: string = '';
  loading: boolean = false;
  loadingMessage: string = '';

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.loadingMessage = 'Cargando productos';
    this.productoService.getAll().subscribe((res) => {
      console.log({ res });
      if (res.idEstado === 0) {
        this.productos = res.datos || [];
        this.loading = false;
        this.loadingMessage = '';
        return;
      }

      if (res.idEstado === 1) {
        this.loading = false;
        this.loadingMessage = 'Error al cargar los productos';
      }
    });
  }

  cargarCategorias() {
    this.categoriaService.findAll().subscribe((res) => {
      if (res.idEstado === 0) {
        this.categorias = res.datos || [];
      }
    });
  }

  guardarProducto() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = {
      nombre: this.form.value.nombre || '',
      descripcion: this.form.value.descripcion || '',
      precio: Number(this.form.value.precio) || 0,
      stock_actual: Number(this.form.value.stock_actual) || 0,
      id_categoria: Number(this.form.value.categoria),
    };

    this.productoService.create(payload).subscribe((res) => {
      console.log(res);
      if (res.idEstado === 0) {
        this.mensaje = 'Producto creado correctamente';
        this.form.reset();
        this.cargarProductos();
      }

      if (res.idEstado === 1) {
        this.mensaje = 'Error al crear el producto';
      }
    });
  }

  editar(id: number) {
    console.log('Editar producto', id);
  }

  eliminar(id: number) {
    console.log('Eliminar producto', id);
  }
}
