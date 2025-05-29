import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { EmpleadoService } from '../../adm-nomina/empleado/empleado.service';
import { ImprimirRolComponent } from '../../roles/adm-rol-pago/imprimir-rol/imprimir-rol.component';
import { AdmDecimoTerceroService } from './adm-decimo-tercero.service';
import * as myVarGlobals from "../../../../global";
import { MspreguntaComponent } from '../../../../config/custom/mspregunta/mspregunta.component';
import { DepartemtAditionalI } from "src/app/models/responseDepartemtAditional.interface";
import Botonera from 'src/app/models/IBotonera';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';
import Swal from "sweetalert2/dist/sweetalert2.js";


import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import { XlsExportService } from 'src/app/services/xls-export.service';
import e from 'cors';




@Component({
standalone: false,
  selector: 'app-adm-decimo-tercero',
  templateUrl: './adm-decimo-tercero.component.html',
  styleUrls: ['./adm-decimo-tercero.component.scss']
})
export class AdmDecimoTerceroComponent implements OnInit {
 
  constructor(
    private empleadoService: EmpleadoService,
    private admDecimoTerceroService: AdmDecimoTerceroService,
    private commonServices: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private toastr: ToastrService, 
    private xlsService: XlsExportService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService
  ) {

    this.commonVarSrv.modalProgramArea.subscribe(
      (res)=>{
        this.programa = res.nombre
        this.fk_programa = res.id_nom_programa
        this.cargarAreas()
      }
    )
  }

  vmButtons: Array<Botonera> = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(ImprimirRolComponent, { static: false })
  imprimirRolComponent: ImprimirRolComponent;
  toDatePicker: Date = new Date();
  primerDia_mes: any = moment().startOf("month").format("DD");
  ultimoDia_mes: any = Number(this.primerDia_mes) + 14;
  mes_actual: any = moment(this.toDatePicker).locale("es").format("MMMM");
  anio_actual: any = moment(this.toDatePicker).format("YYYY");
  fecha_actual: any = moment(this.toDatePicker).format("YYYY-MM-DD");
  lConcepto: any = "";
  lstInicial: any = [];
  grupoSeleccionado: any = [];
  bankSelect: any = 0;
  sueldoUnificado:any = 400;
  cmb_periodo: any[] = []
  locality: any;

  lastRecord: number|null = null
  nombres: any;

  decimotercero:any;
  decimoterceroExcel: any = []
  decimoterceroExcelPorFecha : any = []

  select_anio:any;
  LoadOpcionDepartamento: any = false;
  dataDepartamentoResponseI: any
  ngDepartamentSelect:any;

  decimo_acumula_mensualiza: any = 0;

  selectMovimiento="administracion/adm-decimo-tercero";

  selectAcumula = [
    {value: 0, label: 'TODOS'}, 
    {value: 6, label: 'SI'},  
    {value: 5, label: 'NO'},
  ]

  programa: any = ''
  departamento: any = 0
  fk_programa: any = 0
  areas: any = []
  area: any = 0
  departamentos: any = []
  totalDiasTrab: any = 0
  totalGanado: any = 0
  totalDevengado: any = 0
  totalDecimos : any =  0
  totalRetencionDecimo: any = 0

  num_control: any 

  fecha_desde: any =  moment(this.toDatePicker).format("YYYY-MM-DD");
  fecha_hasta:any =  moment(this.toDatePicker).format("YYYY-MM-DD");

  por_fecha : boolean = false

  labelPeriodo: any
  
  cambioMovimiento(){
    this.router.navigateByUrl(this.selectMovimiento);
  }

  ngOnInit(): void {
    this.vmButtons = [

      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto:"PROCESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-check", texto: "APROBAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: true},
      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GENERAR ORDEN" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-trash-o", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false,imprimir: false},
      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-file-excel", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true,imprimir: false},
      { orig: "btnsAdmDec3", paramAccion: "", boton: { icon: "fa fa-file", texto: "TXT" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-outline-success boton btn-sm", habilitar: true,imprimir: false},
    ];
    
    let fechaActual:any = moment(new Date()).format("YYYY-MM-DD");
    let fechaAntiore:any = moment(this.validaciones.sumarDias(new Date(), -365)).format("YYYY-MM-DD");
    this.periodoInicio = new Date(+fechaAntiore.split("-")[0], 12 - 1, +"01");
    this.periodoFin = new Date(+fechaActual.split("-")[0], 11 - 1, +"30");

    this.select_anio  = moment(new Date()).format("YYYY");
    this.ngDepartamentSelect = 0;
    this.labelPeriodo = this.select_anio - 1 +'-'+ this.select_anio +' (Dic a Nov)'

    this.obtenerRubros();
    this.getSucursal();
    setTimeout(async () => {
      this.permisos();
      await this.cargaInicial()
    }, 10);
  }

  permisions: any = [];
  dataUser: any;

  cambiarPeriodoLabel(event){
    console.log(event)
    this.labelPeriodo = event.periodo - 1 +'-'+ event.periodo +' (Dic a Nov)'
  }
  permisos() {
    this.vmButtons[5].permiso = false;
    this.vmButtons[5].showimg = false;
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    console.log(this.dataUser)
    let data = {
      codigo: myVarGlobals.fNomDecTercero,
      id_rol: this.dataUser.id_rol,
    };
    this.getInfoBank();
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
        this.permisions = res["data"];

        if(this.permisions[0].aprobar == 1){
          this.vmButtons[5].permiso = true;
          this.vmButtons[5].showimg = true;
        }

        if (this.permisions[0].ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para ver el formulario de decimo tercero de pago");
        } else {
          this.empleadoService.getDatosIniciales().subscribe((datos: any) => {
              this.lstInicial = datos.data;
              this.lstInicial[1].splice(this.lstInicial[1].length + 1, 0, {id_grupo: 0,nombre_grupo: "TODOS"});
              this.grupoSeleccionado = this.lstInicial[1].find((datos) => datos.id_grupo == 0).id_grupo;
              this.admDecimoTerceroService.getPersonalInfo({ idDepartamento: this.grupoSeleccionado }).subscribe((res) => {
                this.arrayPersonal = [];
                  let datosPer:any = [];
                  res["data"].forEach(element => {
                    if(this.validaciones.verSiEsNull(element.fechaSalida) == undefined){
                      if(element.fechaIngreso != undefined){
                        let anioActual:any = new Date();
                        let fechaIngreso:any = element?.fechaIngreso.split("-");
                        let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;
  
                        let diasValida:any = this.restar2Fechas((fechaIngreso[0]+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
                        if(diasValida>=360){
                          element.diasLaborados = 360;   
                        }else{
                          let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
                          dias = (dias < 0) ? dias * -1 : dias; 
                          element.diasLaborados = dias;
                        }                     
                        datosPer.push(element);
                      }
                      
                    }
                  });
                  this.arrayPersonal = datosPer;
                  this.arrayPersonal.splice(this.arrayPersonal.length + 1, 0, {id_personal: 0,nombres: "TODOS",apellidos: ""});
                  this.selectPersonal = 0;
                  this.obtenerRolDetalle();
                });
            }, (error) => {
              this.lcargando.ctlSpinner(false);
            }
          );
        }
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  metodoGlobal(evento: any) {
    let dataPresentar = {
      mensaje: "¿Esta seguro de realizar esta accion?.",
      titulo: "Pregunta",
    };

    switch (evento.items.boton.texto) {
      case "GUARDAR":
        const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent,{ config: {}, }, dataPresentar );
        dialogRef1.result.then((res) => {
          if (res.valor) {
            this.guardar();
          }
        });        
        break;

      case "ANULAR DECIMO TERCERO":
        const dialogRef2 = this.confirmationDialogService.openDialogBD(MspreguntaComponent,{ config: {}, }, dataPresentar );
        dialogRef2.result.then((res) => {
          if (res.valor) {
            this.anularPeriodoRol();
          }
        }); 
        break;

      case "IMPRIMIR":
        this.geenerarReporteDecimo();
        break;
      case "EXCEL":
        if(this.por_fecha){
          this.btnExportExcelPorFecha();
        }else{
          this.btnExportExcel();
        }
       
        //this.geenerarReporteDecimoExcel();
        break;
      case "TXT":
        this.generarTxt();
        break;
      case "PROCESAR":
          this.procesarDecimoTercero();
          break;

      case "CONSULTAR":
        if(this.por_fecha){
          this.obtenerRolDetallePorFecha();
        }else{
          this.obtenerRolDetalle();
        }
        break;
      case "APROBAR":
        this.aprobarDecimoTercero()
        break;
      case "GENERAR ORDEN":
        this.GenerarOrden();
        break;


      // case "APROBAR":
      //   const dialogRef3 = this.confirmationDialogService.openDialogBD(MspreguntaComponent,{ config: {}, }, dataPresentar );
      //   dialogRef3.result.then((res) => {
      //     if (res.valor) {
      //       this.aprobar();
      //     }
      //   });
      //   break;
    }
  }

  async cargaInicial() {
    try {
      this.mensajeSppiner = "Cargando...";
      this.lcargando.ctlSpinner(true);
      const resPeriodos = await this.admDecimoTerceroService.getPeriodos()
      this.lcargando.ctlSpinner(false);
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  listaDeRubros: any = [];
  lstRubroIngreso: any = [];
  lstRubroEgreso: any = [];
  lstTablaEmpleados: any = [];
  listadoBodyGeneral: any = [ { ingresos: [] }, { egresos: [] }, { valor_total_recibir: [] } ];
  obtenerEmpleados() {
    this.lConcepto = "";
    this.fecha_actual = moment(this.toDatePicker).format("YYYY-MM-DD");
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let idGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);
    this.admDecimoTerceroService.getDatosEmpleados({tipoGrupo: idGrupo, idEmpleado: lIdPersonal.id_personal}).subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      this.lstTablaEmpleados = [];
      res["data"].forEach(element => {
        if(this.validaciones.verSiEsNull(element.fechaSalida) == undefined && element.decimo_tercero=="S"){
          let anioActual:any = new Date();
          let fechaIngreso:any = element.fechaIngreso.split("-");
          let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;

          let diasValida:any = this.restar2Fechas((fechaIngreso[0]+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
          if(diasValida>=360){
            element.diasLaborados = 360;   
          }else{
            let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
            dias = (dias < 0) ? dias * -1 : dias;
            element.diasLaborados = dias;
          }
          this.lstTablaEmpleados.push(element);
        }
      });
      
      if (this.lstTablaEmpleados.length == 0) {
        this.vmButtons[1].habilitar = true;
        this.vmButtons[5].habilitar = true;
      }
      this.calcularRubros();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });
  }


  openComboDepartamentos() {
    this.LoadOpcionDepartamento = true;
    let parameterUrl: any = {
      page: 1,
      size: 100,
      sort: "id_departamento",
      type_sort: "asc",
      search: "",
    };

    this.admDecimoTerceroService.getDepartamentosPaginate(parameterUrl).subscribe({
      next: (rpt: DepartemtAditionalI) => {
        let DataDepart = rpt.data;
        DataDepart.unshift({
          id_departamento: 0,
          dep_nombre: '-todos-',
          dep_descripcion: '',
          dep_keyword: '',
          id_area: 0,
          estado_id: 0,
          catalogo: null,
          area: null
        });

        this.LoadOpcionDepartamento = false;
        this.dataDepartamentoResponseI = DataDepart;
      },
      error: (e) => {
        this.LoadOpcionDepartamento = false;
        this.toastr.error(e.error.detail);
      },
    });

  }

  geenerarReporteDecimo(){
    let year;
    let mes = 12;

    // if(typeof this.select_anio !== "string"){
    //   year = this.select_anio.getFullYear();
    // }else{
    //   year = this.select_anio;
    // }
    year = this.select_anio;
    let Desde = (year - 1 ) + "12"
    let Hasta = year + "11"

    window.open(environment.ReportingUrl + "rpt_decimo_tercero.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&Hasta="+Hasta+"&desde="+Desde+"&anio="+year+"&mes="+mes, '_blank')

    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_decimo_tercero.html?Hasta=202311&mes=1&Desde=202212&anio=2023

  }


  geenerarReporteDecimoExcel(){


    let year;
    let mes = 12;

    // if(typeof this.select_anio !== "string"){
    //   year = this.select_anio.getFullYear();
    // }else{
    //   year = this.select_anio;
    // }
    year = this.select_anio;
    let Desde = (year - 1 ) + "12"
    let Hasta = year + "11"

    window.open(environment.ReportingUrl + "rpt_decimo_tercero.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&Hasta="+Hasta+"&desde="+Desde+"&anio="+year+"&mes="+mes, '_blank')

    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_decimo_tercero.html?Hasta=202311&mes=1&Desde=202212&anio=2023

  }

  btnExportExcel(){
    
 

    this.mensajeSppiner = "Generando Archivo Excel..."; 
		this.lcargando.ctlSpinner(true); 

    let year;
    let mes = 12;
    year = this.select_anio;
    let Desde = (year - 1 ) + "12"
    let Hasta = year + "11"

    this.admDecimoTerceroService.getDecimoTercero(1,year, mes, Desde, Hasta, this.fk_programa,this.area,this.ngDepartamentSelect, this.decimo_acumula_mensualiza).subscribe(res => {
      this.decimoterceroExcel = res;
      console.log(this.decimoterceroExcel)
    
      this.decimoterceroExcel.forEach(e => {
        Object.assign(e, {apellidos:e.primer_apellido +' '+ e?.segundo_apellido ,
                          nombres: e.primer_nombre+' '+ e?.segundo_nombre ,
                          total_ganado: parseFloat(e.total_ganado),total_devengado:parseFloat(e.total_devengado),valor_decimo:parseFloat(e.valor_decimo),valor_retencion_decimo:parseFloat(e.valor_retencion_decimo)
        });
      })
      console.log(this.decimoterceroExcel)
      let totalDiasTrab = this.decimoterceroExcel.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimoterceroExcel.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimoterceroExcel.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalDecimos = this.decimoterceroExcel.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)
      let totalRetencionDecimo = this.decimoterceroExcel.reduce((suma: number, x: any) => suma + parseFloat(x.valor_retencion_decimo), 0)

      let lineaTotales = {}
      
      lineaTotales['dias_trabajados'] =totalDiasTrab;
      lineaTotales['cedula'] = 'TOTAL';
      lineaTotales['total_ganado'] =totalGanado;
      lineaTotales['total_devengado'] = totalDevengado;
      lineaTotales['valor_retencion_decimo'] = totalRetencionDecimo;
      lineaTotales['valor_decimo'] = totalDecimos;
      this.decimoterceroExcel.push(lineaTotales)

      if(this.decimoterceroExcel.length > 0){
        let data = {
				  title: 'Decimo Tercero',
				  razon_social: 'Gobierno Autonomo Descentralizado',
				  razon_comercial: 'Gobierno Autonomo Descentralizado',
				  direccion: 'Canton La Libertad',
				  fecha_desde: (year - 1 ) + "-12-01",
				  fecha_hasta: year + "-11-30",
				  rows:  this.decimoterceroExcel
				}
        this.xlsService.exportExcelDecimoTercero(data, 'Decimo Tercero')
        this.lcargando.ctlSpinner(false);
      }else{
				this.toastr.info("No hay datos para exportar")
				this.lcargando.ctlSpinner(false); 
			}
      
    }, error => {
			this.toastr.info(error.error.mesagge);
			this.lcargando.ctlSpinner(false);
		});
  }

  btnExportExcelPorFecha(){
    
    this.mensajeSppiner = "Generando Archivo Excel..."; 
		this.lcargando.ctlSpinner(true); 
  

    let year;
    let mes = Number(moment(this.fecha_desde).format("MM"));
    year = Number(moment(this.fecha_desde).format("YYYY"));

    let yearHasta;
    let mesHasta = Number(moment(this.fecha_hasta).format("MM"));
    yearHasta = Number(moment(this.fecha_hasta).format("YYYY"));
    let Desde = String(year) + String(mes)
    let Hasta = String(yearHasta) + String(mesHasta)

    this.admDecimoTerceroService.getDecimoTerceroPorFecha(1,year, mes, Desde, Hasta,this.fk_programa,this.area, this.departamento,this.decimo_acumula_mensualiza).subscribe(res => {
    
      this.decimoterceroExcelPorFecha = res;
      console.log(this.decimoterceroExcelPorFecha)
    
      this.decimoterceroExcelPorFecha.forEach(e => {
        Object.assign(e, {apellidos:e.primer_apellido +' '+ e?.segundo_apellido ,
                          nombres: e.primer_nombre+' '+ e?.segundo_nombre ,
                          total_ganado: parseFloat(e.total_ganado),total_devengado:parseFloat(e.total_devengado),valor_decimo:parseFloat(e.valor_decimo),valor_retencion_decimo:parseFloat(e.valor_retencion_decimo)
        });
      })
      console.log(this.decimoterceroExcelPorFecha)
      let totalDiasTrab = this.decimoterceroExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimoterceroExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimoterceroExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalDecimos = this.decimoterceroExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)
      let totalRetencionDecimo = this.decimoterceroExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.valor_retencion_decimo), 0)

      let lineaTotales = {}
      
      lineaTotales['dias_trabajados'] =totalDiasTrab;
      lineaTotales['cedula'] = 'TOTAL';
      lineaTotales['total_ganado'] =totalGanado;
      lineaTotales['total_devengado'] = totalDevengado;
      lineaTotales['valor_retencion_decimo'] = totalRetencionDecimo;
      lineaTotales['valor_decimo'] = totalDecimos;
      this.decimoterceroExcelPorFecha.push(lineaTotales)

      if(this.decimoterceroExcelPorFecha.length > 0){
        let data = {
				  title: 'Decimo Tercero',
				  razon_social: 'Gobierno Autonomo Descentralizado',
				  razon_comercial: 'Gobierno Autonomo Descentralizado',
				  direccion: 'Canton La Libertad',
				  fecha_desde: this.fecha_desde,
				  fecha_hasta: this.fecha_hasta,
				  rows:  this.decimoterceroExcelPorFecha
				}
        this.xlsService.exportExcelDecimoTercero(data, 'Decimo Tercero')
        this.lcargando.ctlSpinner(false);
      }else{
				this.toastr.info("No hay datos para exportar")
				this.lcargando.ctlSpinner(false); 
			}
      
    }, error => {
			this.toastr.info(error.error.mesagge);
			this.lcargando.ctlSpinner(false);
		});
  }
 

  generarTxt() {
    // armar array con cabeceras
    // this.downloadFile(
    //   this.decimotercero, 
    //   'DecimoTercero', 
    //   ['nombres', 'porpagar', 'pagado', 'valor_pagar', 'nromesesprovision', 'periodoinicial', 'periodofinal']
    // )
    
    this.decimotercero.forEach(e => {
      Object.assign(e, {apellidos:e.primer_apellido +' '+ e?.segundo_apellido ,
                        nombres: e.primer_nombre+' '+ e?.segundo_nombre  
      });
    }) 

    // this.exportToCsv(
    //   this.decimotercero, 
    //   'DecimoTercero', 
    //   ['cedula',
    //    'apellidos',
    //    'nombres',
    //    'dias_trabajados',
    //    'total_ganado',
    //    'pagado',
    //    'porpagar',
    //    'nromesesprovision',
    //    'periodoinicial',
    //    'periodofinal'
    //   ]
    // )
    this.downloadFileCsv(
      this.decimotercero, 
      'DecimoTercero', 
      ['cedula',
       'nombres',
       'apellidos',
       'genero',
       'ocupacion',
       'total_ganado',
       'dias_trabajados',
       'tipo_deposito',
       'jornada_parcial_permanente',
       'horas_jornada_parcial_permanente',
       'dicapacidad',
       'valor_retencion_decimo',
       'mensualiza_decimo',
      //  'pagado',
      //  'porpagar',
      //  'nromesesprovision',
      //  'periodoinicial',
      //  'periodofinal'
      ]
    )



    
    
  }


  public exportToCsv(rows: object[], fileName: string, columns?: string[]): string {

    if (!rows || !rows.length) {
      return;
    }
    const separator = ';';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) {
        
        return columns.includes(k);
      } else {
        return true;
      }
    });
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
    //this.saveAsFile(csvContent, `${fileName}`, '.csv');
    //FileSaver.saveAsFile(csvContent, `${fileName}`, '.csv');

    var blob = new Blob([csvContent], {type: 'text/csv' })
    FileSaver.saveAs(blob, `${fileName}` + ".csv");
  }


  

  downloadFileCsv(data: any, filename:string,cabecera) {
    const replacer = (key, value) => value === null ? '' : value;
    
    //const header = Object.keys(data[0]);
    const header = cabecera;
    console.log(header)
   
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(';'));
    if(header[0]=='cedula'){header[0]="Cédula (Ejm.:0502366503)"}
    if(header[1]=='nombres'){header[1]='Nombres'}
    if(header[2]=='apellidos'){header[2]='Apellidos'}
    if(header[3]=='genero'){header[3]='Genero (Masculino=M ó Femenino=F)'}
    if(header[4]=='ocupacion'){header[4]="Ocupación"}
    if(header[5]=='total_ganado'){header[5]='Total_ganado (Ejm.:1000.56)'}
    if(header[6]=='dias_trabajados'){header[6]='Días laborados (360 días equivalen a un año)'}
    if(header[7]=='tipo_deposito'){header[7]='Tipo de Depósito(Pago Directo=P,Acreditación en Cuenta=A,Retencion Pago Directo=RP,Retencion Acreditación en Cuenta=RA)'}
    if(header[8]=='jornada_parcial_permanente'){header[8]='Solo si el trabajador posee JORNADA PARCIAL PERMANENTE ponga una X'}
    if(header[9]=='horas_jornada_parcial_permanente'){header[9]='DETERMINE EN HORAS LA JORNADA PARCIAL PERMANENTE SEMANAL ESTIPULADO EN EL CONTRATO'}
    if(header[10]=='dicapacidad'){header[10]='Solo si su trabajador posee algun tipo de discapacidad ponga una X'}
    if(header[11]=='valor_retencion_decimo'){header[11]='Ingrese el valor retenido'}
    if(header[12]=='mensualiza_decimo'){header[12]='SOLO SI SU TRABAJADOR MENSUALIZA EL PAGO DE LA DECIMOTERCERA REMUNERACIÓN PONGA UNA X'}
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob(["\uFEFF"+ csvArray], {type: 'text/csv; charset=utf-8' })
    FileSaver.saveAs(blob, filename + ".csv");
}

  obtenerRubros() {
    this.listaDeRubros = [];
    this.lstRubroIngreso = [];
    this.lstRubroEgreso = [];
    this.admDecimoTerceroService.getConceptoInfo({tipoClase: "Decimo Tercero"}).subscribe((res: any) => {
      console.log(res)
        this.listaDeRubros = res.data;
        res.data.forEach((element) => {
          if (element.tipo == "Ingreso") {
            this.lstRubroIngreso.push(element);
          }
          if (element.tipo == "Egreso") {
            this.lstRubroEgreso.push(element);
          }
        });
      },
      (error) => {}
    );
  }

  listadoGeneral: any = [
    {
      datos_empleado: [
        { nombre: "#", sise: "1%" },
        { nombre: "NOMBRE", sise: "8%" },
        { nombre: "DEPARTAMENTO", sise: "8%" },
        { nombre: "AFILIADO", sise: "4%" },
        { nombre: "DIAS LABORADOS", sise: "4%" },
        { nombre: "SUELDO", sise: "4%" }
      ],
    },
    { ingresos: [] },
    { egresos: [] },
    { valor_total_recibir: [] },
  ];

  agregarIngreso(evento: any) {
    this.listadoGeneral[1].ingresos.push({ sise: "8%", dataAll: evento });
  }

  agregarEgresos(evento: any) {
    this.listadoGeneral[2].egresos.push({ sise: "8%", dataAll: evento });
  }

  eliminarRubro(item, i, tipo) {
    if (tipo == 1) {
      this.listadoGeneral[tipo].ingresos.splice(i, 1);
      this.lstTablaEmpleados.forEach((element, index) => {
        element.datoRubro.splice(i, 1);
      });
      this.calcularIngresos();
    } else if (tipo == 2) {
      this.listadoGeneral[tipo].egresos.splice(i, 1);
    }
  }

  calcularIngresos() {
    this.validaciones.calcularIngresos(this.lstTablaEmpleados);
  }

  calcularEgresos() {
    this.validaciones.calcularEgresos(this.lstTablaEmpleados);
  }

  resultadoReciTotal: any = 0;
  calcularValorNetoRecibir() {
    this.resultadoReciTotal = 0;
    this.resultadoReciTotal = this.validaciones.calcularValorNetoRecibir(this.lstTablaEmpleados);
  }  

  calcularRubros() {
    this.lstTablaEmpleados.forEach((element, index) => {
      this.lstRubroIngreso.forEach((element2) => {
        if (element.datoRubro == undefined) {
          element.datoRubro = [];
        }
        let valores: any = this.validaciones.obtenerTipoRubro(element2.id_parametro, this.listaDeRubros);
        if (valores != null) {
          let sueldoBase: any = Number(element.sueldoBase);
          let cantidad_unificado: any = Number(valores.cantidad_unificado);
          let anioActual:any = new Date();
          let fechaIngreso:any = element.fechaIngreso.split("-");
          let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;

          let dias:any = 0;
          let diasValida:any = this.restar2Fechas((fechaIngreso[0]+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
          if(diasValida>=360){
            dias = 360;   
          }else{
            dias = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
            dias = (dias < 0) ? dias * -1 : dias;
          }
          
          if (valores.tipo_calculo == "S") {
            valores.valor_cantidad = eval(valores.formula);
            element.datoRubro.push(valores);
          }
          if (valores.tipo_calculo == "N") {
            valores.valor_cantidad = 0;
            element.datoRubro.push(valores);
          }
        }
      });

      this.lstRubroEgreso.forEach((element2) => {
        if (element.datoRubroEgr == undefined) {
          element.datoRubroEgr = [];
        }
        let valores: any = this.validaciones.obtenerTipoRubro(element2.id_parametro, this.listaDeRubros);
        if (valores != null) {
          let sueldoBase: any = Number(element.sueldoBase);
          let cantidad_unificado: any = Number(valores.cantidad_unificado);
          if (valores.tipo_calculo == "S") {
            valores.valor_cantidad = eval(valores.formula);
            element.datoRubroEgr.push(valores);
          }
          if (valores.tipo_calculo == "N") {
            valores.valor_cantidad = 0;
            element.datoRubroEgr.push(valores);
          }
        }
      });
    });

    setTimeout(() => {
      this.calcularIngresos();
      this.calcularEgresos();
      this.calcularValorNetoRecibir();
      this.calcularTotalesIngresos();
      this.calcularTotalesEgresos();
    }, 10);
  }

  lstTotalIngresos: any = [];
  calcularTotalesIngresos() {
    this.lstTotalIngresos = [];
    this.lstTotalIngresos = this.validaciones.calcularTotalesIngresos(this.lstTotalIngresos, this.lstTablaEmpleados);
  }

  lstTotalEgresos: any = [];
  calcularTotalesEgresos() {
    this.lstTotalEgresos = [];
    this.lstTotalEgresos = this.validaciones.calcularTotalesEgresos(this.lstTotalEgresos, this.lstTablaEmpleados);
  }

  guardar() {
    if(this.validaPeriodoFechas()){
      this.validaciones.mensajeAdvertencia("Advertencia","El periodo seleccionado no es el correcto para realizar el pago del decimo tercero. Debe escoger un período del 01 de diciembre del año anterior al 30 de noviembre del presente año.");
      return;
    }

    if (this.validaciones.verSiEsNull(this.lConcepto) == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Por favor ingrese un concepto");
      return;
    }

    if (this.bankSelect == 0) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Por favor sleccione un banco");
      return;
    }

    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
    let validaTermina: boolean = false;
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    let nombreGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).nombre_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);

    let dataPost:any = {
      tipoGrupo: nombreGrupo, 
      idPersonal: lIdPersonal.id_personal, 
      tipoModulo: myVarGlobals.fNomDecTercero, 
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };
    this.admDecimoTerceroService.getNomRolCab(dataPost).subscribe((datos: any) => {
          let existePeriodo: any = datos.data.find((datos) => moment(datos.periodo_inicio).format("YYYY-MM-DD") == periodoInicio && moment(datos.periodo_fin).format("YYYY-MM-DD") == periodoFin);
          let bancoSeleccionado: any = this.arrayBanks.find((datos) => datos.id_banks == this.bankSelect);
          if (existePeriodo == undefined) {
            this.lstTablaEmpleados.forEach((element, indexEmpleado) => {
              let totalIngresos: any = null;
              let totalEgresos: any = null;
              let datosPostCabecera: any = [];
              let datosPostDetIngreso: any = [];
              let datosPostDetEgreso: any = [];
              totalIngresos = element.datoRubro.find((datos) => datos.nombre == "TOTAL INGRESOS");
              if(element.datoRubroEgr!=undefined){
                totalEgresos = element.datoRubroEgr.find((datos) => datos.nombre == "TOTAL EGRESOS");
              }
              let datos: any = {
                id_rol: null,
                concepto: this.lConcepto,
                fecha_pago: this.fecha_actual,
                empleado: element.id_personal,
                departamento: element.nombre_grupo,
                ingreso_total: totalIngresos ? totalIngresos.valor_cantidad : 0,
                egreso_total: totalEgresos ? totalEgresos.valor_cantidad : 0,
                total: element.valorNetoRecibir,
                estado: "P",
                guardado: 1,
                fk_empresa: element.id_empresa,
                nombre_cuenta: bancoSeleccionado.name_cuenta,
                cod_cuenta_banck: bancoSeleccionado.cuenta_contable,
                id_banks: bancoSeleccionado.id_banks,
                tipo_modulo: myVarGlobals.fNomDecTercero,                
                periodo_inicio: periodoInicio,
                periodo_fin: periodoFin,
                ip: this.commonServices.getIpAddress(),
                accion: ("Guardar decimo tercero de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
                id_controlador: myVarGlobals.fNomDecTercero,
                idDetPrestamo: null
              };

              datosPostCabecera.push(datos);
              element.datoRubro.forEach((urb, index) => {
                if (urb.id_parametro != undefined) {
                  let datosDet: any = {
                    id_ro_detalle: null,
                    id_parametro: urb.id_parametro,
                    concepto_cuenta: urb.cuenta,
                    ingresos: urb.valor_cantidad,
                    egreso: 0,
                    total: urb.valor_cantidad,
                    confirmar: 0,
                    nombre_cuenta: urb.nombre_cuenta,
                  };
                  datosPostDetIngreso.push(datosDet);
                }
              });

              if(element.datoRubroEgr!=undefined){
                element.datoRubroEgr.forEach((urb, index) => {
                  if (urb.id_parametro != undefined) {
                    let datosDet: any = {
                      id_ro_detalle: null,
                      id_parametro: urb.id_parametro,
                      concepto_cuenta: urb.cuenta,
                      ingresos: 0,
                      egreso: urb.valor_cantidad,
                      total: urb.valor_cantidad,
                      confirmar: 0,
                      nombre_cuenta: urb.nombre_cuenta,
                    };
                    datosPostDetEgreso.push(datosDet);
                  }
                });
              }              

              let datosDetBanco: any = {
                id_ro_detalle: null,
                id_parametro: null,
                concepto_cuenta: datos.cod_cuenta_banck,
                ingresos: 0,
                egreso: datos.total,
                total: datos.total,
                confirmar: 0,
                nombre_cuenta: datos.nombre_cuenta,
              };
              datosPostDetEgreso.push(datosDetBanco);

              let datosEnviar: any = {
                cabecera: datosPostCabecera,
                ingresos: datosPostDetIngreso,
                egresos: datosPostDetEgreso,
              };

              this.admDecimoTerceroService.guardarNomRol(datosEnviar).subscribe((datos) => {
                  if (this.lstTablaEmpleados.length == indexEmpleado + 1) {
                    validaTermina = true;
                  }
                }, (error) => {
                  this.lcargando.ctlSpinner(false);
                }
              );
            });
          } else {
            this.validaciones.mensajeError("Regristro repetido", "El decimo tercero del periodo " + periodoInicio + " al " +periodoFin + " ya esta registrado");
            this.lcargando.ctlSpinner(false);
          }

          this.timer = setInterval(() => {
            if (validaTermina) {
              this.lcargando.ctlSpinner(false);
              this.validaciones.mensajeExito("Exito", "Los decimo tercero se guardaron correctamente");
              this.obtenerRolDetalle();
              clearInterval(this.timer);
            }
          }, 200);
        }, (error) => {
          this.lcargando.ctlSpinner(false);
        }
      );
  }

  timer: any;



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

  procesarDecimoTercero() {
    
    if(this.decimo_acumula_mensualiza == null){this.decimo_acumula_mensualiza = 0 }
    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.area==null) { this.area=0 }
    if(this.departamento==null) { this.departamento=0 }
   
    let year;
    let mes = 12;

    year = this.select_anio;
    let Desde = (year - 1 ) + "12"
    let Hasta = year + "11"
    this.mensajeSppiner = "Procesando Decimo Tercero...";
    this.lcargando.ctlSpinner(true);
    this.admDecimoTerceroService.procesarDecimoTercero(1,year, mes, Desde, Hasta,this.fk_programa,this.area, this.departamento,this.decimo_acumula_mensualiza,this.dataUser.id_usuario).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      console.log(res)
     // this.decimotercero = res;
     this.obtenerRolDetalle()
     

      this.vmButtons[6].habilitar = false
      this.vmButtons[7].habilitar = false
    });
   
  }

  aprobarDecimoTercero(){
   
  
    let empleadosCheck= this.decimotercero.filter(e => e.aprobar==true)
    console.log(empleadosCheck)
    let data = {
      anio: this.select_anio,
      mes: 12,
      tipo_decimo: 'DECIT',
      empleados: empleadosCheck 
    }

    console.log("datadecimoterce",data)
    this.mensajeSppiner = "Aprobando Decimo Tercero...";
    this.lcargando.ctlSpinner(true);
    this.admDecimoTerceroService.aprobarDecimoTercero(data).subscribe(res => {
      console.log(res)
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        icon: "success",
        title: "Se ha procesado con éxito",
        //text: res['message'],
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
    })
    this.obtenerRolDetalle()
   
    },error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  
}


  obtenerRolDetalle() {
    console.log(this.decimo_acumula_mensualiza)
    if(this.decimo_acumula_mensualiza == null){this.decimo_acumula_mensualiza = 0 }
    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.area==null) { this.area=0 }
    if(this.departamento==null) { this.departamento=0 }
  

    this.mensajeSppiner = "Cargando Decimo Tercero...";
    this.lcargando.ctlSpinner(true);

    let year;
    let mes = 12;
    year = this.select_anio;
    let Desde = (year - 1 ) + "12"
    let Hasta = year + "11"

    this.admDecimoTerceroService.getDecimoTercero(1,year, mes, Desde, Hasta,this.fk_programa,this.area, this.departamento,this.decimo_acumula_mensualiza).subscribe(
      res => {
        console.log(res)
      this.decimotercero = res;
      this.decimotercero.forEach((e,index) => {
    
        if(e.num_control !=''){
          Object.assign(e,{ aprobar:true, tiene_control:true})
        }
        
      });

      let totalDiasTrab = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalRetencionDecimo = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_retencion_decimo), 0)
      let totalDecimos = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)
      

      this.totalDiasTrab =totalDiasTrab
      this.totalGanado =totalGanado
      this.totalDevengado =totalDevengado
      this.totalDecimos =  totalDecimos 
      this.totalRetencionDecimo =  totalRetencionDecimo 
      this.lcargando.ctlSpinner(false);
      
     
      //si trae datos de empleados con decimo habilito el boton aprobar
      let sinAprobar = this.decimotercero.filter(e => e.aprobar == true && e.num_control =='')
      if(sinAprobar.length > 0){
        this.vmButtons[2].habilitar = false;
      }else{
        this.vmButtons[2].habilitar = true;
      }

      //si hay aprobados sin orden de pago habilito el boton generar orden de pago
      let aprobados = this.decimotercero.filter(e => e.tiene_control == true && e.num_orden_pago =='')
      console.log(aprobados)
      if(aprobados.length > 0){
        this.vmButtons[3].habilitar = false;
      }

      this.vmButtons[6].habilitar = false
      this.vmButtons[7].habilitar = false
    });


  
  
  
    /*

    this.getInfoBank();
    this.lConcepto = "";
    this.fecha_actual = moment(this.toDatePicker).format("YYYY-MM-DD");
    this.vmButtons[0].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.listadoGeneral[0].datos_empleado = [
      { nombre: "#", sise: "1%" },
      { nombre: "NOMBRE", sise: "8%" },
      { nombre: "DEPARTAMENTO", sise: "8%" },
      { nombre: "AFILIADO", sise: "4%" },
      { nombre: "DIAS LABORADOS", sise: "4%" },
      { nombre: "SUELDO", sise: "4%" }
    ];

    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let nombreGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).nombre_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);

    let dataPost:any = {
      tipoGrupo: nombreGrupo, 
      idPersonal: lIdPersonal.id_personal, 
      tipoModulo: myVarGlobals.fNomDecTercero, 
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };
    
    this.admDecimoTerceroService.getNomRolCab(dataPost).subscribe((datosCab: any) => {          
          let existePeriodo: any = datosCab.data.find((datos) => moment(datos.periodo_inicio).format("YYYY-MM-DD") == periodoInicio && moment(datos.periodo_fin).format("YYYY-MM-DD") == periodoFin);
          if (existePeriodo != undefined) {
            this.listadoGeneral[0].datos_empleado = [
              { nombre: "#", sise: "1%" },
              { nombre: "NOMBRE", sise: "8%" },
              { nombre: "DEPARTAMENTO", sise: "8%" },
              { nombre: "AFILIADO", sise: "4%" },
              { nombre: "DIAS LABORADOS", sise: "4%" },              
              { nombre: "CONCEPTO", sise: "4%" },
              { nombre: "BANCO", sise: "10%" },
              { nombre: "SUELDO", sise: "4%" },
            ];
            this.vmButtons[0].habilitar = true;
            this.vmButtons[3].habilitar = false;
            let datosPresentar: any = [];
            datosCab.data.forEach((cabecera) => {
              if (moment(cabecera.periodo_inicio).format("YYYY-MM-DD") == periodoInicio && moment(cabecera.periodo_fin).format("YYYY-MM-DD") == periodoFin) {//  && cabecera.decimo_tercero=="S"
                this.lConcepto = nombreGrupo == "TODOS" ? cabecera.concepto : this.lConcepto + cabecera.concepto + ", ";
                this.fecha_actual = cabecera.fecha_pago;
                if (cabecera.datoRubro == undefined) {
                  cabecera.datoRubro = [];
                }
                if (cabecera.datoRubroEgr == undefined) {
                  cabecera.datoRubroEgr = [];
                }

                cabecera.detalle_rol.forEach((element, index) => {
                  let valores: any = this.validaciones.obtenerTipoRubro(element.id_parametro,this.listaDeRubros);
                  if (valores != null) {
                    valores.valor_cantidad = element.total;
                    if (valores.tipo == "Ingreso") {
                      cabecera.datoRubro.push(valores);
                    }
                    if (valores.tipo == "Egreso") {
                      cabecera.datoRubroEgr.push(valores);
                    }
                  }
                });
                datosPresentar.push(cabecera);
              }
            });

            this.lcargando.ctlSpinner(false);
            this.lstTablaEmpleados = [];
            this.lstTablaEmpleados = datosPresentar;
            this.lstTablaEmpleados.forEach(element => {
              let anioActual:any = new Date();
              let fechaIngreso:any = element.fechaIngreso.split("-");
              let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;

              let diasValida:any = this.restar2Fechas((fechaIngreso[0]+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
              if(diasValida>=360){
                element.diasLaborados = 360;   
              }else{
                let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
                dias = (dias < 0) ? dias * -1 : dias;
                element.diasLaborados = dias;  
              }                
            });
            this.calcularIngresos();
            this.calcularEgresos();
            this.calcularValorNetoRecibir();
            this.calcularTotalesIngresos();
            this.calcularTotalesEgresos();  
            
            if (!this.vmButtons[0].habilitar && this.lstTablaEmpleados.length > 0) {
              this.vmButtons[2].habilitar = true;
            }
            this.setearValoresPrint();
          } else {
            this.obtenerEmpleados();
          } 
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.obtenerEmpleados();
        }
      );


      */
  }
  async getPrevRecord() {
    
    this.lastRecord = Number(this.lastRecord)- 1;
     this.getNumControl()
  //  await this.handleEnter({key: 'Enter'})
  }

  async getNextRecord() {
    
    this.lastRecord = Number(this.lastRecord)+ 1;
     this.getNumControl()
   // await this.handleEnter({key: 'Enter'})
  }
  async handleEnter({key}) {
    if (key === 'Enter') {
      if (this.lastRecord == null) {
        await this.getLatest()
        return
      }else{
       this.getNumControl()
      }

    
    }
  }
  getLatest() {
    this.lcargando.ctlSpinner(true)
    let data = {

      tipo_decimo: 'DECIT',

    }
    let respuesta;
    this.admDecimoTerceroService.getLatest(data).subscribe(
      res => {
       
        respuesta = res;
        this.lastRecord = respuesta?.data?.id;
        if (respuesta.data.num_documento) {
          this.num_control = respuesta.data.num_documento
          // this.getRolNoControl()

          this.getPorNoControl();
        
        } else {
       
          this.lcargando.ctlSpinner(false)
          Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
        }
        //this.lcargando.ctlSpinner(false);
      });
  }


  getNumControl() {
    this.lcargando.ctlSpinner(true)

    let data = {

      tipo_decimo: 'DECIT',
      id: this.lastRecord
    }
    let respuesta;
    this.admDecimoTerceroService.getNumControl(data).subscribe(
      res => {
        console.log("aaaaaaaaaaaaaaaaaa", res)
        respuesta = res;
        this.decimotercero = [];

        if (respuesta.data.num_documento) {
          this.num_control = respuesta.data.num_documento

          this.getPorNoControl();
        } else {

          this.lcargando.ctlSpinner(false)
          Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
        }
      });
  }

    





  obtenerRolDetallePorFecha(){
    console.log(this.decimo_acumula_mensualiza)
    if(this.decimo_acumula_mensualiza == null){this.decimo_acumula_mensualiza = 0 }
    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.area==null) { this.area=0 }
    if(this.departamento==null) { this.departamento=0 }
  

    this.mensajeSppiner = "consultando por rango de fechas...";
    this.lcargando.ctlSpinner(true);

    let year;
    let mes = Number(moment(this.fecha_desde).format("MM"));
    year = Number(moment(this.fecha_desde).format("YYYY"));

    let yearHasta;
    let mesHasta = Number(moment(this.fecha_hasta).format("MM"));
    yearHasta = Number(moment(this.fecha_hasta).format("YYYY"));
    
    let Desde = String(year*100+mes)
    let Hasta = String(yearHasta*100+mesHasta)

    this.admDecimoTerceroService.getDecimoTerceroPorFecha(1,year, mes, Desde, Hasta,this.fk_programa,this.area, this.departamento,this.decimo_acumula_mensualiza).subscribe(
      res => {
        console.log(res)
      this.decimotercero = res;
      this.decimotercero.forEach((e,index) => {
    
        if(e.num_control !=''){
          Object.assign(e,{ aprobar:true, tiene_control:true})
        }
        
      });

      let totalDiasTrab = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalRetencionDecimo = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_retencion_decimo), 0)
      let totalDecimos = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)
      

      this.totalDiasTrab =totalDiasTrab
      this.totalGanado =totalGanado
      this.totalDevengado =totalDevengado
      this.totalDecimos =  totalDecimos 
      this.totalRetencionDecimo =  totalRetencionDecimo 
      this.lcargando.ctlSpinner(false);
      
     
      //si trae datos de empleados con decimo habilito el boton aprobar
      let sinAprobar = this.decimotercero.filter(e => e.aprobar == true && e.num_control =='')
      if(sinAprobar.length > 0){
        this.vmButtons[2].habilitar = false;
      }else{
        this.vmButtons[2].habilitar = true;
      }

      //si hay aprobados sin orden de pago habilito el boton generar orden de pago
      let aprobados = this.decimotercero.filter(e => e.tiene_control == true && e.num_orden_pago =='')
      console.log(aprobados)
      if(aprobados.length > 0){
        this.vmButtons[3].habilitar = false;
      }

      this.vmButtons[6].habilitar = false
      this.vmButtons[7].habilitar = false
    });


  }


  GenerarOrden(){
    let empleadosCheck= this.decimotercero.filter(e => e.tiene_control==true)
    console.log(empleadosCheck)
    let data = {
      anio: this.select_anio,
      mes: 12,
      tipo_decimo: 'DECIT',
      empleados: empleadosCheck 
    }
    this.mensajeSppiner = "Generando Ordenes de Pago"; 
    this.lcargando.ctlSpinner(true);
    this.admDecimoTerceroService.generarOrdenesPago(data).subscribe(res => {
      console.log(res)
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        icon: "success",
        title: "Se ha procesado con éxito",
        //text: res['message'],
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
    })
    this.obtenerRolDetalle()
   
    },error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  }

  anularPeriodoRol() {
    if (this.vmButtons[1].habilitar && this.lstTablaEmpleados.length > 0) { 
      let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
      let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
      let anioActual:any = moment(new Date()).format("YYYY-MM-DD");
      let anioAnterior:any = null;
      anioAnterior =  moment(this.validaciones.sumarDias(new Date(), -365)).format("YYYY-MM-DD");      
      let validafInicio:any = new Date(+anioAnterior.split("-")[0], 12 - 1, +"01");
      let validafFin:any = new Date(+anioActual.split("-")[0], 11 - 1, +"30");
      validafInicio = moment(validafInicio).format("YYYY-MM-DD");
      validafFin = moment(validafFin).format("YYYY-MM-DD");
      if (periodoInicio != validafInicio || periodoFin != validafFin) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Este decimo tercero del periodo seleccionado no se puede anular porque no es el correcto o el actual");
        return;
      }

      let enviarData:any = [];
      this.lstTablaEmpleados.forEach((element) => {
        let dataPost: any = {
          id_rol: element.id_rol,
          ip: this.commonServices.getIpAddress(),
          accion: ("Eliminación de decimo tercero de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
          id_controlador: myVarGlobals.fNomDecTercero,
          id_banks: element.id_banks,
          secuencia: element.num_doc,
          total: element.total,
          id_prestamo_dets: null
        };
        enviarData.push(dataPost);
      });

      this.mensajeSppiner = "Anulando decimo tercero...";
      this.lcargando.ctlSpinner(true);
      this.admDecimoTerceroService.deleteRolPago({datosPost: enviarData}).subscribe((res: any) => {
          this.validaciones.mensajeExito("Exito", "Los decimo tercero se anularon correctamente");
          this.obtenerRolDetalle();
        }, (error) => {
          this.lcargando.ctlSpinner(false);
        }
      );
      
    } else {
      this.validaciones.mensajeAdvertencia("Advertencia", "No puede anular este periodo de decimo tercero porque no existe o el departamento no existe ningun empleado");
    }
  }

  arrayBanks: any = [];
  getInfoBank() {
    this.admDecimoTerceroService.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
        this.arrayBanks = res["data"];
      },
      (error) => {}
    );
  }

  arrayPersonal: any = [];
  selectPersonal: any;
  getPersonal() {
    let idDepartamento: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    this.admDecimoTerceroService.getPersonalInfo({ idDepartamento: idDepartamento }).subscribe((res) => {
      this.arrayPersonal = [];
      let datosPer:any = [];
      res["data"].forEach(element => {
        if(this.validaciones.verSiEsNull(element.fechaSalida) == undefined){
          let anioActual:any = new Date();
          let fechaIngreso:any = element.fechaIngreso.split("-");
          let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;

          let diasValida:any = this.restar2Fechas((fechaIngreso[0]+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
          if(diasValida>=360){
            element.diasLaborados = 360;   
          }else{
            let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
            dias = (dias < 0) ? dias * -1 : dias;            
            element.diasLaborados = dias;
          }
          datosPer.push(element);
        }
      });
      this.arrayPersonal = datosPer;
      this.arrayPersonal.splice(this.arrayPersonal.length + 1, 0, { id_personal: 0, nombres: "TODOS", apellidos: ""});
      this.selectPersonal = 0;
    });
  }

  dataSucursal: any = [];
  getSucursal() {
    this.admDecimoTerceroService.getSucursales().subscribe((res) => {
      console.log(res)
      console.log(this.dataUser.id_sucursal)
        this.dataSucursal = res["data"].filter((e) => e.id_sucursal == this.dataUser.id_sucursal)[0];
      },
      (error) => {}
    );
  }

  setearValoresPrint() {
    this.imprimirRolComponent.setearValores(this.lstTablaEmpleados, this.dataUser, this.dataSucursal, "DECIMO TERCERO");
  }

  restar2Fechas(fechaInicio:any, fechaFin:any){
    let lfechaInicio:any = String(fechaInicio).split("-");
    let lfechaFin:any = String(fechaFin).split("-");
    let fechauno = new Date(+lfechaInicio[0], lfechaInicio[1] - 1, +lfechaInicio[2]).getTime();
    let fechados = new Date(+lfechaFin[0], lfechaFin[1] - 1, +lfechaFin[2]).getTime();
    let diff = fechados - fechauno;    
    return diff/(1000*60*60*24);
  }

  calcularTotalesSueldo(){
    let resultado:any = 0;
    this.lstTablaEmpleados.forEach(element => {
      resultado = resultado + element.sueldoBase;
    });
    return this.validaciones.roundNumber(Number(resultado), 2);
  }


  periodoInicio:any;
  periodoFin:any;
  validaPeriodoFechas(){
    let resultado:boolean = false;
    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");    
    let validafInicio = new Date(+periodoInicio.split("-")[0], 12 - 1, +"01");
    let validafFin = new Date(+periodoFin.split("-")[0], 11 - 1, +"30");
    if(periodoInicio != moment(validafInicio).format("YYYY-MM-DD") || periodoFin != moment(validafFin).format("YYYY-MM-DD")){
      resultado = true;
    }    
    return resultado;
  }

  // aprobar(){
  //   console.log(this.lstTablaEmpleados)
  //   let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
  //   let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
  //   let valida:boolean = false;
  //   let enviarData:any = [];
    
  //   this.lstTablaEmpleados.forEach((element) => {
  //     if(element.estadoRol == "P"){
  //       valida = true;
  //       let dataPost: any = {
  //         id_rol: element.id_rol,
  //         ip: this.commonServices.getIpAddress(),
  //         accion: ("Aprobacion de decimo tercero de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
  //         id_controlador: myVarGlobals.fNomDecTercero,
  //         estado: "A",
  //         descripcion: "Decimo Tercero del " + periodoInicio + " al " + periodoFin,
  //         id_banks: element.id_banks,
  //         secuencia: element.num_doc,
  //         total: element.total,
  //         id_prestamo_dets: null
  //       };
  //       enviarData.push(dataPost);
  //     }
  //   }); 

  //   if(!valida){
  //     this.validaciones.mensajeInfo("Informativo","No existe informacion a aprobar");
  //     return;
  //   }

  //   this.mensajeSppiner = "Apobando decimo tercero por favor espere...";
  //   this.lcargando.ctlSpinner(true);
  //   this.admDecimoTerceroService.aprobarRolPago({datosPost: enviarData}).subscribe((res: any) => {
  //     this.validaciones.mensajeExito("Exito", "Los decimo tercero se aprobaron correctamente");
  //     this.obtenerRolDetalle();
  //   }, (error) => {
  //     this.lcargando.ctlSpinner(false);
  //   });
  // }


  

  modalPrograma(){
    let modal = this.modalService.open(ModalProgramaComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }
  
  cargarAreas() {
    this.mensajeSppiner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      fk_programa: this.fk_programa
    }

    this.admDecimoTerceroService.getAreas(data).subscribe(
      (res: any) => {
        console.log(res);
        this.areas = res.data
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }
  cargarDepartamentos(event) {
    this.mensajeSppiner = "Cargando listado de Departamentos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_area: this.area
    }

    this.admDecimoTerceroService.getDepartamentos(data).subscribe(
      (res: any) => {
        console.log(res);
        this.departamentos = res
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  handleColumnCheck(event: any, data: any) {
    console.log(event.target.checked)
    console.log(data)
    this.decimotercero.forEach(e => {
      
      if(event.target.checked ){
        Object.assign(e, {aprobar: event.target.checked})
      }else{
        if(e.tiene_control != true){
          Object.assign(e, {aprobar: false})
        }
      }
     });
    let sinAprobar = this.decimotercero.filter(e => e.aprobar == true && e.num_control =='')
    if(sinAprobar.length > 0){
      this.vmButtons[2].habilitar = false;
    }else{
      this.vmButtons[2].habilitar = true;
    }
     console.log(this.decimotercero)
  }

  handleRowCheck(event, data: any) {
    console.log(event.target.checked)
    console.log(data)
    console.log(this.decimotercero)
   this.decimotercero.forEach(e => {
    if(e.cedula == data.cedula){
      Object.assign(e, {aprobar: event.target.checked})
    }
   });
   let sinAprobar = this.decimotercero.filter(e => e.aprobar == true && e.num_control =='')
    if(sinAprobar.length > 0){
      this.vmButtons[2].habilitar = false;
    }else{
      this.vmButtons[2].habilitar = true;
    }

   console.log(this.decimotercero)
  } 
  getPorNoControl() {
      

    this.mensajeSppiner = "Buscando";
    this.lcargando.ctlSpinner(true);

    let data = {
      num_control : this.num_control
    }
    this.admDecimoTerceroService.consultaNumControl(data).subscribe(
      (result: any) => {
        console.log(result)

        this.decimotercero = result;
        this.decimotercero.forEach(e => {
      
          if(e.num_control !=''){
            Object.assign(e,{ aprobar:true, tiene_control:true})
          }
        });
  
        let totalDiasTrab = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
        let totalGanado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
        let totalDevengado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
        let totalDecimos = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)
        let totalRetencionDecimo = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_retencion_decimo), 0)

  
        this.totalDiasTrab =totalDiasTrab
        this.totalGanado =totalGanado
        this.totalDevengado =totalDevengado
        this.totalDecimos =  totalDecimos 
        this.totalRetencionDecimo =  totalRetencionDecimo 
  
        this.lcargando.ctlSpinner(false);
       
        //si trae datos de empleados con decimo habilito el boton aprobar
        let sinAprobar = this.decimotercero.filter(e => e.aprobar == true && e.num_control =='')
        if(sinAprobar.length > 0){
          this.vmButtons[2].habilitar = false;
        }else{
          this.vmButtons[2].habilitar = true;
        }
  
        //si hay aprobados sin orden de pago habilito el boton generar orden de pago
        let aprobados = this.decimotercero.filter(e => e.tiene_control == true && e.num_orden_pago =='')
        if(aprobados.length > 0){
          this.vmButtons[3].habilitar = false;
        }
  
        this.vmButtons[6].habilitar = false
        this.vmButtons[7].habilitar = false

      })
  }

  porFecha(event: any){
    console.log(event.target.checked)
    if(event.target.checked){
      this.decimotercero = []
      this.vmButtons[0].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;
     
    }
   
  }


}

