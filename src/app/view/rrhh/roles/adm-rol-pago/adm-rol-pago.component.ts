import { Component, OnInit, ViewChild } from "@angular/core";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { ConfirmationDialogService } from "../../../../config/custom/confirmation-dialog/confirmation-dialog.service";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
import { EmpleadoService } from "../../adm-nomina/empleado/empleado.service";
import { AdmRolPagoService } from "./adm-rol-pago.service";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "../../../../services/commonServices";
import { Router } from "@angular/router";
import { MspreguntaComponent } from "../../../../config/custom/mspregunta/mspregunta.component";
import { ImprimirRolComponent } from "./imprimir-rol/imprimir-rol.component";

@Component({
standalone: false,
  selector: "app-adm-rol-pago",
  templateUrl: "./adm-rol-pago.component.html",
  styleUrls: ["./adm-rol-pago.component.scss"],
})
export class AdmRolPagoComponent implements OnInit {
  constructor(
    private empleadoService: EmpleadoService,
    private admRolPagoService: AdmRolPagoService,
    private commonServices: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router
  ) {}

  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(ImprimirRolComponent, { static: false })
  imprimirRolComponent: ImprimirRolComponent;
  toDatePicker: Date = new Date();
  primerDia_mes: any = moment().startOf("month").format("DD");
  ultimoDia_mes: any = moment().endOf("month").format("DD");
  mes_actual: any = moment(this.toDatePicker).locale("es").format("MMMM");
  anio_actual: any = moment(this.toDatePicker).format("YYYY");
  fecha_actual: any = moment(this.toDatePicker).format("YYYY-MM-DD");
  lConcepto: any = "";
  lstInicial: any = [];
  grupoSeleccionado: any = [];
  bankSelect: any = 0;

  selectMovimiento="administracion/adm-rol-pago";
  cambioMovimiento(){
    this.router.navigateByUrl(this.selectMovimiento);
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAdmRol", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmRol", paramAccion: "", boton: { icon: "fa fa-trash-o", texto: "ANULAR ROL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmRol", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true},
      { orig: "btnsAdmRol", paramAccion: "", boton: { icon: "fa fa-check", texto: "APROBAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmRol", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false}
    ];

    let fechaActual:any = moment(new Date).format("YYYY-MM-DD");
    let lastDayOfMonth = new Date((new Date).getFullYear(), (new Date).getMonth()+1, 0);
    this.periodoInicio = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"01");
    this.periodoFin = lastDayOfMonth;

    this.obtenerRubros();
    this.getSucursal();
    setTimeout(() => {
      this.permisos();
    }, 10);
  }

  permisions: any = [];
  dataUser: any;
  permisos() {
    this.vmButtons[3].permiso = false;
    this.vmButtons[3].showimg = false;
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fNomRoldePagos,
      id_rol: this.dataUser.id_rol,
    };
    this.getInfoBank();
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {

        this.permisions = res["data"];
        if(this.permisions[0].aprobar == 1){
          this.vmButtons[3].permiso = true;
          this.vmButtons[3].showimg = true;
        }
        if (this.permisions[0].ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para ver el formulario de rol de pago");
        } else {
          this.empleadoService.getDatosIniciales().subscribe((datos: any) => {
              this.lstInicial = datos.data;
              this.lstInicial[1].splice(this.lstInicial[1].length + 1, 0, { id_grupo: 0, nombre_grupo: "TODOS"});
              this.grupoSeleccionado = this.lstInicial[1].find((datos) => datos.id_grupo == 0).id_grupo;
              this.admRolPagoService.getPersonalInfo({ idDepartamento: this.grupoSeleccionado }).subscribe((res) => {
                  this.arrayPersonal = [];
                  let datosPer:any = [];
                  res["data"].forEach(element => {
                    if(this.validaciones.verSiEsNull(element.fechaSalida) == undefined){
                      let anioActual:any = new Date();
                      let fechaIngreso:any = element.fechaIngreso.split("-");
                      let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;
                      let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
                      dias = (dias < 0) ? dias * -1 : dias;
                      element.diasLaborados = dias;
                      datosPer.push(element);
                    }
                  });
                  this.arrayPersonal = datosPer;
                  this.arrayPersonal.splice(this.arrayPersonal.length + 1, 0, {
                    id_personal: 0,
                    nombres: "TODOS",
                    apellidos: "",
                  });
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
        const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent,{ config: {}, }, dataPresentar);
        dialogRef1.result.then((res) => {
          if (res.valor) {
            this.guardar();
          }
        });
        break;
      case "ANULAR ROL":
        const dialogRef2 = this.confirmationDialogService.openDialogBD(MspreguntaComponent,{ config: {}, }, dataPresentar);
        dialogRef2.result.then((res) => {
          if (res.valor) {
            this.anularPeriodoRol();
          }
        });
        break;

      case "BUSCAR":
        this.obtenerRolDetalle();
        break;

      case "APROBAR":
        const dialogRef3 = this.confirmationDialogService.openDialogBD(MspreguntaComponent,{ config: {}, }, dataPresentar );
        dialogRef3.result.then((res) => {
          if (res.valor) {
            this.aprobar();
          }
        });
        break;
    }
  }

  listaDeRubros: any = [];
  lstRubroIngreso: any = [];
  lstRubroEgreso: any = [];
  lstTablaEmpleados: any = [];
  listadoBodyGeneral: any = [ { ingresos: [] }, { egresos: [] }, { valor_total_recibir: [] }];
  obtenerEmpleados() {
    this.lConcepto = "";
    this.fecha_actual = moment(this.toDatePicker).format("YYYY-MM-DD");
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let idGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);
    this.admRolPagoService.getDatosEmpleados({tipoGrupo: idGrupo, idEmpleado: lIdPersonal.id_personal}).subscribe((res) => {
        this.lstTablaEmpleados = [];
        res["data"].forEach(element => {
          element.valorPrestamo = 0;
          element.idDetPrestamo = [];
          if(this.validaciones.verSiEsNull(element.fechaSalida) == undefined){
            let anioActual:any = new Date();
            let fechaIngreso:any = element.fechaIngreso.split("-");
            let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;
            let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
            dias = (dias < 0) ? dias * -1 : dias;
            element.diasLaborados = dias;
            this.lstTablaEmpleados.push(element);
          }

          /* PRESTAMO INI */
          let valorPrestamo:any = 0;
          if(element._prestamo != null){
            element._prestamo._prestamo_det.forEach(elementPrest => {
              let fechaVencimiento:any = elementPrest.fecha_vencimiento;
              let fechaEmision = fechaVencimiento.split("-");
              const lfechaEmision = new Date(+fechaEmision[0], fechaEmision[1] - 1, +fechaEmision[2]);
              let fechaActual:any = moment(new Date).format("YYYY-MM-DD");
              let validafInicio:any = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"01");
              let validafFin:any = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"31");
              if((lfechaEmision.getTime()>=validafInicio.getTime() && validafFin.getTime()>=lfechaEmision.getTime())){
                if(elementPrest.estado == "Pendiente"){
                  valorPrestamo = valorPrestamo + Number(elementPrest.monto);
                  element.valorPrestamo = valorPrestamo;
                  element.idDetPrestamo.push(elementPrest.id_dt);
                }
              }
            });
          }
          /* PRESTAMO FIN */



        });
        if (this.lstTablaEmpleados.length == 0) {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[3].habilitar = true;
        }
        this.calcularRubros();
        this.lcargando.ctlSpinner(false);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  obtenerRubros() {
    this.listaDeRubros = [];
    this.lstRubroIngreso = [];
    this.lstRubroEgreso = [];
    this.admRolPagoService.getConceptoInfo().subscribe((res: any) => {
        this.listaDeRubros = res.data;
        res.data.forEach((element) => {
          if (element.tipo == "Ingreso") {
            this.lstRubroIngreso.push(element);
          }
          if (element.tipo == "Egreso") {
            this.lstRubroEgreso.push(element);
          }
        });
      }, (error) => {}
    );
  }
  listadoGeneral: any = [
    {
      datos_empleado: [
        { nombre: "#", sise: "1%" },
        { nombre: "NOMBRE", sise: "8%" },
        { nombre: "DEPARTAMENTO", sise: "8%" },
        { nombre: "AFILIADO", sise: "4%" },
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
      this.listaDeRubros.forEach((rubr) => {
        if (element.Seguro == 1) {
          rubr.afiliado = true;
        } else {
          rubr.afiliado = false;
        }

        if (element.decimo_cuarto == "N") {
          rubr.decCuarto = true;
        } else {
          rubr.decCuarto = false;
        }

        if (element.decimo_tercero == "N") {
          rubr.decTercero = true;
        } else {
          rubr.decCuarto = false;
        }
      });

      this.lstRubroIngreso.forEach((element2) => {
        if (element.datoRubro == undefined) {
          element.datoRubro = [];
        }
        let valores: any = this.validaciones.obtenerTipoRubro(element2.id_parametro, this.listaDeRubros);
        if (valores != null) {
          let sueldoBase: any = Number(element.sueldoBase);
          let cantidad_unificado: any = Number(valores.cantidad_unificado);
          if (valores.tipo_calculo == "S") {
            if (valores.id_parametro == 10) {
              if (valores.afiliado) {
                valores.valor_cantidad = eval(valores.formula);
              }
            }else if (valores.id_parametro == 3) {
              if (element.decimo_cuarto == "N") {
                valores.valor_cantidad = eval(valores.formula);
              }
            }else if (valores.id_parametro == 4) {
              if (element.decimo_tercero == "N") {
                valores.valor_cantidad = eval(valores.formula);
              }
            } else {
              valores.valor_cantidad = eval(valores.formula);
            }
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
        let valores: any = this.validaciones.obtenerTipoRubro(element2.id_parametro, this.listaDeRubros, element);
        /* PRESTAMO INI */
        let validaPrestamo:boolean = false;
        let valorPrestamo:any = 0;
        if(valores.nombre == "Prestamo"){
          valorPrestamo = Number(element.valorPrestamo);
        }

        if (valores != null) {
          let sueldoBase: any = Number(element.sueldoBase);
          let cantidad_unificado: any = Number(valores.cantidad_unificado);
          if (valores.tipo_calculo == "S") {
            if (valores.id_parametro == 10) {
              if (valores.afiliado) {
                valores.valor_cantidad = eval(valores.formula);
              }
            }else if (valores.id_parametro == 3) {
              if (element.decimo_cuarto == "N") {
                valores.valor_cantidad = eval(valores.formula);
              }
            }else if (valores.id_parametro == 4) {
              if (element.decimo_tercero == "N") {
                valores.valor_cantidad = eval(valores.formula);
              }
            } else {
              valores.valor_cantidad = eval(valores.formula);
            }
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
    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    let nombreGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).nombre_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);
    let dataPost:any = {
      tipoGrupo: nombreGrupo,
      idPersonal: lIdPersonal.id_personal,
      tipoModulo: myVarGlobals.fNomRoldePagos,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };

    this.admRolPagoService.getNomRolCab(dataPost).subscribe((datos: any) => {
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
              totalEgresos = element.datoRubroEgr.find((datos) => datos.nombre == "TOTAL EGRESOS");
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
                tipo_modulo: myVarGlobals.fNomRoldePagos,
                periodo_inicio: periodoInicio,
                periodo_fin: periodoFin,
                ip: this.commonServices.getIpAddress(),
                accion: ("Guardar rol de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
                id_controlador: myVarGlobals.fNomRoldePagos,
                idDetPrestamo: element.idDetPrestamo.join(",")
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
              this.admRolPagoService.guardarNomRol(datosEnviar).subscribe((datos) => {
                  if (this.lstTablaEmpleados.length == indexEmpleado + 1) {
                    validaTermina = true;
                  }
                }, (error) => {
                  this.lcargando.ctlSpinner(false);
                }
              );
            });
          } else {
            this.validaciones.mensajeError("Regristro repetido", "El rol de pago del periodo " + (periodoInicio + " al " +periodoFin) + " ya esta registrado");
            this.lcargando.ctlSpinner(false);
          }
          this.timer = setInterval(() => {
            if (validaTermina) {
              this.lcargando.ctlSpinner(false);
              this.validaciones.mensajeExito("Exito", "Los roles se guardaron correctamente");
              this.obtenerRolDetalle();
              clearInterval(this.timer);
            }
          }, 200);
        }, (error) => {
          this.lcargando.ctlSpinner(false);
        }
      );
  }

  lstPeriodos: any = [];
  timer: any;
  obtenerRolDetalle() {
    this.getInfoBank();
    this.lConcepto = "";
    this.fecha_actual = moment(this.toDatePicker).format("YYYY-MM-DD");
    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
    this.vmButtons[0].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.listadoGeneral[0].datos_empleado = [
      { nombre: "#", sise: "1%" },
      { nombre: "NOMBRE", sise: "8%" },
      { nombre: "DEPARTAMENTO", sise: "8%" },
      { nombre: "AFILIADO", sise: "4%" },
    ];
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let nombreGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).nombre_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);

    let dataPost:any = {
      tipoGrupo: nombreGrupo,
      idPersonal: lIdPersonal.id_personal,
      tipoModulo: myVarGlobals.fNomRoldePagos,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };
    this.admRolPagoService.getNomRolCab(dataPost).subscribe((datosCab: any) => {
        let existePeriodo: any = datosCab.data.find((datos) => moment(datos.periodo_inicio).format("YYYY-MM-DD") == periodoInicio && moment(datos.periodo_fin).format("YYYY-MM-DD") == periodoFin);
        if (existePeriodo != undefined) {
          this.listadoGeneral[0].datos_empleado = [
            { nombre: "#", sise: "1%" },
            { nombre: "NOMBRE", sise: "8%" },
            { nombre: "DEPARTAMENTO", sise: "8%" },
            { nombre: "AFILIADO", sise: "4%" },
            { nombre: "CONCEPTO", sise: "4%" },
            { nombre: "BANCO", sise: "10%" },
          ];
          this.vmButtons[0].habilitar = true;
          this.vmButtons[3].habilitar = false;
          let datosPresentar: any = [];
          datosCab.data.forEach((cabecera) => {
            if (moment(cabecera.periodo_inicio).format("YYYY-MM-DD") == periodoInicio && moment(cabecera.periodo_fin).format("YYYY-MM-DD") == periodoFin) {
              this.lConcepto = nombreGrupo == "TODOS"? cabecera.concepto: this.lConcepto + cabecera.concepto + ", ";
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

          this.lstTablaEmpleados = [];
          this.lstTablaEmpleados = datosPresentar;
          this.lstTablaEmpleados.forEach(element => {
            let anioActual:any = new Date();
            let fechaIngreso:any = element.fechaIngreso.split("-");
            let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;
            let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
            dias = (dias < 0) ? dias * -1 : dias;
            element.diasLaborados = dias;
          });
          this.calcularIngresos();
          this.calcularEgresos();
          this.calcularValorNetoRecibir();
          this.calcularTotalesIngresos();
          this.calcularTotalesEgresos();
          this.lcargando.ctlSpinner(false);
        } else {
          this.obtenerEmpleados();
        }
        setTimeout(() => {
          if (!this.vmButtons[0].habilitar && this.lstTablaEmpleados.length > 0) {
            this.vmButtons[2].habilitar = true;
          }
          this.setearValoresPrint();
        }, 1000);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.obtenerEmpleados();
      });
  }

  anularPeriodoRol() {
    if (this.vmButtons[0].habilitar && this.lstTablaEmpleados.length > 0) {
      let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
      let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
      let fechaActual:any = moment(new Date).format("YYYY-MM-DD");
      let validafInicio:any = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"01");
      let validafFin:any = new Date((new Date).getFullYear(), (new Date).getMonth()+1, 0);
      validafInicio = moment(validafInicio).format("YYYY-MM-DD");
      validafFin = moment(validafFin).format("YYYY-MM-DD");
      if (periodoInicio != validafInicio || periodoFin != validafFin) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Este anticipo del periodo seleccionado no se puede anular porque no es el actual");
        return;
      }

      let enviarData:any = [];
      this.lstTablaEmpleados.forEach((element) => {
        let dataPost: any = {
          id_rol: element.id_rol,
          ip: this.commonServices.getIpAddress(),
          accion: ("Eliminación de rol de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
          id_controlador: myVarGlobals.fNomRoldePagos,
          id_banks: element.id_banks,
          secuencia: element.num_doc,
          total: element.total,
          id_prestamo_dets: element.id_prestamo_dets != null ? element.id_prestamo_dets.split(','): null,
          allItem: element
        };
        enviarData.push(dataPost);
      });

      (this as any).mensajeSpinner = "Anulando Roles...";
      this.lcargando.ctlSpinner(true);
      this.admRolPagoService.deleteRolPago({datosPost: enviarData}).subscribe((res: any) => {
        this.validaciones.mensajeExito("Exito", "Los roles se anularon correctamente");
        this.obtenerRolDetalle();
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      });
    } else {
      this.validaciones.mensajeAdvertencia("Advertencia", "No puede anular este periodo de rol porque no existe o el departamento no existe ningun empleado");
    }
  }

  arrayBanks: any = [];
  getInfoBank() {
    this.admRolPagoService.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
      this.arrayBanks = res["data"];
    }, (error) => {
    });
  }

  arrayPersonal: any = [];
  selectPersonal: any;
  getPersonal() {
    let idDepartamento: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    this.admRolPagoService.getPersonalInfo({ idDepartamento: idDepartamento }).subscribe((res) => {
      this.arrayPersonal = [];
      let datosPer:any = [];
      res["data"].forEach(element => {
        if(this.validaciones.verSiEsNull(element.fechaSalida) == undefined){
          let anioActual:any = new Date();
          let fechaIngreso:any = element.fechaIngreso.split("-");
          let fechaSalida:any = this.validaciones.verSiEsNull(element.fechaSalida)==undefined? moment(new Date()).format("YYYY-MM-DD"): element.fechaSalida;
          let dias:any = this.restar2Fechas((anioActual.getFullYear()+"-"+fechaIngreso[1]+"-"+fechaIngreso[2]), fechaSalida);
          dias = (dias < 0) ? dias * -1 : dias;
          element.diasLaborados = dias;
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
    this.admRolPagoService.getSucursales().subscribe((res) => {
      this.dataSucursal = res["data"].filter((e) => e.id_sucursal == this.dataUser.id_sucursal)[0];
    }, (error) => {}
    );
  }

  setearValoresPrint() {
    this.imprimirRolComponent.setearValores(this.lstTablaEmpleados, this.dataUser, this.dataSucursal, "ROL DE PAGO INDIVIDUAL");
  }

  periodoInicio:any;
  periodoFin:any;
  validaPeriodoFechas(){
    let resultado:boolean = false;
    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
    let validafInicio = null;
    let validafFin = null;
    let lastDayOfMonth = new Date((new Date).getFullYear(), (new Date).getMonth()+1, 0);
    let fechaActual:any = moment(new Date).format("YYYY-MM-DD");
    validafInicio = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"01");
    validafFin = lastDayOfMonth;
    if(periodoInicio != moment(validafInicio).format("YYYY-MM-DD") || periodoFin != moment(validafFin).format("YYYY-MM-DD")){
      resultado = true;
      this.validaciones.mensajeAdvertencia("Advertencia",("El periodo seleccionado no es el correcto para realizar el pago de anticipo. Debe escoger un periodo de 15 dias empezando por el primer dia del mes seleccionado"));
    }
    return resultado;
  }

  restar2Fechas(fechaInicio:any, fechaFin:any){
    let lfechaInicio:any = String(fechaInicio).split("-");
    let lfechaFin:any = String(fechaFin).split("-");
    let fechauno = new Date(+lfechaInicio[0], lfechaInicio[1] - 1, +lfechaInicio[2]).getTime();
    let fechados = new Date(+lfechaFin[0], lfechaFin[1] - 1, +lfechaFin[2]).getTime();
    let diff = fechados - fechauno;
    return diff/(1000*60*60*24);
  }

  aprobar(){
    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");
    let valida:boolean = false;
    let enviarData:any = [];

    this.lstTablaEmpleados.forEach((element) => {
      if(element.estadoRol == "P"){
        valida = true;
        let dataPost: any = {
          id_rol: element.id_rol,
          ip: this.commonServices.getIpAddress(),
          accion: ("Aprobacion de rol de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
          id_controlador: myVarGlobals.fNomRoldePagos,
          estado: "A",
          descripcion: "Rol de pago del " + periodoInicio + " al " + periodoFin,
          id_banks: element.id_banks,
          secuencia: element.num_doc,
          total: element.total,
          id_prestamo_dets: element.id_prestamo_dets != null ? element.id_prestamo_dets.split(','): null,
          allItem: element
        };
        enviarData.push(dataPost);
      }
    });

    if(!valida){
      this.validaciones.mensajeInfo("Informativo","No existe informacion a aprobar");
      return;
    };

    (this as any).mensajeSpinner = "Apobando rol de pago por favor espere...";
    this.lcargando.ctlSpinner(true);
    this.admRolPagoService.aprobarRolPago({datosPost: enviarData}).subscribe((res: any) => {
      this.validaciones.mensajeExito("Exito", "Los roles de pago se aprobaron correctamente");
      this.obtenerRolDetalle();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });

  }

}
