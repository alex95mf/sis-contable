import { Component, OnInit,ViewChild } from '@angular/core';
import { AbogadosService } from './abogados.service';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalNuevoComponent} from './modal-nuevo/modal-nuevo.component'
import {ModalEdicionComponent} from './modal-edicion/modal-edicion.component'
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';

@Component({
  selector: 'app-abogados',
  templateUrl: './abogados.component.html',
  styleUrls: ['./abogados.component.scss']
})
export class AbogadosComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  dataUser: any;
  vmButtons: any;
  fTitle: string = "Abogados";
  abogados: any = [];
  paginate: any;
  filter: any;
  permissions: any;
  estados: any[] = [
    { id: 'A', nombre: 'ACTIVO' },
    { id: 'I', nombre: 'INACTIVO' },
    { id: 'X', nombre: 'ANULADO' },

  ]


  constructor(
    private abogadosSrv: AbogadosService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonVrs:CommonVarService,
    private commonSrv: CommonService,
  ) 
  
  { 
    this.commonVrs.updateAbogados.asObservable().subscribe(
      (res)=>{
        if (res) {
          // this.getAbogados();
          // console.log('daniel');
          this.abogados = [...this.abogados, res['data']]
          console.log(this.abogados);
        }
      }
    );

    this.commonVrs.editAbogado.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarAbogados();
        }
      }
    );

  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      
    ];

    this.filter = {
      nombres: undefined,
      apellidos: undefined,
      estado: '',
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(()=> {
      this.validaPermisos();
    }, 0);


  }


  validaPermisos() {
    this.mensajeSppiner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fConcepto,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarAbogados();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  cargarAbogados() {
    this.mensajeSppiner = "Cargando listado de Abogados...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.abogadosSrv.getAbogados(data).subscribe(
      (res: any) => {
        // console.log(data);
        // console.log(res);
        if (Array.isArray(res.data) && !res.data.length) {
          this.lcargando.ctlSpinner(false)
          return;
        }

        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.abogados = res['data']['data'];
        } 
        else {
          this.abogados = Object.values(res['data']['data']);  
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.nuevoAbogado();
        break;

    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarAbogados();
  }

  limpiarFiltros() {

    this.filter.nombres = undefined;
    this.filter.apellidos = undefined;
    this.filter.estado='';
  }

  nuevoAbogado () {
    const modal = this.modalService.open(ModalNuevoComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
  }

  paginaInicio(){
    this.paginate.page = 1
    this.cargarAbogados()


  }
  

  editarAbogado(isNew:boolean, data?:any) {
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Abogados.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Abogados.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ModalEdicionComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fConcepto;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
    }
  }

}
