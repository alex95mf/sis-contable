import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import * as myVarGlobals from 'src/app/global';

import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { ModalOrdenInspeccionComponent } from './modal-orden-inspeccion/modal-orden-inspeccion.component';
import { LiquidacionService } from './liquidacion.service';
import { ModalValoresCobrarComponent } from './modal-valores-cobrar/modal-valores-cobrar.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ModalBusquedaDocumentoComponent } from './modal-busqueda-documento/modal-busqueda-documento.component';
import Botonera from 'src/app/models/IBotonera';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
})
export class LiquidacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Liquidación (Locales Comerciales)";
  msgSpinner: string;
  vmButtons: Array<Botonera> = [];
  dataUser: any;
  permissions: any;

  fecha: string = moment().format('YYYY-MM-DD')
  conceptos: Array<any> = []
  contribuyente: any = {
    razon_social: '',
    id_cliente: null,
  };
  orden_inspeccion: any = {
    numero_orden: '',
  };
  liquidacion: any = {
    id_documento: null,
    fecha: this.fecha,
    documento: null,
    estado: 'P',
    subtotal: 0,
    descuentos: 0,
    total: 0,
  }

  formReadonly: boolean = false
  contribuyenteSelected: boolean = false
  ordenInspeccionSelected: boolean = false

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private apiService: LiquidacionService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService
  ) {
    this.apiService.$contribuyenteSelected.subscribe(
      (contribuyente: any) => {
        const { razon_social, id_cliente, supervivencia } = contribuyente
        this.contribuyente = { razon_social, id_cliente, supervivencia }
        this.contribuyenteSelected = true
      }
    );

    this.apiService.$ordenInspeccionSelected.subscribe(
      (orden: any) => {
        const { id_inspeccion_orden, numero_orden, fk_local } = orden
        this.orden_inspeccion = { id_inspeccion_orden, numero_orden, fk_local }
        this.ordenInspeccionSelected = true
      }
    );

    this.apiService.$conceptoSelected.subscribe(
      (impuestos: Array<any>) => {
        impuestos.forEach((item: any) => {
          let exoneraciones = (item.exoneraciones != undefined) 
            ? item.exoneraciones 
            : [];
          let descuento = (item.exoneraciones != undefined && item.exoneraciones.length > 0)
            ? item.total * item.exoneraciones.reduce((acc, curr) => acc + parseFloat(curr.porcentaje), 0)
            : 0;
          let subtotal = (item.exoneraciones != undefined && item.exoneraciones.length > 0)
            ? item.total - item.total * item.exoneraciones.reduce((acc, curr) => acc + parseFloat(curr.porcentaje), 0)
            : item.total;
          Object.assign(item, { exoneraciones, descuento, subtotal })
        })
        this.conceptos = impuestos

        this.calcularTotales()
        // this.liquidacion.subtotal = impuestos.reduce((acc, curr) => acc + curr.subtotal, 0)
        // this.liquidacion.descuentos = impuestos.reduce((acc, curr) => acc + curr.descuento, 0)
        // this.liquidacion.total = this.liquidacion.subtotal - this.liquidacion.descuentos

        this.vmButtons[0].habilitar = false
        // this.vmButtons[3].habilitar = false
      }
    )

    this.apiService.$exoneracionesSelected.subscribe(
      ({ impuesto, exoneraciones }) => {
        const descuento = Math.floor(impuesto.total * exoneraciones.reduce((acc, curr) => acc + parseFloat(curr.porcentaje), 0)*100)/100
        const subtotal = impuesto.total - descuento
        console.log(impuesto.valor, descuento, subtotal)
        Object.assign(
          this.conceptos.find((concepto: any) => concepto.id_inspeccion_orden_cobrar == impuesto.id_inspeccion_orden_cobrar),
          { subtotal, exoneraciones, descuento }
        )

        this.liquidacion.descuentos = this.conceptos.reduce((acc, curr) => acc + parseFloat(curr.descuento), 0)
        this.liquidacion.total = this.liquidacion.subtotal - this.liquidacion.descuentos
      }
    )

    this.apiService.$documentoSelected.subscribe(
      async (res: any) => {
        // Conseguir el documento completo
        this.lcargando.ctlSpinner(true);
        try {
          this.msgSpinner = 'Cargando Documento';
          // Datos Relacionados
          let doc = await this.apiService.getDocumento(res);
          const { id_cliente, razon_social } = doc.contribuyente;
          Object.assign(this.contribuyente, { id_cliente, razon_social });
          const { numero_orden, fk_local } = doc.orden_inspeccion;
          Object.assign(this.orden_inspeccion, { numero_orden, fk_local });

          // Cabecera
          doc.fecha = moment(doc.fecha).format('YYYY-MM-DD');
          doc.descuentos = doc.subtotal - doc.total
          Object.assign(this.liquidacion, doc)

          //Detalles
          doc.detalles.map((detalle: any) => {
            // Intercambiar los subtotal con valor
            let subtotal = detalle.valor
            let total = detalle.total
            Object.assign(detalle, {
              total: subtotal,
              subtotal: total,
              exoneraciones: []
            })
          })
          Object.assign(this.conceptos, doc.detalles.filter((item: any) => item.fk_exoneracion == null))
          this.formReadonly = true

          this.lcargando.ctlSpinner(false);
          this.vmButtons[2].habilitar = false
        } catch (err) {
          console.log(err);
          this.lcargando.ctlSpinner(false);
          this.toastr.error(err.error.message, 'Error cargando Documento');
        }
      }
    )

    this.vmButtons = [
      {
        orig: "btnsRenLocalLiq",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLocalLiq",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenLocalLiq",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "APROBAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLocalLiq",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
    ]
  }

  ngOnInit(): void { }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.almacenarDocumento()
        break;
      case "LIMPIAR":
        this.limpiarDocumento()
        break;
      case "BUSCAR":
        this.expandBusqueda()
        break;
      case "APROBAR":
        this.aprobarDocumento()
        break;

      default:
        break;
    }
  }

  validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRenFormLiquidacion,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
          // this.cargaInicial();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async almacenarDocumento() {
    // console.log({ contribuyente: this.contribuyente, cabecera: this.liquidacion, impuestos: this.conceptos })
    // return;

    let msgInvalid = ''
    this.conceptos.forEach((element: any, idx: number) => {
      if (element.subtotal < 0) {
        msgInvalid += `Concepto #${idx} tiene un valor inferior a 0.<br>`
      }
    })
    if (this.liquidacion.total < 0) msgInvalid += 'El Total de Cobro de la Liquidacion es inferior a 0.<br>'

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    const result = await Swal.fire({
      title: 'Almacenar Documento',
      text: 'Esta seguro/a de almacenar este documento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Almacenar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {

      this.msgSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
        "mes": Number(moment(this.liquidacion.fecha).format('MM')),
        }
        
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
            try {
              if (res["data"][0].estado !=='C') {
                try {
                  this.msgSpinner = 'Almacenando Documento'
                  let response = await this.apiService.almacenarDocumento({ 
                    contribuyente: this.contribuyente, 
                    orden_inspeccion: this.orden_inspeccion,
                    cabecera: this.liquidacion, 
                    impuestos: this.conceptos 
                  });
                  console.log(response)
                  Object.assign(this.liquidacion, { id_documento: response.id_documento, documento: response.documento })
                  this.lcargando.ctlSpinner(false)
                  Swal.fire('Documento generado correctamente.', '', 'success').then(() => {
                    this.vmButtons[0].habilitar = true
                    this.vmButtons[2].habilitar = false
                    this.formReadonly = true
                  })
                } catch (err) {
                  console.log(err)
                  this.lcargando.ctlSpinner(false)
                  this.toastr.error(err.error.message, 'Error almacenando Documento')
                }

              } else {
                  
                  this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                  this.lcargando.ctlSpinner(false);
              }
            } catch (error) {
                console.error("Error occurred:", error);
                this.lcargando.ctlSpinner(false);
            }
        });
    }
  }

  async aprobarDocumento() {
    let result: SweetAlertResult = await Swal.fire({
      title: 'Aprobar Documento',
      text: 'Esta seguro/a de aprobar este documento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.msgSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
        "mes": Number(moment(this.liquidacion.fecha).format('MM')),
        }
        
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
            try {
              if (res["data"][0].estado !=='C') {
              
                this.lcargando.ctlSpinner(true)
                try {
                  this.msgSpinner = 'Aprobando Documento'
                  let response = await this.apiService.aprobarDocumento(this.liquidacion);
                  console.log(response)
                  Object.assign(this.liquidacion, { estado: response.estado })
                  
                  this.vmButtons[2].habilitar = true;
                  this.lcargando.ctlSpinner(false);
                  Swal.fire('Documento Aprobado', 'Liquiacion Generada', 'success');
                } catch (err) {
                  console.log(err);
                  this.lcargando.ctlSpinner(false);
                  this.toastr.error(err.error.message, 'Error aprobando Documento');
                }
              } else {
                  
                  this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                  this.lcargando.ctlSpinner(false);
              }
            } catch (error) {
                console.error("Error occurred:", error);
                this.lcargando.ctlSpinner(false);
            }
        });








      
    }


  }

  async limpiarDocumento() {
    let result: SweetAlertResult = await Swal.fire({
      // 'Limpiar Documento', 'Esta seguro/a de limpiar el documento', 'question'
      title: 'Limpiar Documento',
      text: 'Esta seguro/a de limpiar el documento',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Limpiar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      Object.assign(this.contribuyente, {
        razon_social: '',
        id_cliente: null,
      })

      Object.assign(this.orden_inspeccion, {
        numero_orden: '',
        fk_local: null,
      })

      Object.assign(this.liquidacion, {
        fecha: this.fecha,
        documento: null,
        estado: 'E',
        subtotal: 0,
        descuentos: 0,
        total: 0,
      })

      this.conceptos = []
      this.formReadonly = false

      this.vmButtons[0].habilitar = true
      this.vmButtons[2].habilitar = true
      // this.vmButtons[3].habilitar = true
    }
  }

  removeConcepto(i: number) {
    let concepto = this.conceptos[i]
    this.conceptos.splice(this.conceptos.indexOf(concepto), 1)

    this.calcularTotales()
  }

  calcularTotales() {
    const subtotal = this.conceptos.reduce((acc, curr) => acc + curr.subtotal, 0)
    const descuentos = this.conceptos.reduce((acc, curr) => acc + curr.descuento, 0)
    const total = subtotal - descuentos
    console.log(subtotal, descuentos, total)
    Object.assign(this.liquidacion, {subtotal, descuentos, total})
  }

  // Modales
  expandContribuyentes() {
    this.modalService.open(ModalContribuyentesComponent, { size: 'xl', backdrop: 'static' })
    this.contribuyente = {
      razon_social: '',
      id_cliente: null,
    };
    this.contribuyenteSelected = false
  }

  expandOrdenInspeccion() {
    const modal = this.modalService.open(ModalOrdenInspeccionComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.contribuyente = this.contribuyente;
    this.ordenInspeccionSelected = false;
  }

  expandImpuestos() {
    const modal = this.modalService.open(ModalValoresCobrarComponent, { size: 'xl', backdrop: 'static' })
    // modal.componentInstance.contribuyente = this.contribuyente;
    // modal.componentInstance.local = this.orden_inspeccion.fk_local;
    modal.componentInstance.orden_inspeccion = this.orden_inspeccion;
    modal.componentInstance.seleccionados = this.conceptos;
  }

  expandExoneraciones(impuesto, idx) {
    if (this.contribuyente.supervivencia == 'S') {
    const modal = this.modalService.open(ModalExoneracionesComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.contribuyente = this.contribuyente
    modal.componentInstance.impuesto = impuesto
    modal.componentInstance.idx = idx
    }
  }

  expandDetalles(impuesto: any) {
    // const modal = this.modalService.open()
    console.log(impuesto.exoneraciones)
  }

  expandBusqueda() {
    this.modalService.open(ModalBusquedaDocumentoComponent, { size: 'xl', backdrop: 'static' })
  }

}
