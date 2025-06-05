import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { RprtAtsService } from './ats.service';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

import { ExcelService } from 'src/app/services/excel.service';
import * as moment from 'moment'

import { environment } from 'src/environments/environment';


@Component({
standalone: false,
  selector: 'app-ats',
  templateUrl: './ats.component.html',
  styleUrls: ['./ats.component.scss']
})
export class AtsComponent implements OnInit {

  @ViewChild(DataTableDirective)
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  comprasats:any = [];
  dataUser: any;
  permiso_ver:any = "0";
  empresLogo: any;
  permisions: any;
  vmButtons: any;
  ELementAtsCompras: any;
  ELementAtsRetenciones:any;
  ELementAtsVentas: any;
  ElementAtsAnulados:any;

  selected_anio: any;
  mes_actual: any = 0;
  cmb_periodo: any[] = []

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private rprtatsService: RprtAtsService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.selected_anio = moment(new Date()).format('YYYY');
    this.mes_actual = Number(moment(new Date()).format('MM'));

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    this.vmButtons = [
      { orig: "btnsAtsReport", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsAtsReport", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsAtsReport", paramAccion: "", boton: { icon: "fa fa-file-code-o", texto: "XML" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
    ];

      setTimeout(() => this.validaPermisos(), 50)
      setTimeout(async () => await this.cargaInicial(), 50)
  }

  validaPermisos() {
    this.empresLogo = this.dataUser.logoEmpresa;
      let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fFormularioATS,
      id_rol: id_rol
    }

    this.commonService.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'];

      this.permiso_ver = this.permisions[0].abrir;

      if (this.permiso_ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver reporte ATS");
        //this.vmButtons = [];
        this.lcargando.ctlSpinner(false);

      }

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		    case "BUSCAR":
          this.EventoCargaInfoAts();
        break;
        case "EXCEL":
          this.ExportarExcelAts();
        break;
        case "XML":
          this.GeneraXMlAts()
        break;
        case "LIMPIAR":
        //this.informaciondtlimpiar();
        break;
		}
	}

  async cargaInicial() {
    try {
      (this as any).mensajeSpinner = "Carga Inicial"
      const resPeriodos = await this.rprtatsService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }


  GeneraXMlAts() {


    let year;

    // if(typeof this.selected_anio !== "string"){
    //   year = this.selected_anio.getFullYear();
    // }else{
    //   year = this.selected_anio;
    // }
    year = this.selected_anio;

    this.lcargando.ctlSpinner(true);

    this.rprtatsService.ObtenerAtsXml(year,this.mes_actual,this.dataUser.id_usuario).subscribe(resAts => {

      const jsonObj = {
        iva:  JSON.parse(resAts[0]['data'].replaceAll('detalleair','detalleAir').replaceAll('detallecompras','detalleCompras').replaceAll('detalleanulados','detalleAnulados'))
      };

      const xml = this.JSONtoXML(jsonObj);
      this.excelService.saveAsXmlFile(xml, 'ats_'+year+'_'+this.mes_actual);


      this.lcargando.ctlSpinner(false);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })


  }


  JSONtoXML(obj) {
    let xml = '';
    for (let prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (let array in obj[prop]) {
          xml += '\n<' + prop + '>\n';
          xml += this.JSONtoXML(new Object(obj[prop][array]));
          xml += '</' + prop + '>';
        }
      } else if (typeof obj[prop] == 'object') {
        xml += this.JSONtoXML(new Object(obj[prop]));
      } else {

        if(typeof obj[prop] === 'number'){
          xml += obj[prop].toFixed(2);
        }else{
          xml += obj[prop];
        }


      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>\n';
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
  }





groupChildren(obj) {
  for(var prop in obj) {
    if (typeof obj[prop] === 'object') {
      this.groupChildren(obj[prop]);
    } else {
      obj['$'] = obj['$'] || {};
      obj['$'][prop] = obj[prop];
      delete obj[prop];
    }
  }

  return obj;
}

  EventoCargaInfoAts(){

    this.lcargando.ctlSpinner(true);

    let year;

    // if(typeof this.selected_anio !== "string"){
    //   year = this.selected_anio.getFullYear();
    // }else{
    //   year = this.selected_anio;
    // }
    year = this.selected_anio;
    console.log(year)
    console.log(this.mes_actual)
    console.log(this.dataUser.id_usuario)
    this.rprtatsService.registerAtsGeneral(year,this.mes_actual,this.dataUser.id_usuario).subscribe(res => {


      this.rprtatsService.getReporteAtsCompras(year,this.mes_actual,this.dataUser.id_usuario).subscribe(res => {

        this.ELementAtsCompras = res;

        this.rprtatsService.getReporteAtsRetenciones(year,this.mes_actual,this.dataUser.id_usuario).subscribe(resAtsRete => {

          this.ELementAtsRetenciones = resAtsRete;

          this.rprtatsService.getReporteAtsVentas(year,this.mes_actual,this.dataUser.id_usuario).subscribe(resAtsVent => {

            this.ELementAtsVentas = resAtsVent;

            this.rprtatsService.registerAtsAnulados(year,this.mes_actual,this.dataUser.id_usuario).subscribe(resAtsAnula => {

              this.ElementAtsAnulados = resAtsAnula;
              this.lcargando.ctlSpinner(false);

            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;

          }, error => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          })

        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        })


      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.toastr.info(error.error.message);
  })

    /*
    */

  }


  ExportarExcelAts(){

    let ELementAtsComprasExcel: any;

    let year;

    // if(typeof this.selected_anio !== "string"){
    //   year = this.selected_anio.getFullYear();
    // }else{
    //   year = this.selected_anio;
    // }
    year = this.selected_anio;

    this.lcargando.ctlSpinner(true);

    this.rprtatsService.registerAtsGeneral(year,this.mes_actual,this.dataUser.id_usuario).subscribe(res => {

      window.open(environment.ReportingUrl + "rpt_ats.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&mes=" + this.mes_actual+ "&anio=" + year+ "&cod_usuario=" + this.dataUser.id_usuario, '_blank')
      this.lcargando.ctlSpinner(false);
      console.log(environment.ReportingUrl + "rpt_ats.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&mes=" + this.mes_actual+ "&anio=" + year+ "&cod_usuario=" + this.dataUser.id_usuario);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }

  ObtenerPeriodo(anio: any) {
    this.selected_anio = anio;
  }



  ChangeMesCierrePeriodos(evento: any){ this.mes_actual = evento;}


}
