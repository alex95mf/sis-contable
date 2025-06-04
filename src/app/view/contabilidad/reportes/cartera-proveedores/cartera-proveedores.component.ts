import { Component, OnInit,ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CcModalTablaProveedoresComponent } from 'src/app/config/custom/cc-modal-tabla-proveedores/cc-modal-tabla-proveedores.component';
import { CarteraProveedoresService } from './cartera-proveedores.service';

import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';

import * as myVarGlobals from "../../../../global";

import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-cartera-proveedores',
  templateUrl: './cartera-proveedores.component.html',
  styleUrls: ['./cartera-proveedores.component.scss'],
  providers: [DialogService]
})
export class CarteraProveedoresComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  vmButtons: any;

  dataUser: any;
  permisions: any;
  permiso_ver: any = "0";
  id_proveedor: any = 0;
  name_proveedor: any;

  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();

  locality: any;
  estado_cuenta: any = [];
  
  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private estProv: CarteraProveedoresService,
  ) { }
  ref: DynamicDialogRef;

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsCarteraProv", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsCarteraProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsCarteraProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn-danger boton btn-sm", habilitar: false },
      // { orig: "btnsCarteraProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "IMPRESION" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
    ];

    //this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
       this.AvailableCxP();
        break;
      case "EXCEL":
       this.DescargaFormatoExcel();
        break;

      case "PDF":
       this.DescargaFormatoPDF();
        break;

      // case "IMPRESION":
      //   this.DescargaFormatoHTML();
      //   break;
    }
  }

  getPermisions() {

    //this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;

    let data = {
      codigo: myVarGlobals.fProveeduriaCompras,
      id_rol: id_rol
    }

    this.commonServices.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'][0];
      this.permiso_ver = this.permisions.ver;

      if (this.permisions.ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver el formulario de compras de proveeduria");
        this.vmButtons = [];
        //this.lcargando.ctlSpinner(false);

      } else {


        // this.lcargando.ctlSpinner(false);

      }

    }, error => {
      //this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  onClickConsultaProveedores() {

    let busqueda = (typeof this.name_proveedor === 'undefined') ? "" : this.name_proveedor;

    localStorage.setItem("busqueda_proveedores", busqueda)

    this.ref = this.dialogService.open(CcModalTablaProveedoresComponent, {
      header: 'Proveedores',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((product: any) => {

      if (product) {
        console.log(product);

        this.name_proveedor = product['data'].razon_social;
        this.id_proveedor = product['data'].id_proveedor;

      }

    });

  }
  calculateCustomerTotal(name) {

    let total = 0.00;

    if (this.estado_cuenta) {
      for (let customer of this.estado_cuenta) {
        if (customer.razon_social === name && customer.tipo_movimiento == 'Compras') {
          total += parseFloat(customer.saldo);
        }
      }
    }

    return total;
  }

  calculateCustomerTotalReporte() {
    let total = 0.00;

    if (this.estado_cuenta) {
      for (let customer of this.estado_cuenta) {
       if (customer.tipo_movimiento == 'Compras') {
          total += parseFloat(customer.saldo);
       }
      }
    }

    return total;
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

  DescargaFormatoExcel() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
    let id_provee = this.id_proveedor;

    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_cartera_proveedores.html?id_proveedor=0&fecha_inicio=20230116&fecha_fin=20230121&id_empresa=1
    window.open(environment.ReportingUrl + "rpt_cartera_proveedores.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_proveedor=" + id_provee + "&fecha_inicio=" + dateFrom + "&fecha_fin=" + dateTo + "&id_empresa =" + id_provee, '_blank')

  }

  DescargaFormatoPDF() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
    let id_provee = this.id_proveedor;

    window.open(environment.ReportingUrl + "rpt_cartera_proveedores.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_proveedor=" + id_provee + "&fecha_inicio=" + dateFrom + "&fecha_fin=" + dateTo + "&id_empresa =" + id_provee, '_blank')

  }

  DescargaFormatoHTML() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
    let id_provee = this.id_proveedor;

    window.open(environment.ReportingUrl + "rpt_cartera_proveedores.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_proveedor=" + id_provee + "&fecha_inicio=" + dateFrom + "&fecha_fin=" + dateTo + "&id_empresa =" + id_provee, '_blank')

  }
  ConsultarRegistroCompra(reg:any){

    window.open(environment.ReportingUrl + "rpt_compras.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_compra=" + reg.id, '_blank')


  }

  AvailableCxP() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');

    this.mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.estProv.ObtenerCarteraProveedor(dateFrom, dateTo, this.id_proveedor).subscribe(response => {

      console.log(response);
      this.estado_cuenta = response;
      this.lcargando.ctlSpinner(false);


    }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

}
