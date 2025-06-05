import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from '../../../../global';
import { CommonVarService } from '../../../../services/common-var.services';
import { CommonService } from '../../../../services/commonServices';
import { ParametrosService } from './parametros.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DataTableDirective } from 'angular-datatables';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit {

  validaciones: ValidacionesFactory = new ValidacionesFactory();

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;
  dataUser: any;
  permissions: any;

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private parametrosService: ParametrosService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnParActfJd", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnParActfJd", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnParActfJd", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
      this.ocultarBoton(1, false);
      this.ocultarBoton(2, false);
    }, 10);
    this.ocultarMostrar("show", "hide");
    this.getPermisions();
  }

  mensajeTitulo:any = "Crear";
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto+evento.items.paramAccion) {
      case "NUEVO1":
        this.ocultarBoton(1, true);
        this.ocultarBoton(2, true);
        this.ocultarMostrar("hide", "show");
        this.mensajeTitulo = "Crear";
        this.parametros = {cuentaActivo: "", cuentaDepreciacion: ""};
        break;
      case "CANCELAR1":
        this.ocultarBoton(1, false);
        this.ocultarBoton(2, false);
        this.ocultarMostrar("show", "hide");
        this.parametros = {cuentaActivo: "", cuentaDepreciacion: ""};
        break;
      case "GUARDAR1":
        if(this.validarInputs()){
          return;
        }
        if(this.validaciones.verSiEsNull(this.parametros.idParametro) == undefined){
          this.pregunta(1);
        }else{
          this.pregunta(2);
        }
        break;
    }
  }

  ocultarMostrar(div1, div2){
    // $("#divListParAf").collapse(div1);
    $("#divListParAfMant").collapse(div2);
  }

  ocultarBoton(posicion, valor){
    setTimeout(() => {
    this.vmButtons[posicion].permiso = valor;
    this.vmButtons[posicion].showimg = valor;
  }, 10);
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fActivoParametros,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permissions = res['data'][0];
      if (this.permissions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.vmButtons = [];
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Activo fijo");
      } else {
        //OKKKKK sigue
        this.obtenerCtasContablesGrupo();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  listadoGeneral:any = [];
  dtOptions: any = {};
  dtTrigger = new Subject();
  parametros:any = {cuentaActivo: "", cuentaDepreciacion: ""};
  obtenerListado(){
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      order: [[ 0, "desc" ]],
      dom: "frtip",
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.parametrosService.obtenerActFijParametros(null).subscribe((datos:any)=>{
      this.lcargando.ctlSpinner(false);
      this.listadoGeneral = datos.data;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error=>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  lstCtasContActivo:any = [];
  lstCtasContDepr:any = [];
  obtenerCtasContablesGrupo(){
    this.parametrosService.obtenerCtasContablesGrupo().subscribe((datos:any)=>{
      this.lstCtasContActivo = [];
      this.lstCtasContDepr = [];

      datos.data.ctas_grupo.forEach(element => {
        if(element.nombre_cuenta == "Cuenta Grupo de Activos Depreciables"){
          datos.data.ctas_con.forEach(element2 => {
            if(element2.codigo.startsWith(element.cuenta_contable) && element2.tipo.trim() == "DETALLE"){
              this.lstCtasContActivo.push(element2);
            }
          });
        }

        if(element.nombre_cuenta == "Cuenta Grupo de Depreciacion de Activos"){
          datos.data.ctas_con.forEach(element2 => {
            if(element2.codigo.startsWith(element.cuenta_contable) && element2.tipo.trim() == "DETALLE"){
              this.lstCtasContDepr.push(element2);
            }
          });
        }
      });



      this.obtenerListado();

    },error=>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  validarInputs(){
    if(this.validaciones.verSiEsNull(this.parametros.nombreActivo) == undefined){
      this.toastr.info("Debe Ingresar Nombre Activo");
      document.getElementById("nombreActivo").focus();
      return true;
    }

    if(this.validaciones.verSiEsNull(this.parametros.anioDepreciable) == undefined){
      this.toastr.info("Debe Ingresar Años Depreciables");
      document.getElementById("anioDepreciable").focus();
      return true;
    }

    if(this.validaciones.verSiEsNull(this.parametros.porcentajeAnual) == undefined){
      this.toastr.info("Debe Ingresar Porcentaje Anual");
      document.getElementById("porcentajeAnual").focus();
      return true;
    }

    if(this.validaciones.verSiEsNull(this.parametros.cuentaActivo) == undefined){
      this.toastr.info("Debe Seleccionar Cuenta Activo");
      return true;
    }

    if(this.validaciones.verSiEsNull(this.parametros.cuentaDepreciacion) == undefined){
      this.toastr.info("Debe Seleccionar Cuenta Depreiación");
      return true;
    }

    return false;
  }

  irAmodificar(valor:any){
    this.ocultarBoton(1, true);
    this.ocultarBoton(2, true);
    this.ocultarMostrar("hide", "show");
    this.mensajeTitulo = "Modificar";
    this.parametros.idParametro = valor.id;
    this.parametros.nombreActivo = valor.nombre_activo;
    this.parametros.anioDepreciable = valor["años_depreciables"];
    this.parametros.porcentajeAnual = valor.porcentaje_anual;
    this.parametros.cuentaActivo = valor.cuenta_activo;
    this.parametros.cuentaDepreciacion = valor.cuenta_depreciacion;
    this.parametros.isactive = valor.isactive;
  }

  eliminar(valor:any){
    this.parametros.idParametro = valor.id;
    this.parametros.nombreActivo = valor.nombre_activo;
    this.parametros.anioDepreciable = valor["años_depreciables"];
    this.parametros.porcentajeAnual = valor.porcentaje_anual;
    this.parametros.cuentaActivo = valor.cuenta_activo;
    this.parametros.cuentaDepreciacion = valor.cuenta_depreciacion;
    this.parametros.isactive = 0;

    this.pregunta(3);
  }

  saveOrUpdate(opcion:any){
    this.parametros.id_controlador = myVarGlobals.fActivoParametros;
    this.parametros.ip = this.commonServices.getIpAddress();
    this.parametros.accion = "";

    if(this.validaciones.verSiEsNull(this.parametros.idParametro) == undefined){
      this.parametros.accion = "Creación de parametro de adquisicion";
      this.parametros.isactive = 1;
      (this as any).mensajeSpinner = "Creando parametro...";
      this.lcargando.ctlSpinner(true);
      this.parametrosService.crearDepreciaciones(this.parametros).subscribe((datos:any)=>{
        this.lcargando.ctlSpinner(false);
        this.validaciones.mensajeExito("Exito","Se creó el registro correctamente");
        this.rerender();
      }, error=>{
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }else{
      if(opcion == 3){
        this.parametros.accion = ("Eliminación de parametro de adquisicion del id " + this.parametros.idParametro);
        (this as any).mensajeSpinner = "Eliminando parametro...";
      }else if(opcion == 2){
        (this as any).mensajeSpinner = "Modificando parametro...";
        this.parametros.accion = ("Modificación de parametro de adquisicion del id " + this.parametros.idParametro);
      }
      this.lcargando.ctlSpinner(true);
      this.parametrosService.actualizarDepreciaciones(this.parametros).subscribe((datos:any)=>{
        this.lcargando.ctlSpinner(false);
        if(opcion == 3){
          this.validaciones.mensajeExito("Exito","Se eliminó el registro correctamente");
        }else if(opcion == 2){
          this.validaciones.mensajeExito("Exito","Se modificó el registro correctamente");
        }
        this.rerender();
      }, error=>{
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }
  }

  pregunta(action:any){
    Swal.fire({
      title: "Atención!!",
      text: "¿Esta Seguro de realizar esta acción?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.saveOrUpdate(action);
      }
    })
  }

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  rerender(): void {
    this.ocultarBoton(1, false);
    this.ocultarBoton(2, false);
    this.ocultarMostrar("show", "hide");
    this.parametros = {cuentaActivo: "", cuentaDepreciacion: ""};
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.obtenerListado();
    });
  }

}
