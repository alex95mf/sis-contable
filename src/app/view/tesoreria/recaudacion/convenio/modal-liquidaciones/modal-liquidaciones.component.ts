import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';

import { format } from 'date-fns';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
import { ConvenioService } from '../convenio.service';

@Component({
  selector: 'app-modal-liquidaciones',
  templateUrl: './modal-liquidaciones.component.html',
  styleUrls: ['./modal-liquidaciones.component.scss']
})
export class ModalLiquidacionesComponent implements OnInit {
  mensajeSppiner: string = "Cargnado...";
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

  vmButtons: any;
  resdata: any = [];
  liquidacionesDt: any = [];
  paginate: any;
  filter: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;


  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: ConvenioService,
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
    
    setTimeout(()=> {
      this.cargarLiquidaciones();
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
    this.cargarLiquidaciones();
  }

  cargarLiquidaciones(){
    this.mensajeSppiner = "Cargando lista de Liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      codigo: "CO",
      fk_contribuyente: this.fk_contribuyente,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.apiSrv.getLiqByContribuyente(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];

        if (res['data']['current_page'] == 1) {
          let array = res['data']['data'];
          array.forEach(e => {
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e , {
                  tipo_documento: e.concepto.codigo,
                  numero_documento: e.documento,
                  nombre: e.concepto.nombre ?? "",
                  valor: e.total,
                  saldo: e.deuda.saldo,
                  cobro: e.deuda.saldo,
                  nuevo_saldo: 0,
                  comentario: "",
                  aplica: true,
                  total: e.total,
                  id_liquidacion: e.id_liquidacion
                })
              }
            })
          })
          this.resdata = array;
        } else {
          let array = Object.values(res['data']['data']);
          array.forEach((e:any)=> {
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e , {
                  tipo_documento: e.concepto.codigo,
                  numero_documento: e.documento,
                  nombre: e.concepto.nombre ?? "",
                  valor: e.total,
                  saldo: e.deuda.saldo,
                  cobro: e.deuda.saldo,
                  nuevo_saldo: 0,
                  comentario: "",
                  aplica: true,
                  total: e.total,
                  id_liquidacion: e.id_liquidacion
                })
              }
            })
          })
          this.resdata = array;
        }

        this.liquidacionesDt = this.resdata.filter(l =>l.estado =="A");
        this.lcargando.ctlSpinner(false);
        console.log(this.liquidacionesDt);
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
        nombre: dt.concepto.nombre ?? "NA",
        valor: dt.total,
        saldo: dt.deuda.saldo,
        cobro: dt.deuda.saldo, // en convenio se debe escoger todo siempre
        nuevo_saldo: 0,
        comentario: "",
        aplica: true,
        total: dt.total,
        id_liquidacion: dt.id_liquidacion
      })
    
      this.deudas.push(dt);
    }else {
      // let id = this.conceptos.indexOf(dt);
      // this.conceptos.splice(i,1);
      this.deudas.forEach(c => {
        if(dt.id_liquidacion==c.id_liquidacion){
          // console.log(c);
          let id = this.deudas.indexOf(c);
          this.deudas.splice(id,1);
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
