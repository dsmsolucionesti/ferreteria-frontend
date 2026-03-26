import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

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
import { InputNumber } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared/components/spinner/pages/spinner.component';
import { ClienteService } from '../../../mantenedores/components/clientes/services/cliente.service';
import { Cliente } from '../../../mantenedores/components/clientes/models/clientes.model';
import { CotizacionesService } from '../../services/cotizaciones.service';
import { Cotizaciones } from '../../models/cotizaciones.model';
import { ProductoService } from '../../components/productos/services/producto.service';
import { Producto } from '../../components/productos/models/producto.model';
import { DetalleCotizacion } from '../../models/detalle-cotizacion.model';

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
    InputNumber,
    SelectModule,
  ],
  providers: [ConfirmationService, MessageService],
  standalone: true,
})
export class CotizacionesFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cotizacionService = inject(CotizacionesService);
  private confirmationService = inject(ConfirmationService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private messageService = inject(MessageService);

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
    usuario: [1, Validators.required],
  });

  formDetalle = this.fb.group({
    productos: [[], Validators.required],
    cantidad: [0, Validators.required],
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

    this.productoService.findAll().subscribe({
      next: (res) => {
        this.productos = res.datos || [];
        this.habilitarDetalle = true;
      },
      error: (error) => {
        console.log(error);
      },
    });

    /*  const payload = {
      id_cliente: this.form.value.clientes,
      id_usuario: this.form.value.usuario,
    };

    this.cotizacionService
      .post(payload as Partial<Cotizaciones>)
      .subscribe({
        next: (res) => {
          if (res.idEstado === 0) {
            this.form.reset();
            this.shorFormulario = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmado',
              detail: 'Cotización guardada',
            });
            this.habilitarDetalle = true;

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
      }); */
  }

  onProductoChange(event: any) {
    this.formDetalle.patchValue({
      productos: null,
      cantidad: 0,
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

  onCantidadChange(event: Event) {
    const cantidad = Number((event?.target as HTMLInputElement)?.value) || 0;
    const precio = this.formDetalle.get('valorUnitario')?.value || 0;

    const subtotal = cantidad * precio;

    this.formDetalle.patchValue({
      subtotal: subtotal,
    });
  }

  agregarProductos() {
    const productoId = Number(this.formDetalle.get('productos')?.value);
    const producto = this.productos.find((p) => p.id === productoId);
    const nombre = producto?.nombre;

    const detalle: DetalleCotizacion = {
      idCotizacion: 0,
      idProducto: {
        id: productoId,
        nombre: nombre || '',
      } as Producto,
      cantidad: Number(this.formDetalle.get('cantidad')?.value) || 0,
      precioUnitario: Number(this.formDetalle.get('valorUnitario')?.value) || 0,
      subtotal: Number(this.formDetalle.get('subtotal')?.value) || 0,
    };

    this.cotizacionDetalle.push(detalle);
    this.selectProducto = false;
    this.formDetalle.reset();
    this.showTableProductos = true;
  }

  enviarCotizacion() {
    const payloadCotizacion = {
      idCliente: this.form.get('clientes')?.value,
      isUsuario: this.form.get('usuario')?.value,
      cotizacionDetalle: this.cotizacionDetalle,
    };

    this.cotizacionService.post(payloadCotizacion).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
