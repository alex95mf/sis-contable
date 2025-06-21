import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';

import moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
import { RecaudacionesEspeciesFiscalesService } from '../recaudaciones-especies-fiscales.service';
// import { GarantiaService } from '../garantia.service';

@Component({
standalone: false,
  selector: 'app-modal-liquidaciones',
  templateUrl: './modal-liquidaciones.component.html',
  styleUrls: ['./modal-liquidaciones.component.scss']
})
export class ModalLiquidacionesComponent implements OnInit {
  mensajeSpinner: string = "Cargnado...";
  @ViewChild(CcSpinerProcesarComponent, { static: false}) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
  @Input() id_concepto: any;
  @Input() codigo: string;
  @Input() fk_contribuyente: any;
  @Input() deudas: any = [];
  @Input() listaConceptos: any;
  @Input() totalCobro: number;

  vmButtons: any;
  resdata: any = [];
  liquidacionesDt: any = [];
  conveniosATDt: any = [];
  paginate: any;
  filter: any;
  paginateCO: any;
  filterCO: any;
  paginateAT: any;
  filterAT: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  selectedMode: string = 'REC';

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: RecaudacionesEspeciesFiscalesService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnModalLiq",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    this.filterCO = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }

    this.paginateCO = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    this.filterAT = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }

    this.paginateAT = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(()=> {
      this.cargarLiquidaciones(true);
    }, 0);
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLiquidaciones(false);
  }

  changePaginateCO(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginateCO, newPaginate);
    this.cargarConvenios(false);
  }

  changePaginateAT(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginateAT, newPaginate);
    this.cargarConveniosAT(false);
  }

  useMode(modo: string) {
    this.selectedMode = modo;
  }

  cargarLiquidaciones(firstload: boolean){
    (this as any).mensajeSpinner = "Cargando títulos pendientes...";
    this.lcargando.ctlSpinner(true);

    let data = {
      codigo: 'REC', // parametro para traer solo deudas de conceptos de titulos pendientes (no cuotas)
      fk_contribuyente: this.fk_contribuyente,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);

    this.apiSrv.getLiqByContribuyente(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];

        if (res['data']['current_page'] == 1) {
          let array = res['data']['data'];
          array.forEach(e => {
            if (e.deuda){
              Object.assign(e , {
                tipo_documento: e.concepto.codigo,
                numero_documento: e.documento,
                nombre: e.concepto.nombre ?? "",
                valor: e.total,
                saldo: e.deuda.saldo,
                cobro: (+e.deuda.saldo).toFixed(2),
                nuevo_saldo: 0,
                comentario: "",
                aplica: false,
                total: e.total,
                id_liquidacion: e.id_liquidacion
              })

              if(e.concepto.codigo == "CU"){
                if(e.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
                  Object.assign(e, {
                    num_cuota: e.cuota.num_cuota,
                    num_cuotas: e.cuota.documento.num_cuotas,
                    monto_total: e.cuota.documento.total,
                    cobro: e.cuota.valor,
                    plazo_maximo: e.cuota.fecha_plazo_maximo,
                  })
                }
                else { // CUOTA INICIAL no tiene rec_documento_det
                  Object.assign(e, {
                    num_cuota: 0,
                    monto_total: (+(+e.total*100 / +e.observacion)).toFixed(2),
                    cobro: e.total,
                    plazo_maximo: e.resolucion_fecha,
                  })
                }
              }
            }
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e, {
                  aplica: true
                })
              }
            })
          })
          this.resdata = array;
        } else {
          let array = Object.values(res['data']['data']);
          array.forEach((e:any)=> {
            if (e.deuda){
              Object.assign(e , {
                tipo_documento: e.concepto.codigo,
                numero_documento: e.documento,
                nombre: e.concepto.nombre ?? "",
                valor: e.total,
                saldo: e.deuda.saldo,
                cobro: (+e.deuda.saldo).toFixed(2),
                nuevo_saldo: 0,
                comentario: "",
                aplica: false,
                total: e.total,
                id_liquidacion: e.id_liquidacion
              })

              if(e.concepto.codigo == "CU"){
                if(e.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
                  Object.assign(e, {
                    num_cuota: e.cuota.num_cuota,
                    num_cuotas: e.cuota.documento.num_cuotas,
                    monto_total: e.cuota.documento.total,
                    cobro: (+e.cuota.valor).toFixed(2),
                    plazo_maximo: e.cuota.fecha_plazo_maximo,
                  })
                }
                else { // CUOTA INICIAL no tiene rec_documento_det
                  Object.assign(e, {
                    num_cuota: 0,
                    monto_total: +e.total*100 / +e.observacion,
                    cobro: (+e.total).toFixed(2),
                    plazo_maximo: e.resolucion_fecha,
                  })
                }
              }
            }
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e, {
                  aplica: true
                })
              }
            })
          })
          this.resdata = array;
        }

        //
        if(firstload){
          this.cargarConvenios(true);
        }else{
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );


  }

  cargarConvenios(firstload: boolean) {
    (this as any).mensajeSpinner = "Cargando deudas de convenios...";
    this.lcargando.ctlSpinner(true);

    let dataCO = {
      codigo: 'CUO', // parametro para traer solo cuotas de convenio (convencional)
      fk_contribuyente: this.fk_contribuyente,
      params: {
        filter: this.filterCO,
        paginate: this.paginateCO,
      }
    }

    this.apiSrv.getLiqByContribuyente(dataCO).subscribe(
      (res) => {
        console.log(res);
        this.paginateCO.length = res['data']['total'];

        if (res['data']['current_page'] == 1) {
          let array = res['data']['data'];
          array.forEach(e => {
            if (e.deuda){
              Object.assign(e , {
                tipo_documento: e.concepto.codigo,
                numero_documento: e.documento,
                nombre: e.concepto.nombre ?? "",
                valor: e.total,
                saldo: e.deuda.saldo,
                cobro: (+e.deuda.saldo).toFixed(2),
                nuevo_saldo: 0,
                comentario: "",
                aplica: false,
                total: e.total,
                id_liquidacion: e.id_liquidacion
              })

              if(e.concepto.codigo == "CU"){
                if(e.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
                  Object.assign(e, {
                    num_cuota: e.cuota.num_cuota,
                    num_cuotas: e.cuota.documento.num_cuotas,
                    monto_total: e.cuota.documento.total,
                    cobro: e.cuota.valor,
                    plazo_maximo: e.cuota.fecha_plazo_maximo,
                  })
                }
                else { // CUOTA INICIAL no tiene rec_documento_det
                  Object.assign(e, {
                    num_cuota: 0,
                    monto_total: (+(+e.total*100 / +e.observacion)).toFixed(2),
                    cobro: e.total,
                    plazo_maximo: e.resolucion_fecha,
                  })
                }
              }
            }
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e, {
                  aplica: true
                })
              }
            })
          })
          this.liquidacionesDt = array;
        } else {
          let array = Object.values(res['data']['data']);
          array.forEach((e:any)=> {
            if (e.deuda){
              Object.assign(e , {
                tipo_documento: e.concepto.codigo,
                numero_documento: e.documento,
                nombre: e.concepto.nombre ?? "",
                valor: e.total,
                saldo: e.deuda.saldo,
                cobro: (+e.deuda.saldo).toFixed(2),
                nuevo_saldo: 0,
                comentario: "",
                aplica: false,
                total: e.total,
                id_liquidacion: e.id_liquidacion
              })

              if(e.concepto.codigo == "CU"){
                if(e.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
                  Object.assign(e, {
                    num_cuota: e.cuota.num_cuota,
                    num_cuotas: e.cuota.documento.num_cuotas,
                    monto_total: e.cuota.documento.total,
                    cobro: (+e.cuota.valor).toFixed(2),
                    plazo_maximo: e.cuota.fecha_plazo_maximo,
                  })
                }
                else { // CUOTA INICIAL no tiene rec_documento_det
                  Object.assign(e, {
                    num_cuota: 0,
                    monto_total: +e.total*100 / +e.observacion,
                    cobro: (+e.total).toFixed(2),
                    plazo_maximo: e.resolucion_fecha,
                  })
                }
              }
            }
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e, {
                  aplica: true
                })
              }
            })
          })
          this.liquidacionesDt = array;
        }

        //
        if(firstload){
          this.cargarConveniosAT(true);
        }else{
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarConveniosAT(firstload: boolean) {
    (this as any).mensajeSpinner = "Cargando deudas de convenios de arriendo de terreno...";
    this.lcargando.ctlSpinner(true);

    let dataCOTE = {
      codigo: 'CUTE', // parametro para traer solo cuotas de convenio (convencional)
      fk_contribuyente: this.fk_contribuyente,
      params: {
        filter: this.filterAT,
        paginate: this.paginateAT,
      }
    }

    this.apiSrv.getLiqByContribuyente(dataCOTE).subscribe(
      (res) => {
        console.log(res);
        this.paginateAT.length = res['data']['total'];

        if (res['data']['current_page'] == 1) {
          let array = res['data']['data'];
          array.forEach(e => {
            if (e.deuda){
              Object.assign(e , {
                tipo_documento: e.concepto.codigo,
                numero_documento: e.documento,
                nombre: e.concepto.nombre ?? "",
                valor: e.total,
                saldo: e.deuda.saldo,
                cobro: (+e.deuda.saldo).toFixed(2),
                nuevo_saldo: 0,
                comentario: "",
                aplica: false,
                total: e.total,
                id_liquidacion: e.id_liquidacion
              })

              if(e.concepto.codigo == "CUTE"){
                if(e.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
                  Object.assign(e, {
                    num_cuota: e.cuota.num_cuota,
                    num_cuotas: e.cuota.documento.num_cuotas,
                    monto_total: e.cuota.documento.total,
                    cobro: e.cuota.valor,
                    plazo_maximo: e.cuota.fecha_plazo_maximo,
                  })
                }
                else { // CUOTA INICIAL no tiene rec_documento_det
                  Object.assign(e, {
                    num_cuota: 0,
                    monto_total: (+(+e.total*100 / +e.observacion)).toFixed(2),
                    cobro: e.total,
                    plazo_maximo: e.resolucion_fecha,
                  })
                }
              }
            }
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e, {
                  aplica: true
                })
              }
            })
          })
          this.conveniosATDt = array;
        } else {
          let array = Object.values(res['data']['data']);
          array.forEach((e:any)=> {
            if (e.deuda){
              Object.assign(e , {
                tipo_documento: e.concepto.codigo,
                numero_documento: e.documento,
                nombre: e.concepto.nombre ?? "",
                valor: e.total,
                saldo: e.deuda.saldo,
                cobro: (+e.deuda.saldo).toFixed(2),
                nuevo_saldo: 0,
                comentario: "",
                aplica: false,
                total: e.total,
                id_liquidacion: e.id_liquidacion
              })

              if(e.concepto.codigo == "CUTE"){
                if(e.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
                  Object.assign(e, {
                    num_cuota: e.cuota.num_cuota,
                    num_cuotas: e.cuota.documento.num_cuotas,
                    monto_total: e.cuota.documento.total,
                    cobro: (+e.cuota.valor).toFixed(2),
                    plazo_maximo: e.cuota.fecha_plazo_maximo,
                  })
                }
                else { // CUOTA INICIAL no tiene rec_documento_det
                  Object.assign(e, {
                    num_cuota: 0,
                    monto_total: +e.total*100 / +e.observacion,
                    cobro: (+e.total).toFixed(2),
                    plazo_maximo: e.resolucion_fecha,
                  })
                }
              }
            }
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e, {
                  aplica: true
                })
              }
            })
          })
          this.conveniosATDt = array;
        }

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  aplica(dt){
    let aplica = dt.aplica;
    // console.log(dt);
    if(aplica){
      // dt.cantidad = 1;
      // dt.total = dt.valor;
      // ENCONTRAR DEUDA ASOCIADA Y AGREGAR CAMPOS DE DEUDA A LA LIQUIDACION
      Object.assign(dt , {
        tipo_documento: dt.concepto.codigo,
        numero_documento: dt.documento,
        nombre: dt.concepto.nombre ?? "",
        valor: dt.total,
        saldo: dt.deuda.saldo,
        cobro: (+dt.deuda.saldo).toFixed(2),
        nuevo_saldo: 0,
        comentario: "",
        aplica: true,
        total: dt.total,
        id_liquidacion: dt.id_liquidacion
      })

      if(dt.concepto.codigo == "CU"){
        if(dt.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
          Object.assign(dt, {
            num_cuota: dt.cuota.num_cuota,
            num_cuotas: dt.cuota.documento.num_cuotas,
            monto_total: dt.cuota.documento.total,
            cobro: (+dt.cuota.valor).toFixed(2),
            plazo_maximo: dt.cuota.fecha_plazo_maximo,
          })
        }
        else { // CUOTA INICIAL no tiene rec_documento_det
          Object.assign(dt, {
            num_cuota: 0,
            monto_total: (+(+dt.total*100 / +dt.observacion)).toFixed(2),
            cobro: (+dt.total).toFixed(2),
            plazo_maximo: dt.resolucion_fecha,
          })
        }
      }

      this.deudas.push(dt);
      this.totalCobro += +dt.cobro;
    }else {
      // let id = this.conceptos.indexOf(dt);
      // this.conceptos.splice(i,1);
      this.deudas.forEach(c => {
        if(dt.id_liquidacion==c.id_liquidacion){
          // console.log(c);
          let id = this.deudas.indexOf(c);
          this.deudas.splice(id,1);
          this.totalCobro -= +dt.cobro;
        }
      })
    }
  }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }
    // this.cargarLiquidaciones();
  }

  limpiarFiltrosCO() {
    this.filterCO = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }
    // this.cargarLiquidaciones();
  }

  limpiarFiltrosAT() {
    this.filterAT = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      filterControl: ""
    }
    // this.cargarLiquidaciones();
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta Liquidación? Los campos llenados y calculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?:any) {
    this.commonVrs.needRefresh.next(true);
    this.activeModal.dismiss();
  }

}
