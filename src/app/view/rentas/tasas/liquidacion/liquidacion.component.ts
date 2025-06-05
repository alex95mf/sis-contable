import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { LiquidacionService } from './liquidacion.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import * as myVarGlobals from 'src/app/global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalTasasComponent } from './modal-tasas/modal-tasas.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
standalone: false,
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
})
export class LiquidacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Liquidación (Tasas Varias)";
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
  staTasas:boolean = false;

  verifyRestore = false;

  conceptosList: any = [];
  concepto: any = 0;

  liquidacion = {
    id: null,
    id_liquidacion: null,
    documento: "",
    periodo: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: "E",
    fk_contribuyente: null,
    fk_concepto: 56,
    fk_lote: null,
    fk_orden_inspeccion: 0,
    avaluo: 0,
    cuantia: null,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    subtotal_0: 0,
    subtotal_1: 0,
    subtotal_2: 0,
    coactiva: 0,
    interes:0,
    descuento:0,
    total: 0,
    detalles: [],
    concepto: {codigo: 'TA'},
    sta: 0,
    recargo:0
  };

  contribuyenteActive: any = {
    razon_social: ""
  };

  conceptosBackup: any = [];
  conceptos: any = [];
  exoneracionesBackup: any = [];
  exoneraciones: any = [];

  tasas: any = [];
  tablasConfigDt: any = [];

  totalCalculo: boolean= true

  skip: number = 0
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: LiquidacionService,
    private cierremesService: CierreMesService
  ) {
    this.commonVarService.selectListLiqPURen.asObservable().subscribe(
      (res) => {
        //(this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';
        //this.lcargando.ctlSpinner(true);
        this.restoreForm();
        this.formReadOnly = true;
        this.totalCalculo = false;
        console.log(res);
        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;
        res.detalles.forEach(e => {
          if(!e.fk_tasas_varias || e.fk_tasas_varias == 0) { //exoneraciones
            let exon = {
              cod_concepto_det_aplicable: e.cod_con_det_aplicado,
              con_det_codigo: e.concepto.codigo_detalle ?? 0,
              comentario: e.comentario,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: e.total / this.liquidacion.subtotal,
              valor: e.total
            }
            this.exoneraciones.push(exon);
          } else if(!e.fk_concepto_detalle || e.fk_concepto_detalle == 0) {

            let conc = {
              codigo: e.tasas.codigo,
              descripcion: e.tasas.descripcion,
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
          }
        });
      //   if (this.liquidacion.fk_orden_inspeccion && this.liquidacion.fk_orden_inspeccion != 0) {
      //     (this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';
      //     this.lcargando.ctlSpinner(true);
      //     let data = {
      //       inspeccion: this.liquidacion.fk_orden_inspeccion
      //     }
      //     this.apiService.getInspeccion(data).subscribe(
      //       (res) => {
      //         //console.log(res);
      //         this.lcargando.ctlSpinner(false);
      //         this.ordenActive = res['data'];
      //       },
      //       (error) => {

      //       }
      //     );
      //   }
      //   this.conceptos.forEach(e => {
      //     if (e.valor == 0) {
      //       e.aplica = false;
      //     }
      //   });

        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
        //this.calcTotal();
      //   //this.lcargando.ctlSpinner(false);
      }
    )
    this.commonVarService.selectExonerLiqPURen.asObservable().subscribe(
      (res) => {
        this.exoneraciones = res;
        console.log(res)
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });
        this.calculateExoneraciones();
      }
    );
    this.commonVarService.selectConcepLiqLCRen.asObservable().subscribe(
      (res) => {
        this.conceptos = res;
        console.log(res)
        this.calculateExoneraciones();
      }
    );
    this.commonVarService.selectConceptoCustom.asObservable().subscribe( //escucha de modal tasas tmbn
      (res) => {
        console.log(res)
        this.conceptos = res;
        this.observacionesDisabled = false;
        this.conceptosDisabled = false;
        this.exoneracionDisabled = false;

        this.conceptos.forEach(c => {
          if(c.cantidad==0){
            if(c.tipo_calculo=="VA" || "FA"){ // INICIALIZADO EN 1 PARA VALOR PORQUE ES EL TOTAL Y PARA FACTOR PARA MULTIPLICAR POR 1
              c.cantidad = 1;
              c.total = c.valor;
            // }else if(c.tipo_calculo=="FA"){
            //   c.cantidad = 1;
            //   c.total = c.valor;
            }else if(c.tipo_calculo=="TA"){ // TABLA DEPENDERA DE INGRESAR ALGO EN CANTIDAD COMO FACTOR1
              c.cantidad = undefined;
              c.total = 0; //
            }else { // PARA INPUT DEPENDERA DE INGRESAR ALGO EN VALOR DIRECTAMENTE
              c.cantidad = 1;
              c.total = 0; //
            }
          }
        })

        this.calcSubtotal();
      }
    );

    this.commonVarService.selectContribuyenteCustom.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        //console.log(res);
        this.contribuyenteActive = res;
        this.observacionesDisabled = false;
        this.conceptosDisabled = false;
        this.exoneracionDisabled = false;
        // this.ordenDisabled = false;
        this.vmButtons[3].habilitar = false;

        if (res.valid == 5) {

          if (res.fecha_nacimiento != null) {
            if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
            ) {
              this.expandSupervivencia(res.id_cliente);
              console.log(res);

            }
          }
          else {
            console.log("hola")
          }
        }
        // (res) => {

        //   if (res.valid == 5) {

        //     if (res.fecha_nacimiento != null) {
        //       if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
        //       ) {
        //         this.expandSupervivencia(res.id_cliente);
        //         console.log(res);

        //       }
        //     }
        //     else {
        //       console.log("hola")
        //     }
        //   }


        // }
      }
    );
    this.commonVarService.limpiarSupervivencia.asObservable().subscribe(
      (res)=>{
        this.contribuyenteActive = {}
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

    // this.filter = {
    //   descripcion: undefined,
    //   rango_desde: undefined,
    //   rango_hasta: undefined,
    //   valor: undefined,
    //   filterControl: "",
    // };

    // // TODO: Habilitar codigo en Backend
    // this.paginate = {
    //   length: 0,
    //   perPage: 10,
    //   page: 1,
    //   pageSizeOptions: [5, 10, 20, 50]
    // };

    setTimeout(() => {
      this.validaPermisos();
      this.validarSta();
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

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos...';
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
          this.conceptosList.push({...concepto})
        })

        // filtra concepto DE TABLA
        this.conceptosList = this.conceptosList.filter(c => (c.codigo=="TA" ));
        console.log(this.conceptos);
        this.cargarTablasConfig();
        // this.getCatalogos();
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contribuyentes')
      }
    )
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

  cargarTablasConfig() {
    (this as any).mensajeSpinner = "Cargando listado de tablas...";
    // this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        // filter: this.filter,
        // paginate: this.paginate,
        control:""
      }
    }

    this.apiService.getTablasConfig(data).subscribe(
      (res) => {
        console.log(res);
        this.tablasConfigDt = res['data'];
        // this.paginate.length = res['data']['total'];
        // if (res['data']['current_page'] == 1) {
        //   this.tablasConfigDt = res['data']['data'];
        // } else {
        //   this.tablasConfigDt = Object.values(res['data']['data']);
        // }
        // this.lcargando.ctlSpinner(false);
        this.getCatalogos();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  getCatalogos() {
    let data = {
      params: "'REN_TIPO_TABLA_TASA'",
    };
    this.apiService.getCatalogo(data).subscribe(

      (res) => {

        this.tasas = res["data"]['REN_TIPO_TABLA_TASA'];
        this.lcargando.ctlSpinner(false);
        // console.log(this.tasas);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
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
      else if(this.liquidacion.total<0) {
        this.toastr.info("El valor de total cobro no puede ser negativo")
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
                this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente;
                // this.liquidacion.fk_concepto = this.concepto.id;
                // this.liquidacion.fk_orden_inspeccion = this.ordenActive.id_inspeccion_orden;
                this.liquidacion.detalles = [];
                this.conceptos.forEach(e => {
                  if (e.aplica) {
                    this.liquidacion.detalles.push(e);
                  }
                });
                this.exoneraciones.forEach(e => {
                  this.liquidacion.detalles.push(e);
                });
                let data = {
                  concepto_codigo: "EP",
                  liquidacion: this.liquidacion
                }
                console.log(this.liquidacion);
                this.apiService.setLiquidacionTA(data).subscribe(
                  (res) => {
                    Swal.fire({
                      icon: "success",
                      title: "Liquidación generada",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                    console.log(res);
                    this.liquidacion = res['data']
                    this.liquidacion.subtotal_1 = parseFloat(res['data']['subtotal']) - parseFloat(res['data']['exoneraciones'])
                    //this.calcSubtotal()
                    // let concepto = res['data']['documento'].split('-')
                    // this.liquidacion = {...this.liquidacion,documento: 'TA-'+concepto[1]+'-'+concepto[2] }
                    this.formReadOnly = true;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
                    this.guardarDeuda(res['data'].id_liquidacion);
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

  calcTablasValor(det) {
    let total = 0;
    // es necesario no alterar la tabla original
    let tablasFiltradas = this.tablasConfigDt.filter(t => (t.tipo_tabla == det.tipo_tabla));
    console.log(tablasFiltradas)
    let cant = parseFloat(det.cantidad);

    tablasFiltradas.forEach(t => {
      if(t.rango_hasta>0 ){
        // cuando esta en un rango de valores normal
        if(cant >= t.rango_desde && cant <= t.rango_hasta ){
          total = t.valor;
          if(t.valor_excedente>0){ //en caso que tenga excedente
            det.valor_excedente = t.valor_excedente;
            det.valor = t.valor_excedente;
            let resta = +det.cantidad - +t.rango_desde;
            let producto = +resta * +t.valor_excedente;
            total = +total + +producto;
          } else {det.valor = 0; det.valor_excedente=0;}
        }
      } else if(t.rango_hasta==0 ){
        // cuando el rango hasta es infinito
        if(cant >= t.rango_desde){
          total = t.valor;
          if(t.valor_excedente>0){ //en caso que tenga excedente
            det.valor_excedente = t.valor_excedente;
            det.valor = t.valor_excedente;
            let resta = +det.cantidad - +t.rango_desde;
            let producto = +resta * +t.valor_excedente;
            total = +total + +producto;
          } else {det.valor = 0; det.valor_excedente=0;}
        }
      }
    })
    det.total = total;
    this.calcSubtotal();
  }

  multiplicar(det) {
    let total = det.cantidad * det.valor;
    det.total = total;
    console.log(det);
    this.calcSubtotal();
  }


  calculateConceptos() {

    this.calcSubtotal();
    this.calcTotal();
  }

  calculateExoneraciones() {

    this.calcExonerTotal();

    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));

    this.calcSubtotal_1();
  }

  calcSubtotal() {
    let calculo = 0;
    this.conceptos.forEach(e => {
      if (e.aplica) {
        calculo += +e.total; // en este caso es total porque sale de valor unitario * cantidad
      }
    });
    this.liquidacion.subtotal = calculo;
    this.liquidacion.subtotal_0 = calculo;
    this.calcExonerTotal();
  }

  calcExonerTotal() {
    // aplica exoneracion a todo el subtotal
    let porcentaje = 0;
    //let calculo = 0;
    // this.exoneraciones.forEach(e => {
    //   e.valor = this.liquidacion.subtotal * e.porcentaje;
    //   calculo += +e.valor
    //   // porcentaje += +e.porcentaje
    // });
    // if (porcentaje >= 1) {
    //   // si la suma de los porcentajes es 100% o mas
    //   calculo = this.liquidacion.subtotal;
    // } else {
    //   // si la suma de los porcentajes es menor al 100%
    //   calculo = (this.liquidacion.subtotal * porcentaje);
    // }
    //this.liquidacion.exoneraciones = calculo;
    // this.liquidacion.exoneraciones = Math.floor(this.exoneraciones.reduce((acc: number, curr: any) => {
    //   Object.assign(curr, {valor: this.liquidacion.subtotal * curr.porcentaje})
    //   return acc + (this.liquidacion.subtotal * curr.porcentaje)
    // }, 0) * 100) / 100;

    const calculo = this.exoneraciones.reduce((acc, curr) => {
      const valor = Math.floor(this.liquidacion.subtotal * curr.porcentaje * 100) / 100
      Object.assign(curr, {valor})
      return acc + valor
    }, 0)
    this.liquidacion.exoneraciones = calculo

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

  calcTotal() {

      let sumasValores =  (this.liquidacion.subtotal_2 + this.liquidacion.recargo + this.liquidacion.interes)
      this.liquidacion.total = sumasValores - this.liquidacion.descuento;

    this.vmButtons[0].habilitar = false;
  }

  removeConcepto(index) {
    this.conceptos[index].valor = 0;
    this.conceptos[index].aplica = false;
    this.conceptos.splice(index,1);
    this.calcSubtotal();
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calcExonerTotal();
  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
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
      concepto: 'TA'
    };
    (this as any).mensajeSpinner = 'Validadando Sta...';
    this.lcargando.ctlSpinner(true);

    this.apiService.getStaConcepto(data).subscribe(
      (res) => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        if(res['data'].length > 0){
          const datos = res['data'].filter(e => e.codigo == 'TA')[0]
          if(datos.tiene_sta == 'S') {
            console.log(datos.tiene_sta)
            this.staTasas= false;
          }else{
            this.staTasas= true;
          }
        }else{
          this.staTasas= true;
        }
        console.log(this.staTasas)
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error validando STA');
      }
    );
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
  expandSupervivencia(id) {
    console.log('terreno')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;
    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

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
    modalInvoice.componentInstance.id_concepto = 56;
    modalInvoice.componentInstance.conceptos = this.conceptos;
    modalInvoice.componentInstance.fTitle = "Conceptos por locales comerciales";
  }

  expandTasas() {
    const modalInvoice = this.modalService.open(ModalTasasComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.tasas = this.tasas;
    modalInvoice.componentInstance.conceptos = this.conceptos;
    modalInvoice.componentInstance.fTitle = "Conceptos por tasas";
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
      modalInvoice.componentInstance.validacion = 5;
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
      id_liquidacion: null,
      documento: "",
      periodo: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: "E",
      fk_contribuyente: null,
      fk_concepto: 56,
      fk_lote: null,
      fk_orden_inspeccion: 0,
      avaluo: 0,
      cuantia: null,
      observacion: "",
      subtotal: 0,
      exoneraciones: 0,
      subtotal_0: 0,
      subtotal_1: 0,
      subtotal_2: 0,
      coactiva: 0,
      interes:0,
      descuento:0,
      total: 0,
      detalles: [],
      concepto: {codigo: 'TA'},
      sta: 0,
      recargo:0
    };

    this.contribuyenteActive = {
      razon_social: ""
    };

    this.conceptosBackup = [];
    this.conceptos = [];
    this.exoneracionesBackup = [];
    this.exoneraciones = [];

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
  }

  async getUltimoRegistro(skip: number = 0) {
    this.skip = skip;
    (this as any).mensajeSpinner = 'Cargado Registro'
    this.lcargando.ctlSpinner(true);
    try {
      const conceptos = [this.conceptosList[0].id]
      const response = await this.apiService.getUltimoRegistro({conceptos, skip})
      console.log(response)
      this.commonVarService.selectListLiqPURen.next(response.data[0]);
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Registro')
    }
  }

  async getAnterior() {
    this.skip = (this.liquidacion.id_liquidacion) ? this.skip + 1 : 0
    await this.getUltimoRegistro(this.skip)
  }

  async getSiguiente() {
    this.skip = (this.skip > 0) ? this.skip - 1 : 0
    await this.getUltimoRegistro(this.skip)
  }

}
