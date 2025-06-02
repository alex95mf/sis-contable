import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { GrupoService } from './grupo.service'
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServices'
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import Swal from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})

export class GrupoComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  validaDtUser: any = false;
  guardaT: any = [];
  noms: any;
  comis: any;
  empresaSeleccionado: any;
  dataEmpresa: any;
  permisions: any;
  dataSucursal: any;
  dnew: any = false;
  newtb: any = false;
  dusuario: any = true;
  dguardar: any = true;
  dmodificar: any = true;
  dcancelar: any = true;
  dborrar: any = true;
  mod: any = false;
  dataUser: any;
  perfiles: any;
  ipSave: any;
  dguarda: any = false;
  id_grupo: any;
  eli: any = false;
  elim: any = true;
  perfilSeleccionado: any;
  componenteSeleccionado: any;
  componentes: any;
  uno: any;
  dos: any;
  tres: any;
  esucursal: any;
  eesucursal: any;
  eeesucursal: any;
  h: any;
  unos: any;
  cero: any;
  uu: any = true;
  cc: any = true;
  checkAuth: any = false;
  processing:any = false;

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  constructor(private grupoServices: GrupoService, private toastr: ToastrService, private router: Router, private zone: NgZone,
    private commonServices: CommonService) { }

  ngOnInit() {

    this.vmButtons = [
      { orig: "btnGrEm", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false},
      { orig: "btnGrEm", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true},
      { orig: "btnGrEm", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: true},
      { orig: "btnGrEm", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true},
      { orig: "btnGrEm", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: true},
      { orig: "btnGrEm", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-eliminar boton btn-sm", habilitar: true},
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fGrupo,
      id_rol: id_rol,
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if(this.permisions.length == 0){
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene permiso para ver el reporte");
        return;
      }
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de grupo");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getDataTableGrupo();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.dnuevo();
        break;
      case "GUARDAR":
        this.guardarGrupo();
        break;
      case "MODIFICAR":
        this.modificarGrupo();
        break;
      case "CANCELAR":
        this.cancelar();
        break;
      case "LIMPIAR":
        this.borrar();
        break;
      case "ELIMINAR":
        this.eliminar();
        break;
    }
  }

  /* SI / NO (VARABLE LLEGA EN FALSE Y LO CONTRARIO ! ) */
  setCheck(ch) {
    this.checkAuth = !this.checkAuth;
  }

  dnuevo() {
    if (this.permisions[0].agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      this.dusuario = false;
      this.dguardar = false;
      this.dcancelar = false;
      this.dborrar = false;
      this.mod = true;
      this.uu = false;
      this.cc = false;

      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = false;
      this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = true;
    }
  }

  borrar() {
    this.empresaSeleccionado = "";
    this.comis = "";
    this.noms = "";
  }

  cancelar() {
    this.borrar();
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;
  }

  /* esta funcion guarda los datos del grupos */
  guardarGrupo() {
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.validaciones.verSiEsNull(this.noms) == undefined) {
        this.toastr.info("Debe Ingresar Nombre de Grupo");
        let autFocus = document.getElementById("Idnombre").focus();
      } else {
        Swal.fire({
          title: "Atención",
          text: "Seguro desea guardar la siguiente información?",
          type: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            let data = {
              ip: this.commonServices.getIpAddress(),
              accion: `Registro de grupo ${this.noms}`,
              id_controlador: myVarGlobals.fGrupo,
              nombre_grupo: this.noms,
              comision: (this.checkAuth) ? "1" : "0",
            }
            this.mensajeSppiner = "Guardando...";
            this.lcargando.ctlSpinner(true);
            this.grupoServices.saveGrupo(data).subscribe(res => {
              this.lcargando.ctlSpinner(false);
              this.cancelar();
              this.getDataTableGrupo();
              this.toastr.success(res['message']);
            }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            })
          }
        });
      }
    }
  }
  /* fin esta funcion guarda datos de grupo */

  /* funcion presentar tabla grupo con datatable */
  getDataTableGrupo() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.mensajeSppiner = "Cangando...";
    this.lcargando.ctlSpinner(true);
    this.grupoServices.presentaTablaGrupo().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDtUser = true;
      this.guardaT = res['data'];
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
        this.ngOnDestroy();
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateGrupo(dt) {
    (dt.comisiona == '1') ? this.checkAuth = true : this.checkAuth = false;
    this.dusuario = false;
    this.newtb = false;
    this.dnew = true;
    this.dguarda = true;
    this.dmodificar = false;
    this.dcancelar = false;
    this.dborrar = false;
    this.elim = false;
    this.noms = dt.nombre_grupo;
    this.empresaSeleccionado = dt.id_empresa;
    this.id_grupo = dt.id_grupo;

    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;
    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = false;
  }

  modificarGrupo() {
    if (this.permisions[0].modificar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      if (this.validaciones.verSiEsNull(this.noms) == undefined) {
        this.toastr.info("Debe Ingresar Nombre de Grupo");
        let autFocus = document.getElementById("Idnombre").focus();
        return;
      }
      Swal.fire({
        title: "Atención",
        text: "Seguro desea actualizar la siguiente información?",
        type: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.value) {
          let data = {
            ip: this.commonServices.getIpAddress(),
            accion: `Actualización de grupo con identificación ${this.id_grupo}  a nombre ${this.noms}`,
            id_controlador: myVarGlobals.fGrupo,
            id_grupo: this.id_grupo,
            nombre_grupo: this.noms,
            comision: (this.checkAuth) ? "1" : "0",
          }
          this.mensajeSppiner = "Modificando...";
          this.lcargando.ctlSpinner(true);
          this.grupoServices.updateGrupo(data).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            this.cancelar();
            this.getDataTableGrupo();
            this.toastr.success(res['message']);
          },error=>{
            this.lcargando.ctlSpinner(false);
          })
        }
      });
    }
  }

  eliminar() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      Swal.fire({
        title: "Atención",
        text: "Seguro desea eliminar la siguiente información?",
        type: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.value) {
          let data = {
            ip: this.commonServices.getIpAddress(),
            accion: `Información eliminada de grupo con identificación ${this.id_grupo}  a nombre ${this.noms}`,
            id_controlador: myVarGlobals.fGrupo,
            id_grupo: this.id_grupo,
          }
          this.mensajeSppiner = "Eliminando...";
          this.lcargando.ctlSpinner(true);
          this.grupoServices.deleteGrupo(data).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            this.cancelar();
            this.getDataTableGrupo();
            this.id_grupo = undefined;
            this.toastr.success(res['message']);
          },error=>{
            this.lcargando.ctlSpinner(false);
          })
        }
      });
    }
  }
}
