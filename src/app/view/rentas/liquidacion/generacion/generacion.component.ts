import { Component, OnInit, ViewChild, Inject, NgZone, PLATFORM_ID, OnDestroy } from '@angular/core';

import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { GeneracionService } from './generacion.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';

import { isPlatformBrowser } from '@angular/common';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';

//import e from 'cors';

@Component({
standalone: false,
  selector: 'app-generacion',
  templateUrl: './generacion.component.html',
  styleUrls: ['./generacion.component.scss']
})
export class GeneracionComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = "Generación de Liquidación"
  mensajeSpinner: string
  vmButtons = []
  dataUser: any
  permissions: any
  empresLogo: any
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm')

  private chart: am4charts.XYChart;

  liquidacion = {
    id: null,
    contribuyente: 0,
    fecha: new Date().toDateString(),
    estado: 'E',
    concepto: 0,
    documento: '',
    observaciones: '',
    fk_arancel: null,
    total: 0,
    subtotal:0,
    sta:0,
    exoneraciones:0,
    detalles: [],
    subtotal_0: 0,
    subtotal_1: 0,
    subtotal_2: 0,
    recargo: 0,
    coactiva: 0,
    interes: 0,
    descuento: 0,
  }
  detallesNew: any = [];
  queryMode: boolean = false;
  formDisabled: boolean = false;
  concDisabled: boolean = true;
  selectConcepto = true

  contribuyentes = [];
  constribuyenteActive: any = {};
  conceptos = [];
  formReadOnly = false;

  onDestroy$: Subject<void> = new Subject();

  conceptoCementerio: boolean = true;
  conceptoCentroMedico: boolean = true;
  conceptoComplejoAcacias: boolean = true;
  conceptoComplejoLibertad: boolean = true;
  nombre_concepto = ""
  exoneraciones: any = [];
  exoneracionesBackup: any = [];
  codigo_concepto = ""

  configuracion = {
    tercera_edad: false,
    pertenece_coop: false,
    artesano: false,
    discapacitado: false,
    privada_sin_lucro: false,
    institucion_publica: false,
    perdidas_resultados: false,
    empresa_publica: false,
    tipo_persona_juridica: ''
  }

  conceptoExoneracion:boolean = true;
  conceptoSta:boolean = true;
  tieneExoneracion = ""
  tieneSta =""

  skip = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: GeneracionService,
    private cierremesService: CierreMesService,
  ) {
    this.commonVarService.addLiquidacion.asObservable().subscribe(
      (res) => {
        let total = 0;
        this.liquidacion.detalles = [];
        Object.assign(this.detallesNew, JSON.parse(JSON.stringify(res)));
        this.detallesNew.forEach(d => {
          if (d.action == true) {
            let detalle = {
              cantidad: 1,
              fk_concepto_detalle: d,
              codigo: d.codigo_detalle,
              descripcion: d.codigo_detalle + " - " + d.nombre_detalle,
              valor: +d.valor,
              total: +d.valor
            }
            this.liquidacion.detalles.push({ ...detalle })
          }
        });
        this.calcularTotal();

        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[4].habilitar = true;
      }
    );

    this.commonVarService.editLiquidacion.asObservable().subscribe(
      res => {
        console.log(res)
        this.conceptoCementerio = true
        if(res.liquidacion.concepto.tiene_exoneracion == "S"){
          this.conceptoExoneracion = false
        }
        else if (res.liquidacion.concepto.tiene_exoneracion == "N"
                || res.liquidacion.concepto.tiene_exoneracion ==""
                || res.liquidacion.concepto.tiene_exoneracion == undefined){
                  this.conceptoExoneracion = true
                }
        else{
          this.conceptoExoneracion = true
        }
        if(res.liquidacion.concepto.tiene_sta == "S"){
          this.conceptoSta = false
        }
        else if (res.liquidacion.concepto.tiene_sta == "N"
                || res.liquidacion.concepto.tiene_sta ==""
                || res.liquidacion.concepto.tiene_sta == undefined){
                  this.conceptoSta = true
                }
        else{
          this.conceptoSta = true
        }
        // if(res.liquidacion.concepto.nombre == "CEMENTERIO"){
        //   this.conceptoCementerio = false
        //   this.conceptoCentroMedico = true
        //   this.conceptoComplejoAcacias = true
        // }
        // else if (res.liquidacion.concepto.nombre == "CENTRO MEDICO"){
        //   this.conceptoCentroMedico = false
        //   this.conceptoCementerio = true
        //   this.conceptoComplejoAcacias = true
        // }
        // else if (res.liquidacion.concepto.nombre == "COMPLEJO ACACIAS" || res.liquidacion.concepto.nombre == "COMPLEJO LIBERTAD"){
        //   this.conceptoCentroMedico = true
        //   this.conceptoCementerio = true
        //   this.conceptoComplejoAcacias = false
        // }
        // else{
        //   this.conceptoCentroMedico = true
        //   this.conceptoCementerio = true
        //   this.conceptoComplejoAcacias = true
        // }
        this.formDisabled = true;
        this.selectConcepto = true

        this.constribuyenteActive = {
          id: res.contr.id_cliente,
          tipoDocumento: res.contr.tipo_documento,
          numeroDocumento: res.contr.num_documento,
          razonSocial: res.contr.razon_social,
        }

        let liq = res.liquidacion;

        this.exoneraciones = []
        this.liquidacion = {
          id: liq.id_liquidacion,
          // contribuyente: this.contribuyentes.find(c => c.id === liq.contribuyente.id_cliente),
          contribuyente: this.constribuyenteActive,
          concepto: this.conceptos.find(c => c.id === liq.concepto.id_concepto),
          fecha: moment(liq.fecha).format('YYYY-MM-DD'),
          estado: liq.estado,
          documento: liq.documento,
          fk_arancel: null,
          total: liq.total,
          observaciones: liq.observacion,
          subtotal:liq.subtotal,
          sta:liq.sta,
          exoneraciones:liq.exoneraciones,
          detalles: [],
          subtotal_0: liq.subtotal_0,
          subtotal_1: liq.subtotal_1,
          subtotal_2: liq.subtotal_2,
          recargo: liq.recargo,
          coactiva: liq.coactiva,
          interes: liq.interes,
          descuento: liq.descuento,
        }

        if (liq.detalles.length > 0) {
          liq.detalles.forEach(d => {

            // fk_concepto: 32 => Exoneracion
            if(d.concepto.fk_concepto != 32){
              let detalle = {
                id: d.id_liquidacion_detalle,
                descripcion: d.concepto ? `${d.concepto.codigo_detalle} - ${d.concepto.nombre_detalle}` : "N/A",
                cantidad: d.cantidad,
                valor: d.valor,
                total: d.total
              }
              this.liquidacion.detalles.push({ ...detalle })
            }
            else{
              let exon = {
                cod_concepto_det_aplicable: d.cod_con_det_aplicado,
                con_det_codigo: d.concepto.codigo_detalle,
                comentario: d.comentario,
                descripcion: d.concepto.nombre_detalle,
                porcentaje: d.porcentaje,
                valor: d.valor
              }
              this.exoneraciones.push(exon);
            }

          })
        }

        // document.getElementById("button-add-detalle").setAttribute("disabled", "");
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
        this.vmButtons[4].habilitar = false
      }
    );

    /* this.commonVarService.selectListLiqRP.asObservable().subscribe(
      (res) => {
        if (res) {
          this.selectTodaLiquidacion(res);
        }
      }

    ); */

    this.commonVarService.selectContribuyenteLiqRen.asObservable().subscribe(
      (res) => {
        this.selectContribuyente(res);
      }
    );

    this.commonVarService.selectContribuyenteCustom.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
     console.log(res)
        if (res.valid == 3) {
          this.selectContribuyente(res);

          // Obtener si es 3ra Edad
          if (res.fecha_nacimiento != null) {
            console.log(res.supervivencia)
            this.configuracion.tercera_edad = this.verificacionTerceraEdad(res.fecha_nacimiento)
            if (res.contribuyente == "Natural" && (res.supervivencia == "SI" || res.supervivencia == 'S') && this.configuracion.tercera_edad) {
              // console.log("Holis")
              this.expandSupervivencia(res.id_cliente);

            }
          }

          // Pertenece a Cooperativa
          if (res.ta_pertenece_cooperativa != null) {
            this.configuracion.pertenece_coop = res.ta_pertenece_cooperativa == 1
          }

          // Es artesano
          if (res.ar_artesano != null) {
            this.configuracion.artesano = res.ar_artesano == 1
          }

          // Tipo de Persona Juridica
          if (res.tipo_persona_juridica != null) {
            this.configuracion.tipo_persona_juridica = res.tipo_persona_juridica
          }

        }

      }
    );

    this.apiService.exoneracionesSelected$.subscribe(
      (res) => {
        console.log(res)
        this.exoneraciones = res;

        this.calcExonerTotal()
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });
       // this.calculateExoneraciones();
      }
    );


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
        habilitar: false,
      },
      {
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "far fa-edit", texto: "ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
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
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
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
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: true,
        printSection: "PrintSection", imprimir: true
      }
    ]

    this.constribuyenteActive = 0;

    this.liquidacion.fecha = moment(this.liquidacion.fecha).format('YYYY-MM-DD')
    setTimeout(() => {

      this.validaPermisos();
    }, 0)

  }


  verificacionTerceraEdad(event) {
    /* let hoy = moment()
    let nacimiento = moment(event)

    let anio_diff = hoy.diff(nacimiento, 'years')
    return anio_diff >= 65 */

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


  expandSupervivencia(id) {
    console.log('generacion')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;
    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }



  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      }

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY.value}";

      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    });

  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.onDestroy$.next(null);
    this.onDestroy$.complete();

    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fRenTarifa,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        }
        else {
          setTimeout(() => {
            // this.getContribuyentes()
            this.getConceptos();
          }, 0)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "LIMPIAR":
        this.nuevaLiquidacion()
        break;
      case "GUARDAR":
        this.validaLiquidacion()
        break;
      case "IMPRIMIR":

        break;
      case "BUSCAR":
        this.expandListLiquidaciones();
        break;
      // case "GUARDAR":
      //   this.guardaLiquidacion()
      default:
        break;
    }
  }

  // getContribuyentes = () => {
  //   (this as any).mensajeSpinner = 'Obteniendo Contribuyentes'
  //   this.lcargando.ctlSpinner(true);
  //   this.apiService.getContribuyentes().subscribe(
  //     res => {
  //       if (Array.isArray(res['data']) && res['data'].length === 0) {
  //         Swal.fire({
  //           title: this.fTitle,
  //           text: 'No hay Conceptos para cargar.',
  //           icon: 'warning'
  //         })
  //         this.lcargando.ctlSpinner(false)
  //         return
  //       }

  //       console.log(res);

  //       res['data'].forEach(c => {
  //         console.log(c);
  //         let contribuyente = {
  //           id: c.id_cliente,
  //           tipoDocumento: c.tipo_documento,
  //           numeroDocumento: c.num_documento,
  //           razonSocial: c.razon_social
  //         }
  //         this.contribuyentes.push({...contribuyente})
  //       })

  //       this.getConceptos()
  //     },
  //     err => {
  //       this.lcargando.ctlSpinner(false)
  //       this.toastr.error(err.error.message, 'Error cargando Contribuyentes')
  //     }
  //   )
  // }

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos'
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptos().subscribe(
      res => {
        console.log(res)
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
            tiene_exoneracion:c.tiene_exoneracion,
            tiene_sta:c.tiene_sta,
            tiene_tarifa: c.tiene_tarifa == 1 ? true : false //llena el campo con true si tiene tarifa
          }
          this.conceptos.push({ ...concepto })
        })

        // filtra conceptos a solo los que tienen tarifa
        this.conceptos = this.conceptos.filter(c => c.tiene_tarifa == true);
        console.log(this.conceptos);

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contribuyentes')
      }
    )
  }

  getLiquidacionCompleta() {
    const modal = this.modalService.open(ListLiquidacionesComponent, { size: 'lg', backdrop: 'static', windowClass: 'viewer-content-general' })
  }

  nuevaLiquidacion() {

    this.exoneraciones = []
    // this.conceptoCementerio = true
    // this.conceptoCentroMedico = true
    // this.conceptoComplejoAcacias = true
    this.conceptoExoneracion = true
    this.conceptoSta = true

    // document.getElementById("button-add-detalle").setAttribute("disabled", "");
    Object.assign(this.liquidacion, {
      id: null,
      contribuyente: 0,
      fecha: new Date().toDateString(),
      estado: 'E',
      concepto: 0,
      documento: '',
      observaciones: '',
      fk_arancel: null,
      total: 0,
      subtotal:0,
      sta:0,
      exoneraciones:0,
      detalles: [],
      subtotal_0: 0,
      subtotal_1: 0,
      subtotal_2: 0,
      recargo: 0,
      coactiva: 0,
      interes: 0,
      descuento: 0,
    })
    this.detallesNew = [];
    this.queryMode = false
    this.vmButtons[0].habilitar = false
    this.vmButtons[1].habilitar = true
    this.vmButtons[4].habilitar = true
    this.formDisabled = false;
  }

  async validaLiquidacion() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar este formulario.", this.fTitle);
    } else {
      let resp = await this.validaDataLiquidacion().then((respuesta) => {
        if (respuesta) {
          this.guardaLiquidacion();
        }
      })
    }
  }

  validaDataLiquidacion() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.liquidacion.contribuyente == 0 ||
        this.liquidacion.contribuyente == undefined
      ) {
        this.toastr.info("Debe seleccionar un contribuyente");
        flag = true;
      } else if (
        this.liquidacion.concepto == 0 ||
        this.liquidacion.concepto == undefined
      ) {
        this.toastr.info("Debe seleccionar un concepto");
        flag = true;
      } else if (
        this.liquidacion.observaciones == "" ||
        this.liquidacion.observaciones == undefined
      ) {
        this.toastr.info("Debe ingresar observaciones");
        flag = true;
        // } else if (
        //   this.liquidacion.total <= 0 ||
        //   this.liquidacion.total == undefined
        // ) {
        //   this.toastr.info("El total de la liquidación no puede ser menor o igual a 0");
        //   flag = true;
      } else if (
        this.liquidacion.detalles.length <= 0 ||
        !this.liquidacion.detalles.length
      ) {
        this.toastr.info("La liquidación debe tener al menos un detalle al momento de ser creada");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  guardaLiquidacion() {
    // Valida que se hayan ingresado los datos minimos
    let errors = ''
    if (this.liquidacion.contribuyente == 0 || this.liquidacion.contribuyente == null) errors += '\nNo ha seleccionado un Contribuyente.<br>'
    if (this.liquidacion.concepto == 0 || this.liquidacion.concepto == null) errors += '\nNo ha seleccionado un Concepto.<br>'
    if (this.liquidacion.total < 0) errors += '* El valor de la Liquidacion no puede ser menor a 0.<br>'
    if (errors.length > 0) {
      this.toastr.warning(errors, 'Validacion de Datos', {enableHtml: true})
      return
    }


    // this.exoneraciones.forEach(e => {
    //   documento.detalles.push(e);
    // });


         this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
          "mes": Number(moment(this.liquidacion.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.liquidacion.estado = 'A'

              const documento = { ...this.liquidacion, detalles: [...this.liquidacion.detalles, ...this.exoneraciones] }

              (this as any).mensajeSpinner = 'Almacenando Liquidacion'
              this.lcargando.ctlSpinner(true);
              // console.log(data)
              this.apiService.setLiquidacion({liquidacion: documento}).subscribe(
                res => {
                  Swal.fire({
                    title: this.fTitle,
                    text: res['message'],
                    icon: 'success'
                  })
                  this.liquidacion.id = res['data'].id_liquidacion
                  this.liquidacion.documento = res['data'].documento
                  this.vmButtons[0].habilitar = true
                  this.vmButtons[1].habilitar = false
                  this.vmButtons[4].habilitar = false
                  this.formDisabled = true;
                  // this.lcargando.ctlSpinner(false)
                  console.log(res);
                  this.guardarDeuda(res['data'].id_liquidacion); // funcion para que tambien se cree la deuda al crear la liquidacion
                },
                err => {
                  this.lcargando.ctlSpinner(false)
                  this.toastr.error(err.error.message)
                  console.log(err)
                }
              )

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })

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

  validarBoton(event) {
    // if (this.liquidacion.contribuyente != 0 && this.liquidacion.concepto != 0) {
    //   document.getElementById("button-add-detalle").removeAttribute("disabled");
    // } else {
    //   document.getElementById("button-add-detalle").setAttribute("disabled", "");
    // }
    this.concDisabled = false;
    console.log(event);
    this.nombre_concepto = event.nombre
    this.codigo_concepto = event.codigo
    this.tieneExoneracion = event.tiene_exoneracion
    this.tieneSta = event.tiene_sta

    Object.assign(this.liquidacion, {
      sta: 0,
      exoneraciones: 0,
    })
    // if(event.nombre == 'CEMENTERIO'){
    //   this.conceptoCementerio = false;
    //   this.conceptoCentroMedico = true
    //   this.conceptoComplejoAcacias = true

    // }
    // else if(event.nombre == 'CENTRO MEDICO'){
    //   this.conceptoCementerio = true
    //   this.conceptoCentroMedico = false
    //   this.conceptoComplejoAcacias = true

    // }
    // else if(event.nombre == 'COMPLEJO ACACIAS' || event.nombre == 'COMPLEJO LIBERTAD' ){
    //   this.conceptoCementerio = true
    //   this.conceptoComplejoAcacias = false
    //   this.conceptoCentroMedico = true
    // }
    // // else if(event.nombre == 'COMPLEJO LIBERTAD'){
    // //   console.log("libertad")
    // //   this.conceptoCementerio = true
    // //   this.conceptoCentroMedico = true
    // //   this.conceptoComplejoLibertad = false
    // // }
    // else {
    //   this.conceptoCementerio = true
    //   this.conceptoCentroMedico = true
    //   this.conceptoComplejoAcacias = true

    // }
    if(event.tiene_exoneracion == "S"){
      this.conceptoExoneracion = false
    }
    else if (event.tiene_exoneracion == "N" || event.tiene_exoneracion == null
    || event.tiene_exoneracion == undefined){
      this.conceptoExoneracion = true
    }
    else {
      this.conceptoExoneracion = true
    }

    if (event.tiene_sta == "S"){
      this.conceptoSta = false
    }
    else if (event.tiene_sta == "N"
    || event.tiene_sta == null
    || event.tiene_sta == undefined){
      this.conceptoSta = true
    }
    else {
      this.conceptoSta = true
    }
  }

  calcularTotal() {
    let totalDetalles = 0;
    this.liquidacion.detalles.forEach(d => {
      totalDetalles += +d.total;
    })
    this.liquidacion.subtotal = totalDetalles;

    const subtotal_0: number = this.liquidacion.detalles.reduce((acc: number, curr: any) => acc + curr.total, 0)
    Object.assign(this.liquidacion, {subtotal_0})
    this.calcExonerTotal()

  }

  calcular(){
    const subtotal_1: number = this.liquidacion.subtotal_0 - this.liquidacion.exoneraciones
    console.log(subtotal_1)
    const subtotal_2: number = subtotal_1 + this.liquidacion.sta
    console.log(subtotal_2)
    const total = subtotal_2 + this.liquidacion.recargo + this.liquidacion.interes - this.liquidacion.descuento
    console.log(total)
    Object.assign(this.liquidacion, {subtotal_1, subtotal_2, total})
    /* let total = 0
    if(this.tieneExoneracion == "S"){
      total = this.liquidacion.sta + this.liquidacion.subtotal - this.liquidacion.exoneraciones
      this.liquidacion.total = total
    }
    else if (this.tieneExoneracion == "N"
    || this.tieneExoneracion == null
    || this.tieneExoneracion == undefined)
    {
      total = this.liquidacion.sta + this.liquidacion.subtotal
      this.liquidacion.total = total
    }
    else {
      this.liquidacion.total = this.liquidacion.subtotal
    } */


    // if(this.nombre_concepto == 'CEMENTERIO'){
    //   total = this.liquidacion.sta  + this.liquidacion.subtotal
    //   this.liquidacion.total = total
    // }
    // else if (this.nombre_concepto ==  'CENTRO MEDICO'){
    //   total = this.liquidacion.subtotal - this.liquidacion.exoneraciones
    //   this.liquidacion.total = total
    // }
    // else if (this.nombre_concepto ==  'COMPLEJO LIBERTAD' || this.nombre_concepto == 'COMPLEJO ACACIAS'){
    //   total = this.liquidacion.subtotal + this.liquidacion.sta - this.liquidacion.exoneraciones
    //   this.liquidacion.total = total
    // }


    // else{
    //   total = this.liquidacion.subtotal
    //   this.liquidacion.total = total
    // }


  }

  eliminarDetalle(detalle, index) {
    this.liquidacion.detalles.splice(index, 1);
    this.detallesNew.filter(d => d.codigo_detalle == detalle.codigo)[0]["action"] = false;
    this.calcularTotal();
  }

  seleccionarDetalles = (concepto) => {
    // Abrir modal para seleccionar las tarifas del concepto seleccionado (NOTA: parametro es el objeto, debe extraerse el ID)
    /*if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {*/
    //localStorage.setItem('dataProductsInvoice', JSON.stringify(this.dataProducto));
    const modalDetalle = this.modalService.open(ModalDetallesComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    //modalDetalle.componentInstance.module = this.permissions.id_modulo;
    //modalDetalle.componentInstance.component = myVarGlobals.fIngresoProducto;
    modalDetalle.componentInstance.concepto = concepto;
    modalDetalle.componentInstance.detalles = this.detallesNew;

    //}
  }

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.validacion = 3;
  }

  selectContribuyente(contr) {
    this.selectConcepto = false
    // let contribuyente = {
    //   id: c.id_cliente,
    //   tipoDocumento: c.tipo_documento,
    //   numeroDocumento: c.num_documento,
    //   razonSocial: c.razon_social
    // }
    // this.constribuyenteActive = contr;
    this.constribuyenteActive = {
      id: contr.id_cliente,
      tipoDocumento: contr.tipo_documento,
      numeroDocumento: contr.num_documento,
      razonSocial: contr.razon_social,
      supervivencia: contr.supervivencia,
    }
    // console.log(this.constribuyenteActive);
    this.liquidacion.contribuyente = this.constribuyenteActive;
    // revisar si tengo que mandarle aqui el razon_social o si tengo que dejarlo indexado en el html
  }

  /* selectTodaLiquidacion(data) {

  } */

  expandListLiquidaciones() {
    const modalInvoice = this.modalService.open(ModalLiquidacionesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenLiquid;
    modalInvoice.componentInstance.permissions = this.permissions;
  }

  expandExoneracion() {
    if (this.constribuyenteActive.supervivencia != 'N') {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.codigo_concepto = this.codigo_concepto;
    modalInvoice.componentInstance.configuracion = this.configuracion;
    modalInvoice.componentInstance.contribuyente = this.constribuyenteActive
    }
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calcExonerTotal();
  }

  calcExonerTotal() {
    // aplica exoneracion a todo el subtotal
    let porcentaje = 0;
    /* let calculo = 0;
    this.exoneraciones.forEach(e => {
      console.log(e)
      e.valor = this.liquidacion.subtotal * e.porcentaje;
      calculo += +e.valor
      // porcentaje += +e.porcentaje
    }); */
    // if (porcentaje >= 1) {
    //   // si la suma de los porcentajes es 100% o mas
    //   calculo = this.liquidacion.subtotal;
    // } else {
    //   // si la suma de los porcentajes es menor al 100%
    //   calculo = (this.liquidacion.subtotal * porcentaje);
    // }
    this.liquidacion.exoneraciones = this.exoneraciones.reduce((acc: number, curr: any) => {
      const valor = Math.floor(this.liquidacion.subtotal_0 * curr.porcentaje * 100) / 100
      Object.assign(curr, {valor})
      return acc + valor
    }, 0)
    this.calcular();
  }

  calculateExoneraciones() {

    ///// CALCULOS AUTOMATICOS EXONERACIONES

    this.calcExonerTotal();
    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));
    this.calcular();
  }

  async getUltimoRegistro(skip: number = 0) {
    this.skip = skip;
    (this as any).mensajeSpinner = 'Cargado Registro'
    this.lcargando.ctlSpinner(true);
    try {
      const conceptos = this.conceptos.map((elem: any) => elem.id)
      const response = await this.apiService.getUltimoRegistro({conceptos, skip})
      console.log(response)
      const data = {
        contr: response.data[0].contribuyente,
        liquidacion: response.data[0],
      }
      this.commonVarService.editLiquidacion.next(data);
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Registro')
    }
  }

  async getAnterior() {
    this.skip = (this.liquidacion.id) ? this.skip + 1 : 0
    await this.getUltimoRegistro(this.skip)
  }

  async getSiguiente() {
    this.skip = (this.skip > 0) ? this.skip - 1 : 0
    await this.getUltimoRegistro(this.skip)
  }


}
