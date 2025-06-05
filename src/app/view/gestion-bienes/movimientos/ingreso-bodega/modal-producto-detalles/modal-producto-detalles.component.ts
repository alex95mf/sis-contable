import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { IngresoBodegaService } from '../ingreso-bodega.service';
import { NgxCurrencyInputMode  } from 'ngx-currency';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ProductoDetalle } from './IProductoDetalles';

@Component({
standalone: false,
  selector: 'app-modal-producto-detalles',
  templateUrl: './modal-producto-detalles.component.html',
  styleUrls: ['./modal-producto-detalles.component.scss']
})
export class ModalProductoDetallesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Detalles de Producto';
  mensajeSpinner: string = "Cargando...";
  vmButtons: Array<any>;
  formReadonly: boolean = false

  @Input() documento: any;
  @Input() doc_detalle_producto: any;

  producto: any;
  detalles: Array<ProductoDetalle> = [];

  currencyOptions = {
    prefix: '',
    nullable: true,
    min: 1,
    precision: 0,
    inputMode: NgxCurrencyInputMode .Natural
  }

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: IngresoBodegaService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsModalProdDet",
        paramAccion: "",
        boton: { icon: "fas fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsModalProdDet",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      }
    ]
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
      case "GUARDAR":
        this.guardarDetalles();
        break;
    }
  }

  ngOnInit(): void {
    // console.log('documento', this.documento)
    // console.log('producto', this.doc_detalle_producto)

    setTimeout(() => this.cargaInicial(), 50)

    this.formReadonly = this.documento.estado == 'C'
    this.vmButtons[0].habilitar = this.documento.estado == 'C'
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Recuperando Detalles de Producto'
      let response: any = await this.apiService.getProducto(this.doc_detalle_producto.fk_product, { documento: this.documento });
      // console.log(response)
      this.producto = response
      if (response.detalles != null) this.detalles = response.detalles

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error recuperando Detalles')
    }
  }

  agregarDetalle() {
    let detalle: ProductoDetalle = {
      cantidad: 1,
      lote: null,
      fecha_caducidad: moment().format('YYYY-MM-DD'),
    };

    this.detalles.push(detalle);
    this.validarCantidad()
  }

  async guardarDetalles() {
    const sumCantLotes = this.detalles.reduce((acc: number, curr: ProductoDetalle) => acc + curr.cantidad, 0)
    console.log(sumCantLotes)

    if (sumCantLotes != this.doc_detalle_producto.quantity) {
      this.toastr.warning('La cantidad ingresada no es la misma del detalle')
      return;
    }

    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Almacenando Detalles'

      let response = await this.apiService.setDetalles({documento: this.documento, producto: this.producto, detalles: this.detalles});
      this.detalles = response

      this.lcargando.ctlSpinner(false)
      Swal.fire('Detalles almacenados correctamente', '', 'success');
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error almacenando Detalles')
    }
  }

  validarCantidad() {
    let cantidad_total = this.detalles.reduce((acc, curr) => acc + curr.cantidad, 0);
    // console.log(cantidad_total)
    if (cantidad_total > this.doc_detalle_producto.quantity) {
      // this.vmButtons[0].habilitar = true
      this.toastr.warning('Cantidad ingresada superior a cantidad total', 'Validacion de Cantidad')
    }
  }

  eliminarDetalle(detalle: ProductoDetalle) {
    this.detalles.splice(this.detalles.indexOf(detalle), 1);
    this.validarCantidad()
  }

}
