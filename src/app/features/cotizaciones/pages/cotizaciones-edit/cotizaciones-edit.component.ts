import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
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
import { ClpPipe } from '../../../../shared/pipes/moneda.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { EstadoCotizacion } from '../../cotizaciones.enum';

@Component({
  selector: 'app-cotizaciones-edit',
  templateUrl: 'cotizaciones-edit.component.html',
  imports: [
    Button,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
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
    InputTextModule,
  ],
  providers: [ConfirmationService, MessageService, ClpPipe],
  standalone: true,
})
export class CotizacionesEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cotizacionService = inject(CotizacionesService);
  private confirmationService = inject(ConfirmationService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  EstadoCotizacion = EstadoCotizacion;
  idCotizacion: number = 0;
  idEstadoCotizacion: number = 0;
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  cotizacion: any;
  cotizacionDetalle: any[] = [];
  loading: boolean = false;
  shorFormulario: boolean = false;
  habilitarDetalle: boolean = false;
  selectProducto: boolean = false;
  showTableProductos: boolean = false;

  total: number = 0;
  iva: number = 0.19;
  totalConIva: number = 0;

  form = this.fb.group({
    clientes: [{ value: [], disabled: true }, Validators.required],
    usuario: [{ value: '', disabled: true }, [Validators.required]],
  });

  formDetalle = this.fb.group({
    productos: [[], Validators.required],
    cantidad: [null, [Validators.required, Validators.min(1)]],
    valorUnitario: [{ value: 0, disabled: true }, Validators.required],
    subtotal: [{ value: 0, disabled: true }, Validators.required],
  });

  ngOnInit(): void {
    this.loading = true;
    this.idCotizacion = Number(this.route.snapshot.params['id']);

    forkJoin({
      clientes: this.clienteService.findAll(),
      productos: this.productoService.findAll(),
      cotizaciones: this.cotizacionService.findById(this.idCotizacion),
    }).subscribe({
      next: ({ clientes, productos, cotizaciones }) => {
        this.clientes = clientes.datos || [];
        this.productos = productos.datos || [];
        this.cotizacion = cotizaciones.datos;
        this.idEstadoCotizacion = this.cotizacion.estado.id;
        this.cotizacionDetalle = [...(this.cotizacion?.detalles || [])];
        this.cargarCotizacion();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  cargarCotizacion() {
    this.form.patchValue({
      clientes: this.cotizacion.cliente.id,
      usuario: this.cotizacion.usuario?.nombre,
    });

    this.calcularTotales();

    this.habilitarDetalle = true;
    this.showTableProductos = true;
    this.loading = false;
  }

  puedeActualizarCotizacion(): boolean {
    return this.idEstadoCotizacion === EstadoCotizacion.PENDIENTE;
  }

  puedeEnviarCotizacion(): boolean {
    return this.idEstadoCotizacion === EstadoCotizacion.PENDIENTE;
  }

  puedeCancelarCotizacion(): boolean {
    return this.idEstadoCotizacion === EstadoCotizacion.PENDIENTE;
  }

  puedeAceptarCotizacion(): boolean {
    return this.idEstadoCotizacion === EstadoCotizacion.ENVIADA;
  }

  puedeRechazarCotizacion(): boolean {
    return this.idEstadoCotizacion === EstadoCotizacion.ENVIADA;
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
      (d: any) => d.id_producto === productoId,
    );

    if (index !== -1) {
      this.cotizacionDetalle[index].cantidad += cantidad;

      this.cotizacionDetalle[index].subtotal =
        this.cotizacionDetalle[index].cantidad *
        this.cotizacionDetalle[index].precioUnitario;
    } else {
      const detalle: any = {
        id_producto: productoId,
        nombre_producto: nombre || '',
        cantidad: cantidad,
        precio: precio,
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

    this.calcularTotales();

    this.showTableProductos = true;
  }

  calcularTotales() {
    this.total = this.cotizacionDetalle.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );
    this.iva = Number(this.total) * 0.19;

    this.totalConIva = Number(this.total) + this.iva;
  }

  actualizarCotizacion() {
    this.confirmationService.confirm({
      message: '¿Desea actualizar esta cotización?',
      header: 'Atención',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Actualizar',
        severity: 'success',
      },

      accept: () => {
        this.loading = true;
        const payloadCotizacion = {
          idCliente: this.form.get('clientes')?.value,
          idUsuario: this.authService.getUsuarioDesdeToken()?.id || 0,
          cotizacionDetalle: this.cotizacionDetalle,
        };

        this.cotizacionService
          .patch(this.idCotizacion, payloadCotizacion)
          .subscribe({
            next: (res: any) => {
              if (res.idEstado === 0) {
                this.router.navigate(['/cotizaciones']);
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

  actualizarEstado(estado: EstadoCotizacion) {
    this.confirmationService.confirm({
      message: '¿Desea actualizar el estado de la cotización?',
      header: 'Atención',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Aceptar',
        severity: 'success',
      },

      accept: () => {
        this.loading = true;

        const payload = {
          nuevo_estado: estado,
          ...this.cotizacion,
        };

        this.cotizacionService
          .updateEstado(this.idCotizacion, payload)
          .subscribe({
            next: (res: any) => {
              if (res.idEstado === 0) {
                this.router.navigate(['/cotizaciones']);
              } else {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al actualizar el estado de la cotización',
                });
              }
            },
            error: (err) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al actualizar el estado de la cotización',
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
