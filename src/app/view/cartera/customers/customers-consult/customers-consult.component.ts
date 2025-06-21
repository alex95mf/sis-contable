import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ConsultacustomersService } from "./customers-consult.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-customers-consult',
  templateUrl: './customers-consult.component.html',
  styleUrls: ['./customers-consult.component.scss']
})
export class CustomersConsultComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  permisions: any;
  dataUser: any;
  pais:any = 0;
  ciudad:any = 0;
  provincia:any = 0;
  cliente:any = 0;
  vendedor:any = 0;
  grupo:any = 0;
  clientes: Array<any> = [];
  dtContacto: Array<any> = [];
  dtInformacion: any = {};
  vendedores: Array<any> = [];
  groups: Array<any> = [];
  arrayDtContacto: Array<any> = [];
  catalog: any = {};
  provinceTurn: boolean = false;
  cityTurn: boolean = false;
  processingtwo: boolean = false;
  vmButtons: any = [];
  locality:any;
  constructor(private socket: Socket,
    private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ConsultacustomersService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsCCliente", paramAccion: "", boton: { icon: "fas fa-share-square", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsCCliente", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsCCliente", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsCCliente", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
    ];

      setTimeout(() => {
        this.getPermisions();
      }, 10);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fRClienteConsulta,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene permiso para ver Formulario Consulta Clientes.");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {

        this.getClientes();

      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
      case "LIMPIAR":
        this.limpiarCliente();
      break;
			case "EXCEL":
				$('#tableConsultCli').DataTable().button('.buttons-excel').trigger();
				break;
			case "PDF":
				$('#tableConsultCli').DataTable().button('.buttons-pdf').trigger();
				break;
			case "IMPRIMIR":
        $('#tableConsultCli').DataTable().button( '.buttons-print' ).trigger();
      break;
		}
	}

  getClientes() {
    this.reportesSrv.getClients().subscribe((res) => {
      this.clientes = res["data"];
      this.getVendedores();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }

  getVendedores() {
    this.reportesSrv.getVendedor().subscribe((res) => {
      this.vendedores = res["data"];
      this.getGroupsPrice();

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }

  getGroupsPrice() {
    this.reportesSrv.getGroupPrices().subscribe(res => {

      this.groups = res['data'];
      this.fillCatalog();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  fillCatalog() {
    let data = {
      params: "'PAIS','GARANTIAS','PROVINCIA'",
    };
    this.reportesSrv.getCatalogs(data).subscribe(res => {
      this.catalog.countries = res["data"]["PAIS"];
      this.catalog.persons = res["data"]["PERSONA"];
      this.catalog.provincias = res["data"]["PROVINCIA"];
      this.pais = 0;
      this.provincia = 0;
      this.ciudad = 0;
      this.getDT();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }

  getDT() {
    this.reportesSrv.getcontactos().subscribe(res => {
      this.arrayDtContacto = res['data'];
      this.getTableReport();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  searchCliente(data){
    if (this.cliente != 0) {
      this.cliente = data;
      this.rerender();
      } else{
        this.rerender();
    }
    }

    searchVendedor(data){
    if (this.vendedor != 0) {
      this.vendedor = data;
      this.rerender();
      } else{
        this.rerender();
    }
    }

    searchGrupo(data){
      if (this.grupo != 0) {
        this.grupo = data;
        this.rerender();
        } else{
          this.rerender();
      }
      }

  searchProvinces(event) {

    if (this.pais != 0) {
    this.reportesSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.province = res['data'];
      this.pais = event;
      this.provinceTurn = true;
      this.cityTurn = false;
      this.rerender();
      setTimeout(() => {
        this.provincia = 0;
        this.catalog.city = undefined;
        this.ciudad = 0;

      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  } else{
    this.rerender();
}

  }

  searchCities(event) {
    if (this.provincia != 0) {
    this.reportesSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.city = res['data'];
      this.provincia = event;
      this.cityTurn = true;
      this.rerender();
      setTimeout(() => {
        this.ciudad = 0;
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  } else{
    this.rerender();
}
  }

  searchCiudad(data){
    if (this.ciudad != 0) {
      this.ciudad = data;
      this.rerender();
      } else{
        this.rerender();
    }
  }

  getTableReport() {
    let data = {
      cliente: this.cliente  == 0  ? null : this.cliente,
      vendedor: this.vendedor  == 0  ? null : this.vendedor,
      grupo: this.grupo  == 0  ? null : this.grupo,
      pais: this.pais  == 0  ? null : this.pais,
      provincia: this.provincia  == 0  ? null : this.provincia,
      ciudad: this.ciudad  == 0  ? null : this.ciudad,
    }
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      buttons: [
        {
          extend: "excel",
          footer: true,
          title: "Reporte",
          filename: "reportes",
        },
        {
          extend: "print",
          footer: true,
          title: "Reporte",
          filename: "report print",
        },
        {
          extend: "pdf",
          footer: true,
          title: "Reporte",
          filename: "Reporte",
        },
      ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.reportesSrv.getReportCliente(data).subscribe(res => {

    this.validaDt = true;
    this.infoData = res['data'];

    if(this.infoData.length == 0){
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;
    }else{
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;
    }
    setTimeout(() => {
      this.dtTrigger.next(null);
      this.lcargando.ctlSpinner(false);
    }, 50);
  }, error => {
    this.validaDt = true;
    this.lcargando.ctlSpinner(false);
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);
    this.lcargando.ctlSpinner(false);
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
  });
}

rerender(): void {
this.validaDt = false;
this.lcargando.ctlSpinner(true);
this.dtElement.dtInstance.then((dtInstance: any) => {
  dtInstance.destroy();
  this.getTableReport();
});
}

limpiarCliente(){
  this.cliente = 0;
  this.vendedor = 0;
  this.grupo = 0;
  this.pais = 0;
  this.ciudad = 0;
  this.provincia = 0;
  this.rerender();
  }

informaDocumento(dt) {
  $('#modalConsultaCliente').appendTo("body").modal('show');
  let modalDoc = this.arrayDtContacto.filter((e) => e.fk_cliente == dt.id_cliente);
  this.dtContacto = modalDoc;
  }

  closeModal() {
  ($("#modalConsultaCliente") as any).modal("hide");
     this.dtInformacion = {};
    this.dtContacto = [];
  }

  formatNumber(params) {
		this.locality = 'en-EN';
		params = parseFloat(params).toLocaleString(this.locality, {
			minimumFractionDigits: 2
		})
		params = params.replace(/[,.]/g, function (m) {
			return m === ',' ? '.' : ',';
		});
		return params;
	}
}
