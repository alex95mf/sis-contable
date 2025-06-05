import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { ParametroService } from '../../parametro/parametro.service'
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import * as moment from 'moment';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-empresarial',
  templateUrl: './empresarial.component.html',
  styleUrls: ['./empresarial.component.scss']
})
export class EmpresarialComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  usersEmpty: any = true;

  dataEmpresa: any;
  dataSucursal: any;
  sucursalSeleccionado: any;
  perfilSeleccionadoUser: any;
  ipSave: any;
  disbledSucursal: any = false;
  permisions: any = [];
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
  estadoEmpresa: any = "A";
  causaBaja: any;
  fromDatePicker: any = new Date();
  toDatePicker: any = new Date();
  usersEmpresa: any;
  sucursal: any;
  emailValido: any = false;
  emailExist: any;
  empresaExist: any;
  guardaT: any = [];
  validaDtUser: any = false;
  empleadoSeleccionado: any;
  empresaSeleccionado: any = 0;
  estadoSucursal: any = "A";
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
  empresaSeleccionadoCatalogo: any;
  estadoCatalogo: any;
  valorCatalogo: any;
  desCatalogo: any;
  tipoCatalogo: any;
  newCatalogo: any;
  saveCatalogo: any;
  modCatalogo: any;
  dataConsultarCatalogo: any;
  valNameGlobal: any;
  dataModifyCatalogo: any;
  valueCatalogo: any;
  dataUsuario: any;
  usuarioSeleccionado: any = 0;
  processing: any = false;

  orientacion_gasto: any = 0;
  actividad: any = 0;

  isMultiple: boolean = false;
  isSubGroup: boolean = false;
  lbl: string = "";
  subTipo: any;
  groups: Array<any> = [];
  subgroups: Array<any> = [];

  listaorientacion: any[] = []
  listafuncion: any[] = []

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
  vmButtons: any;
  url: any = "assets/img/avatars/file.png";
  constructor(private seguridadServices: ParametroService, private toastr: ToastrService, private router: Router, private zone: NgZone,
    private commonServices: CommonService, private commVarSrv: CommonVarService) {
    this.commonServices.setDataSucursal.asObservable().subscribe(res => {
      this.dmodificarrol = false;
      this.dguardarrol = true;
      this.newSucursal = true;
      this.dcancelar = true;
      this.dnewrol = true;
      this.dborrar = false;

      this.vmButtons[4].habilitar = true;
      this.vmButtons[5].habilitar = true;
      this.vmButtons[6].habilitar = false;
      this.vmButtons[7].habilitar = false;

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

    this.commonServices.setDataCatalogo.asObservable().subscribe(res => {
      this.isMultiple = false;
      this.subTipo = undefined;
      this.lbl = "";
      this.groups = [];
      this.subgroups = [];
      this.isSubGroup = false;

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
      this.valueCatalogo = true;
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
    });

    this.commVarSrv.listeButtonPtEm.asObservable().subscribe(res => {
      this.vmButtons[8].habilitar = true;
      this.vmButtons[9].habilitar = true;
      this.vmButtons[10].habilitar = true;
      this.vmButtons[11].habilitar = true;
      this.vmButtons[12].habilitar = false;
      this.vmButtons[13].habilitar = false;
      this.vmButtons[14].habilitar = false;
    })
  }


  idBotones: any = "";
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

  ngOnInit(): void {
    setTimeout(() => {
      this.getPermisions();

    }, 50);

    this.vmButtons = [
      { orig: "btnsEmpresa", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "1", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },

      { orig: "btnsEmpresa", paramAccion: "2", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "2", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "2", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },

      { orig: "btnsEmpresa", paramAccion: "3", boton: { icon: "fa fa-hourglass-start", texto: "NUEVO PUNTO EMISION" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "3", boton: { icon: "fa fa-pencil-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "3", boton: { icon: "fa fa-floppy-o", texto: "NUEVO DOCUMENTO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "3", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR DOCUMENTO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "3", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "3", boton: { icon: "fa fa-pencil-square-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      { orig: "btnsEmpresa", paramAccion: "3", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },

    ];

    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if (element.paramAccion == 1) {
          element.permiso = true; element.showimg = true;
        } else {
          element.permiso = false; element.showimg = false;
        }
      });

    }, 10);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
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
        this.obtenerCatalogos()
        this.getCatalogos();
        this.getFiltersDocuments();
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getCatalogos() {
    let data = {
      id: 10
    }
    this.dataConsultarCatalogo = data;
  }

  getsucursales() {
    let data = {
      id_empresa: this.dataUser.id_empresa,
    }
    this.dataConsultarSucursal = data;
  }

  /* Section Documents */
  getFiltersDocuments() {
    this.seguridadServices.getSisFiltersDocuments().subscribe(res => {
      this.filters = res['data'];
      this.getEmpresa();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getEmpresa() {
    this.getDataTableEmpresa();
  }

  getDataTableEmpresa() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      /* scrollY: "200px",
      scrollCollapse: true, */
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.seguridadServices.getEmpresa().subscribe(res => {
      console.log(res);
      this.dataEmpresa = res['data'];
      this.lcargando.ctlSpinner(false);
      this.guardaT = res['data'];
      this.processing = true;
      this.validaDtUser = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.validaDtUser = true;
      this.guardaT = [];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    })
  }

  /* Obtener Usuario */
  getUsuario(com) {
    this.seguridadServices.getUsuario({ company: com }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataUsuario = res['data'];
      if (res['data'].length > 0) {
        this.usersEmpty = false
      } else {
        this.usersEmpty = true
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  obtenerCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      params: "'PRE_CATALOGO_FUNCIONAL','PRE_ORIENTACION_GASTO',''",
    }
    this.seguridadServices.obtenerCatalogos(data).subscribe(
      (res) => {
        console.log("datos", res);


        res['data']['PRE_ORIENTACION_GASTO'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.listaorientacion.push(f_pago);
        })
        res['data']['PRE_CATALOGO_FUNCIONAL'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.listafuncion.push(f_pago);
        })

        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
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

  guardarCatalogo() {
    this.validaNameGlobal(this.valorCatalogo, this.tipoCatalogo);
    setTimeout(() => {
      if (this.permisions[0].guardar == "0") {
        this.toastr.info("Usuario no tiene permiso para guardar");
      } else {
        if (this.tipoCatalogo == "" || this.tipoCatalogo == undefined) {
          this.toastr.info("Debe Ingresar un Grupo");
          let autFocus = document.getElementById("IdTipo").focus();
        } else if (this.isMultiple && this.isSubGroup && (this.subTipo == undefined || this.subTipo == "")) {
          document.getElementById("IdSubgrupo").focus();
          this.toastr.info(`Debe seleccionar un ${this.lbl}`);
        } else if (this.valorCatalogo == "" || this.valorCatalogo == undefined) {
          this.toastr.info("Debe Ingresar un valor");
          let autFocus = document.getElementById("IdValorCatalogo").focus();
        } else if (this.empresaSeleccionadoCatalogo == "" || this.empresaSeleccionadoCatalogo == undefined) {
          this.toastr.info("Debe seleccionar una empresa");
        } else if (this.estadoCatalogo == "" || this.estadoCatalogo == undefined) {
          this.toastr.info("Debe seleccionar un estado");
        } else if (this.valNameGlobal) {
          this.toastr.info("El valor ya se encuentra registrado");
          let autFocus = document.getElementById("IdValorCatalogo").focus();
        } else {
          this.confirmSave("Seguro desea guardar la información de nuevo catálogo?", "SET_CATALOG");
        }
      }
    }, 500);
  }

  validaNameGlobal(value, type) {
    let data = {
      valor: value,
      type: type
    }
    this.seguridadServices.getValidaNameGlobal(data).subscribe(res => {
      this.valNameGlobal = false;
    }, error => {
      this.valNameGlobal = true;
    })
  }

  obtenerEmpresaCatalogo(e) {
    this.empresaSeleccionadoCatalogo = e;
  }

  dnuevoCatalogo() {
    this.tipoCatalogo = undefined;
    this.subTipo = undefined;
    this.valorCatalogo = undefined;
    this.estadoCatalogo = undefined;
    this.empresaSeleccionadoCatalogo = undefined;
    this.desCatalogo = undefined;

    Swal.fire({
      title: "Atención",
      text: 'Escoge una opción',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Grupo`,
      cancelmButtonText: `Cancelar`,
      denyButtonText: `Valor`,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#E0A800',
      denyButtonColor: `#13A1EA`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isMultiple = false;
        this.newCatalogo = true;
        this.saveCatalogo = true;
        this.modCatalogo = false;
        this.dborrar = false;
        this.valueCatalogo = false;
      } else if (result.isDenied) {
        this.seguridadServices.getDistinctCatalog().subscribe(res => {
          this.groups = res['data'];
          this.isMultiple = true;
          this.newCatalogo = true;
          this.saveCatalogo = true;
          this.modCatalogo = false;
          this.dborrar = false;
          this.valueCatalogo = false;
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
    this.lcargando.ctlSpinner(true);
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

  modificarSucursal() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      this.confirmSave("Seguro desea actualizar la información de la sucursal?", "UPG_SUCURSAL");
    }
  }

  /* Esta función guarda los datos de la nueva empresa en formulario parametros */
  async guardarEmpresa() {
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if(this.emails == "" || this.emails == undefined || this.nombreComercial == "" || this.nombreComercial == undefined){
        this.toastr.info('revise los campos correp o nombre comercial, deben estar vacios')
      }else if(this.orientacion_gasto == 0 || this.orientacion_gasto == undefined){
        this.toastr.info('Debe seleccionar una Orientación')
      }else if(this.actividad == 0 || this.actividad == undefined){
        this.toastr.info('Debe seleccionar una Función')
      }else if(this.causaBaja == '' || this.causaBaja == undefined){
        this.toastr.info('Causa de baja no debe ser vacio')
      }
      else{
        this.lcargando.ctlSpinner(true);
        this.validarEmailExist(this.emails);
        let result = await this.validarEmpresaExist(this.nombreComercial).then(res => {
          this.lcargando.ctlSpinner(false);
          if (this.nombreComercial == "") {
            this.toastr.info("Debe Ingresar Nombre empresa");
            let autFocus = document.getElementById("IdnombreComercial").focus();
          } else if (this.razonsocial == "") {
            this.toastr.info("Debe Ingresar razon");
            let autFocus = document.getElementById("Idrsocial").focus();
          } else if (this.ruc == "") {
            this.toastr.info("Debe Ingresar ruc");
            let autFocus = document.getElementById("Idruc").focus();
          } else if (this.rucLegal == "") {
            this.toastr.info("Debe Ingresar ruc legal");
            let autFocus = document.getElementById("Idrlegal").focus();
          } else if (this.direccion == "") {
            this.toastr.info("Debe Ingresar una dirección");
            let autFocus = document.getElementById("Iddireccion").focus();
          } else if (this.telefono1 == "") {
            this.toastr.info("Debe Ingresar teléfono 1");
            let autFocus = document.getElementById("Idt1").focus();
          } else if (this.telefono2 == "") {
            this.toastr.info("Debe Ingresar teléfono 2");
            let autFocus = document.getElementById("Idt2").focus();
          } else if (this.celular == "") {
            this.toastr.info("Debe Ingresar celular");
            let autFocus = document.getElementById("Idcel").focus();
          } else if (this.emails == "") {
            this.toastr.info("Debe Ingresar un correo");
            let autFocus = document.getElementById("Idemail").focus();
          } else if (this.contacto == "") {
            this.toastr.info("Debe Ingresar un contacto");
            let autFocus = document.getElementById("Idcontacto").focus();
          } else if (this.estadoEmpresa == "") {
            this.toastr.info("Debe Seleccionar un estado");
          } else if (this.usersEmpresa == "") {
            this.toastr.info("Debe Ingresar cantidad de usuarios");
            let autFocus = document.getElementById("IdUserEmpresa").focus();
          } else if (this.sucursal == "") {
            this.toastr.info("Debe Ingresar cantidad de sucursales");
            let autFocus = document.getElementById("Idsucursal").focus();
          } else if (this.causaBaja == "") {
            this.toastr.info("Debe Ingresar una causa");
            let autFocus = document.getElementById("Idcausa").focus();
          } else if (!this.validarEmail(this.emails)) {
            this.toastr.info("Formato de correo invalido");
            let autFocus = document.getElementById("Idemail").focus();
          } else if (this.emailExist == true) {
            let autFocus = document.getElementById("Idemail").focus();
          } else if (this.empresaExist == true) {
            let autFocus = document.getElementById("IdnombreComercial").focus();
          } else {
            this.confirmSave("Seguro desea guardar la información de nuevo empresa?", "SET_COMPANY");
          }
        })
      }
    }
  }

  validarEmailExist(email) {
    let data = {
      email: email,
    }
    this.seguridadServices.getEmailExist(data).subscribe(res => {
      this.emailExist = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.emailExist = true;
      this.toastr.info(error.error.message);
    })
  }

  validarEmpresaExist(name) {
    return new Promise(resolve => {
      let data = {
        nombre_comercial: name
      }
      this.seguridadServices.getEmpresaExist(data).subscribe(res => {
        resolve(true);
        this.empresaExist = false;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.empresaExist = true;
        resolve(true);
        this.toastr.info(error.error.message);
      })
    });
  }

  validaSucursalExist(name) {
    return new Promise(resolve => {
      let data = {
        nombre: name
      }
      this.seguridadServices.getSucursalExist(data).subscribe(res => {
        resolve(true);
        this.sucursalExist = false;
      }, error => {
        resolve(true);
        this.sucursalExist = true;
        this.toastr.info(error.error.message);
      })
    });
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
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



  async guardarSucursal() {
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      this.lcargando.ctlSpinner(true);
      this.validarEmailSucursal(this.emailSucursal);
      let result = await this.validaSucursalExist(this.nombreSucursal).then(res => {
        this.lcargando.ctlSpinner(false);
        if (this.nombreSucursal == "") {
          this.toastr.info("Debe Ingresar Nombre de sucursal");
          let autFocus = document.getElementById("IdNombreSucu").focus();
        } else if (this.telefono1Sucu == "") {
          this.toastr.info("Debe Ingresar un número teléfono");
          let autFocus = document.getElementById("Idt1Sucu").focus();
        } else if (this.telefono2Sucu == "") {
          this.toastr.info("Debe Ingresar un número teléfono");
          let autFocus = document.getElementById("Idt2Sucu").focus();
        } else if (this.direccionSucu == "") {
          this.toastr.info("Debe Ingresar una dirección");
          let autFocus = document.getElementById("IddireccionSucu").focus();
        } else if (this.celularSucu == "") {
          this.toastr.info("Debe Ingresar un número de celular");
          let autFocus = document.getElementById("IdCelSucu").focus();
        } else if (this.emailSucursal == "") {
          this.toastr.info("Debe Ingresar un correo electrónico");
          let autFocus = document.getElementById("idEmailSucu").focus();
        } else if (this.estadoSucursal == "") {
          this.toastr.info("Debe seleccionar un estado");
        } /* else if (this.usuarioSeleccionado == 0) {
          this.toastr.info("Debe seleccionar un empleado");
        } */ else if (this.empresaSeleccionado == 0) {
          this.toastr.info("Debe seleccionar una empresa");
        } else if (this.sucursalExist == true) {
          let autFocus = document.getElementById("IdNombreSucu").focus();
        } else if (this.emailExist == true) {
          let autFocus = document.getElementById("idEmailSucu").focus();
        } else if (!this.validarEmail(this.emailSucursal)) {
          this.toastr.info("Formato de correo invalido");
          let autFocus = document.getElementById("idEmailSucu").focus();
        } else {
          this.confirmSave("Seguro desea guardar la información de nueva sucursal?", "SET_SUCURSAL");
        }
      });
    }
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
    this.validaDtUser = false;
    this.lcargando.ctlSpinner(true);
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getFiltersDocuments();
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

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = false;
    }
  }

  dnuevaSucursal() {
    if (this.permisions[0].agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      this.dguardarrol = false;
      this.dcancelarrol = false;
      this.dborrar = false;
      this.dcancelar = false;
      this.dmodificarrol = true;

      this.vmButtons[4].habilitar = true;
      this.vmButtons[5].habilitar = false;
      this.vmButtons[6].habilitar = true;
      this.vmButtons[7].habilitar = false;

      this.newSucursal = true;
      this.borrar();
    }
  }

  onselect(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (res) => {
        this.url = res.target.result;
      }
    }
  }

  validarImagen(e) {
    var fileSize = e.target.files[0].size;
    var siezekiloByte = parseInt(fileSize) / 1024;
    var div1 = document.getElementById("fichero");
    var align = div1.getAttribute("size");
    if (siezekiloByte > parseInt(align)) {
      this.toastr.info("Imagen muy grande, no puede superar los 40 kb");
      return false;
    } else {
      if (e.target.files) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (res) => {
          this.url = res.target.result;
        }
      }
    }
  }

  updateEmpresa(dt) {

    this.newtb = true;
    this.dusuario = false;
    this.dnew = true;
    this.dguardar = true;
    this.dmodificar = false;
    this.dcancelar = false;
    this.dborrar = false;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;

    this.nombreComercial = dt.nombre_comercial;
    this.razonsocial = dt.razon_social;
    this.ruc = dt.ruc;
    this.rucLegal = dt.r_legal;
    this.direccion = dt.direccion;
    this.telefono1 = dt.telefono1;
    this.telefono2 = dt.telefono2;
    this.celular = dt.celular;
    this.emails = dt.email;
    this.contacto = dt.contacto;
    this.estadoEmpresa = dt.estado;
    this.causaBaja = dt.causa_baja;
    this.usersEmpresa = dt.usuarios;
    this.sucursal = dt.sucursales;
    this.empresaIdUpdate = dt.id_empresa;
    (dt.logo_empresa == null || dt.logo_empresa == undefined) ? this.url = "assets/img/avatars/file.png" : this.url = dt.logo_empresa;
    this.orientacion_gasto = dt.orientacion_gasto;
    this.actividad = dt.actividad;
  }

  borrar() {
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
    this.estadoEmpresa = 'A';
    this.causaBaja = '';
    this.fromDatePicker = new Date();
    this.toDatePicker = new Date();
    this.usersEmpresa = "";
    this.sucursal = "";
    this.url = "/assets/img/avatars/file.png";
    this.dnew = false;
    this.dguarda = true;
    this.dmodificar = true;

    this.empresaSeleccionado = 0;
    this.empleadoSeleccionado = undefined;
    this.usuarioSeleccionado = 0;
    this.estadoSucursal = "A";
    this.emailSucursal = "";
    this.celularSucu = "";
    this.direccionSucu = "";
    this.nombreSucursal = "";
    this.telefono1Sucu = "";
    this.telefono2Sucu = "";

    this.empresaSeleccionadoCatalogo = "";
    this.estadoCatalogo = "";
    this.valorCatalogo = "";
    this.desCatalogo = "";
    this.tipoCatalogo = "";

    this.saveCatalogo = false;
    this.modCatalogo = false;
    this.valueCatalogo = false;

    /* catalogo */
    this.subTipo = undefined;

    this.orientacion_gasto = 0;
    this.actividad = 0;
  }

  cancelar() {
    location.reload();
  }

  modificarEmpresa() {
    if (this.permisions[0].modificar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      this.confirmSave("Seguro desea actualizar la información de la empresa?", "UPG_COMPANY");
    }
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
        if (action == "SET_COMPANY") {
          this.setCompany();
        } else if (action == "UPG_COMPANY") {
          this.updCompany();
        } else if (action == "SET_SUCURSAL") {
          this.setSucursal();
        } else if (action == "UPG_SUCURSAL") {
          this.updSucursal();
        } else if (action == "SET_CATALOG") {
          this.setCatalog();
        } else if (action == "UPG_CATALOG") {
          this.updCatalog();
        } else if (action == "UPG_DOC") {
          this.updDocument();
        }
      }
    })
  }

  setCompany() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.nombreComercial} como nueva empresa`,
      id_controlador: myVarGlobals.fUParametros,
      nombre: this.nombreComercial,
      razon: this.razonsocial,
      ruc: this.ruc,
      rucl: this.rucLegal,
      direccion: this.direccion,
      telf1: this.telefono1,
      telf2: this.telefono2,
      celular: this.celular,
      email: this.emails,
      contactos: this.contacto,
      f_alta: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      f_baja: moment(this.toDatePicker).format('YYYY-MM-DD'),
      estado: this.estadoEmpresa,
      usuario: this.usersEmpresa,
      sucursal: this.sucursal,
      causa: this.causaBaja,
      logo_empresa: this.url,
      orientacion_gasto: this.orientacion_gasto,
      actividad : this.actividad
    }
    this.seguridadServices.setempresa(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancelarEmpresa();
      setTimeout(() => {
        this.getsucursales();
        this.getCatalogos();
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  updCompany() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de información empresa: ${this.nombreComercial}`,
      id_controlador: myVarGlobals.fUParametros,
      nombre: this.nombreComercial,
      razon: this.razonsocial,
      ruc: this.ruc,
      rucl: this.rucLegal,
      direccion: this.direccion,
      telf1: this.telefono1,
      telf2: this.telefono2,
      celular: this.celular,
      email: this.emails,
      contactos: this.contacto,
      f_alta: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      f_baja: moment(this.toDatePicker).format('YYYY-MM-DD'),
      estado: this.estadoEmpresa,
      usuario: this.usersEmpresa,
      sucursal: this.sucursal,
      causa: this.causaBaja,
      logo_empresa: this.url,
      id_empresa: this.empresaIdUpdate,
      orientacion_gasto: this.orientacion_gasto,
      actividad : this.actividad
    }
    this.seguridadServices.updateEmpresa(data).subscribe(res => {
      this.empresaIdUpdate = undefined;
      this.toastr.success(res['message']);
      this.cancelarEmpresa();
      setTimeout(() => {
        this.getsucursales();
        this.getCatalogos();
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  setSucursal() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.nombreSucursal} como nueva sucursal`,
      id_controlador: myVarGlobals.fUParametros,
      nombreSucursal: this.nombreSucursal,
      t1: this.telefono1Sucu,
      t2: this.telefono2Sucu,
      direccion: this.direccionSucu,
      celular: this.celularSucu,
      email: this.emailSucursal,
      administrador: this.usuarioSeleccionado,
      estado: this.estadoSucursal,
      id_empresa: this.empresaSeleccionado
    }

    this.seguridadServices.saveRowSucursal(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      let data = {
        id: 7
      }
      this.toastr.success(res['message']);
      this.dguardarrol = true;
      this.borrar();
      this.dataConsultarSucursal = undefined;
      setTimeout(() => {
        this.dataConsultarSucursal = data;
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  updSucursal() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de información sucursal ${this.nombreSucursal}`,
      id_controlador: myVarGlobals.fUParametros,
      id_sucursal: this.updateSucursal.id_sucursal,
      nombreSucursal: this.nombreSucursal,
      t1: this.telefono1Sucu,
      t2: this.telefono2Sucu,
      direccion: this.direccionSucu,
      celular: this.celularSucu,
      email: this.emailSucursal,
      administrador: this.usuarioSeleccionado,
      estado: this.estadoSucursal,
      id_empresa: this.empresaSeleccionado
    }
    this.seguridadServices.updateSucursal(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dmodificarrol = true;
      this.borrar();
      this.toastr.success(res['message']);
      this.dataConsultarSucursal = undefined;
      setTimeout(() => {
        this.dataConsultarSucursal = { id: 7 };
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  setCatalog() {
    this.lcargando.ctlSpinner(true);
    var data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.valorCatalogo} como nuevo catálogo`,
      id_controlador: myVarGlobals.fUParametros,
      tipo: this.tipoCatalogo,
      group: null,
      descripcion: this.desCatalogo,
      valor: this.valorCatalogo,
      estado: this.estadoCatalogo,
      id_empresa: this.empresaSeleccionadoCatalogo
    }
    if (this.isMultiple && this.isSubGroup && (this.subTipo !== undefined || this.subTipo !== "")) {
      data["group"] = this.subTipo;
    }
    this.seguridadServices.saveRowCatalogo(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.borrar();
      this.dataConsultarCatalogo = undefined;
      setTimeout(() => {
        this.dataConsultarCatalogo = { id: 10 };
      }, 300);
      setTimeout(() => {
        this.getsucursales();
        this.getCatalogos();
        this.getFiltersDocuments();
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
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
      descripcion: this.desCatalogo,
      estado: this.estadoCatalogo,
      id_empresa: this.empresaSeleccionadoCatalogo,
      id_catalogo: this.dataModifyCatalogo.id_catalogo
    }

    this.seguridadServices.updateCatalogo(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.borrar();
      this.dataConsultarCatalogo = undefined;
      setTimeout(() => {
        this.dataConsultarCatalogo = { id: 10 };
      }, 300);
      setTimeout(() => {
        this.getsucursales();
        this.getCatalogos();
        this.getFiltersDocuments();
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  validateSubgroup(event) {
    /* Clear params */
    this.lbl = "";
    this.subgroups = [];
    this.isSubGroup = false;

    /* Add new params */
    if (event == 'MODELOS' || event == 'PROVINCIA' || event == 'CIUDAD') {
      this.isSubGroup = true;
      this.lbl = (event == 'MODELOS') ? 'Marca' : (event == 'PROVINCIA') ? 'País' : 'Provincia';

      let data = {
        tipo: (event == 'MODELOS') ? 'MARCAS' : (event == 'PROVINCIA') ? 'PAIS' : 'PROVINCIA',
      }
      this.seguridadServices.getCatalogByType(data).subscribe(res => {
        this.subgroups = res['data'];
      }, error => {
        this.toastr.info(error.error.message);
      })
    } else {
      this.isSubGroup = false;
      this.lbl = "";
    }
  }

  cancelarEmpresa() {
    this.borrar();
    this.dnew = false;
    this.newtb = false;
    this.dusuario = true;
    this.dguardar = true;
    this.dcancelar = true;
    this.dborrar = true;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.rerender();
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

    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;
    this.vmButtons[6].habilitar = true;
    this.vmButtons[7].habilitar = true;

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
      this.lcargando.ctlSpinner(false);
      this.cancelDocument();
      this.commonServices.dtSModifyDocuments.next(null);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  cancelDocument() {
    this.selectFilters = undefined;
    this.documents = { aprobaciones: false };
    this.actionsDoc.edit = false;
    this.actionsDoc.cancel = false;
  }

  clearSwitchFilter() {
    this.selectFilters = undefined;
  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1NUEVO":
        this.dnuevo();
        break;
      case "1GUARDAR":
        this.guardarEmpresa();
        break;
      case "1MODIFICAR":
        this.modificarEmpresa();
        break;
      case "1CANCELAR":
        this.cancelarEmpresa();
        break;


      case "2NUEVO":
        this.dnuevaSucursal();
        break;
      case "2GUARDAR":
        this.guardarSucursal();
        break;
      case "2MODIFICAR":
        this.modificarSucursal();
        break;
      case "2CANCELAR":
        this.cancelarSucursal();
        break;

      case "3NUEVO PUNTO EMISION":
        this.vmButtons[8].habilitar = false;
        this.vmButtons[9].habilitar = false;
        this.vmButtons[10].habilitar = true;
        this.vmButtons[11].habilitar = true;
        this.vmButtons[12].habilitar = true;
        this.vmButtons[13].habilitar = true;
        this.vmButtons[14].habilitar = false;
        this.commVarSrv.listeButtonEmpresa.next(1);
        break;
      case "3GUARDAR":
        this.commVarSrv.listeButtonEmpresa.next(2);
        break;
      case "3NUEVO DOCUMENTO":
        this.vmButtons[8].habilitar = true;
        this.vmButtons[9].habilitar = true;
        this.vmButtons[10].habilitar = true;
        this.vmButtons[11].habilitar = false;
        this.vmButtons[12].habilitar = true;
        this.vmButtons[13].habilitar = true;
        this.vmButtons[14].habilitar = false;
        this.commVarSrv.listeButtonEmpresa.next(3);
        break;
      case "GUARDAR DOCUMENTO":
        this.commVarSrv.listeButtonEmpresa.next(4);
        break;
      case "3MODIFICAR":
        this.commVarSrv.listeButtonEmpresa.next(5);
        break;
      case "3ELIMINAR":
        this.commVarSrv.listeButtonEmpresa.next(6);
        break;
      case "3CANCELAR":

        this.vmButtons[8].habilitar = false;
        this.vmButtons[9].habilitar = true;
        this.vmButtons[10].habilitar = false;
        this.vmButtons[11].habilitar = true;
        this.vmButtons[12].habilitar = true;
        this.vmButtons[13].habilitar = true;
        this.vmButtons[14].habilitar = false;
        this.commVarSrv.listeButtonEmpresa.next(7);
        break;
    }
  }


}
