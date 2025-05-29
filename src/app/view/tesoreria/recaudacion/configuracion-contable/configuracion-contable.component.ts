import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ConfiguracionContableService } from './configuracion-contable.service';
import { ModalModificacionesContableComponent } from './modal-modificaciones-contable/modal-modificaciones-contable.component';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { PageEvent } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-configuracion-contable',
  templateUrl: './configuracion-contable.component.html',
  styleUrls: ['./configuracion-contable.component.scss']
})
export class ConfiguracionContableComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  vmButtons: any;
  filter: any ;
  paginate: any;
  permissions: any;
  fTitle = 'Configuracion Contables'

  configuracionContable: any = [];

  dataUser: any;

  tipoPagos = [];


  constructor(
    private modal: NgbModal,
    private service: ConfiguracionContableService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService
  ) { 
    this.commonVarSrv.modalConfiguracionContable.asObservable().subscribe(
      (res)=>{
        this.getConfiguracionContable()
      }
    )
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]


    this.filter = {
      descripcion: undefined,
      forma_pago: undefined,
      submodulo: undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };

    this.paginate = {
      pageIndex: 0,
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(() => {
      this.validaPermisos()

    }, 500);



  }


  validaPermisos() {
    this.mensajeSppiner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fConfiguracionContable,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.");
          this.vmButtons = [];
        } else {
          // this.getConfiguracionContable();
          this.getCatalogos()
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  metodoGlobal(event){
    switch(event.items.boton.texto){
      case 'NUEVO':
        this.nuevoModal(true);
        break;
      case 'CONSULTAR':
        // this.nuevoModal(true);
        this.consultar()
        break;
      case 'LIMPIAR':
        this.limpiarFiltros();
        break;
    }
  }


  nuevoModal(valid, data = ''){
    let modal = this.modal.open(ModalModificacionesContableComponent, {
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modal.componentInstance.new = valid;
    modal.componentInstance.dato = data;


  }

  getCatalogos() {
    this.mensajeSppiner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);
    this.service.getCatalogos({params: "'REC_TIPO_PAGO'"}).subscribe(
      (res) => {
        // console.log(res);
        res['data']['REC_TIPO_PAGO'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.tipoPagos.push(f_pago);
        });
        // this.lcargando.ctlSpinner(false);               
        this.getConfiguracionContable()
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  changePaginate(event: PageEvent) {
    Object.assign(this.paginate, { page: event.pageIndex + 1});
    this.getConfiguracionContable();
  }


  limpiarFiltros(){
    Object.assign(this.filter, {
      descripcion: null,
      forma_pago: null,
      submodulo: null,
    })
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    this.getConfiguracionContable()
  }

  getConfiguracionContable(){
    this.mensajeSppiner = "Cargando listado de Configuracion Contable...";
    this.lcargando.ctlSpinner(true);
    this.service.getConfiguracionContable({params: { filter: this.filter, paginate: this.paginate }}).subscribe(
      (res: any)=>{
        console.log(res);
        this.paginate.length = res.data.total;
        this.configuracionContable = res.data.data
        this.lcargando.ctlSpinner(false);
      },(error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message);
      }
    )
  }

}
