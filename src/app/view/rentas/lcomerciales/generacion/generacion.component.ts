import { Component, OnInit, ViewChild } from '@angular/core';

import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
import { GeneracionService } from './generacion.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { ModalImpuestosComponent } from './modal-impuestos/modal-impuestos.component';

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
  fecha: string = moment().format('YYYY-MM-DD')

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
    fk_concepto: 47,  // Sobreescrito al cargar Concepto
    fk_lote: null,
    fk_orden_inspeccion: 0,
    avaluo: 0,
    cuantia: null,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    total: 0,
    detalles: [],
    concepto: {codigo: 'LC'},  // Sobreescrito al cargar Concepto
    local: {},
    tasa_admin:null
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
        //this.lcargando.ctlSpinner(true);
        this.restoreForm();
        this.formReadOnly = true;
        console.log(res);
        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;

        console.log(res.detalles)
        res.detalles.forEach(e => {
          // if (e.fk_con_det_aplicado) {
          //   let exon = {
          //     cod_concepto_det_aplicable: e.cod_con_det_aplicado,
          //     con_det_codigo: e.concepto.codigo_detalle,
          //     comentario: e.comentario,
          //     descripcion: e.concepto.nombre_detalle,
          //     porcentaje: e.total / this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado).valor,
          //     valor: e.total
          //   }
          //   this.exoneraciones.push(exon);
          // } else {
          //   Object.assign(this.conceptos.find(c => e.fk_concepto_detalle == c.fk_concepto_detalle), {comentario: e.comentario, valor: e.valor});
          // }
          console.log(e)
          if(e.concepto != null){
            if(e.concepto.fk_concepto==32) { //exoneraciones
              let exon = {};
              if(this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado)) {          
                exon = {
                  cod_concepto_det_aplicable: e.cod_con_det_aplicado,
                  con_det_codigo: e.concepto?.codigo_detalle,
                  comentario: e.comentario,
                  descripcion: e.concepto?.nombre_detalle,
                  porcentaje: e.total / this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado).valor,
                  valor: e.total
                }
              } else {
                exon = {
                  cod_concepto_det_aplicable: e.cod_con_det_aplicado,
                  con_det_codigo: e.concepto?.codigo_detalle,
                  comentario: e.comentario,
                  descripcion: e.concepto?.nombre_detalle,
                  porcentaje: e.total / this.liquidacion.subtotal,
                  valor: e.total
                }
              }      
              this.exoneraciones.push(exon);
            } else {
              if(e.concepto==null){

              }
              let conc = {
                codigo_detalle: e.concepto.codigo_detalle,
                nombre_detalle: e.concepto.nombre_detalle,
                cantidad: e.cantidad,
                valor: e.valor,
                comentario: e.comentario,
                total: e.valor,
                aplica: true
              }
    
              this.conceptos.push(conc);
            }
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
              console.log(res);
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
        // this.calcSubtotal();
        //this.lcargando.ctlSpinner(false);
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

    this.commonVarService.selectConcepLiqLCRen.asObservable().subscribe(
      (res) => {
        this.conceptos = res;
        this.calculateExoneraciones();
      }
    );
    this.commonVarService.selectInspeccionRentas.asObservable().subscribe(
      (res: any) => {
        console.log(res);
        Object.assign(this.liquidacion.local, res.fk_local)
        this.ordenActive = res;
        this.observacionesDisabled = false;
        this.conceptosDisabled = false;
        this.exoneracionDisabled = false;
        this.conceptos = [];
        this.calcSubtotal();
      }
    )
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res: any) => {
        console.log(res);
        this.contribuyenteActive = res;
        this.ordenDisabled = false;
        this.vmButtons[3].habilitar = false;
        
        if (res.valid == 6) {
          //this.selectContibuyente(res);
          if (res.fecha_nacimiento != null) {
            if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
            ) {
              this.expandSupervivencia(res.id_cliente);

            }
          }
        }
      }
    );

    this.commonVarService.limpiarSupervivencia.asObservable().subscribe(
      (res: any)=>{
        this.contribuyenteActive = {}
      }
    );
  
    this.commonVarService.selectConceptoCustom.asObservable().subscribe(
      (res: any) => {
        console.log(res);
        this.conceptos = res;
        //Se asigna el concepto por servicio tecnico Administrativo por defecto
        this.conceptos.push({
          aplica: true,
          cantidad: 1,
          codigo_detalle: "TALC",
          codigo_presupuesto: "113",
          comentario: "",
          cuenta_acreedora: "112",
          cuenta_deudora: "111",
          estado: "A",
          fk_concepto: 0,
          fk_concepto_detalle: 267,
          id_concepto_detalle: 267,
          nombre_detalle: "SERVICIO TÉCNICO ADMINISTRATIVO",
          observacion: "",
          tiene_exoneracion: "N",
          tiene_tarifa: 0,
          total: 5.00,
          valor:5.00
        });

        // Al venir solo uno, se toma su codigo_detalle, de busca el concepto y se actualiza el concepto de la liquidacion
        (this as any).mensajeSpinner = 'Leyendo datos adicionales...'
        this.lcargando.ctlSpinner(true);
        this.apiService.getConceptoByNombre({nombre_detalle: res[0].nombre_detalle}).subscribe(
          (response: any) => {
            console.log(response.data)
            this.lcargando.ctlSpinner(false)
            Object.assign(this.liquidacion,  {fk_concepto: response.data.id_concepto, concepto: {codigo: response.data.codigo}})
            console.log(this.conceptos)
            Object.assign(this.conceptos[1], { fk_concepto: response.data.id_concepto})
            console.log(this.conceptos)
            // this.liquidacion.concepto.codigo = response.data.codigo
            // this.liquidacion.fk_concepto = response.data.id_concepto
          },
          (error: any) => {
            console.log(error)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(error.error.message, 'Error cargando Concepto')
          }
        )
        this.calcSubtotal();
      }
    );
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
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

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
      fk_concepto: 47,
      fk_lote: null,
      fk_orden_inspeccion: 0,
      avaluo: 0,
      cuantia: null,
      observacion: "",
      subtotal: 0,
      exoneraciones: 0,
      total: 0,
      detalles: [],
      concepto: {codigo: 'LC'},
      local: {},
      tasa_admin:null
    };

    this.contribuyenteActive = {
      razon_social: ""
    };
    
    this.conceptos = [];
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
  }

  verificacionTerceraEdad(event) {
    // console.log(event);
    let fecha = event.split('-')
    let actualyear = new Date().getFullYear()
    let anio = actualyear - parseInt(fecha[0])
    let mes = (new Date().getMonth() + 1) >= parseInt(fecha[1])
    let dia = (new Date().getDate()) >= parseInt(fecha[2])
    // console.log(mes);
    // console.log(dia);


    if (anio >= 65) {

      if ((new Date().getMonth() + 1) > parseInt(fecha[1])) {

        return true
        // console.log('Mayor a mes');

      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {

          return true
          // console.log('Mayor mes y dia');
        } else {

          return (false)
        }
      } else {

        return (false)
        // console.log(anio - 1);
      }

    } else {

      return (false)
      // console.log(anio - 1);
    }

  }

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    // let data = {
    //   id_concepto: 47
    // }
    // let data = {
    //   codigo: "LC"
    // }
    this.apiService.getConceptoDetByCod({codigo: 'LC'}).subscribe(
      (res) => {
        res['data'].forEach(e => {
          Object.assign(e, {
            valor: 0,
            fk_concepto_detalle: e.id_concepto_detalle,
            comentario: "",
            aplica: true
          });
        })
        this.conceptosBackup = JSON.parse(JSON.stringify(res['data']));
        console.log(this.conceptosBackup);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }

  calculateConceptos() {
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
    console.log(this.conceptos)
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

      if(this.liquidacion.observacion==""||this.liquidacion.observacion==undefined){
        this.toastr.info("Debe ingresar una observación para la liquidación")
        return;
      } else if(
        this.conceptos.length<=0||!this.conceptos.length
      ) {
        this.toastr.info("Debe ingresar detalles para la liquidación")
        return;
      }

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
              e.isExon = false;
              this.liquidacion.detalles.push(e);
            }
            if(e.codigo_detalle==='TALC'){
              this.liquidacion.tasa_admin = e.valor
            }
          });
          this.exoneraciones.forEach(e => {
            e.isExon = true;
            this.liquidacion.detalles.push(e);
          });
          // let data = {
          //   liquidacion: this.liquidacion
          // }
          // console.log({liquidacion: this.liquidacion});
          // return;

          this.apiService.setLiquidacionLC({liquidacion: this.liquidacion}).subscribe(
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

              // linea para generar deuda
              this.guardarDeuda(res['data'].id_liquidacion);
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

  /* generarValores() {
    (this as any).mensajeSpinner = 'Cargando Valores...';
    this.lcargando.ctlSpinner(true);
    let data = {
      concepto: "LC",
      orden: this.ordenActive,
      detalles: this.conceptos.filter(e => e.aplica),
    }
    console.log(data);
    this.apiService.getValues(data).subscribe(
      (res) => {
        console.log(res);
        this.conceptos.forEach(e => {
          e.valor = res['data'].find(d => e.codigo_detalle == d.codigo_detalle)?.valor ?? 0;
        });
        this.calcSubtotal();
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error cargando Valores');
        this.lcargando.ctlSpinner(false);
      }
    );
  } */

  removeConcepto(index) {

    this.conceptos[index].valor = 0;
    this.conceptos[index].aplica = false;
    this.conceptos.splice(index,1);
    this.calcSubtotal();
    console.log(this.conceptos);
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
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenFormLiquidacion;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
  }

  expandSupervivencia(id) {
    console.log('localesComerciales')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;
    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }

  /* expandConceptos() {
    const modalInvoice = this.modalService.open(ModalConceptosComponent,{
      size:"md",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenFormLiquidacion;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.conceptos = this.conceptos;
  } */

  expandImpuestos() {
    const modalInvoice = this.modalService.open(ModalImpuestosComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenFormLiquidacion;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.conceptosBackup = this.conceptosBackup;
    modalInvoice.componentInstance.conceptos = this.conceptos;
    modalInvoice.componentInstance.ordenActive = this.ordenActive;
    modalInvoice.componentInstance.fTitle = "Impuestos por cobrar";
  }

  expandExoneracion() {
    if (this.contribuyenteActive.supervivencia == 'S') {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent, {
      size:"xl",
      backdrop: "static",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenFormLiquidacion;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.conceptos = { id_concepto: this.liquidacion.fk_concepto, codigo: this.liquidacion.concepto.codigo }
    }
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
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenFormLiquidacion;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 6;
    }
  }

  expandInspecciones() {
    const modalInvoice = this.modalService.open(ModalInspeccionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenFormLiquidacion;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive;
  }

}

