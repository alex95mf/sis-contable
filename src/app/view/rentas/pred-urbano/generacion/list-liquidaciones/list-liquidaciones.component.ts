import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { GeneracionService } from '../generacion.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
import moment from 'moment';

@Component({
standalone: false,
  selector: 'app-list-liquidaciones',
  templateUrl: './list-liquidaciones.component.html',
  styleUrls: ['./list-liquidaciones.component.scss']
})
export class ListLiquidacionesComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;

  vmButtons: any;
  liquidacionesDt: any = [];
  paginate: any;
  filter: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private generacionSrv: GeneracionService,
  ) {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnListLiqRP",
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
      razon_social: null,
      num_documento: null,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
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
    (this as any).mensajeSpinner = "Cargando lista de Liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      concepto: {
        id: 33,
        codigo: 'PU'
      },
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.generacionSrv.getLiquidaciones(data).subscribe(
      (res: any) => {
        this.paginate.length = res.data.total
        this.liquidacionesDt = res.data.data
        
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  consultar() {
    Object.assign(
      this.paginate,
      { page: 1 }
    )

    this.cargarLiquidaciones()
  }

  limpiarFiltros() {
    Object.assign(
      this.filter,
      {
        razon_social: null,
        num_documento: null,
        fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
        fecha_hasta: moment().format('YYYY-MM-DD'),
      }
    )
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
      this.generacionSrv.liquidacionSelected$.emit(data)
    }
    this.activeModal.dismiss();
  }

}
