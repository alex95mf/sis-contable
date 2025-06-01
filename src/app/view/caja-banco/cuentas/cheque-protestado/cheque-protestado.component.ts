import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ChequeProtestadoService } from './cheque-protestado.service';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaClientesComponent } from 'src/app/view/comercializacion/facturacion/fac-electronica/vista-clientes/vista-clientes.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from "moment";
import { IngChqProtestadoComponent } from './ing-chq-protestado/ing-chq-protestado.component';
import { InfoClienteComponent } from './info-cliente/info-cliente.component';
import { ImprimirCheProComponent } from './imprimir/imprimir.component';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-cheque-protestado',
  templateUrl: './cheque-protestado.component.html',
  styleUrls: ['./cheque-protestado.component.scss']
})
export class ChequeProtestadoComponent implements OnInit {

  constructor(
    private chequeProtestadoService: ChequeProtestadoService,
    private commonServices: CommonService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permisions: any = [];

  vInputs:any = {};

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnChqProt", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnChqProt", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnChqProt", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnChqProt", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vInputs.lBanco = "";
    this.vInputs.lEstado = "Cobrado";
    this.vInputs.lFechaDesde = new Date();
    this.vInputs.lFechaHasta = new Date(this.vInputs.lFechaDesde.getFullYear(), this.vInputs.lFechaDesde.getMonth() + 1, 0);

    setTimeout(() => {
      this.permisos();
    }, 10);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {     
      case "BUSCAR": 
        this.rerender();
      break; 
      case "CANCELAR": 
        this.cancelar();
      break;
      case "EXCEL":
        $('#tablaChqProt').DataTable().button( '.buttons-excel' ).trigger();
      break;
      case "IMPRIMIR":
        $('#tablaChqProt').DataTable().button( '.buttons-print' ).trigger();       
      break;
    }   
  }

  cancelar(){
    this.vInputs.lBanco = "";
    this.vInputs.lEstado = "Cobrado";
    this.vInputs.lFechaDesde = new Date();
    this.vInputs.lFechaHasta = new Date(this.vInputs.lFechaDesde.getFullYear(), this.vInputs.lFechaDesde.getMonth() + 1, 0);
    this.vInputs.lNombreCliente = "";
    this.vInputs.lIdCliente = "";
    this.rerender();
  }

  permisos() {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fChequeProtestado,
      id_rol: this.dataUser.id_rol,
    };
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      this.permisions = res["data"];

      if (this.permisions[0].ver == "0") {
        this.vmButtons = [];
        this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para ver el formulario de pago de anticipo");
      } else {
        //ok
        this.obtenerMotivos();
      }
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  lstMotivos:any = [];
  obtenerMotivos(){
    this.chequeProtestadoService.obtenerMotivos().subscribe((res:any) => {
      this.lstMotivos = res.data
      this.obtenerBancos();
    }, error => {
      this.lcargando.ctlSpinner(false);
    })
  }

  dataCatalogo:any=[];
  obtenerBancos(){
    let data = {
      tipo: "'BANCO'"
    }
    this.chequeProtestadoService.getBancos(data).subscribe(res => {
      this.dataCatalogo = res['data']['catalogos'];
      this.getCtasChequeProtestado();
    }, error => {
      this.lcargando.ctlSpinner(false);
    })
  }

  lstCtas:any = [];
  getCtasChequeProtestado(){
    this.chequeProtestadoService.getCtasChequeProtestado().subscribe((res:any) => {
      this.lstCtas = res.data
      this.getSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
    })
  }

  dataSucursal: any = [];
  getSucursal() {
    this.chequeProtestadoService.getSucursales().subscribe((res) => {
      this.dataSucursal = res["data"].filter((e) => e.id_sucursal == this.dataUser.id_sucursal)[0];
      this.listadoGeneral();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  abrirModalClientes(){   
    const dialogRef = this.confirmationDialogService.openDialogMat(VistaClientesComponent, {
      width: '1000px', height: 'auto',
      data: { titulo: "Listado de Clientes", tipoDocumento: 1, lEstado: this.vInputs.lEstado}
      
    } );
 
    dialogRef.afterClosed().subscribe(resultado => {
      console.log("resultado: ", resultado)
      if(resultado!=false && resultado!=undefined){
        this.vInputs.lNombreCliente = resultado.razon_social;
        this.vInputs.lIdCliente = resultado.id_cliente;
        this.rerender();
      }
    }); 
  }

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataSource:any = [];
  listadoGeneral(): any {

    console.log("this.vInputs: ", this.vInputs)
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      searching: false,
      paging: true,
      order: [[ 0, "desc" ]],
      buttons: [{
        extend: "excel",
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        }
      },
      {
        extend: "print",
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        }
      }
    ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let filtros:any = {
      lBanco: this.validaciones.verSiEsNull(this.vInputs.lBanco)==undefined? null: this.vInputs.lBanco,
      lNombreCliente: this.validaciones.verSiEsNull(this.vInputs.lNombreCliente)==undefined? null: this.vInputs.lNombreCliente,
      lFechaDesde: this.validaciones.verSiEsNull(this.vInputs.lFechaDesde)==undefined? null: moment(this.vInputs.lFechaDesde).format('YYYY-MM-DD'),
      lFechaHasta: this.validaciones.verSiEsNull(this.vInputs.lFechaHasta)==undefined? null: moment(this.vInputs.lFechaHasta).format('YYYY-MM-DD'),
      estado: this.validaciones.verSiEsNull(this.vInputs.lEstado)==undefined? "Cobrado": this.vInputs.lEstado
    }
    
    this.lcargando.ctlSpinner(true);
    this.chequeProtestadoService.obtenerCheques(filtros).subscribe((res:any) => {    
      console.log("obtenerCheques: ", res.data);
      this.lcargando.ctlSpinner(false);
      this.dataSource = res.data;

      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);

      
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  rerender(): void {
    if(this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.listadoGeneral();
      });
    }else{
      this.listadoGeneral();
    }
  }

  modalProtestarCheque(valor:any){
    console.log("protestarCheque: ", valor);

    const dialogRef = this.confirmationDialogService.openDialogMat(IngChqProtestadoComponent, {
      width: '1000px', height: 'auto',
      data: { titulo: "Ingreso de Cheque Protestado", datos: valor, lstMotivos: this.lstMotivos, lstCtas: this.lstCtas}
      
    } );
 
    dialogRef.afterClosed().subscribe(resultado => {
      console.log("resultado: ", resultado)
      if(resultado!=false && resultado!=undefined){
        this.seterarValoresImprimir(resultado);
        this.rerender();
      }
    }); 

  }

  modalInfoCliente(valor:any){
    console.log("modalInfoCliente: ", valor);

    const dialogRef = this.confirmationDialogService.openDialogMat(InfoClienteComponent, {
      width: '1000px', height: 'auto',
      data: { titulo: "Información de Cliente", datos: valor, lstMotivos: this.lstMotivos, lstCtas: this.lstCtas}
      
    } );
 
    dialogRef.afterClosed().subscribe(resultado => {
      console.log("resultado: ", resultado)
      if(resultado!=false && resultado!=undefined){

      }
    }); 

  }

  @ViewChild (ImprimirCheProComponent,{static:false}) imprimirCheProComponent:ImprimirCheProComponent;
  seterarValoresImprimir(datos:any){

    this.imprimirCheProComponent.setearValores(datos, this.dataUser, this.dataSucursal);

    setTimeout(() => {
      let element: HTMLElement = document.getElementsByClassName("imprimirDatos")[0] as HTMLElement;
      element.click();
    }, 100);

  }
}
