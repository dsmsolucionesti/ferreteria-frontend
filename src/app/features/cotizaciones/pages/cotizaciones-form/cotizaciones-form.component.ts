import { Component, inject, OnInit } from '@angular/core';

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
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared/components/spinner/pages/spinner.component';
import { ClienteService } from '../../../mantenedores/components/clientes/services/cliente.service';
import { Cliente } from '../../../mantenedores/components/clientes/models/clientes.model';
import { CotizacionesService } from '../../services/cotizaciones.service';
import { ProductoService } from '../../components/productos/services/producto.service';
import { Producto } from '../../components/productos/models/producto.model';
import { DetalleCotizacion } from '../../models/detalle-cotizacion.model';
import { ClpPipe } from '../../../../shared/pipes/moneda.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cotizaciones-form',
  templateUrl: 'cotizaciones-form.component.html',
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
    SelectModule,
    ClpPipe,
    InputNumberModule,
    RouterLink,
  ],
  providers: [ConfirmationService, MessageService, ClpPipe],
  standalone: true,
})
export class CotizacionesFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cotizacionService = inject(CotizacionesService);
  private confirmationService = inject(ConfirmationService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  clientes: Cliente[] = [];
  productos: Producto[] = [];
  cotizacionDetalle: DetalleCotizacion[] = [];
  loading: boolean = false;
  shorFormulario: boolean = false;
  habilitarDetalle: boolean = false;
  selectProducto: boolean = false;
  showTableProductos: boolean = false;

  form = this.fb.group({
    clientes: [[], Validators.required],
  });

  formDetalle = this.fb.group({
    productos: [[], Validators.required],
    cantidad: [null, [Validators.required, Validators.min(1)]],
    valorUnitario: [{ value: 0, disabled: true }, Validators.required],
    subtotal: [{ value: 0, disabled: true }, Validators.required],
  });

  ngOnInit(): void {
    this.loading = true;
    this.clienteService.findAll().subscribe({
      next: (response) => {
        this.clientes = response.datos || [];
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  siguiente() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.productoService.findAll().subscribe({
      next: (res) => {
        this.productos = res.datos || [];
        this.loading = false;
        this.habilitarDetalle = true;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  onProductoChange(event: any) {
    this.formDetalle.patchValue({
      productos: null,
      cantidad: null,
      valorUnitario: 0,
      subtotal: 0,
    });

    this.productos.map((producto) => {
      if (producto.id === event.value) {
        this.formDetalle.patchValue({
          productos: event.value,
          valorUnitario: producto.precio,
        });
      }
    });

    this.selectProducto = true;
  }

  onCantidadChange(event: any) {
    const cantidad = event.value;
    const precio = Number(this.formDetalle.get('valorUnitario')?.value) || 0;
    const subtotal = cantidad * precio;

    this.formDetalle.patchValue({
      subtotal: subtotal,
    });
  }

  agregarProductos() {
    if (this.formDetalle.invalid) {
      this.formDetalle.markAllAsTouched();
      return;
    }

    const productoId = Number(this.formDetalle.get('productos')?.value);
    const producto = this.productos.find((p) => p.id === productoId);
    const nombre = producto?.nombre;

    const cantidad = Number(this.formDetalle.get('cantidad')?.value) || 0;
    const precio = Number(this.formDetalle.get('valorUnitario')?.value) || 0;

    const index = this.cotizacionDetalle.findIndex(
      (d) => d.idProducto.id === productoId,
    );

    if (index !== -1) {
      this.cotizacionDetalle[index].cantidad += cantidad;

      this.cotizacionDetalle[index].subtotal =
        this.cotizacionDetalle[index].cantidad *
        this.cotizacionDetalle[index].precioUnitario;
    } else {
      const detalle: DetalleCotizacion = {
        idCotizacion: 0,
        idProducto: {
          id: productoId,
          nombre: nombre || '',
        } as Producto,
        cantidad: cantidad,
        precioUnitario: precio,
        subtotal: cantidad * precio,
      };

      this.cotizacionDetalle.push(detalle);
    }
    this.selectProducto = false;
    this.formDetalle.reset({
      productos: null,
      cantidad: null,
      valorUnitario: 0,
      subtotal: 0,
    });

    this.showTableProductos = true;
  }

  enviarCotizacion() {
    this.confirmationService.confirm({
      message: '¿Desea generar la cotización?',
      header: 'Atención',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Enviar',
        severity: 'success',
      },

      accept: () => {
        this.loading = true;
        const payloadCotizacion = {
          idCliente: this.form.get('clientes')?.value,
          isUsuario: this.authService.getUsuarioDesdeToken()?.id || 0,
          cotizacionDetalle: this.cotizacionDetalle,
        };

        this.cotizacionService.post(payloadCotizacion).subscribe({
          next: (res) => {
            if (res.idEstado === 0) {
              this.router.navigate(['/cotizaciones'], {
                state: {
                  mensaje: {
                    severity: 'success',
                    summary: 'Confirmado',
                    detail: 'Cotización generada correctamente',
                  },
                },
              });
            } else {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al generar la cotización',
              });
            }
          },
          error: (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al generar la cotización',
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
}
