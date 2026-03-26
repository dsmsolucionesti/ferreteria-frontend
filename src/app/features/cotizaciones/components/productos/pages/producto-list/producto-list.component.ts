import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';

import { Categoria } from '../../../categorias/models/categoria.model';
import { CategoriaService } from '../../../categorias/services/categoria.service';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { SpinnerComponent } from '../../../../../../shared/components/spinner/pages/spinner.component';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
  imports: [
    Button,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TableModule,
    TextareaModule,
    ToastModule,
    TooltipModule,
    InputNumber,
    SelectModule,
  ],
  providers: [ConfirmationService, MessageService],
  standalone: true,
})
export class ProductoListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  modo: 'crear' | 'editar' = 'crear';
  idSeleccionado: number | null = null;

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
  shorFormulario: boolean = false;

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.categoriaService.findAll().subscribe((res) => {
      if (res.idEstado === 0) {
        this.categorias = res.datos || [];
      }
    });
  }

  cargarProductos() {
    this.loading = true;
    this.productoService.findAll().subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.productos = res.datos || [];
          this.loading = false;
          return;
        }

        if (res.idEstado === 1) {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  showFormulario(id?: number) {
    this.shorFormulario = true;
    if (id) {
      this.modo = 'editar';
      this.idSeleccionado = id;

      const producto = this.productos.find((p) => p.id === id);
      console.log(producto);
      if (producto) {
        this.form.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock_actual: producto.stock_actual,
          categoria: producto.categoria?.id || 0,
        });
      }
    } else {
      this.modo = 'crear';
      this.idSeleccionado = null;
      this.form.reset();
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.modo === 'crear') {
      this.crear();
    } else if (this.modo === 'editar' && this.idSeleccionado) {
      this.editar(this.idSeleccionado);
    }
  }

  crear() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      precio: this.form.value.precio,
      stock_actual: this.form.value.stock_actual,
      id_categoria: this.form.value.categoria,
    };

    this.productoService.post(payload as Partial<Categoria>).subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.form.reset();
          this.shorFormulario = false;
          this.cargarProductos();
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: 'Registro creado correctamente',
          });
        } else {
          this.loading = false;
          this.shorFormulario = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el registro',
          });
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.shorFormulario = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el registro',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  editar(id: number) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      precio: this.form.value.precio,
      stock_actual: this.form.value.stock_actual,
      id_categoria: this.form.value.categoria,
    };
    this.productoService
      .patch(id, payload as Partial<Categoria>)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.idEstado === 0) {
            this.form.reset();
            this.cargarProductos();
            this.shorFormulario = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmado',
              detail: 'Registro editado correctamente',
            });
          } else {
            this.loading = false;
            this.shorFormulario = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al editar el registro',
            });
          }
        },
        error: (err: any) => {
          console.log(err);
          this.loading = false;
          this.shorFormulario = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al editar el registro',
          });
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  eliminar(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Desea eliminar el registro?',
      header: 'Atención',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        this.loading = true;
        this.productoService.delete(id).subscribe({
          next: (res) => {
            if (res.idEstado === 0) {
              this.loading = false;
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmado',
                detail: 'Registro eliminado correctamente',
              });
              this.cargarProductos();
            } else {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el registro',
              });
            }
          },
          error: (err: any) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el registro',
            });
          },
          complete: () => {
            this.loading = false;
          },
        });
      },
      reject: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Operación cancelada',
        });
      },
    });
  }

  onClose() {
    this.form.reset();
    this.modo = 'crear';
    this.idSeleccionado = null;
  }
}
