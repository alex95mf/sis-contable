import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
import { LiquidacionService } from '../liquidacion.service';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';

@Component({
  selector: 'app-list-liquidaciones',
  templateUrl: './list-liquidaciones.component.html',
  styleUrls: ['./list-liquidaciones.component.scss']
})
export class ListLiquidacionesComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;

  vmButtons: Botonera[] = [];
  liquidacionesDt: any = [];
  paginate = {
    length: 0,
    perPage: 5,
    page: 1,
    pageSizeOptions: [5, 10]
  };
  filter = {
    razon_social: undefined,
    num_documento: undefined,
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    filterControl: ""
  };
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private generacionSrv: LiquidacionService,
  ) {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      { orig: 'btnListLiqRP', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
      { orig: 'btnListLiqRP', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false},
      {
        orig: "btnListLiqRP",
        paramAccion: "",
        boton: {icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]
  }

  ngOnInit(): void {
    
    
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);
    
    setTimeout(()=> {
      this.cargarLiquidaciones();
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.cargarLiquidaciones()
  }

  changePaginate({pageIndex, pageSize}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize});
    this.cargarLiquidaciones();
  }

 

  cargarLiquidaciones(){
 
    this.mensajeSppiner = "Cargando lista de Liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      codigo: "TA",
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.generacionSrv.getLiquidacionesByCod(data).subscribe(
      (res: any) => {
        this.liquidacionesDt = res.data.data
        this.paginate.length = res['data']['total'];

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  limpiarFiltros() {
    this.filter.razon_social = undefined;
    this.filter.num_documento = undefined;
    this.filter.fecha_desde = moment().startOf('month').format('YYYY-MM-DD'),
    this.filter.fecha_hasta = moment().format('YYYY-MM-DD'),
    this.filter.filterControl = ""
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
    if(data){
      this.commonVrs.selectListLiqPURen.next(data);
    }
    this.activeModal.dismiss();
  }

}
