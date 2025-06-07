import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoPresupuestoService } from './catalogo-presupuesto.service';
import * as myVarGlobals from '../../../global';
import { CommonService } from '../../../services/commonServices'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';
import { CcModalTablaCatalogoPresupuestoComponent } from 'src/app/config/custom/cc-modal-tabla-catalogo-presupuesto/cc-modal-tabla-catalogo-presupuesto.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { environment } from 'src/environments/environment';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-catalogo-presupuesto',
  templateUrl: './catalogo-presupuesto.component.html',
  styleUrls: ['./catalogo-presupuesto.component.scss'],
  providers: [DialogService]
})
export class CatalogoPresupuestoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;


  //@Output() CloseModalTable = new EventEmitter();

  grid: any;
  gridConfig: object;
  cuenta: any;
  numCatalogoCodigo: string;
  nameCatalogoPresupuesto: string;
  estadoCatalogoPresupuesto: any;
  descripCatalogoPresupuesto: string;
  tipoCatalogoPresupuesto: string;
  codigoRelacionado: string;

  isCreando: boolean = false

  field: any;
  cssClass: any = "custom";
  lengthCaracter: any;
  treeData: any;
  dataUser: any;
  permisions: any;
  codigoGlobalMayor: any;

  tipeAccountMayor: any;
  nivelAccountMayor: any;
  saldoAccountMayor: any /* = "$ 100.000.000,0000" */ = parseFloat('0.0000').toFixed(4);
  validaSaldo: any;
  claseAccountMayor: any;
  idAccountMayor: any;
  cuentaAccount: any;
  nameAccount: any;
  nivelAccount: any;
  claseCuenta: any = 0;
  nameCodigoficial: any;
  codigoficial: any;
  codigoMigrado: any;
  newAcc: any;
  clasAction: any;
  grupoDetail: any;
  grupoCuenta: any = 0;
  disabledNew: any;
  btnModificar: any;
  btnGuardar: any;
  aa: any;
  codigoSaveFinal: any;//codigo a guardar
  tipoSaveFinal: any;//grupo a guardar
  icon_edit: any;
  validaAcc: any = false;
  excelData: any = [];
  dataPrint: any;
  btnPrint: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  checkAuth: any = true;
  valueDivisa: any;
  numAccount: any;
  processing: any = false;
  vmButtons: Botonera[];
  empresLogo: any;

  permiso_ver: any = "0";

  constructor
    (
      private pCuentasService: CatalogoPresupuestoService,
      private commonService: CommonService,
      private toastr: ToastrService,
      private router: Router, private excelService: ExcelService,
      private modalService: NgbModal,
      public dialogService: DialogService,
    ) {

    const data = [];

    this.gridConfig = {

      title: 'ARBOL CATALOGO PRESUPUESTARIO',
      height: 'fit',
      selModel: 'rows',
      trackOver: true,
      id: 'GridPlanCuenta',
      theme: 'gray',
      tbar:
        [
          /* {
            text: 'Expadir Todo',
            handler: function () {
              this.expandAll();
            },
          },  */
          {
            text: 'Contraer Todo',
            handler: function () {
              this.collapseAll();

            },
          },
        ],
      data: {
        items: data,
        fields: ['codigo', 'nombre', 'nivel', 'codigo_relacionado', 'descripcion_general']
      },
      events: this.getEvents(),
      defaults: {
        type: 'string',
        sortable: true,
        resizable: true
      },
      columns: [
        {
          type: 'tree',
          title: 'CODIGO',
          width: 200,
          editable: false,
          index: 'codigo'
        }, {
          index: 'nombre',
          title: 'NOMBRE CODIGO PRESUPUESTARIO',
          minWidth: 350,
          editable: false,
          flex: 1
        }, {
          index: 'codigo_relacionado',
          title: 'CODIGO REALACIONADO',
          editable: false,
          width: 200
        }, {
          index: 'descripcion_general',
          title: 'DESCIPCIÓN',
          editable: false,
          type: 'text',
          autoHeight: true,
          width: 700
        }
      ]
    };


  }


  ref: DynamicDialogRef;

  ngOnInit() {

    this.vmButtons = [
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVA PARTIDA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      {orig: 'btnsPlanCuentas', paramAccion: '', boton: { icon: 'far fa-eraser', texto: 'LIMPIAR'}, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: 'btn btn-sm btn-warning', habilitar: false},
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-file-pdf", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      //{ orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.validaPermisos()
    }, 50);

  }

  validaPermisos() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fPlanCuentas,
      id_rol: id_rol
    }

    this.lcargando.ctlSpinner(true);
    this.commonService.getPermisionsGlobas(data).subscribe(
      (res: any) => {

        this.permisions = res['data'];

        this.permiso_ver = this.permisions[0].abrir;

        if (this.permisions[0].abrir == "0") {

          this.toastr.info("Usuario no tiene Permiso para ver el formulario de plan de cuentas");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);

        } else {

          this.getLengtParameters();

        }
      },
      (error: any) => {

        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVA PARTIDA":
        this.crearCuenta();
        // this.confirmNewCuenta('CUENTA')
        break;
      case "NUEVO":
        this.RegistrarCuenta();
        // this.confirmNewCuenta('SUBCUENTA')
        break;
      case "GUARDAR":
        this.confirmSave();
        break;
      case "MODIFICAR":
        this.confirmUpdate();
        break;
      case "LIMPIAR":
        // this.confirmUpdate();
        this.vmButtons[0].showimg = true
        this.vmButtons[1].showimg = false

        this.numCatalogoCodigo = null
        this.nameCatalogoPresupuesto = null
        this.descripCatalogoPresupuesto = null
        this.estadoCatalogoPresupuesto = 'A'
        this.codigoRelacionado = null
        this.tipoCatalogoPresupuesto == 'GRUPO'

        break;
      case "EXCEL":
        this.prepareData();
        break;
      case "PDF":
        this.savePrint();
        break;
    }
  }

  /* Funcion que contiene todo los eventos del grid para el arbol */
  getEvents() {
    return [
      {
        init: this.CargarPlanCuentaArbol,
        scope: this
      }, {
        rowdblclick: this.DbClicEventPlanCuenta,
        scope: this
      }
    ];
  }

  /* Cargar plan de cuentas grid*/
  CargarPlanCuentaArbol(grid) {
    this.grid ||= grid
    grid.showLoadMask('Actualizando...');
    this.pCuentasService.JsonPresupuestoCatalogo().subscribe(
      (res: any) => {
        console.log(res);
        // let arreglo_tree = (res[0].json_agg).replaceAll("child3", "child").replaceAll("child4", "child").replaceAll("child5", "child").replaceAll("child6", "child").replaceAll("child7", "child");
        // let obj = JSON.parse(arreglo_tree);

        grid.setData(res.data);
        grid.update();

        grid.hideLoadMask();


      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);

      })

  }

  DbClicEventPlanCuenta(grid, o) {
    // console.log(o)
    this.CargaDetalleCatalogoPresupuesto(o.data);
  }





  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para crear el archivo excel
  */
  exportAsXLSX() {
    this.lcargando.ctlSpinner(false);
    this.excelService.exportAsExcelFile(this.excelData[0], 'Cuentas');
  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para obtener los parameytros de validacion de caracteres y longitudes
  */
  getLengtParameters() {
    this.pCuentasService.getLengtCaracteres().subscribe(res => {

      this.lengthCaracter = res['data'][0];

      this.printData();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }




  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para seleccionar el nodo
  */
  CargaDetalleCatalogoPresupuesto(catalogo: any) {

    // console.log(catalogo);

    this.lcargando.ctlSpinner(true);
    this.disabledNew = true;
    this.isCreando = false

    this.vmButtons[0].showimg = false  // Nueva Cuenta
    this.vmButtons[1].showimg = true;  // nuevo
    this.vmButtons[2].habilitar = true;  //guardar
    this.vmButtons[3].habilitar = false;  //editar

    this.newAcc = false;
    this.btnGuardar = false;

    this.validaAcc = true;
    this.btnModificar = false;

    // Muestra los detalles en el formulario superior
    this.pCuentasService.catalogoPresupuestoId({ id: catalogo['codigo'] }).subscribe(
      (e: any) => {
        // console.log(e);
        let data = e['data'][0]
        this.lcargando.ctlSpinner(false);
        this.numCatalogoCodigo = data.codigo;
        this.nameCatalogoPresupuesto = data.nombre;
        this.estadoCatalogoPresupuesto = data.estado.trim(); /* (data.estado.trim() == "A") ? 'ACTIVO' : 'PASIVO' */
        this.descripCatalogoPresupuesto = data.descripcion_general;
        this.tipoCatalogoPresupuesto = data.tipo;
        this.codigoRelacionado = data.codigo_relacionado
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false)
        this.toastr.info(error.error.message, 'Error cargando Codigo Presupuesto')
      }
    );
  }



  /* setNewAccount() {
    this.cuentaAccount = "";
    this.nameAccount = "";
    this.nivelAccount = "";
    this.claseCuenta = 0;
    this.grupoCuenta = 0;
  } */

  async crearCuenta() {
    //, , 'question'
    const result = await Swal.fire({
      titleText: 'Creacion de Partida',
      text: 'Esta seguro/a de crear una partida de primer nivel?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    })

    if (result.isConfirmed) {
      this.isCreando = true

      this.numCatalogoCodigo = null
      this.nameCatalogoPresupuesto = null
      this.descripCatalogoPresupuesto = null
      this.estadoCatalogoPresupuesto = 'A'
      this.codigoRelacionado = '0'
      this.tipoCatalogoPresupuesto == 'GRUPO'

      this.vmButtons[2].habilitar = false
      this.vmButtons[3].habilitar = true
    }
  }


  async RegistrarCuenta() {
    this.isCreando = true
    if (this.tipoCatalogoPresupuesto == 'GRUPO') {
      let response = await Swal.fire({
        title: 'Desea crear una partida GRUPO o DETALLE?',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'GRUPO',
        denyButtonText: 'DETALLE',
        cancelButtonText: 'Cancelar'
      })
      if (response.isConfirmed) {  // GRUPO
        this.tipoCatalogoPresupuesto = 'GRUPO'
      } else if (response.isDenied) {  // DETALLE
        this.tipoCatalogoPresupuesto = 'DETALLE'
      }
    }
    this.codigoRelacionado = (this.tipoCatalogoPresupuesto == 'DETALLE')
      ? this.codigoRelacionado
      : this.numCatalogoCodigo
    this.estadoCatalogoPresupuesto = 'A'
    this.descripCatalogoPresupuesto = null
    this.nameCatalogoPresupuesto = null
    this.numCatalogoCodigo = null

    this.vmButtons[2].habilitar = false
    this.vmButtons[3].habilitar = true
  }

  /**
   * Valida los datos que hayan sido ingresados
   * @returns Promise<boolean|string>
   */
  validateData() {
    return new Promise((resolve, reject) => {
      let message = ''

      if (this.numCatalogoCodigo == null || !this.numCatalogoCodigo.trim().length) {
        message += '* No ha asignado un Codigo a la Partida.<br>'
      }

      if (this.nameCatalogoPresupuesto == null || !this.nameCatalogoPresupuesto.trim().length) {
        message += '* No ha asignado un Nombre a la Partida.<br>'
      }

      if (this.descripCatalogoPresupuesto == null || !this.descripCatalogoPresupuesto.trim().length) {
        message += '* No ha ingresado una Descripcion a la Partida.<br>'
      }

      return (!message.length) ? resolve(true) : reject(message)
    })
  }

  async confirmSave() {

    try {
      // (this as any).mensajeSpinner = 'Validando datos'
      await this.validateData()

      try {
        let response = await Swal.fire({

          title: "Atención!!",
          text: "Seguro/a desea guardar la Partida?",
          //icon: "warning",
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        })

        if (response.isConfirmed) {
          // Almacenar la cuenta
          this.lcargando.ctlSpinner(true);
          (this as any).mensajeSpinner = 'Almacenando Partida'

          this.cuenta = {
            codigo: this.numCatalogoCodigo,
            codigo_relacionado: this.codigoRelacionado,
            tipo: this.tipoCatalogoPresupuesto,
            nombre: this.nameCatalogoPresupuesto,
            descripcion_general: this.descripCatalogoPresupuesto,
            estado: this.estadoCatalogoPresupuesto,
          }

          // console.log({cuenta: this.cuenta})
          let response = await this.pCuentasService.setCuenta({cuenta: this.cuenta})
          this.lcargando.ctlSpinner(false)
          console.log(response)
          this.CargarPlanCuentaArbol(this.grid)
          Swal.fire('Partida almacenada correctamente', '', 'success')
        }
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Almacenamiento de Partida')
      }
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err, 'Validación de Datos', { enableHtml: true })
    }
  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para guardar la nueva cuenta
  */

  /* guardarAccount() {

    if (this.permisions[0].guardar == "0") {

      this.toastr.info("Usuario no tiene permiso para guardar");

    } // else {

      if (this.grupoDetail) {
        this.tipoSaveFinal = this.grupoCuenta;
      }

      let g = this.codigoSaveFinal.split(this.lengthCaracter.caracter);
      let grupo = g[0];
      let grupoFinal;

      if (grupo == "1") {
        grupoFinal = "Activo"
      } else if (grupo == "2") {
        grupoFinal = "Pasivo"
      } else if (grupo == "3") {
        grupoFinal = "Patrimonio"
      } else if (grupo == "4") {
        grupoFinal = "Ingresos"
      } else if (grupo == "5") {
        grupoFinal = "costos"
      }
      if (this.nameAccount == undefined || this.nameAccount == "") {

        this.toastr.info("Debe ingresar el nombre de la nueva cuenta");
        let autFocus = document.getElementById("IdnameAccount").focus();
        return;

      } else if (this.claseCuenta == undefined || this.claseCuenta == 0) {

        this.toastr.info("Seleccione una clase para la nueva cuenta");
        return;

      } else if ((this.grupoCuenta == undefined || this.grupoCuenta == 0) && this.grupoDetail) {

        this.toastr.info("Seleccione un grupo");
        return;

      } else if ((parseInt(this.nivelAccount) == this.lengthCaracter.lengthniveles) && (this.grupoCuenta == "GRUPO")) {

        this.toastr.info("No se puede crear un nuevo GRUPO sobre este nivel, solo cuenta de detalles");
        return;

      } else {



        this.lcargando.ctlSpinner(true);
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        let id_empresa = this.dataUser.id_empresa;

        let data = {
          ip: this.commonService.getIpAddress(),
          accion: `Creación de nueva cuenta con código ${this.codigoSaveFinal}`,
          id_controlador: myVarGlobals.fPlanCuentas,
          tipo: this.tipoSaveFinal.toUpperCase(),
          grupo: grupoFinal.toUpperCase(),
          clase: this.claseCuenta.toUpperCase(),
          nivel: this.nivelAccount,
          codigo: this.codigoSaveFinal,
          //codigo_padre: this.numAccountMayor,
          codigo_oficial: "0",
          codigo_migrado: "0",
          nombre: this.nameAccount,
          estado: "A",
          id_empresa: id_empresa
        }

        this.pCuentasService.saveNewAccount(data).subscribe(res => {

          this.disabledNew = true;
          this.vmButtons[1].habilitar = false;
          this.newAcc = false;
          // this.setNewAccount();
          this.toastr.success(res['message']);

          this.lcargando.ctlSpinner(false);

          // const grid = Fancy.getWidget('GridPlanCuenta');
          // console.log(grid);
          // grid.setTitle('New Title');


        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
        })


      }
    // }
  } */

  async confirmUpdate() {

    Swal.fire({
      title: "Atención!!",
      text: "Seguro desea modificar la Partida?",
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.modificarAccount();
      }
    })

  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para modificar una cuenta
  */
  async modificarAccount() {

    if (this.permisions[0].editar == "0") {

      this.toastr.info("Usuario no tiene permiso para modificar");
      return
    } /* else { */

      if (this.nameCatalogoPresupuesto == undefined || this.nameCatalogoPresupuesto == "") {
        this.toastr.info("Debe ingresar el nombre de la nueva Partida");
        // let autFocus = document.getElementById("IdnameAccount").focus();
        return
      } else if (this.descripCatalogoPresupuesto == undefined || this.descripCatalogoPresupuesto.trim() == '') {
        this.toastr.info("Debe ingresar una descripcion para la Partida");
        return
      } else if ((this.grupoCuenta == undefined || this.grupoCuenta == 0) && this.grupoDetail) {
        this.toastr.info("Seleccione un grupo");
        return
      } /* else { */

        let data = {
          nombre:this.nameCatalogoPresupuesto,
          codigo: this.numCatalogoCodigo,
          descripcion_general: this.descripCatalogoPresupuesto
        }

        this.lcargando.ctlSpinner(true);
        try {
          (this as any).mensajeSpinner = 'Actualizando Catalogo Presupuestario'
          let response = await this.pCuentasService.updateCuenta({catalogo: data})
          console.log(response)

          // const grid = Fancy.getWidget('GridPlanCuenta');
          // grid.showLoadMask('Actualizando...');
          this.CargarPlanCuentaArbol(this.grid);
          //
          this.lcargando.ctlSpinner(false)
          this.toastr.success('Actualizacion exitosa')
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error actualizando Catalogo Presupuestario')
        }

        /* this.pCuentasService.updateCuenta(data).subscribe(res => {

          this.disabledNew = false;
          this.vmButtons[1].habilitar = true;
          this.newAcc = false;
          // this.setNewAccount();
          this.toastr.success(res['message']);

          const grid = Fancy.getWidget('GridPlanCuenta');
          grid.showLoadMask('Actualizando...');

          this.CargarPlanCuentaArbol(grid);

          const grid = Fancy.getWidget('GridPlanCuenta');
          grid.setTitle('New Title');

          this.lcargando.ctlSpinner(false);

        }, error => {

          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);

        }) */

      // }
    // }
  }

  /* editAccount() {

    this.lcargando.ctlSpinner(true);

    if (this.permisions[0].editar == "0") {

      this.lcargando.ctlSpinner(false);
      this.toastr.info("Usuario no tiene permiso para editar");

    } else {

      this.lcargando.ctlSpinner(false);

      if (!this.validaAcc) {

        this.toastr.info("Debe seleccionar una cuenta");

      } else {

        document.getElementById('IdnameAccount').focus();
        this.newAcc = true;

        if (parseInt(this.nivelAccountMayor) == this.lengthCaracter.lengthniveles - 1) {

          this.disabledNew = false;
          //this.vmButtons[0].habilitar = true;
          this.btnGuardar = false;
          this.vmButtons[2].habilitar = true;
          this.grupoDetail = true;
          this.btnModificar = true;
          this.vmButtons[3].habilitar = false;
          //this.cuentaAccount = this.numAccountMayor;
          //this.nameAccount = this.nameAccountMayor;
          this.nivelAccount = this.nivelAccountMayor;
          this.claseCuenta = this.claseAccountMayor;
          this.grupoCuenta = this.tipeAccountMayor;

          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });

        } else {

          this.grupoDetail = false;
          this.btnGuardar = false;
          this.vmButtons[2].habilitar = true;
          this.disabledNew = false;
          //this.vmButtons[0].habilitar = true;
          this.btnModificar = true;
          this.vmButtons[3].habilitar = false;
          //this.cuentaAccount = this.numAccountMayor;
          //this.nameAccount = this.nameAccountMayor;
          this.nivelAccount = this.nivelAccountMayor;
          this.claseCuenta = this.claseAccountMayor;
          this.grupoCuenta = this.tipeAccountMayor;

          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });

        }
      }
    }
  } */

  clear() {
    //this.router.navigateByUrl('dashboard');
    // this.permisions = false;
    this.codigoGlobalMayor = "";
    //this.numAccountMayor = "";
    //this.nameAccountMayor = "";
    this.tipeAccountMayor = "";
    this.nivelAccountMayor = "";
    this.saldoAccountMayor = parseFloat('0.0000').toFixed(4);
    this.validaSaldo = false;
    //this.estadoAccountMayor = "";
    this.claseAccountMayor = "";
    this.idAccountMayor = "";
    this.cuentaAccount = "";
    this.nameAccount = "";
    this.nivelAccount = "";
    this.claseCuenta = 0;
    this.nameCodigoficial = "";
    this.codigoficial = "";
    this.codigoMigrado = "";
    this.newAcc = false;
    this.grupoDetail = false;
    this.grupoCuenta = 0;
    this.disabledNew = false;
    this.btnModificar = false;
    this.btnGuardar = false;
    this.codigoSaveFinal = "";
    this.tipoSaveFinal = "";
    this.validaAcc = false;
    this.checkAuth = true;
    this.valueDivisa = "";
    this.numAccount = "";
    this.getButtons();

    /*this.getTreePlanCuentas();*/

    setTimeout(() => {
      this.vmButtons[0].showimg = true
      this.vmButtons[1].showimg = false
      this.vmButtons[3].habilitar = false;
    }, 10);

  }

  changeAction() {
    this.clasAction = !this.clasAction;
  }

  prepareData() {
    window.open(environment.ReportingUrl + "rpt_catalogo_presupuesto.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1", '_blank');
  }

  onClicConsultaCatalogoPresupuesto(content) {

    let busqueda = (typeof this.numCatalogoCodigo === 'undefined') ? "" : this.numCatalogoCodigo;

    let consulta = {
      busqueda: this.numCatalogoCodigo
    }

    localStorage.setItem("busqueda_cuetas", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCatalogoPresupuestoComponent, {
      header: 'Partidas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((catalogo: any) => {

      if (catalogo) {

        console.log(catalogo);

        this.CargaDetalleCatalogoPresupuesto(catalogo.data);
        //console.log(cuentas.data.codigo);
        //this.CargarCuentas(cuentas, i);
      }

    });



  }

  CargarCuentaEditar(event: any) {
    this.CargaDetalleCatalogoPresupuesto(event);
    //this.modalService.dismissAll();
  }


  printData() {

    if (this.permisions[0]) {
      if (this.permisions[0].imprimir == "0") {
        this.btnPrint = false;
        this.vmButtons[5].habilitar = true;
        this.processing = true;
        this.lcargando.ctlSpinner(false);
      } else {
        this.btnPrint = true;
        this.vmButtons[5].habilitar = false;
        this.pCuentasService.printAccounts().subscribe(res => {
          this.dataPrint = res['data'];
          this.lcargando.ctlSpinner(false);
          this.processing = true;
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
        })
      }
    }


  }

  savePrint() {
    window.open(environment.ReportingUrl + "rpt_catalogo_presupuesto.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1", '_blank')
  }

  getButtons() {

  }

}
