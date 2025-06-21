import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { GeneracionValorService } from './generacion-valor.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalConceptosComponent } from 'src/app/config/custom/modal-conceptos/modal-conceptos.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-generacion-valor',
  templateUrl: './generacion-valor.component.html',
  styleUrls: ['./generacion-valor.component.scss']
})
export class GeneracionValorComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Liquidación (Conceptos Varios)";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  formReadOnly = false;
  ordenDisabled = true;
  codCastDisabled = true;

  conDisabled = true;
  observacionesDisabled = true;
  conceptosDisabled = true;
  exoneracionDisabled = true;

  verifyRestore = false;

  staConVarios: boolean = false

  contribuyenteActive: any = {
    razon_social: ""
  };
  
  conceptosBackup: any = [];
  conceptos: any = [];
  exoneracionesBackup: any = [];
  exoneraciones: any = [];

  conceptosList: any = [];
  concepto: any = 0;

  liquidacion = {
    id: null,
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
    subtotal_0: 0,
    subtotal_1: 0,
    subtotal_2: 0,
    coactiva: 0,
    total: 0,
    interes:0,
    descuento:0,
    detalles: [],
    sta: 0,
    recargo:0
  };

  totalCalculo: boolean= true

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

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: GeneracionValorService,
    private cierremesService: CierreMesService
  ) { 
    //al seleccionar una liquidacion desde el modal BUSCAR
    //this.commonVarService.selectListLiqPURen.asObservable().subscribe(
    this.commonVarService.selectListLiqPURen.pipe(takeUntil(this.onDestroy$)).subscribe(

      
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
        if(e.concepto.fk_concepto==32) { //exoneraciones
          let exon = {
            cod_concepto_det_aplicable: e.cod_con_det_aplicado,
            con_det_codigo: e.concepto.codigo_detalle,
            comentario: e.comentario,
            descripcion: e.concepto.nombre_detalle,
            porcentaje: e.total / this.liquidacion.subtotal,
            valor: e.total
          }
          this.exoneraciones.push(exon);
        } else {
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
      });
      // if (this.liquidacion.fk_orden_inspeccion && this.liquidacion.fk_orden_inspeccion != 0) {
      //   (this as any).mensajeSpinner = 'Cargando datos de la Liquidación...';
      //   this.lcargando.ctlSpinner(true);
      //   let data = {
      //     inspeccion: this.liquidacion.fk_orden_inspeccion
      //   }
      //   this.apiService.getInspeccion(data).subscribe(
      //     (res) => {
      //       //console.log(res);
      //       this.lcargando.ctlSpinner(false);
      //       this.ordenActive = res['data'];
      //     },
      //     (error) => {

      //     }
      //   );
      // }
      // this.conceptos.forEach(e => {
      //   if (e.valor == 0) {
      //     e.aplica = false;
      //   }
      // });

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;
      //this.calcTotal()
      
      //this.lcargando.ctlSpinner(false);
    }
  )
  // al seleccionar una exoneracion desde el boton + de Exoneraciones
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
  // this.commonVarService.selectConcepLiqLCRen.asObservable().subscribe(
  //   (res) => {
  //     this.conceptos = res;
  //     this.calculateExoneraciones();
  //   }
  // );
  // al seleccionar un concepto desde el boton + de Conceptos
  this.commonVarService.selectConceptoCustom.asObservable().subscribe(
    (res) => {
      this.conceptos = res;
      this.conceptos.sort(function(a,b) {
        return parseFloat(a.id_concepto_detalle) - parseFloat(b.id_concepto_detalle);
      });
      // this.calculateExoneraciones();
      this.calcSubtotal();
    }
  );
  // this.commonVarService.selectInspeccionRentas.asObservable().subscribe(
  //   (res) => {
  //     //console.log(res);
  //     this.ordenActive = res;
  //     this.observacionesDisabled = false;
  //     this.conceptosDisabled = false;
  //     this.exoneracionDisabled = false;
  //   }
  // )
  // al seleccionar contribuyente desde la lupa
  this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
    (res) => {
      //console.log(res);
      this.contribuyenteActive = res;
      // this.ordenDisabled = false;
      this.conDisabled = false;
      this.vmButtons[3].habilitar = false;
      if (res.valid == 10) {
        //this.selectContibuyente(res);
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

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsRenLiqGenValor",
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
        orig: "btnsRenLiqGenValor",
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
        orig: "btnsRenLiqGenValor",
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
        orig: "btnsRenLiqGenValor",
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
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
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
          this.getConceptos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  mostrar() {
    console.log(this.contribuyenteActive);
    console.log(this.concepto);
    this.observacionesDisabled = false;
    this.conceptosDisabled = false;
    this.exoneracionDisabled = false;
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

        // filtra conceptos a solo los que tienen tarifa
        this.conceptosList = this.conceptosList.filter(c => c.codigo=="CV");
        console.log(this.conceptos);

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contribuyentes')
      }
    )
  }

  removeConcepto(index) {

    this.conceptos[index].valor = 0;
    this.conceptos[index].aplica = false;
    // this.conceptos.splice(index,1);
    this.calcSubtotal();
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calcExonerTotal();
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
                this.liquidacion.fk_concepto = this.concepto.id;
                // this.liquidacion.fk_orden_inspeccion = this.ordenActive.id_inspeccion_orden;
                this.liquidacion.detalles = [];
                this.conceptos.forEach(e => {
                  if (e.aplica && e.total > 0) {
                    this.liquidacion.detalles.push(e);
                  }
                });
                this.exoneraciones.forEach(e => {
                  this.liquidacion.detalles.push(e);
                });
                let data = {
                  liquidacion: this.liquidacion
                }
                console.log(this.liquidacion);
                this.apiService.setLiquidacion(data).subscribe(
                  (res) => {
                    console.log(res);
                    Swal.fire({
                      icon: "success",
                      title: "Liquidación generada",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                    this.liquidacion = res['data'];
                    this.calcSubtotal()
                    this.formReadOnly = true;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
                    console.log(this.liquidacion);
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
        calculo += +e.total; // en este caso es total porque sale de valor unitario * cantidad
      }
    });
    this.liquidacion.subtotal = calculo;
    this.liquidacion.subtotal_0 = calculo;
    //this.liquidacion.total = this.liquidacion.subtotal;
    this.calcExonerTotal();
  }

  calcExonerTotal() {
    // aplica exoneracion a todo el subtotal
    let porcentaje = 0;
    // let calculo = 0;
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

  
  calcTotal() {
    
    let sumasValores =  (this.liquidacion.subtotal_2 + this.liquidacion.recargo + this.liquidacion.interes)
    this.liquidacion.total = sumasValores - this.liquidacion.descuento;

    this.vmButtons[0].habilitar = false;
  }

  // calcTotal() {
  //   let subtotal_1 = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
  //   this.liquidacion.subtotal_1 = subtotal_1;
  //   // if(this.totalCalculo){
  //         this.liquidacion.total = this.liquidacion.subtotal_1;
  //   //}
  //   // if (preTotal > 0) {
  //   //   this.liquidacion.subtotal_1 = preTotal;
  //   //   if(this.totalCalculo){
  //   //     this.liquidacion.total = this.liquidacion.subtotal_1;
  //   //   }
  //   // } else {
  //   //   this.liquidacion.subtotal_1 = 0;
  //   //   if(this.totalCalculo){
  //   //     this.liquidacion.total = this.liquidacion.subtotal_1;
  //   //   }
  //   // }
  //   this.vmButtons[0].habilitar = false;
  // }

  multiplicar(con_det) {
    let total = con_det.cantidad * con_det.valor;
    con_det.total = total;
    console.log(con_det);
    this.calcSubtotal();
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
      concepto: 'CV'
    };
    (this as any).mensajeSpinner = 'Validadando Sta...';
    this.lcargando.ctlSpinner(true);
   
    this.apiService.getStaConcepto(data).subscribe(
      (res) => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        if(res['data'].length > 0){
          const datos = res['data'].filter(e => e.codigo == 'CV')[0]
          if(datos.tiene_sta == 'S') {
            console.log(datos.tiene_sta)
            this.staConVarios= false; 
          }else{
            this.staConVarios= true; 
          }
        }else{
          this.staConVarios= true; 
        }
        console.log(this.staConVarios)
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error validando STA');
      }
    );
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
      subtotal_0: 0,
      subtotal_1: 0,
      subtotal_2: 0,
      coactiva: 0,
      interes:0,
      descuento:0,
      detalles: [],
      sta: 0,
      recargo:0
    };

    this.contribuyenteActive = {
      razon_social: ""
    };
    
    this.conceptosBackup = [];
    // this.conceptos.forEach(e => {
    //   e.comentario = "",
    //   e.valor = 0,
    //   e.aplica = true
    // });
    this.conceptos = [];
    this.exoneracionesBackup = [];
    this.exoneraciones = [];

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
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
      modalInvoice.componentInstance.id_concepto = 55;
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

  expandConceptos() {
    const modalInvoice = this.modalService.open(ModalConceptosComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.id_concepto = this.concepto.id;
    modalInvoice.componentInstance.codigo = "CV";
    modalInvoice.componentInstance.conceptos = this.conceptos;
    modalInvoice.componentInstance.fTitle = "Conceptos varios con valor unitario";
    modalInvoice.componentInstance.valor_unitario = true;
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
      modalInvoice.componentInstance.validacion = 10;
    }
  }

}
