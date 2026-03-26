import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

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
    DialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TableModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  standalone: true,
})
export class CategoriaListComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  categorias: Categoria[] = [];
  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  mensaje: string = '';
  loading: boolean = true;
  loadingMessage: string = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.loading = true;
    this.loadingMessage = 'Cargando categorías';
    this.categoriaService.findAll().subscribe((res) => {
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
      .post(this.form.value as Partial<Categoria>)
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

  editar(event: Event, id: number) {
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
        // TODO: Implementar lógica para editar categoría
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
        this.categoriaService.delete(id).subscribe((res) => {
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
}
