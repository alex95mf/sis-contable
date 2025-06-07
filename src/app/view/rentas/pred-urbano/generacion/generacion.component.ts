import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalArancelesComponent } from './modal-aranceles/modal-aranceles.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { GeneracionService } from './generacion.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalExonContribuyenteComponent } from './modal-exon-contribuyente/modal-exon-contribuyente.component';

@Component({
standalone: false,
  selector: 'app-generacion',
  templateUrl: './generacion.component.html',
  styleUrls: ['./generacion.component.scss']
})
export class GeneracionComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Liquidación (Predio Urbano)";
  mensajeSpinner: string = "Cargando...";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  /* estados = [
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
  ] */

  formReadOnly = false;
  codCastDisabled = true;
  observacionesDisabled = true;
  conceptosDisabled = true;
  exoneracionDisabled = true;

  verifyRestore = false;

  liquidacion = {
    id: null,
    id_liquidacion: null,
    documento: "",
    periodo: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: "P",
    fk_contribuyente: null,
    fk_concepto: 'PU',
    fk_lote: null,
    avaluo: 0,
    cuantia: null,
    observacion: "",
    subtotal: 0,
    subtotal_0: 0,
    exoneraciones: 0,
    subtotal_1: 0,
    sta: 0,
    subtotal_2: 0,
    pre_total: 0,
    total: 0,
    recargo: 0,
    coactiva: 0,
    interes: 0,
    descuento:0,
    cobro: 0,
    detalles: [],
    tasa_admin:null,
    periodoLiq: null

  };

  propiedades: any = [];

  contribuyenteActive: any = {};
  propiedadActive:any = {};

  conceptosAplicados: any[] = [];
  exoneracionesAplicados: any[] = [];

  conceptosBackup: any = [];
  conceptos: any[] = [];
  exoneracionesBackup: any = [];
  exoneraciones: any[] = [];

  totalCalculo: boolean= true
  cmb_periodo: any[] = []
  multiplesPropietarios: boolean = false
  tbl_propietarios: any[] = []
  codigo_detalle: string;
  conceptoConfig: any

  skip: number = 0
  onDestroy$: Subject<void> = new Subject();
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: GeneracionService,
    private cierremesService: CierreMesService
  ) {
    this.apiService.liquidacionSelected$.subscribe(
      (res: any) => {
        (this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';

        this.lcargando.ctlSpinner(true);
        this.restoreForm(false, false);
        this.totalCalculo= false;
        this.formReadOnly = true;
        this.conceptosDisabled = false;
        this.exoneracionDisabled = false;
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = false;
        this.conceptosAplicados = [];
        console.log(res);
        this.liquidacion = res;
        this.liquidacion.periodoLiq = res.periodo
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;
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
        res.detalles.forEach(e => {
          if (!e.fk_con_det_aplicado) {
            console.log(this.conceptos.find(c => c.codigo_detalle == e.concepto.codigo_detalle));
            Object.assign(this.conceptos.find(c => c.codigo_detalle == e.concepto.codigo_detalle), {comentario: e.comentario, valor: e.valor, id_liquidacion_detalle: e.id_liquidacion_detalle});
          }
          this.conceptos.map(
            (c)=>{
              if(c.codigo_detalle == e.concepto.codigo_detalle){
                this.conceptosAplicados.push(c);
              }
            }
          );

        });

        console.log(this.conceptosAplicados);
        // res.detalles.forEach(e => {
        //   if (!e.fk_con_det_aplicado) {
        //     console.log(this.conceptos.find(c => c.codigo_detalle == e.concepto.codigo_detalle));
        //     this.conceptosAplicados.push(e)
        //   }
        // });
        res.detalles.forEach(e => {
          if (e.fk_con_det_aplicado) {
            let exon = {
              ...e,
              id_liquidacion_detalle: e.id_liquidacion_detalle,
              cod_concepto_det_aplicable: e.cod_con_det_aplicado,
              con_det_codigo: e.concepto.codigo_detalle,
              comentario: e.comentario,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: ((e.total / this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado).valor) *100).toFixed(),
              valor: e.total
            }
            this.exoneraciones.push(exon);
          }
        });

        // this.conceptosAplicados = this.conceptos

        // para traer detalles de conceptos al buscar
        // this.calculateConceptos();
        // this.calcSubtotal();



        this.lcargando.ctlSpinner(false);
      }
    )
    /*this.commonVarService.selectArancelLiqPURen.asObservable().subscribe(
      (res) => {
        this.selectArancel(res);
      }
    );*/
    this.apiService.exoneracionContribuyente$.subscribe(
      ({contribuyente_id, exoneraciones}) => {
        // console.log(res)
        // Pone las exoneraciones por Propietario
        let propietario = this.tbl_propietarios.find((element: any) => element.id_cliente == contribuyente_id)
        exoneraciones.forEach((exoneracion: any) => {
          const descuento: number = Math.round(propietario.proporcional * parseFloat(exoneracion.porcentaje) * 100) / 100
          Object.assign(exoneracion, {descuento})
        })
        const descuento = exoneraciones.reduce((acc: number, curr: any) => acc + curr.descuento, 0)
        const total = propietario.proporcional - descuento
        Object.assign(propietario, {exoneraciones, descuento, total})
      }
    )
    this.commonVarService.selectExonerLiqPURen.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        this.exoneraciones = res;
        // res.forEach(
        //   (e)=>{
        //     let porncentaje: number = e.porcentaje * 100
        //     e.porcentaje = (porncentaje).toFixed()
        //     // console.log(e.porcentaje);
        //   }
        // )
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });
        this.calculateExoneraciones();
      }
    );
    // this.commonVarService.selectContribuyenteLiqPURen.asObservable().subscribe(
    //   (res) => {
    //     this.selectContibuyente(res);
    //   }
    // )

    this.commonVarService.selectContribuyenteCustom.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {

        if (res.valid == 5) {

          this.selectContibuyente(res);
          if (res.fecha_nacimiento != null) {
            console.log('holis');
            if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
            ) {
              // console.log('holis');
              this.expandSupervivencia(res.id_cliente);
            }
          }
          else {
            console.log("hola")
          }
        }
      }
    );
    this.commonVarService.limpiarSupervivencia.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
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
        boton: { icon: "fas fa-edit", texto: "EDITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
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
        habilitar: false,
      }
    ]

    setTimeout(() => {
      this.cargaInicial()
      // this.validaPermisos();
    }, 0);
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
      this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
      this.empresLogo = this.dataUser.logoEmpresa
      const response = await this.commonService.getPermisionsGlobas({codigo: myVarGlobals.fRenPredUrbanoEmision, id_rol: this.dataUser.id_rol}) as any
      this.permissions = response.data[0]
      if (this.permissions.abrir == "0") {
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false)
        throw new Error('No tiene permisos para usar este recurso.');
      };

      (this as any).mensajeSpinner = 'Cargando Periodos'
      const periodoResponse = await this.apiService.getPeriodos() as any;
      console.log(periodoResponse)
      this.cmb_periodo = periodoResponse.data as any[];

      // Cargar configuracion del Concepto PU
      (this as any).mensajeSpinner = 'Cargando Conceptos'
      const conceptoConfig = await this.apiService.getConceptoConfig({params: {filter: { codigo: 'PU'}}})
      console.log(conceptoConfig)
      this.conceptoConfig = conceptoConfig.data[0]
      if (conceptoConfig.tiene_sta == 'S') { Object.assign(this.liquidacion, { sta: 5 }) }
      this.conceptos = conceptoConfig.data[0].concepto_detalle
      this.conceptos.forEach(e => Object.assign(e, {valor: 0, fk_concepto_detalle: e.id_concepto_detalle}))

      /* const conceptoResponse = await this.apiService.getConceptoDetalle({codigo: 'PU'}) as any
      console.log(conceptoResponse)
      conceptoResponse.data.forEach(e => {
        Object.assign(e, {valor: 0, fk_concepto_detalle: e.id_concepto_detalle});
      })
      this.conceptos = conceptoResponse.data */
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  validaPermisos() {
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
      case "EDITAR":
      this.updtaeLiquidacion();
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
    this.vmButtons[3].habilitar = true;

    this.formReadOnly = false;
    this.conceptosDisabled = true;
    this.exoneracionDisabled = true;

    this.liquidacion = {
      id: null,
      id_liquidacion: null,
      documento: "",
      periodo: null,
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: "P",
      fk_contribuyente: null,
      fk_concepto: 'PU',  // Cambiar a conseguir por Codigo 'PU'
      fk_lote: null,
      avaluo: 0,
      cuantia: null,
      observacion: "",
      subtotal: 0,
      subtotal_0: 0,
      exoneraciones: 0,
      subtotal_1: 0,
      sta: 0,
      subtotal_2: 0,
      pre_total: 0,
      total: 0,
      recargo: 0,
      coactiva: 0,
      interes: 0,
      descuento:0,
      cobro: 0,
      detalles: [],
      tasa_admin:null,
      periodoLiq: null
    };

    this.conceptosBackup = [];
    this.conceptos.forEach(e => {
      e.comentario = "";
      e.valor = 0;
    });
    this.conceptosAplicados.forEach(e => {
      // if(e.codigo_detalle == 'CEM' || e.codigo_detalle == 'CEM2022'){
        e.comentario = "";
        e.valor = 0;
      // }
    });
    // this.conceptosAplicados = [];
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
      this.multiplesPropietarios = false
    }

    /*if (keepArancel && Object.keys(this.arancelActive).length > 0) {
      this.liquidacion.fk_arancel = this.arancelActive.id;
    } else {
      this.arancelActive = {};
    }*/
  }

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);

    // Obtener los ConceptoDet de Predio Urbano (PU)
    let data = {
      // id_concepto: 33,
      codigo: 'PU'
    }
    this.apiService.getConceptoDetalle(data).subscribe(
      (res) => {
        console.log(res)
        // A cada item, le asigna valor 0 y el fk_concepto_detalle
        res['data'].forEach(e => {
          Object.assign(e, {valor: 0, fk_concepto_detalle: e.id_concepto_detalle});
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

  selectContibuyente(contr) {
    this.restoreForm(false, false);
    this.contribuyenteActive = contr;
    this.liquidacion.fk_contribuyente = contr.id_cliente;
    this.observacionesDisabled = false;
    this.vmButtons[3].habilitar = false;
    (this as any).mensajeSpinner = 'Obteniendo Propiedades...'
        this.lcargando.ctlSpinner(true);
        this.apiService.getPropiedades(this.liquidacion.fk_contribuyente).subscribe(
          (res: any) => {
            console.log(res)
            if (res.data.length > 0) {
              this.propiedades = res.data
              this.codCastDisabled = false;
              this.lcargando.ctlSpinner(false);
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
          (error: any) => {
            this.lcargando.ctlSpinner(false)
            this.toastr.error(error.error.message, 'Error cargando Propiedades')
          }
        );
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

  selectPropiedad() {
    if (this.propiedadActive) {
      if (this.propiedadActive.propietarios.length > 1) {
        this.multiplesPropietarios = true
        this.tbl_propietarios = this.propiedadActive.propietarios
        this.tbl_propietarios.forEach((element: any) => Object.assign(element, {proporcional: 0, descuento: 0, total: 0, exoneraciones: []}))
      } else {
        this.multiplesPropietarios = false
        this.tbl_propietarios = [];
      }
      this.verifyRestore = true;
      // this.restoreForm(true, true);
      this.conceptosDisabled = false;
      this.exoneracionDisabled = false;
      this.vmButtons[0].habilitar = false;
      this.calculateConceptos();
      this.calculateExoneraciones();
    }
  }

  async calculateConceptos() {
    // Obtener los valores desde el backend
    (this as any).mensajeSpinner = 'Obteniendo valores';
    this.lcargando.ctlSpinner(true);

    const response = await this.apiService.getValoresPropiedad({lote: this.propiedadActive.id}) as any
    console.log(response.data)
    this.conceptosAplicados = [];
    Object.keys(response.data).forEach((element: any) => {
      if (response.data[element] != 0) {
        let c = this.conceptos.find(c => c.codigo_detalle == element)
        if (element == 'STA') {
          this.liquidacion.sta = response.data[element]
        } else {
          Object.assign(c, {valor: response.data[element]})
          this.conceptosAplicados = [...this.conceptosAplicados, {...c}]
        }
      }
    })
    if (this.propiedadActive.valor_edificacion == 0) this.conceptosAplicados.push(this.conceptos.find(c => c.codigo_detalle == 'ADC'));
    this.conceptosAplicados.push(this.conceptos.find(c => c.codigo_detalle == 'CEM'));
    this.conceptosAplicados.push(this.conceptos.find(c => c.codigo_detalle == 'CEM2022'));

    this.lcargando.ctlSpinner(false);
    this.calcSubtotal();
    /* this.apiService.getValoresPropiedad({lote: this.propiedadActive.id}).subscribe(
      (res: any) => {
        console.log(res.data);
        this.conceptosAplicados = [];
        Object.keys(res.data).forEach(e => {
          if (res.data[e] != 0) {
            let c = this.conceptos.find(c => c.codigo_detalle == e)
            Object.assign(c, {valor: res.data[e]})
            this.conceptosAplicados.push({...c})
          }
        });
        if (this.propiedadActive.valor_edificacion == 0) this.conceptosAplicados.push(this.conceptos.find(c => c.codigo_detalle == 'ADC'));
        this.conceptosAplicados.push(this.conceptos.find(c => c.codigo_detalle == 'CEM'));
        this.conceptosAplicados.push(this.conceptos.find(c => c.codigo_detalle == 'CEM2022'));
        console.log(this.conceptosAplicados)
        // this.conceptos.find(c => c.codigo_detalle == 'IMP').valor = res.data.IMP;
        // this.conceptos.find(c => c.codigo_detalle == 'SNE').valor = res.data.SNE;
        // this.conceptos.find(c => c.codigo_detalle == 'STA').valor = res.data.STA;
        this.lcargando.ctlSpinner(false);

        this.calcSubtotal();
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
        this.toastr.error('Error obteniendo Valores de Impiestos', this.fTitle);
      }
    ); */
  }

  calculateExoneraciones() {

    ///// CALCULOS AUTOMATICOS EXONERACIONES

    this.calcExonerTotal();

    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));

    // this.calcTotal();
  }

  calcSubtotal() {
    // let calculo = 0;
    // // console.log(this.conceptos);
    // console.log(this.conceptosAplicados);
    // this.conceptosAplicados.forEach(e => {
    //   console.log(typeof e.valor,e.valor );
    //   calculo += parseFloat(e.valor)
    // });
    const calculo = this.conceptosAplicados.reduce((acc: number, curr: any) => acc + parseFloat(curr.valor), 0)
    this.liquidacion.subtotal = calculo

    this.calcExonerTotal();
  }

  calcExonerTotal() {
    // let calculo = 0;
    // this.exoneraciones.forEach(e => {
    //   console.log(e.valor);
    //   e.valor = this.conceptosAplicados.find(c => e.cod_concepto_det_aplicable == c.codigo_detalle).valor * (e.porcentaje/100);
    //   console.log(e.valor);
    //   calculo += +e.valor
    // });
    let valor_exo_hipo = 0
    const exon_hipoteca = this.exoneraciones.find((elem: any) => elem.con_det_codigo == 'EPH')
    if (exon_hipoteca) {
      valor_exo_hipo = this.propiedadActive.valor_hipoteca * 0.0023
      Object.assign(exon_hipoteca, { valor: valor_exo_hipo })
      /* if (moment().diff(moment(exon_hipoteca.fecha_adquisicion), 'years') < 5) {

      } else {
        this.toastr.info('La Propiedad tiene una Fecha de Adquisicion mayor a 5 años.')
        const idx = this.exoneraciones.findIndex((element: any) => element.con_det_codigo == 'EPH')
        this.exoneraciones.splice(idx, 1)
      } */
    }
    let valor_exon_dla = 0
    const exon_tercera_edad = this.exoneraciones.find((elem: any) => elem.con_det_codigo == 'DLA')
    if (exon_tercera_edad) {
      let base_exoneracion = this.propiedadActive.avaluo
      if (this.propiedadActive.avaluo > (25 * 450)) base_exoneracion = 25 * 450

      valor_exon_dla = base_exoneracion * 0.0023
      Object.assign(exon_tercera_edad, {valor: valor_exon_dla})
    }

    let valor_exon_dis = 0
    const exon_discapacidad = this.exoneraciones.find((elem: any) => elem.con_det_codigo == 'DLD')
    if (exon_discapacidad) {
      let base_exoneracion = this.propiedadActive.avaluo
      if (this.propiedadActive.avaluo > (25 * 450)) base_exoneracion = 25 * 450

      valor_exon_dis = base_exoneracion * 0.0023
      Object.assign(exon_discapacidad, { valor: valor_exon_dis })
    }

    const calculo = this.exoneraciones.reduce((acc, curr) => {
      if (!['EPH', 'DLD', 'DLA'].includes(curr.con_det_codigo)) {
        const valor = Math.floor(this.conceptosAplicados.find(c => curr.cod_concepto_det_aplicable == c.codigo_detalle).valor * curr.porcentaje)
        Object.assign(curr, {valor})
        return acc + valor
      } else
      return acc
    }, 0)
    this.liquidacion.exoneraciones = calculo + valor_exo_hipo + valor_exon_dla + valor_exon_dis;
    this.calcTotal();
  }

  calcTotal() {
    /* let preTotal = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
    if (preTotal > 0) {
      this.liquidacion.pre_total = preTotal;
      if(this.totalCalculo){
        this.liquidacion.total = this.liquidacion.pre_total;
      }

    } else {
      this.liquidacion.pre_total = 0;
      if(this.totalCalculo){
        this.liquidacion.total = this.liquidacion.pre_total;
      }
    } */
    //  this.calcTotalCobro()
    // this.vmButtons[0].habilitar = false;

    const subtotal_1 = this.liquidacion.subtotal - this.liquidacion.exoneraciones
    const subtotal_2 = subtotal_1 + this.liquidacion.sta
    const total = subtotal_2 + this.liquidacion.recargo + this.liquidacion.interes - this.liquidacion.descuento
    Object.assign(this.liquidacion, {subtotal_1, subtotal_2, total})
  }

  // calcTotalCobro() {
  //   let preTotalCobro = this.liquidacion.total +  this.liquidacion.interes + this.liquidacion.recargo;
  //   if (preTotalCobro > 0) {
  //     this.liquidacion.cobro = preTotalCobro;
  //   } else {
  //     this.liquidacion.cobro = 0;
  //   }
  //   // this.vmButtons[0].habilitar = false;
  // }

  createLiquidacion() {if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Liquidaciones.", this.fTitle);
      return
    } else if(this.liquidacion.periodoLiq == null){
      this.toastr.warning('No ha seleccionado un Periodo.')
      return
    } else if (moment(this.liquidacion.fecha).format('YYYY') != this.liquidacion.periodoLiq) {
      this.toastr.warning('La Fecha del documento no corresponse al Periodo seleccionado.')
      return
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
          (this as any).mensajeSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(this.liquidacion.periodoLiq),
            "mes": Number(moment(this.liquidacion.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              (this as any).mensajeSpinner = 'Generando Liquidación...';
              this.lcargando.ctlSpinner(true);
              this.liquidacion.detalles = [];
              this.liquidacion.fk_lote = this.propiedadActive.id;
              this.conceptosAplicados.forEach(e => {
                if (e.valor > 0) {
                  this.liquidacion.detalles.push(e);
                }
                if(e.codigo_detalle==='STA'){
                  this.liquidacion.tasa_admin = e.valor
                }
              });
              this.exoneraciones.forEach(e => {
                e.porcentaje = (e.porcentaje/100);
                this.liquidacion.detalles.push(e);
              });

              // return console.log(this.liquidacion);
              // console.log(this.liquidacion);
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
                  this.vmButtons[3].habilitar = false;
                  this.vmButtons[4].habilitar = false;
                  this.lcargando.ctlSpinner(false);
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

  updtaeLiquidacion(){
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Liquidaciones.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Está a punto de actualizar una nueva liquidación ¿Desea continuar?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {

          (this as any).mensajeSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(this.liquidacion.periodoLiq),
            "mes": Number(moment(this.liquidacion.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              (this as any).mensajeSpinner = 'Actualizando Liquidación...';
              this.lcargando.ctlSpinner(true);
              this.liquidacion.detalles = [];
              this.conceptosAplicados.forEach(e => {
                if (e.valor > 0) {
                  this.liquidacion.detalles.push(e);
                }
                if(e.codigo_detalle==='STA'){
                  this.liquidacion.tasa_admin = e.valor
                }
              });
              this.exoneraciones.forEach(e => {
                e.porcentaje = (e.porcentaje/100);
                this.liquidacion.detalles.push(e);
              });

              // return  console.log(this.liquidacion);
              this.apiService.updateLiquidacion({liquidacion: this.liquidacion}).subscribe(
                (res)=>{
                  console.log(res);
                  Swal.fire({
                    icon: "success",
                    title: "Liquidación actualizada",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  });
                  this.lcargando.ctlSpinner(false);
                },
                (error)=>{
                  console.log(error);
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
      });
    }
  }

  // guardarDeudaComprador(id) {
  //   this.apiService.aprobarLiquidacion(id).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.lcargando.ctlSpinner(false);
  //     },
  //     (err) => {
  //       this.lcargando.ctlSpinner(false);
  //       this.toastr.info(err.error.message);
  //     }
  //   )
  // }


  reestablecerConceptos() {

  }

  reestablecerExoneracion() {

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

  expandSupervivencia(id) {
    console.log('predioUrbano')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;
    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }

  /*expandArancel() {
    const modalInvoice = this.modalService.open(ModalArancelesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
  }*/

  expandExoneracion() {
    if (this.contribuyenteActive.supervivencia != 'N') {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.conceptos = this.conceptosAplicados;
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive
    modalInvoice.componentInstance.lote = this.propiedadActive
  }
  }

  exoneracionPara(codigo_detalle, valor_detalle) {
    this.codigo_detalle = codigo_detalle
    // Si hay multiples propietarios, calcular el proporcional de cada uno
    if (this.multiplesPropietarios) {
      this.tbl_propietarios.forEach((element: any) => Object.assign(element, {proporcional: 0, descuento: 0, total: 0}))
      // Calcular proporcional del Concepto para cada Propietario
      let i = 0;
      for (; i < this.tbl_propietarios.length - 1; i++) {
        const valor = Math.round(valor_detalle / this.tbl_propietarios.length * 100) / 100
        Object.assign(this.tbl_propietarios[i], { proporcional: valor, total: valor})
      }
      const demas: number = this.tbl_propietarios.reduce((acc: number, curr: any) => acc + parseFloat(curr.proporcional ?? 0), 0)
      console.log(valor_detalle, demas)
      const valor = Math.round((valor_detalle - demas) * 100) / 100
      Object.assign(this.tbl_propietarios[i], { proporcional: valor, total: valor})
    }
  }

  expandExonContribuyente(id_cliente, exoneraciones) {
    const modal = this.modalService.open(ModalExonContribuyenteComponent, {
      size: 'xl',
      backdrop: 'static'
    })
    modal.componentInstance.contribuyente = id_cliente
    modal.componentInstance.codigo_detalle = this.codigo_detalle
    modal.componentInstance.lote = this.propiedadActive
    modal.componentInstance.exonSelected = exoneraciones
  }

  aplicarExoneracionPropietarios() {
    // Revisa tbl_propietarios y acumula en exoneraciones
    this.tbl_propietarios.forEach((propietario: any) => {
      propietario.exoneraciones.forEach((exoneracion: any) => {
        let existente = this.exoneraciones.find((element: any) => element.con_det_codigo == exoneracion.con_det_codigo)
        if (existente) {
          existente.valor += exoneracion.descuento
        } else {
          Object.assign(exoneracion, {valor: exoneracion.descuento})
          this.exoneraciones.push(exoneracion)
        }
      })
    })
    let ex = this.exoneraciones.find((element: any) => element.con_det_codigo == 'OEX')
    if (ex) ex.porcentaje = ex.valor / this.conceptosAplicados.find((e: any) => e.codigo_detalle == 'IMP').valor
    // this.calcExonerTotal()
    const totalExon = this.exoneraciones.reduce((acc: number, curr: any) => acc + curr.valor, 0)
    Object.assign(this.liquidacion, {exoneraciones: totalExon})
    this.exoneraciones.forEach((element: any) => Object.assign(element, {fk_concepto_detalle: element['fk_concepto_det']}))
    this.calcTotal()

    this.codigo_detalle = null
    this.tbl_propietarios.forEach((element: any) => Object.assign(element, {proporcional: 0, descuento: 0, total: 0}))
  }

  expandContribuyentes() {
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

  async getUltimoRegistro(skip: number = 0) {
    this.skip = skip;
    (this as any).mensajeSpinner = 'Cargado Registro'
    this.lcargando.ctlSpinner(true);
    try {
      const conceptos = [this.conceptoConfig.id_concepto]
      const response = await this.apiService.getUltimoRegistro({conceptos, skip})
      console.log(response)

      this.apiService.liquidacionSelected$.emit(response.data[0])
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

