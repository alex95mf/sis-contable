import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { GeneracionPermisosService } from './generacion-permisos.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalConceptosComponent } from 'src/app/config/custom/modal-conceptos/modal-conceptos.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
//import { ThisReceiver } from '@angular/compiler/src/expression_parser/ast';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-generacion-permisos',
  templateUrl: './generacion-permisos.component.html',
  styleUrls: ['./generacion-permisos.component.scss']
})
export class GeneracionPermisosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de liquidación (Permiso de construccion)";
  mensajeSpinner: string = "Cargando...";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  formReadOnly = false;
  codCastDisabled = true;
  observacionesDisabled = true;
  conceptosDisabled = true;
  exoneracionDisabled = true;
  verifyRestore = false;
  conceptos = [];

  liquidacion = {
    id: null,
    documento: "",
    fk_lote: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: '',
    fk_contribuyente: null,
    fk_concepto: 58,
    observacion: "",
    subtotal: 0,
    subtotal_0: 0,
    exoneraciones: 0,
    subtotal_1: 0,
    sta: 0,
    subtotal_2: 0,
    recargo: 0,
    coactiva: 0,
    interes: 0,
    descuento: 0,
    total: 0,
    detalles: [],
    concepto: { codigo: 'PC' }
  };

  propiedades: any = [];
  contribuyenteActive: any = {};

  propiedadActive: any = {};
  conceptosBackup: any = [];

  exoneracionesBackup: any = [];
  exoneraciones: any = [];

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: GeneracionPermisosService,
    private cierremesService: CierreMesService

  ) {

    //this.commonVarService.selectListLiqPURen.asObservable().subscribe(
    this.commonVarService.selectListLiqPURen.pipe(takeUntil(this.onDestroy$)).subscribe(

      (res) => {
        console.log(res)
        // (this as any).mensajeSpinner = 'Cargando datos de la iquidación...';
        // this.lcargando.ctlSpinner(true);
        this.restoreForm(false, false);
        console.log(res);
        this.formReadOnly = true;
        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;

        if(res.fk_lote){
          this.propiedades = [
            {
              id: res.lote.id,
              cod_catastral: res.codigo_catastro,
              manzana: res.lote.manzana,
              solar: res.lote.solar,
              area: res.lote.area
            }
          ];
          this.propiedadActive = res.lote;
        }
        console.log( res.detalles)
        console.log(this.conceptos)
        res.detalles.forEach(e => {
          if (!e.fk_con_det_aplicado) {
             Object.assign(this.conceptos.find(c => c.codigo_detalle == e.concepto.codigo_detalle), { comentario: e.comentario, valor: e.valor });
          }
        });


      if(res.detalles.concepto==null){
        res.detalles.forEach(e => {
          if (e.fk_con_det_aplicado) {
            let exon = {
              cod_concepto_det_aplicable: e.cod_con_det_aplicado,
              con_det_codigo: e.concepto?.codigo_detalle,
              comentario: e.comentario,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: e.total / this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado).valor,
              valor: e.total
            }
            this.exoneraciones.push(exon);
          }
        });
      }
      console.log(this.exoneraciones)

        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;

        this.lcargando.ctlSpinner(false);
      }
    )
    this.commonVarService.selectExonerLiqPURen.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.exoneraciones = res;
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });
        this.calculateExoneraciones();
      }
    );
    this.commonVarService.selectContribuyenteCustom.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res);
        if (res.valid == 2) {

          this.selectContibuyente(res);


          if (res.fecha_nacimiento != null) {
            if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
            ) {
              this.expandSupervivencia(res.id_cliente);

            }
          }
          else {
            console.log("hola")
          }
        }



      }

    );

    this.commonVarService.limpiarSupervivencia.asObservable().subscribe(
      (res)=>{
        this.contribuyenteActive = {};
      }
    )


  }


  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenLiq",
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
        orig: "btnsRenLiq",
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
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR" },
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
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      },


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
      case "GUARDAR":
        this.createLiquidacion();
        break;
      case "BUSCAR":

        this.expandListLiquidaciones();
        break;
      case "IMPRIMIR":
        break;
      case "LIMPIAR":
        this.confirmRestore();
        break;

      default:
        break;
    }
  }

  verificacionTerceraEdad(event) {
    // console.log(event);
    let fecha = event.split('-')
    let actualyear = new Date().getFullYear()
    let anio = actualyear - parseInt(fecha[0])
    let mes = (new Date().getMonth() + 1) >= parseInt(fecha[1])
    let dia = (new Date().getDate()) >= parseInt(fecha[2])
    console.log(mes);
    console.log(dia);


    if (anio >= 65) {

      if ((new Date().getMonth() + 1) > parseInt(fecha[1])) {

        return true
        console.log('Mayor a mes');

      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {

          return true
          console.log('Mayor mes y dia');
        } else {

          return (false)
        }
      } else {

        return (false)
        console.log(anio - 1);
      }

    } else {

      return (false)
      console.log(anio - 1);
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

  restoreForm(keepContr, softRestore) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.formReadOnly = false;
    this.conceptosDisabled = true;
    this.exoneracionDisabled = true;
    this.liquidacion = {
      id: null,
      documento: "",


      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: '',
      fk_contribuyente: null,
      fk_lote: null,
      fk_concepto: 58,
      observacion: "",
      subtotal: 0,
      subtotal_0: 0,
      exoneraciones: 0,
      subtotal_1: 0,
      sta: 0,
      subtotal_2: 0,
      recargo: 0,
      coactiva: 0,
      interes: 0,
      descuento: 0,
      total: 0,
      detalles: [],
      concepto: { codigo: 'PC' }
    };
    this.conceptosBackup = [];
    this.conceptos.forEach(e => {
      e.valor = 0;
    });



    this.exoneracionesBackup = [];
    this.exoneraciones = [];
    if (keepContr && Object.keys(this.contribuyenteActive).length > 0) {
      this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente
    } else {
      this.contribuyenteActive = {};
      this.codCastDisabled = true;
      this.observacionesDisabled = true;
      this.vmButtons[3].habilitar = true;
    }

    if (!softRestore) {
      this.verifyRestore = false;
      this.propiedades = [];
      this.propiedadActive = {};
    }
  }

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      id_concepto: 58
    }
    this.apiService.getConceptoDetalle(data).subscribe(
      (res) => {
        console.log(res);
        res['data'].forEach(e => {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle });
        })
        this.conceptos = JSON.parse(JSON.stringify(res['data']));
        console.log(this.conceptos);

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }
  expandSupervivencia(id) {
    console.log('permisos')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;

    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }

  selectContibuyente(contr) {
    this.restoreForm(false, false);
    this.contribuyenteActive = contr;
    this.liquidacion.fk_contribuyente = contr.id_cliente;
    this.observacionesDisabled = false;
    this.vmButtons[3].habilitar = false;
    (this as any).mensajeSpinner = 'Obteniendo Propiedades...'
    this.lcargando.ctlSpinner(true);
    this.apiService.getPropiedades(this.liquidacion.fk_contribuyente).subscribe(
      (res) => {
        if (res['data'].length > 0) {
          this.propiedades = res['data']
          this.codCastDisabled = false;
          this.lcargando.ctlSpinner(false);
          // this.mostrarForm();
        } else {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "warning",
            title: "Error cargando Propiedades",
            text: "El contribuyente seleccionado no presenta propiedades registradas a su nombre. Por favor seleccione otro contribuyente.",
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

  selectPropiedad(event) {
    this.verifyRestore = true;
    this.restoreForm(true, true);
    this.conceptosDisabled = false;
    this.exoneracionDisabled = false;
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
        console.log(result)
        if (result.isConfirmed) {

          (this as any).mensajeSpinner = 'Verificando período contable...';
          this.lcargando.ctlSpinner(true);
          let datos = {
            "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
            "mes": Number(moment(this.liquidacion.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {

                (this as any).mensajeSpinner = 'Generando Liquidación...';
                this.lcargando.ctlSpinner(true);
                this.liquidacion.fk_lote = this.propiedadActive.id;
                this.liquidacion.estado = 'A';

                const documento = { ...this.liquidacion, detalles: [...this.conceptos, ...this.exoneraciones] }
                console.log(documento)

                this.apiService.setLiquidacion({liquidacion: documento}).subscribe(
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
                    // this.guardarDeuda(res['data'].id_liquidacion); // comentado porque aqui solo se emiten, se aprueban o anulan desde permisos emitidos

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

              } else {
                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
              }

            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })
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

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  calcSubtotal() {
    let calculo = 0;
    this.conceptos.forEach(e => {
      calculo += +e.valor
    });
    this.liquidacion.subtotal = calculo;

    const subtotal_0 = this.conceptos.reduce((acc: number, curr: any) => acc + curr.valor, 0)
    Object.assign(this.liquidacion, {subtotal_0})

    this.calcExonerTotal();
  }


  calculateExoneraciones() {
    this.calcExonerTotal();
    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));
    this.calcTotal();
  }

  calcExonerTotal() {
    console.log(this.conceptos)
    // let calculo = 0;
    // this.exoneraciones.forEach(e => {
    //   e.valor = this.conceptos.find(c => e.cod_concepto_det_aplicable == c.codigo_detalle).valor * e.porcentaje;
    //   calculo += +e.valor
    // });
    const calculo = this.exoneraciones.reduce((acc: number, curr: any) => {
      const valor = Math.floor(this.conceptos.find(c => curr.cod_concepto_det_aplicable == c.codigo_detalle).valor * curr.porcentaje * 100) / 100
      Object.assign(curr, {valor})
      return acc + valor
    }, 0)
    this.liquidacion.exoneraciones = calculo;
    this.calcTotal();
  }

  calcTotal() {
    /* let preTotal = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
    if (preTotal > 0) {
      this.liquidacion.total = preTotal;
    } else {
      this.liquidacion.total = 0;
    } */
    const subtotal_1 = this.liquidacion.subtotal_0 - this.liquidacion.exoneraciones
    const subtotal_2 = subtotal_1 + this.liquidacion.sta
    const total = subtotal_2 + this.liquidacion.recargo + this.liquidacion.interes - this.liquidacion.descuento
    Object.assign(this.liquidacion, {subtotal_1, subtotal_2, total})
    this.vmButtons[0].habilitar = false;
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calcExonerTotal();
  }
  expandListLiquidaciones() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos de consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ListLiquidacionesComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPermisosLiquidacion;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
  }


  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    modalInvoice.componentInstance.validacion = 2;
  }



  expandExoneracion() {
    if (this.contribuyenteActive.supervivencia == 'S') {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive
    }
  }


  mostrarForm() {
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general"
    });

    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }


}
