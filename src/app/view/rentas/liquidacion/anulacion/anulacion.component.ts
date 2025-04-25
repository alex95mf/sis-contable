import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { AnulacionService } from './anulacion.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styleUrls: ['./anulacion.component.scss']
})
export class AnulacionComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  fTitle = "Anulación de liquidaciones";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  formReadOnly = false;
  conDisabled = true;
  liqDisabled = true;
  observacionesDisabled = true;

  verifyRestore = false;

  anulacionList: any = []; //conceptos de anulacion AN y BA
  anulacion: any = 0;
  conceptosList: any = []; //todos los conceptos menos AN,BA y EX
  concepto: any = 0;

  motivos: any[] = []

  contribuyenteActive: any = {
    razon_social: ""
  };

  conceptosBackup: any = []; // lista con todos los conceptos det
  conceptos: any = []; // lista visible de detalles
  exoneracionesBackup: any = [];
  exoneraciones: any = []; // lista visible de exoneraciones

  liquidacion: any = {
    id_liquidacion: null,
    documento: "",
    periodo: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: "E",
    fk_contribuyente: null,
    fk_concepto: 0,
    fk_lote: null,
    fk_orden_inspeccion: 0,
    avaluo: 0,
    cuantia: null,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    total: 0,
    fk_documento_2: null,
    documento_2: "",
    resolucion_numero: "",
    resolucion_fecha: moment(new Date()).format('YYYY-MM-DD'),
    resolucion_autoriza: null,
    resolucion_observacion: "",
    motivo: null,
    detalles: [],
  }

  liqAnular: any = {
    id_liquidacion: null,
    documento: "",
    periodo: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: "E",
    fk_contribuyente: null,
    fk_concepto: 0,
    fk_lote: null,
    fk_orden_inspeccion: 0,
    avaluo: 0,
    cuantia: null,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    total: 0,
    fk_documento_2: null,
    documento_2: "",
    detalles: [], 
  }

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

  onDestroy$: Subject<void> = new Subject();
  fecha = moment().format('YYYY-MM-DD')

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: AnulacionService,
    private cierremesService: CierreMesService
  ) {

    this.commonVarService.selectContribuyenteCustom.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        
        if (res.valid == 13) {
          console.log(res);
          this.contribuyenteActive = res;
          this.conDisabled = false;
          this.vmButtons[3].habilitar = false;
          if (res.fecha_nacimiento != null) {
            // console.log('Super1');
            if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
            ) {
              // console.log('Super');
              this.expandSupervivencia(res.id_cliente);
            }
          }
        }
      }
    );


    this.commonVarService.selectListLiqPURen.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {

        this.restoreForm(false);
        this.formReadOnly = true;

        if(res.fk_documento_2){
          this.msgSpinner = "Obteniendo datos...";
          this.lcargando.ctlSpinner(true);
          this.apiService.getLiqById(res.fk_documento_2).subscribe(
            (res: any) => {
              console.log(res);
              this.liqAnular = res.data;
              this.liqAnular.fecha = res.data.fecha.split(" ")[0];
              this.concepto = this.conceptosBackup.find(c=>(c.id==res.data.fk_concepto));
              this.lcargando.ctlSpinner(false);
            },(err) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.error(err.error.message, 'Error obteniendo liquidación');
            }
            )
        }
  

        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.liquidacion.resolucion_fecha = res.resolucion_fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;
        res.detalles.forEach(e => {
          if(e.concepto){
            if(e.concepto.fk_concepto==32) { //exoneraciones
              let exon = {
                cod_concepto_det_aplicable: e.cod_con_det_aplicado,
                con_det_codigo: e.concepto.codigo_detalle,
                comentario: e.comentario,
                descripcion: e.concepto.nombre_detalle,
                porcentaje: e.total / res.subtotal,
                valor: e.total
              }
              this.exoneraciones.push(exon);
            }else{
              let conc = {
                codigo_detalle: e.concepto.codigo_detalle,
                nombre_detalle: e.concepto.nombre_detalle,
                cantidad: e.cantidad,
                valor: e.valor_unitario,
                comentario: e.comentario,
                total: e.valor,
                aplica: true
              }
              
            this.conceptos.push(conc);
            }
          }else if(e.tasas){
            let conc = {
              codigo_detalle: e.tasas.codigo,
              nombre_detalle: e.tasas.descripcion,
              tipo_calculo: e.tasas.tipo_calculo,
              tipo_tabla: e.tasas.tipo_tabla,
              cantidad: e.cantidad,
              valor: e.valor_unitario ?? e.valor,
              comentario: e.comentario,
              total: e.valor,
              aplica: true,
              valor_excedente: e.tasas.valor_unitario ?? 0
            }

           this.conceptos.push(conc);
          }
        });

  
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
      
      }
    );

    this.commonVarService.selectLiqAnulacion.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res);
        // this.restoreForm();
        // this.formReadOnly = true;
        this.liqAnular = res;
        this.liqAnular.fecha = res.fecha.split(" ")[0];
        this.liquidacion.fk_documento_2 = res.id_liquidacion;
        this.liquidacion.documento_2 = res.documento;

        // this.contribuyenteActive = res.contribuyente;
        this.conceptos = [];
        this.exoneraciones = [];
        res.detalles.forEach(e => {

          if(e.concepto){
            if(e.concepto.fk_concepto==32) { //exoneraciones
              let exon = {
                cod_concepto_det_aplicable: e.cod_con_det_aplicado,
                con_det_codigo: e.concepto.codigo_detalle,
                comentario: e.comentario,
                descripcion: e.concepto.nombre_detalle,
                porcentaje: e.total / res.subtotal,
                valor: e.total
              }
              this.exoneraciones.push(exon);
            }else{
              let conc = {
                codigo_detalle: e.concepto.codigo_detalle,
                nombre_detalle: e.concepto.nombre_detalle,
                cantidad: e.cantidad,
                valor: e.valor_unitario,
                comentario: e.comentario,
                total: e.valor,
                aplica: true
              }
              
            this.conceptos.push(conc);
            }
          }else if(e.tasas){
            let conc = {
              codigo_detalle: e.tasas.codigo,
              nombre_detalle: e.tasas.descripcion,
              tipo_calculo: e.tasas.tipo_calculo,
              tipo_tabla: e.tasas.tipo_tabla,
              cantidad: e.cantidad,
              valor: e.valor_unitario,
              comentario: e.comentario,
              total: e.valor,
              aplica: true,
              valor_excedente: e.tasas.valor_unitario ?? 0
            }

           this.conceptos.push(conc);
          }else{
            let conc = {
              codigo_detalle: "RP",
              nombre_detalle: "REGISTRO DE LA PROPIEDAD",
              cantidad: e.cantidad,
              valor: e.valor_unitario ?? e.valor,
              comentario: e.comentario,
              total: e.valor,
              aplica: true,
            }

           this.conceptos.push(conc);
          }

          
        });

        if (res.subtotal==0){
          this.calcSubtotal();
        }else{
                  
          this.liquidacion.subtotal = res.subtotal;
          this.liquidacion.exoneraciones = res.exoneraciones;
          this.liquidacion.total = res.total;
        }

        this.liquidacion.detalles = res.detalles;
        console.log(this.liquidacion);
         
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
 
      }
    );

   }

   ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenLiqAnu",
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
        orig: "btnsRenLiqAnu",
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
        orig: "btnsRenLiqAnu",
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
        orig: "btnsRenLiqAnu",
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
  
  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.createLiquidacion();
        break;
      case " BUSCAR":
        // this.revisarConcepto();
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

  validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    
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
          // this.getConceptos();
          this.getCatalogos()
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getCatalogos() {
    this.msgSpinner = 'Cargando Catalogos'
    this.lcargando.ctlSpinner(true)
    this.apiService.getCatalogos({ params: "'LIQ MOTIVO'" }).subscribe(
      (res: any) => {
        // console.log()
        res.data['LIQ MOTIVO'].forEach(m => {
          const { id_catalogo, valor, descripcion } = m
          this.motivos = [...this.motivos, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        })
        this.lcargando.ctlSpinner(true)
        this.getConceptos()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  getConceptos() {
    this.msgSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptos().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Conceptos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(c => {
          let concepto = {
            id: c.id_concepto,
            codigo: c.codigo,
            nombre: c.nombre,
            id_tarifa: c.id_tarifa,
            tipo_calculo: c.tipo_calculo,
            tiene_tarifa: c.tiene_tarifa==1 ? true : false //llena el campo con true si tiene tarifa
          }
          this.conceptosBackup.push({...concepto})
        })

        // filtra las listas para conceptos y para anulaciones
        this.conceptosList = this.conceptosBackup.filter(c => (c.codigo!="EX" && c.codigo!="AN" && c.codigo!="BA" ));
        // this.anulacionList = this.conceptosBackup.filter(c => (c.codigo=="AN" || c.codigo=="BA" ));
        this.liquidacion.fk_concepto = this.conceptosBackup.find((c: any) => c.codigo == "AN").id;

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  createLiquidacion() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Anulaciones.", this.fTitle);
      return
    }

      if(this.liquidacion.observacion==""||this.liquidacion.observacion==undefined){
        this.toastr.info("Debe ingresar una observación para la liquidación")
        return;
      } else if(this.conceptos.length<=0||!this.conceptos.length) {
        this.toastr.info("Debe ingresar detalles para la liquidación")
        return;
      }

      Swal.fire({
        icon: "question",
        title: "¡Atención!",
        text: "Está a punto de emitir una Anulación de Liquidación ¿Desea continuar?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {

          this.msgSpinner = 'Verificando período contable...';
          this.lcargando.ctlSpinner(true);
          let datos = {
            "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
            "mes": Number(moment(this.liquidacion.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
             
            /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {

                this.msgSpinner = 'Generando Liquidación...';
                this.lcargando.ctlSpinner(true);
                this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente;
                this.liquidacion.fk_concepto = this.conceptosBackup.find((c: any) => c.codigo == "AN").id;
      
                let data = {
                  concepto_codigo: this.anulacion.codigo,
                  liquidacion: this.liquidacion
                }
                // console.log(this.liquidacion);
                this.apiService.setAnulacion(data).subscribe(
                  (res) => {
                    console.log(res);
                    Swal.fire({
                      icon: "success",
                      title: "Anulación generada",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                    this.liquidacion = res['data'];
                    this.formReadOnly = true;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
                    this.guardarDeuda(res['data'].id_liquidacion);
                    this.lcargando.ctlSpinner(false);
      
                  },
                  (error) => {
                    console.log(error)
                    this.lcargando.ctlSpinner(false);
                    this.toastr.error(error.error.message, 'Error guardando Anulación')
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

  guardarDeuda(id) {
    let data = {
      anulacion: true,
      id_liqAnulada: this.liqAnular.id_liquidacion
    }
    this.apiService.aprobarLiquidacion(data, id).subscribe(
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

  calcSubtotal() {
    let calculo = 0;
    this.conceptos.forEach(e => {
      if (e.aplica) {
        calculo += +e.total; // en este caso es total porque sale de valor unitario * cantidad
      }
    });
    this.liquidacion.subtotal = calculo;
    this.calcExonerTotal();
  }

  calcExonerTotal() {
    // aplica exoneracion a todo el subtotal
    let calculo = 0;
    this.exoneraciones.forEach(e => {
      e.valor = this.liquidacion.subtotal * e.porcentaje;
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

  handleConcepto() {
    this.liqDisabled = false;
    this.observacionesDisabled = false;
  }

  mostrar() {

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
        this.restoreForm(true);
      }
    });
  }

  restoreForm(fullReset: boolean) {
    this.formReadOnly = false;
    this.liqDisabled = true;
    this.observacionesDisabled = true;

    this.verifyRestore = false;

    if(fullReset){
      this.concepto = 0;
      this.anulacion = 0;
    }

    this.liquidacion = {
      id_cliente: null,
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
      fk_documento_2: null,
      documento_2: "",
      detalles: [],
    };

    this.liqAnular = {
      id_liquidacion: null,
      documento: "",
      periodo: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: "E",
      fk_contribuyente: null,
      fk_concepto: 0,
      fk_lote: null,
      fk_orden_inspeccion: 0,
      avaluo: 0,
      cuantia: null,
      observacion: "",
      subtotal: 0,
      exoneraciones: 0,
      total: 0,
      fk_documento_2: null,
      documento_2: "",
      detalles: [], 
    }

    this.contribuyenteActive = {
      razon_social: ""
    };
    
    // this.conceptosBackup = [];
    this.conceptos = [];
    this.exoneracionesBackup = [];
    this.exoneraciones = [];

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
  }

  verificacionTerceraEdad(event) {

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
      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {
          return true
        } else {
          return (false)
        }
      } else {
        return (false)
      }
    } else {
      return (false)
    }

  }

  revisarConcepto() {
    if(!this.anulacion.id || this.anulacion.id == undefined) {
      this.toastr.info("Debe seleccionar un tipo de anulación primero");
      return ;
    } else {
      this.expandListLiquidaciones();
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
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 13;
    }
  }

  expandModalLiquidaciones() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
      return
    }
    
    const modalInvoice = this.modalService.open(ModalLiquidacionesComponent,{
      size:"lg",
      backdrop: "static",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    // modalInvoice.componentInstance.id_concepto = this.concepto.id;
    modalInvoice.componentInstance.codigo = this.concepto.codigo;
    modalInvoice.componentInstance.fk_contribuyente = this.contribuyenteActive.id_cliente;
  }

  expandListLiquidaciones() {
    const modalInvoice = this.modalService.open(ListLiquidacionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.codigo = 'AN';
  }

  expandSupervivencia(id) {
    console.log('canchas')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;
    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }

}
