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
import { InputNumberModule } from 'primeng/inputnumber';

import { Cliente } from '../models/clientes.model';
import { ClienteService } from '../services/cliente.service';
import { SpinnerComponent } from '../../../../../shared/components/spinner/pages/spinner.component';
import { formatearRut, rutValidator } from '../../../../../shared/utils/utils';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
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
    InputNumberModule,
  ],
  standalone: true,
  providers: [ConfirmationService, MessageService],
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  modo: 'crear' | 'editar' = 'crear';
  idSeleccionado: number | null = null;
  clientes: Cliente[] = [];
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    rut: [
      null as string | null,
      [Validators.required, Validators.maxLength(12), rutValidator],
    ],
    telefono: [
      null as number | null,
      [
        Validators.required,
        Validators.min(100000000),
        Validators.max(999999999),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
      ],
    ],
    direccion: ['', [Validators.required]],
  });

  mensaje: string = '';
  loading: boolean = true;
  shorFormulario: boolean = false;

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.loading = true;
    this.clienteService.findAll().subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.clientes = res.datos || [];
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

  onRutInput(event: Event) {
    const valor = (event.target as HTMLInputElement).value;

    const limpio = valor.slice(0, 12);
    const formateado = formatearRut(limpio);

    this.form.patchValue({ rut: formateado }, { emitEvent: false });
  }

  showFormulario(id?: number) {
    this.shorFormulario = true;
    if (id) {
      this.modo = 'editar';
      this.idSeleccionado = id;

      const cliente = this.clientes.find((c) => c.id === id);

      if (cliente) {
        this.form.patchValue({
          nombre: cliente.nombre,
          rut: cliente.rut,
          telefono: cliente.telefono ?? null,
          email: cliente.email || '',
          direccion: cliente.direccion || '',
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
    this.clienteService.post(this.form.value as Partial<Cliente>).subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.form.reset();
          this.shorFormulario = false;
          this.cargarClientes();
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
    this.clienteService
      .patch(id, this.form.value as Partial<Cliente>)
      .subscribe({
        next: (res) => {
          if (res.idEstado === 0) {
            this.form.reset();
            this.shorFormulario = false;
            this.cargarClientes();
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
        this.clienteService.delete(id).subscribe({
          next: (res) => {
            if (res.idEstado === 0) {
              this.loading = false;
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmado',
                detail: 'Registro eliminado correctamente',
              });
              this.cargarClientes();
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
