import { Component, OnInit, ViewChild } from '@angular/core';

import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalConceptosComponent } from 'src/app/config/custom/modal-conceptos/modal-conceptos.component';
// import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
import { GeneracionService } from './generacion.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';

@Component({
standalone: false,
  selector: 'app-generacion',
  templateUrl: './generacion.component.html',
  styleUrls: ['./generacion.component.scss']
})
export class GeneracionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Liquidación (Locales Comerciales)";
  mensajeSpinner: string = "Cargando...";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  estados = [
    {
      value: 'E',
      label: 'Emitido'
    },
    {
      value: 'A',
      label: 'Aprobado'
    },
    {
      value: 'X',
      label: 'Anulado'
    },
  ]
  
  formReadOnly = false;
  ordenDisabled = true;
  codCastDisabled = true;
  observacionesDisabled = true;
  conceptosDisabled = true;
  exoneracionDisabled = true;

  verifyRestore = false;

  liquidacion = {
    id: null,
    documento: "",
    periodo: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: "E",
    fk_contribuyente: null,
    fk_concepto: 48,
    fk_lote: null,
    fk_orden_inspeccion: 0,
    avaluo: 0,
    cuantia: null,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    total: 0,
    detalles: [],
  };

  contribuyenteActive: any = {
    razon_social: ""
  };
  
  conceptosBackup: any = [];
  conceptos: any = [];
  exoneracionesBackup: any = [];
  exoneraciones: any = [];

  ordenActive: any = {
    numero_orden: "",
    fk_local: {
      id_local: 0,
      razon_social: "",
      contrato: "",
      fk_sector: {
        id_catalogo: 0,
        tipo: "",
        valor: "",
        descripcion: ""
      },
      fk_actividad_comercial: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
      fk_grupo: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
    },
  }

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: GeneracionService
  ) {
    this.commonVarService.selectListLiqPURen.asObservable().subscribe(
      (res) => {
        //(this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';
        //this.lcargando.ctlSpinner(true)
        this.restoreForm();
        this.formReadOnly = true;
        //console.log(res);
        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;
        res.detalles.forEach(e => {
          if (e.fk_con_det_aplicado) {
            let exon = {
              cod_concepto_det_aplicable: e.cod_con_det_aplicado,
              con_det_codigo: e.concepto.codigo_detalle,
              comentario: e.comentario,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: e.total / this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado).valor,
              valor: e.total
            }
            this.exoneraciones.push(exon);
          } else {
            Object.assign(this.conceptos.find(c => e.fk_concepto_detalle == c.fk_concepto_detalle), {comentario: e.comentario, valor: e.valor});
          }
        });
        if (this.liquidacion.fk_orden_inspeccion && this.liquidacion.fk_orden_inspeccion != 0) {
          (this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';
          this.lcargando.ctlSpinner(true);
          let data = {
            inspeccion: this.liquidacion.fk_orden_inspeccion
          }
          this.apiService.getInspeccion(data).subscribe(
            (res) => {
              //console.log(res);
              this.lcargando.ctlSpinner(false);
              this.ordenActive = res['data'];
            },
            (error) => {

            }
          );
        }
        this.conceptos.forEach(e => {
          if (e.valor == 0) {
            e.aplica = false;
          }
        });

        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
        
        //this.lcargando.ctlSpinner(false);
      }
    )
    this.commonVarService.selectExonerLiqPURen.asObservable().subscribe(
      (res) => {
        this.exoneraciones = res;
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });
        this.calculateExoneraciones();
      }
    );
    this.commonVarService.selectConcepLiqLCRen.asObservable().subscribe(
      (res) => {
        this.conceptos = res;
        this.calculateExoneraciones();
      }
    );
    this.commonVarService.selectConceptoCustom.asObservable().subscribe(
      (res) => {
        this.conceptos = res;
        this.conceptos.sort(function(a,b) {
          return parseFloat(a.id_concepto_detalle) - parseFloat(b.id_concepto_detalle);
        });
        this.calculateExoneraciones();
      }
    );
    this.commonVarService.selectInspeccionRentas.asObservable().subscribe(
      (res) => {
        //console.log(res);
        this.ordenActive = res;
        this.observacionesDisabled = false;
        this.conceptosDisabled = false;
        this.exoneracionDisabled = false;
      }
    )
    this.commonVarService.selectContribuyenteLiqPURen.asObservable().subscribe(
      (res) => {
        //console.log(res);
        this.contribuyenteActive = res;
        this.ordenDisabled = false;
        this.vmButtons[3].habilitar = false;
      }
    )

    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        //console.log(res);
        this.contribuyenteActive = res;
        this.ordenDisabled = false;
        this.vmButtons[3].habilitar = false;
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenLocalLiq",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
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
        boton: { icon: "far fa-search", texto: " BUSCAR" },
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
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
        printSection: "PrintSection", imprimir: true
      },
      {
        orig: "btnsRenLocalLiq",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      }
    ]

    setTimeout(() => {
      this.validaPermisos();
    }, 0);
  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...'
    this.lcargando.ctlSpinner(true)
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fRenPredUrbanoEmision,
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
          this.getConceptos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.createLiquidacion();
        break;
      case " BUSCAR":
        this.expandListLiquidaciones();
        break;
      case " IMPRIMIR":
        
        break;
      case " LIMPIAR":
        this.confirmRestore();
        break;
      default:
        break;
    }
  }

  confirmRestore() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reiniciar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restoreForm();
      }
    });
  }

  restoreForm() {
    this.formReadOnly = false;
    this.ordenDisabled = true;
    this.codCastDisabled = true;
    this.observacionesDisabled = true;
    this.conceptosDisabled = true;
    this.exoneracionDisabled = true;

    this.verifyRestore = false;

    this.liquidacion = {
      id: null,
      documento: "",
      periodo: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: "E",
      fk_contribuyente: null,
      fk_concepto: 48,
      fk_lote: null,
      fk_orden_inspeccion: 0,
      avaluo: 0,
      cuantia: null,
      observacion: "",
      subtotal: 0,
      exoneraciones: 0,
      total: 0,
      detalles: [],
    };

    this.contribuyenteActive = {
      razon_social: ""
    };
    
    this.conceptosBackup = [];
    this.conceptos.forEach(e => {
      e.comentario = "",
      e.valor = 0,
      e.aplica = true
    });
    this.exoneracionesBackup = [];
    this.exoneraciones = [];

    this.ordenActive = {
      numero_orden: "",
      fk_local: {
        id_local: 0,
        razon_social: "",
        contrato: "",
        fk_sector: {
          id_catalogo: 0,
          tipo: "",
          valor: "",
          descripcion: ""
        },
        fk_actividad_comercial: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
        fk_grupo: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
      },
    }

    this.vmButtons[0].habilitar = true;
    this.vmButtons[3].habilitar = true;
  }

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      id_concepto: 48
    }
    this.apiService.getConceptoDetalle(data).subscribe(
      (res) => {
        res['data'].forEach(e => {
          Object.assign(e, {
            valor: 0,
            fk_concepto_detalle: e.id_concepto_detalle,
            comentario: "",
            aplica: true
          });
        })
        this.conceptos = JSON.parse(JSON.stringify(res['data']));
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }

  calculateConceptos() {
    /*if (this.propiedadActive.valor_edificacion > 0) {
      this.conceptos.find(e => e.codigo_detalle == "IMP").valor = this.propiedadActive.avaluo * 0.0023;
    } else {
      this.conceptos.find(e => e.codigo_detalle == "SNE").valor = this.propiedadActive.avaluo * 0.002;
    }


    if (this.propiedadActive.avaluo >= (25 * 425)) {
      this.conceptos.find(e => e.codigo_detalle == "STA").valor = 5;
    } else {
      this.conceptos.find(e => e.codigo_detalle == "STA").valor = 2;
    }

    this.conceptosBackup = JSON.parse(JSON.stringify(this.conceptos));*/

    this.calcSubtotal();
    this.calcTotal();
  }

  calculateExoneraciones() {

    ///// CALCULOS AUTOMATICOS EXONERACIONES
    
    this.calcExonerTotal();
    
    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));

    this.calcTotal();
  }

  calcSubtotal() {
    let calculo = 0;
    this.conceptos.forEach(e => {
      if (e.aplica) {
        calculo += +e.valor;
      }
    });
    this.liquidacion.subtotal = calculo;
    this.calcExonerTotal();
  }

  calcExonerTotal() {
    let calculo = 0;
    this.exoneraciones.forEach(e => {
      e.valor = this.conceptos.find(c => e.cod_concepto_det_aplicable == c.codigo_detalle).valor * e.porcentaje;
      calculo += +e.valor
    });
    this.liquidacion.exoneraciones = calculo;
    this.calcTotal();
  }

  calcTotal() {
    let preTotal = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
    if (preTotal > 0) {
      this.liquidacion.total = preTotal;
    } else {
      this.liquidacion.total = 0;
    }
    this.vmButtons[0].habilitar = false;
  }

  createLiquidacion() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Liquidaciones.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Está a punto de emitir una nueva liquidación ¿Desea continuar?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          (this as any).mensajeSpinner = 'Generando Liquidación...';
          this.lcargando.ctlSpinner(true);
          this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente;
          this.liquidacion.fk_orden_inspeccion = this.ordenActive.id_inspeccion_orden;
          this.liquidacion.detalles = [];
          this.conceptos.forEach(e => {
            if (e.aplica && e.valor > 0) {
              this.liquidacion.detalles.push(e);
            }
          });
          this.exoneraciones.forEach(e => {
            this.liquidacion.detalles.push(e);
          });
          let data = {
            liquidacion: this.liquidacion
          }
          console.log(this.liquidacion);
          this.apiService.setLiquidacion(data).subscribe(
            (res) => {
              Swal.fire({
                icon: "success",
                title: "Liquidación generada",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
              this.liquidacion = res['data']
              this.formReadOnly = true;
              this.vmButtons[0].habilitar = true;
              this.vmButtons[2].habilitar = false;
              this.vmButtons[3].habilitar = false;
              this.lcargando.ctlSpinner(false);
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error al generar la liquidación",
                text: error.error.message,
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          );
        }
      });
    }
  }

  removeConcepto(index) {
    this.conceptos[index].aplica = false;
    this.conceptos.splice(index,1)
    this.calcSubtotal();
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calcExonerTotal();
  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  expandListLiquidaciones() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ListLiquidacionesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
  }

  // expandConceptos() {
  //   const modalInvoice = this.modalService.open(ModalConceptosComponent,{
  //     size:"md",
  //     backdrop: "static",
  //     windowClass: "viewer-content-general",
  //   });
  //   modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
  //   modalInvoice.componentInstance.permissions = this.permissions;
  //   modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
  //   modalInvoice.componentInstance.conceptos = this.conceptos;
  // }

  expandConceptos() {
    const modalInvoice = this.modalService.open(ModalConceptosComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.id_concepto = 48;
    modalInvoice.componentInstance.conceptos = this.conceptos;
    modalInvoice.componentInstance.fTitle = "Conceptos por locales comerciales";
  }

  expandExoneracion() {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
  }

  expandListContribuyentes() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
  }

  expandInspecciones() {
    const modalInvoice = this.modalService.open(ModalInspeccionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive;
  }

}

