import { Component, OnInit, ViewChild } from '@angular/core';
import { EstadoFinancieroService } from '../estado-financiero.services'
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../services/excel.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';


@Component({
  selector: 'app-estado-resultado',
  templateUrl: './estado-resultado.component.html',
  styleUrls: ['./estado-resultado.component.scss']
})
export class EstadoResultadoComponent implements OnInit {
  peridoSelecionado: any = 0;
  nivelSeleccionado: any = 0;
  dataLength: any;
  dataUser: any;
  permisions: any;
  data: any = [1, 2, 3, 4, 5, 6];
  balanceInit: any;
  //numberToformat:any = 1000000000;
  locality: any;
  excelData: any = [];
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  btnPrint: any;
  processing:any = false;
  empresLogo: any;

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  constructor(private estadoServices: EstadoFinancieroService, private commonService: CommonService, private toastr: ToastrService,
    private router: Router, private excelService: ExcelService) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnEstRs", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnEstRs", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnEstRs", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true}
    ];


    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.festadoResultado,
      id_rol: id_rol
    }
    this.commonService.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
        if (this.permisions[0].ver == "0") {
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Estado de resultados");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {

          if(this.permisions[0].imprimir == "0"){
            this.btnPrint = false;
            this.vmButtons[2].habilitar = true;
          }else{
            this.btnPrint = true
            this.vmButtons[2].habilitar = false;
          } 
          this.getBalanceInit();
        }
    }, error=>{
      this.lcargando.ctlSpinner(false);
    })

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.consultFilter();
        break;
      case "EXCEL":
        this.btnExportar();
        break;
      case "IMPRIMIR":
        this.savePrint();
        break;
    }
  }

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }



  getParametersFilter() {
    this.lcargando.ctlSpinner(true);
    this.estadoServices.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataLength = res['data'];
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getBalanceInit() {
    this.estadoServices.getBalanceInit().subscribe(res => {
      this.balanceInit = res['data'];
      this.processing = true;
      this.getParametersFilter();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  consultFilter() {
    if (this.permisions[0].consultar == "0") {
      this.lcargando.ctlSpinner(false);
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      let levelSend ;
      if (this.nivelSeleccionado == 0) {
        levelSend = "2,3";
      } else if (this.nivelSeleccionado == 3) {
        levelSend = "2,3";
      } else {
        levelSend = "2,3,4";
      }

      let data = {
        nivelFilter: levelSend,
        periodoFilter: (this.peridoSelecionado == 0) ? null : this.peridoSelecionado
      }
      this.balanceInit = undefined;
      this.lcargando.ctlSpinner(true);
      this.estadoServices.getBalanceFilter(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.balanceInit = res['data'];
      }, error => {
        this.toastr.info(error.error.message);
        this.getBalanceInit();
      })
    }
  }

  btnExportar() {
    this.excelData = [];
    if (this.permisions[0].exportar == "0") {
      this.toastr.info("Usuario no tiene permiso para exportar");
    } else {
      Object.keys(this.balanceInit).forEach(key => {
        let filter_values = {};
        filter_values['ID'] = (this.balanceInit[key].id != undefined) ? this.balanceInit[key].id : "";
        filter_values['CLASE'] = (this.balanceInit[key].clase != undefined) ? this.balanceInit[key].clase.trim() : "";
        filter_values['CODIGO'] = (this.balanceInit[key].codigo != undefined) ? this.balanceInit[key].codigo.trim() : "";
        filter_values['CODIGO_PADRE'] = (this.balanceInit[key].codigo_padre != undefined) ? this.balanceInit[key].codigo_padre.trim() : "";
        filter_values['NOMBRE'] = (this.balanceInit[key].nombre != undefined) ? this.balanceInit[key].nombre.trim() : "";
        filter_values['ID_EMPRESA'] = (this.balanceInit[key].id_empresa != undefined) ? this.balanceInit[key].id_empresa : "";
        filter_values['CREDITOS_ANIO'] = (this.balanceInit[key].creditos_anio != undefined) ? parseFloat(this.formatNumber(this.balanceInit[key].creditos_anio/* .trim() */)) : "";
        filter_values['DEBITOS_ANIO'] = (this.balanceInit[key].debitos_anio != undefined) ? parseFloat(this.formatNumber(this.balanceInit[key].debitos_anio/* .trim() */)) : "";
        filter_values['VALUE'] = (this.balanceInit[key].Value != undefined) ? parseFloat(this.formatNumber(this.balanceInit[key].Value)) : "";
        this.excelData.push(filter_values);
      })
      this.exportAsXLSX();
    }
  }
  
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Estado_resultado');
  }

  savePrint() {
    let data = {
      ip: this.commonService.getIpAddress(),
      accion: "Registro de impresion de Estado de resultados",
      id_controlador: myVarGlobals.festadoResultado
    }
    this.estadoServices.printData(data).subscribe(res => {

    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

}
