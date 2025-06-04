import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
//import e from 'cors';
import { RdepService } from './rdep.service';
import { ExcelService } from 'src/app/services/excel.service';



@Component({
standalone: false,
  selector: 'app-rdep',
  templateUrl: './rdep.component.html',
  styleUrls: ['./rdep.component.scss']
})
export class RdepComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "RDEP";
  vmButtons: any
  arrayRdep: any = []
  excelData: any = []
  mensajeSpinner:any;
  filter: any = {
    periodo:  new Date(),
    fecha_desde: moment().format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    tipo: ['I','G'],
    empleado: null
  }
  paginate: any = {
    perPage: 2000,
    page: 1,
    length: 0,
    pageSizeOptions: [10, 25, 50, 100,150,1000,2000]
  }

  cmb_periodo: any[] = []


  constructor(private commonSrv: CommonService,
    private toastr: ToastrService,
    private apiSrv: RdepService,
    private modal: NgbModal,
    private commonVar: CommonVarService,
    private excelService: ExcelService) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsRdep", paramAccion: "", boton: { icon: "far fa-search", texto: " PROCESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsRdep", paramAccion: "", boton: { icon: "far fa-search", texto: " CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsRdep", paramAccion: "", boton: { icon: "far fa-eraser", texto: " LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsRdep", paramAccion: "", boton: { icon: "far fa-file-excel", texto: " EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true, imprimir: true},
      { orig: "btnsRdep", paramAccion: "", boton: { icon: "far fa-file-excel", texto: " XML" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true, imprimir: true},

    ]

    setTimeout(async () => {
     // this.getCatalogos();
     await this.cargaInicial()
    }, 50);
  }


  metodoGlobal(event){
    switch(event.items.boton.texto){
      case " PROCESAR":
         this.setProcesoCedulaPresupuestaria();
        break;
      case " CONSULTAR":
         this.validaConsultaRdep();
        break;
      case " LIMPIAR":
         this.restoreForm();
        break;
      case " EXCEL":
         this.btnExportarExcel();
        break;
      case " XML":
        this.GeneraXmlRdep()
        break;
    }
  }
  async cargaInicial() {
    try {
      this.mensajeSpinner = "Cargando..."
      const resPeriodos = await this.apiSrv.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }
  async validaConsultaRdep() {
    let resp = await this.validaDataGlobal().then((respuesta) => {
      if(respuesta) {
          this.consultarRdep();
      }
    });
}
validaDataGlobal() {
  let flag = false;
  return new Promise((resolve, reject) => {

    if (this.filter.periodo == undefined || this.filter.periodo == '' )
    {
      this.toastr.info('Debe ingresar un Período');
      flag = true;
    }
    !flag ? resolve(true) : resolve(false);
  })
}
setProcesoCedulaPresupuestaria(){

  console.log(this.filter);

  if(this.filter?.periodo ==undefined){
    this.toastr.info('Debe ingresar un Período');
  }

  if (this.filter?.periodo == undefined || !(/^\d{4}$/.test(this.filter.periodo))) {
    this.toastr.info('Debe ingresar un Período.');
  }
  else{

    let data = {
      compani:1,
      anio:this.filter?.periodo,
    }
    console.log(data);

    this.mensajeSpinner = "Procesando...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.procesarSp(data).subscribe(res => {
      console.log(res);
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        icon: "success",
        title: "Se ha procesado con éxito",
        //text: res['message'],
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
        willClose: () => {
          this.validaConsultaRdep();
      }
    })


    },error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  }
}
periodoSelected(evt: any, year:any){
  console.log(evt)
  this.filter.periodo = evt.getFullYear()
  // if(evt){
  //   this.cargarPrograma();
  // }
}

GeneraXmlRdep() {


  // let year;

  // if(typeof this.filter.periodo !== "string"){
  //   year = this.filter.periodo.getFullYear();
  // }else{
  //   year = this.filter.periodo;
  // }

  this.lcargando.ctlSpinner(true);

  this.apiSrv.ObtenerRdepXml(this.filter.periodo).subscribe(resRdep => {

    const jsonObj = {
      rdep:  JSON.parse(resRdep[0]['data'].replaceAll('datretreldep','datRetRelDep'))
    };

    const xml = this.JSONtoXML(jsonObj);
    this.excelService.saveAsXmlFile(xml, 'RDEP'+this.filter.periodo+'_Todotek');


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



consultarRdep(){
  this.arrayRdep = []
  let data = {
    //periodo: this.periodo,
    filter: this.filter,
    paginate: this.paginate
  }

  this.lcargando.ctlSpinner(true);
  this.apiSrv.consultarRdep(data).subscribe(res => {
    console.log(res["data"]);

    if(res["data"].length > 0){
      this.arrayRdep = res["data"]
      this.vmButtons[3].habilitar = false;
      this.vmButtons[4].habilitar = false;
    }else{
      this.toastr.info('No hay datos para este Período');
    }
    this.lcargando.ctlSpinner(false);

  }, error => {
    this.lcargando.ctlSpinner(false);
    this.toastr.info(error.error.mesagge);
  })
}

btnExportarExcel() {
  this.mensajeSpinner = "Generando Archivo Excel...";
 this.lcargando.ctlSpinner(true);


      this.excelData = [];
      console.log(this.arrayRdep);

        Object.keys(this.arrayRdep).forEach(key => {
          let filter_values = {};
          filter_values['ID'] = this.arrayRdep[key].id_rdep_detalle;
          filter_values['Tipo de identificación del trabajador'] = (this.arrayRdep[key].tipidret != null) ? this.arrayRdep[key].tipidret : "";
          filter_values['Número de identificación del trabajador'] = (this.arrayRdep[key].numruc != null) ? this.arrayRdep[key].numruc : "";
          filter_values['Apellidos del trabajador'] = (this.arrayRdep[key].apellidotrab != null) ? this.arrayRdep[key].apellidotrab : "";
          filter_values['Nombres del trabajador'] = (this.arrayRdep[key].nombretrab != null) ? this.arrayRdep[key].nombretrab : "";
          filter_values['Código del establecimiento'] = (this.arrayRdep[key].estab != null) ? this.arrayRdep[key].estab : "";
          filter_values['Tipo de residencia'] = (this.arrayRdep[key].residenciatrab != null) ? this.arrayRdep[key].residenciatrab : "";
          filter_values['País de residencia'] = (this.arrayRdep[key].paisresidencia != null) ? this.arrayRdep[key].paisresidencia : "";
          filter_values['¿Aplica convenio para evitar doble imposición?'] = (this.arrayRdep[key].aplicaconvenio != null) ? this.arrayRdep[key].aplicaconvenio : "";
          filter_values['Condición del trabajador respecto a discapacidades'] = (this.arrayRdep[key].tipotrabajdiscap != null) ? this.arrayRdep[key].tipotrabajdiscap : "";
          filter_values['Porcentaje de discapacidad'] = (this.arrayRdep[key].porcentajediscap != null) ? this.arrayRdep[key].porcentajediscap: "";
          filter_values['Tipo de identificación de la persona con discapacidad a quien sustituye o representa'] = (this.arrayRdep[key].tipiddiscap != null) ? this.arrayRdep[key].tipiddiscap : "";
          filter_values['Número de identificación de la persona con discapacidad a quien sustituye o representa'] = (this.arrayRdep[key].iddiscap != null) ? this.arrayRdep[key].iddiscap : "";
          filter_values['Sueldos y salarios'] = (this.arrayRdep[key].suelsal != null) ? parseFloat(this.arrayRdep[key].suelsal) : "";
          filter_values['Sobresueldos, comisiones, bonos y otros ingresos gravados'] = (this.arrayRdep[key].sobsuelcomremu != null) ? parseFloat(this.arrayRdep[key].sobsuelcomremu) : "";
          filter_values['Participación de utilidades'] = (this.arrayRdep[key].partutil != null) ? parseFloat(this.arrayRdep[key].partutil) : "";
          filter_values['Ingresos gravados generados con otros empleadores'] = (this.arrayRdep[key].intgrabgen != null) ? parseFloat(this.arrayRdep[key].intgrabgen) : "";
          filter_values['Impuesto a la Renta asumido por este empleador'] = (this.arrayRdep[key].imprentempl != null) ? parseFloat(this.arrayRdep[key].imprentempl) : "";
          filter_values['Décimo tercer sueldo'] = (this.arrayRdep[key].decimter != null) ? parseFloat(this.arrayRdep[key].decimter) : "";
          filter_values['Décimo cuarto sueldo'] = (this.arrayRdep[key].decimcuar != null) ? parseFloat(this.arrayRdep[key].decimcuar) : "";
          filter_values['Fondo de reserva'] = (this.arrayRdep[key].fondoreserva != null) ? parseFloat(this.arrayRdep[key].fondoreserva) : "";
          filter_values['Compensación Económica Salario Digno'] = (this.arrayRdep[key].salariodigno != null) ? parseFloat(this.arrayRdep[key].salariodigno) : "";
          filter_values['Otros ingresos en relación de dependencia que no constituyen renta gravada'] = (this.arrayRdep[key].otrosingrengrav != null) ? parseFloat(this.arrayRdep[key].otrosingrengrav) : "";
          filter_values['Ingresos gravados con el empleador'] = (this.arrayRdep[key].inggravconrsteempl != null) ? parseFloat(this.arrayRdep[key].inggravconrsteempl) : "";
          filter_values['Tipo sistema salario neto'] = (this.arrayRdep[key].sissalnet != null) ? this.arrayRdep[key].sissalnet : "";
          filter_values['Aporte personal al IESS con este empleador'] = (this.arrayRdep[key].apoperiess != null) ? parseFloat(this.arrayRdep[key].apoperiess) : "";
          filter_values['Aporte personal al IESS con otros empleadores'] = (this.arrayRdep[key].aporperiessconotrosempls != null) ? parseFloat(this.arrayRdep[key].aporperiessconotrosempls) : "";
          filter_values['Gastos personales por vivienda'] = (this.arrayRdep[key].deducvivienda != null) ? parseFloat(this.arrayRdep[key].deducvivienda) : "";
          filter_values['Gastos personales por salud'] = (this.arrayRdep[key].deducsalud != null) ? parseFloat(this.arrayRdep[key].deducsalud) : "";
          filter_values['Gastos personales por educación arte y cultura'] = (this.arrayRdep[key].deduceducartcult != null) ? parseFloat(this.arrayRdep[key].deduceducartcult) : "";
          filter_values['Gastos personales por alimentación'] = (this.arrayRdep[key].deducaliement != null) ? parseFloat(this.arrayRdep[key].deducaliement) : "";
          filter_values['Gastos personales por vestimenta'] = (this.arrayRdep[key].deducvestim != null) ? parseFloat(this.arrayRdep[key].deducvestim) : "";
          filter_values['Gastos personales por turismo'] = (this.arrayRdep[key].deduccionturismo != null) ? parseFloat(this.arrayRdep[key].deduccionturismo) : "";
          filter_values['Exoneración por discapacidad'] = (this.arrayRdep[key].exodiscap != null) ? parseFloat(this.arrayRdep[key].exodiscap) : "";
          filter_values['Exoneración por tercera edad'] = (this.arrayRdep[key].exotered != null) ? parseFloat(this.arrayRdep[key].exotered) : "";
          filter_values['Base imponible gravada'] = (this.arrayRdep[key].basimp != null) ? parseFloat(this.arrayRdep[key].basimp) : "";
          filter_values['Impuesto a la Renta causado'] = (this.arrayRdep[key].imprentcaus != null) ? parseFloat(this.arrayRdep[key].imprentcaus) : "";
          filter_values['Rebaja por gastos personales'] = (this.arrayRdep[key].rebajagastospersonales != null) ? parseFloat(this.arrayRdep[key].rebajagastospersonales) : "";
          filter_values['Impuesto a la renta despues de la rebaja de gastos personales'] = (this.arrayRdep[key].impuestorentarebajagastospersonales != null) ? parseFloat(this.arrayRdep[key].impuestorentarebajagastospersonales) : "";
          filter_values['I. Renta retenido y asumido por otros empleadores'] = (this.arrayRdep[key].valretasuotrosempls != null) ? parseFloat(this.arrayRdep[key].valretasuotrosempls) : "";
          filter_values['I. Renta asumido por este empleador'] = (this.arrayRdep[key].valimpasuesteempl != null) ? parseFloat(this.arrayRdep[key].valimpasuesteempl) : "";
          filter_values['I. Renta retenido al trabajador'] = (this.arrayRdep[key].valret != null) ? parseFloat(this.arrayRdep[key].valret) : "";

          // filter_values['Estado'] = (this.arrayRdep[key].estado != undefined) ? (this.arrayRdep[key].estado == 'P' ? 'Pendiente' : this.arrayRdep[key].estado == 'G' ? 'Gestión' : this.arrayRdep[key].estado == 'C' ? 'Cerrado' : this.arrayRdep[key].estado == 'GA' && 'Garantía' ) : "";

          this.excelData.push(filter_values);
          this.lcargando.ctlSpinner(false);
        })
        this.exportAsXLSX();

}

exportAsXLSX() {
  this.excelService.exportAsExcelFile(this.excelData, 'Reporte RDEP');
}


restoreForm(){
  this.arrayRdep=[]
  this.vmButtons[3].habilitar = true;
  this.vmButtons[4].habilitar = true;
}
}
