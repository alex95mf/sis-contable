import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { SeguridadService } from './seguridad.service'
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServices'
import { CommonVarService } from '../../../../services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import Swal, { SweetAlertResult } from 'sweetalert2';


@Component({
standalone: false,
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.scss']
})
export class SeguridadComponent implements OnDestroy, OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('mdaCategorias') ng_categorias: NgSelectComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  contador: any = 0;
  contadorDoc: any = 0;
  updateRoldata: any;
  dataEmpresa: any;
  dataSucursal: any;
  sucursalSeleccionado: any;
  empresaSeleccionado: any;
  perfilSeleccionadoUser: any;
  ipSave: any;
  disbledSucursal: any = false;
  permisions: any = [];
  dataConsultar: any = {};
  dataConsultarRol: any;
  rolSeleccionado: any;
  perfilSeleccionado: any;
  componenteSeleccionado: any = undefined;
  disbledComp: any;
  term: string = 'null';
  dataUser: any;
  dataTablesParameters: any = {};
  startList = 0;
  Alltransactions: any = [];
  changeTransaction: any = "";
  dataT: any = [];
  validaDt: any = false;
  validaDtUser: any = false;
  guardaT: any = [];
  roles: any;
  perfiles: any;
  componentes: any;
  nombres: any;
  usuarios: any;
  emails: any;
  claves: any;
  fentrada: any;
  fsalida: any;
  eusuario: any = "A";
  files: any;
  noms: any;
  clas: any;
  eperfil: any = "A";
  dguardar: any = true;
  dmodificar: any = true;
  dcancelar: any = true;
  dguardarrol: any = true;
  dmodificarrol: any = true;
  dcancelarrol: any = true;
  userIdUpdate: any;
  uploadFile: any;
  url: any = "assets/img/avatars/prueba1.png";
  urlFirma: any = "assets/img/firma-logo.png";
  guardarolT: any = [];
  dborrar: any = true;
  dusuario: any = true;
  dnew: any = false;
  newtb: any = false;
  dguarda: any = false;
  emailValido: any = false;
  emailExist: any;
  userExist: any;
  rolExist: any;
  processing: any = false;
  documentpermision: any = [];
  docSeleccionado: any;
  dataConsultarDoc: any;
  dataFilterSelect: any
  dbtnSaveDocPerm: any = false;
  dataSaveDocPermi: any;
  filter: any;
  paginate: any;
  departamentoSelect: any = {
    dep_nombre:""
  };
  usuarioExiste:any = [];

  estadoSelected = null
  estadoList = [
    {value: "A",label: "Activo"},
    {value: "I",label: "Inactivo"},
  ]

  cmb_mesaayuda_atiende: any[] = [
    { value: 'SI', label: 'SI' },
    { value: 'NO', label: 'NO' },
  ]
  cmb_mesaayuda_categoria: any[] = []
  mda_atiende: string = 'NO'
  mda_categoria: string|null = null;

  fileList: FileList;
  firmaDigital: any = null;
  firmaPassword: SweetAlertResult


  constructor(private seguridadServices: SeguridadService, private comVsrv: CommonVarService,
    private toastr: ToastrService, private router: Router, private zone: NgZone,
    private commonServices: CommonService, private modalService: NgbModal) {
    this.commonServices.setDataRol.asObservable().subscribe(res => {
      this.updateRoldata = res;
      this.noms = this.updateRoldata.nombre_rol;
      this.eperfil = this.updateRoldata.estado;
      this.dmodificarrol = false;
      this.dguardarrol = true;

      this.vmButtons[4].habilitar = true;
      this.vmButtons[5].habilitar = true;
      this.vmButtons[6].habilitar = false;
      this.vmButtons[7].habilitar = false;
    })
    this.commonServices.actionDocResponse.asObservable().subscribe(res => {
      this.confirmSave("Seguro desea actualizar los permisos?", "SAVE_PERMISIONS_DOC");
      console.log(res);
      this.dataSaveDocPermi = res;
    })
    this.commonServices.activateSaveBtn.asObservable().subscribe(res => {
      this.dbtnSaveDocPerm = true;
    })

    this.comVsrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true); : this.lcargando.ctlSpinner(false);
    })
    this.comVsrv.departamentoSelect.asObservable().subscribe(
      (res)=>{
        this.departamentoSelect = res;

        //console.log(this.departamentoSelect)
      }
    )

    this.filter ={
      usuario: null,
      nombre: null,
      estado: 'A',
      filterControl: ""
    };

    this.paginate= {
      pageIndex: 0,
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [5, 10,20,50]
    }

  }

  vmButtons: any = [];
  idBotones:any = "";
  dinamicoBotones(valor:any){
    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if(element.paramAccion == valor){
          element.permiso = true; element.showimg = true;
        }else{
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);

  }

  ngOnInit() {

    this.vmButtons = [
      { orig: "btnsSeguridad", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "1", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},

      { orig: "btnsSeguridad", paramAccion: "2", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "2", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "2", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},

      { orig: "btnsSeguridad", paramAccion: "3", boton: { icon: "fa fa-hourglass-start", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "3", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},

      { orig: "btnsSeguridad", paramAccion: "4", boton: { icon: "fa fa-hourglass-start", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsSeguridad", paramAccion: "4", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if(element.paramAccion == 1){
          element.permiso = true; element.showimg = true;
        }else{
          element.permiso = false; element.showimg = false;
        }
      });

    }, 10);

    setTimeout(() => {
      (this as any).mensajeSpinner = 'Cargando datos Iniciales'
      this.lcargando.ctlSpinner(true);
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      let id_rol = this.dataUser.id_rol;
      let data = {
        id: 2,
        codigo: myVarGlobals.fSeguridades,
        id_rol: id_rol
      }
      this.seguridadServices.getPermisionsGlobas(data).subscribe(res => {
        this.permisions = res['data'];
        if (this.permisions[0].ver == "0") {
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Seguridades");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          // this.getPerfiles();
          this.getMdaCategorias()
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }, 10);
  }

  metodoGlobal(evento: any) {
    console.log(evento);
    switch (evento.items.paramAccion+evento.items.boton.texto) {
      case "1NUEVO":
        this.dnuevo();
      break;
      case "1GUARDAR":
        this.validateSaveUserAsync();
      break;
      case "1MODIFICAR":
        this.validaModificarUser();
      break;
      case "1CANCELAR":
        this.borrar();
      break;


      case "2NUEVO":
        this.dnuevorol();
      break;
      case "2GUARDAR":
        this.validaSaveRol();
      break;
      case "2MODIFICAR":
        this.validaUpdateRol();
      break;
      case "2CANCELAR":
        this.borrar();
      break;


      case "3CONSULTAR":
        this.consultar();
      break;
      case "3MODIFICAR":
        this.savePermisionsComponent();
      break;


      case "4CONSULTAR":
        this.consultarDocuments();
      break;
      case "4GUARDAR":
        this.validaSavePermisionsDoc();
      break;
    }
  }


  showPass() {
    var tipo = document.getElementById("password").getAttribute("type")
    if (tipo == "password") {
      document.getElementById("password").setAttribute("type", "text");
    } else {
      document.getElementById("password").setAttribute("type", "password");
    }
  }

  async getSucursal() {
    let data = {
      id_empresa: this.empresaSeleccionado
    }

    try {
      const response = await this.seguridadServices.getSucursales(data) as any
      //
      this.dataSucursal = response['data'];
      this.disbledSucursal = true;
      // this.lcargando.ctlSpinner(false);
    } catch (err) {
      console.log(err)
      // this.lcargando.ctlSpinner(false);
      this.toastr.info("No existen sucursales para esta empresa");
    }
  }

  obtenerEmpresa(e) {
    this.empresaSeleccionado = e;
    this.getSucursal();
  }

  obtenerSucursal(e) {
    console.log('obtenerSucursal', e);
    this.sucursalSeleccionado = e;
  }

  obtenerPerfilUserSelected(e) {
    this.perfilSeleccionadoUser = e;
  }

  validaUpdateRol() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      this.confirmSave("Seguro desea Actualizar la información del rol?", "UPDATE_ROL");
    }
  }

  updateRol() {
    this.lcargando.ctlSpinner(true);
    let data = {
      id_rol: this.updateRoldata.id_rol,
      nombre_rol: this.noms,
      estado: this.eperfil,
      ip: this.commonServices.getIpAddress(),
      id_usuario: this.dataUser.id_usuario,
      id_sucursal: this.dataUser.id_sucursal,
      accion: "Actualización de rol",
      id_controlador: myVarGlobals.fSeguridades,
      id_empresa: this.updateRoldata.id_empresa
    }

    console.log(data);
    this.seguridadServices.updateRol(data).subscribe(res => {
      console.log(res)
      this.toastr.success(res['message']);
      this.dataConsultarRol = undefined;
      this.noms = "";
      this.eperfil = undefined;

      this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = true;
      this.vmButtons[6].habilitar = true;
      this.vmButtons[7].habilitar = true;
      this.seguridadServices.listaRoles$.emit(res)
      this.getRoles();
      this.lcargando.ctlSpinner(false);

      setTimeout(() => {
        this.dataConsultarRol = { id: 1 };
      }, 500);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  //esta funcion guarda los datos del usuario en formulario seguridades
  async validateSaveUserAsync() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validaSaveUser().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la información de nuevo usuario?", "SAVE_USER");
        }
      })
    }
  }

  validaSaveUser() {
    let flag = false;
    return new Promise((resolve, reject) => {
      this.validarEmailExist(this.emails);
     // this.validarUserExist(this.usuarios);
      // let data = {
      //   username: this.usuarios
      // }

      // this.seguridadServices.getUserExist(data).subscribe(res => {

      //   this.usuarioExiste = res['data'];
      //   console.log(res['data'])
      // }, error => {
      //   this.toastr.info(error.error.message);
      // });
      // else if(this.usuarioExiste > 0){
      //   this.toastr.info("El nombre de usuario ya existe");
      // }

      // console.log(this.usuarioExiste)

      this.ipSave = this.commonServices.getIpAddress();
      if (this.permisions[0].guardar == "0") {
        this.toastr.info("Usuario no tiene permiso para guardar");
      }else {
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        let id_empresa = this.dataUser.id_empresa;
        if (this.nombres == undefined || this.nombres == "") {
          this.toastr.info("Debe Ingresar Nombre !!");
          document.getElementById("Idnombre").focus();
        } else if (this.usuarios == undefined || this.usuarios == "") {
          this.toastr.info("Debe Ingresar Usuario");
          document.getElementById("Idusuario").focus();
        } else if (this.emails == undefined || this.emails == "") {
          this.toastr.info("Debe Ingresar Correo ejemplo@gmail.com");
          document.getElementById("Idemail").focus();
        }
        else if (this.claves == undefined || this.claves == "") {
          this.toastr.info("Debe Ingresar Contraseña");
          document.getElementById("password").focus();
        }
        else if (this.fentrada == undefined || this.fentrada == "") {
          this.toastr.info("Debe Ingresar hora de Entrada!!");
          document.getElementById("fechae").focus();
        }
        else if (this.fsalida == undefined || this.fsalida == "") {
          this.toastr.info("Debe Ingresar hora de Salida !!");
          document.getElementById("fechas").focus();
        }
        else if (this.rolSeleccionado == undefined) {
          this.toastr.info("Debe Seleccionar rol Usuario!!");
        }
        else if (this.empresaSeleccionado == undefined) {
          this.toastr.info("Debe Seleccionar una empresa !!");
        }
        else if (this.sucursalSeleccionado == undefined) {
          this.toastr.info("Debe Seleccionar una sucursal !!");
        }
        // else if (this.perfilSeleccionadoUser == undefined) {
        //   this.toastr.info("Debe Seleccionar un perfil !!");
        // }
        else if (!this.validarEmail(this.emails)) {
          this.toastr.info("El correo no es válido !!");
          document.getElementById("Idemail").focus();
        } else if (this.emailExist == true) {
          this.toastr.info("Correo ya existe !!");
          document.getElementById("Idemail").focus();
        } else if (this.userExist == true) {
          this.toastr.info("Usuario ya existe !!");
          document.getElementById("Idusuario").focus();
        }
        else {
          resolve(true);
        }
      }
    });
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_USER") {
          this.saveNewUser();
        } else if (action == "UPDATE_ROL") {
          this.updateRol();
        } else if (action == "SAVE_ROL") {
          this.guardarRol();
        } else if (action == "MOD_USER") {
          this.modifyUser();
        } else if (action == "SAVE_PERMISIONS_DOC") {
          this.savePermisionDoc();
        }
      }
    })
  }

  async saveNewUser() {
    this.lcargando.ctlSpinner(true);
    let data = {
      rol: this.rolSeleccionado,
      usuario: this.usuarios,
      nombre: this.nombres,
      clave: this.claves,
      email: this.emails,
      avatar: this.url,
      firma: this.urlFirma,
      h_entrada: this.fentrada,
      h_salida: this.fsalida,
      perfil: this.perfilSeleccionadoUser,
      estado: this.eusuario,
      ip: this.commonServices.getIpAddress(),
      id_usuario: this.dataUser.id_usuario,
      id_sucursal: this.sucursalSeleccionado.id_sucursal,
      accion: "Registro de nuevo usuario " + this.nombres,
      id_controlador: myVarGlobals.fSeguridades,
      id_empresa: this.empresaSeleccionado,
      id_departamento:this.departamentoSelect.id_departamento,
      mesa_ayuda: this.mda_atiende,
      categoria: (this.mda_atiende == 'SI') ? this.mda_categoria : null,
    }
    if (this.fileList?.length > 0) {
      this.firmaPassword = await Swal.fire({
        titleText: 'Ingrese contraseña de Firma Digital',
        input: 'password',
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar la contraseña!'
          }
        },
        inputLabel: 'Contraseña',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        }
      })
    }
    console.log(data);
    this.seguridadServices.saveRow(data).subscribe(
      async (res: any) => {
        console.log(res);

        if (this.firmaPassword?.value) {
          try {
            let dataAnexo = {
              // Informacion para almacenamiento de anexo y bitacora
              module: this.permisions[0].id_modulo,
              component: myVarGlobals.fSeguridades,  // TODO: Actualizar cuando formulario ya tenga un ID
              identifier: res.data.id_usuario,
              custom1: this.firmaPassword.value,
              id_controlador: myVarGlobals.fSeguridades,  // TODO: Actualizar cuando formulario ya tenga un ID
              accion: `Nuevo anexo Firma Digital para Usuario ${res.data.id_usuario}`,
              ip: this.commonServices.getIpAddress(),
            }

            let response = await this.seguridadServices.fileService(this.fileList[0], dataAnexo);
            console.log(response)
          } catch (err) {
            console.log(err)
            this.toastr.warning(err.error?.message, 'Firma Digital')
          }
        }

        this.toastr.success("Datos guardados con éxito");
        this.borrar();
        this.getRoles();
        this.lcargando.ctlSpinner(false);
        // this.dtElement.dtInstance.then((dtInstance: any) => {
        //   dtInstance.destroy();
        //   this.getRoles();
        // });

      },
    (error: any) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  validarEmailExist(email) {
    this.emailExist = false;
    let data = {
      email: email
    }
    this.seguridadServices.getEmailExist(data).subscribe(res => {
      if (res['data'].length == 0) {
        this.emailExist = false;
      } else {
        this.emailExist = true;
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  validarUserExist(user) {
    this.userExist = false;
    let data = {
      username: user
    }
    this.seguridadServices.getUserExist(data).subscribe(res => {

      if (res['data'].length == 0) {
        this.userExist = false;
      } else {
        this.userExist = true;
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }



  getDataTableUser(flag: boolean = false) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    if (flag) Object.assign(this.paginate, { pageIndex: 0, page: 1 })
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    console.log(data);

    this.lcargando.ctlSpinner(true);
    this.seguridadServices.presentaTablaUser(data).subscribe(
      res => {
        console.log('actualza tabla usuarios')
        console.log(res);

        this.validaDtUser = true;
        // this.guardaT = res['data'];
        this.paginate.length = res['data']['total'];
        this.guardaT = res['data']['data']

        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      },
      error => {
        console.log(error);
        this.validaDtUser = true;
        this.guardaT = [];

        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      });
  }

  asignarEstado(evt) {
    if(evt!=null){
      this.filter.estado = evt.value
    }

   }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getDataTableUser();
  }

  limpiarFiltros(){
    this.filter ={
      usuario: null,
      nombre: null,
      estado: null,
      filterControl: ""
    };
    this.estadoSelected = null

    this.paginate= {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }

  validaSaveRol() {
    this.validaRolExist(this.noms);
    setTimeout(() => {
      if (this.permisions[0].guardar == "0") {
        this.toastr.info("Usuario no tiene permiso para guardar");
      } else {
        if (this.noms == undefined) {
          let autFocus = document.getElementById("Idrol").focus();
          this.toastr.info("Debe Ingresar Nombre del Rol !!");
        } else if (this.eperfil == undefined) {
          this.toastr.info("Debe Selecionar Estado del Rol");
        } else if (this.rolExist == true) {
          let autFocus = document.getElementById("Idrol").focus();
          this.toastr.info("Nombre rol ya existe");
        } else {
          this.confirmSave("Seguro desea guardar la información de nuevo rol?", "SAVE_ROL");
        }
      }
    }, 1000);
  }

  guardarRol() {
    this.lcargando.ctlSpinner(true);
    let data = {
      nombreRol: this.noms,
      estado: this.eperfil,
      id_empresa: this.commonServices.getDataUserLogued().id_empresa,
      ip: this.commonServices.getIpAddress(),
      accion: "Creación de nuevo rol " + this.noms,
      id_controlador: myVarGlobals.fSeguridades
    }
    this.seguridadServices.saveRowdos(data).subscribe(res => {
      console.log('guarda rol')
      let data = {
        id: 1
      }
      this.toastr.success(res['message']);
      this.dataConsultarRol = undefined;
      this.noms = "";
      this.eperfil = undefined;

      this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = true;
      this.vmButtons[6].habilitar = true;
      this.vmButtons[7].habilitar = true;
      this.lcargando.ctlSpinner(false);
      this.getRoles();
      setTimeout(() => {
        this.dataConsultarRol = data;
      }, 500);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  validaRolExist(namerol) {
    this.rolExist = false;
    let data = {
      namerol: namerol
    }
    this.seguridadServices.getRolExist(data).subscribe(res => {
      if (res['data'].length == 0) {
        this.rolExist = false;
      } else {
        this.rolExist = true;;
      }
    }, error => {
      this.toastr.info(error.error.message);;
    })
  }

  handleCategorias(event) {
    console.log(event)
    if (event.value == 'SI')
      this.ng_categorias.setDisabledState(false)
    else {
      this.mda_categoria = null
      this.ng_categorias.setDisabledState(true)
    }
  }

  async getMdaCategorias() {
    let categorias = await this.seguridadServices.getMdaCategorias({params: "'MDA_CATEGORIA'"})
    console.log(categorias)
    this.cmb_mesaayuda_categoria = categorias['MDA_CATEGORIA']

    this.getPerfiles()
  }

  getPerfiles() {
    this.seguridadServices.getPerfil().subscribe(resperfil => {
      this.perfiles = resperfil['data'];
      this.getEmpresa();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getEmpresa() {
    this.seguridadServices.getEmpresa().subscribe(res => {
      this.dataEmpresa = res['data'];
      this.getRoles();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getRoles() {
    let data = {
      id: 1
    }
    this.dataConsultarRol = data;
    this.seguridadServices.getRol(data).subscribe(resrol => {
      console.log('obtiene roles')
      this.roles = resrol['data'];
      this.getDocumentsPermision();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDocumentsPermision() {
    this.seguridadServices.getDocumentsPermisions().subscribe(res => {
      console.log('getDocumentsPermisions')
      this.getDataTableUser();
      this.documentpermision = res['data'];
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getComponentes() {
    let data = {
      id_modulo: this.perfilSeleccionado
    }
    this.seguridadServices.getComponentes(data).subscribe(respComponentes => {
      this.componentes = respComponentes['data'];
      this.disbledComp = true;
      this.componenteSeleccionado = undefined;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }


  obtenerRol(e) {
    this.rolSeleccionado = e;
  }

  obtenerPerfil(e) {
    this.lcargando.ctlSpinner(true);
    this.componentes = undefined;
    this.perfilSeleccionado = e;
    this.getComponentes();
  }

  obtenerComponente(e) {
    this.componenteSeleccionado = e;
  }

  consultar() {
    this.seguridadServices.resetPermisosComponentes$.emit();

    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      if (this.rolSeleccionado == undefined) {
        this.toastr.info("Debe seleccionar un rol !!");
      } else if (this.perfilSeleccionado == undefined) {
        this.toastr.info("Debe seleccionar un perfil !!");
      } else if (this.componenteSeleccionado == undefined) {
        this.toastr.info("Debe seleccionar un Componente !!");
      } else {
        localStorage.setItem('rol_seleccionado', this.rolSeleccionado);
        let data = {
          id_rol: this.rolSeleccionado,
          id_modulo: this.perfilSeleccionado,
          tipo_componente: this.componenteSeleccionado
        }
        /* this.contador += 1;
        if (this.contador == 1) {
          console.log(5);
          this.dataConsultar = data;
        } else { */
        this.commonServices.refreshData.next(data);
        //}
      }
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }


  dnuevo() {
    if (this.permisions[0].agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      this.dusuario = false;
      this.dguardar = false;
      this.dcancelar = false;
      this.dborrar = false;

      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = false;
    }
  }

  dnuevorol() {
    if (this.permisions[0].agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      this.dguardarrol = false;
      this.dcancelarrol = false;
      this.dborrar = false;
      this.dmodificarrol = true;

      this.vmButtons[5].habilitar = false;
      this.vmButtons[6].habilitar = true;
      this.vmButtons[7].habilitar = false;
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

  onselectFirma(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (res) => {
        this.urlFirma = res.target.result;
      }
    }
  }

  async updateUser(dt) {

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;

    this.newtb = false;
    this.dusuario = false;
    this.dnew = true;
    this.dguarda = true;
    this.dmodificar = false;
    this.dcancelar = false;
    this.dborrar = false;
    let data = {
      id_user: dt.id_usuario
    }

    (this as any).mensajeSpinner = "Seteando valores...";
    this.lcargando.ctlSpinner(true);
    this.seguridadServices.updateUser(data).subscribe(
      async (res: any) => {
        console.log(res)
        this.mda_atiende = res['data'][0]['mesa_ayuda'];
        this.mda_categoria = res['data'][0]['categoria'];
        this.empresaSeleccionado = res['data'][0].id_empresa;
        this.userIdUpdate = res['data'][0].id_usuario;
        this.nombres = res['data'][0].nombre;
        this.usuarios = res['data'][0].usuario;
        this.emails = res['data'][0].email;
        this.claves = res['data'][0].contrasena;
        this.fentrada = res['data'][0].hora_entrada;
        this.fsalida = res['data'][0].hora_fin;
        this.rolSeleccionado = res['data'][0].id_rol;
        this.eusuario = res['data'][0].estado;
        (res['data'][0].avatar == "" || res['data'][0].avatar == null) ? this.url = "/assets/img/avatars/prueba1.png" : this.url = res['data'][0].avatar;
        (res['data'][0].firma == "" || res['data'][0].firma == null) ? this.urlFirma = "assets/img/firma-logo.png" : this.urlFirma = res['data'][0].firma;
        this.empresaSeleccionado = res['data'][0].id_empresa;
        await this.getSucursal();
        this.sucursalSeleccionado = res['data'][0].id_sucursal;
        this.perfilSeleccionadoUser = res['data'][0].perfil;

        Object.assign(this.departamentoSelect, res['data'][0]['department'] ?? {dep_nombre: ''})
        // if(dt.departamento!=null){
        //   this.departamentoSelect.dep_nombre = dt.departamento.dep_nombre;
        // }else {
        //   this.departamentoSelect.dep_nombre = '';
        // }

      if (this.mda_categoria != null) this.ng_categorias.setDisabledState(false)
      else  this.ng_categorias.setDisabledState(true)

      try {
        let anexo = await this.seguridadServices.getAnexo({
          module: this.permisions[0].id_modulo,
          component: myVarGlobals.fSeguridades,
          identifier: res.data[0].id_usuario,
        });
        console.log(anexo)
        this.firmaDigital = anexo[0]
        //
      } catch (err) {
        console.log(err)
        this.toastr.warning(err.error?.message)
      }

      this.lcargando.ctlSpinner(false);
    },
    (error: any) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error?.message);
    })
  }

  borrar() {
    this.nombres = '';
    this.usuarios = '';
    this.emails = '';
    this.claves = '';
    this.fentrada = '';
    this.fsalida = '';
    this.rolSeleccionado = undefined;
    this.empresaSeleccionado = undefined;
    this.sucursalSeleccionado = undefined;
    this.perfilSeleccionadoUser = undefined;
    this.departamentoSelect.dep_nombre = '',
    this.eusuario = 'A';
    this.noms = '';
    this.eperfil = 'A';
    this.dnew = false;
    this.dguarda = false;
    this.dmodificar = true;
    this.url = "assets/img/avatars/prueba1.png";
    this.urlFirma = "assets/img/firma-logo.png";

    this.firmaDigital = null
    // document.querySelector('#lbl_firma').innerHTML = 'Seleccionar Firma Digital'
    this.mda_atiende = 'NO';
    this.mda_categoria = null;
    this.ng_categorias.setDisabledState(true)

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;

    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;
    this.vmButtons[6].habilitar = true;
    this.vmButtons[7].habilitar = true;

    this.dusuario = true;
  }

  cancelar() {
    this.router.navigateByUrl('dashboard');
  }

  validaModificarUser() {
    this.ipSave = this.commonServices.getIpAddress();
    if (this.permisions[0].modificar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      this.confirmSave("seguro desea actualizar la información del usuario", "MOD_USER")
    }
  }

  async modifyUser() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let data = {
      rol: this.rolSeleccionado,
      usuario: this.usuarios,
      nombre: this.nombres,
      clave: this.claves,
      email: this.emails,
      avatar: this.url,
      firma: this.urlFirma,
      h_entrada: this.fentrada,
      h_salida: this.fsalida,
      estado: this.eusuario,
      id_empresa: this.empresaSeleccionado,
      id_sucursal: this.sucursalSeleccionado.id_sucursal,
      id_departamento:this.departamentoSelect.id_departamento,
      perfil: this.perfilSeleccionadoUser,
      id_usuario: this.userIdUpdate,
      ip: this.commonServices.getIpAddress(),
      accion: "Actualización del usuario " + this.nombres,
      id_controlador: myVarGlobals.fSeguridades,
      mesa_ayuda: this.mda_atiende,
      categoria: this.mda_categoria,
    }

    // Si hay Firma Digital, pedir contraseña
    if (this.fileList?.length > 0) {
      this.firmaPassword = await Swal.fire({
        titleText: 'Ingrese contraseña de Firma Digital',
        input: 'password',
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar la contraseña!'
          }
        },
        inputLabel: 'Contraseña',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        }
      })
    }

    console.log(data);
    this.seguridadServices.updateUsuario(data).subscribe(
      async (res: any) => {
        if (res){

          if (this.firmaPassword?.value) {
            try {
              let dataAnexo = {
                // Informacion para almacenamiento de anexo y bitacora
                module: this.permisions[0].id_modulo,
                component: myVarGlobals.fSeguridades,  // TODO: Actualizar cuando formulario ya tenga un ID
                identifier: this.userIdUpdate,
                custom1: this.firmaPassword.value,
                id_controlador: myVarGlobals.fSeguridades,  // TODO: Actualizar cuando formulario ya tenga un ID
                accion: `Nuevo anexo Firma Digital para Usuario ${this.userIdUpdate}`,
                ip: this.commonServices.getIpAddress(),
              }

              let response = await this.seguridadServices.fileService(this.fileList[0], dataAnexo);
              console.log(response)
            } catch (err) {
              console.log(err)
              this.toastr.warning(err.error?.message, 'Firma Digital')
            }
          }

          this.lcargando.ctlSpinner(false);
        }

        this.userIdUpdate = undefined;
        this.toastr.success('Datos actualizados con éxito');
        this.borrar();
        this.getRoles();
        this.lcargando.ctlSpinner(false);
        // this.dtElement.dtInstance.then((dtInstance: any) => {
        //   dtInstance.destroy();
        //   this.getRoles();
        // });

    },
    (error: any) => {
      console.log(error)
      this.toastr.info(error.error?.message);
      this.lcargando.ctlSpinner(false);
    })
  }

  obtenerPermisionsDoc(e) {
    this.dataFilterSelect = this.documentpermision.filter(d => d.id == e);
  }

  consultarDocuments() {
    this.vmButtons[10].habilitar = true;
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      if (this.docSeleccionado == undefined) {
        this.toastr.info("Debe seleccionar un Tipo de documento !!");
      } else {
        this.dbtnSaveDocPerm = false;

        this.vmButtons[10].habilitar = false;

        this.contadorDoc += 1;
        if (this.contadorDoc == 1) {
          this.dataConsultarDoc = this.dataFilterSelect;
        } else {
          this.commonServices.refreshDataDoc.next(this.dataFilterSelect);
        }
      }
    }
  }

  validaSavePermisionsDoc() {
    this.commonServices.actionDocCall.next(null);
  }

  savePermisionDoc() {
    this.lcargando.ctlSpinner(true);
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let data = {
        info: this.dataSaveDocPermi,
        ip: this.commonServices.getIpAddress(),
        accion: "Actualización de permisos de documento ",
        id_controlador: myVarGlobals.fSeguridades
      }
      this.seguridadServices.savetFilterDocPerm(data).subscribe(res => {
        this.consultarDocuments();
        this.toastr.success(res['message']);
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.toastr.info(error.error.message);
      })
    }
  }

  savePermisionsComponent(){
   this.comVsrv.changePermisions.next(null);
  }

  modalDepartamentos(){
    let modal = this.modalService.open(ModalDepartamentosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  descargarFirma(anexo: any) {
    let data = {
      storage: anexo.storage,
      name: anexo.name
    }

    this.seguridadServices.downloadAnexo(data).subscribe(
      (resultado) => {
        const url = URL.createObjectURL(resultado)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', anexo.original_name)
        link.click()
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  async eliminarFirma(anexo: any) {
    let result = await Swal.fire({
      title: 'Eliminar Firma Digital',
      text: 'Seguro/a desea eliminar la Firma Digital de este Usuario?',
      icon: 'question',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      let data = {
        // Data del archivo
        id_anexo: anexo.id_anexos,
        component: myVarGlobals.fSeguridades,
        module: this.permisions[0].id_modulo,
        identifier: this.userIdUpdate,
        // Datos para registro en Bitacora
        // cambiar con el que haga despues para rentas
        id_controlador: myVarGlobals.fSeguridades,  // TODO: Actualizar cuando formulario ya tenga un ID
        accion: `Borrado de Anexo ${anexo.id_anexos}`,
        ip: this.commonServices.getIpAddress()
      }

      (this as any).mensajeSpinner = 'Eliminando Resolucion'
      this.lcargando.ctlSpinner(true);
      this.seguridadServices.deleteAnexo(data).subscribe(
        res => {
          this.lcargando.ctlSpinner(false)
          this.firmaDigital = null
          document.querySelector('#lbl_firma').innerHTML = 'Seleccionar Firma Digital'
          Swal.fire('Resolucion eliminada correctamente', '', 'success')
        },
        err => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error lbl_firmaupdateeliminando Resolucion')
        }
      )
    }
  }

  cargaFirma(archivos: FileList) {
    if (archivos.length > 0) {
      this.fileList = archivos
      document.querySelector('#lbl_firma').innerHTML = archivos[0].name
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Concepto')
      }, 50)
      // console.log(this.fileList)
    }
  }

}

