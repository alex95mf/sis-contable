import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CcModalTablaProveedoresComponent } from 'src/app/config/custom/cc-modal-tabla-proveedores/cc-modal-tabla-proveedores.component';
// import { EstadoCuentaService } from './estado-cuenta-proveedores.service';

import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';

import * as myVarGlobals from '../../../../global';

import * as moment from 'moment';
import { EstadoCuentaProveedorService } from './estado-cuenta-proveedor.service';

@Component({
  selector: 'app-estado-cuenta-proveedor',
  templateUrl: './estado-cuenta-proveedor.component.html',
  styleUrls: ['./estado-cuenta-proveedor.component.scss'],
  providers: [DialogService,]
})
export class EstadoCuentaProveedorComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  vmButtons: any;
  locality: any;

  dataUser: any;
  permisions: any;
  permiso_ver: any = "0";
  id_proveedor: any = 0;
  name_proveedor: any;

  today: any;
	tomorrow: any;
	firstday: any;
	lastday:any;
	fromDatePicker: any;
	toDatePicker: any;

  viewDate: Date = new Date();
  // fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  // toDatePicker: Date = new Date();

  estado_cuenta: any = [];

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private estProv: EstadoCuentaProveedorService,
    private commonService: CommonService,
  ) { }
  ref: DynamicDialogRef;

  ngOnInit(): void {

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    this.fromDatePicker=moment(this.firstday).format('YYYY-MM-DD');
    this.toDatePicker= moment(this.today).format('YYYY-MM-DD');

    this.vmButtons = [
      { orig: "btnsEstadoCuentaProv", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsEstadoCuentaProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsEstadoCuentaProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn-danger boton btn-sm", habilitar: false },{
        orig: "btnsEstadoCuentaProv",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false
      },
     /*  { orig: "btnsEstadoCuentaProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "IMPRESION" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false }, */
    ];

    this.getPermisions();

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

      case "IMPRESION":
        this.DescargaFormatoHTML();
        break;

        case "LIMPIAR":
        this.limpiar()
        break;
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

  limpiar(){

    this.toDatePicker = new Date();
    this.fromDatePicker = new Date();
    this.id_proveedor = "";
    this.name_proveedor = "";
    this.estado_cuenta = [];
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


  calculateCustomerTotal(name) {
    let total = 0.00;

    if (this.estado_cuenta) {
      for (let customer of this.estado_cuenta) {
        if (customer.doc_num === name && customer.tipo_movimiento == 'Compras') {
          //total += parseFloat(customer.monto_total);
          total += parseFloat(customer.saldo);
        }
      }
    }

    return total;
  }
  calculateComprasTotal() {
    let total = 0.00;

    if (this.estado_cuenta) {
      for (let customer of this.estado_cuenta) {
        if (customer.tipo_movimiento == 'Compras') {
          //total += parseFloat(customer.monto_total);
          total += parseFloat(customer.saldo);
        }
      }
    }

    return total;
  }




  DescargaFormatoExcel() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
    let id_provee = this.id_proveedor;

    window.open(environment.ReportingUrl + "rpt_estado_cuenta_proveedores.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_proveedor=" + id_provee + "&fecha_inicio=" + dateFrom + "&fecha_fin=" + dateTo + "&id_empresa =1", '_blank')

  }


  DescargaFormatoPDF() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
    let id_provee = this.id_proveedor;

    window.open(environment.ReportingUrl + "rpt_estado_cuenta_proveedores.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_proveedor=" + id_provee + "&fecha_inicio=" + dateFrom + "&fecha_fin=" + dateTo + "&id_empresa =1", '_blank')

  }

  DescargaFormatoHTML() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');
    let id_provee = this.id_proveedor;

    window.open(environment.ReportingUrl + "rpt_estado_cuenta_proveedores.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_proveedor=" + id_provee + "&fecha_inicio=" + dateFrom + "&fecha_fin=" + dateTo + "&id_empresa =1", '_blank')

  }



  AvailableCxP() {

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
    let dateTo = moment(this.toDatePicker).format('YYYYMMDD');


    if(this.id_proveedor==0 || this.id_proveedor==undefined  || this.id_proveedor=='' || this.id_proveedor==null){
      this.toastr.info('Debe seleccionar un proveedor')
    }else{
      this.mensajeSppiner = "Cargando...";
      this.lcargando.ctlSpinner(true);
      //this.filterInput = 5;
      this.estProv.ObtenerCarteraProveedor(dateFrom, dateTo, this.id_proveedor).subscribe(response => {
  
        console.log(response);
      
        this.estado_cuenta = response;
        this.estado_cuenta.forEach(e => {
          
          Object.assign(e,{saldo_actual: e.saldo_actual == null ? 0 : e.saldo_actual})
        });
        this.lcargando.ctlSpinner(false);
  
        /*this.processing = true;
        this.processingPayment = true;
        this.payments = response["data"];
        this.paymentsAux = response["data"];
        this.lcargando.ctlSpinner(false);
        setTimeout(() => {
          this.dtTrigger.next();
          setTimeout(() => {
            this.filterCxP(5);
          }, 100);
        }, 50);*/
  
      }, error => {
  
      });
    }

    
  }

}
