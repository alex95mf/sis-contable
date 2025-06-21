import { Component, OnInit, ViewChild } from '@angular/core';

import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalArancelesComponent } from './modal-aranceles/modal-aranceles.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { GeneracionService } from './generacion.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import moment from 'moment';

@Component({
standalone: false,
  selector: 'app-generacion',
  templateUrl: './generacion.component.html',
  styleUrls: ['./generacion.component.scss']
})
export class GeneracionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Liquidación (Registro de la Propiedad)";
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
  arancelDisabled = true;
  codCastDisabled = true;
  cuantiaDisabled = true;
  calcularDisabled = true;
  exoneracionDisabled = true;
  observacionesDisabled = true;
  subtotalDisabled = true;

  verifyRestore = false;

  liquidacion = {
    id: null,
    documento: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: '',
    fk_contribuyente: null,
    fk_concepto: 'RP',
    fk_arancel: null,
    fk_lote: null,
    avaluo: 0,
    cuantia: 0,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    tasa_admin: 2,
    total: 0,
    detalles: [],
    //No se envia concepto porque concepto siempre es RE, registro de la propiedad
  };

  propiedades = [];

  contribuyenteActive: any = {};
  arancelActive: any = {};
  exoneraciones: any = [];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: GeneracionService,
  ) {
    this.commonVarService.selectListLiqRP.asObservable().subscribe(
      (res) => {
        (this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';
        this.lcargando.ctlSpinner(true);
        this.restoreForm(false, false);
        this.formReadOnly = true;
        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.arancelActive = res.arancel;
        this.contribuyenteActive = res.contribuyente;
        this.propiedades = [
          {
            pivot: {
              lote_id: res.fk_lote
            },
            cod_catastral: res.codigo_catastro
          }
        ];
        console.log(res);
        res.detalles.forEach(e => {
          if (!e.fk_arancel) {
            let exon = {
              con_det_codigo: e.concepto.codigo_detalle,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: e.total / res.subtotal,
              total: e.total,
              valor: e.total
            }
            this.exoneraciones.push(exon);
          }
        })

        console.log(this.exoneraciones);

        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
        
        this.lcargando.ctlSpinner(false);
      }
    )
    this.commonVarService.selectArancelLiqRP.asObservable().subscribe(
      (res) => {
        this.selectArancel(res);
      }
    );
    this.commonVarService.selectExonerLiqRP.asObservable().subscribe(
      (res) => {
        this.exoneraciones = res;
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });
        this.calcTotal();
      }
    );
    // this.commonVarService.selectContribuyenteLiqRP.asObservable().subscribe(
    //   (res) => {
    //     this.selectContibuyente(res);
    //   }
    // )
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        // console.log(res);
        this.selectContibuyente(res);
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenLiq",
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
        orig: "btnsRenLiq",
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
        orig: "btnsRenLiq",
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
        orig: "btnsRenLiq",
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
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fRPEmision,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
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
        this.restoreForm(false, false);
      }
    });
  }

  restoreForm(keepContr, keepArancel) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;

    this.formReadOnly = false;
    this.arancelDisabled = true;
    this.codCastDisabled = true;
    this.cuantiaDisabled = true;
    this.calcularDisabled = true;
    this.exoneracionDisabled = true;
    this.observacionesDisabled = true;
    this.subtotalDisabled = true;

    this.verifyRestore = false;

    this.liquidacion = {
      id: null,
      documento: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: '',
      fk_contribuyente: 0,
      fk_concepto: 'RP',
      fk_arancel: 0,
      fk_lote: null,
      avaluo: 0,
      cuantia: 0,
      observacion: "",
      subtotal: 0,
      tasa_admin: 2,
      exoneraciones: 0,
      total: 0,
      detalles: [],
    };

    this.propiedades = [];

    this.exoneraciones = [];

    if (keepContr && Object.keys(this.contribuyenteActive).length > 0) {
      console.log(this.contribuyenteActive);
      this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente
    } else {
      this.contribuyenteActive = {};
    }

    if (keepArancel && Object.keys(this.arancelActive).length > 0) {
      this.liquidacion.fk_arancel = this.arancelActive.id;
    } else {
      this.arancelActive = {};
    }
  }

  selectContibuyente(contr) {
    this.contribuyenteActive = contr;
    this.liquidacion.fk_contribuyente = contr.id_cliente;
    this.arancelDisabled = false;
    this.observacionesDisabled = false;
    this.vmButtons[3].habilitar = false;
  }

  selectArancel(arancel) {
    this.restoreForm(true, false);
    this.arancelDisabled = false;
    this.observacionesDisabled = false;
    // Permitir ingreso de Cuantia al seleccionar Arancel (Sobrepone validacion al escoger Propiedad)
    this.cuantiaDisabled = false;
    // Permitir calculo de Liquidacion al seleccionar arancel (Sobrepone validacion al escoger Propiedad)
    this.calcularDisabled = false;
    this.verifyRestore = true;
    this.vmButtons[3].habilitar = false;
    this.arancelActive = arancel;
    this.liquidacion.fk_arancel = arancel.id
    if (arancel.desc_calculo == "FI") {
      if (!arancel.avaluo && !arancel.cuantia) {
        this.liquidacion.subtotal = arancel.valor;
        this.calcTotal();
      }
    } else if (arancel.desc_calculo == "NA") {
      this.subtotalDisabled = false;
    }
    if (arancel.id) {
      if (arancel.avaluo) {
        (this as any).mensajeSpinner = 'Obteniendo Propiedades...'
        this.lcargando.ctlSpinner(true);
        this.apiService.getPropiedades(this.liquidacion.fk_contribuyente).subscribe(
          (res) => {
            if (res['data'].length > 0) {
              this.propiedades = res['data']
              this.codCastDisabled = false;
              this.lcargando.ctlSpinner(false);
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "info",
                title: "Contribuyente seleccionado no presenta Propiedades",
                // text: "El contribuyente seleccionado no presenta propiedades registradas a su nombre. Por favor seleccione otro contribuyente u otro arancel.",
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false)
            this.toastr.error(error.error.message, 'Error cargando Propiedades')
          }
        );
      }
    }
    // if (arancel.cuantia) {
    //   this.cuantiaDisabled = false;
    // }
    if (arancel.aplica_exoneracion) {
      this.exoneracionDisabled = false;
    }
  }

  selectPropiedad(event) {
    this.liquidacion.avaluo = this.propiedades.filter(e => e.pivot.lote_id == event)[0].avaluo;
    this.changeAvalCuantia();
  }

  changeAvalCuantia() {
    // this.calcularDisabled = true;
    this.liquidacion.subtotal = 0;
    this.liquidacion.total = 0;
    if (this.arancelActive['cuantia'] && this.arancelActive['avaluo']) {
      if (this.liquidacion.cuantia > 0 && this.liquidacion.avaluo > 0) {
        this.calcularDisabled = false;
      }
    } else if (this.arancelActive['cuantia']) {
      if (this.liquidacion.cuantia > 0) {
        this.calcularDisabled = false;
      }
    } else if (this.arancelActive['avaluo']) {
      if (this.liquidacion.avaluo > 0) {
        this.calcularDisabled = false;
      }
    }
  }

  calcSubtotal() {
    (this as any).mensajeSpinner = 'Calculando Subtotal...';
    this.lcargando.ctlSpinner(true);
    let payload = {
      avaluo: this.liquidacion.avaluo,
      cuantia: this.liquidacion.cuantia
    }
    this.apiService.getCalculoSubtotal(payload, this.arancelActive.id).subscribe(
      (res) => {
        this.lcargando.ctlSpinner(false);
        console.log(res);
        this.liquidacion.subtotal = res['data'];
        this.calcTotal();
      },
      (error) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(error.error.message, 'Error al obtener el calculo')
      }
    );
  }

  calcTotal() {
    this.liquidacion.exoneraciones = 0;
    this.exoneraciones.forEach(e => {
      Object.assign(e, {
        //descuentos: 0,
        valor: (+e['porcentaje']) * this.liquidacion.subtotal
      })
      this.liquidacion.detalles.push(e);
      this.liquidacion.exoneraciones += e['valor']
    });
    let preTotal = this.liquidacion.subtotal - this.liquidacion.exoneraciones + this.liquidacion.tasa_admin;
    if (preTotal > 0) {
      this.liquidacion.total = preTotal;
    } else {
      this.liquidacion.total = 0;
    }
    this.vmButtons[0].habilitar = false;
  }

  createLiquidacion() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos generar Liquidaciones.", this.fTitle);
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
          this.liquidacion.fk_arancel = this.arancelActive.id;
          this.liquidacion.detalles.push(
            {
              fk_arancel: this.arancelActive.id,
              cantidad: 1,
              valor: this.liquidacion.subtotal,
            }
          );
          this.apiService.setLiquidacion({liquidacion: this.liquidacion}).subscribe(
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
              // this.guardarDeuda(res['data'].id_liquidacion);
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

  guardarDeuda(id) {
    this.apiService.aprobarLiquidacion(id).subscribe(
      (res) => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);
      }
    )
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calcTotal();
  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  onlyNumberDot(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
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
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
  }

  expandArancel() {
    const modalInvoice = this.modalService.open(ModalArancelesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
  }

  expandExoneracion() {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
  }

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
  }

}

