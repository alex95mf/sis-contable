import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { ConfirmationDialogService } from "../../../../config/custom/confirmation-dialog/confirmation-dialog.service";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from 'src/app/services/common-var.services';
import { AdmDecimoCuartoService } from "../adm-decimo-cuarto/adm-decimo-cuarto.service";
import { EmpleadoService } from "../../adm-nomina/empleado/empleado.service";
import { ImprimirRolComponent } from "../../roles/adm-rol-pago/imprimir-rol/imprimir-rol.component";
import * as myVarGlobals from "../../../../global";
import { MspreguntaComponent } from "../../../../config/custom/mspregunta/mspregunta.component";
import { DepartemtAditionalI } from "src/app/models/responseDepartemtAditional.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalProgramaComponent } from "./modal-programa/modal-programa.component";

import { ToastrService } from 'ngx-toastr';
import Botonera from "src/app/models/IBotonera";
import { environment } from "src/environments/environment";
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as FileSaver from 'file-saver';

import Swal from "sweetalert2/dist/sweetalert2.js";
@Component({
standalone: false,
  selector: "app-adm-decimo-cuarto",
  templateUrl: "./adm-decimo-cuarto.component.html",
  styleUrls: ["./adm-decimo-cuarto.component.scss"],
})
export class AdmDecimoCuartoComponent implements OnInit {
  constructor(
    private empleadoService: EmpleadoService,
    private admDecimoCuartoService: AdmDecimoCuartoService,
    private commonServices: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private toastr: ToastrService,
    private xlsService: XlsExportService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService
  ) {

    this.commonVarSrv.modalProgramArea.subscribe(
      (res) => {
        this.programa = res.nombre
        this.fk_programa = res.id_nom_programa
        this.cargarAreas()
      }
    )
  }

  vmButtons: Array<Botonera> = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();


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
  sueldoUnificado: any = 400;
  cmb_region: any = 'Costa';
  cmb_region_temp: any;
  locality: any;

  lastRecord: number|null = null/*
  lastRecord:any; */
  LoadOpcionDepartamento: any = false;
  dataDepartamentoResponseI: any
  ngDepartamentSelect: any;
  num_control: any
  // campos para la fila de sumas totales
  totalDiasTrab: any = 0
  totalGanado: any = 0
  totalDevengado: any = 0
  totalRetencion:any=0
  totalDecimos: any = 0
  //fin de campos para la fila de sumas totales

  select_anio: any;
  decimocuarto: any;

  decimocuartoExcel: any = []
  decimocuartoExcelPorFecha : any = []
  decimo_acumula_mensualiza: any = 0;
  cmb_periodo: any[] = []

  selectAcumula = [{ value: 0, label: 'TODOS' },
  { value: 6, label: 'SI' },
  { value: 5, label: 'NO' },

  ]
  /*
      {value: '6', label: 'MENSUALIZA'},
      {value: '5', label: 'ACUMULA TODOS'}, */
  selectRegion = [
    { value: 'MENSUALIZA', valor: '', descripcion: '' },
    { value: 'ACUMULA TODOS', valor: '', descripcion: '' },
  ]//:any;

  programa: any = ''
  departamento: any = 0
  fk_programa: any = 0
  areas: any = []
  area: any = 0
  departamentos: any = []

  selectMovimiento = "administracion/adm-decimo-cuarto";

  fecha_desde: any =  moment(this.toDatePicker).format("YYYY-MM-DD");
  fecha_hasta:any =  moment(this.toDatePicker).format("YYYY-MM-DD");

  por_fecha : boolean = false
  cambioMovimiento() {
    this.router.navigateByUrl(this.selectMovimiento);
  }

  ngOnInit(): void {
     this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    console.log(this.dataUser);
    this.vmButtons = [
      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "PROCESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },

      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-check", texto: "APROBAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true, imprimir: true },
      //{ orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GENERAR ORDEN" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-trash-o", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true, imprimir: true },
      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-file-excel", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsAdmDec4", paramAccion: "", boton: { icon: "fa fa-file", texto: "TXT" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-outline-success boton btn-sm", habilitar: false },
    ];

    let fechaActual: any = moment(new Date()).format("YYYY-MM-DD");
    let fechaAntiore: any = moment(this.validaciones.sumarDias(new Date(), -365)).format("YYYY-MM-DD");

    if (this.regionSelect == "C" || this.regionSelect == "G") {
      // Marzo 1 del año anterior (2020) a Febrero 29 del año del pago (2021)
      this.periodoInicio = new Date(+fechaAntiore.split("-")[0], 3 - 1, +"01");
      this.periodoFin = new Date(+fechaActual.split("-")[0], 2 - 1, +"28");
    }

    if (this.regionSelect == "S" || this.regionSelect == "A") {
      // Sierra y Amazónica el periodo de cálculo empieza desde el 1 de agosto hasta el 31 de julio del siguiente año
      this.periodoInicio = new Date(+fechaAntiore.split("-")[0], 8 - 1, +"01");
      this.periodoFin = new Date(+fechaActual.split("-")[0], 7 - 1, +"31");
    }

    this.ngDepartamentSelect = 0;


    this.select_anio = moment(new Date()).format("YYYY");
    console.log(this.select_anio);

    this.obtenerRubros();
    this.getSucursal();
    setTimeout(async () => {
      await this.cargarCatalogos();
      this.permisos();
      await this.cargaInicial()
    }, 10);
  }

  permisions: any = [];
  dataUser: any;
  permisos() {
    this.vmButtons[3].permiso = false;
    this.vmButtons[3].showimg = false;

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fNomDecCuarto,
      id_rol: this.dataUser.id_rol,
    };
    this.getInfoBank();
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {

      this.permisions = res["data"];

      if (this.permisions[0].aprobar == 1) {
        this.vmButtons[3].permiso = true;
        this.vmButtons[3].showimg = true;
      }

      if (this.permisions[0].ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.vmButtons = [];
        this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para ver el formulario de decimo cuarto de pago");
      } else {
        this.empleadoService.getDatosIniciales().subscribe((datos: any) => {
          this.lstInicial = datos.data;
          this.lstInicial[1].splice(this.lstInicial[1].length + 1, 0, { id_grupo: 0, nombre_grupo: "TODOS" });
          this.grupoSeleccionado = this.lstInicial[1].find((datos) => datos.id_grupo == 0).id_grupo;
          this.admDecimoCuartoService.getPersonalInfo({ idDepartamento: this.grupoSeleccionado }).subscribe((res) => {

            this.arrayPersonal = [];
            let datosPer: any = [];
            res["data"].forEach(element => {
              if (this.validaciones.verSiEsNull(element.fechaSalida) == undefined) {
                let anioActual: any = new Date();
                if (element.fechaIngreso != undefined) {
                  let fechaIngreso: any = element.fechaIngreso.split("-");
                  let fechaSalida: any = this.validaciones.verSiEsNull(element.fechaSalida) == undefined ? moment(new Date()).format("YYYY-MM-DD") : element.fechaSalida;
                  let diasValida: any = this.restar2Fechas((fechaIngreso[0] + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
                  if (diasValida >= 360) {
                    element.diasLaborados = 360;
                  } else {
                    let dias: any = this.restar2Fechas((anioActual.getFullYear() + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
                    dias = (dias < 0) ? dias * -1 : dias;
                    element.diasLaborados = dias;
                  }
                  datosPer.push(element);
                }

              }
            });
            this.arrayPersonal = datosPer;
            this.arrayPersonal.splice(this.arrayPersonal.length + 1, 0, { id_personal: 0, nombres: "TODOS", apellidos: "" });
            this.selectPersonal = 0;

            //this.obtenerRolDetalle();
            this.getDataDecimoCuarto();

          });
        },
          (error) => {
            this.lcargando.ctlSpinner(false);
          }
        );
      }
    },
      (error) => {
        this.lcargando.ctlSpinner(false);
      }
    );
  }



  async cargarCatalogos() {
    this.lcargando.ctlSpinner(true);

    try {
      (this as any).mensajeSpinner = "Cargando Catalogos";
      const response = await this.empleadoService.getCatalogs({ params: "'NOM_REGION'" }) as any

      this.selectRegion = response.data["NOM_REGION"];
      console.log(this.selectRegion);
      console.log("selectAcumula", this.selectAcumula);


    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.info(err.error?.message, 'Error cargando Catalogos');

    }
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
  metodoGlobal(evento: any) {
    let dataPresentar = {
      mensaje: "¿Esta seguro de realizar esta accion?.",
      titulo: "Pregunta",
    };

    switch (evento.items.boton.texto) {
      case "GUARDAR":
        const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar);
        dialogRef1.result.then((res) => {
          //No:true; SI:false
          if (res.valor) {
            this.guardar();
          }
        });
        break;

      case "ANULAR DECIMO CUARTO":
        const dialogRef2 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar);
        dialogRef2.result.then((res) => {
          //No:true; SI:false
          if (res.valor) {
            this.anularPeriodoRol();
          }
        });
        break;
      case "PROCESAR":
        this.procesarDecimoCuarto();
        break;
      case "CONSULTAR":
        //this.obtenerRolDetalle();
        if(this.por_fecha){
          this.getDataDecimoCuartoPorFecha();
        }else{
          this.getDataDecimoCuarto();
        }
        break;

      case "APROBAR":
        const dialogRef3 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar);
        dialogRef3.result.then((res) => {
          if (res.valor) {
            this.aprobarDecimoCuarto();
          }
        });
        break;
      case "IMPRIMIR":
        this.geenerarReporteDecimo()
        break;

      case "EXCEL":
      if(this.por_fecha){
        this.btnExportExcelPorFecha();
      }else{
        this.btnExportExcel();
      }

        //this.geenerarReporteDecimoExcel()
        break;
        case "GENERAR ORDEN":
          this.GenerarOrden();
          break;
      case "TXT":
        this.generarTxt()
        break;

      default:
        break;
    }
  }


  procesarDecimoCuarto() {

    if (this.decimo_acumula_mensualiza == null) { this.decimo_acumula_mensualiza = 0 }

    if (this.cmb_region == null) { this.cmb_region_temp = "0" } else { this.cmb_region_temp = this.cmb_region }
    if (this.programa == undefined || this.programa == '') { this.fk_programa = 0 }
    if (this.area == null) { this.area = 0 }
    if (this.departamento == null) { this.departamento = 0 }
    this.lcargando.ctlSpinner(true);
    let year;


    let rango = this.selectRegion.find(item => item.valor === this.cmb_region);
    console.log("rango del seleccionado", rango);
    year = this.select_anio;
    let mes = parseInt(rango.descripcion);//12;
    let Desde = (year - 1) + "0" + rango.descripcion //"12"
    let Hasta = year + "0" + (parseInt(rango.descripcion) - 1).toString(); //"11"

    this.admDecimoCuartoService.procesarDecimoCuarto(1, year, mes, Desde, Hasta, this.fk_programa, this.area, this.departamento, this.decimo_acumula_mensualiza, this.dataUser.id_usuario, this.cmb_region_temp).subscribe(res => {

      console.log(res)
      // this.decimotercero = res;
      // this.obtenerRolDetalle()
      this.getDataDecimoCuarto();
      this.lcargando.ctlSpinner(false);

      this.vmButtons[5].habilitar = false
      this.vmButtons[6].habilitar = false
    });

  }




  handleRowCheck(event, data: any) {
    console.log(event.target.checked)
    console.log(data)
    console.log(this.decimocuarto)
    this.decimocuarto.forEach(e => {
      if (e.cedula == data.cedula) {
        Object.assign(e, { aprobar: event.target.checked })
      }
    });
    let sinAprobar = this.decimocuarto.filter(e => e.aprobar == true && e.num_control =='')
    if(sinAprobar.length > 0){
      this.vmButtons[2].habilitar = false;
    }else{
      this.vmButtons[2].habilitar = true;
    }

    console.log(this.decimocuarto)
  }



  async cargaInicial() {
    try {
      (this as any).mensajeSpinner = "Cargando..."
      const resPeriodos = await this.admDecimoCuartoService.getPeriodos()
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
  listadoBodyGeneral: any = [{ ingresos: [] }, { egresos: [] }, { valor_total_recibir: [] }];
  obtenerEmpleados() {
    this.vmButtons[3].habilitar = true;
    this.lConcepto = "";
    this.fecha_actual = moment(this.toDatePicker).format("YYYY-MM-DD");
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let idGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);
    this.admDecimoCuartoService.getDatosEmpleados({ tipoGrupo: idGrupo, idEmpleado: lIdPersonal.id_personal }).subscribe((res) => {
      this.lstTablaEmpleados = [];
      res["data"].forEach(element => {
        if (this.validaciones.verSiEsNull(element.fechaSalida) == undefined && element.decimo_cuarto == "S") {
          if (element.fechaIngreso != undefined) {
            let anioActual: any = new Date();
            let fechaIngreso: any = element.fechaIngreso.split("-");
            let fechaSalida: any = this.validaciones.verSiEsNull(element.fechaSalida) == undefined ? moment(new Date()).format("YYYY-MM-DD") : element.fechaSalida;
            let diasValida: any = this.restar2Fechas((fechaIngreso[0] + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
            if (diasValida >= 360) {
              element.diasLaborados = 360;
            } else {
              let dias: any = this.restar2Fechas((anioActual.getFullYear() + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
              dias = (dias < 0) ? dias * -1 : dias;
              element.diasLaborados = dias;
            }
            this.lstTablaEmpleados.push(element);
          }

        }
      });

      if (this.lstTablaEmpleados.length == 0) {
     //   this.vmButtons[0].habilitar = false;
        this.vmButtons[3].habilitar = true;
      }

      this.calcularRubros();
      this.lcargando.ctlSpinner(false);
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

    this.admDecimoCuartoService.getDepartamentosPaginate(parameterUrl).subscribe({
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

  obtenerRubros() {
    this.listaDeRubros = [];
    this.lstRubroIngreso = [];
    this.lstRubroEgreso = [];
    this.admDecimoCuartoService.getConceptoInfo({ tipoClase: "Decimo Cuarto" }).subscribe((res: any) => {
      this.listaDeRubros = res.data;
      res.data.forEach((element) => {
        if (element.tipo == "Ingreso") {
          this.lstRubroIngreso.push(element);
        }
        if (element.tipo == "Egreso") {
          this.lstRubroEgreso.push(element);
        }
      });
    }, (error) => { }
    );
  }

  listadoGeneral: any = [
    {
      datos_empleado: [
        { nombre: "#", sise: "1%" },
        { nombre: "NOMBRE", sise: "8%" },
        { nombre: "DEPARTAMENTO", sise: "8%" },
        { nombre: "AFILIADO", sise: "4%" },
        { nombre: "DIAS LABORADOS", sise: "4%" }
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

  handleColumnCheck(event: any, data: any) {
    console.log(event.target.checked)
    console.log(data)
    this.decimocuarto.forEach(e => {

      if (event.target.checked) {
        Object.assign(e, { aprobar: event.target.checked })
      } else {
        if (e.tiene_control != true) {
          Object.assign(e, { aprobar: false })
        }
      }
    });

    let sinAprobar = this.decimocuarto.filter(e => e.aprobar == true && e.num_control =='')
    if(sinAprobar.length > 0){
      this.vmButtons[2].habilitar = false;
    }else{
      this.vmButtons[2].habilitar = true;
    }
    console.log(this.decimocuarto)
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
          let anioActual: any = new Date();
          let fechaIngreso: any = element.fechaIngreso.split("-");
          let fechaSalida: any = this.validaciones.verSiEsNull(element.fechaSalida) == undefined ? moment(new Date()).format("YYYY-MM-DD") : element.fechaSalida;

          let dias: any = 0;
          let diasValida: any = this.restar2Fechas((fechaIngreso[0] + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
          if (diasValida >= 360) {
            dias = 360;
          } else {
            dias = this.restar2Fechas((anioActual.getFullYear() + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
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

    if (this.validaPeriodoFechas()) {
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

    let periodoInicio: any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin: any = moment(this.periodoFin).format("YYYY-MM-DD");

    let validaTermina: boolean = false;
    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    let nombreGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).nombre_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);

    let dataPost: any = {
      tipoGrupo: nombreGrupo,
      idPersonal: lIdPersonal.id_personal,
      tipoModulo: myVarGlobals.fNomDecCuarto,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };

    this.admDecimoCuartoService.getNomRolCab(dataPost).subscribe((datos: any) => {
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
          if (element.datoRubroEgr != undefined) {
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
            tipo_modulo: myVarGlobals.fNomDecCuarto,
            periodo_inicio: periodoInicio,
            periodo_fin: periodoFin,
            ip: this.commonServices.getIpAddress(),
            accion: ("Guardar decimo cuarto de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
            id_controlador: myVarGlobals.fNomDecCuarto,
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

          if (element.datoRubroEgr != undefined) {
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

          this.admDecimoCuartoService.guardarNomRol(datosEnviar).subscribe((datos) => {
            if (this.lstTablaEmpleados.length == indexEmpleado + 1) {
              validaTermina = true;
            }
          }, (error) => {
            this.lcargando.ctlSpinner(false);
          });
        });
      } else {
        this.validaciones.mensajeError("Regristro repetido", "El decimo cuarto del periodo " + (periodoInicio + " al " + periodoFin) + " ya esta registrado");
        this.lcargando.ctlSpinner(false);
      }

      this.timer = setInterval(() => {
        if (validaTermina) {
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeExito("Exito", "Los decimo cuarto se guardaron correctamente");
          //   this.obtenerRolDetalle();
          this.getDataDecimoCuarto();
          clearInterval(this.timer);
        }
      }, 200);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  lstPeriodos: any = [];
  timer: any;
  obtenerRolDetalle() {
    this.getInfoBank();
    this.lConcepto = "";
    this.fecha_actual = moment(this.toDatePicker).format("YYYY-MM-DD");
    this.vmButtons[0].habilitar = false;
   // this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.listadoGeneral[0].datos_empleado = [
      { nombre: "#", sise: "1%" },
      { nombre: "NOMBRE", sise: "8%" },
      { nombre: "DEPARTAMENTO", sise: "8%" },
      { nombre: "AFILIADO", sise: "4%" },
      { nombre: "DIAS LABORADOS", sise: "4%" }
    ];

    let periodoInicio: any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin: any = moment(this.periodoFin).format("YYYY-MM-DD");

    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let nombreGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).nombre_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);

    let dataPost: any = {
      tipoGrupo: nombreGrupo,
      idPersonal: lIdPersonal.id_personal,
      tipoModulo: myVarGlobals.fNomDecCuarto,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };

    this.admDecimoCuartoService.getNomRolCab(dataPost).subscribe((datosCab: any) => {
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
        ];
        this.vmButtons[0].habilitar = false;
     //   this.vmButtons[3].habilitar = false;
        let datosPresentar: any = [];
        datosCab.data.forEach((cabecera) => {
          if (moment(cabecera.periodo_inicio).format("YYYY-MM-DD") == periodoInicio && moment(cabecera.periodo_fin).format("YYYY-MM-DD") == periodoFin) {//&& cabecera.decimo_cuarto=="S"
            this.lConcepto = nombreGrupo == "TODOS" ? cabecera.concepto : this.lConcepto + cabecera.concepto + ", ";
            this.fecha_actual = cabecera.fecha_pago;
            if (cabecera.datoRubro == undefined) {
              cabecera.datoRubro = [];
            }
            if (cabecera.datoRubroEgr == undefined) {
              cabecera.datoRubroEgr = [];
            }
            cabecera.detalle_rol.forEach((element, index) => {
              let valores: any = this.validaciones.obtenerTipoRubro(element.id_parametro, this.listaDeRubros);
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

        this.lstTablaEmpleados = [];
        this.lstTablaEmpleados = datosPresentar;

        this.lstTablaEmpleados.forEach(element => {
          let anioActual: any = new Date();
          let fechaIngreso: any = element.fechaIngreso.split("-");
          let fechaSalida: any = this.validaciones.verSiEsNull(element.fechaSalida) == undefined ? moment(new Date()).format("YYYY-MM-DD") : element.fechaSalida;

          let diasValida: any = this.restar2Fechas((fechaIngreso[0] + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
          if (diasValida >= 360) {
            element.diasLaborados = 360;
          } else {
            let dias: any = this.restar2Fechas((anioActual.getFullYear() + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
            dias = (dias < 0) ? dias * -1 : dias;
            element.diasLaborados = dias;
          }

        });

        this.calcularIngresos();
        this.calcularEgresos();
        this.calcularValorNetoRecibir();
        this.calcularTotalesIngresos();
        this.calcularTotalesEgresos();
        this.lcargando.ctlSpinner(false);
        clearInterval(this.timer);

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
  }

  regionSelect: any = "C";
  anularPeriodoRol() {
    if (this.vmButtons[0].habilitar && this.lstTablaEmpleados.length > 0) {
      let periodoInicio: any = moment(this.periodoInicio).format("YYYY-MM-DD");
      let periodoFin: any = moment(this.periodoFin).format("YYYY-MM-DD");
      let anioActual: any = moment(new Date()).format("YYYY-MM-DD");
      let anioAnterior: any = null;
      anioAnterior = moment(this.validaciones.sumarDias(new Date(), -365)).format("YYYY-MM-DD");
      let validafInicio: any = null;
      let validafFin: any = null;

      if (this.regionSelect == "C" || this.regionSelect == "G") {
        validafInicio = new Date(+anioAnterior.split("-")[0], 3 - 1, +"01");
        validafFin = new Date(+anioActual.split("-")[0], 2 - 1, +"28");
        validafInicio = moment(validafInicio).format("YYYY-MM-DD");
        validafFin = moment(validafFin).format("YYYY-MM-DD");
      }

      if (this.regionSelect == "S" || this.regionSelect == "A") {
        validafInicio = new Date(+anioAnterior.split("-")[0], 8 - 1, +"01");
        validafFin = new Date(+anioActual.split("-")[0], 7 - 1, +"31");
        validafInicio = moment(validafInicio).format("YYYY-MM-DD");
        validafFin = moment(validafFin).format("YYYY-MM-DD");
      }

      if (periodoInicio != validafInicio || periodoFin != validafFin) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Este decimo tercero del periodo seleccionado no se puede anular porque no es el correcto o el actual");
        return;
      }

      let enviarData: any = [];
      this.lstTablaEmpleados.forEach((element) => {
        let dataPost: any = {
          id_rol: element.id_rol,
          ip: this.commonServices.getIpAddress(),
          accion: ("Eliminación de decimo cuarto pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
          id_controlador: myVarGlobals.fNomDecCuarto,
          id_banks: element.id_banks,
          secuencia: element.num_doc,
          total: element.total,
          id_prestamo_dets: null
        };
        enviarData.push(dataPost);
      });

      (this as any).mensajeSpinner = "Anulando decimo cuarto...";
      this.lcargando.ctlSpinner(true);
      this.admDecimoCuartoService.deleteRolPago({ datosPost: enviarData }).subscribe((res: any) => {
        this.validaciones.mensajeExito("Exito", "Los decimo cuarto se anularon correctamente");
        this.getDataDecimoCuarto();//  this.obtenerRolDetalle();
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      });

    } else {
      this.validaciones.mensajeAdvertencia("Advertencia", "No puede anular este periodo de decimo cuarto porque no existe o el departamento no existe ningun empleado");
    }
  }

  arrayBanks: any = [];
  getInfoBank() {
    this.admDecimoCuartoService.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
      this.arrayBanks = res["data"];
    }, (error) => { }
    );
  }

  arrayPersonal: any = [];
  selectPersonal: any;
  getPersonal() {
    let idDepartamento: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    this.admDecimoCuartoService.getPersonalInfo({ idDepartamento: idDepartamento }).subscribe((res) => {
      this.arrayPersonal = [];
      let datosPer: any = [];
      res["data"].forEach(element => {
        if (this.validaciones.verSiEsNull(element.fechaSalida) == undefined) {
          let anioActual: any = new Date();
          let fechaIngreso: any = element.fechaIngreso.split("-");
          let fechaSalida: any = this.validaciones.verSiEsNull(element.fechaSalida) == undefined ? moment(new Date()).format("YYYY-MM-DD") : element.fechaSalida;

          let diasValida: any = this.restar2Fechas((fechaIngreso[0] + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
          if (diasValida >= 360) {
            element.diasLaborados = 360;
          } else {
            let dias: any = this.restar2Fechas((anioActual.getFullYear() + "-" + fechaIngreso[1] + "-" + fechaIngreso[2]), fechaSalida);
            dias = (dias < 0) ? dias * -1 : dias;
            element.diasLaborados = dias;
          }
          datosPer.push(element);
        }
      });
      this.arrayPersonal = datosPer;
      this.arrayPersonal.splice(this.arrayPersonal.length + 1, 0, { id_personal: 0, nombres: "TODOS", apellidos: "" });
      this.selectPersonal = 0;
    });
  }

  dataSucursal: any = [];
  getSucursal() {
    this.admDecimoCuartoService.getSucursales().subscribe((res) => {
      console.log(res)
      this.dataSucursal = res["data"].filter((e) => e.id_sucursal == this.dataUser.id_sucursal)[0];
    },
      (error) => { }
    );
  }

  setearValoresPrint() {
    this.imprimirRolComponent.setearValores(this.lstTablaEmpleados, this.dataUser, this.dataSucursal, "DECIMO CUARTO");
  }

  restar2Fechas(fechaInicio: any, fechaFin: any) {
    let lfechaInicio: any = String(fechaInicio).split("-");
    let lfechaFin: any = String(fechaFin).split("-");
    let fechauno = new Date(+lfechaInicio[0], lfechaInicio[1] - 1, +lfechaInicio[2]).getTime();
    let fechados = new Date(+lfechaFin[0], lfechaFin[1] - 1, +lfechaFin[2]).getTime();
    let diff = fechados - fechauno;
    return diff / (1000 * 60 * 60 * 24);
  }

  calcularTotalesSueldo() {
    let resultado: any = 0;
    this.lstTablaEmpleados.forEach(element => {
      resultado = resultado + element.sueldoBase;
    });
    return this.validaciones.roundNumber(Number(resultado), 2);
  }

  periodoInicio: any;
  periodoFin: any;
  validaPeriodoFechas() {
    let resultado: boolean = false;
    let periodoInicio: any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin: any = moment(this.periodoFin).format("YYYY-MM-DD");
    let validafInicio = null;
    let validafFin = null;
    let mensaje = "";
    if (this.regionSelect == "C" || this.regionSelect == "G") {
      // Marzo 1 del año anterior (2020) a Febrero 29 del año del pago (2021)
      validafInicio = new Date(+periodoInicio.split("-")[0], 3 - 1, +"01");
      validafFin = new Date(+periodoFin.split("-")[0], 2 - 1, +"28");
      mensaje = "Debe escoger un período del 01 de marzo del año anterior al 28 de febrero del presente año.";
    }

    if (this.regionSelect == "S" || this.regionSelect == "A") {
      // Sierra y Amazónica el periodo de cálculo empieza desde el 1 de agosto hasta el 31 de julio del siguiente año
      validafInicio = new Date(+periodoInicio.split("-")[0], 8 - 1, +"01");
      validafFin = new Date(+periodoFin.split("-")[0], 7 - 1, +"31");
      mensaje = "Debe escoger un período del 01 de agosto del año anterior al 31 de julio del presente año.";
    }

    if (periodoInicio != moment(validafInicio).format("YYYY-MM-DD") || periodoFin != moment(validafFin).format("YYYY-MM-DD")) {
      resultado = true;
      this.validaciones.mensajeAdvertencia("Advertencia", ("El periodo seleccionado no es el correcto para realizar el pago del decimo tercero. " + mensaje));
    }
    return resultado;
  }


  aprobarDecimoCuarto() {
    let rango = this.selectRegion.find(item => item.valor === this.cmb_region);
    let mes = parseInt(rango.descripcion);
    let empleadosCheck = this.decimocuarto.filter(e => e.aprobar == true)
    console.log(empleadosCheck)
    let data = {
      anio: this.select_anio,
      mes: mes,
      tipo_decimo: 'DECIC',
      empleados: empleadosCheck
    }

    console.log("decimocuarto", data);

    this.lcargando.ctlSpinner(true);
    this.admDecimoCuartoService.aprobarDecimoCuarto(data).subscribe(res => {
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
      this.getDataDecimoCuarto();// this.obtenerRolDetalle()
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  }


  aprobar() {
    let periodoInicio: any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin: any = moment(this.periodoFin).format("YYYY-MM-DD");
    let valida: boolean = false;
    let enviarData: any = [];

    this.lstTablaEmpleados.forEach((element) => {
      if (element.estadoRol == "P") {
        valida = true;
        let dataPost: any = {
          id_rol: element.id_rol,
          ip: this.commonServices.getIpAddress(),
          accion: ("Aprobacion de decimo cuarto de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
          id_controlador: myVarGlobals.fNomDecCuarto,
          estado: "A",
          descripcion: "Decimo Cuarto del " + periodoInicio + " al " + periodoFin,
          id_banks: element.id_banks,
          secuencia: element.num_doc,
          total: element.total,
          id_prestamo_dets: null
        };
        enviarData.push(dataPost);
      }
    });

    if (!valida) {
      this.validaciones.mensajeInfo("Informativo", "No existe informacion a aprobar");
      return;
    };

    (this as any).mensajeSpinner = "Apobando decimo cuarto por favor espere...";
    this.lcargando.ctlSpinner(true);
    this.admDecimoCuartoService.aprobarRolPago({ datosPost: enviarData }).subscribe((res: any) => {
      this.validaciones.mensajeExito("Exito", "Los decimo cuarto se aprobaron correctamente");
      this.obtenerRolDetalle();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
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


  getDataDecimoCuarto() {

    console.log(this.decimo_acumula_mensualiza)
    if (this.decimo_acumula_mensualiza == null) { this.decimo_acumula_mensualiza = 0 }
    if (this.cmb_region == null) { this.cmb_region_temp = "0" } else { this.cmb_region_temp = this.cmb_region }
    if (this.programa == undefined || this.programa == '') { this.fk_programa = 0 }
    if (this.area == null) { this.area = 0 }
    if (this.departamento == null) { this.departamento = 0 }


    this.lcargando.ctlSpinner(true);

    let year;


    let rango = this.selectRegion.find(item => item.valor === this.cmb_region);
    let mes = parseInt(rango.descripcion); //12;
    // if(typeof this.select_anio !== "string"){
    //   year = this.select_anio.getFullYear();
    // }else{
    //   year = this.select_anio;
    // }
    year = this.select_anio;
    let Desde = (year - 1) + "0" + rango.descripcion //+ "12"
    let Hasta = year + "0" + (parseInt(rango.descripcion) - 1).toString(); //+ "11"
    /*   let Desde = (year - 1 )
      let Hasta = year "11" */



    this.admDecimoCuartoService.getDecimoCuarto(1, year, mes, Desde, Hasta, this.fk_programa, this.area, this.departamento, this.decimo_acumula_mensualiza, this.cmb_region_temp).subscribe(res => {
      console.log(res)


      this.decimocuarto = res;
      this.decimocuarto.forEach(e => {
        if (e.num_control != '') {
          Object.assign(e, { aprobar: true, tiene_control: true })
        }
      });


      let totalDiasTrab = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalRetencion = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.retencion), 0)
      let totalDecimos = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)

      this.totalDiasTrab = totalDiasTrab
      this.totalGanado = totalGanado
      this.totalDevengado = totalDevengado
     this.totalRetencion = totalRetencion
      this.totalDecimos = totalDecimos




      let sinAprobar = this.decimocuarto.filter(e => e.aprobar == true && e.num_control =='')
      if(sinAprobar.length > 0){
        this.vmButtons[2].habilitar = false;
      }else{
        this.vmButtons[2].habilitar = true;
      }

      //si hay aprobados sin orden de pago habilito el boton generar orden de pago
      let aprobados = this.decimocuarto.filter(e => e.tiene_control == true && e.num_orden_pago =='')
      if(aprobados.length > 0){
        this.vmButtons[3].habilitar = false;
      }





      this.lcargando.ctlSpinner(false);
      /*  this.vmButtons[0].habilitar = false
       this.vmButtons[1].habilitar = false*/
    //  this.vmButtons[2].habilitar = true
    //  this.vmButtons[3].habilitar = true
    this.vmButtons[4].habilitar = true
     // this.vmButtons[5].habilitar = true
     // this.vmButtons[6].habilitar = true
     // this.vmButtons[7].habilitar = false
    });

    /*

        if(this.decimo_acumula_mensualiza == null){this.decimo_acumula_mensualiza = 0 }
        if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
        if(this.area==null) { this.area=0 }
        if(this.departamento==null) { this.departamento=0 }

        this.lcargando.ctlSpinner(true);
        let year;
        let mes = 12;

        // if(typeof this.select_anio !== "string"){
        //   year = this.select_anio;
        // }else{
        //   year = this.select_anio;
        // }
        year = this.select_anio;

        let Desde = (year - 1 ) + "03"
        let Hasta = year + "02"



        this.admDecimoCuartoService.getDecimoCuarto(1,year, mes, Desde, Hasta,this.fk_programa,this.area, this.ngDepartamentSelect,this.decimo_acumula_mensualiza).subscribe(res => {
          console.log(res);

          this.decimocuarto = res;
          if(this.decimocuarto.length > 0){

            this.vmButtons[0].habilitar = false
            this.vmButtons[1].habilitar = false
            this.vmButtons[2].habilitar = false
            this.vmButtons[4].habilitar = false
            this.vmButtons[5].habilitar = false
          }

          this.lcargando.ctlSpinner(false);


        }); */
  }

  getDataDecimoCuartoPorFecha(){
    console.log(this.decimo_acumula_mensualiza)
    if (this.decimo_acumula_mensualiza == null) { this.decimo_acumula_mensualiza = 0 }
    if (this.cmb_region == null) { this.cmb_region_temp = "0" } else { this.cmb_region_temp = this.cmb_region }
    if (this.programa == undefined || this.programa == '') { this.fk_programa = 0 }
    if (this.area == null) { this.area = 0 }
    if (this.departamento == null) { this.departamento = 0 }


    this.lcargando.ctlSpinner(true);

    let year;
    year = this.select_anio;
    let mes = Number(moment(this.fecha_desde).format("MM"));
    year = Number(moment(this.fecha_desde).format("YYYY"));

    let yearHasta;
    let mesHasta = Number(moment(this.fecha_hasta).format("MM"));
    yearHasta = Number(moment(this.fecha_hasta).format("YYYY"));

    let Desde = String(year*100+mes)
    let Hasta = String(yearHasta*100+mesHasta)

    this.admDecimoCuartoService.getDecimoCuartoPorFecha(1, year, mes, Desde, Hasta, this.fk_programa, this.area, this.departamento, this.decimo_acumula_mensualiza, this.cmb_region_temp).subscribe(res => {
      console.log(res)


      this.decimocuarto = res;
      this.decimocuarto.forEach(e => {
        if (e.num_control != '') {
          Object.assign(e, { aprobar: true, tiene_control: true })
        }
      });

      let totalDiasTrab = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalRetencion = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.retencion), 0)
      let totalDecimos = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)

      this.totalDiasTrab = totalDiasTrab
      this.totalGanado = totalGanado
      this.totalDevengado = totalDevengado
      this.totalRetencion = totalRetencion
      this.totalDecimos = totalDecimos

      let sinAprobar = this.decimocuarto.filter(e => e.aprobar == true && e.num_control =='')
      if(sinAprobar.length > 0){
        this.vmButtons[2].habilitar = false;
      }else{
        this.vmButtons[2].habilitar = true;
      }

      //si hay aprobados sin orden de pago habilito el boton generar orden de pago
      let aprobados = this.decimocuarto.filter(e => e.tiene_control == true && e.num_orden_pago =='')
      if(aprobados.length > 0){
        this.vmButtons[3].habilitar = false;
      }

    this.lcargando.ctlSpinner(false);
    this.vmButtons[4].habilitar = true

    });


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
  getLatest() {
    this.lcargando.ctlSpinner(true);
    let data = {

      tipo_decimo: 'DECIC',

    }
    let respuesta;
    this.admDecimoCuartoService.getLatest(data).subscribe(
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
    this.lcargando.ctlSpinner(true);

    let data = {

      tipo_decimo: 'DECIC',
      id: this.lastRecord
    }
    let respuesta;
    this.admDecimoCuartoService.getNumControl(data).subscribe(
      res => {
        console.log("aaaaaaaaaaaaaaaaaa", res)
        respuesta = res;
        this.decimocuarto = [];

        if (respuesta.data.num_documento) {
          this.num_control = respuesta.data.num_documento

          this.getPorNoControl();
        } else {

          this.lcargando.ctlSpinner(false)
          Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
        }
      });
  }



  geenerarReporteDecimo() {
    let year;

    // if(typeof this.select_anio !== "string"){
    //   year = this.select_anio.getFullYear();
    // }else{
    //   year = this.select_anio;
    // }
    year = this.select_anio;
    let rango = this.selectRegion.find(item => item.valor === this.cmb_region);
    let mes = parseInt(rango.descripcion);//= 12;

    // if(typeof this.select_anio !== "string"){
    //   year = this.select_anio.getFullYear();
    // }else{
    //   year = this.select_anio;
    // }



    let Desde = (year - 1) + "0" + rango.descripcion //+ "03"
    let Hasta = year + "0" + (parseInt(rango.descripcion) - 1).toString(); //+ "02"

    window.open(environment.ReportingUrl + "rpt_decimo_cuarto.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&Hasta=" + Hasta + "&desde=" + Desde + "&anio=" + year + "&mes=" + mes, '_blank')

    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_decimo_tercero.html?Hasta=202311&mes=1&Desde=202212&anio=2023

  }

  geenerarReporteDecimoExcel() {

    let rango = this.selectRegion.find(item => item.valor === this.cmb_region);
    let year;
    let mes = parseInt(rango.descripcion);//12;

    // if(typeof this.select_anio !== "string"){
    //   year = this.select_anio.getFullYear();
    // }else{
    //   year = this.select_anio;
    // }
    year = this.select_anio;
    let Desde = (year - 1) + "0" + rango.descripcion //+ "03"
    let Hasta = year + "0" + (parseInt(rango.descripcion) - 1).toString(); //+ "02"

    window.open(environment.ReportingUrl + "rpt_decimo_cuarto.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&Hasta=" + Hasta + "&desde=" + Desde + "&anio=" + year + "&mes=" + mes, '_blank')

    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_decimo_tercero.html?Hasta=202311&mes=1&Desde=202212&anio=2023

  }


  generarTxt() {
    // armar array con cabeceras
    // this.downloadFile(
    //   this.decimocuarto,
    //   'DecimoCuarto',
    //   ['nombres', 'porpagar', 'pagado', 'valor_pagar', 'nromesesprovision', 'periodoinicial', 'periodofinal']
    // )
    this.decimocuarto.forEach(e => {
      Object.assign(e, {
        apellidos: e.primer_apellido + ' ' + e?.segundo_apellido,
        nombres: e.primer_nombre + ' ' + e?.segundo_nombre,

      });

      // if(e.fecha_jubilacion != '' || e.fecha_jubilacion != null){
      //   Object.assign(e, {
      //     fecha_jubilacion: moment(e.fecha_jubilacion).format('YYYY-MM-DD') ,
      //   });
      // }
    })

    this.downloadFileCsv(
      this.decimocuarto,
      'DecimoCuarto',
      [
        'cedula',
        'nombres',
        'apellidos',
        'genero',
        'ocupacion',
        'dias_trabajados',
        'tipo_deposito',
        'jornada_parcial_permanente',
        'horas_jornada_parcial_permanente',
        'dicapacidad',
        'fecha_jubilacion',
        'retencion',
        'mensualiza_decimo',
        //  'pagado',
        //  'porpagar',
        //  'nromesesprovision',
        //  'periodoinicial',
        //  'periodofinal'
      ]
    )

  }


  //   downloadFileCsv(data: any, filename:string,cabecera) {
  //     const replacer = (key, value) => value === null ? '' : value;
  //     //const header = Object.keys(data[0]);
  //     const header = cabecera;
  //     let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(';'));
  //     csv.unshift(header.join(';'));
  //     let csvArray = csv.join('\r\n');
  //     var blob = new Blob([csvArray], {type: 'text/csv' })
  //     FileSaver.saveAs(blob, filename + ".csv");
  // }

  downloadFileCsv(data: any, filename: string, cabecera) {
    const replacer = (key, value) => value === null ? '' : value;

    //const header = Object.keys(data[0]);
    const header = cabecera;
    console.log(header)

    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    if (header[0] == 'cedula') { header[0] = "Cédula (Ejm.:0502366503)" }
    if (header[1] == 'nombres') { header[1] = 'Nombres' }
    if (header[2] == 'apellidos') { header[2] = 'Apellidos' }
    if (header[3] == 'genero') { header[3] = 'Genero (Masculino=M ó Femenino=F)' }
    if (header[4] == 'ocupacion') { header[4] = "Ocupación(codigo iess)" }
    if (header[5] == 'dias_trabajados') { header[5] = 'Días laborados (360 días equivalen a un año)' }
    if (header[6] == 'tipo_deposito') { header[6] = 'Tipo de Depósito(Pago Directo=P,Acreditación en Cuenta=A,Retencion Pago Directo=RP,Retencion Acreditación en Cuenta=RA)' }
    if (header[7] == 'jornada_parcial_permanente') { header[7] = 'Solo si el trabajador posee JORNADA PARCIAL PERMANENTE ponga una X' }
    if (header[8] == 'horas_jornada_parcial_permanente') { header[8] = 'DETERMINE EN HORAS LA JORNADA PARCIAL PERMANENTE SEMANAL ESTIPULADO EN EL CONTRATO' }
    if (header[9] == 'dicapacidad') { header[9] = 'Solo si su trabajador posee algun tipo de discapacidad ponga una X' }
    if (header[10] == 'fecha_jubilacion') { header[10] = 'Fecha de Jubilación' }
    if (header[11] == 'retencion') { header[11] = 'valor retenido' }
    if (header[12] == 'mensualiza_decimo') { header[12] = 'SOLO SI SU TRABAJADOR MENSUALIZA EL PAGO DE LA DECIMOCUARTA REMUNERACIÓN PONGA UNA X' }


    //if(header[6]=='total_ganado'){header[5]='Total_ganado (Ejm.:1000.56)'}
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob(["\uFEFF" + csvArray], { type: 'text/csv; charset=utf-8' })
    FileSaver.saveAs(blob, filename + ".csv");
  }


  downloadFile(data, filename = 'data', cabecera) {
    let csvData = this.ConvertToCSV(data, cabecera);
    console.log(csvData);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.txt');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += '\t' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  btnExportExcel() {

    if (this.cmb_region == null) { this.cmb_region_temp = "0" } else { this.cmb_region_temp = this.cmb_region };

    (this as any).mensajeSpinner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);

    let year;
    year = this.select_anio;
    let rango = this.selectRegion.find(item => item.valor === this.cmb_region);

    let mes = parseInt(rango.descripcion);//12;

    let Desde = (year - 1) + "0" + rango.descripcion //+ "12"
    let Hasta = year + "0" + (parseInt(rango.descripcion) - 1).toString(); //+ "11"

    this.admDecimoCuartoService.getDecimoCuarto(1, year, mes, Desde, Hasta, this.fk_programa, this.area, this.ngDepartamentSelect, this.decimo_acumula_mensualiza, this.cmb_region_temp).subscribe(res => {
      this.decimocuartoExcel = res;

      this.decimocuartoExcel.forEach(e => {
        Object.assign(e, {
          apellidos: e.primer_apellido + ' ' + e?.segundo_apellido,
          nombres: e.primer_nombre + ' ' + e?.segundo_nombre,
          total_ganado: Number(parseFloat(e.total_ganado).toFixed(2)), total_devengado: parseFloat(e.total_devengado), valor_decimo: parseFloat(e.valor_decimo),retencion: parseFloat(e.retencion)
        });
      })
      console.log(this.decimocuartoExcel)
      let totalDiasTrab = this.decimocuartoExcel.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimocuartoExcel.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimocuartoExcel.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalRetencion = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.retencion), 0)
      let totalDecimos = this.decimocuartoExcel.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)

      let lineaTotales = {}

      lineaTotales['dias_trabajados'] = totalDiasTrab;
      lineaTotales['cedula'] = 'TOTAL';
      lineaTotales['total_ganado'] = totalGanado;
      lineaTotales['total_devengado'] = totalDevengado;
      lineaTotales['retencion'] = totalRetencion;
      lineaTotales['valor_decimo'] = totalDecimos;
      this.decimocuartoExcel.push(lineaTotales)
      if (this.decimocuartoExcel.length > 0) {
        let data = {
          title: 'Decimo Cuarto',
          razon_social: 'Gobierno Autonomo Descentralizado',
          razon_comercial: 'Gobierno Autonomo Descentralizado',
          direccion: 'Canton La Libertad',
          fecha_desde: (year - 1) + "-03-01",
          fecha_hasta: year + "-02-30",
          rows: this.decimocuartoExcel
        }
        this.xlsService.exportExcelDecimoCuarto(data, 'Decimo Cuarto')
        this.lcargando.ctlSpinner(false);
      } else {
        this.toastr.info("No hay datos para exportar")
        this.lcargando.ctlSpinner(false);
      }

    }, error => {
      this.toastr.info(error.error.mesagge);
      this.lcargando.ctlSpinner(false);
    });
  }

  btnExportExcelPorFecha(){
    if (this.cmb_region == null) { this.cmb_region_temp = "0" } else { this.cmb_region_temp = this.cmb_region };

    (this as any).mensajeSpinner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);

    // let year;
    // year = this.select_anio;
    // let rango = this.selectRegion.find(item => item.valor === this.cmb_region);

    // let mes = parseInt(rango.descripcion);//12;

    // let Desde = (year - 1) + "0" + rango.descripcion //+ "12"
    // let Hasta = year + "0" + (parseInt(rango.descripcion) - 1).toString(); //+ "11"

    let year;
    year = this.select_anio;
    let mes = Number(moment(this.fecha_desde).format("MM"));
    year = Number(moment(this.fecha_desde).format("YYYY"));

    let yearHasta;
    let mesHasta = Number(moment(this.fecha_hasta).format("MM"));
    yearHasta = Number(moment(this.fecha_hasta).format("YYYY"));
    let Desde = String(year) + String(mes)
    let Hasta = String(yearHasta) + String(mesHasta)


    this.admDecimoCuartoService.getDecimoCuartoPorFecha(1, year, mes, Desde, Hasta, this.fk_programa, this.area, this.ngDepartamentSelect, this.decimo_acumula_mensualiza, this.cmb_region_temp).subscribe(res => {
      this.decimocuartoExcelPorFecha = res;

      this.decimocuartoExcelPorFecha.forEach(e => {
        Object.assign(e, {
          apellidos: e.primer_apellido + ' ' + e?.segundo_apellido,
          nombres: e.primer_nombre + ' ' + e?.segundo_nombre,
          total_ganado: Number(parseFloat(e.total_ganado).toFixed(2)), total_devengado: parseFloat(e.total_devengado), valor_decimo: parseFloat(e.valor_decimo),retencion: parseFloat(e.retencion)
        });
      })
      console.log(this.decimocuartoExcelPorFecha)
      let totalDiasTrab = this.decimocuartoExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
      let totalGanado = this.decimocuartoExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
      let totalDevengado = this.decimocuartoExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
      let totalRetencion = this.decimocuartoExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.retencion), 0)
      let totalDecimos = this.decimocuartoExcelPorFecha.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)

      let lineaTotales = {}

      lineaTotales['dias_trabajados'] = totalDiasTrab;
      lineaTotales['cedula'] = 'TOTAL';
      lineaTotales['total_ganado'] = totalGanado;
      lineaTotales['total_devengado'] = totalDevengado;
      lineaTotales['retencion'] = totalRetencion;
      lineaTotales['valor_decimo'] = totalDecimos;
      this.decimocuartoExcelPorFecha.push(lineaTotales)
      if (this.decimocuartoExcelPorFecha.length > 0) {
        let data = {
          title: 'Decimo Cuarto',
          razon_social: 'Gobierno Autonomo Descentralizado',
          razon_comercial: 'Gobierno Autonomo Descentralizado',
          direccion: 'Canton La Libertad',
          fecha_desde: this.fecha_desde,
          fecha_hasta: this.fecha_hasta,
          rows: this.decimocuartoExcelPorFecha
        }
        this.xlsService.exportExcelDecimoCuarto(data, 'Decimo Cuarto')
        this.lcargando.ctlSpinner(false);
      } else {
        this.toastr.info("No hay datos para exportar")
        this.lcargando.ctlSpinner(false);
      }

    }, error => {
      this.toastr.info(error.error.mesagge);
      this.lcargando.ctlSpinner(false);
    });
  }
  modalPrograma() {
    let modal = this.modalService.open(ModalProgramaComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  cargarAreas() {
    (this as any).mensajeSpinner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      fk_programa: this.fk_programa
    }

    this.admDecimoCuartoService.getAreas(data).subscribe(
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
    (this as any).mensajeSpinner = "Cargando listado de Departamentos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_area: this.area
    }

    this.admDecimoCuartoService.getDepartamentos(data).subscribe(
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

  GenerarOrden(){
    let empleadosCheck= this.decimocuarto.filter(e => e.tiene_control==true)
    let rango = this.selectRegion.find(item => item.valor === this.cmb_region);
    let mes = parseInt(rango.descripcion);
    console.log(empleadosCheck)
    let data = {
      anio: this.select_anio,
      mes: mes,
      tipo_decimo: 'DECIC',
      empleados: empleadosCheck
    }
    this.lcargando.ctlSpinner(true);
    this.admDecimoCuartoService.generarOrdenesPago(data).subscribe(res => {
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
   // this.obtenerRolDetalle()
    this.getDataDecimoCuarto()
    },error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  }
  getPorNoControl() {


    (this as any).mensajeSpinner = "Buscando";
    this.lcargando.ctlSpinner(true);

    let data = {
      num_control: this.num_control
    }
    this.admDecimoCuartoService.consultaNumControl(data).subscribe(
      (result: any) => {
        console.log(result)

        this.decimocuarto = result;
        this.decimocuarto.forEach(e => {

          if (e.num_control != '') {
            Object.assign(e, { aprobar: true, tiene_control: true })
          }
        });

        let totalDiasTrab = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
        let totalGanado = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
        let totalDevengado = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
        let totalRetencion = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.retencion), 0)
        let totalDecimos = this.decimocuarto.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)

        this.totalDiasTrab = totalDiasTrab
        this.totalGanado = totalGanado
        this.totalDevengado = totalDevengado
        this.totalRetencion = totalRetencion
        this.totalDecimos = totalDecimos

        this.lcargando.ctlSpinner(false);

        //si trae datos de empleados con decimo habilito el boton aprobar
        let sinAprobar = this.decimocuarto.filter(e => e.aprobar == true && e.num_control == '')
        if (sinAprobar.length > 0) {
          this.vmButtons[2].habilitar = false;
        } else {
          this.vmButtons[2].habilitar = true;
        }

        //si hay aprobados sin orden de pago habilito el boton generar orden de pago
        let aprobados = this.decimocuarto.filter(e => e.tiene_control == true && e.num_orden_pago == '')
        if (aprobados.length > 0) {
        //  this.vmButtons[3].habilitar = false;
        }

        this.vmButtons[6].habilitar = false
        this.vmButtons[7].habilitar = false

      })
  }

  porFecha(event: any){
    console.log(event.target.checked)
    if(event.target.checked){
      this.decimocuarto = []
      this.vmButtons[0].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;

    }

  }



}
