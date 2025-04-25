import { Component, OnInit, ViewChild } from '@angular/core';

import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalArancelesComponent } from './modal-aranceles/modal-aranceles.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
// import { GeneracionService } from './generacion.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { EmisionArancelesService } from './emision-aranceles.service';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { ModalExonContribuyenteComponent } from './modal-exon-contribuyente/modal-exon-contribuyente.component';

@Component({
  selector: 'app-emision-aranceles',
  templateUrl: './emision-aranceles.component.html',
  styleUrls: ['./emision-aranceles.component.scss']
})
export class EmisionArancelesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emision de Aranceles";
  msgSpinner: string;
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
  ArancelesValid = true
  subtotal: any
  subtotalCalculado: number = 0;

  verifyRestore = false;

  contribuyenteDisabled = false;

  liquidacion = {
    id: null,
    documento: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: '',
    fk_contribuyente: null,
    fk_concepto: 31,
    fk_arancel: null,
    fk_lote: null,
    avaluo: 0,
    cuantia: 0,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    subtotal_1: 0,
    tasa_admin: 0,
    subtotal_2: 0,
    recargo: 0,
    coactiva: 0,
    interes: 0,
    descuentos: 0,
    total: 0,
    detalles: [],
    //No se envia concepto porque concepto siempre es RE, registro de la propiedad
  };

  propiedades = [];

  contribuyenteActive: any = {};
  arancelActive: any = {};
  exoneraciones: any = [];
  aranceles: any = [];
  exoneciones: any = [];

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
  multiplesPropietarios: boolean = false
  tbl_propietarios: any[] = []
  arancelSelected: any

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: EmisionArancelesService,
    private cierremesService: CierreMesService
  ) {
    this.commonVarService.selectListLiqRP.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.msgSpinner = 'Cargando datos de la Liquidación...';
        this.lcargando.ctlSpinner(true)
        this.restoreForm(false, false);
        this.formReadOnly = true;
        this.liquidacion = {
          id: res.id_documento,
          documento: res.documento,
          fecha: res.fecha,
          estado: res.estado,
          fk_contribuyente: res.contribuyente['id_cliente'],
          fk_concepto: 31,
          fk_arancel: null,
          fk_lote: null,
          avaluo: res.avaluo,
          cuantia: 0,
          observacion: res.observacion,
          subtotal: res.subtotal,
          subtotal_1: 0,
          exoneraciones: 0,
          tasa_admin: res.tasa_admin,
          subtotal_2: 0,
          recargo: 0,
          coactiva: 0,
          interes: 0,
          descuentos: 0,
          total: res.total,
          detalles: [],
        };        
        this.liquidacion.fecha = res.fecha.split(" ")[0];
        // this.arancelActive = res.arancel;
        // this.aranceles = res.detalles
        this.contribuyenteActive = res.contribuyente;
        // this.propiedades = [
        //   {
        //     pivot: {
        //       lote_id: res.fk_lote
        //     },
        //     cod_catastral: res.codigo_catastro
        //   }
        // ];
        let exoneracion = []
        res.detalles.forEach(e => {
          if (!!e.fk_arancel) {
            // console.log('holis');
            if(e.fk_concepto_detalle == null){
              let aran = {
                ...e.arancel,
                cuantia: e.cuantia,
                codigo_catastro: e.codigo_catastro,
                valor: e.valor,
                total: e.total,
                porcentaje_exoneracion: e.total / e.valor == 1 ? 0 : e.total / e.valor == 0 ? 1 : e.total / e.valor,
                id_documento_detalle: e.id_documento_detalle,
                descuento: e.descuento,
                cobro: parseFloat(e.total) + 2,
                // exoneraciones: [],
                // total: 0,
              }
              this.aranceles.push(aran);
            }else {
              exoneracion.push(e)
            }
            
          }
        })

        console.log(exoneracion);
        console.log(this.aranceles);
        
        this.aranceles.forEach(e => {
          let coincidencia = []
          exoneracion.forEach(r=>{
            if(e.id == r.fk_arancel ){
              // e['exoneraciones'] = []
              // console.log('holis');
              if(r['exoneracion'] !=null){
                // console.log('holis');
                r['exoneracion']['action'] = true
                r['exoneracion']['id_documento_detalle'] = r.id_documento_detalle
                coincidencia.push(r['exoneracion']);
                
              }
              
            }
          })

          e['exoneraciones'] = coincidencia;
          
          
        })

        const exoneraciones = this.aranceles.reduce((acc, curr) => acc + parseFloat(curr.descuento), 0)
        // this.liquidacion.exoneraciones = exoneraciones
        const subtotal_1 = this.liquidacion.subtotal - exoneraciones
        // const tasa_admin = this.aranceles.length * 2
        // const subtotal_2 = subtotal_1 + tasa_admin
        // const total = subtotal_2

        Object.assign(this.liquidacion, {exoneraciones, subtotal_1})

        // let descuento = 0;
        // this.aranceles.map(
        //   (res)=>{
        //     descuento += parseFloat(res.descuento)
        //   }
        // )
        // this.liquidacion.exoneraciones = descuento
        // this.calcAranceles()

        // console.log(this.aranceles);
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        if(res.estado == 'A'){
          this.vmButtons[3].habilitar = true;
        }else {
          this.vmButtons[3].habilitar = false;
        }
        this.vmButtons[4].habilitar = false;
        
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
        /* let tota = 0;
        let exoneracion = 0;
        this.aranceles.forEach((e)=>{
          tota+=e.total;
          exoneracion += e.descuento;
        });
        this.liquidacion.total = tota + this.liquidacion.tasa_admin;
        this.liquidacion.exoneraciones = exoneracion; */

        // this.liquidacion.total = this.aranceles.reduce((acc: number, curr: any) => acc + curr.total, 0)
        // this.liquidacion.exoneraciones = this.aranceles.reduce((acc: number, curr: any) => acc + curr.descuento, 0)

        // this.exoneciones = res;
        // this.aranceles.forEach(e => {
        //   if(e.id == res.id){
            
        //     Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        //   }
          
        // });
        // this.calcTotal();
        this.calcAranceles()
      }
    );
    // this.commonVarService.selectContribuyenteLiqRP.asObservable().subscribe(
    //   (res) => {
    //     this.selectContibuyente(res);
    //   }
    // )
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.selectContibuyente(res);

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
    )

    this.apiService.exoneracionContribuyente$.subscribe(
      ({contribuyente_id, exoneracion}) => {
        console.log(contribuyente_id, exoneracion)
        const decuento = Math.floor(this.arancelSelected.valor * exoneracion.porcentaje)
        Object.assign(exoneracion, {decuento})
        let contribuyente = this.tbl_propietarios.find((element: any) => element.id_cliente == contribuyente_id)
        const descuento = Math.round(contribuyente.proporcional * exoneracion.porcentaje * 100) / 100
        const total = contribuyente.proporcional - descuento
        Object.assign(contribuyente, { descuento, total, exoneracion })
      }
    )
  }

  async aplicarExoneracionPropietarios() {
    const result = await Swal.fire({
      titleText: 'Aplicacion de Exoneraciones por Propietario',
      text: 'Esta seguro/a desea aplicar estas exoneraciones?',
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      const propietarios_descuento = this.tbl_propietarios.reduce((acc: number, curr: any) => acc + curr.descuento, 0)
      const propietarios_total = this.tbl_propietarios.reduce((acc: number, curr: any) => acc + curr.total, 0)
      const propietarios_exoneraciones = this.tbl_propietarios.reduce((acc: any[], curr: any) => {
        if (curr.exoneracion) return [...acc, curr.exoneracion] // acc.concat(curr.exoneracion)
        return acc
      }, [])
      Object.assign(this.arancelSelected, {descuento: propietarios_descuento, total: propietarios_total, exoneraciones: propietarios_exoneraciones})    
      
      // Calcular subtotal, exoneraciones y Total
      const subtotal = this.aranceles.reduce((acc: number, curr: any) => acc + curr.valor, 0)
      const exoneraciones = this.aranceles.reduce((acc: number, curr: any) => acc + curr.descuento, 0)
      const tasa_admin = this.aranceles.length * 2
      const total = subtotal - exoneraciones + tasa_admin
      Object.assign(this.liquidacion, {subtotal, exoneraciones, tasa_admin, total})
      this.multiplesPropietarios = false
    }
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
        boton: { icon: "fas fa-check", texto: " APROBACION" },
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
    this.msgSpinner = 'Cargando Permisos de Usuario...'
    this.lcargando.ctlSpinner(true)
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

      case " APROBACION":
        this.aprobacion();
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
        this.contribuyenteDisabled = false;
        this.restoreForm(false, false);
      }
    });
  }


  restore(keepContr, keepArancel) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.subtotalCalculado = 0;
    this.formReadOnly = false;
    this.arancelDisabled = true;
    this.codCastDisabled = true;
    this.cuantiaDisabled = true;
    this.calcularDisabled = true;
    this.exoneracionDisabled = true;
    this.observacionesDisabled = true;
    this.subtotalDisabled = true;
    this.ArancelesValid = true

    this.verifyRestore = false;
    

    // this.liquidacion = {
    //   id: null,
    //   documento: "",
    //   fecha: moment(new Date()).format('YYYY-MM-DD'),
    //   estado: '',
    //   fk_contribuyente: 0,
    //   fk_concepto: 31,
    //   fk_arancel: 0,
    //   fk_lote: null,
    //   avaluo: 0,
    //   cuantia: 0,
    //   observacion: "",
    //   subtotal: 0,
    //   exoneraciones: 0,
    //   total: 0,
    //   detalles: [],
    // };

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



  restoreForm(keepContr, keepArancel) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;

    this.formReadOnly = false;
    this.arancelDisabled = true;
    this.codCastDisabled = true;
    this.cuantiaDisabled = true;
    this.calcularDisabled = true;
    this.exoneracionDisabled = true;
    this.observacionesDisabled = true;
    this.subtotalDisabled = true;
    this.ArancelesValid = true;
    this.subtotalCalculado = 0;
    this.verifyRestore = false;
    this.tbl_propietarios = []
    this.multiplesPropietarios = false

    this.liquidacion = {
      id: null,
      documento: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: '',
      fk_contribuyente: 0,
      fk_concepto: 31,
      fk_arancel: 0,
      fk_lote: null,
      avaluo: 0,
      cuantia: 0,
      observacion: "",
      subtotal: 0,
      subtotal_1: 0,
      exoneraciones: 0,
      tasa_admin: 2,
      subtotal_2: 0,
      recargo: 0,
      coactiva: 0,
      interes: 0,
      descuentos: 0,
      total: 0,
      detalles: [],
    };

    this.propiedades = [];

    this.exoneraciones = [];
    this.aranceles = [];

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
    this.vmButtons[4].habilitar = false;
  }

  selectArancel(arancel) {
    console.log(arancel);
    this.restore(true, false);
    this.arancelDisabled = false;
    this.observacionesDisabled = false;
    // Permitir ingreso de Cuantia al seleccionar Arancel (Sobrepone validacion al escoger Propiedad)
    this.cuantiaDisabled = arancel.desc_calculo == 'FI';
    // Permitir calculo de Liquidacion al seleccionar arancel (Sobrepone validacion al escoger Propiedad)
    this.calcularDisabled = false;
    this.verifyRestore = true;
    this.vmButtons[4].habilitar = false;
    this.arancelActive = arancel;
    this.liquidacion.fk_arancel = arancel.id
    if (arancel.desc_calculo == "FI") {
      if (!arancel.avaluo && !arancel.cuantia) {
        // this.liquidacion.subtotal += parseFloat(arancel.valor);
        // this.calcTotal();
        // this.ArancelesValid = false
      }
    } else if (arancel.desc_calculo == "NA") {
      this.subtotalDisabled = false;
    }
    if (arancel.id) {
      if (arancel.avaluo) {
        this.msgSpinner = 'Obteniendo Propiedades...'
        this.lcargando.ctlSpinner(true)
        this.apiService.getPropiedades(this.liquidacion.fk_contribuyente).subscribe(
          (res) => {
            console.log(res['data']);
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

  selectPropiedad({id, avaluo, cod_catastral, propietarios}) {
    // console.log(event);
    this.liquidacion.avaluo = avaluo
    this.arancelActive.fk_lote = id
    this.arancelActive.codigo_catastro = cod_catastral
    this.arancelActive.propietarios = propietarios
    // this.liquidacion.avaluo += parseFloat(this.propiedades.filter(e => e.pivot.lote_id == event.pivot.lote_id)[0].avaluo);
    // this.arancelActive['fk_lote'] = event.pivot.lote_id
    // this.arancelActive['codigo_catastro'] = event.cod_catastral
    this.changeAvalCuantia();
  }

  changeAvalCuantia() {
    // this.calcularDisabled = true;
    // this.liquidacion.subtotal = 0;
    // this.liquidacion.total = 0;
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
    this.msgSpinner = 'Calculando Subtotal...';
    this.lcargando.ctlSpinner(true);
    let payload = {
      avaluo: this.liquidacion.avaluo,
      cuantia: this.liquidacion.cuantia
    }
    if(this.propiedades.length != 0){
      if(this.liquidacion.avaluo != 0){
        this.apiService.getCalculoSubtotal(payload, this.arancelActive.id).subscribe(
          (res) => {
            this.lcargando.ctlSpinner(false);
            console.log(res);
            this.subtotal = res['data'];
            this.arancelActive['cuantia'] = this.liquidacion.cuantia;
            this.arancelActive['valor'] = res['data'];
            this.arancelActive['total'] = res['data'];
            // this.liquidacion.subtotal += parseFloat(res['data']);
            this.subtotalCalculado = parseFloat(res['data']);
            console.log(this.subtotalCalculado);
            this.ArancelesValid = false
            this.vmButtons[0].habilitar = false;
            // this.calcTotal();
          },
          (error) => {
            this.lcargando.ctlSpinner(false)
            this.toastr.error(error.error.message, 'Error al obtener el calculo')
          }
        );

      }else {
        this.lcargando.ctlSpinner(false);
        this.toastr.info('Debe escoger el codigo catastral')
      }
      

    }else {
      this.apiService.getCalculoSubtotal(payload, this.arancelActive.id).subscribe(
        (res) => {
          this.lcargando.ctlSpinner(false);
          console.log(res);
          this.subtotal = res['data'];
          this.arancelActive['cuantia'] = this.liquidacion.cuantia;
          this.arancelActive['valor'] = res['data'];
          this.arancelActive['total'] = res['data'];
          // this.liquidacion.subtotal += parseFloat(res['data']);
          this.subtotalCalculado = res['data'];
          console.log(this.subtotalCalculado);
          this.ArancelesValid = false
          this.vmButtons[0].habilitar = false;
          // this.calcTotal();
        },
        (error) => {
          this.lcargando.ctlSpinner(false)
          this.toastr.error(error.error.message, 'Error al obtener el calculo')
        }
      );
    }
    
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
          this.msgSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
            "mes": Number(moment(this.liquidacion.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
            
            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.msgSpinner = 'Generando Liquidación...';
              this.lcargando.ctlSpinner(true);
              this.liquidacion.fk_arancel = this.arancelActive.id;
              this.aranceles.forEach((e: any)=>{
              this.liquidacion.detalles.push(              
                  {
                    fk_arancel: e.id,
                    cantidad: 1,
                    fk_lote: !e.fk_lote ? 0 : e.fk_lote,
                    valor: e.valor,
                    codigo_catastro: !e.codigo_catastro ? 0 : e.codigo_catastro,
                    cuantia: e.cuantia,
                    exoneraciones: !e.exoneraciones ? null : e.exoneraciones,
                    total: e.total,
                    descuento: e.descuento
                  }
                );
              })

              console.log(this.liquidacion);
              
              this.apiService.setArancelesEmision({liquidacion: this.liquidacion}).subscribe(
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
                  this.restoreForm(false, false);
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

  removeExoneracion(index) {
    this.multiplesPropietarios = false
    console.log(index);
    this.aranceles.splice(index, 1);
    // this.calcTotal();
    /* let tota = 0;
    let exoneracion = 0;
    let subtotal = 0;
    this.aranceles.map((e)=>{
      tota+=e.total;
      exoneracion += e.descuento;
      subtotal += e.valor
    });
    this.liquidacion.total = tota;
    this.liquidacion.exoneraciones = exoneracion;
    this.liquidacion.subtotal = subtotal; */
    this.calcAranceles()
    if(this.aranceles.length == 0 || this.aranceles == undefined){
      this.contribuyenteDisabled = false;
    }else{
      this.contribuyenteDisabled = true;
    }
  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  agregarDetalles(){
    // this.arancelActive = arancel;
    
    if(!!this.subtotal){
      this.arancelActive['exoneraciones'] = []
      this.arancelActive['descuento'] = 0
      this.arancelActive['porcentaje_exoneracion'] = 0;
      this.arancelActive['sta'] = 2
      this.arancelActive['cobro'] = this.arancelActive['total'] + 2

      this.aranceles.push(this.arancelActive);
      // const total = this.aranceles.reduce((acc: number, curr: any) => acc + curr.valor, 0)
      /* let total = 0;
      this.aranceles.map((e)=>{
        total+=e.total
      }) */
      console.log(this.aranceles)
      this.contribuyenteDisabled = this.aranceles.length > 0
      /* if(this.aranceles.length > 0){
        this.contribuyenteDisabled = true;
      }else{
        this.contribuyenteDisabled = false;
      } */

      this.calcAranceles()

      this.arancelActive = {};
      this.liquidacion.cuantia = 0
      this.liquidacion.avaluo = 0
      this.propiedades = []
      this.liquidacion.fk_lote = null
      this.calcularDisabled = true
      this.subtotal = undefined;
      this.subtotalCalculado = 0;
    }else {
      this.toastr.info('Realice el calculo')
    }
    
  }

  calcAranceles() {
    const sta = 2

    const subtotal = this.aranceles.reduce((acc, curr) => acc + curr.valor, 0)
    const exoneraciones = this.aranceles.reduce((acc, curr) => acc + curr.descuento, 0)
    const subtotal_1 = subtotal - exoneraciones
    const tasa_admin = this.aranceles.length * sta
    const subtotal_2 = subtotal_1 + tasa_admin
    const total = subtotal_2

    Object.assign(this.liquidacion, {subtotal, exoneraciones, subtotal_1, tasa_admin, subtotal_2, total})
  }

  onlyNumberDot(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  aprobacion(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de aprobar la emision de aranceles. ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar", 
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.msgSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let data = {
          "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
          "mes": Number(moment(this.liquidacion.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
          
          /* Validamos si el periodo se encuentra aperturado */
          if (res["data"][0].estado !== 'C') {
      
              this.msgSpinner = 'Aprobando aranceles...';
              this.lcargando.ctlSpinner(true);
              console.log(this.aranceles);
              let data2 = {
                total: this.liquidacion.total,
                subtotal: this.liquidacion.subtotal,
                id : this.liquidacion.id,
                contribuyente: this.liquidacion.fk_contribuyente,
                liquidacion: this.aranceles
              }
              this.apiService.aprobacionEmision(data2).subscribe(
                (res)=>{
                  console.log(res);
                  this.liquidacion.estado = "A"
                  this.lcargando.ctlSpinner(false);
                  this.vmButtons[3].habilitar = true;
                  Swal.fire('Documento aprobado', 'Liquidaciones generadas correctamente', 'success')
                },
                (error)=>{
                  console.log(error);
                  this.toastr.info(error.message)
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
    })
    
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

  expandExoneracion(event, valid) {
    if (event.propietarios && event.propietarios.length > 1)  {
      this.arancelSelected = event
      this.multiplesPropietarios = true
      this.tbl_propietarios = event.propietarios
      this.tbl_propietarios.forEach((element: any) => Object.assign(element, {proporcional: 0, descuento: 0, total: 0}))
      let i = 0;
      for (; i < this.tbl_propietarios.length - 1; i++) {
        const valor = Math.round(event.total / this.tbl_propietarios.length * 100) / 100
        Object.assign(this.tbl_propietarios[i], { proporcional: valor, total: valor})
      }
      const demas: number = this.tbl_propietarios.reduce((acc: number, curr: any) => acc + parseFloat(curr.proporcional ?? 0), 0)
      console.log(event.total, demas)
      const valor = Math.round((event.total - demas) * 100) / 100
      Object.assign(this.tbl_propietarios[i], { proporcional: valor, total: valor})
    } else {
    if (this.contribuyenteActive.supervivencia != 'N') {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.arancel = event
    modalInvoice.componentInstance.validacion = valid
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive
    }
    }
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

  expandExonContribuyente(contribuyente_id: number) {
    const modalInvoice = this.modalService.open(ModalExonContribuyenteComponent, {
      size: 'xl',
      backdrop: 'static'
    })
    modalInvoice.componentInstance.contribuyente = contribuyente_id
  }

}
