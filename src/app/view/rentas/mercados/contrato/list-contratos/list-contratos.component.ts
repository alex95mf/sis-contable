/*import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonVarService } from 'src/app/services/common-var.services';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoService } from '../contrato.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-list-contratos',
  templateUrl: './list-contratos.component.html',
  styleUrls: ['./list-contratos.component.scss']
})
export class ListContratosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = 'Listado de Contratos'
  mensajeSpinner: string
  vmButtons: any
  dtOptions: DataTables.Settings = {}
  dtTrigger = new Subject()

  contratos = []

  constructor(
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: ContratoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsListContratos",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      this.getContratos()
    }, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CANCELAR":
        this.activeModal.close()
        break;
    }
  }

  getContratos = () => {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 7,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    (this as any).mensajeSpinner = 'Cargando Contratos'
    this.lcargando.ctlSpinner(true)
    this.apiService.getContratosList().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Contratos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        // console.log(res['data'])

        res['data'].forEach(c => {
          let contrato = {
            id: c.id_mercado_contrato,
            tipo: c.tipo_contrato,
            fechaInicio: c.fecha_inicio,
            fechaVencimiento: c.fecha_vencimiento,
            numero: c.numero_contrato,
            estado: c.estado,
            contribuyente: c.contribuyente
          }
          this.contratos.push({...contrato})
        })
        setTimeout(() => {
          this.dtTrigger.next(null)
        }, 50)

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contratos')
        console.log(err)
      }
    )
  }

  showContrato(contrato) {
    (this as any).mensajeSpinner = 'Obteniento Contrato'
    this.lcargando.ctlSpinner(true)
    this.apiService.getContratoCompleto(contrato.id).subscribe(
      res => {
        this.commonVarService.editContrato.next(res['data'])
        this.activeModal.close()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error obteniendo Contrato')
      }
    )
  }

}

*/

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ContratoService } from '../contrato.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
standalone: false,
  selector: 'app-list-contratos',
  templateUrl: './list-contratos.component.html',
  styleUrls: ['./list-contratos.component.scss']
})
export class ListContratosComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any = false;

  fTitle = 'Listado de Contratos';
  vmButtons: any;
  contratos: any = [];
  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private contratoSrv: ContratoService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnsListContratos",
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

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      razon_social: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
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

  consultar() {
    Object.assign(this.paginate, { page: 1 })
    this.cargarLiquidaciones()
  }

  cargarLiquidaciones(){
    (this as any).mensajeSpinner = "Cargando lista de Contratos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.contratoSrv.getContratosList(data).subscribe(
      (res: any) => {
        Object.assign(this.paginate, { length: res.data.total })
        this.contratos = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  limpiarFiltros() {
    this.filter.razon_social = null
    this.filter.fecha_desde = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
    this.filter.fecha_hasta = moment().format('YYYY-MM-DD')
    // this.cargarLiquidaciones();
  }

  showContrato(id): void {
    (this as any).mensajeSpinner = 'Obteniento Contrato'
    this.lcargando.ctlSpinner(true)
    this.contratoSrv.getContratoCompleto(id).subscribe(
      res => {
        this.commonVrs.editContrato.next(res['data'])
        this.activeModal.close()
      },
      err => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error obteniendo Contrato')
      }
    )
  }

  closeModal(data?:any) {
    if(data){
      this.commonVrs.editContrato.next(data);
    }
    this.activeModal.dismiss();
  }

}
