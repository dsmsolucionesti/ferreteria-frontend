import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';

import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { SpinnerComponent } from '../../../../../../shared/components/spinner/pages/spinner.component';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss'],
  imports: [
    Button,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TableModule,
    ToastModule,
    TooltipModule,
    CardModule,
    TextareaModule,
  ],
  providers: [ConfirmationService, MessageService],
  standalone: true,
})
export class CategoriaListComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  modo: 'crear' | 'editar' = 'crear';
  idSeleccionado: number | null = null;
  categorias: Categoria[] = [];
  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: [''],
  });

  mensaje: string = '';
  loading: boolean = true;
  shorFormulario: boolean = false;

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.loading = true;
    this.categoriaService.findAll().subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.categorias = res.datos || [];
          this.loading = false;
          return;
        }

        if (res.idEstado === 1) {
          this.loading = false;
        }
      },
      error: (err: any) => {
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

      const categoria = this.categorias.find((c) => c.id === id);

      if (categoria) {
        this.form.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
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
    this.categoriaService
      .post(this.form.value as Partial<Categoria>)
      .subscribe({
        next: (res) => {
          if (res.idEstado === 0) {
            this.form.reset();
            this.shorFormulario = false;
            this.cargarCategorias();
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
    this.categoriaService
      .patch(id, this.form.value as Partial<Categoria>)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.idEstado === 0) {
            this.form.reset();
            this.shorFormulario = false;
            this.cargarCategorias();
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
        this.categoriaService.delete(id).subscribe({
          next: (res) => {
            if (res.idEstado === 0) {
              this.loading = false;
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmado',
                detail: 'Registro eliminado correctamente',
              });
              this.cargarCategorias();
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
