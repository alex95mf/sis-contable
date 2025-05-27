import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { OrdenService } from '../../orden/orden.service'; 

import { format } from 'date-fns';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
  selector: 'app-modal-compras',
  templateUrl: './modal-compras.component.html',
  styleUrls: ['./modal-compras.component.scss']
})
export class ModalComprasComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
  @Input() proveedor: any;

  vmButtons: any;
  documentosDt: any = [];
  paginate: any;
  filter: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  tipoSelected = 0

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: OrdenService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnListRecDocumento",
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
      tipo: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    
    setTimeout(()=> {
      this.cargarDocumentos();
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
    this.cargarDocumentos();
  }
  asignarTipo(evt) {
    this.filter.tipo = [evt]
   }

  cargarDocumentos(flag: boolean = false){
   
    if (flag) this.paginate.page = 1 
    // let data = {
    //   params: this.proveedor.id_proveedor,
    // };

    let data = {
      params: {
        id_proveedor: this.proveedor.id_proveedor,
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.mensajeSppiner = "Buscando facturas...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getProvCompras(data).subscribe(

      (res) => {
        console.log(res)
        //this.condiciones = res["data"];
        //this.facturas = Object.values(res['data']);
        // this.documentosDt = [];
        // res['data']['data'].forEach(e => {
        //   Object.assign(e, {
        //     check: false,
        //     num_doc: e.num_doc ?? "NA",
        //     fecha_compra: e.fecha_compra,
        //     valor_iva: e.valor_iva ?? "NA",
        //     subtotal: e.subtotal,
        //     total: e.total,
        //   })
        //   this.documentosDt.push(e);
         
        //   // console.log(this.deudas)

        // });

        //this.documentosDt = res['data'];
        this.paginate.length = res['data']['total'];
        this.documentosDt = res['data']['data'];
        // if (res['data']['current_page'] == 1) {
        //   this.documentosDt = res['data']['data'];
        // } else {
        //   this.documentosDt = Object.values(res['data']['data']);
        // }
        this.documentosDt.forEach(e => {
          if(e.hasretencion == 1){
            Object.assign(e, {
              disabled: true,
              retencion: 'Sin Retencion',
            })
            
          }else if(e.hasretencion == 2){
            Object.assign(e, {
              disabled: false,
              retencion: 'Retención Generada',
              num_retencion: e.retencion?.num_retencion
            })
          }else if(e.hasretencion == 3){
            Object.assign(e, {
              disabled: false,
              retencion: 'Retención Autorizada',
              num_retencion: e.retencion?.num_retencion
            })
          }
        })
       
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
    // let data = {
    //   params: {
    //     filter: this.filter,
    //     paginate: this.paginate,
    //   },
    //   codigo: "OP"
    // }

    // this.apiSrv.getRecDocumentos(data).subscribe(
    //   (res) => {

    //     //console.log('documentos'+res);
    //     this.documentosDt = res['data'];
    //     this.paginate.length = res['data']['total'];
    //     if (res['data']['current_page'] == 1) {
    //       this.documentosDt = res['data']['data'];
    //     } else {
    //       this.documentosDt = Object.values(res['data']['data']);
    //     }
    //     this.lcargando.ctlSpinner(false);
    //   },
    //   (error) => {
    //     this.lcargando.ctlSpinner(false);
    //     this.toastr.info(error.error.message);
    //   }
    // );
  }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      tipo: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }
    this.tipoSelected = 0
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta orden de pago? Los campos llenados y cálculos realizados serán reiniciados.",
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
    if(data){
      //this.commonVrs.selectRecDocumentoOrden.next(data);
      this.apiSrv.listaCompras$.emit(data)
    }
    this.activeModal.dismiss();
  }


}
