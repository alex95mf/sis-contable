import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { BenefGastosPersonalesService } from "./benef-gastos-personales.service";
import * as myVarGlobals from "../../../../global";
import { ToastrService } from "ngx-toastr";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GlobalTableComponent } from "src/app/view/commons/modals/global-table/global-table.component";
import { ModalGlobalTableComponent } from "src/app/view/commons/modals/modal-global-table/modal-global-table.component";
import { CommonVarService } from "src/app/services/common-var.services";
import {
  FormBuilder,
  FormGroup,
  NgModel,
  // UntypedFormBuilder,
  // UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { PersonalResponseI } from "src/app/models/responsePersonal.interface";
import { Subject } from "rxjs";
import { GeneralService } from "src/app/services/general.service";
import { CatalogoNominaResponseI } from "src/app/models/responseCatalogoNomina.interfase";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { DatatableLanguage } from "src/app/models/es-ES";
import Botonera from "src/app/models/IBotonera";
import { ExcelService } from "src/app/services/excel.service";
import { MatTabChangeEvent } from "@angular/material/tabs";
import * as moment from "moment";
import { EmpleadosComponent } from "./empleados/empleados.component";


@Component({
standalone: false,
  selector: "app-gastos-personales",
  templateUrl: "./gastos-personales.component.html",
  styleUrls: ["./gastos-personales.component.scss"],
})
export class GastosPersonalesComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  @ViewChild("vChValorReal") inputValorReal; // accessing the reference element
  @ViewChild("vChValorProyectado") inputValorProyectado; // accessing the reference element
  // @ViewChildren('vChValorProyectado') childrenFlagInfo: QueryList<NgModel>;

  @ViewChild("nameNumDocumento") inputNumDocumento; // accessing the reference element
  @ViewChild("btnBuscarPersonal") inputBtnBuscarPersona; // accessing the reference element
  @ViewChild("namePeriodo") inputPeriodo; // accessing the reference element


  public isDtInit: boolean = false;

  isDisabled = true;

  today: string;

  validarRegistroTabla: number;
  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  gastospersonales: any = [];
  vmButtons: Botonera[] = [];

  empleado: any = {
    discapacitado: false,
    tercera_edad: false,
  }

  impuestoRenta: any = {
    // Ingresos
    sueldo: 0,
    sueldo_anual: 0,
    horas_extra: 0,
    horas_extra_mensual: 0,
    bonificaciones: 0,
    comisiones: 0,
    comisiones_mensual: 0,
    utilidades: 0,
    este_empleador: 0,
    otro_empleador: 0,
    total_ingresos: 0,
    // Egresos
    iess_personal: 0,
    iess_otro_empleador: 0,
    otros_gastos: 0,
    total_egresos: 0,
    deducibles: 0,
    // Rebajas
    num_cargas_familiares: 0,
    maxGastoPersonal: 0,
    rebaja_discapacidad: 0,
    rebaja_tercera_edad: 0,
    retenciones: 0,
    rebaja_gastos_personales: 0,
    // Totales
    base_imponible: 0,
    impuesto_causado: 0,
    impuesto_renta_anual: 0,
    impuesto_renta_mensual: 0,
  }
  cmb_discapacitado: any[] = [
    { value: true, label: 'SI' },
    { value: false, label: 'NO' },
  ]
  cmb_tercera_edad: any[] = [
    { value: true, label: 'SI' },
    { value: false, label: 'NO' },
  ]
  roDiscapacidad: boolean = true
  roTerceraEdad: boolean = true
  formReadonly: boolean = true

  fomulario_gasto_personal: FormGroup;
  gastosPersonalesForm: any = {};
  cat_anio: any;
  cc_value_anio: any;

  dtOptions: any = {};
  dtTrigger = new Subject();
  dataGastosPersonales: any;
  periodo_id_cc: BigInteger | String | number;
  dataCatalogNomina: CatalogoNominaResponseI = {
    id_catalogos_nomina: 0,
    noc_nombre: "",
    noc_descripcion: "",
    noc_keyword: "",
    noc_num_casillero: 0,
    parent_id: 0,
    valor_tope: "",
    valor_proyectado: parseFloat("0.00").toFixed(2),
    valor_real: parseFloat("0.00").toFixed(2),
  };
  sumGastos: any = {
    proyectado: 0,
    real: 0,
  }

  dataImpuestoRenta: Array<any> = []
  dataImpuestoRentaMasivo: any[] = [];

  valor_proyectado: any;
  valor_real: any;
  @Input() id_personal: any;

  actions: any = { btnGuardar: true, btnMod: false };
  processing: any = false;


  // Tabla de Impuesto a la Renta
  displayedColumns: string[] = ['anual', 'mensual', 'acumulado', 'pendiente', 'motivo'];

  filter: any
  cmb_periodo: any[] = []

  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,
    private generalService: GeneralService,
    private toastr: ToastrService,
    private gastospersonalesService: BenefGastosPersonalesService,
    private commonVarSrv: CommonVarService,
    private fb: FormBuilder,
    private excelService: ExcelService,
  ) {
    // this.fomulario_gasto_personal = this.fb.group({
    //   lgNumDocumento: [],
    //   lgNombreCompleto: [],
    //   lgNumPerido: [],
    //   namePeriodo: ["", [Validators.required]],
    //   num_documento: ["", [Validators.required]],

    // });

    this.catalogosNomina("GPP");

   // this.cc_value_anio = "XXXX";

    // this.dataCatalogNomina.valor_proyectado = "0.00";
    // this.dataCatalogNomina.valor_real = "0.00";

    this.commonVarSrv.setPersonalNom.asObservable().subscribe({
      next: async (res: any) => {
        console.log(res);

        this.cancel()
        this.empleado = res
        this.formReadonly = false



        this.gastosPersonalesForm.num_documento = res.emp_identificacion;
        this.gastosPersonalesForm.nombre_completo = res.emp_full_nombre;
        // console.log(res.gastos_personales.length);

        this.validarRegistroTabla = res.gastos_personales.length;

        // this.inputNumDocumento.nativeElement.value = res.emp_identificacion;
        this.id_personal = res.id_empleado;

        //this.fomulario_gasto_personal.get("num_documento").setValue(res.emp_identificacion);

        if (res.gastos_personales.length > 0) {
          // Empleado ya presenta Gastos Personales
          // this.actions = { btnGuardar: true, btnMod: false };
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
        } else {
          // this.actions = { btnGuardar: true, btnMod: false };
          this.vmButtons[0].habilitar = false;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
        }

        this.dataGastosPersonales = res.gastos_personales;
        this.isDisabled = false;

        console.log(this.dataGastosPersonales)

        Object.assign(this.impuestoRenta, {
          sueldo: res.sueldo.sld_salario_minimo,
          sueldo_anual: res.sueldo.sld_salario_minimo * 12,
          num_cargas_familiares: res.familiares_count,
        })

        this.lcargando.ctlSpinner(true)
        try {
          // Consultar IRbase_imponibl
          (this as any).mensajeSpinner = 'Cargando datos de Impuesto a la Renta'
          let response = await this.gastospersonalesService.getImpuestoRenta({empleado: res.emp_identificacion})
          console.log(response)

          if (response.length > 0) {
            let data = response.find((element: any) => element.estado == 'A')
            console.log(data)
            // Convetir null en 0
            Object.assign(data, {
              acumulado: data.acumulado ?? 0,
              base_imponible: data.base_imponible ?? 0,
              bonificaciones: data.bonificaciones ?? 0,
              comisiones: data.comisiones ?? 0,
              comisiones_mensual: data.comisiones_mensual ?? 0,
              deducibles: data.deducibles ?? 0,
              horas_extra: data.horas_extra ?? 0,
              horas_extra_mensual: data.horas_extra_mensual ?? 0,
              iess_otro_empleador: data.iess_otro_empleador ?? 0,
              iess_personal: data.iess_personal ?? 0,
              impuesto_causado: data.impuesto_causado ?? 0,
              impuesto_renta_anual: data.impuesto_renta_anual ?? 0,
              impuesto_renta_anual_x_cobrar: data.impuesto_renta_anual_x_cobrar ?? 0,
              impuesto_renta_mensual: data.impuesto_renta_mensual ?? 0,
              este_empleador: data.ingresos ?? 0,
              num_cargas_familiares: data.num_cargas_familiares == null ? res.familiares_count : data.num_cargas_familiares,
              otro_empleador: data.otro_empleador ?? 0,
              otros_gastos: data.otros_gastos ?? 0,
              tiene_discapacidad: data.tiene_discapacidad == null ? false :  data.tiene_discapacidad,
              rebaja_discapacidad: data.rebaja_discapacidad == null ? 0 : data.rebaja_discapacidad,
              rebaja_gastos_personales: data.rebaja_gastos_personales ?? 0,
              tiene_tercera_edad: data.tiene_tercera_edad == null ? false :  data.tiene_tercera_edad,
              rebaja_tercera_edad: data.rebaja_tercera_edad == null ? 0 : data.rebaja_tercera_edad,
              retenciones: data.retenciones ?? 0,
              sueldo: data.sueldo == null ? data.empleado?.sueldo?.sld_salario_minimo : data.sueldo,
              sueldo_anual: data.sueldo_anual == null ? data.empleado?.sueldo?.sld_salario_minimo * 12 : data.sueldo_anual,
              total_egresos: data.total_egresos ?? 0,
              total_ingresos: data.total_ingresos ?? 0,
              utilidades: data.utilidades ?? 0,
            })
            if (data) { this.impuestoRenta = data }

            //this.empleado.discapacitado = data.tiene_discapacidad

            console.log(this.impuestoRenta)

            this.roDiscapacidad = !res.discapacitado
            this.roTerceraEdad = !res.tercera_edad

            this.empleado.discapacitado = data.tiene_discapacidad
            this.empleado.tercera_edad = data.tiene_tercera_edad

            this.dataImpuestoRenta = response

            //Consultar otros Valores (Iniciales)
            console.log(data.num_cargas_familiares)

              await this.getMaxGastoPersonal(data.num_cargas_familiares ?? 0, this.cc_value_anio)

            if (this.dataImpuestoRenta.length > 0) {
              if (res.discapacitado && data.rebaja_discapacidad == 0) await this.getRebajaDiscapacidad(res.porcentaje_discapacidad ?? 0,  this.cc_value_anio)
              if (res.tercera_edad && data.rebaja_tercera_edad == 0) await this.getRebajaTerceraEdad(this.cc_value_anio)

              // Calcular segun los valores iniciales
              this.valoresCalculables()
            }

            let sumProyectado = (this.dataGastosPersonales as any).reduce((acc: number, curr: any) => acc + curr.gtp_valor_proyectado, 0)
            this.sumGastos.proyectado = sumProyectado

            let sumReal = (this.dataGastosPersonales as any).reduce((acc: number, curr: any) => acc + curr.gtp_valor_real, 0)
            this.sumGastos.real = sumReal
            this.impuestoRenta.deducibles = this.sumGastos.real > 0 ? this.sumGastos.real : this.sumGastos.proyectado

            const factorGastos: number = 0.18;
            let minimo = Math.min(parseFloat(this.impuestoRenta.maxGastoPersonal), parseFloat(this.impuestoRenta.deducibles))
            this.impuestoRenta.rebaja_gastos_personales = minimo * factorGastos

          }else{
            this.valoresCalculables();
            this.handleInputCargas();
          }

          //
          this.vmButtons[4].habilitar = false
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          this.vmButtons[4].habilitar = true
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error cargando Impuesto a la Renta')
        }
      },
    });

    this.dtOptions = {
      pagingType: "full_numbers",
      // pageLength: 8,
      search: true,
      paging: true,
      responsive: true,
      // scrollY: "200px",
      scrollCollapse: true,
      language: DatatableLanguage.datatableSpanish,
      // language: {
      //   url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      // },
    };
    (this as any).mensajeSpinner = "Cargando";

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.today = new Date().toISOString().split("T")[0];
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsGastosPersonales",
        paramAccion: "0",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsGastosPersonales",
        paramAccion: "0",
        boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      // {
      //   orig: "btnsGastosPersonales",
      //   paramAccion: "0",
      //   boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn btn-warning boton btn-sm",
      //   habilitar: true,
      //   imprimir: false,
      // },
      { orig: 'btnsGastosPersonales', paramAccion: '0', boton: { icon: 'fas fa-check', texto: 'APROBAR'}, clase: 'btn btn-sm btn-light', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      {
        orig: 'btnsGastosPersonales',
        paramAccion: '0',
        boton: { icon: 'fas fa-file-excel', texto: 'EXCEL' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: "btnsGastosPersonales",
        paramAccion: "0",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: 'btnsGastosPersonales',
        paramAccion: '1',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsGastosPersonales',
        paramAccion: '1',
        boton: { icon: 'fas fa-eraser', texto: 'LMPIAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsGastosPersonales',
        paramAccion: '1',
        boton: { icon: 'fas fa-file-excel', texto: 'EXCEL' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ];

    this.filter= {
      periodo: moment(new Date()).format('YYYY'),
      mes: null,
    }

    this.dinamicoBotones(0)
    this.validaPermisos();
    setTimeout(async () => {
      await this.cargaInicial()
    }, 0)
  }

  dinamicoBotones(idx: number) {
    this.vmButtons.forEach((boton: Botonera) => boton.showimg = boton.paramAccion === idx.toString());

  }

  validaPermisos() {
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fGastosPersonales,
      id_rol: id_rol,
    };

    this.commonService.getPermisionsGlobas(data).subscribe(
      (res) => {
        this.permisions = res["data"];

        this.permiso_ver = this.permisions[0].abrir;

        if (this.permiso_ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Balance comprobación"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message);
      }
    );
  }

  async cargaInicial() {
    try {
      (this as any).mensajeSpinner = "Carga Inicial"
      const resPeriodos = await this.gastospersonalesService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos

    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  catalogosNomina(parameter) {
    this.generalService
      .getCatalogoNominaKeyWork(parameter)
      // .subscribe((res: CatalogoNominaResponseI) => {
      .subscribe((res: any /* : CatalogoNominaResponseI */) => {
        this.dataCatalogNomina = res.map(function callback(
          elementoActual,
          index
        ) {
          elementoActual.valor_proyectado = parseFloat("0.00").toFixed(2);
          elementoActual.valor_real = parseFloat("0.00").toFixed(2);

          return elementoActual; /* Elemento devuelto de nuevaLista */
        });
      });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "0GUARDAR":
        this.validaSaveGastosPersonales();
        break;
      case "0MODIFICAR":
        this.validaUpdateGastosPersonales();
        break;
      case "0ELIMINAR":
        this.validaDeleteGastosPersonales();
        break;
      case "0APROBAR":
        this.aprobarImpuestoRenta();
        break;

      case "IMPRIMIR":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-print' ).trigger();
        break;
      case "PDF":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-pdf' ).trigger();
        break;
      case "0EXCEL":
        this.exportarExcel();
        break;
      case "1CONSULTAR":
        this.gastospersonalesService.consultarMasivo$.emit()
        break;
      case "1LIMPIAR":
        this.gastospersonalesService.limpiarMasivo$.emit()
        break;
      case "1EXCEL":
        this.gastospersonalesService.exportMasivo$.emit()
        break;
      case "LIMPIAR":
        //this.informaciondtlimpiar();
        break;
      case "0CANCELAR":
        this.cancel();
        break;
    }
  }

  async validaSaveGastosPersonales() {
    //if (this.fomulario_gasto_personal.valid === true) {

      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar gasto personal?",
            "SAVE_GASTO_PERSONAL"
          );
          return;
        }
      });

    //}

    console.log("falta validar");
    return;
  }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if(this.gastosPersonalesForm.num_documento == '' || this.gastosPersonalesForm.num_documento == undefined){
        this.toastr.warning('Debe seleccionar un empleado');
        flag = true;
      }
      if(this.impuestoRenta.total_ingresos <= 0){
        this.toastr.warning('El total de ingresos no puede ser 0');
        flag = true;
      }
      if(this.impuestoRenta.total_egresos <= 0){
        this.toastr.warning('El total de egresos no puede ser 0');
        flag = true;
      }
      if (this.sumGastos.proyectado > this.impuestoRenta.maxGastoPersonal) {
        this.toastr.warning(`El total de gastos proyectados de ($ ${this.commonService.formatNumberDos(this.sumGastos.proyectado)}) no pueden exceder al valor máximo de gastos personales de $ ${this.commonService.formatNumberDos(this.impuestoRenta.maxGastoPersonal)}`);
        flag = true;
      }

      !flag ? resolve(true) : resolve(false);
    })
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      this.processing = false;
      if (result.value) {
        if (action == "SAVE_GASTO_PERSONAL") {
          this.saveGastoPersonal();
        } else if (action == "UPDATED_GASTO_PERSONAL") {
          this.updatedGastoPersonal();
        } else if (action == "DELETE_GASTO_PERSONAL") {
          this.deleteGastoPersonal();
        }
      }
    });
  }

  async aprobarImpuestoRenta() {
    let result = await Swal.fire({
      titleText: 'Aprobar Impuesto a la Renta',
      text: 'Esta seguro/a de aprobar los valores ingresados?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aprobar',
    })

    if (result.isConfirmed) {
      // Copiar nom_gastos_personales_cab a nom_empleado_impuestorenta
      Swal.fire('Registro aprobado correctamente', '', 'success').then(() => {})
    }
  }

  async exportarExcel() {

    if(this.dataImpuestoRenta.length > 0){
      // Confirmar accion
      let result = await Swal.fire({
        titleText: 'Exportar Registros de Impuesto a la Renta',
        text: 'Esta seguro/a de realizar esta accion?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Exportar',
      })

      if (result.isConfirmed) {
        let excelData = []
        this.dataImpuestoRenta.forEach((item: any) => {
          let o = {
            Fecha: item.fecha_registro,
            Anual: item.impuesto_renta_anual,
            Mensual: item.impuesto_renta_mensual,
            Acumulado: item.acumulado,
            Pendiente: item.impuesto_renta_anual_x_cobrar,
            Observacion: item.motivo,
            Estado: item.estado
          }
          excelData.push(o)
        })
        this.excelService.exportAsExcelFile(excelData, `ImpuestoRenta_${this.gastosPersonalesForm.num_documento}`)
      }
    }else{
      this.toastr.info('No existen valores para exportar')
    }

  }

  async handleInputCargas() {
    this.lcargando.ctlSpinner(true)
    (this as any).mensajeSpinner = 'Consultando Valor por Cargas Familiares'
    await this.getMaxGastoPersonal(this.impuestoRenta.num_cargas_familiares, this.cc_value_anio)
    this.lcargando.ctlSpinner(false)
    this.calcularBase()
  }

  async consultarTablaDiscapacidad() {
    this.lcargando.ctlSpinner(true)
    (this as any).mensajeSpinner = 'Consultando Valor por Discapacidad'
    await this.getRebajaDiscapacidad(this.empleado.porcentaje_discapacidad, this.cc_value_anio)
    this.lcargando.ctlSpinner(false)
    this.calcularBase()
  }

  async getMaxGastoPersonal(cargas: number, periodo: any) {
    try {
      let data = {
        cargas: cargas,
        periodo: periodo
      }
      (this as any).mensajeSpinner = 'Obteniendo Tope de Gastos Personales'
      let response = await this.gastospersonalesService.getMaxGastosPersonales({data})
      console.log(response)
      let maxGastoPersonal =response.valor == undefined ? 0 :  response.valor;
      Object.assign(this.impuestoRenta, { maxGastoPersonal })
      //
    } catch (err) {
      console.log(err)
      // this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async getRebajaDiscapacidad(porcentaje: number, periodo: any) {
    try {
      let data = {
        porcentaje: porcentaje,
        periodo: periodo
      }
      (this as any).mensajeSpinner = 'Obteniendo Rebaja por Discapacidad'
      let response = await this.gastospersonalesService.getRebajaDiscapacidad({data})
      if(response.valor == undefined){
        this.toastr.info("No existe un valor configurado para ese porcentaje de discapacidad.")
      }
      let rebaja_discapacidad = response.valor == undefined ? 0 :  response.valor;
      Object.assign(this.impuestoRenta, { rebaja_discapacidad })
      //
    } catch (err) {
      console.log(err)
      // this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async getRebajaTerceraEdad(periodo: any) {
    try {
      let data= {
        periodo: periodo
      }
      (this as any).mensajeSpinner = 'Obteniendo Rebaja por Tercera Edad'
      let response = await this.gastospersonalesService.getRebajaTerceraEdad({data})
      console.log(response)
      let rebaja_tercera_edad = response
      console.log(rebaja_tercera_edad)

      Object.assign(this.impuestoRenta, { rebaja_tercera_edad })
    } catch (err) {
      console.log(err)
      // this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  calcularHorasExtra() {
    this.impuestoRenta.horas_extra = parseFloat(this.impuestoRenta.horas_extra_mensual) * 12
    this.valoresCalculables()
  }

  calcularComisiones() {
    this.impuestoRenta.comisiones = parseFloat(this.impuestoRenta.comisiones_mensual) * 12
    this.valoresCalculables()
  }

  valoresCalculables() {
    const factorIess: number = 0.0945;
    const factorGastos: number = 0.18;
    let este_empleador: number = this.impuestoRenta.sueldo_anual + this.impuestoRenta.horas_extra + this.impuestoRenta.bonificaciones + this.impuestoRenta.comisiones + this.impuestoRenta.utilidades;
    let total_ingresos: number = parseFloat(this.impuestoRenta.sueldo_anual) + parseFloat(this.impuestoRenta.horas_extra) + parseFloat(this.impuestoRenta.bonificaciones) + parseFloat(this.impuestoRenta.comisiones) + parseFloat(this.impuestoRenta.utilidades) + parseFloat(this.impuestoRenta.otro_empleador)
    let iess_personal: number = (parseFloat(this.impuestoRenta.sueldo_anual) + parseFloat(this.impuestoRenta.horas_extra) + parseFloat(this.impuestoRenta.bonificaciones ?? 0) + parseFloat(this.impuestoRenta.comisiones ?? 0)) * factorIess
    let iess_otro_empleador: number = parseFloat(this.impuestoRenta.otro_empleador) * factorIess;
    let total_egresos: number = iess_personal + iess_otro_empleador + parseFloat(this.impuestoRenta.otros_gastos)

   // let minimo = Math.min(parseFloat(this.impuestoRenta.maxGastoPersonal), parseFloat(this.impuestoRenta.deducibles))
   // let rebaja_gastos_personales: number = minimo * factorGastos
    let deducibles = this.sumGastos.real > 0 ? this.sumGastos.real : this.sumGastos.proyectado
    this.impuestoRenta.deducibles = deducibles
    let minimo = Math.min(parseFloat(this.impuestoRenta.maxGastoPersonal), parseFloat(deducibles))
    let rebaja_gastos_personales: number = minimo * factorGastos

    Object.assign(this.impuestoRenta, { este_empleador, iess_personal, iess_otro_empleador, total_ingresos, total_egresos, rebaja_gastos_personales })

    this.calcularBase()
  }

  async calcularBase() {
    let base_imponible = parseFloat(this.impuestoRenta.total_ingresos) - parseFloat(this.impuestoRenta.total_egresos) - parseFloat(this.impuestoRenta.rebaja_discapacidad) - parseFloat(this.impuestoRenta.rebaja_tercera_edad)
    console.log(parseFloat(this.impuestoRenta.total_ingresos))
    console.log(parseFloat(this.impuestoRenta.total_egresos))
    console.log(parseFloat(this.impuestoRenta.rebaja_discapacidad))
    console.log(parseFloat(this.impuestoRenta.rebaja_tercera_edad))
    let impuesto_causado: number = 0;
    let impuesto_renta_anual: number = 0;
    let impuesto_renta_mensual: number = 0;
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Obteniendo Impuesto Causado'
      console.log(base_imponible)
      let response = await this.gastospersonalesService.getImpuestoCausado({ base_imponible })
      console.log(response)

      const { desde, valor, porcentaje } = response
      impuesto_causado = ((base_imponible - parseFloat(desde)) * parseFloat(porcentaje)) + parseFloat(valor);
      impuesto_renta_anual = impuesto_causado - parseFloat(this.impuestoRenta.rebaja_gastos_personales) - parseFloat(this.impuestoRenta.retenciones);
      impuesto_renta_mensual = impuesto_renta_anual / 12;

      Object.assign(this.impuestoRenta, { base_imponible, impuesto_causado, impuesto_renta_anual, impuesto_renta_mensual })
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }

  }

  async handleSelectDiscapacidad({value}) {
    this.roDiscapacidad = !value

     if (value) {
      // Obtener Valor por Discapacidad
      this.lcargando.ctlSpinner(true)
      await this.getRebajaDiscapacidad(this.empleado.porcentaje_discapacidad,this.filter.periodo)
      this.lcargando.ctlSpinner(false)
    }
    // else {
    //   this.impuestoRenta.rebaja_tercera_edad = null
    // }
    this.calcularBase()
  }

  async handleSelectTerceraEdad({value}) {
    this.roTerceraEdad = !value

    if (value) {
      // Obtener Valor por Tercera Edad
      this.lcargando.ctlSpinner(true)
      await this.getRebajaTerceraEdad(this.cc_value_anio)
      this.lcargando.ctlSpinner(false)
    } else {
      this.impuestoRenta.rebaja_tercera_edad = 0;
    }
    this.calcularBase()
  }

  async saveGastoPersonal() {

    console.log(this.impuestoRenta)
    if(this.impuestoRenta.rebaja_discapacidad == undefined){this.impuestoRenta.rebaja_discapacidad = 0}
    this.impuestoRenta.tiene_discapacidad = this.empleado.discapacitado;
    this.impuestoRenta.tiene_tercera_edad = this.empleado.tercera_edad;
    let cod_persona = this.id_personal;
    //let cod_period = this.periodo_id_cc;
    let cod_period = this.filter.periodo;
    let anio_input = this.filter.periodo;
    const arraySendPost = [];
    (this.dataCatalogNomina as any).map(function callback(
      elementoActual,
      index
    ) {
      const gastPer = {
        gtp_anio: anio_input,
        id_catalogos_nomina: elementoActual.id_catalogos_nomina,
        id_empleado: cod_persona,
        gtp_valor_tope: elementoActual.valor_tope,
        gtp_valor_proyectado: elementoActual.valor_proyectado,
        gtp_valor_real: elementoActual.valor_real,
        id_periodo: cod_period,
      };
      arraySendPost.push(gastPer);
    });

    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de nuevo gasto personal rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      dataGP: arraySendPost,
      fk_empleado: this.empleado.id_empleado,
      impuestoRenta: this.impuestoRenta,
    };

    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.gastospersonalesService.saveListGastosPersonales(data).subscribe(
      async (res) => {
        // (this.id_aportable_cc = "0"),
        //   (this.id_automatico_cc = "0"),
        //   (this.id_tipo_rubro_cc = "0"),
        //   (this.estado_id_cc = "0"),
        this.toastr.success("Guardado");
        // this.rerender();
        // this.lcargando.ctlSpinner(false);
        // this.cancel();
        try {
          (this as any).mensajeSpinner = 'Actualizando datos'
          let response = await this.gastospersonalesService.getImpuestoRenta({empleado: this.empleado.emp_identificacion})
          this.dataImpuestoRenta = response

          let data = response.find((element: any) => element.estado == 'A')

          Object.assign(data, {
            acumulado: data.acumulado ?? 0,
            base_imponible: data.base_imponible ?? 0,
            bonificaciones: data.bonificaciones ?? 0,
            comisiones: data.comisiones ?? 0,
            comisiones_mensual: data.comisiones_mensual ?? 0,
            deducibles: data.deducibles ?? 0,
            horas_extra: data.horas_extra ?? 0,
            horas_extra_mensual: data.horas_extra_mensual ?? 0,
            iess_otro_empleador: data.iess_otro_empleador ?? 0,
            iess_personal: data.iess_personal ?? 0,
            impuesto_causado: data.impuesto_causado ?? 0,
            impuesto_renta_anual: data.impuesto_renta_anual ?? 0,
            impuesto_renta_anual_x_cobrar: data.impuesto_renta_anual_x_cobrar ?? 0,
            impuesto_renta_mensual: data.impuesto_renta_mensual ?? 0,
            este_empleador: data.ingresos ?? 0,
            num_cargas_familiares: data.num_cargas_familiares ?? 0,
            otro_empleador: data.otro_empleador ?? 0,
            otros_gastos: data.otros_gastos ?? 0,
            rebaja_discapacidad: data.rebaja_discapacidad ?? 0,
            rebaja_gastos_personales: data.rebaja_gastos_personales ?? 0,
            rebaja_tercera_edad: data.rebaja_tercera_edad ?? 0,
            retenciones: data.retenciones ?? 0,
            sueldo: data.sueldo ?? 0,
            sueldo_anual: data.sueldo_anual ?? 0,
            total_egresos: data.total_egresos ?? 0,
            total_ingresos: data.total_ingresos ?? 0,
            utilidades: data.utilidades ?? 0,
          })

          if (data) { this.impuestoRenta = data }

          if(this.cc_value_anio){

          }

          await this.getMaxGastoPersonal(this.empleado.familiares_count ?? 0,  this.cc_value_anio)
          if (this.dataImpuestoRenta.length > 0) {
            if (this.empleado.discapacitado) await this.getRebajaDiscapacidad(this.empleado.porcentaje_discapacidad ?? 0, this.cc_value_anio)
            if (this.empleado.tercera_edad) await this.getRebajaTerceraEdad(this.cc_value_anio)
          }

          this.roDiscapacidad = !this.empleado.discapacitado
          this.roTerceraEdad = !this.empleado.tercera_edad

          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;

          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.warning(err.error?.message)
        }
      },
      (error) => {
        console.log(error)
        this.processing = true;
        this.lcargando.ctlSpinner(false);
        this.toastr.warning(error.error?.message, 'Problema actualizando Gastos Personales');
      }
    );
  }

  async validaUpdateGastosPersonales() {


    let resp = await this.validaDataGlobal().then((respuesta) => {

      if (respuesta) {
        this.confirmSave(
          "Seguro desea actualizar el gastos personales?",
          "UPDATED_GASTO_PERSONAL"
        );
        return;
      }
    });
    // console.log(this.fomulario_gasto_personal.valid)
    // if (this.fomulario_gasto_personal.valid === true) {
    //   this.confirmSave(
    //     "Seguro desea actualizar el gastos personales?",
    //     "UPDATED_GASTO_PERSONAL"
    //   );
    //   return;
    // }

    // console.log("falta validar");
    // return;

    // if (this.permisions.guardar == "0") {
    //   this.toastr.info("Usuario no tiene permiso para guardar");
    // } else {
    //   let resp = await this.validateDataGlobal().then(respuesta => {
    //     if (respuesta) {
    //       this.confirmSave("Seguro desea actualizar la cuenta?", "UPDATED_ACCOUNT");
    //     }
    //   })
    // }
  }

  async updatedGastoPersonal() {
    // console.log(this.areaForm);
    this.impuestoRenta.tiene_discapacidad =  this.empleado.discapacitado
    console.log("update");
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Actualización de gastos personales area rrhh",
      id_controlador: myVarGlobals.fBovedas,

      dataGP: this.dataGastosPersonales,
      fk_empleado: this.empleado.id_empleado,
      impuestoRenta: this.impuestoRenta,
    };
    // this.validaDt = false;
    (this as any).mensajeSpinner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.gastospersonalesService.updateListGastosPersonales(data).subscribe(
      async (res) => {
        console.log(res)
        // this.rerender();
        // this.cancel();
        this.toastr.success("Actualizado" /* res['message'] */);
        // this.lcargando.ctlSpinner(false);
        // this.toastr.success(res['message']);
        try {
          (this as any).mensajeSpinner = 'Actualizando datos'
          let response = await this.gastospersonalesService.getImpuestoRenta({empleado: this.empleado.emp_identificacion})
          this.dataImpuestoRenta = response

          let data = response.find((element: any) => element.estado == 'A')

          Object.assign(data, {
            acumulado: data.acumulado ?? 0,
            base_imponible: data.base_imponible ?? 0,
            bonificaciones: data.bonificaciones ?? 0,
            comisiones: data.comisiones ?? 0,
            comisiones_mensual: data.comisiones_mensual ?? 0,
            deducibles: data.deducibles ?? 0,
            horas_extra: data.horas_extra ?? 0,
            horas_extra_mensual: data.horas_extra_mensual ?? 0,
            iess_otro_empleador: data.iess_otro_empleador ?? 0,
            iess_personal: data.iess_personal ?? 0,
            impuesto_causado: data.impuesto_causado ?? 0,
            impuesto_renta_anual: data.impuesto_renta_anual ?? 0,
            impuesto_renta_anual_x_cobrar: data.impuesto_renta_anual_x_cobrar ?? 0,
            impuesto_renta_mensual: data.impuesto_renta_mensual ?? 0,
            este_empleador: data.ingresos ?? 0,
            num_cargas_familiares: data.num_cargas_familiares ?? 0,
            otro_empleador: data.otro_empleador ?? 0,
            otros_gastos: data.otros_gastos ?? 0,
            rebaja_discapacidad: data.rebaja_discapacidad ?? 0,
            rebaja_gastos_personales: data.rebaja_gastos_personales ?? 0,
            rebaja_tercera_edad: data.rebaja_tercera_edad ?? 0,
            retenciones: data.retenciones ?? 0,
            sueldo: data.sueldo ?? 0,
            sueldo_anual: data.sueldo_anual ?? 0,
            total_egresos: data.total_egresos ?? 0,
            total_ingresos: data.total_ingresos ?? 0,
            utilidades: data.utilidades ?? 0,
          })

          if (data) { this.impuestoRenta = data }

          await this.getMaxGastoPersonal(this.empleado.familiares_count ?? 0, this.cc_value_anio)
          if (this.dataImpuestoRenta.length > 0) {
            if (this.empleado.discapacitado) await this.getRebajaDiscapacidad(this.empleado.porcentaje_discapacidad ?? 0, this.cc_value_anio)
            if (this.empleado.tercera_edad) await this.getRebajaTerceraEdad(this.cc_value_anio)
          }

          this.roDiscapacidad = !this.empleado.discapacitado
          this.roTerceraEdad = !this.empleado.tercera_edad

          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.warning(err.error?.message)
        }
      },
      (error: any) => {
        console.log(error)
        this.processing = true;
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message, 'Problema actualizando Gastos Personales');
      }
    );
  }

  async validaDeleteGastosPersonales() {
    this.confirmSave(
      "Seguro desea eliminar gastos personales?",
      "DELETE_GASTO_PERSONAL"
    );

    // if (this.permisions.guardar == "0") {
    //   this.toastr.info("Usuario no tiene permiso para guardar");
    // } else {
    //   let resp = await this.validateDataGlobal().then(respuesta => {
    //     if (respuesta) {
    //       this.confirmSave("Seguro desea actualizar la cuenta?", "UPDATED_ACCOUNT");
    //     }
    //   })
    // }
  }

  deleteGastoPersonal() {
    const arraySendDeleteId = [];
    (this.dataGastosPersonales as any).map(function callback(
      elementoActual,
      index
    ) {
      arraySendDeleteId.push(elementoActual.id_gasto_personal);
    });

    console.log("delete");
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Borrar gastos personales rrhh",
      id_controlador: myVarGlobals.fBovedas,
      dataGP: arraySendDeleteId,
    };
    // this.validaDt = false;
    (this as any).mensajeSpinner = "Borrando...";
    this.lcargando.ctlSpinner(true);
    this.gastospersonalesService.deleteListGastosPersonales(data).subscribe(
      (res) => {
        console.log(res);
        this.cancel();
        this.lcargando.ctlSpinner(false);
        this.toastr.success("Borrado" /* res['message'] */);
        // this.toastr.success(res['message']);
        // this.cancel();
        // this.dtElement.dtInstance.then((dtInstance: any) => {
        //   dtInstance.destroy();
        //   this.getDataTableArea();
        // });
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      }
    );
  }
  // onClicConsultaPersonas() {
  //   console.log(this.periodo_id_cc)
  //   const modalInvoice = this.modalService.open(EmpleadosComponent, {
  //     size: "lg",
  //     backdrop: "static",
  //     windowClass: "viewer-content",
  //   });
  //   modalInvoice.componentInstance.title = "PERSONAL";
  //   modalInvoice.componentInstance.periodo_id = this.periodo_id_cc;
  // }

  onClicConsultaPersonas() {
    console.log(this.periodo_id_cc)
    const modalInvoice = this.modalService.open(ModalGlobalTableComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content",
    });
    modalInvoice.componentInstance.title = "PERSONAL";
    modalInvoice.componentInstance.periodo_id = this.cc_value_anio;
  }




  viewSelectionPeriodoCC(response: any) {

    console.log(response)
    this.validarRegistroTabla = 0;
    this.setValuesCatalog();
    // this.periodo_id_cc = response.id_periodos;
    // this.cc_value_anio = response.anio;
    this.periodo_id_cc = response.id;
    this.cc_value_anio = response.periodo;

    this.gastosPersonalesForm.num_documento = ''
    this.gastosPersonalesForm.nombre_completo = ''

    // this.fomulario_gasto_personal
    //   .get("namePeriodo")
    //   .setValue(this.periodo_id_cc);

    // this.inputNumDocumento.nativeElement.value = "";
    // this.fomulario_gasto_personal.get("num_documento").setValue("");
    // this.fomulario_gasto_personal.get("lgNombreCompleto").setValue("");
    this.cancel()
    this.isDisabled = false;
    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
  }

  setValuesCatalog() {
    (this.dataCatalogNomina as any).map((elementoActual: any) => {
      elementoActual.valor_proyectado = 0;
      elementoActual.valor_real = 0;
      return elementoActual; /* Elemento devuelto de nuevaLista */
    })
  }

  // No tiene valores de Gastos Personales asignados
  validarValorProyectado(registro: any) {
    /* if (registro.valor_proyectado > parseFloat(registro.valor_tope) && registro.valor_proyectado != 0) {
      this.toastr.warning(`El valor proyectado no puede ser mayor al valor tope de ${registro.valor_tope}`)
      registro.valor_proyectado = 0;
      return;
    } */
    // Obtener la suma de todos los campos en la tabla, columna proyectado y validar que no sobrepase impuestoRenta.maxGastoPersonal
    let sumProyectado = (this.dataCatalogNomina as any).reduce((acc: number, curr: any) => acc + curr.valor_proyectado, 0)
    this.sumGastos.proyectado = sumProyectado
    if (sumProyectado > this.impuestoRenta.maxGastoPersonal) {
      this.toastr.warning(`El total de gastos proyectados de ($ ${this.commonService.formatNumberDos(sumProyectado)}) no pueden exceder al valor máximo de gastos personales de $ ${this.commonService.formatNumberDos(this.impuestoRenta.maxGastoPersonal)}`)
     // registro.valor_proyectado = 0;
    }

    this.valoresCalculables()
  }

  validarValorReal(registro: any) {
    /* if (registro.valor_real > parseFloat(registro.valor_tope) && registro.valor_real != 0) {
      this.toastr.warning(`El valor real no puede ser mayor al valor tope de ${registro.valor_tope}`)
      registro.valor_real = 0;
      return;
    } */
    let sumReal = (this.dataCatalogNomina as any).reduce((acc: number, curr: any) => acc + curr.valor_real, 0)
    this.sumGastos.real = sumReal
    if (sumReal > this.impuestoRenta.maxGastoPersonal) {
      this.toastr.warning(`Los valores reales ($ ${sumReal}) no pueden exceder al valor tope de $ ${this.impuestoRenta.maxGastoPersonal}`)
      registro.valor_real = 0;
    }
  }

  // Tiene valores de Gastos Personales asignados
  validarUpdateValorProyectado(registro: any) {
    /* if (registro.gtp_valor_proyectado > parseFloat(registro.gtp_valor_tope) && registro.gtp_valor_proyectado != 0) {
      this.toastr.warning(`El valor proyectado no puede ser mayor al valor tope de ${registro.gtp_valor_tope}`)
      registro.gtp_valor_proyectado = 0;
      return;
    } */
    let sumProyectado = (this.dataGastosPersonales as any).reduce((acc: number, curr: any) => acc + curr.gtp_valor_proyectado, 0)
    this.sumGastos.proyectado = sumProyectado
    if (sumProyectado > this.impuestoRenta.maxGastoPersonal) {
      this.toastr.warning(`El total de gastos proyectados de ($${this.commonService.formatNumberDos(sumProyectado)}) no pueden exceder al valor máximo de gastos personales de $ ${this.commonService.formatNumberDos(this.impuestoRenta.maxGastoPersonal)}`)
      registro.gtp_valor_proyectado = 0;
    }
  }

  validarUpdateValorReal(registro: any) {
    /* if (registro.gtp_valor_real > parseFloat(registro.gtp_valor_tope) && registro.gtp_valor_real != 0) {
      this.toastr.warning(`El valor real no puede ser mayor al valor tope de ${registro.gtp_valor_tope}`)
      registro.gtp_valor_real = 0;
      return;
    } */
    let sumReal = (this.dataGastosPersonales as any).reduce((acc: number, curr: any) => acc + curr.gtp_valor_real, 0)
    this.sumGastos.real = sumReal
    if (sumReal > this.impuestoRenta.maxGastoPersonal) {
      this.toastr.warning(`Los valores reales ($ ${sumReal}) no pueden exceder al valor tope de $ ${this.impuestoRenta.maxGastoPersonal}`)
      registro.gtp_valor_real = 0;
    }
  }

  // DEPRECATED, reemplaza validarValorProyectado()
  /* onBlurValorProyectado($dtValue, $dataTab) {
    console.log(typeof $dtValue, $dtValue, $dataTab)
    let vlTp = $dataTab.valor_tope;
    if (parseFloat($dtValue) > parseFloat(vlTp) && parseFloat($dtValue) != 0) {
      this.toastr.warning(
        "El valor proyectado no puede ser mayor al valor tope : " + vlTp
      );

      $dataTab.valor_proyectado = 0;
      return;
    }
    $dataTab.valor_proyectado = parseFloat($dtValue);
    return parseFloat($dtValue);
  } */
  // DEPRECATED, reemplaza validarValorReal()
  /* onBlurValorReal($dtValue, $dataTab) {
    let vlTp = $dataTab.valor_tope;
    // let valReal = this.inputValorReal.nativeElement.value;
    if (parseFloat($dtValue) > parseFloat(vlTp) && parseFloat($dtValue) != 0) {
      this.toastr.warning(
        "El valor real no puede ser mayor al valor tope : " + vlTp
      );
      $dataTab.valor_real = 0;
      return;
    }
    return ($dataTab.valor_real = parseFloat($dtValue).toFixed(2));
    // console.log(this.inputValorReal.nativeElement.value);
  } */

  setGastosPersonales($data) {
    // console.log(this.inputValorProyectado.nativeElement.value);
    // $data.nuevaClave = "nuevoValor";
    // console.log($data);
    // console.log(this.childrenFlagInfo.nativeElement);
    // console.log(this.inputValorProyectado.nativeElement.value);
    // console.log($data.valor_tope);
    // console.log(this.inputValorReal.nativeElement.value);
  }

  cancel() {
    this.validarRegistroTabla = 0;
    this.periodo_id_cc = "0";
    this.isDisabled = true;
    this.setValuesCatalog();
    //this.cc_value_anio = "XXXX";
    //this.fomulario_gasto_personal.reset();
    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[4].habilitar = true
    this.dataImpuestoRenta = []

    // Limpiar nuevos campos
    Object.assign(this.impuestoRenta, {
      // Ingresos
      sueldo: 0,
      sueldo_anual: 0,
      horas_extra: 0,
      horas_extra_mensual: 0,
      bonificaciones: 0,
      comisiones: 0,
      comisiones_mensual: 0,
      utilidades: 0,
      este_empleador: 0,
      otro_empleador: 0,
      total_ingresos: 0,
      // Egresos
      iess_personal: 0,
      iess_otro_empleador: 0,
      otros_gastos: 0,
      total_egresos: 0,
      deducibles: 0,
      // Rebajas
      num_cargas_familiares: 0,
      maxGastoPersonal: 0,
      rebaja_discapacidad: 0,
      rebaja_tercera_edad: 0,
      retenciones: 0,
      rebaja_gastos_personales: 0,
      // Totales
      base_imponible: 0,
      impuesto_causado: 0,
      impuesto_renta_anual: 0,
      impuesto_renta_mensual: 0,
    })
    this.sumGastos.proyectado = 0
    this.sumGastos.real = 0
    this.formReadonly = true

  }
  // DEPRECATED, reemplaza validarUpdateValorProyectado()
  /* onBlurUpdateValorProyectado($dtValue, $dataTab) {
    console.log(typeof $dtValue, $dtValue)
    let vlTp = $dataTab.gtp_valor_tope;

    if (parseFloat($dtValue) > parseFloat(vlTp) && parseFloat($dtValue) != 0) {
      this.toastr.warning(
        "El valor proyectado no puede ser mayor al valor tope : " + vlTp
      );

      $dataTab.gtp_valor_proyectado = 0;
      return;
    }
    $dataTab.gtp_valor_proyectado = parseFloat($dtValue);
    return parseFloat($dtValue);
  } */
  // DEPRECATED, reemplaza validarUpdateValorReal()
  /* onBlurUpdateValorReal($dtValue, $dataTab) {
    let vlTp = $dataTab.gtp_valor_tope;

    if (parseFloat($dtValue) > parseFloat(vlTp) && parseFloat($dtValue) != 0) {
      this.toastr.warning(
        "El valor real no puede ser mayor al valor tope : " + vlTp
      );
      $dataTab.gtp_valor_real = 0;
      return;
    }
    return ($dataTab.gtp_valor_real = parseFloat($dtValue).toFixed(2));
  } */

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: any) => {
  //     dtInstance.destroy();
  //     //    this.catalogosNomina("GPP");

  //     // this.cc_value_anio = "XXXX";
  //   });
  // }
  handleTabNavigation(event: MatTabChangeEvent) {
    this.dinamicoBotones(event.index)
  }
}
