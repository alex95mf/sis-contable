import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { ListContratosComponent } from '../../mercados/contrato/list-contratos/list-contratos.component';
import * as myVarGlobals from 'src/app/global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ArriendoterrenoService } from './arriendoterreno.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';

@Component({
standalone: false,
  selector: 'app-arriendoterrenos',
  templateUrl: './arriendoterrenos.component.html',
  styleUrls: ['./arriendoterrenos.component.scss']
})
export class ArriendoterrenosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory

  fTitle = "Generación de Arriendo de Terreno"
  mensajeSpinner: string = "Cargando...";
  dataUser: any;
  permissions: any;
  empresLogo: any;
  vmButtons = [];
  propiedades: any = [];
  contribuyenteActive: any = {};
  propiedadActive:any = 0;
  conceptosBackup: any = [];
  conceptos: any = [];
  exoneraciones: any[] = [];
  exoneracionesBackup: any = [];
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

  at_tipo:any =  ""
  at_contrato: any= undefined
  periodo: any = null
  fecha: any = moment(new Date()).format('YYYY-MM-DD')
  observacion: any = ""

  formReadOnly = false;
  codCastDisabled = true;
  observacionesDisabled = true;
  conceptosDisabled = true;
  exoneracionDisabled = true;
  verifyRestore = false;

  staArri:boolean = false
  liquidacion = {
    id: null,
    at_tipo: "",
    at_contrato: undefined,
    documento: "",
    //periodo: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: "",
    fk_contribuyente: null,
    fk_concepto: 54,
    fk_lote: null,
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
    concepto: {codigo: 'AR'},
    periodo:null,
    sta:0,
    recargo: 0
  };
  conceptosCalculado: any = [];
  baseImponible: any;
  porcentaje:any;
  liquidacionExiste: any = [];

  constructor(
    // private toastr: ToastrService,
    private commonService: CommonService,
    private commonServices: CommonService,
    private commonVarService: CommonVarService,
    //private apiService: ContratoService,
    private serArrt: ArriendoterrenoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService
  ) {

    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      res => {
        //console.log(res);
        this.selectContibuyente(res);
        this.conceptos.fk_contribuyente = res;

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
    );
    // this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
    //   (res) => {
    //     //console.log(res);
    //     this.contribuyenteActive = res;
    //     // this.ordenDisabled = false;
    //     this.conDisabled = false;
    //     this.vmButtons[3].habilitar = false;
    //     if (res.valid == 10) {
    //       //this.selectContibuyente(res);
    //       if (res.fecha_nacimiento != null) {
    //         if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
    //         ) {
    //           this.expandSupervivencia(res.id_cliente);
    //         }
    //       }
    //       else {
    //         console.log("hola")
    //       }
    //     }
    //   }
    // );

    this.commonVarService.selectListLiqArriendo.asObservable().subscribe(
      (res) => {
        console.log(res);
        (this as any).mensajeSpinner = 'Cargando datos de la liquidación...';
        this.lcargando.ctlSpinner(true);
        this.restoreForm(false, false);
        this.formReadOnly = true;
        //console.log('liquidacion '+ res)
        this.liquidacion = res;
        this.at_tipo = res.at_tipo;
        this.at_contrato = res.at_contrato;
        this.periodo = res.periodo;
        this.fecha = res.fecha
        this.observacion = res.observacion


        this.liquidacion.fecha = res.fecha.split(" ")[0];
        this.contribuyenteActive = res.contribuyente;
        if(res.lote !=null){
          this.propiedades = [
            {
              id: res.lote.id,
              cod_catastral: res.codigo_catastro,
              manzana: res.lote.manzana,
              solar: res.lote.solar,
              area: res.lote.area
            }
          ];
        }
        else {
          this.propiedades = [
            {
              id: null,
              cod_catastral: res.codigo_catastro,
              manzana: null,
              solar: null,
              area: null
            }
          ];
        }

        this.propiedadActive = res.lote;
        res.detalles.forEach(e => {
          if (!e.fk_con_det_aplicado) {
            //console.log(this.conceptos.find(c => c.codigo_detalle == e.cod_con_det_aplicado))
              Object.assign(this.conceptos.find(c => c.codigo_detalle == e.concepto.codigo_detalle), { comentario: e.comentario, valor: e.valor });
          }
        });
        this.baseImponible = this.propiedadActive.area * this.propiedadActive.valor_metro_cuadrado;

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
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;

       // this.getConceptos();

        this.lcargando.ctlSpinner(false);
      }
    )
    this.commonVarService.selectExonerLiqPURen.asObservable().subscribe(
      (res) => {
        this.exoneraciones = res;
        this.exoneraciones.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });
        this.calculateExoneraciones();

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
     this.getConceptos();
     this.validarSta();
     //this.calcSubtotal();
     //this.getArriendoTerrenoTabla();
    }, 50);
  }


  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fRenArriendoTerrenos,
      id_rol: this.dataUser.id_rol,
    };
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        //console.log(this.permissions);
        if (this.permissions.abrir == "0") {
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.getConceptos();
        }
      },
      err => {
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
        this.limpiarForm(false, false);
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
      at_tipo: "",
      at_contrato: undefined,
      documento: "",
      //periodo: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: "",
      fk_contribuyente: null,
      fk_concepto: 54,
      fk_lote: null,
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
      concepto: {codigo: 'AR'},
      periodo:null,
      sta:0,
      recargo:0
    };
    this.baseImponible="";
    this.conceptosBackup = [];
    this.conceptos.forEach(e => {
      e.comentario = "";
      e.valor = 0;
     // console.log(this.conceptos);
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

  limpiarForm(keepContr, softRestore) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.formReadOnly = false;
    this.conceptosDisabled = true;
    this.exoneracionDisabled = true;
    this.liquidacion = {
      id: null,
      at_tipo: "",
      at_contrato: undefined,
      documento: "",
      //periodo: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: "",
      fk_contribuyente: null,
      fk_concepto: 54,
      fk_lote: null,
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
      concepto: {codigo: 'AR'},
      periodo:null,
      sta:0,
      recargo:0
    };
    this.baseImponible="";
    this.conceptosBackup = [];
    this.conceptos.forEach(e => {
      e.comentario = "";
      e.valor = 0;
     // console.log(this.conceptos);
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

    this.at_tipo =  ""
    this.at_contrato= undefined
    this.periodo= null
    this.fecha= moment(new Date()).format('YYYY-MM-DD')
    this.observacion = ""
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
        this.at_tipo == "" ||
        this.at_tipo == undefined
      ) {
        this.toastr.info("El campo Tipo no puede ser vacío");
        flag = true;
      }
      else if (
        this.at_contrato == 0 ||
        this.at_contrato == undefined
      ){
        this.toastr.info("El campo Nro Contrato no puede ser vacío");
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
        // this.liquidacion.observacion == "" ||
        // this.liquidacion.observacion == undefined
        this.observacion.trim() == "" ||
        this.observacion.trim().length == 0
      ){
        this.toastr.info("El campo Observaciones no puede ser vacío");
        flag = true;
      }


      !flag ? resolve(true) : resolve(false);
    })
  }

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenArriendoTerrenos;
    modalInvoice.componentInstance.permissions = this.permissions;
  }

  changePeriodo(event) {
    // console.log(event);
    Object.assign(this.liquidacion, {periodo: moment(event.target.value).format('YYYY')})
  }

  getConceptos() {
    let data = {
      id_concepto: 54
    }
    let salario = 425.00
    let limiteArea = 250.00
    let excedente = this.propiedadActive.area - limiteArea;
    let valorExcedente = 0.20
    let valorArea = 3.00
    let valorSalario = 425.00
    let limiteRbu =25
    let valorRbuMenor = 2.00
    let valorRbuMayor = 5.00
    let baseImponible = parseFloat(this.propiedadActive.area) * parseFloat(this.propiedadActive.valor_metro_cuadrado);
    this.baseImponible = baseImponible;
    //this.baseImponible = parseFloat(this.propiedadActive.area) * parseFloat(this.propiedadActive.valor_metro_cuadrado);

    console.log(this.propiedadActive.area)
    console.log(this.propiedadActive.valor_metro_cuadrado)
    console.log(this.baseImponible)


    this.serArrt.getArriendoTerrenoTabla({}).subscribe(
      (res) => {
        let porcentaje = 0;
        let arriendoTabla = res['data'];
        let cant = baseImponible;

        arriendoTabla.forEach(t => {
          if(t.rango_hasta>0 ){
            // cuando esta en un rango de valores normal
            if(cant >= t.rango_desde && cant <= t.rango_hasta ){
              porcentaje = t.porcentaje;
            }
          } else if(t.rango_hasta==0 ){
            // cuando el rango hasta es infinito
            if(cant >= t.rango_desde){
              porcentaje = t.porcentaje;
            }
          }
        });
        this.porcentaje = porcentaje;
      //  console.log('porcentaje'+this.porcentaje);
    });

    this.serArrt.getConceptoDetalle(data).subscribe(
      (res) => {
        let calculo = 0;
        res['data'].forEach(e => {
          //console.log('codigo '+e.codigo_detalle);
          if(this.propiedadActive != 0){

            if(e.codigo_detalle == "ARRI"){
              //this.getArriendoTerrenoTabla(this.baseImponible);
              Object.assign(e, {valor: this.porcentaje*baseImponible/100 ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
              calculo += +e.valor
            }else if(e.codigo_detalle == "DETI"){
              Object.assign(e, {valor: this.propiedadActive.avaluo*1/1000 ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
              calculo += +e.valor
            }
            else if(e.codigo_detalle == "DEME"){
              if(this.propiedadActive.area != 0 && this.propiedadActive.area <= limiteArea ){
                Object.assign(e, {valor: valorArea ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
                calculo += +e.valor
              }else if(this.propiedadActive.area > limiteArea){

                Object.assign(e, {valor: excedente*valorExcedente+valorArea ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
                calculo += +e.valor
              }else{
                Object.assign(e, {valor: 0 ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
                calculo += +e.valor
              }
            }
            else if(e.codigo_detalle == "ASEO"){
              Object.assign(e, {valor: 0 ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
              calculo += +e.valor
            }
            // else if(e.codigo_detalle == "STAA"){
            //   if(this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo < valorSalario*limiteRbu){

            //     Object.assign(e, {valor: valorRbuMenor ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
            //     calculo += +e.valor
            //   }else if(this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo > valorSalario*limiteRbu){

            //     Object.assign(e, {valor: valorRbuMayor ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
            //     calculo += +e.valor
            //   }else{

            //     Object.assign(e, {valor: 0 ,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
            //     calculo += +e.valor
            //   }
            // }
            else{
              Object.assign(e, {valor: 0,comentario:e.comentario, fk_concepto_detalle: e.id_concepto_detalle});
              calculo += +e.valor
            }
          }
        })


        console.log(this.baseImponible)

        this.conceptos = JSON.parse(JSON.stringify(res['data']));
        this.liquidacion.subtotal = calculo;

        this.calcExonerTotal();
        //this.calcTotal();
        //this.calcSubtotal();
       // console.log('CONCEPTOS '+this.conceptos);
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }

   calcSubtotal() {
    //console.log('aqui '+this.conceptos);
    let calculo = 0;
    this.conceptos.forEach(e => {
      calculo += +e.valor
    });
    this.liquidacion.subtotal = calculo;
    this.liquidacion.subtotal_0 = calculo;
    this.calcExonerTotal();

  }

  calculateExoneraciones() {
    this.calcExonerTotal();
    this.exoneracionesBackup = JSON.parse(JSON.stringify(this.exoneraciones));
    this.calcTotal();
  }

  calcExonerTotal() {
    // let calculo = 0;
    // this.exoneraciones.forEach(e => {
    //   e.valor = this.conceptos.find(c => e.cod_concepto_det_aplicable == c.codigo_detalle).valor * e.porcentaje;
    //   calculo += +e.valor
    // });
    console.log(this.exoneraciones)

    this.liquidacion.exoneraciones = Math.floor(this.exoneraciones.reduce((acc: number, curr: any) => {
      const valor = this.conceptos.find(c => curr.cod_concepto_det_aplicable == c.codigo_detalle).valor * curr.porcentaje
      console.log(valor)
      Object.assign(curr, {valor})
      return acc + valor;
    }, 0) * 100) / 100;

    this.calcSubtotal_1();
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


  // calcTotal() {

  //   let preTotal = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
  //   if (preTotal > 0) {
  //     this.liquidacion.total = preTotal;
  //   } else {
  //     this.liquidacion.total = 0;
  //   }
  //   this.vmButtons[0].habilitar = false;
  // }

  selectContibuyente(contr) {
    this.restoreForm(false, false);
    this.contribuyenteActive = contr;
    this.liquidacion.fk_contribuyente = contr.id_cliente;
    this.observacionesDisabled = false;
    this.vmButtons[3].habilitar = false;
    //console.log(this.liquidacion);
    let id = contr.id_cliente;
    //console.log(id);
    this.serArrt.getPropiedades(id).subscribe(
      (res) => {
        //console.log(res);
        if (res['data'].length > 0) {
          this.propiedades = res['data']
          this.propiedades.push(res);
          console.log(this.propiedades);
          this.codCastDisabled = false;
        } else {
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
        this.toastr.error(error.error.message, 'Error cargando Propiedades')
      }
    );
  }

  selectPropiedad(event) {
    //this.propiedadSelected = c;
    //console.log(this.propiedadActive);
    this.getConceptos();

    this.verifyRestore = true;
    this.restoreForm(true, true);
    this.conceptosDisabled = false;
    this.exoneracionDisabled = false;
    this.calculateExoneraciones();
    this.calculaSta();

  }
  calculaSta(){
  console.log(this.liquidacion.sta)
    let valorSalario = 425.00
    let limiteRbu =25
    let valorRbuMenor = 2.00
    let valorRbuMayor = 5.00
    if(!this.staArri){
      if(this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo < valorSalario*limiteRbu){
        this.liquidacion.sta = valorRbuMenor
      }else if(this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo > valorSalario*limiteRbu){
        this.liquidacion.sta = valorRbuMayor
      }else{
        this.liquidacion.sta = 0
      }
    }
    console.log(this.staArri)
    console.log(this.liquidacion.sta)
  }


   validarLiquidacion(data){

    this.serArrt.getLiquidacionExiste(data).subscribe(

            (res) => {
              console.log(res)
              this.liquidacionExiste= res
              if(this.liquidacionExiste.length > 0){
                Swal.fire({
                  icon: "warning",
                  title: "¡Atención!",
                  text: "¡Ya existe una liquidacion de con el mismo Cod catastral y mismo período!",
                  showCloseButton: true,
                  //showCancelButton: false,
                  showConfirmButton: true,
                  //cancelButtonText: "Cancelar",
                  confirmButtonText: "Aceptar",
                  //cancelButtonColor: '#F86C6B',
                  confirmButtonColor: '#4DBD74',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.lcargando.ctlSpinner(false);
                  }
                });
              }else{
                 this.serArrt.setLiquidacion(data).subscribe(

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
                    this.guardarDeuda(res['data'].id_liquidacion);
                    this.getConceptos();
                    this.calcTotal();
                    this.lcargando.ctlSpinner(false);
                  },
                  (error) => {
                    Swal.fire({
                      icon: "error",
                      title: "Error al generar la liquidación",
                      text: error.error.message,
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                    this.lcargando.ctlSpinner(false);
                  }
                );
              }
            },
            (error) => {
              Swal.fire({
                icon: "error",
                title: "Error al generar la liquidación",
                text: error.error.message,
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
              this.lcargando.ctlSpinner(false);
            }
          );
   }

  createLiquidacion() {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Está a punto de emitir una nueva liquidación. ¿Desea continuar?",
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
            "anio": Number(moment(this.fecha).format('YYYY')),
            "mes": Number(moment(this.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {

                  (this as any).mensajeSpinner = 'Generando liquidación...';
                  this.lcargando.ctlSpinner(true);
                  this.liquidacion.detalles = [];
                  this.liquidacion.fk_lote = this.propiedadActive.id;

                  this.liquidacion.at_tipo = this.at_tipo
                  this.liquidacion.at_contrato = this.at_contrato
                  this.liquidacion.periodo = this.periodo
                  this.liquidacion.fecha = this.fecha
                  this.liquidacion.observacion = this.observacion
                  this.conceptos.forEach(e => {
                    if (e.valor > 0) {
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
                  this.validarLiquidacion(data);

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
    this.serArrt.aprobarLiquidacion(id).subscribe(
      (res) => {
        //console.log(res);
      },
      (err) => {
        this.toastr.info(err.error.message);
      }
    )
  }
  reestablecerConceptos() {
  }

  reestablecerExoneracion() {
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calcExonerTotal();
  }

  expandListLiquidaciones() {
   if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar liquidaciones.", this.fTitle);
   } else {
      const modalInvoice = this.modalService.open(ListLiquidacionesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenArriendoTerrenos;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
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
      concepto: 'AR'
    };
    (this as any).mensajeSpinner = 'Validadando Sta...';
    this.lcargando.ctlSpinner(true);

    this.serArrt.getStaConcepto(data).subscribe(
      (res) => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        if(res['data'].length > 0){
          const datos = res['data'].filter(e => e.codigo == 'AR')[0]
          if(datos.tiene_sta == 'S') {
            console.log(datos.tiene_sta)


            this.staArri= false;
          }else{
            this.staArri= true;
          }
        }else{
          this.staArri= true;
        }
        console.log(this.staArri)
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error validando STA');
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


  expandSupervivencia(id) {
    console.log('con-varios')
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
