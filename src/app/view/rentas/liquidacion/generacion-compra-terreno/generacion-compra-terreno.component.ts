import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { GeneracionCompraTerrenoService } from './generacion-compra-terreno.service';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalConceptosComponent } from 'src/app/config/custom/modal-conceptos/modal-conceptos.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalArriendosComponent } from './modal-arriendos/modal-arriendos.component';


@Component({
standalone: false,
  selector: 'app-generacion-compra-terreno',
  templateUrl: './generacion-compra-terreno.component.html',
  styleUrls: ['./generacion-compra-terreno.component.scss']
})
export class GeneracionCompraTerrenoComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  fTitle = "Emisión de liquidación (Compra de terreno)";
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
    estado: "",
    fk_contribuyente: null,
    fk_concepto: 'CT',
    observacion: "",
    subtotal: 0,
    subtotal_0: 0,
    exoneraciones: 0,
    subtotal_1: 0,
    servtecadmin: 0,
    subtotal_2: 0,
    recargo: 0,
    coactiva: 0,
    interes: 0,
    descuento: 0,
    total: 0,
    resolucion_numero:"",
    resolucion_fecha:moment(new Date()).format('YYYY-MM-DD'),
    resolucion_observacion:"",
    detalles: [],
    concepto: { codigo: 'CT' },
    tipo_compra: null,
    // pre_total: 0,
    doc_arriendo: null
  };
  linderos = {
    mts_norte:0,
    mts_sur:0,
    mts_este:0,
    mts_oeste:0,
    totalMts2: 0
  }

  totalLinderos: any = 0;

  propiedades: any = [];
  contribuyenteActive: any = {};
  propiedadActive: any = {};
  conceptosBackup: any = [];
  exoneracionesBackup: any = [];
  exoneraciones: any = [];
  tipoCompra: any = [];

  cantidadTotalMts2:any =0
  totalValor: any

  arriendoActive: any = {}

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: GeneracionCompraTerrenoService,
    private cierremesService: CierreMesService

  ) {

    this.commonVarService.selectListLiqPermisos.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        (this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';
        this.lcargando.ctlSpinner(true)
        this.restoreForm(false, false);
        this.formReadOnly = true;
        this.liquidacion = res;
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;
        this.linderos.mts_norte=res.lindero_norte;
        this.linderos.mts_sur=res.lindero_sur;
        this.linderos.mts_este=res.lindero_este;
        this.linderos.mts_oeste=res.lindero_oeste;
        this.linderos.totalMts2=res.valor_excedente;

        // this.sumaMtsLinderos();
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

        console.log( res.detalles)
        console.log(this.conceptos)
          res.detalles.forEach(e => {
            if (!e.fk_con_det_aplicado) {
              if (e.concepto != null) {  // Excluir STA de Detalles antiguos
                //console.log(this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado))
                  Object.assign(this.conceptos.find(c => c.codigo_detalle == e.concepto.codigo_detalle), { comentario: e.comentario, valor: e.valor });
              }
            }
          });

        // //console.log( res.detalles)
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
        // this.calcSubtotal()

        console.log(this.exoneraciones)
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
          this.lcargando.ctlSpinner(false);

    });
    this.commonVarService.selectExonerLiqPURen.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
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
      if (res.valid == 4) {
          this.selectContibuyente(res);
          if (res.fecha_nacimiento != null) {
            if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
            ) {
              this.expandSupervivencia(res.id_cliente);
            }
          }
          else {
           // console.log("hola")
          }
        }
      }
    );
    this.commonVarService.limpiarSupervivencia.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        this.contribuyenteActive = {}
      }
    )

    this.apiService.selectArriendo$.subscribe(
      (documento: any) => {
        console.log(documento)
        this.arriendoActive = documento
        Object.assign(this.liquidacion, {doc_arriendo: documento.documento})
        this.propiedadActive = documento.lote

        this.selectPropiedad({})
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
      }
    ]



    setTimeout(() => {
      this.validaPermisos();
    }, 50);
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
          this.getCatalogos();
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
        this.validaLiquidacion();
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
  async validaLiquidacion() {
    let resp = await this.validaDataGlobal().then((respuesta) => {
      if(respuesta) {
          this.createLiquidacion();
      }
    });
}

validaDataGlobal() {
  let flag = false;
  return new Promise((resolve, reject) => {

    if(
      this.liquidacion.resolucion_numero == "" ||
      this.liquidacion.resolucion_numero == undefined
    ) {
      this.toastr.info("El campo Resolución Nro no puede ser vacío");
      flag = true;
    }
    else if (
      this.liquidacion.resolucion_fecha == "" ||
      this.liquidacion.resolucion_fecha == undefined
    ){
      this.toastr.info("El campo Resolución Fecha no puede ser vacío");
      flag = true;
    }
    else if (
      this.contribuyenteActive.razon_social == 0 ||
      this.contribuyenteActive.razon_social == undefined
    ){
      this.toastr.info("El campo Contribuyente no puede ser vacío");
      flag = true;
    }
    else if (
      this.propiedadActive == 0 ||
      this.propiedadActive == undefined
    ){
      this.toastr.info("El campo Propiedad no puede ser vacío");
      flag = true;
    } else if (
      this.liquidacion.resolucion_observacion == "" ||
      this.liquidacion.resolucion_observacion == undefined
    ){
      this.toastr.info("El campo Resolución Observacion no puede ser vacío");
      flag = true;
    }else if(this.liquidacion.tipo_compra == "" || this.liquidacion.tipo_compra== undefined){
      this.toastr.info("El campo Tipo de compra no puede ser vacío");
      flag = true;
    }else if(this.liquidacion.tipo_compra == 'EXCEDENTE'){
      if(this.linderos.mts_norte == 0 || this.linderos.mts_norte == undefined){
        this.toastr.info("El campo Norte/Mts no puede ser vacio o tener valor 0");
        flag = true;
      }else if(this.linderos.mts_sur == 0 || this.linderos.mts_sur == undefined){
        this.toastr.info("El campo Sur/Mts no puede ser vacío o tener valor 0");
        flag = true;
      }else if(this.linderos.mts_este == 0 || this.linderos.mts_este == undefined){
        this.toastr.info("El campo Este/Mts no puede ser vacío o tener valor 0");
        flag = true;
      }else if(this.linderos.mts_oeste == 0 || this.linderos.mts_oeste == undefined){
        this.toastr.info("El campo Oeste/Mts no puede ser vacío o tener valor 0");
        flag = true;
      }else if(this.linderos.totalMts2 == 0 || this.linderos.totalMts2 == undefined){
        this.toastr.info("El campo Valor mt2 excedente no puede ser vacío o tener valor 0");
        flag = true;
      }
    }


    !flag ? resolve(true) : resolve(false);
  })
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
        Object.assign(this.liquidacion,{
          fecha: moment(new Date()).format('YYYY-MM-DD'),
          resolucion_numero:"",
          resolucion_fecha:moment(new Date()).format('YYYY-MM-DD'),
          resolucion_observacion:"",
          tipo_compra: null,
        })
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
    Object.assign(this.liquidacion,{
      id: null,
      documento: "",
      fk_lote: null,
      // fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: "",
      fk_contribuyente: null,
      fk_concepto: 'CT',
      observacion: "",
      subtotal: 0,
      subtotal_0: 0,
      exoneraciones: 0,
      subtotal_1: 0,
      servtecadmin: 0,
      subtotal_2: 0,
      recargo: 0,
      coactiva: 0,
      interes: 0,
      descuento: 0,
      total: 0,
      // resolucion_numero:"",
      // resolucion_fecha:moment(new Date()).format('YYYY-MM-DD'),
      // resolucion_observacion:"",
      detalles: [],
      concepto: { codigo: 'CT' },
      // tipo_compra: null,
      // pre_total: 0,
      doc_arriendo: null
    })
    this.conceptosBackup = [];
    this.conceptos.forEach(e => {
      e.valor = 0;
    });
    this.exoneracionesBackup = [];
    this.exoneraciones = [];
    if (keepContr && Object.keys(this.contribuyenteActive).length > 0) {
      this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente
      this.liquidacion.doc_arriendo = this.arriendoActive.documento
    } else {
      this.contribuyenteActive = {};
      this.arriendoActive = {}
      this.codCastDisabled = true;
      this.observacionesDisabled = true;
      this.vmButtons[3].habilitar = true;
    }
    if (!softRestore) {
      this.verifyRestore = false;
      this.propiedades = [];
      this.propiedadActive = {};
      this.arriendoActive = {}
    }
  }

  getCatalogos() {
    let data = {
      params: "'CT_TIPO_COMPRA'",
    };
    /*(this as any).mensajeSpinner = "Buscando categoría...";
    this.lcargando.ctlSpinner(true);*/
    this.apiService.getCatalogos(data).subscribe(

      (res) => {
        this.tipoCompra = res["data"]['CT_TIPO_COMPRA'];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  verificarTipoCompra(event){
  console.log(event)
  }

  sumaMtsLinderos(){
    let sumaMtsLinderos = ((this.linderos.mts_norte*1) + (this.linderos.mts_sur*1) + (this.linderos.mts_este*1) + (this.linderos.mts_oeste*1));
    let calculoMts = sumaMtsLinderos*this.linderos.totalMts2;
    this.cantidadTotalMts2=sumaMtsLinderos;
    this.totalValor = calculoMts;
    console.log(sumaMtsLinderos, calculoMts)
    Object.assign(this.conceptos[0], { valor: calculoMts });
    this.calcSubtotal();
  }

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    let limiteArea = 250.00
    let excedente = this.propiedadActive.area - limiteArea;
    let valorExcedente = 0.20
    let valorArea = 3.00
    let valorSalario = 425.00
    let limiteRbu =25
    let valorRbuMenor = 2.00
    let valorRbuMayor = 5.00
    let valorCompra = this.propiedadActive?.area*this.propiedadActive?.valor_metro_cuadrado

    this.apiService.getConceptoDetalle({codigo_concepto: 'CT'}).subscribe(
      (res: any) => {
        console.log(res.data)
        res['data'].forEach(e => {
          if(this.propiedadActive != 0){
            if(e.codigo_detalle == "CT1"){ //CT1//CTE
              if(this.propiedadActive.area && this.propiedadActive.valor_metro_cuadrado &&
                this.propiedadActive?.area != 0 && this.propiedadActive?.valor_metro_cuadrado != 0){
                Object.assign(e, { valor: valorCompra , fk_concepto_detalle: e.id_concepto_detalle });
              }else{
                Object.assign(e, {valor: 0 , fk_concepto_detalle: e.id_concepto_detalle});
              }
            }else if(e.codigo_detalle == "CT2"){//CT2//DMI
              if(valorCompra && valorCompra != 0){
                Object.assign(e, {valor: valorCompra *6/100 , fk_concepto_detalle: e.id_concepto_detalle});
              }else{
                Object.assign(e, {valor: 0 , fk_concepto_detalle: e.id_concepto_detalle});
              }
            }else if(e.codigo_detalle == "CT3"){//CT3//DME
              if(this.propiedadActive.area != 0 && this.propiedadActive.area <= limiteArea ){
                Object.assign(e, {valor: valorArea ?? 0 , fk_concepto_detalle: e.id_concepto_detalle});
              }else if(this.propiedadActive.area > limiteArea){

                Object.assign(e, {valor: excedente*valorExcedente+valorArea , fk_concepto_detalle: e.id_concepto_detalle});
              }else{
                Object.assign(e, {valor: 0 , fk_concepto_detalle: e.id_concepto_detalle});
              }
            }else /* if(e.codigo_detalle == "CT4"){//CT4//STA
              if(this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo < valorSalario*limiteRbu){

                Object.assign(e, {valor: valorRbuMenor , fk_concepto_detalle: e.id_concepto_detalle});

              }else if(this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo > valorSalario*limiteRbu){

                Object.assign(e, {valor: valorRbuMayor , fk_concepto_detalle: e.id_concepto_detalle});

              }else{

                Object.assign(e, {valor: 0 , fk_concepto_detalle: e.id_concepto_detalle});
              }
            }
            else */{
              Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle });
            }

          }
        })
        this.conceptos = JSON.parse(JSON.stringify(res['data']));
        console.log(this.conceptos);
        this.calcSubtotal()
        //console.log(this.conceptos);

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
    this.lcargando.ctlSpinner(true)
    this.apiService.getPropiedades(this.liquidacion.fk_contribuyente).subscribe(
      (res) => {
        if (res['data'].length > 0) {
          this.propiedades = res['data']
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
      (error) => {
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
    //console.log(mes);
    //console.log(dia);
    if (anio >= 65) {
      if ((new Date().getMonth() + 1) > parseInt(fecha[1])) {
        return true
        //console.log('Mayor a mes');
      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {
          return true
          //console.log('Mayor mes y dia');
        } else {
          return (false)
        }
      } else {
        return (false)
        //console.log(anio - 1);
      }
    } else {
      return (false)
      //console.log(anio - 1);
    }
  }

  selectPropiedad(event) {
    this.getConceptos();
    this.verifyRestore = true;
    this.restoreForm(true, true);
    this.conceptosDisabled = false;
    this.exoneracionDisabled = false;
    this.linderos.totalMts2 = this.propiedadActive.valor_metro_cuadrado;
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

                const documento = {...this.liquidacion, detalles: [...this.exoneraciones]}
                this.conceptos.forEach(e => {
                  if (e.valor > 0) documento.detalles.push(e)
                })

                this.apiService.setLiquidaciones({liquidacion: documento, linderos: this.linderos}).subscribe(
                  (res) => {
                    Swal.fire({
                      icon: "success",
                      title: "Liquidación generada",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                    // this.liquidacion = res['data']
                    // this.liquidacion.tipo_compra = res['data']['tipo_compra']
                    this.formReadOnly = true;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
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

  guardarDeuda(id) {
    this.apiService.aprobarLiquidacion(id).subscribe(
      (res) => {
        //console.log(res);
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

    const subtotal_0 = this.conceptos.reduce((acc, curr) => acc + curr.valor, 0)
    Object.assign(this.liquidacion, { subtotal_0 })
    this.calcExonerTotal();
  }

  calculateExoneraciones() {
    this.calcExonerTotal();
    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));
    this.calcTotal();
  }

  calcExonerTotal() {
    console.log(this.conceptos)
    const calculo = Math.floor(this.exoneraciones.reduce((acc: number, curr: any) => {
      const valor = this.conceptos.find(c => curr.cod_concepto_det_aplicable == c.codigo_detalle).valor * curr.porcentaje
      Object.assign(curr, {valor})
      return acc + valor
    }, 0) * 100) / 100
    // let calculo = 0;
    // this.exoneraciones.forEach(e => {
    //   e.valor = this.conceptos.find(c => e.cod_concepto_det_aplicable == c.codigo_detalle).valor * e.porcentaje;
    //   calculo += +e.valor
    // });
    console.log(this.exoneraciones)
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
    const subtotal_2 = subtotal_1 + this.liquidacion.servtecadmin
    const total = subtotal_2 + this.liquidacion.recargo + this.liquidacion.interes - this.liquidacion.descuento
    Object.assign(this.liquidacion, { subtotal_1, subtotal_2, total})
    this.vmButtons[0].habilitar = false;
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
  expandSupervivencia(id) {
    //console.log('terreno')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;
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
    modalInvoice.componentInstance.validacion = 4;
  }

  expandExoneracion() {
    if (this.contribuyenteActive.supervivencia != 'N') {
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

  expandArriendo() {
    const modal = this.modalService.open(ModalArriendosComponent, { size:'xl', backdrop:'static' })
    modal.componentInstance.contribuyente = this.contribuyenteActive
  }


}
