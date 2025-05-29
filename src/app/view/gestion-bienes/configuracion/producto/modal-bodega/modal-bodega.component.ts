
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ProductoService } from '../producto.service';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
//import { ReciboCobroService } from '../recibo-cobro.service';
@Component({
standalone: false,
  selector: 'app-modal-bodega',
  templateUrl: './modal-bodega.component.html',
  styleUrls: ['./modal-bodega.component.scss']
})
export class ModalBodegaComponent implements OnInit {
  mensajeSppiner: string = "Cargnado...";
  @ViewChild(CcSpinerProcesarComponent, { static: false}) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  @Input() permissions: any;

  @Input() ubicaciones: any = [];
  vmButtons: any;
  resdata: any = [];
  liquidacionesDt: any = [];
  paginate: any;
  filter: any;
  bodegas: any = [];
  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: ProductoService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      { orig: "btnModalLiq",
      paramAccion: "",
      boton: { icon: "fas fa-plus", texto: " APLICAR" },
      permiso: true,
      showtxt: true,
      showimg: true,
      showbadge: false,
      clase: "btn btn-success boton btn-sm",
      habilitar: false
    }
      ,{
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

    this.filter = {
      codigo: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(()=> {
      this.cargarBodegas();
    }, 100);
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarBodegas();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal(this.ubicaciones);
        break;
      case " APLICAR":
        this.closeModal(this.ubicaciones);
        break;
    }
  }

  closeModal(data?:any) {
    if(data){
      //this.commonVrs.selectUbicacionProducto.next(data);
      this.apiSrv.bodegas$.emit(data)

    }
    this.activeModal.dismiss();
  }


  aplica(dt){
    let aplica = dt.aplica;
    console.log(dt);
    if(aplica){
      dt.cantidad = 1;
      dt.total = dt.valor;
      this.ubicaciones.push(dt);
  }
}

aplicarFiltros() {
  this.paginate.page = 1;
  this.cargarBodegas();
}

limpiarFiltros() {
  this.filter.codigo = undefined;
  // this.cargarContribuyentes();
}

  cargarBodegas(){
    this.mensajeSppiner = "Cargando lista de Bodegas...";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data)
    this.apiSrv.getBodegas(data).subscribe(
      (res) => {
        console.log(res);
        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.bodegas = []
        } else {
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.bodegas = res['data']['data'];

        }
        else {
           this.bodegas = Object.values(res['data']['data']);

          }
          console.log(this.bodegas)
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

}
