import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';
import { ConsultaProveedoresService } from './consulta-proveedores.service';
import { XlsExportService } from 'src/app/services/xls-export.service';

@Component({
standalone: false,
  selector: 'app-consulta-proveedores',
  templateUrl: './consulta-proveedores.component.html',
  styleUrls: ['./consulta-proveedores.component.scss']
})
export class ConsultaProveedoresComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any = false;

  vmButtons: any;
  proveedoresDt: any = [];
  paginate: any;
  filter: any;
  catalog: any = {};
  tamDoc: any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: ConsultaProveedoresService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
         orig: "btnsConProveedores",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConProveedores",
       paramAction: "",
       boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
       permiso: true,
       showtxt: true,
       showimg: true,
       showbadge: false,
       clase: "btn btn-danger boton btn-sm",
       habilitar: false,
     },
      {
        orig: "btnsConProveedores",
        paramAction: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
    ]
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.filter = {
      num_documento: null,
      razon_social: null,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [10, 20, 50, 100]
    }

    setTimeout(() => {
      this.cargarProveedores(true);
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.fillBorradoManual()
        break;
        case "LIMPIAR":
          this.limpiarFiltros()
          break;
      case "EXCEL":
        this.exportarExcel()
        break;

      default:
        break;
    }
  }

  exportarPDF = () => {
    window.open(`${environment.ReportingUrl}rpt_lista_contribuyentes.pdf?j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&p_razon_social=${this.filter.razon_social ?? ""}&p_num_documento=${this.filter.num_documento ?? ""}`)
  }

  exportarExcel = () => {
    let excelData = []
    this.mensajeSppiner = "Descargando Listado de Proveedores"
    this.lcargando.ctlSpinner(true)
    this.mdlSrv.getProveedores({ params: { filter: this.filter } }).subscribe(
      (res: any) => {
        console.log(res)
        let data = {
          title: 'Proveedores',
          rows:  res.data
        }
        console.log(data)
      
        this.xlsService.exportConsultaProveedores(data, 'Proveedores')
        this.lcargando.ctlSpinner(false)
        // res.data.forEach((element: any) => {
        //   const {tipo_documento, num_documento, razon_social, ciudad } = element
        //   const data = {
        //     TipoDocumento: tipo_documento,
        //     NumeroDocumento: num_documento,
        //     RazonSocial: razon_social,
        //     Ciudad: ciudad
        //   }
        //   excelData.push(data)
        // })
        //this.excelService.exportAsExcelFile(excelData, 'Proveedores')
       
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Proveedores')
      }
    )
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarProveedores(false);
  }


  fillBorradoManual() {

    if (this.filter.tipo_documento == 0) {
      this.filter.tipo_documento = undefined;
    } else if (this.filter.num_documento == "") {
      this.filter.num_documento = undefined;
    } else if (this.filter.razon_social == "") {
      this.filter.razon_social = undefined;
    } else if (this.filter.ciudad == 0) {
      this.filter.ciudad = undefined;
    }

    this.cargarProveedores(false)

  }

  cargarProveedores(inicial: boolean) {
    this.mensajeSppiner = "Cargando lista de Proveedores...";
    this.lcargando.ctlSpinner(true);

    // if( this.filter.tipo_documento == undefined) {
    //   this.filter.tipo_documento = 0;
    // }else if(this.filter.num_documento == ""){
    //   this.filter.num_documento = undefined;
    // }else if (this.filter.razon_social == ""){
    //   this.filter.razon_social = undefined;
    // }else if (this.filter.ciudad == 0){
    //   this.filter.ciudad = undefined;
    // }
    let data = {
      params: {
        filter: inicial ? undefined : this.filter,
        paginate: this.paginate,
      }
    }

    this.mdlSrv.getProveedores(data).subscribe(
      (res) => {
        // console.log(data);

        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.proveedoresDt = []
        } else {
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.proveedoresDt = res['data']['data'];
          } else {
            this.proveedoresDt = Object.values(res['data']['data']);
          }
        }

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

 

  /* OnChange */
  docValidate(event) {
    document.getElementById("num_documento").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }

  limpiarFiltros() {
    this.filter = {
      num_documento: undefined,
      razon_social: undefined,
      filterControl: ""
    }
    this.filter.ciudad = 0;
    //this.cargarContribuyentes();
  }


}
