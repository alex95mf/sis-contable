import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConsultaSuppliersService } from './consulta-supplier.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare const $: any;
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowSupplierComponent } from './show-supplier/show-supplier.component';
import * as moment from "moment";


@Component({
  selector: 'app-consulta-supplier',
  templateUrl: './consulta-supplier.component.html',
  styleUrls: ['./consulta-supplier.component.scss']
})
export class ConsultaSupplierComponent implements OnInit {

  @ViewChild("vaSelect") myInputVariable: ElementRef;
  public ddTree: DropDownTreeComponent;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  arrayProveedor: any;
  arrayProveedorAux: any;
  catalogTipo: any;
  supplierTipo: any;
  checkAuth: any = true;
  treeData: any = [];
  fields: any;
  vmButtons: any;
  proveedorSelect: any = 0;
  id_grupo_select: any = "";
  validaDt: any;
  dataBitacora: any = [];
  varAux: any = " Seleccione un grupo";
  dataUser: any;
  permissions: any;

  constructor(
    private consulSrv: ConsultaSuppliersService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private modalService: NgbModal
  ) { }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CANCELAR":
        this.CancelForm();
        break;
      case "EXCEL":
        $('#tablaConsultaProviders').DataTable().button('.buttons-excel').trigger();
        break;
      case "IMPRIMIR":
        $('#tablaConsultaProviders').DataTable().button('.buttons-print').trigger();
        break;
    }
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnConsultaProveedor", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnConsultaProveedor", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnConsultaProveedor", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
    ];
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.validatePermission();
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let params = {
      codigo: myVarGlobals.fConsultaProveedores,
      id_rol: this.dataUser.id_rol
    }
    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para usar el formulario consulta de proveedores");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        setTimeout(() => {
          this.getProveedores();
        }, 1000);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getProveedores() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      dom: 'lfrtip',
      order: [[0, "asc"]],
      buttons: [{
        extend: 'excel',
        footer: true,
        title: 'Proveedores',
        filename: 'Export_File'
      }, {
        extend: 'print',
        footer: true,
        title: 'Proveedores',
        filename: 'Export_File_pdf'
      }],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.consulSrv.getProveedores()
      .subscribe(res => {
        this.getTiposServicios();
        this.validaDt = true;
        this.arrayProveedor = res['data'];
        localStorage.setItem('providers', JSON.stringify(this.arrayProveedor));
        this.arrayProveedorAux = JSON.parse(localStorage.getItem('providers'));
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.validaDt = true;
        this.arrayProveedor = [];
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      });
  }


  getTiposServicios() {
    let data = {
      params: "'CLASE'",
    };
    this.consulSrv.getCatalogs(data).subscribe(res => {
      this.catalogTipo = res["data"]["CLASE"].filter(e => e.valor != "Representaciones" && e.valor != "Mixto");
      let flagSend = "";
      this.supplierTipo = this.catalogTipo[0]['valor'];
      if (this.supplierTipo == "Productos - Inventario") {
        flagSend = "I";
      } else if (this.supplierTipo == "Servicios") {
        flagSend = "S";
      } else if (this.supplierTipo == "Proveeduria") {
        flagSend = "P";
      } else if (this.supplierTipo == "Activos") {
        flagSend = "A";
      }
      this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getTreeProduct(data) {
    this.consulSrv.getTreeProducts(data).subscribe(res => {
      this.treeData = res['data'];
      (this.treeData.length == 0) ? this.fields = undefined :
        this.fields = { dataSource: res['data'], value: 'id_grupo', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }


  changeGroup(evt) {
    this.lcargando.ctlSpinner(true);
    let flagSend = "";
    if (evt == "Productos - Inventario") {
      flagSend = "I";
    } else if (evt == "Servicios") {
      flagSend = "S";
    } else if (evt == "Proveeduria") {
      flagSend = "P";
    } else {
      flagSend = "A";
    }
    this.treeData = [];
    this.fields = undefined;
    this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });
  }


  onChange() {
    this.id_grupo_select = "";
    this.id_grupo_select = this.myInputVariable['currentValue'][0];
    this.rerender();
  }

  sumBuyProvider(BuyProvider) {
    let sumProv = parseFloat('0');
    BuyProvider.forEach(element => {
      sumProv = parseFloat(sumProv.toString()) + parseFloat(element['total']);
    });
    return this.commonServices.formatNumber(sumProv);
  }



  CancelForm() {
    this.supplierTipo = this.catalogTipo[0]['valor'];
    this.varAux = " Seleccione un grupo";
    this.proveedorSelect = 0;
    this.id_grupo_select = "";
    this.validaDt = false;
    this.lcargando.ctlSpinner(true);
    this.fields = undefined;
    this.consulSrv.getTreeProducts({ inactive: this.checkAuth, flag: "I" }).subscribe(res => {
      this.varAux = " Seleccione un grupo";
      this.fields = { dataSource: res['data'], value: 'id_grupo', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.tableAux(JSON.parse(localStorage.getItem('providers')));
      });

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  tableAux(info) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      dom: 'lfrtip',
      order: [[0, "asc"]],
      buttons: [{
        extend: 'excel',
        footer: true,
        title: 'Proveedores',
        filename: 'Export_File'
      }, {
        extend: 'print',
        footer: true,
        title: 'Proveedores',
        filename: 'Export_File_pdf'
      }],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.validaDt = true;
    this.arrayProveedor = info;
    this.lcargando.ctlSpinner(false);
    setTimeout(() => {
      this.dtTrigger.next();
    }, 50);
  }

  rerender() {
    this.arrayProveedor = JSON.parse(localStorage.getItem('providers'));
    if (this.id_grupo_select != "" && this.proveedorSelect == 0) {
      this.arrayProveedor = this.arrayProveedor.filter(e => e.linea == this.id_grupo_select && e.clase == this.supplierTipo);
    } else if (this.id_grupo_select == "" && this.proveedorSelect != 0) {
      this.arrayProveedor = this.arrayProveedor.filter(e => e.id_proveedor == this.proveedorSelect && e.clase == this.supplierTipo);
    } else if (this.id_grupo_select != "" && this.proveedorSelect != 0) {
      this.arrayProveedor = this.arrayProveedor.filter(e => e.id_proveedor == this.proveedorSelect && e.linea == this.id_grupo_select && e.clase == this.supplierTipo);
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.tableAux(this.arrayProveedor);
    });
  }

  showProveedor(id) {
    let info = this.arrayProveedor.filter(e => e.id_proveedor == id);
    const modalInvoice = this.modalService.open(ShowSupplierComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.info = info[0];
  }

  getMaxDate(params) {
    let arrayFechas = [];
    params.forEach(element => {
      arrayFechas.push(element['fecha']);
    });
    let fechaMAyor = arrayFechas[0];
    let fechaMenor = arrayFechas[0];
    for (let index = 0; index < arrayFechas.length; index++) {
      if (arrayFechas[index] > fechaMAyor) {
        fechaMAyor = arrayFechas[index];
      }
      if (arrayFechas[index] < fechaMenor) {
        fechaMenor = arrayFechas[index];
      }
    }
    return fechaMAyor;
  }

}
