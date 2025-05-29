import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ParametrosCuentasComprobantesService } from './parametros-cuentas-comprobantes.service';
import * as myVarGlobals from "../../../../global";
import { FormSaveComponent } from './form-save/form-save.component';

@Component({
standalone: false,
  selector: 'app-parametros-cuentas-comprobantes',
  templateUrl: './parametros-cuentas-comprobantes.component.html',
  styleUrls: ['./parametros-cuentas-comprobantes.component.scss']
})
export class ParametrosCuentasComprobantesComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Parámetros cuentas comprobantes";

  vmButtons: any = [];
  dataUser: any;
  permissions: any;

  dataDt: any = [];

  showInactive = false;
  
  paginate: any;
  filter: any;
 
  constructor(
    private apiSrv: ParametrosCuentasComprobantesService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
  ) {

    //this.commonVarSrv.modalCargarRetIVA.asObservable().subscribe(
      this.apiSrv.listaParametros$.subscribe(
      (res)=>{
        this.cargarData()
      }
    )
   

  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRetIVA",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
    ];

    this.filter = {
      descripcion: undefined,
      codigo: undefined,
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

    // cambiar permisos a los de retenciones en cuanto se tengan
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
          this.cargarData();
       
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarData() {
    this.mensajeSppiner = "Cargando Parámetros Contables...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.apiSrv.getData(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.dataDt = res['data']['data'];
        } else {
          this.dataDt = Object.values(res['data']['data']);
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
        this.showForm(true, {});
        break;
      // case " MOSTRAR INACTIVOS":
      //   this.changeShowInactive(this.showInactive);
      //   break;
    }
  }

  showForm(isNew:boolean, data?:any) {
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar retenciones.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear retenciones.", this.fTitle);
    } else {
      
      // console.log(data);
      const modalInvoice = this.modalSrv.open(FormSaveComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      console.log(data);
      modalInvoice.componentInstance.module_comp = myVarGlobals.fConcepto;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      
    }
  }

 

  changeShowInactive(showInactive) {
    if (showInactive) {
      this.vmButtons[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A', 'I'];
    } else {
      this.vmButtons[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['I'];
    }
    this.showInactive = !this.showInactive;
    this.cargarData();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarData();
  }

  limpiarFiltros() {
    
    this.filter.descripcion = undefined;
    this.filter.codigo = undefined;
    // this.filter.estado = undefined;
    // this.changeShowInactive(true);
    // this.cargarConceptos();
  }

}
