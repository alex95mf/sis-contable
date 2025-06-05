import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ModalContribuyentesService } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';

@Component({
standalone: false,
  selector: 'app-con-contribuyente',
  templateUrl: './con-contribuyente.component.html',
  styleUrls: ['./con-contribuyente.component.scss']
})
export class ConContribuyenteComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any = false;

  vmButtons: any;
  contribuyentesDt: any = [];
  paginate: any;
  filter: any;
  catalog: any = {};
  tamDoc: any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: ModalContribuyentesService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConsContribuyente",
        paramAction: "",
        boton: { icon: "fas fa-file-pdf", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConsContribuyente",
        paramAction: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      }
    ]
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

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
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {
      this.cargarContribuyentes(true);
      this.fillCatalogTipoDocu();
      this.fillCatalogCiudad();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "PDF":
        this.exportarPDF()
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
    (this as any).mensajeSpinner = "Descargando Listado"
    this.lcargando.ctlSpinner(true)
    this.mdlSrv.getContribuyentes({ params: { filter: this.filter } }).subscribe(
      (res: any) => {
        console.log(res)
        res.data.forEach((element: any) => {
          const {tipo_documento, num_documento, razon_social, ciudad } = element
          const data = {
            TipoDocumento: tipo_documento,
            NumeroDocumento: num_documento,
            RazonSocial: razon_social,
            Ciudad: ciudad
          }
          excelData.push(data)
        })
        this.excelService.exportAsExcelFile(excelData, 'Contribuyentes')
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contribuyentes')
      }
    )
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarContribuyentes(false);
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

    this.cargarContribuyentes(false)

  }

  cargarContribuyentes(inicial: boolean) {
    (this as any).mensajeSpinner = "Cargando lista de Contribuyentes...";
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

    this.mdlSrv.getContribuyentes(data).subscribe(
      (res) => {
        // console.log(data);

        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.contribuyentesDt = []
        } else {
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.contribuyentesDt = res['data']['data'];
          } else {
            this.contribuyentesDt = Object.values(res['data']['data']);
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

  fillCatalogTipoDocu() {
    let data = {
      params: "'DOCUMENTO'",
    };
    this.mdlSrv.getCatalogo(data).subscribe(
      (res) => {
        // console.log(res);
        this.catalog.documents = res["data"]["DOCUMENTO"];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  fillCatalogCiudad() {
    let data = {
      params: "'CIUDAD'",
    };
    this.mdlSrv.getCatalogo(data).subscribe(
      (res) => {
        // console.log(res);
        this.catalog.ciudad = res["data"]["CIUDAD"];
      },
      (error) => {
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

  selectOption(data) {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea seleccionar otro contribuyente? Los demás campos y calculos realizados serán reiniciados.",
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

  }

  closeModal(data?: any) {
    if (data) {
      this.commonVrs.selectContribuyenteCustom.next(data);
    }
    this.activeModal.dismiss();
  }

}
