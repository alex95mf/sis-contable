import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { PaginatorService } from "../../../../config/custom/paginator/paginator.service";
import { CommonService } from "../../../../services/commonServices";
import * as myVarGlobals from "../../../../global";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as moment from "moment";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
import { DocumentosService } from "./documentos.service";
import { MatTableDataSource } from "@angular/material/table";
import { PaginatorComponent } from "../../../../config/custom/paginator/paginator.component";
import { MatSort } from "@angular/material/sort";
import { environment } from "../../../../../environments/environment";
import { ConfirmationDialogService } from "../../../../config/custom/confirmation-dialog/confirmation-dialog.service";
import { VistaArchivoComponent } from "../../../contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component";
import { ToastrService } from "ngx-toastr";
declare const $: any;
@Component({
  selector: "app-documentos",
  templateUrl: "./documentos.component.html",
  styleUrls: ["./documentos.component.scss"],
})
export class DocumentosComponent implements OnInit {
  constructor(
    private commonServices: CommonService,
    private router: Router,
    private paginadorServicio: PaginatorService,
    private documentosService: DocumentosService,
    private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService
  ) {}

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  /*INPUTS*/
  empleSeleccionadodoc: any;
  desCatalogo: any;
  estadoSeleccionado: any;
  permisions: any;
  dataUser: any;
  uno: any;
  generalDocument: any = "assets/img/vista.png";
  vmButtons: any = [];
  descarga: boolean = false;
  id_archivo: any = undefined;
  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsDocNom", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false},
      { orig: "btnsDocNom", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true},
      { orig: "btnsDocNom", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true},
      { orig: "btnsDocNom", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false},
    ];
    $("#divListaDocNom").collapse("show");
    $("#divDocNom").collapse("hide");

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fNomDocumentos,
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
      this.toastr.info(error.message);
      this.lcargando.ctlSpinner(false);
    });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.orig) {
      case "LIMPIARbtnsDocNom":
        this.limpiarFormulario();
        break;
      case "NUEVObtnsDocNom":
        if (this.permisions[0].agregar == "0") {
          this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para agregar");
        } else {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
          $("#divListaDocNom").collapse("hide");
          $("#divDocNom").collapse("show");
          this.limpiarFormulario();
        }
        break;
      case "CANCELARbtnsDocNom":
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        $("#divListaDocNom").collapse("show");
        $("#divDocNom").collapse("hide");
        this.listadoGeneral();
        break;
      case "GUARDARbtnsDocNom":
        this.validaGuardarCatalogo();
        break;
    }
  }

  limpiarFormulario() {
    this.filesSelect = null;
    this.generalDocument = "assets/img/vista.png";
    this.id_archivo = undefined;
    /* VARIABLES INPUTS INFORMACION GENERAL */
    this.empleSeleccionadodoc = null;
    this.desCatalogo = null;
    this.estadoSeleccionado = null;
  }

  dataEmpleado: any = [];
  getDatosIniciales() {
    this.documentosService.getEmpleado().subscribe((res) => {
      this.dataEmpleado = res["data"];
      this.listadoGeneral();
    },(error) => {
      this.toastr.info(error.message);
      this.lcargando.ctlSpinner(false);
    });
  }

  /**LISTADO */
  displayedColumns: string[] = ["id_anexos", "id_empleado", "original_name", "description", "status", "accion"];
  control: number = 0;
  setPageSize: number = 5;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(PaginatorComponent, { static: false })
  paginatorComponent: PaginatorComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  listadoGeneral(): any {
    let data = {
      id: 2,
      module: this.permisions[0].id_modulo,
      component: myVarGlobals.fNomDocumentos,
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.documentosService.presentarDocumento(data).subscribe((res) => {
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
          this.paginatorComponent.updateCurrentPage(
            this.dataSource.paginator.pageIndex + 1
          );
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
      this.toastr.info(error.message);
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

  validaGuardarCatalogo() {
    if (this.permisions[0].guardar == "0" && this.id_archivo == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para guardar");
      return;
    }
    if (this.permisions[0].editar == "0" && this.id_archivo != undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para modificar");
      return;
    }
    if (this.validaciones.validaInputsVacio(this.empleSeleccionadodoc, "Debe seleccionar un empleado!!", "emplecarga")) return;
    if (this.validaciones.validaInputsVacio(this.desCatalogo, "Debe Ingresar una descripcion!!", "Iddescripcion")) return;
    if (this.validaciones.validaInputsVacio(this.estadoSeleccionado,"Debe Seleccionar Estado!!", "Idestado")) return;
    if (this.id_archivo == undefined) {
      this.confirmSave("Seguro desea guardar el registro?", "SAVE_UPDATE_DOC");
    } else if (this.id_archivo != undefined) {
      this.confirmSave("Seguro desea Modificar el registro?", "SAVE_UPDATE_DOC");
    }
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
        if (action == "SAVE_UPDATE_DOC") {
          this.saveOrUpdateCatalogo();
        } else if (action == "DELETE_DOC") {
          this.deleteDoc();
        }
      }
    });
  }

  saveOrUpdateCatalogo() {
    let params = {
      id_anexo: this.id_archivo,
      description: this.desCatalogo,
      module: this.permisions[0].id_modulo,
      component: myVarGlobals.fNomDocumentos,
      identifier: this.empleSeleccionadodoc,
      ip: this.commonServices.getIpAddress(),
      accion: this.id_archivo == undefined ? `Registro nuevo documento del proveedor ${this.empleSeleccionadodoc} ` : `Actualización de documento del empleado ${this.empleSeleccionadodoc} `,
      id_controlador: myVarGlobals.fNomDocumentos,
    };
    if (this.id_archivo == undefined) {
      this.mensajeSppiner = "Guardando...";
      this.lcargando.ctlSpinner(true);
      this.documentosService.fileService(this.filesSelect, params).subscribe((res) => {
          this.lcargando.ctlSpinner(false);
          if (res["status"] == 200) {
            this.validaciones.mensajeExito("Exito", "Los datos se guardaron correctamente");
          }
          this.id_archivo = undefined;
          this.vmButtons[0].habilitar = false;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
          this.listadoGeneral();
          $("#divListaDocNom").collapse("show");
          $("#divDocNom").collapse("hide");
        }, (error) => {
          this.toastr.info(error.message);
          this.lcargando.ctlSpinner(false);
        }
      );
    } else if (this.id_archivo != undefined) {
      this.mensajeSppiner = "Modificando...";
      this.lcargando.ctlSpinner(true);
      this.documentosService.patchFile(this.filesSelect, params).subscribe((res) => {
          this.lcargando.ctlSpinner(false);
          if (res["status"] == 200) {
            this.validaciones.mensajeExito("Exito", "Los datos se guardaron correctamente");
          }
          this.id_archivo = undefined;
          this.vmButtons[0].habilitar = false;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
          this.listadoGeneral();
          $("#divListaDocNom").collapse("show");
          $("#divDocNom").collapse("hide");
        }, (error) => {
          this.toastr.info(error.message);
          this.lcargando.ctlSpinner(false);
        }
      );
    }
  }

  filesSelect: any;
  subiendoando(files) {
    this.filesSelect = undefined;
    if (files.length > 0) {
      this.filesSelect = files[0];
      this.generalDocument = URL.createObjectURL(this.filesSelect);
    }
  }

  uri: string = environment.baseUrl;
  storage: string = "";
  name: any;
  downloadAnexo() {
    const url = `${this.uri}/general/download-files/?storage=${this.storage}&name=${this.name}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", this.name);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      this.validaciones.mensajeExito("Exito", "Descarga Exitosamente");
    }, 10);
  }

  seleccionaritem(valores: any) {
    this.limpiarFormulario();
    if (valores == undefined) {
      return;
    }
    this.mensajeSppiner = "Seteando valores...";
    this.lcargando.ctlSpinner(true);
    this.id_archivo = valores.id_anexos;
    this.storage = valores.storage;
    this.name = valores.name;
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    $("#divListaDocNom").collapse("hide");
    $("#divDocNom").collapse("show");
    this.empleSeleccionadodoc = valores.identifier;
    this.desCatalogo = valores.description;
    this.estadoSeleccionado = valores.status;
    let datos: any = {
      storage: valores.storage,
      name: valores.name,
    };
    this.documentosService.descargar(datos).subscribe((resultado) => {
        this.lcargando.ctlSpinner(false);
        this.generalDocument = URL.createObjectURL(resultado);
        let file: any = new File([resultado], valores.name, {
          type: valores.original_type,
        });
        this.filesSelect = file;
      }, (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  ipSave: any = "";
  eliminarDocumento(valores) {
    this.id_archivo = valores.id_anexos;
    this.empleSeleccionadodoc = valores.identifier;
    this.ipSave = this.commonServices.getIpAddress();
    if (this.permisions[0].eliminar == "0") {
      this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para modificar");
    } else {
      this.confirmSave("Seguro desea eliminar el documento?", "DELETE_DOC");
    }
  }

  deleteDoc() {
    let data = {
      id_anexo: this.id_archivo,
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminación de documento del empleado ${this.empleSeleccionadodoc} `,
      id_controlador: myVarGlobals.fNomDocumentos,
      module: this.permisions[0].id_modulo,
      component: myVarGlobals.fNomDocumentos,
      identifier: this.empleSeleccionadodoc,
    };
    this.mensajeSppiner = "Eliminando...";
    this.lcargando.ctlSpinner(true);
    this.documentosService.deleteFile(data).subscribe((res) => {
        this.id_archivo = undefined;
        this.lcargando.ctlSpinner(false);
        this.validaciones.mensajeExito("Exito", res["message"]);
        $("#divDocNom").collapse("hide");
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.listadoGeneral();
      }, (error) => {
        this.toastr.info(error.message);
      }
    );
  }

  obtenerEmpleado(idEmpleado: any) {
    let nombreEmpleado: any = "";
    let empleado: any = this.dataEmpleado.find((datos) => datos.id_personal == idEmpleado);
    if (empleado != undefined) {
      nombreEmpleado = empleado.nombres;
    }
    return nombreEmpleado;
  }


  verDocumentos(valores: any) {
    this.limpiarFormulario();
    if (valores == undefined) {
      return;
    }
    this.mensajeSppiner = "Seteando valores...";
    this.lcargando.ctlSpinner(true);
    let datos: any = {
      storage: valores.storage,
      name: valores.name,
    };
    this.documentosService.descargar(datos).subscribe((resultado) => {
        this.lcargando.ctlSpinner(false);
        // this.generalDocument = URL.createObjectURL(resultado);
        // let file: any = new File([resultado], valores.name, {
        //   type: valores.original_type,
        // });
        // this.filesSelect = file;

        const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
          width: '1000px', height: 'auto',
          data: { titulo: "Vista de Archivo", dataUser: this.dataUser, objectUrl: URL.createObjectURL(resultado), tipoArchivo: valores.original_type}          
        } );
     
        dialogRef.afterClosed().subscribe(resultado => {
          if(resultado!=false && resultado!=undefined){
    
          }
        }); 

      }, (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
      }
    );
  }

}
