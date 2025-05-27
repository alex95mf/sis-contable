import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { FacturasSaldoService } from './facturas-saldo.service';
import { CierreMesService } from '../ciclos-contables/cierre-de-mes/cierre-mes.service';
import { format } from 'date-fns';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';

@Component({
  selector: 'app-facturas-saldo',
  templateUrl: './facturas-saldo.component.html',
  styleUrls: ['./facturas-saldo.component.scss']
})
export class FacturasSaldoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  vmButtons: Botonera[] = [];

  documento: any = {
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    num_documento: null,
    observaciones: null,
    facturas: []
  }

  filter: any = {
    fecha_hasta: moment(new Date()).format('YYYY-MM-DD'),
  }

  constructor(
    private toastr: ToastrService,
    private apiService: FacturasSaldoService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService
  ) {
    this.vmButtons = [
      {
        orig: "btnsFacturasSaldo",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFacturasSaldo",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFacturasSaldo",
        paramAccion: "",
        boton: { icon: "fas fa-file-import", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info text-white boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFacturasSaldo",
        paramAccion: "",
        boton: { icon: "fas fa-trash-alt", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFacturasSaldo",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
    ];

    this.apiService.cierreSelected$.subscribe(
      async (documento: any) => {
        console.log("se cerro el modal")
        this.lcargando.ctlSpinner(true)
        try {
          this.msgSpinner = 'Cargando Documento...'
          let response = await this.apiService.getCierre({ documento })
          console.log("responseresponse",response)
          this.documento = { ...response }
          response.detalles.forEach((element: any) => {
            Object.assign(element, {
              proveedor: { nombre_comercial_prov: element.proveedor_nombre },
              num_doc: element.doc_numero,
              fecha_compra: element.doc_fecha,
              total: element.valor,
              saldo_orden_pago: element.saldo_op,
              subtotal: element.factura.subtotal,
              valor_iva: element.factura.valor_iva,
              detalle_cuentas: [{var_cod_codigo_cxp:"",var_nombre_cxp:""}]
            })
          });

          console.log("response.detalles",response.detalles);
          this.documento.facturas = response.detalles
          //
          this.vmButtons[1].habilitar = true
          this.vmButtons[3].habilitar = false
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message)
        }
        
      }
    )
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.cargaInicial()
        break;
      case "LIMPIAR":
        this.clearForm()
        break;
      case "GUARDAR":
        this.almacenarCierre()
        break;
      case "BUSCAR":
        this.expandBuscar()
        break;
      case "ELIMINAR":
        this.deleteCierre()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Facturas'
      let facturas = await this.apiService.getFacturas({params: { filter: this.filter }})
      console.log(facturas)
      console.log("facturas",facturas);
      this.documento.facturas = facturas;
      //
      this.vmButtons[1].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async almacenarCierre() {

    // Validacion de Datos
    let message = '';

    if (this.documento.observaciones == null) message += '* No ha ingresado una Observacion.<br>';

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true });
      return;
    }

    // Almacenamiento de Cierre
    let result = await Swal.fire({
      text: 'Seguro/a desea generar este cierre?',
      title: 'Cierre de Cuentas por Pagar',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar',
    });

    if (result.isConfirmed) {

      this.msgSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);

      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM'))
        }
        
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
            try {
            if (res["data"][0].estado !=='C') {
              this.lcargando.ctlSpinner(true)
              try {
                this.msgSpinner = 'Almacenando Cierre'
                let response: any = await this.apiService.setCierre({documento: this.documento})
                console.log(response)
                this.documento.num_documento = response.num_documento
                // this.documento.facturas = facturas;
                //
                this.lcargando.ctlSpinner(false)
                Swal.fire('Cierre almacenado correctamente', '', 'success').then(() => this.clearForm())
              } catch (err) {
                console.log(err)
                this.lcargando.ctlSpinner(false)
                this.toastr.error(err.error?.message)
              } 
            } else {
                
                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
            }
            } catch (error) {
                console.error("Error occurred:", error);
            }
        });



     
    }
  }

  clearForm() {
    this.vmButtons[1].habilitar = true
    this.vmButtons[3].habilitar = true
    Object.assign(this.documento, { num_documento: null, observaciones: null, facturas: [] })
  }

  expandBuscar() {
    const modal = this.modalService.open(ModalBusquedaComponent, { size: 'xl', backdrop: 'static' })
  }
  /* calcularTotal(detalle: any) {
    return (
      parseFloat(detalle.totalitems) +
        parseFloat(detalle.iva_detalle_item) -
        parseFloat(detalle.total_rft) -
        parseFloat(detalle.total_riva) -
        parseFloat(detalle.valor_anticipo) -
        parseFloat(detalle.valor_multa)consultar
    ).toFixed(2); // Redondear el resultado a 2 decimales
} */
calcularTotal(detalle: any) {
  const totalItems = parseFloat(detalle.totalitems) || 0;
  const ivaDetalleItem = parseFloat(detalle.iva_detalle_item) || 0;
  const totalRft = parseFloat(detalle.total_rft) || 0;
  const totalRiva = parseFloat(detalle.total_riva) || 0;
  const valorAnticipo = parseFloat(detalle.valor_anticipo) || 0;
  const valorMulta = parseFloat(detalle.valor_multa) || 0;

  return (
      totalItems +
      ivaDetalleItem -
      totalRft -
      totalRiva -
      valorAnticipo -
      valorMulta
  ).toFixed(2); // Redondear el resultado a 2 decimales
}
/* 
calcularTotal(detalle: any) {
  const totalItems = parseFloat(detalle.totalitems) ?? 0;
  const ivaDetalleItem = parseFloat(detalle.iva_detalle_item) ?? 0;
  const totalRft = parseFloat(detalle.total_rft) ?? 0;
  const totalRiva = parseFloat(detalle.total_riva) ?? 0;
  const valorAnticipo = parseFloat(detalle.valor_anticipo) ?? 0;
  const valorMulta = parseFloat(detalle.valor_multa) ?? 0;

  return (
      totalItems +
      ivaDetalleItem -
      totalRft -
      totalRiva -
      valorAnticipo -
      valorMulta
  ).toFixed(2); // Redondear el resultado a 2 decimales
} */

  async deleteCierre() {
    let result = await Swal.fire({
      titleText: 'Eliminar Cierre',
      text: 'Esta seguro/a de eliminar este documento?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {

      this.msgSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM'))
        }
      
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
          try {
           
            if (res["data"][0]?.estado !=='C') {
              
            this.lcargando.ctlSpinner(true)
            try {
              this.msgSpinner = 'Eliminando Cierre'
              await this.apiService.deleteCierre(this.documento.id)

              this.lcargando.ctlSpinner(false)
              Swal.fire('Cierre eliminado correctamente.', '', 'success').then(() => this.clearForm())
            } catch (err) {
              console.log(err)
              this.lcargando.ctlSpinner(false)
              this.toastr.error(err.error?.message)
            }
            } else {
                
                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
            }
          } catch (error) {
              console.error("Error occurred:", error);
          }
      });

    }
  }

}
