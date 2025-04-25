import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { ParametroService } from '../../parametro/parametro.service'
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServices'
import { CommonVarService } from '../../../../services/common-var.services'
import * as moment from 'moment';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  usersEmpty: any = true;

  newGrupo: any = false;
  dataEmpresa: any;
  dataSucursal: any;
  sucursalSeleccionado: any;
  perfilSeleccionadoUser: any;
  ipSave: any;
  disbledSucursal: any = false;
  permisions: any;
  dataConsultar: any;
  rolSeleccionado: any;
  perfilSeleccionado: any;
  componenteSeleccionado: any = undefined;
  disbledComp: any;
  term: string = 'null';
  dataUser: any;
  dataT: any = [];
  validaDt: any = false;
  roles: any;
  perfiles: any;
  eperfil: any;
  dnewrol: any = false;
  dguardar: any = true;
  dmodificar: any = true;
  dcancelar: any = true;
  dguardarrol: any = true;
  dmodificarrol: any = true;
  dcancelarrol: any = true;
  empresaIdUpdate: any;
  guardarolT: any = [];
  dborrar: any = true;
  dusuario: any = true;
  dnew: any = false;
  newtb: any = false;
  dguarda: any = false;

  nombreComercial: any;
  razonsocial: any;
  ruc: any
  rucLegal: any;
  direccion: any;
  telefono1: any;
  telefono2: any;
  celular: any;
  emails: any;
  contacto: any;
  estadoEmpresa: any;
  causaBaja: any;
  fromDatePicker: Date = new Date();
  toDatePicker: Date = new Date();
  usersEmpresa: any;
  sucursal: any;
  emailValido: any = false;
  emailExist: any;
  empresaExist: any;
  guardaT: any = [];
  validaDtUser: any = false;
  empleadoSeleccionado: any;
  empresaSeleccionado: any;
  estadoSucursal: any;
  empleados: any = [{ id_empleado: 1, nombre: "administrador1" }, { id_empleado: 2, nombre: "administrador2" }, { id_empleado: 3, nombre: "administrador3" }]
  direccionSucu: any;
  celularSucu: any;
  emailSucursal: any;
  nombreSucursal: any;
  telefono1Sucu: any;
  telefono2Sucu: any;
  newSucursal: any;
  sucursalExist: any;
  dataConsultarSucursal: any;
  updateSucursal: any;
  empresaSeleccionadoCatalogo: any = 0;
  estadoCatalogo: any = "A";
  valorCatalogo: any;
  desCatalogo: any;
  tipoCatalogo: any = "";
  newCatalogo: any;
  saveCatalogo: any;
  modCatalogo: any;
  dataConsultarCatalogo: any;
  valNameGlobal: any;
  dataModifyCatalogo: any;
  valueCatalogo: any;
  dataUsuario: any;
  usuarioSeleccionado: any;
  processing: any = false;

  isMultiple: boolean = false;
  isSubGroup: boolean = false;
  lbl: string = "Sub grupo";
  subTipo: any = 0;
  groups: Array<any> = [];
  subgroups: Array<any> = [];
  vmButtons: any;
  validacionNuevoSub= false;
  validS = true;

  /* Documents */
  documents: any = {
    aprobaciones: false,
  };
  filters: any = [];
  fields: Object = { text: 'nombre', value: 'id' };
  waterMark: string = 'Filtros de solicitud';
  selectFilters: any;
  payloadDocument: any;
  actionsDoc = {
    edit: false,
    cancel: false,
  }
  constructor(private seguridadServices: ParametroService, private toastr: ToastrService, private router: Router, private zone: NgZone,
    private commonServices: CommonService, private comVarSrv: CommonVarService) {
    this.commonServices.setDataSucursal.asObservable().subscribe(res => {
      this.dmodificarrol = false;
      this.dguardarrol = true;
      this.newSucursal = true;
      this.dcancelar = true;
      this.dnewrol = true;
      this.dborrar = false;

      this.updateSucursal = res;
      this.nombreSucursal = res.nombre;
      this.telefono1Sucu = res.telefono1;
      this.telefono2Sucu = res.telefono2;
      this.direccionSucu = res.direccion;
      this.celularSucu = res.celular;
      this.emailSucursal = res.email;

      this.usuarioSeleccionado = res.administrador;
      this.estadoSucursal = res.estado;
      this.empresaSeleccionado = res.id_empresa;

      this.obtenerEmpresa(this.empresaSeleccionado);

    })

    this.comVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonServices.setDataCatalogo.asObservable().subscribe(res => {
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;

      this.validS = false;

      this.isMultiple = false;
      this.subTipo = 0;
      this.lbl = "";
      this.groups = [];
      this.subgroups = [];
      if(res['grupo'] !=null){
        this.newGrupo = false;
        this.lbl = "Sub Grupo"
      }else {
        this.newGrupo =true;
      }

      this.isSubGroup = true;
      this.newCatalogo = true;
      this.dataModifyCatalogo = res;
      this.dborrar;
      this.modCatalogo = true;
      this.saveCatalogo = false;
      this.newCatalogo = true;
      this.tipoCatalogo = res.tipo;
      this.desCatalogo = res.descripcion;
      this.estadoCatalogo = res.estado;
      this.empresaSeleccionadoCatalogo = res.id_empresa;
      this.valorCatalogo = res.valor;
      this.subTipo = res.grupo;
      this.valueCatalogo = true;
      this.validateSubgroup(res['tipo']);
    })

    this.commonServices.dtSystemDocuments.asObservable().subscribe(res => {
      
      this.selectFilters = undefined;
      if (res.filtros !== null && res.aprobaciones == 1) {
        this.selectFilters = res.filtros.split(',');
        for (let index = 0; index < this.selectFilters.length; index++) {
          this.selectFilters[index] = parseInt(this.selectFilters[index]);
        }
      }

      this.documents = res;
      
      this.actionsDoc.edit = true;
      this.actionsDoc.cancel = true;
      this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = false;
    });
  }

  idBotones: any = "";



  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsParametros", paramAccion: "3", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsParametros", paramAccion: "3", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsParametros", paramAccion: "3", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsParametros", paramAccion: "3", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },


      { orig: "btnsParametros", paramAccion: "4", boton: { icon: "fa fa-hourglass-start", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsParametros", paramAccion: "4", boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false }
    ];
    this.dinamicoBotones(3);
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fUParametros,
      id_rol: id_rol
    }
    this.seguridadServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];

      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Seguridades");
        this.router.navigateByUrl('dashboard');
      } else {
        this.getsucursales();
        this.getCatalogos();
        this.getEmpresa();
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getEmpresa() {
    this.seguridadServices.getEmpresa().subscribe(res => {
      console.log(res);
      this.dataEmpresa = res['data'];
      this.guardaT = res['data'];
      this.getFiltersDocuments();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  /* Section Documents */
  getFiltersDocuments() {
    this.seguridadServices.getSisFiltersDocuments().subscribe(res => {
      this.filters = res['data'];
      this.getDataTableEmpresa();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  dinamicoBotones(valor: any) {
    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if (element.paramAccion == valor) {
          element.permiso = true; element.showimg = true;
        } else {
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "3NUEVO":
        this.dnuevoCatalogo();
        break;
      case "3GUARDAR":
        this.guardarCatalogo();
        break;
      case "3MODIFICAR":
        this.modificarCatalogo();
        break;
      case "3CANCELAR":
        this.cancelarCatalogos();
        break;


      case "4MODIFICAR":
        this.editDocument();
        break;
      case "4CANCELAR":
        this.cancelDocument();
        break;
    }
  }


  /* Obtener Usuario */
  getUsuario(com) {
    this.seguridadServices.getUsuario({ company: com }).subscribe(res => {
      this.dataUsuario = res['data'];
      if (res['data'].length > 0) {
        this.usersEmpty = false
      } else {
        this.usersEmpty = true
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  obtenerUsuario(e) {
    this.usuarioSeleccionado = e;
  }

  modificarCatalogo() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      this.confirmSave("Seguro desea actualizar la información deL catálogo?", "UPG_CATALOG");
    }
  }

  async guardarCatalogo() {
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      this.lcargando.ctlSpinner(true);
      let res = this.validaNameGlobal(this.valorCatalogo, this.tipoCatalogo).then(result => {
        this.lcargando.ctlSpinner(false);
        if (this.tipoCatalogo == 0 || this.tipoCatalogo == "") {
          this.toastr.info("Debe Ingresar un Grupo");
          let autFocus = document.getElementById("IdTipo").focus();
        } else if (this.isMultiple && this.isSubGroup && (this.subTipo == undefined || this.subTipo == 0)) {
          document.getElementById("IdSubgrupo").focus();
          this.toastr.info(`Debe seleccionar un ${this.lbl}`);
        } else if (this.valorCatalogo == "" || this.valorCatalogo == undefined) {
          this.toastr.info("Debe Ingresar un valor");
          let autFocus = document.getElementById("IdValorCatalogo").focus();
        } else if (this.empresaSeleccionadoCatalogo == 0 || this.empresaSeleccionadoCatalogo == undefined) {
          this.toastr.info("Debe seleccionar una empresa");
        } else if (this.estadoCatalogo == "" || this.estadoCatalogo == undefined) {
          this.toastr.info("Debe seleccionar un estado");
        } else if (this.valNameGlobal) {
          this.toastr.info("El valor ya se encuentra registrado");
          let autFocus = document.getElementById("IdValorCatalogo").focus();
        } else {
          this.confirmSave("Seguro desea guardar la información de nuevo catálogo?", "SET_CATALOG");
        }
      })
    }
  }

  validaNameGlobal(value, type) {
    return new Promise(resolve => {
      let data = {
        valor: value,
        type: type
      }
      this.seguridadServices.getValidaNameGlobal(data).subscribe(res => {
        this.valNameGlobal = false;
        resolve(true);
      }, error => {
        resolve(true);
        this.valNameGlobal = true;
      })
    });
  }

  getCatalogos() {
    let data = {
      id: 10
    }
    this.dataConsultarCatalogo = data;
  }

  obtenerEmpresaCatalogo(e) {
    this.empresaSeleccionadoCatalogo = e;
  }

  dnuevoCatalogo() {

    this.subTipo = 0;
    this.valorCatalogo = undefined;
    this.estadoCatalogo = "A";
    this.empresaSeleccionadoCatalogo = 1;
    this.desCatalogo = undefined;

    Swal.fire({
      title: "Atención",
      text: 'Escoge una opción',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Grupo`,
      cancelButtonText: `Cancelar`,
      denyButtonText: `Subgrupo/Valor`,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#E0A800',
      denyButtonColor: `#13A1EA`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoCatalogo = "";
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;
        this.isMultiple = false;
        this.newCatalogo = true;
        this.saveCatalogo = true;
        this.modCatalogo = false;
        this.dborrar = false;
        this.valueCatalogo = false;
        this.newGrupo = true;
        this.subTipo = '';
      } else if (result.isDenied) {
        this.lcargando.ctlSpinner(true);
        this.seguridadServices.getDistinctCatalog().subscribe(res => {
          this.lcargando.ctlSpinner(false);
          this.tipoCatalogo = 0;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.groups = res['data'];
          this.isMultiple = true;
          this.newCatalogo = true;
          this.saveCatalogo = true;
          this.modCatalogo = false;
          this.dborrar = false;
          this.valueCatalogo = false;
          this.newGrupo = false;
          
        }, error => {
          this.toastr.info(error.error.message);
        })
      }
    })
  }

  showPass() {
    var tipo = document.getElementById("password").getAttribute("type")
    if (tipo == "password") {
      document.getElementById("password").setAttribute("type", "text");
    } else {
      document.getElementById("password").setAttribute("type", "password");
    }
  }



  obtenerEmpresa(e) {
    this.empresaSeleccionado = e;
    this.getUsuario(this.empresaSeleccionado);
  }

  obtenerEmpleado(e) {
    this.empleadoSeleccionado = e;
  }

  obtenerSucursal(e) {
    this.sucursalSeleccionado = e;
  }

  obtenerPerfilUserSelected(e) {
    this.perfilSeleccionadoUser = e;
  }

  validarEmailSucursal(email) {
    let data = {
      email: email,
    }
    this.seguridadServices.getEmailSucursal(data).subscribe(res => {
      this.emailExist = false;
    }, error => {
      this.emailExist = true;
      this.toastr.info(error.error.message);
    })
  }

  validaSucursalExist(name) {
    let data = {
      nombre: name
    }
    this.seguridadServices.getSucursalExist(data).subscribe(res => {
      this.sucursalExist = false;
    }, error => {
      this.sucursalExist = true;
      this.toastr.info(error.error.message);
    })
  }

  getDataTableEmpresa() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.processing = true;
    this.validaDtUser = true;
    setTimeout(() => {
      this.dtTrigger.next();
      this.ngOnDestroy();
    }, 50);
  }

  getsucursales() {
    let data = {
      id_empresa: this.dataUser.id_empresa,
    }
    this.dataConsultarSucursal = data;
  }

  obtenerRol(e) {
    this.rolSeleccionado = e;
  }

  obtenerPerfil(e) {
    this.perfilSeleccionado = e;
  }

  obtenerComponente(e) {
    this.componenteSeleccionado = e;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  dnuevo() {
    if (this.permisions[0].agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      this.dnew = true;
      this.newtb = true;
      this.dusuario = false;
      this.dguardar = false;
      this.dcancelar = false;
      this.dborrar = false;
      this.borrar();
    }
  }

  borrar() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    
    this.validS = true;
    this.lbl = 'Sub Grupo'
    this.validacionNuevoSub = false;
    this.isMultiple = false;
    this.nombreComercial = '';
    this.razonsocial = '';
    this.ruc = '';
    this.rucLegal = '';
    this.direccion = '';
    this.telefono1 = '';
    this.telefono2 = '';
    this.celular = '';
    this.emails = '';
    this.contacto = '';
    this.estadoEmpresa = '';;
    this.causaBaja = '';
    this.fromDatePicker = new Date();
    this.toDatePicker = new Date();
    this.usersEmpresa = "";
    this.sucursal = "";
    this.newGrupo = false;

    this.dnew = false;
    this.dguarda = true;
    this.dmodificar = true;

    this.empresaSeleccionado = undefined;
    this.empleadoSeleccionado = undefined;
    this.usuarioSeleccionado = "";
    this.estadoSucursal = undefined;
    this.emailSucursal = "";
    this.celularSucu = "";
    this.direccionSucu = "";
    this.nombreSucursal = "";
    this.telefono1Sucu = "";
    this.telefono2Sucu = "";

    this.empresaSeleccionadoCatalogo = 1;
    this.estadoCatalogo = "A";
    this.valorCatalogo = "";
    this.desCatalogo = "";
    this.tipoCatalogo = "";

    this.saveCatalogo = false;
    this.modCatalogo = false;
    this.valueCatalogo = false;

    this.subTipo = 0;
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SET_CATALOG") {
          this.setCatalog();
        } else if (action == "UPG_CATALOG") {
          this.updCatalog();
        } else if (action == "UPG_DOC") {
          this.updDocument();
        }
      }
    })
  }

  setCatalog() {
    this.lcargando.ctlSpinner(true);
    var data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.valorCatalogo} como nuevo catálogo`,
      id_controlador: myVarGlobals.fUParametros,
      tipo: this.tipoCatalogo,
      group: this.subTipo,
      descripcion: this.desCatalogo,
      valor: this.valorCatalogo,
      estado: this.estadoCatalogo,
      id_empresa: this.empresaSeleccionadoCatalogo
    }
    // if (this.isMultiple && this.isSubGroup && (this.subTipo !== undefined || this.subTipo !== 0)) {
    //   data["group"] = this.subTipo;
    // }
    this.seguridadServices.saveRowCatalogo(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.borrar();
      this.dataConsultarCatalogo = undefined;
      setTimeout(() => {
        this.dataConsultarCatalogo = { id: 10 };
      }, 300);
      this.getEmpresa();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  updCatalog() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de información catálogo de tipo ${this.tipoCatalogo}`,
      id_controlador: myVarGlobals.fUParametros,
      tipo: this.tipoCatalogo,
      valor: this.valorCatalogo,
      descripcion: this.desCatalogo,
      estado: this.estadoCatalogo,
      id_empresa: this.empresaSeleccionadoCatalogo,
      id_catalogo: this.dataModifyCatalogo.id_catalogo
    }

    this.seguridadServices.updateCatalogo(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.borrar();
      this.dataConsultarCatalogo = undefined;
      setTimeout(() => {
        this.dataConsultarCatalogo = { id: 10 };
      }, 300);
      this.getEmpresa();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  validateSubgroup(event) {
    console.log(event);
    /* Clear params */
    if(event != null && this.validS){
      console.log(this.validS);
      Swal.fire({
        title: "Atención",
        text: 'Escoge una opción',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Nuevo Sub Grupo`,
        cancelButtonText: `Cancelar`,
        denyButtonText: `Valor a Subgrupo`,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#E0A800',
        denyButtonColor: `#13A1EA`,
      }).then((result) => {
        if (result.isConfirmed) {
  
          this.subTipo = ''
          this.validacionNuevoSub = true
  
        } else if (result.isDenied) {
          this.validacionNuevoSub = false
          this.lbl = "";
          this.subgroups = [];
          this.isSubGroup = false;
  
          this.lbl = event
  
          let data = {
            tipo: event
          }
          this.seguridadServices.getCatalogByType(data).subscribe(res => {
            console.log(res);
            if(res['data'][0]['grupo'] == null || res['data'].length == 0){
              this.isSubGroup = false;
              this.lbl = "";
            }else {
              this.isSubGroup = true;
              this.subgroups = res['data'];
            }
  
          }, error => {
            this.toastr.info(error.error.message);
          });
  
        }
      })

    }
    




    

    

    // /* Add new params */
    // if (event == 'MODELOS' || event == 'PROVINCIA' || event == 'CIUDAD') {
    //   this.isSubGroup = true;
    //   this.lbl = (event == 'MODELOS') ? 'Marca' : (event == 'PROVINCIA') ? 'País' : 'Provincia';

    //   let data = {
    //     tipo: (event == 'MODELOS') ? 'MARCAS' : (event == 'PROVINCIA') ? 'PAIS' : 'PROVINCIA',
    //   }
    //   this.seguridadServices.getCatalogByType(data).subscribe(res => {
    //     this.subgroups = res['data'];
    //   }, error => {
    //     this.toastr.info(error.error.message);
    //   });
    // } else {
    //   this.isSubGroup = false;
    //   this.lbl = "";
    // }
  }

  cancelarEmpresa() {
    this.borrar();
    this.dnew = false;
    this.newtb = false;
    this.dusuario = true;
    this.dguardar = true;
    this.dcancelar = true;
    this.dborrar = true;
  }

  cancelarSucursal() {
    this.borrar();
    this.newSucursal = false;
    this.dnewrol = false;
    this.dguardarrol = true;
    this.dcancelarrol = true;
    this.dborrar = true;
    this.dcancelar = true;
    this.dmodificarrol = true;
  }

  cancelarCatalogos() {
    this.borrar();
    this.newCatalogo = false;
  }



  editDocument() {
    this.documents.filters = (this.selectFilters !== undefined) ? this.selectFilters : [];
    if (this.documents.aprobaciones == true && this.selectFilters == undefined) {
      this.toastr.info("Seleccione uno o varios filtros");
      document.getElementById("multifilterdoc").focus();
    } else {
      this.confirmSave("Seguro desea actualizar la información del documento?", "UPG_DOC");
    }
  }

  updDocument() {
    this.lcargando.ctlSpinner(true);
    this.documents.filters.sort();
    this.documents.ip = this.commonServices.getIpAddress()
    this.documents.accion = `Actualización de filtros en el documento ${this.documents.codigo} (${this.documents.id})`
    this.documents.id_controlador = myVarGlobals.fUParametros

    this.seguridadServices.updateDocument(this.documents).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancelDocument();
      this.commonServices.dtSModifyDocuments.next();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  cancelDocument() {
    this.selectFilters = undefined;
    this.documents = { aprobaciones: false };
    this.actionsDoc.edit = false;
    this.actionsDoc.cancel = false;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;
  }

  clearSwitchFilter() {
    this.selectFilters = undefined;
  }

}
