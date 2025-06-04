import { Component, OnInit, ViewChild } from '@angular/core';

import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
 import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
//import { ModalConceptosComponent } from 'src/app/config/custom/modal-conceptos/modal-conceptos.component';
import { MultasService } from './multas.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { ModalLocalesComponent } from './modal-locales/modal-locales.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
@Component({
standalone: false,
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.scss']
})

export class MultasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Multas (Locales Comerciales)";
  mensajeSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  
  base_RBU = 450;

  tipo: any = 0;

  exoneracionesBackup: any = [];
  exoneraciones: any = [];

  opciones = [
    {
      value: 1,
      label: 'Orden de inspección',
    },{
      value: 2,
      label: 'Local comercial',
    },{
      value: 3,
      label: 'Contribuyente',
    },
  ]

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
  contribuyenteDisabled = false;


  showInspecciones = false;
  showLocales = false;

  verifyRestore = false;

  staMulta:boolean = false

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
    fk_local: 0,
    avaluo: 0,
    cuantia: null,
    observacion: "",
    subtotal: 0,
    subtotal_0:0,
    exoneraciones: 0,
    total: 0,
    subtotal_1:0,
    subtotal_2:0,
    coactiva: 0,
    interes: 0,
    descuento:0,
    recargo:0,
    detalles: [],
    concepto: {codigo: 'ML'},
    sta:0,
  };

  contribuyenteActive: any = {
    razon_social: ""
  };
  
  conceptosBackup: any = [];
  conceptos: any = [];

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

  localActive: any = {
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
  }

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: MultasService,
    private cierremesService: CierreMesService
  ) {
    this.commonVarService.selectListLiqPURen.asObservable().subscribe(
      (res) => {
        //this.mensajeSpinner = 'Cargando datos de la Liquidación...';
        //this.lcargando.ctlSpinner(true)
        this.restoreForm();
        this.formReadOnly = true;
        console.log(res);
        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;
        // res.detalles.forEach(e => {
        //   Object.assign(this.conceptos.find(c => e.fk_concepto_detalle == c.fk_concepto_detalle), {comentario: e.comentario, valor: e.valor});
        // });

        res['detalles'].forEach(e => {
          if (e.fk_con_det_aplicado) {
            let exon = {
              cod_concepto_det_aplicable: e.cod_con_det_aplicado,
              con_det_codigo: e.concepto?.codigo_detalle,
              comentario: e.comentario,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: e.porcentaje,
              valor: e.total
            }
            this.exoneraciones.push(exon);
          }

                Object.assign(e, {
                  valor:  e.valor!=0?e.valor:e.valor_unitario,
                  fk_concepto_detalle: e.id_concepto_detalle,
                  comentario: e.comentario,
                  nombre_detalle: e.concepto.nombre_detalle,
                  codigo_detalle: e.concepto.codigo_detalle,
                  aplica: true
                });
                // let concepto = {
                //   valor: e.valor,
                //   fk_concepto_detalle: e.id_concepto_detalle,
                //   comentario: e.comentario,
                //   aplica: true
                // }
                this.conceptos.push(e);
              })
              
          console.log(this.conceptos);
        // this.conceptos = res.detalles;
        if (this.liquidacion.fk_orden_inspeccion && this.liquidacion.fk_orden_inspeccion != 0) {
          this.tipo = 1;
          this.showInspecciones = true;
          this.mensajeSpinner = 'Cargando datos de la Liquidación...';
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
        } else if (this.liquidacion.fk_local && this.liquidacion.fk_local != 0) {
          this.tipo = 2;
          this.showLocales = true;
          this.localActive = res.local;
        }
        // this.conceptos.forEach(e => {
        //   if (e.valor == 0) {
        //     e.aplica = false;
        //   } else {
        //     e.aplica = true;
        //   }
        // });

        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;

       // this.calcTotal();
        
        //this.lcargando.ctlSpinner(false);
      }
    );
    this.apiService.listaConceptos$.subscribe(
      (res: any) => {
        console.log(res)
        if(res.length > 0 ){
          this.contribuyenteDisabled = true;
        }else{
          this.contribuyenteDisabled = false;
        }
        this.conceptos = res;
        this.conceptos.sort(function(a,b) {
          return parseFloat(a.id_concepto_detalle) - parseFloat(b.id_concepto_detalle);
        });
        this.conceptos.forEach(c => {
          if(c.codigo_detalle === "TALC"){
            Object.assign(c, { porcentaje: parseFloat("0.00"), base:parseFloat("0.00") ,disabled:true })
          }else{
            Object.assign(c, { porcentaje: parseFloat("0.00"), base: this.base_RBU,disabled:false })
          }
        })
        console.log(this.conceptos)
        this.calcSubtotal();
      }
    )

    this.commonVarService.selectConceptoCustom.asObservable().subscribe(
      (res) => {
        // console.log(res)
        // if(res.length > 0 ){
        //   this.contribuyenteDisabled = true;
        // }else{
        //   this.contribuyenteDisabled = false;
        // }
        // this.conceptos = res;
        // this.conceptos.sort(function(a,b) {
        //   return parseFloat(a.id_concepto_detalle) - parseFloat(b.id_concepto_detalle);
        // });
        // this.conceptos.forEach(c => {
        //   if(c.codigo_detalle === "TALC"){
        //     Object.assign(c, { porcentaje: parseFloat("0.00"), base:parseFloat("0.00") ,disabled:true })
        //   }else{
        //     Object.assign(c, { porcentaje: parseFloat("0.00"), base: this.base_RBU,disabled:false })
        //   }
        // })
        // console.log(this.conceptos)
        // this.calcSubtotal();
      }
    );

    this.commonVarService.selectInspeccionRentas.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.ordenActive = res;
      }
    );

    this.commonVarService.selectLocalInspeccion.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.localActive = res;
      }
    );

    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.contribuyenteActive = res;
        this.ordenDisabled = false;
        this.observacionesDisabled = false;
       // this.conceptosDisabled = false;
        this.exoneracionDisabled = false;
        this.vmButtons[3].habilitar = false;
      }
    );
    this.commonVarService.selectExonerLiqPURen.asObservable().subscribe(
      (res) => {
        this.exoneraciones = res;
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det'],
   })
        });
        this.calculateExoneraciones();
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
      this.validarSta();
    }, 0);
  }

  validaPermisos = () => {
    this.mensajeSpinner = 'Cargando Permisos de Usuario...'
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

  changeAplica(evento) {
    console.log(evento);
    if(evento===0 || evento===undefined){
      this.conceptosDisabled = true;
    }
    else if(evento===1){
      this.showInspecciones = true;
      this.showLocales = false;
      this.conceptosDisabled = false;

      this.localActive = {
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
      };

    }else if(evento===2){
      this.showInspecciones = false;
      this.showLocales = true;
      this.conceptosDisabled = false;

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
      };

    }else if(evento===3){
      this.showInspecciones = false;
      this.showLocales = false;
      this.conceptosDisabled = false;

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
      };

      this.localActive = {
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
      };
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

    this.showInspecciones = false;
    this.showLocales = false;
    this.tipo = 0;

    this.verifyRestore = false;
    this.contribuyenteDisabled = false;

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
      fk_local: 0,
      avaluo: 0,
      cuantia: null,
      observacion: "",
      subtotal: 0,
      subtotal_0:0,
      exoneraciones: 0,
      total: 0,
      subtotal_1:0,
      subtotal_2:0,
      coactiva: 0,
      interes: 0,
      descuento:0,
      recargo:0,
      detalles: [],
      concepto: {codigo: 'ML'},
      sta:0,
    };

    this.contribuyenteActive = {
      razon_social: ""
    };
    
    // this.conceptosBackup = [];
    // this.conceptos.forEach(e => {
    //   e.comentario = "",
    //   e.valor = 0,
    //   e.aplica = false
    // });
    this.conceptos=[];

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
    };

    this.localActive = {
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
    };
  }

  getConceptos() {
    this.mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      id_concepto: 48
    }
    // this.apiService.getConceptoDetalle(data).subscribe(
    //   (res) => {
    //     console.log(res);
    //     res['data'].forEach(e => {
    //       Object.assign(e, {
    //         valor: 0,
    //         fk_concepto_detalle: e.id_concepto_detalle,
    //         comentario: "",
    //         aplica: false
    //       });
    //     })
    //     this.conceptos = JSON.parse(JSON.stringify(res['data']));
    //     this.totalConceptos = JSON.parse(JSON.stringify(res['data']));
    //     this.lcargando.ctlSpinner(false);
    //   },
    //   (error) => {
    //     this.lcargando.ctlSpinner(true);
    //     this.toastr.error(error.error.message, 'Error cargando Conceptos');
    //   }
    // );
  }

  calculateConceptos() {
    /*if (this.propiedadActive.valor_edificacion > 0) {
      this.conceptos.find(e => e.codigo_detalle == "IMP").valor = this.propiedadActive.avaluo * 0.0023;
    } else {
      // this.conceptos.find(e => e.codigo_detalle == "SNE").valor = this.propiedadActive.avaluo * 0.002;
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

  calcPorcConcepto(concepto: any) {
    concepto.valor = concepto.total = parseFloat(concepto.porcentaje) * this.base_RBU
    this.calcSubtotal()
  }

  calcSubtotal() {
    console.log('calculando...')
    let calculo = 0;
    this.conceptos.forEach(e => {
      if (e.aplica && e.valor>0) {
        calculo += parseFloat(e.valor);
      }
    });
    this.liquidacion.subtotal = calculo;
    this.liquidacion.subtotal_0 = calculo;
    //this.calcTotal();
    this.calcExonerTotal();
  }

  /*calcExonerTotal() {
    let calculo = 0;
    this.exoneraciones.forEach(e => {
      e.valor = this.conceptos.find(c => e.cod_concepto_det_aplicable == c.codigo_detalle).valor * e.porcentaje;
      calculo += +e.valor
    });
    this.liquidacion.exoneraciones = calculo;
    this.calcTotal();
  }*/

  calcTotal() {
    
    let sumasValores =  (this.liquidacion.subtotal_2 + this.liquidacion.recargo + this.liquidacion.interes)
    this.liquidacion.total = sumasValores - this.liquidacion.descuento;

    this.vmButtons[0].habilitar = false;
  }

  // calcTotal() {
  //   let subtotal_1 = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
  //   this.liquidacion.subtotal_1 = subtotal_1;
  //   this.liquidacion.total = subtotal_1;
  //   // if (preTotal > 0) {
  //   //   this.liquidacion.subtotal_1 = preTotal;
  //   //   this.liquidacion.total = preTotal;
  //   // } else {
  //   //   this.liquidacion.subtotal_1 =0
  //   //   this.liquidacion.total = 0;
  //   // }
  //   this.vmButtons[0].habilitar = false;
  // }

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
         else if(this.liquidacion.total<0) {
          this.toastr.info("El valor de total cobro no puede ser negativo")
          return;
        }
        else if(this.conceptos.length != 0 ) {
        
          for (let index = 0; index < this.conceptos.length; index++) {
            if (this.conceptos[index].valor <= 0 || this.conceptos[index].valor == null) {
              this.toastr.info("El concepto "+this.conceptos[index].codigo_detalle+ " debe tener un total mayor a 0" );
              return;
            } 
          }
        }
       
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

          this.mensajeSpinner = 'Verificando período contable...';
          this.lcargando.ctlSpinner(true);
          let datos = {
            "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
            "mes": Number(moment(this.liquidacion.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
             
            /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {
                    
                this.mensajeSpinner = 'Generando Liquidación...';
                this.lcargando.ctlSpinner(true);
                this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente;
                if(this.showInspecciones){
                  this.liquidacion.fk_orden_inspeccion = this.ordenActive.id_inspeccion_orden;
                } else { this.liquidacion.fk_orden_inspeccion = 0;}
                if(this.showLocales){
                  this.liquidacion.fk_local = this.localActive.id_local;
                } else { this.liquidacion.fk_local = 0;}
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
                console.log(data);
                // this.lcargando.ctlSpinner(false);
                // return ;
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
                    this.calcSubtotal();
                    this.formReadOnly = true;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
                    this.lcargando.ctlSpinner(false);
                    
                    // linea para generar deuda
                    // this.guardarDeuda(res['data'].id_liquidacion);
                    // ya no se genera la deuda directamente sino que se tiene que aprobar desde otra pantalla
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

  removeConcepto(index) {
    // this.conceptos[index].aplica = false;
    this.conceptos.splice(index,1);
    if(this.conceptos.length == 0 || this.conceptos==undefined){
      this.contribuyenteDisabled=false;
    }else{
      this.contribuyenteDisabled=true;
    }
    this.calcSubtotal();
  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  validarSta(){
    let data = {
      concepto: 'ML'
    }
    this.mensajeSpinner = 'Validadando Sta...';
    this.lcargando.ctlSpinner(true);
   
    this.apiService.getStaConcepto(data).subscribe(
      (res) => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        if(res['data'].length > 0){
          const datos = res['data'].filter(e => e.codigo == 'ML')[0]
          if(datos.tiene_sta == 'S') {
            console.log(datos.tiene_sta)
            this.staMulta= false; 
          }else{
            this.staMulta= true; 
          }
        }else{
          this.staMulta= true; 
        }
        console.log(this.staMulta)
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error validando STA');
      }
    );
  }

  calculateExoneraciones() {

    ///// CALCULOS AUTOMATICOS EXONERACIONES
    
    this.calcExonerTotal();
    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));
    this.calcTotal();
  }

  calcExonerTotal() {
    // aplica exoneracion a todo el subtotal
    const calculo = this.exoneraciones.reduce((acc, curr) => {
      const valor = Math.floor(this.liquidacion.subtotal * curr.porcentaje * 100) / 100
      Object.assign(curr, {valor})
      return acc + valor
    }, 0)
    this.liquidacion.exoneraciones = calculo
    //this.calcTotal();
    this.calcSubtotal_1()
  }

  calcSubtotal_1() {
    let subtotal_1 = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
    this.liquidacion.subtotal_1 = subtotal_1;
  
    this.calcSubtotal_2();
  }
  calcSubtotal_2() {
      let subtotal_2 = this.liquidacion.subtotal_1 + this.liquidacion.sta;
      this.liquidacion.subtotal_2 = subtotal_2;
      this.calcTotal();
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

  expandConceptos() {
    const modalInvoice = this.modalService.open(ModalConceptosComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.id_concepto = 48;
    modalInvoice.componentInstance.codigo = "ML";
    modalInvoice.componentInstance.conceptos = this.conceptos;
    modalInvoice.componentInstance.fTitle = "Conceptos por multas";
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

  expandLocales() {
    const modalInvoice = this.modalService.open(ModalLocalesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive;
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
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive;    
  }

}

