import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { ComprasService } from '../compras.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-modal-cargaxml',
  templateUrl: './modal-cargaxml.component.html',
  styleUrls: ['./modal-cargaxml.component.scss']
})
export class ModalCargaxmlComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() comprobante: any;
  vmButtons: Array<Botonera> = [];
  mensajeSpinner: string = "Cargando...";

  proveedor: any = {};
  factura: any = {};
  productos: Array<any> = [];

  displayedColumns: Array<string> = [
    'codigo',
    'nombre',
    'cantidad',
    'precio_unitario'
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ComprasService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalXml',
        paramAccion: '',
        boton: { icon: 'fas fa-check', texto: 'CONFIRMAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsModalXml',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'REGRESAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    // Procesar el string XML
    // console.log(this.comprobante)
    Object.assign(this.proveedor, {
      razon_social: this.comprobante.factura.infoTributaria[0].razonSocial[0],
      ruc: this.comprobante.factura.infoTributaria[0].ruc[0],
      direccion: this.comprobante.factura.infoTributaria[0].dirMatriz[0],
    })

    let num_factura = `${this.comprobante.factura.infoTributaria[0].estab[0]}-${this.comprobante.factura.infoTributaria[0].ptoEmi[0]}-${this.comprobante.factura.infoTributaria[0].secuencial[0]}`
    let fecha = (this.comprobante.factura.infoFactura[0].fechaEmision[0]).split('/')
    let fecha_emision = moment(`${fecha[2]}-${fecha[1]}-${fecha[0]}`).format('YYYY-MM-DD')
    Object.assign(this.factura, {
      num_factura: num_factura,
      fecha_emision: fecha_emision,
      autorizacion: this.comprobante.factura.infoTributaria[0].claveAcceso[0],
      forma_pago: this.comprobante.factura.infoFactura[0].pagos[0].pago[0].formaPago[0],
      total: this.comprobante.factura.infoFactura[0].importeTotal[0],
    })

    this.comprobante.factura.detalles[0].detalle.forEach((item: any) => {
      this.productos.push({
        nombre: item.descripcion[0],
        cantidad: parseFloat(item.cantidad[0]),
        codigo: item.codigoPrincipal[0],
        precio_unitario: parseFloat(item.precioUnitario[0]),
        descuento: item.descuento[0],
        impuesto: item.impuestos[0].impuesto[0].codigoPorcentaje[0],
        subtotal_noobjeto: item.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '6' ? item.impuestos[0].impuesto[0].baseImponible[0] : 0,
        subtotal_excento: item.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '7' ? item.impuestos[0].impuesto[0].baseImponible[0] : 0,
        subtotal_cero: item.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '0' ? item.impuestos[0].impuesto[0].baseImponible[0] : 0,
        subtotal_iva: item.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '2' ? item.impuestos[0].impuesto[0].baseImponible[0] : 0,
        iva_detalle: item.impuestos[0].impuesto[0].valor[0],
        subtotalItems: parseFloat(item.precioTotalSinImpuesto[0]),
        totalItems: parseFloat(item.precioTotalSinImpuesto[0]),
        rte_fuente: 0,
        rte_iva: 0,
      })
    })

    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      let empresa = await this.apiService.getEmpresa()
      this.lcargando.ctlSpinner(false)
      if (this.comprobante.factura.infoFactura[0].identificacionComprador[0] != empresa.ruc) {
        let result: SweetAlertResult = await Swal.fire({
          titleText: `Factura no emitida a ${empresa.razon_social}`,
          text: `Factura no emitida a ${empresa.razon_social}. Esta seguro/a de cargarla?`,
          icon: 'question',
          showDenyButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Continuar'
        })

        if (result.isDenied) {
          this.activeModal.close()
        }
      }
    }, 0)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;
      case "CONFIRMAR":
        this.confirmar(this.proveedor.ruc)
        break;

      default:
        break;
    }
  }

  async confirmar(ruc: string) {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Confirmando Proveedor...'
      // Confirmar si proveedor existe en la base de datos
      let response = await this.apiService.consultarProveedor({ ruc });
      console.log(response)

      // Si no existe, confirmar si desea crear
      this.lcargando.ctlSpinner(false)
      if (Array.isArray(response) && response.length == 0) {
        let result: SweetAlertResult = await Swal.fire({
          title: 'Proveedor no registrado',
          text: 'Desea crearlo?',
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Registrar'
        })

        if (result.isConfirmed) {
          // Registrar Proveedor
          let proveedor = {
            tipo_documento: 'Ruc',
            num_documento: ruc,
            razon_social: this.comprobante.factura.infoTributaria[0].razonSocial[0],
            nombre_comercial_prov: this.comprobante.factura.infoTributaria[0].nombreComercial[0],
            direccion: this.comprobante.factura.infoTributaria[0].dirMatriz[0],
          }

          this.lcargando.ctlSpinner(true)
          (this as any).mensajeSpinner = 'Registrando Proveedor...'
          response = await this.apiService.registrarProveedor({ proveedor });
          console.log(response)

          this.lcargando.ctlSpinner(false)
        } else {
          return;
        }
      }

      // Devolver al formulario los datos del proveedor y la factura
      this.apiService.facturaXml$.emit({
        proveedor: response,
        factura: this.factura,
        // detalles: this.productos
      })

      this.activeModal.close()
      //
    } catch (err) {
      //
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }

  }

}
