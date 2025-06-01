import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { ReporteCobranzasService } from "./reporte-cobranzas.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { Console } from 'console';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-reporte-cobranzas',
  templateUrl: './reporte-cobranzas.component.html',
  styleUrls: ['./reporte-cobranzas.component.scss']
})
export class ReporteCobranzasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  validaDt: any = false;
  processingtwo: boolean = false;
  dataUser: any;
  permissions: any;
  toDatePicker: Date = new Date();
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(
    this.viewDate.getFullYear(),
    this.viewDate.getMonth(),
    1
  );
  flag: number = 0;
  arrayCliente : Array<any> = [];
  arrayFactura : Array<any> = [];
  arrayRetencion : Array<any> = [];
  arrayDtCxCobrar: Array<any> = [];
  dataReport: Array<any> = [];
  dtCxCobrar: Array<any> = [];
  arrayDocument: Array<any> = [];
 cliente: any;
 factura:any;
 retencionSi:any;
 retencionNo:any;
 retencion:any;
 disabledDataSi:any = false;
 disabledDataNo:any = false;
 permisions: any;
 dtInformacion: any = {};
 numDoc:any;
 estadoReport:any;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReporteCobranzasService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
   this.getPermisions();
   this.getDataTable();
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fReportCobranza,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver Reportes");
        this.router.navigateByUrl('dashboard');
      } else {
        this.processing = true;
       /*  this.getDataTable(); */
        this.getCliente();
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getCliente() {
    this.reportesSrv.getCliente().subscribe(res => {
      this.arrayCliente = res['data'];
      this.getFacturaData();
    },)
  }

  getFacturaData(){
    this.reportesSrv.getFactura().subscribe(res => {
      this.arrayFactura = res['data'];
      this.getRetencionData();
    },)
  }

  getRetencionData(){
    this.reportesSrv.getRetencion().subscribe(res => {
      this.arrayRetencion = res['data'];
      this.getDetalle();
    },)
  }

  getDetalle(){
    this.reportesSrv.getCuentasXCobrarDT().subscribe(res => {
      this.arrayDtCxCobrar= res['data'];
      this.getDocumentos();
    },)
  }

  getDocumentos(){
    this.reportesSrv.getDocument().subscribe(res => {
      this.arrayDocument = res['data'];
    },)
  }

    getDataTable() {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        search: true,
        paging: true,
        dom: "Bfrtip",
        buttons: [
          {
            extend: "excel",
            footer: true,
            title: "Reporte",
            filename: "reportes",
            text:
              '<button class="btn btn-success" style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">EXCEL <i class="fa fa-file-excel-o" aria-hidden="true" style="font-size: 19px;margin-right: 10px; margin-top: 4px; margin:6px;"> </i></button>',
          }, 
          {
            extend: "print",
            footer: true,
            title: "Reporte",
            filename: "report print",
            text:
              '<button class="btn" style="width: 150px; height: 43px; font-weight: bold; background-color:#005CCD ; color:white; box-shadow: 2px 2px 0.5px #666;">IMPRIMIR<i class="fa fa-print" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;" ></i></button>',
          },
          {
            extend: 'pdf',
            footer: true,
            title: 'Reporte',
            filename: 'report',
            text: '<button class="btn btn-danger " style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">PDF <i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;"></i></button>'
          },
        ],
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
      };
      this.reportesSrv.getCuentasXCobrar().subscribe(res => {    
        this.validaDt = true;  
        this.processing = true; 
        this.flag += 1;
        this.dataReport = res['data'];
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }, error => {
          this.processing = true;
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        });
    }
  
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
  
    
    filterRetencionSi(data){
      if(data == true){
        this.retencion = "SI";
       this.disabledDataNo = true;
       this.rerender();
      }else{
       this.disabledDataNo = false;
       this.rerender();
  
      }
    }

    filterRetencionNo(data){
      if(data == true){
        this.retencion = "No";
       this.disabledDataSi = true;
       this.rerender();
       
      }else{
       this.disabledDataSi = false;
       this.rerender();
      }
    }

    getDataTabledos() {
      let a = moment(this.fromDatePicker).format("YYYY-MM-DD");
      let b  =  moment(this.toDatePicker).format("YYYY-MM-DD");

      let data = {
        dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
        dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
        cliente: this.cliente  == undefined ? null : this.cliente,
        factura: this.factura  == undefined ? null : this.factura,
        retencion: this.retencion  == undefined  ? null : this.retencion
      }

     this.dataReport = [];
      this.dtOptions = { 
      pagingType: 'full_numbers',
      pageLength: 20,
      search: true,
      paging: true,
      dom: "Bfrtip",
      buttons: [
        {
          extend: "excel",
          footer: true,
          title: "Reporte "+ " " + a + " "+ b,
          filename: "Excel",
          text:
            '<button class="btn btn-success" style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">EXCEL <i class="fa fa-file-excel-o" aria-hidden="true" style="font-size: 19px;margin-right: 10px; margin-top: 4px; margin:6px;"> </i></button>',
        },
        {
          extend: "print",
          footer: true,
          title: "Reporte "+ " " + a + " "+ b,
          filename: "Print",
          text:
            '<button class="btn" style="width: 150px; height: 43px; font-weight: bold; background-color:#005CCD ; color:white; box-shadow: 2px 2px 0.5px #666;">IMPRIMIR<i class="fa fa-print" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;" ></i></button>',
        },
        {
          extend: 'pdf',
          footer: true,
          title: 'Reporte '+ "" + a + ""+ b,
          filename: 'Pdf',
          text: '<button class="btn btn-danger " style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">PDF <i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;"></i></button>'
        }
      ],
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
      };
       this.reportesSrv.tablaReportdos(data).subscribe(res => { 
          this.validaDt = true;
          this.processing = true;    
          this.flag += 1; 
          this.dataReport = res['data'];
          setTimeout(() => {
            this.dtTrigger.next(null);
          }, 50);
        }, error => {
        this.processing = true;
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
        this.toastr.info(error.error.message);
      });
    }

  rerender(): void {
    if (this.flag >= 1) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dataReport = [];
        this.getDataTabledos();
      });
    } else {
      this.getDataTable();
      this.dataReport = [];  
    }
  }

  filterCliente(data){ 
    if (this.cliente != undefined) {
      this.cliente = data
      this.rerender();
      } else{
      this.getDataTable();
    }
  }
  
  filterFactura(data){ 
    if (this.factura != undefined) {
      this.factura = data
      this.rerender();
       } else{
        this.rerender();
       }
  }


  informaciondtlimpiar(){
    this.cliente = undefined;
    this.retencionNo = undefined;
    this.factura = undefined;
    this.fromDatePicker = undefined;
    this.toDatePicker = new Date();
      this.rerender();
  
  }
  
  closeModal() {
    ($("#modalReportcXcobrar") as any).modal("hide");
    this.processingtwo = false;
    this.dtInformacion = {};
    this.dtCxCobrar = [];
  }


  informaDocumento(dt,i) {
    $('#modalReportcXcobrar').appendTo("body").modal('show');
    
    this.processingtwo = true;
    let filt = this.arrayDtCxCobrar.filter((e) => e.doc_ref_num == dt.doc_num);
    this.dtCxCobrar = filt;

    for (let i = 0; i < this.dtCxCobrar.length; i++) {
      let fechaActual = moment(this.toDatePicker).format("YYYY-MM-DD")
      if(fechaActual  < this.dtCxCobrar[i]["fecha_venc"] ){
         this.dtCxCobrar[i]["estado"] = 'Pendiente';
      }
      else if (fechaActual  > this.dtCxCobrar[i]["fecha_venc"] && this.dtCxCobrar[i]["valor"] != this.dtCxCobrar[i]["valor_abono"]  ){
        this.dtCxCobrar[i]["estado"] = 'Vencido';
      }
      else if (this.dtCxCobrar[i]["valor"] == this.dtCxCobrar[i]["valor_abono"] && fechaActual  > this.dtCxCobrar[i]["fecha_venc"]){
        this.dtCxCobrar[i]["estado"] = 'Pagado';
       }
     /*   else if (fechaActual  > this.dtCxCobrar[i]["fecha_venc"] && this.dtCxCobrar[i]["valor"] != this.dtCxCobrar[i]["valor_abono"] &&  this.dtCxCobrar[i]["valor_saldo"] != 0 && this.dtCxCobrar[i]["valor_abono"] != 0  ){
        this.dtCxCobrar[i]["estado"] = 'Faltante';
      } */
    }

    let modalDoc = this.arrayFactura.filter((e) => e.num_doc == dt.doc_num);
    this.dtInformacion.codigo = modalDoc[0].codigo;
    this.dtInformacion.numero = modalDoc[0].num_doc;
    this.dtInformacion.autorizacion = modalDoc[0].num_aut;
    this.dtInformacion.fecha = modalDoc[0].fecha;
    this.dtInformacion.ivaPorcentaje = modalDoc[0].iva_porcentaje;
    this.dtInformacion.tipoPago = modalDoc[0].tipo_pago;
    this.dtInformacion.formaPago = modalDoc[0].forma_pago;
    this.dtInformacion.despacho = modalDoc[0].despachado;
    this.dtInformacion.aprobacion = modalDoc[0].name_user_aprobated;
    this.dtInformacion.asesor = modalDoc[0].nombreUsuario;
    this.dtInformacion.iva = modalDoc[0].iva_valor;
    this.dtInformacion.subtotal = modalDoc[0].subtotal;
    this.dtInformacion.total = modalDoc[0].total;
    this.dtInformacion.cuotas = modalDoc[0].num_cuotas;
    let ret = this.arrayRetencion.find((e) => e.num_doc == dt.doc_num);
    if(ret != undefined){
      this.dtInformacion.retencion = "SI"
    }else{
      this.dtInformacion.retencion = "NO"
    }
  }
  
  closeModal2() {
    ($("#modalReportCliente") as any).modal("hide");
    this.processingtwo = false;
    this.dtInformacion = {};
  }

  informaCliente(dt,i) {
    $('#modalReportCliente').appendTo("body").modal('show');
    this.processingtwo = true;
    let modalDoc = this.arrayFactura.filter((e) => e.num_doc == dt.doc_num);
    this.dtInformacion.cliente = modalDoc[0].nombre_comercial_cli;
    this.dtInformacion.Tdocumento = modalDoc[0].tipo_documento;
    this.dtInformacion.documento = modalDoc[0].num_documento;
    this.dtInformacion.provincia = modalDoc[0].provincia;
    this.dtInformacion.pais = modalDoc[0].pais;
    this.dtInformacion.ciudad = modalDoc[0].ciudad;
    this.dtInformacion.direccion = modalDoc[0].direccion;
    this.dtInformacion.telefono = modalDoc[0].telefono;
    this.dtInformacion.credito = modalDoc[0].cupo_credito;
  }

}
