import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { ConfirmationDialogService } from "../../../../config/custom/confirmation-dialog/confirmation-dialog.service";
import { MspreguntaComponent } from "../../../../config/custom/mspregunta/mspregunta.component";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
import { CommonService } from "../../../../services/commonServices";
import { EmpleadoService } from "../../adm-nomina/empleado/empleado.service";
import { ImprimirRolComponent } from "../adm-rol-pago/imprimir-rol/imprimir-rol.component";
import * as myVarGlobals from "../../../../global";
import { AdmAnticipoService } from "./adm-anticipo.service";
import { evaluate } from 'mathjs';

@Component({
standalone: false,
  selector: "app-adm-anticipo",
  templateUrl: "./adm-anticipo.component.html",
  styleUrls: ["./adm-anticipo.component.scss"],
})
export class AdmAnticipoComponent implements OnInit {
  constructor(
    private empleadoService: EmpleadoService,
    private admAnticipoService: AdmAnticipoService,
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
  ultimoDia_mes: any = Number(this.primerDia_mes) + 14;
  mes_actual: any = moment(this.toDatePicker).locale("es").format("MMMM");
  anio_actual: any = moment(this.toDatePicker).format("YYYY");
  fecha_actual: any = moment(this.toDatePicker).format("YYYY-MM-DD");
  lConcepto: any = "";
  lstInicial: any = [];
  grupoSeleccionado: any = [];
  bankSelect: any = 0;

  selectMovimiento="administracion/adm-anticipo";
  cambioMovimiento(){
    this.router.navigateByUrl(this.selectMovimiento);
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAdmAnt", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmAnt", paramAccion: "", boton: { icon: "fa fa-trash-o", texto: "ANULAR ANTICIPO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmAnt", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true},
      { orig: "btnsAdmAnt", paramAccion: "", boton: { icon: "fa fa-check", texto: "APROBAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsAdmAnt", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false}
    ];

    let fechaActual:any = moment(new Date).format("YYYY-MM-DD");
    let validafInicio = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"01");
    let validafFin = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"15");

    this.periodoInicio = validafInicio;
    this.periodoFin = validafFin;

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
      codigo: myVarGlobals.fNomAnticipo,
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
          this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para ver el formulario de anticipo de pago");
        } else {
          this.empleadoService.getDatosIniciales().subscribe((datos: any) => {
              this.lstInicial = datos.data;
              this.lstInicial[1].splice(this.lstInicial[1].length + 1, 0, { id_grupo: 0, nombre_grupo: "TODOS"});
              this.grupoSeleccionado = this.lstInicial[1].find((datos) => datos.id_grupo == 0).id_grupo;
              this.admAnticipoService.getPersonalInfo({ idDepartamento: this.grupoSeleccionado }).subscribe((res) => {

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
        const dialogRef = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar);
        dialogRef.result.then((res) => {
          if (res.valor) {
            this.guardar();
          }
        });
        break;

      case "ANULAR ANTICIPO":
        const dialogRef2 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar);
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
  listadoBodyGeneral: any = [ { ingresos: [] }, { egresos: [] }, { valor_total_recibir: [] } ];
  obtenerEmpleados() {
    this.lConcepto = "";
    this.fecha_actual = moment(this.toDatePicker).format("YYYY-MM-DD");
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let idGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);
    this.admAnticipoService.getDatosEmpleados({tipoGrupo: idGrupo,idEmpleado: lIdPersonal.id_personal}).subscribe((res) => {
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




            /* PRESTAMO INI */
            let valorPrestamo:any = 0;
            if(element._prestamo != null){
              element._prestamo._prestamo_det.forEach(elementPrest => {
                let fechaVencimiento:any = elementPrest.fecha_vencimiento;
                let fechaEmision = fechaVencimiento.split("-");
                const lfechaEmision = new Date(+fechaEmision[0], fechaEmision[1] - 1, +fechaEmision[2]);
                let fechaActual:any = moment(new Date).format("YYYY-MM-DD");
                let validafInicio:any = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"01");
                let validafFin:any = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"15");
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


            this.lstTablaEmpleados.push(element);
          }
        });

        if (this.lstTablaEmpleados.length == 0) {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[3].habilitar = true;
        }

        this.calcularRubros();
        this.lcargando.ctlSpinner(false);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      });
  }

  obtenerRubros() {
    this.listaDeRubros = [];
    this.lstRubroIngreso = [];
    this.lstRubroEgreso = [];
    this.admAnticipoService.getConceptoInfo({tipoClase: "Anticipo"}).subscribe((res: any) => {
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
        let valores: any = this.validaciones.obtenerTipoRubro(element2.id_parametro,this.listaDeRubros);
        if (valores != null) {
          let sueldoBase: any = Number(element.sueldoBase);
          let cantidad_unificado: any = Number(valores.cantidad_unificado);
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
        let valores: any = this.validaciones.obtenerTipoRubro(element2.id_parametro,this.listaDeRubros, element);

        /* PRESTAMO INI */
        let validaPrestamo:boolean = false;
        let valorPrestamo:any = 0;
        if(valores.nombre == "Prestamo"){
          valorPrestamo = Number(element.valorPrestamo);
        }
        /* PRESTAMO FIN */

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
    this.lstTotalIngresos = this.validaciones.calcularTotalesIngresos(this.lstTotalIngresos,this.lstTablaEmpleados);
  }

  lstTotalEgresos: any = [];
  calcularTotalesEgresos() {
    this.lstTotalEgresos = [];
    this.lstTotalEgresos = this.validaciones.calcularTotalesEgresos(this.lstTotalEgresos,this.lstTablaEmpleados);
  }

  guardar() {

    if(this.validaPeriodoFechas()){
      return;
    }


    if (this.validaciones.verSiEsNull(this.lConcepto) == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor ingrese un concepto");
      return;
    }

    if (this.bankSelect == 0) {
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor sleccione un banco");
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
      tipoModulo: myVarGlobals.fNomAnticipo,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };

    this.admAnticipoService.getNomRolCab(dataPost).subscribe((datos: any) => {
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
            tipo_modulo: myVarGlobals.fNomAnticipo,
            periodo_inicio: periodoInicio,
            periodo_fin: periodoFin,
            ip: this.commonServices.getIpAddress(),
            accion: ("Guardar anticipo de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
            id_controlador: myVarGlobals.fNomAnticipo,
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

          this.admAnticipoService.guardarNomRol(datosEnviar).subscribe((datos) => {
            if (this.lstTablaEmpleados.length == indexEmpleado + 1) {
              validaTermina = true;
            }
          }, (error) => {
            this.lcargando.ctlSpinner(false);
          });
        });
      } else {
        this.validaciones.mensajeError("Regristro repetido", "El anticico de pago del periodo " + (periodoInicio + " al " +periodoFin) + " ya esta registrado");
        this.lcargando.ctlSpinner(false);
      }

      this.timer = setInterval(() => {
        if (validaTermina) {
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeExito("Exito", "Los anticipo se guardaron correctamente");
          this.obtenerRolDetalle();
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
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.listadoGeneral[0].datos_empleado = [
      { nombre: "#", sise: "1%" },
      { nombre: "NOMBRE", sise: "8%" },
      { nombre: "DEPARTAMENTO", sise: "8%" },
      { nombre: "AFILIADO", sise: "4%" },
      { nombre: "SUELDO", sise: "4%" }
    ];

    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");

    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let nombreGrupo: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).nombre_grupo;
    let lIdPersonal: any = this.arrayPersonal.find((datos) => datos.id_personal == this.selectPersonal);
    let dataPost:any = {
      tipoGrupo: nombreGrupo,
      idPersonal: lIdPersonal.id_personal,
      tipoModulo: myVarGlobals.fNomAnticipo,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin
    };
    this.admAnticipoService.getNomRolCab(dataPost).subscribe((datosCab: any) => {
          let existePeriodo: any = datosCab.data.find((datos) => moment(datos.periodo_inicio).format("YYYY-MM-DD") == periodoInicio && moment(datos.periodo_fin).format("YYYY-MM-DD") == periodoFin);
          if (existePeriodo != undefined) {
            this.listadoGeneral[0].datos_empleado = [
              { nombre: "#", sise: "1%" },
              { nombre: "NOMBRE", sise: "8%" },
              { nombre: "DEPARTAMENTO", sise: "8%" },
              { nombre: "AFILIADO", sise: "4%" },
              { nombre: "CONCEPTO", sise: "4%" },
              { nombre: "BANCO", sise: "10%" },
              { nombre: "SUELDO", sise: "4%" }
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
            clearInterval(this.timer);

            if (!this.vmButtons[0].habilitar && this.lstTablaEmpleados.length > 0) {
              this.vmButtons[2].habilitar = true;
            }
            this.setearValoresPrint();
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
        }
      );
  }

  anularPeriodoRol() {
    if (this.vmButtons[0].habilitar && this.lstTablaEmpleados.length > 0) {

      let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
      let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");

      let fechaActual:any = moment(new Date).format("YYYY-MM-DD");
      let validafInicio:any = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"01");
      let validafFin:any = new Date(+fechaActual.split("-")[0], fechaActual.split("-")[1] - 1, +"15");
      validafInicio = moment(validafInicio).format("YYYY-MM-DD");
      validafFin = moment(validafFin).format("YYYY-MM-DD");
      let enviarData:any = [];

      if (periodoInicio != validafInicio || periodoFin != validafFin) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Este anticipo del periodo seleccionado no se puede anular porque no es el actual");
        return;
      }

      this.lstTablaEmpleados.forEach((element) => {
        let dataPost: any = {
          id_rol: element.id_rol,
          ip: this.commonServices.getIpAddress(),
          accion: ("Eliminación de anticipo de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
          id_controlador: myVarGlobals.fNomAnticipo,
          id_banks: element.id_banks,
          secuencia: element.num_doc,
          total: element.total,
          id_prestamo_dets: element.id_prestamo_dets != null ? element.id_prestamo_dets.split(','): null,
          allItem: element
        };
        enviarData.push(dataPost);
      });

      (this as any).mensajeSpinner = "Anulando Anticipos...";
      this.lcargando.ctlSpinner(true);
      this.admAnticipoService.deleteRolPago({datosPost: enviarData}).subscribe((res: any) => {
          this.validaciones.mensajeExito("Exito","Los anticipos se anularon correctamente");
          this.obtenerRolDetalle();
        }, (error) => {
          this.lcargando.ctlSpinner(false);
        });
    } else {
      this.validaciones.mensajeAdvertencia("Advertencia", "No puede anular este periodo de anticipo porque no existe o el departamento no existe ningun empleado");
    }
  }

  arrayBanks: any = [];
  getInfoBank() {
    this.admAnticipoService.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
      this.arrayBanks = res["data"];
    }, (error) => {}
    );
  }

  arrayPersonal: any = [];
  selectPersonal: any;
  getPersonal() {
    let idDepartamento: any = this.lstInicial[1].find((datos) => datos.id_grupo == this.grupoSeleccionado).id_grupo;
    this.admAnticipoService.getPersonalInfo({ idDepartamento: idDepartamento }).subscribe((res) => {
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
    this.admAnticipoService.getSucursales().subscribe((res) => {
      this.dataSucursal = res["data"].filter((e) => e.id_sucursal == this.dataUser.id_sucursal)[0];
    },(error) => {}
    );
  }

  setearValoresPrint() {
    this.imprimirRolComponent.setearValores(this.lstTablaEmpleados, this.dataUser, this.dataSucursal, "ANTICIPO");
  }

  periodoInicio:any;
  periodoFin:any;
  validaPeriodoFechas(){
    let resultado:boolean = false;
    let periodoInicio:any = moment(this.periodoInicio).format("YYYY-MM-DD");
    let periodoFin:any = moment(this.periodoFin).format("YYYY-MM-DD");

    let validafInicio = null;
    let validafFin = null;
    validafInicio = new Date(+periodoInicio.split("-")[0], periodoInicio.split("-")[1] - 1, +"01");
    validafFin = new Date(+periodoFin.split("-")[0], periodoFin.split("-")[1] - 1, +"15");

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
          accion: ("Aprobacion de anticipo de pago del empleado " + (element.apellidos + " " + element.nombres + " cedula: ") + element.numdoc + " del periodo ") + (periodoInicio + " al " + periodoFin),
          id_controlador: myVarGlobals.fNomAnticipo,
          estado: "A",
          descripcion: "Rol Anticipo del " + periodoInicio + " al " + periodoFin,
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

    (this as any).mensajeSpinner = "Apobando anticipo por favor espere...";
    this.lcargando.ctlSpinner(true);
    this.admAnticipoService.aprobarRolPago({datosPost: enviarData}).subscribe((res: any) => {
      this.validaciones.mensajeExito("Exito", "Los anticipos se aprobaron correctamente");
      this.obtenerRolDetalle();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  calcularTotalesSueldo(){
    let resultado:any = 0;
    this.lstTablaEmpleados.forEach(element => {
      resultado = resultado + element.sueldoBase;
    });
    return this.validaciones.roundNumber(Number(resultado), 2);
  }
}
