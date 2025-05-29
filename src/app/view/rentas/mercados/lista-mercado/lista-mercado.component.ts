import { Component, OnInit, ViewChild } from '@angular/core';
import { ListaMercadoService } from './lista-mercado.service';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import * as myVarGlobals from 'src/app/global';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';

@Component({
standalone: false,
  selector: 'app-lista-mercado',
  templateUrl: './lista-mercado.component.html',
  styleUrls: ['./lista-mercado.component.scss']
})
export class ListaMercadoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false})
  lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;

  fTitle = 'Lista de mercado'

  vmButtons = []

  paginate: any;
  filter: any;

  listMerc = []

  mercado = []

  dataUser: any;
  permissions: any;

  estado = [
    {valor: 'A', description: 'Activo'},
    {valor: 'I', description: 'Inactivo'},
    {valor: 'X', description: 'Anulado'},
  ]

  constructor(
    private commonVarService: CommonVarService,
    private apiService: ListaMercadoService,
    private toastr: ToastrService,
    private modalSrv: NgbModal,
    private commonService: CommonService,
    private excelService: ExcelService,
  ) {
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res)=>{
        // console.log(res);
        this.filter.contribuyente = res.razon_social
      }
    )
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: 'btnsRenListaMer',
        paramAccion: "",
        boton: { icon: "far fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: 'btnsRenListaMer',
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: false,
        // printSection: "print-section", 
        // imprimir: true 
      },
      

    ]


    this.filter = {
      contribuyente: undefined,
      estado: undefined,
      local: undefined,
      mercado: undefined,
      descripcion: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    }

    setTimeout(() => {
      this.validaPermisos()
      
    }, 500);


  }


  validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    // this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fRenContrato,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          /*setTimeout(() => {
            this.getContribuyentes()
          }, 150)*/
          this.cargarListMerc();
          this.fillCatalog();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }


  metodoGlobal(event) {
    // console.log(event)
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportarExcel()
        break;
      case "PDF":
        let url = `${environment.ReportingUrl}rpt_locales_municipales.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}`
        window.open(url, '_blank')
        break;

      default:
        break;
    }

  }


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarListMerc();
  }



  cargarListMerc(){
    this.msgSpinner = 'Cargando Lista Mercados'
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.apiService.getListaMercado(data).subscribe(
      (res)=>{
        console.log(res);
        this.paginate.length = res['data']['total'];
        if(res['data']['current_page'] == 1){
          this.listMerc = res['data']['data'];
        }else{

          if(res['data'].length != 0){
            this.listMerc = Object.values(res['data']['data']);
          }else{
            this.listMerc = []
          }
          
          
        }

        this.lcargando.ctlSpinner(false);
      }, (error)=>{
        console.log(error);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  limpiarFiltros(){
    this.filter = {
      contribuyente: undefined,
      estado: undefined,
      local: undefined,
      mercado: undefined,
      descripcion: undefined,
      filterControl: ""
    }
  }


  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.msgSpinner = "Cargando Catalogs";
    let data = {
      params: "'REN_MERCADO'",
    };
    this.apiService.getCatalogs(data).subscribe(
      (res) => {
        // console.log(res);
        res["data"]["REN_MERCADO"].map((e=>{

          if(e.estado == 'A'){

            this.mercado.push(e);

          }

        }))
        // this.mercado = res["data"]["REN_MERCADO"];
        

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );


  }

  exportarExcel() {
    let excelData = [];


    this.listMerc.map((e)=>{

      const {razon_social} = e.fk_contribuyente;
      const {numero_puesto, descripcion} = e.fk_mercado_puesto;
      const {descripcion: merc} = e.fk_mercado;
      const {nombre} = e.id_usuario;

      const data = {
        Contribuyente: razon_social,
        Local_comercial: numero_puesto,
        Actividad: e.local,
        Mercado: merc,
        Local: descripcion,
        Contrato: e.numero_contrato,
        Desde: e.fecha_inicio,
        Hasta: e.fecha_vencimiento,
        Estado: e.estado == 1 ? 'Activo' : 'Inactivo',
        Estado_legalización: e.estado_legalizacion == null ? 'No hay datos' : e.estado_legalizacion,
        Creación: nombre,
        Fecha: e.fecha_inicio,
        Motivo: 'No hay datos',
      }
      excelData.push(data)

    });


    this.excelService.exportAsExcelFile(excelData, 'Lista_Mercado');


  }


  expandContribuyentes() {
    const modalInvoice = this.modalSrv.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenContrato;
    modalInvoice.componentInstance.permissions = this.permissions;
  }

}
