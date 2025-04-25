import { Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { CommonService } from '../../../../services/commonServices';
import { ReporteNominaService } from './reporte.service'
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';  
const Swal = require('sweetalert2');
import * as myVarGlobals from '../../../../global';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  dataUser: any;
  permisions: any;
  processing: any = false;
  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private reportService: ReporteNominaService
  ) {

    this.reportService.loadingSpinner$.subscribe(
      ({state, message}) => {
        if (message) this.mensajeSppiner = message
        this.lcargando.ctlSpinner(state)
      }
    )
    
    this.commonServices.actionRpNomina.asObservable().subscribe(res => {
    if(res.length > 0){
      this.vmButtons[2].habilitar = false;
    }else{
      this.vmButtons[2].habilitar = true;
    }
  }) ;

 /*  this.commonServices.actionRpcancelNomina.asObservable().subscribe(res => {
   console.log(res)
  }) ; */

}


  vmButtons: any = [];
  idBotones:any = "";
  dinamicoBotones(valor:any){
    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if(element.paramAccion == valor){
          element.permiso = true; element.showimg = true;
        }else{
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);
    
  }

  ngOnInit(): void {

    this.vmButtons = [

      { orig: "btnReptRh", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, faFa: true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false,  imprimir: true },
      { orig: "btnReptRh", paramAccion: "1", boton: { icon: "fa fa-print", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false },
      { orig: "btnReptRh", paramAccion: "1", boton: { icon: "fa fa-print", texto: "PDF" }, faFa: true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false,  imprimir: true },
      /*{ orig: "btnReptRh", paramAccion: "1", boton: { icon: "fa fa-search",  texto: "EXCEL" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false},
      { orig: "btnReptRh", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, faFa: true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      { orig: "btnReptRh", paramAccion: "1", boton: { icon: "fa fa-print",  texto: "PDF" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false},*/

      /*       { orig: "btnReptRh", paramAccion: "2", boton: {  icon: "fa fa-print",  texto: "BUSCAR" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false}, */
      // { orig: "btnReptRh", paramAccion: "2", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, faFa: true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, printSection: "print-section-carga", imprimir: true },
      { orig: "btnReptRh", paramAccion: "2", boton: { icon: "fa fa-print", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false },

      /*       { orig: "btnReptRh", paramAccion: "2", boton: {  icon: "fa fa-print",  texto: "CANCELAR" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}, */

      /*       { orig: "btnReptRh", paramAccion: "3", boton: {  icon: "fa fa-print",  texto: "BUSCAR" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false}, */
      { orig: "btnReptRh", paramAccion: "3", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, faFa: true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, printSection: "print-section-cumple", imprimir: true },
      { orig: "btnReptRh", paramAccion: "3", boton: { icon: "fa fa-print", texto: "ENVIAR" }, faFa: true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: true, printSection: "print-section-cumple", imprimir: true },
      /*       { orig: "btnReptRh", paramAccion: "3", boton: {  icon: "fa fa-print",  texto: "CANCELAR" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false} */

    ];

      setTimeout(() => {
        this.vmButtons.forEach(element => {
          if(element.paramAccion == 1){
            element.permiso = true; element.showimg = true;          
          }else{
            element.permiso = false; element.showimg = false;
          }
        });
      }, 10);

      setTimeout(() => {
      this.permissions();
    }, 10);

  }

    permissions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fNomina,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.vmButtons = [];
        this.processing = true;
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver Reporte Nómina");

      } else {
        setTimeout(() => {
          this.lcargando.ctlSpinner(false);
        }, 100);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

   metodoGlobal(evento: any) {
    switch (evento.items.paramAccion+evento.items.boton.texto) {
      case "1BUSCAR": 
     /*  this.newBodega(); */
      break;
      case "1IMPRIMIR":
      break;
      case "1CANCELAR": 
/*  this.newBodega(); */
      break;
      case "1EXCEL":
        this.reportService.exportExcel$.emit();
        break;

      case "2BUSCAR": 
        /*  this.newBodega(); */
      break;
      // case "2IMPRIMIR":
      // break;
      case "2EXCEL":
        this.reportService.exportCargasExcel$.emit();
        break;
      case "2CANCELAR": 
      /*  this.newBodega(); */
      break;

      case "3BUSCAR": 
        /*  this.newBodega(); */
      break;
      case "3IMPRIMIR":
      break;
      case "3CANCELAR": 
      /*  this.newBodega(); */
      break;
      case "4ENVIAR": 
      /*  this.newBodega(); */
      break;
    }
  }

}
