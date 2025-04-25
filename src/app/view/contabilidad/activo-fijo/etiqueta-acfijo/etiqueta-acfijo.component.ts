import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { EtiquetaAcfijoService } from "./etiqueta-acfijo.services";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
  selector: 'app-etiqueta-acfijo',
  templateUrl: './etiqueta-acfijo.component.html',
  styleUrls: ['./etiqueta-acfijo.component.scss']
})
export class EtiquetaAcfijoComponent implements OnInit {
  arrayActivos: Array<any> = [];
  codigoBar: any;
  dataUser: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoDt: any;
  processing: any = false;
  permisions: any;
  arrayGrupo: Array<any> = [];
  dataMarcas: Array<any> = [];
  dataModelos: Array<any> = [];
  arrayCountrys: Array<any> = [];
  empresLogo: any;
  grupo: any;
  marca: any;
  modelo: any;
  origen: any;
  estado: any;
  dsPrint: any = false;
  dataSucursal:any;
  arrayEstado: any = [{ id: "Nuevo", nombre: "Nuevo" }, { id: "Usado", nombre: "Usado" }];

  mensajeSppiner: string = "Cargando...";
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: EtiquetaAcfijoService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void { 
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnEtiActFij", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark btn-sm", habilitar: false, imprimir: false},
      { orig: "btnEtiActFij", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section", imprimir: true}
    ];
    this.getPermisions();
  }

  
  getPermisions() {  
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fREtiqueta,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene acceso a este formulario.");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.processing = true;
        this.getSucursal();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "LIMPIAR":
        this.informaciondtlimpiar();
        break;
      case "IMPRIMIR":
        this.savePrint();
        break;
    }
  }

  getGrupo(){
    this.reportesSrv.getDepreciaciones().subscribe(res => {
      this.arrayGrupo = res['data'];
      this.getCatalogo();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCatalogo() {
    let data = {
      params: "'MODELOS','MARCAS'"
    }
    this.reportesSrv.getCatalogos(data).subscribe(res => {
      this.dataMarcas = res['data']['MARCAS'];
      this.dataModelos = res['data']['MODELOS'];
      this.getCurrencys();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

 getCurrencys() {
    this.reportesSrv.getCurrencys().subscribe(res => {
      this.arrayCountrys = res['data'];
      this.getTableReport();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
}

getSucursal() {
  this.reportesSrv.getSucursales().subscribe(res => {
    this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
    this.getGrupo();
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.toastr.info(error.error.message);
  })
}

  getTableReport() {
    this.vmButtons[1].habilitar = true;
    let data = {
      grupo: this.grupo  == undefined ? null : this.grupo,
      marca: this.marca  == undefined ? null : this.marca,
      modelo: this.modelo  == undefined ? null : this.modelo,
      origen: this.origen  == undefined ? null : this.origen,
      estado: this.estado  == undefined  ? null : this.estado
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
    };
    this.lcargando.ctlSpinner(true);
    this.reportesSrv.getAtivosFijos(data).subscribe(res => {

      this.validaDt = true;
      this.processing = true;
      this.dsPrint = true;
      this.vmButtons[1].habilitar = false;
      this.infoDt = res['data'];
      
      setTimeout(() => {
        this.lcargando.ctlSpinner(false);
        this.dtTrigger.next();
      }, 50);
    }, error => {
      this.validaDt = true;
      this.processing = true;
      setTimeout(() => {
        this.lcargando.ctlSpinner(false);
        this.dtTrigger.next();
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  
  rerender(): void {
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  filterGrupo(data){ 
    if (this.grupo != undefined) {
      this.grupo = data
      this.rerender();
      } else{
        this.rerender();
    }
  }

    filterMarca(data){ 
    if (this.marca != undefined) {
      this.marca = data
      this.rerender();
      } else{
        this.rerender();
    }
  }

    filterModelo(data){ 
    if (this.modelo != undefined) {
      this.modelo = data
      this.rerender();
      } else{
        this.rerender();
    }
  }

    filterOrigen(data){ 
    if (this.origen != undefined) {
      this.origen = data
      this.rerender();
      } else{
        this.rerender();
    }
  }


    filterEstado(data){ 
    if (this.estado != undefined) {
      this.estado = data
      this.rerender();
      } else{
        this.rerender();
    }
  }

    informaciondtlimpiar(){
    this.rerender();
    this.grupo = undefined;
    this.marca = undefined;
    this.modelo = undefined;
    this.origen = undefined;
    this.estado = undefined;
  }
  
  savePrint() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: "Registro de impresion Reporte de Codigos de Barras",
      id_controlador: myVarGlobals.fREtiqueta,
    }
    this.reportesSrv.printData(data).subscribe(res => {
    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }


}

