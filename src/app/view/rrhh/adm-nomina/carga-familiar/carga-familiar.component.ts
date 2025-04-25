import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { PaginatorComponent } from "../../../../config/custom/paginator/paginator.component";
import { PaginatorService } from "../../../../config/custom/paginator/paginator.service";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "../../../../services/commonServices";
import { CargaFamiliarService } from "./carga-familiar.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as moment from "moment";
declare const $: any;
@Component({
  selector: "app-carga-familiar",
  templateUrl: "./carga-familiar.component.html",
  styleUrls: ["./carga-familiar.component.scss"],
})
export class CargaFamiliarComponent implements OnInit {
  constructor(
    private commonServices: CommonService,
    private router: Router,
    private cargaFamiliarService: CargaFamiliarService,
    private paginadorServicio: PaginatorService
  ) {}

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  /*INPUTS*/
  empleSeleccionado: any;
  relacioncarga: any;
  cedulacarga: any;
  fechaCarga: any;
  nombrecarga: any;
  apellidocarga: any;
  discapacidadcarga: boolean = false;
  afiliado: boolean = false;
  /*INPUTS*/

  permisions: any;
  dataUser: any;
  uno: any;
  generalDocument: any = "";
  dataEmpleado: any = [];
  datarelacion: any = [];
  vmButtons: any = [];
  id_carga: any;
  cedulaCargaAnterior: any;

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsCargFam", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false},
      { orig: "btnsCargFam", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true},
      { orig: "btnsCargFam", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true},
      { orig: "btnsCargFam", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false},
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(false);
    }, 10);

    $("#divListadoCarga").collapse("show");
    $("#divInputsCarga").collapse("hide");
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fNomCargaFamiliar,
      id_rol: id_rol,
    };
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
      this.permisions = res["data"];
      this.uno = res["data"][0].id_modulo;
      if (this.permisions[0].ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.vmButtons = [];
        this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene Permiso para ver el formulario de Administración");
      } else {
        this.generalDocument = "assets/img/vista.png";
        this.getDatosIniciales();
      }
    },error=>{
      this.lcargando.ctlSpinner(false);
    });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.orig) {
      case "LIMPIARbtnsCargFam":
        this.limpiarFormulario();
        break;

      case "NUEVObtnsCargFam":
        if (this.permisions[0].agregar == "0") {
          this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para agregar");
        } else {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
          $("#divInputsCarga").collapse("show");
          this.limpiarFormulario();
        }
        break;

      case "CANCELARbtnsCargFam":
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        $("#divInputsCarga").collapse("hide");
        this.listadoGeneral();
        break;

      case "GUARDARbtnsCargFam":
        this.validacionSaveOrUpdate();
        break;
    }
  }

  limpiarFormulario() {
    this.id_carga = undefined;
    this.cedulaCargaAnterior = null;
    /* VARIABLES INPUTS INFORMACION GENERAL */
    this.empleSeleccionado = null;
    this.relacioncarga = null;
    this.cedulacarga = null;
    this.fechaCarga = null;
    this.nombrecarga = null;
    this.apellidocarga = null;
    this.discapacidadcarga = false;
    this.afiliado = false;
  }

  displayedColumns: string[] = ["id_carga", "nombres", "cedula_carga", "nombres_general", "relacion", "fecha_nacim", "edad", "nombre_comercial", "accion"];
  control: number = 0;
  setPageSize: number = 5;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(PaginatorComponent, { static: false })
  paginatorComponent: PaginatorComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  listadoGeneral(): any {
    this.mensajeSppiner = "Cangando...";
    this.lcargando.ctlSpinner(true);
    this.cargaFamiliarService.tablaFamiliar().subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      this.dataSource.data = res["data"];
      this.dataSource.paginator = this.paginatorComponent.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case "id_carga":
            return item.id_carga;
          case "nombres":
            return item.nombres;
          case "cedula_carga":
            return item.cedula_carga;
          case "nombres_general":
            return item.nombres_general;
          case "apellidos_general":
            return item.apellidos_general;
          case "relacion":
            return item.relacion;
          case "fecha_nacim":
            return item.fecha_nacim;
          case "edad":
            return item.edad;
          case "nombre_comercial":
            return item.nombre_comercial;
          default:
            return item[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.connect().asObservable().subscribe((data) => {
          this.paginatorComponent.updateCurrentPage(this.dataSource.paginator.pageIndex + 1);
        },
        (error) => {},
        () => {}
      );
      this.dataSource.paginator.page.subscribe((data:any) => {
        if (data) {
          this.control = this.control + 1;
          data.tipoConsulta = "pagCargFam";
          data.NumeroConsulta = this.control;
          this.paginadorServicio.getPageLoad(data);
        }
      });
    },(error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = data.nombre.trim().toLowerCase() + data.tipo.trim().toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /**LISTADO */

  seleccionaritem(valores: any) {
    this.limpiarFormulario();
    if (valores == undefined) {
      return;
    }

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    $("#divInputsCarga").collapse("show");
    this.id_carga = valores.id_carga;
    this.cedulaCargaAnterior = valores.cedula_carga;
    this.empleSeleccionado = valores.id_empleado;
    this.relacioncarga = valores.relacion;
    this.cedulacarga = valores.cedula_carga;
    this.fechaCarga = valores.fecha_nacim;
    this.nombrecarga = valores.nombres_general;
    this.apellidocarga = valores.apellidos_general;
    this.discapacidadcarga = valores.discapacidad == 1 ? true : false;
    this.afiliado = valores.afiliado == 1 ? true : false;
  }

  ipSave: any;
  validacionSaveOrUpdate() {
    this.ipSave = this.commonServices.getIpAddress();
    if (this.permisions[0].guardar == "0" && this.id_carga == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para guardar");
      return;
    }

    if (this.permisions[0].modificar == "0" && this.id_carga != undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para modificar");
      return;
    }

    if (this.validaciones.validaInputsVacio(this.empleSeleccionado, "Seleccione un Empleado!!", "emplecarga")) return;
    if (this.validaciones.validaInputsVacio(this.cedulacarga, "Debe Ingresar Cédula!!", "cedulacarga")) return;
    if (this.validaciones.validaInputsVacio(this.nombrecarga, "Ingrese Nombres!!", "carga")) return;
    if (this.validaciones.validaInputsVacio(this.apellidocarga, "Ingrese Apellidos!!", "cargas")) return;
    if (this.validaciones.validaInputsVacio(this.relacioncarga, "Seleccione una Relacion!!", "relacion")) return;
    if (this.validaciones.validaInputsVacio(this.fechaCarga, "Seleccione una Fecha de Nacimiento!!", "fechacarga")) return;

    let data = {
      cedula: this.cedulacarga,
    };
    this.cargaFamiliarService.getLoadExist(data).subscribe((res) => {
        if (this.id_carga == undefined) {
          if (res["data"].length != 0) {
            this.validaciones.mensajeAdvertencia("Advertencia", "La cédula ya existe !!");
            let autFocus = document.getElementById("cedulacarga").focus();
            return;
          }
          this.confirmSave("Seguro desea guardar el registro?", "SAVE_UPDATE_CARGA");
        }
        if (this.id_carga !== undefined) {
          if (this.cedulaCargaAnterior == this.cedulacarga) {
            this.confirmSave("Seguro desea modificar el registro?", "SAVE_UPDATE_CARGA");
          } else {
            this.validaciones.mensajeAdvertencia("Advertencia", "La cedula ingresada no es la que estaba anteriormente");
          }
        }
      },
      (error) => {}
    );
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_UPDATE_CARGA") {
          this.saveOrUpdateCarga();
        } else if (action == "DELETE_CARGA") {
          this.deleteLoad();
        }
      }
    });
  }

  saveOrUpdateCarga() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      id_carga: this.id_carga,
      empleado: this.empleSeleccionado,
      cedula: this.cedulacarga,
      nombre: this.nombrecarga,
      apellido: this.apellidocarga,
      relacion: this.relacioncarga,
      nacimiento: moment(this.fechaCarga).format("YYYY-MM-DD"),
      afiliado: this.afiliado ? "1" : "0",
      discapasidad: this.discapacidadcarga ? "1" : "0",
      id_empresa_selecionada: this.dataUser.id_empresa,
      id_usuario: this.dataUser.id_usuario,
      id_modulo: this.uno,
      sucursal_logueado: this.dataUser.id_sucursal,
      id_empresa_logueado: this.dataUser.id_empresa,
      ip: this.commonServices.getIpAddress(),
      accion: this.id_carga == undefined ? `Registro de nueva carga ${this.nombrecarga} ${this.apellidocarga}` : `Modificación de carga ${this.nombrecarga} ${this.apellidocarga}`,
      id_controlador: myVarGlobals.fNomCargaFamiliar,
    };

    if (this.id_carga == undefined) {
      this.mensajeSppiner = "Guardando...";
      this.lcargando.ctlSpinner(true);
      this.cargaFamiliarService.guardaCarga(data).subscribe((res) => {
        this.lcargando.ctlSpinner(false);
        this.validaciones.mensajeExito("Exito", res["message"]);
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.listadoGeneral();
        $("#divInputsCarga").collapse("hide");
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      });
    } else if (this.id_carga != undefined) {
      this.mensajeSppiner = "Modificando...";
      this.lcargando.ctlSpinner(true);
      this.cargaFamiliarService.updateCarga(data).subscribe((res) => {
        this.lcargando.ctlSpinner(false);
        this.id_carga = undefined;
        this.validaciones.mensajeExito("Exito", res["message"]);
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.listadoGeneral();
        $("#divInputsCarga").collapse("hide");
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      });
    }
  }

  getDatosIniciales() {
    this.cargaFamiliarService.getEmpleado().subscribe((res) => {
      this.dataEmpleado = res["data"];
      this.cargaFamiliarService.getrelacion().subscribe((res) => {
        this.datarelacion = res["data"];
        this.listadoGeneral();
      },(error) => {
        this.lcargando.ctlSpinner(false);
      });
    },(error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  eliminarcarga(valor: any) {
    this.ipSave = this.commonServices.getIpAddress();
    if (this.permisions[0].eliminar == "0") {
      this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para modificar");
    } else {
      this.id_carga = valor.id_carga;
      this.confirmSave("Seguro desea eliminar el registro?", "DELETE_CARGA");
    }
  }

  deleteLoad() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      id_carga: this.id_carga,
      id_usuario: this.dataUser.id_usuario,
      id_modulo: this.uno,
      sucursal_logueado: this.dataUser.id_sucursal,
      id_empresa_logueado: this.dataUser.id_empresa,
      ip: this.commonServices.getIpAddress(),
      accion: "Eliminación de carga ",
      id_controlador: myVarGlobals.fPlanCuentas,
    };
    this.mensajeSppiner = "Eliminando...";
    this.lcargando.ctlSpinner(true);
    this.cargaFamiliarService.deleteCarga(data).subscribe((res) => {
        this.lcargando.ctlSpinner(false);
        this.id_carga = undefined;
        this.validaciones.mensajeExito("Exito", res["message"]);
        $("#divInputsCarga").collapse("hide");
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.listadoGeneral();
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      }
    );
  }
}
