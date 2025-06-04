import { Component, OnInit, ViewChild } from '@angular/core';
import { BodegaBienesService } from './bodega-bienes.service';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EncargadoComponent } from '../../../../config/custom/encargado/encargado.component';
import { Subject } from 'rxjs';
@Component({
standalone: false,
  selector: 'app-bodega',
  templateUrl: './bodega-bienes.component.html',
  styleUrls: ['./bodega.component.scss']
})
export class BodegaBienesComponent implements OnInit {

  bodega: any ={
    nombre: null,
    ciudad: null,
    direccion: null,
    estado: null,
    telefono: null,
    encargado: null,
    encargado_input: null,
    stock_menor_cero: null
  }

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";

  dataBodega: any = []

  dataCatalogo: any = []
  disabledEstructura: any = false;
  filter: any;
  paginate: any
  permisions: any;
  vmButtons: any

  dataUser: any;
  permissions: any;

  disabledBodega = true
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  //dataUser: any;
  //permisions: any;
  dataEmpresa: any;
  empresaSeleccionado: any;
  sucursalSeleccionado: any;
  userSeleccionado: any;
  ciudadSeleccionado: any;
  estadoBodega: any;
  dataSucursal: any;
  disbledSucursal: any = false;
  disbledUser: any = false;
  dataUsers: any;
  nombreBodega: any;
  telefono: any;
  direccionBodega: any;
  //dataCatalogo: any;
  //disabledBodega: any = false;
  dguardarbodega: any = false;
  dmodificarBodega: any = false;
  dcancelBodega: any = false;
  dborrarBodega: any = false;
  dataUpdate: any;
  enCero: any = false;
  //dataBodega: any;
  dataStruct: any;
  dborraStruct: any = false;
  dcancelaStruct: any = false;
  dmodificaStruct: any = false;
  dguardaStruct: any = false;
  bodegaSelect: any;
  tipoAlmaSelect: any;
  filaEstruc: any;
  columnaEstruc: any;
  codigoEstruc: any;
  dimensionEstruc: any;
  valida_code: any = false;
  collapse: any = false;
  validaDtStock: any = false;
  dataStockBodega: any;
  nameProduct: any = "";
  udmProduct: any = "";
  numParteProduct: any = "";
  stokProduct: any = "";
  sucursalProduct: any = "";
  CiudadProduct: any = "";
  addressProduct: any = "";
  telfProduct: any = "";
  bodeganameProduct: any  = "";
  FilaProduct: any = "";
  columProduct: any  = "";
  codigoProduct: any = "";
  flag:any = false;
  validaDtBodega1: any = false;
  dataBodega1:any;


  dataT: any = [];
  validaDtBodega: any = false;
  constructor(
    private bodegaService: BodegaBienesService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modal_Encargado: NgbModal
  ) {



    this.commonServices.setDataStruc.asObservable().subscribe(res => {
      this.dataStruct = res;
      this.disabledEstructura = true;

      this.vmButtons[4].habilitar = true;
      this.vmButtons[5].habilitar = true;
      this.vmButtons[6].habilitar = false;
      this.vmButtons[7].habilitar = false;
      this.bodegaSelect = this.dataStruct.fk_bodega_cab;
      this.tipoAlmaSelect = this.dataStruct.tipo_almacenamiento;
      this.filaEstruc = this.dataStruct.fila;
      this.columnaEstruc = this.dataStruct.columna;
      this.codigoEstruc = this.dataStruct.codigo;
      this.dimensionEstruc = this.dataStruct.dimension;
    })

    this.commonVrs.encargadoSelect.asObservable().subscribe(
      (res)=>{
        console.log(res);
        this.bodega.encargado  = res['id_empleado']
        this.bodega.encargado_input = res['emp_primer_nombre'] + " " + res['emp_primer_apellido']
      }
    )
    this.commonServices.refreshDataTableStruct.asObservable().subscribe(res =>{
      if(!this.validaDtBodega){
        this.getDataTable1();
      }
    })
    this.commonServices.refreshDataTableStruct.asObservable().subscribe(res =>{
      if(!this.validaDtBodega){
        this.getDataTable();
      }else{
       //this.rerender();
      }
    })

  }

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
  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-secondary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},

      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},
    ];

    this.filter = {
      nombre_bodega: null,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
    }

    setTimeout(()=>{
      this.validatePermission()
    },50)
    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if(element.paramAccion == 1){
          element.permiso = true; element.showimg = true;
        }else{
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);
    this.getCiudades();

    setTimeout(() => {
        this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fBodegaMovimiento,
      id_rol: id_rol
    }
    /*this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Bodega");
      } else {
        setTimeout(() => {
          //this.getStockXCeller();
          this.getEmpresa();
        }, 100);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })*/
  }, 10);
  this.getDataTable1();
  this.getDataTable();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion+evento.items.boton.texto) {
      case "1NUEVO":
        this.newProduct();
      break;
      case "1GUARDAR":
        this.validaSaveBodega();
      break;
      case "1MODIFICAR":
      this.validaUpdateBodega();
      break;
      case "1CANCELAR":
      this.deleteCeller2();
      break;


      case "2NUEVO":
      this.newStruct();
      break;
      case "2GUARDAR":
        this.validaSaveStruc();
      break;
      case "2MODIFICAR":
        this.confirmAction("Seguro desea actualizar el registro?", "UPDATE_STRUCT");
      break;
      case "2CANCELAR":
        this.deleteStruc2();
      break;

    }
  }

  newProduct(){
    // console.log('Entro');
    this.disabledBodega = false
    this.vmButtons[0].habilitar = true
    this.vmButtons[1].habilitar = false
    this.vmButtons[2].habilitar = true
    this.vmButtons[3].habilitar = false
  }

  guardarBodega(){
    this.lcargando.ctlSpinner(true);

    console.log(this.bodega);
    this.bodegaService.saveBodega(this.bodega).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.getDataTable();
      this.borrar()
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getEmpresa() {
    this.bodegaService.getEmpresa().subscribe(res => {
 /*      this.lcargando.ctlSpinner(false); */
      this.dataEmpresa = res['data'];
      this.getBodegas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }
  updateBodega(dt){
    console.log(dt);
    this.bodega = dt
    this.bodega.encargado_input = dt['empleado'] != null ? dt['empleado']['emp_primer_nombre'] + " " + dt['empleado']['emp_primer_apellido'] : null
    this.disabledBodega = false
    this.vmButtons[0].habilitar = true
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = false
    this.vmButtons[3].habilitar = false
  }


  async validaUpdateBodega() {
    if (this.permissions.editar == "0") {
      this.toastr.info("usuario no tiene permiso para editar");
    } else {
      let resp = await this.validaGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmAction("Seguro desea actualizar el registro?", "UPDATE_BODEGA");
        }
      })
    }
  }




  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    console.log(this.paginate);
    console.log(Object.assign(this.paginate, newPaginate));
    this.getDataTable();

  }

  changePaginate1(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getDataTable1();
  }



  validaGlobal(){
    let flag = true
    return new Promise((res,rej)=>{
      if(this.bodega.nombre == null || this.bodega.nombre == undefined){
        this.toastr.info("Ingrese un nombre");
        flag = false
      }else if(this.bodega.ciudad == null || this.bodega.ciudad == undefined){
        this.toastr.info("Ingrese una ciudad");
        flag = false
      }else if(this.bodega.direccion == null || this.bodega.direccion == undefined){
        this.toastr.info("Ingrese una direccion");
        flag = false
      }else if(this.bodega.estado == null || this.bodega.estado == undefined){
        this.toastr.info("Ingrese una estado");
        flag = false
      }else if(this.bodega.telefono == null || this.bodega.telefono == undefined){
        this.toastr.info("Ingrese una telefono");
        flag = false
      }else if(this.bodega.encargado == null || this.bodega.encargado == undefined){
        this.toastr.info("Ingrese una encargado");
        flag = false
      }


      flag ? res(true) : res(false)
    })
  }


  getBodegas() {
    this.bodegaService.getInformationCellarGeneral().subscribe(res => {
     /*  this.lcargando.ctlSpinner(false); */
     console.log(res['data']);
      this.dataBodega = res['data'];
      console.log(this.dataBodega)
      /* this.getStockXCeller(); */
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
    })
  }
  async confirmAction(message, action) {
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
        if (action == "ADD_BODEGA") {
          this.saveBodega();
        } else if (action == "UPDATE_BODEGA") {
          this.modificarBodega();
        } else if (action == "ADD_STRUC") {
          this.saveStruct();
        } else if (action == "UPDATE_STRUCT") {
          this.updateStruct();
        }

      }
    })
  }

  inputNumVal(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 45 || key > 57)) {
      return false;
    }
    return true;
  }

  saveBodega() {
    this.lcargando.ctlSpinner(true);
    let data = {
      nombre: this.bodega.nombre,
      direccion: this.bodega.direccion,
      telefono: this.bodega.telefono,
      encargado: this.bodega.encargado,
      ciudad: this.bodega.ciudad,
      estado: this.bodega.estado,
      stockMenorCero: (this.enCero) ? 1 : 0,
      ip: this.commonServices.getIpAddress(),
      accion: `Ingreso de la nueva bodega ${this.nombreBodega}`,
      id_controlador: myVarGlobals.fBodegaMovimiento
    }
    console.log(data);
    this.bodegaService.saveBodega(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.commonServices.refreshDataTable.next(null);
      this.deleteCeller2();
      this.toastr.success(res['message']);
      this.dguardarbodega = false;
      this.getBodegas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  deleteCeller2() {
    this.nombreBodega = "";
    this.direccionBodega = "";
    this.telefono = "";
    this.empresaSeleccionado = "";
    this.sucursalSeleccionado = "";
    this.userSeleccionado = "";
    this.ciudadSeleccionado = "";
    this.estadoBodega = "";
    this.enCero = false;
    this.disabledBodega = false;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
  }

  modificarBodega(){
    this.lcargando.ctlSpinner(true);

    this.bodegaService.updateBodega(this.bodega).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      // this.commonServices.refreshDataTable.next(null);
      this.toastr.success(res['message']);
      this.disabledBodega = true;
      this.getDataTable();
      this.borrar()
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  borrar(){
    this.bodega ={
      nombre: null,
      ciudad: null,
      direccion: null,
      estado: null,
      telefono: null,
      encargado: null,
      stock_menor_cero: null
    }

    this.vmButtons[0].habilitar = false
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = true
    this.vmButtons[3].habilitar = false

    this.disabledBodega = true
  }

  saveStruct() {
    let data = {
      bodega: this.bodegaSelect,
      tipo: this.tipoAlmaSelect,
      fila: this.filaEstruc,
      columna: this.columnaEstruc,
      codigo: this.codigoEstruc,
      dimension: this.dimensionEstruc,
      ip: this.commonServices.getIpAddress(),
      accion: `Ingreso de nueva estructura de bodega con código ${this.codigoEstruc}`,
      id_controlador: myVarGlobals.fBodegaMovimiento
    }
    this.bodegaService.saveEstruture(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.commonServices.refreshDataTableStruct.next(null);
      this.deleteStruc();
      this.toastr.success(res['message']);
      this.dguardaStruct = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  updateStruct() {
    let data = {
      bodega: this.bodegaSelect,
      tipo: this.tipoAlmaSelect,
      fila: this.filaEstruc,
      columna: this.columnaEstruc,
      codigo: this.codigoEstruc,
      dimension: this.dimensionEstruc,
      id_struct: this.dataStruct.id_bodega_det,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de la bodega con código ${this.codigoEstruc}`,
      id_controlador: myVarGlobals.fBodegaMovimiento
    }
    this.bodegaService.updateEstruture(data).subscribe(res => {
      this.commonServices.refreshDataTableStruct.next(null);
      this.deleteStruc();
      this.toastr.success(res['message']);
      this.dmodificaStruct = false;
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  limpiarFiltro(){
    this.filter = {
      nombre_bodega: null,
      filterControl: ""
    }
  }

  getCiudades() {
    let data = {
      tipo: "'CIUDAD','TIPO ALMACENAMIENTO'"
    }
    this.bodegaService.getCiudades(data).subscribe(res => {
      this.dataCatalogo = res['data']['catalogos'];
    }, error => {
      this.toastr.info(error.error.message);
    })
}

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fContribuyente,
      id_rol: this.dataUser.id_rol,
    };

    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        console.log(res);
        this.permissions = res["data"][0];
        // console.log(this.permissions);
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Clientes"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          setTimeout(() => {
            // this.fillCatalog();
            this.getCiudades()
            this.getDataTable()
          }, 500);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getDataTable(){
    //this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    console.log(data);
    this.bodegaService.getInformationCellar(data)
      .subscribe(res => {

        // this.dataBodega = res['data'];
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.dataBodega = res['data']['data'];
        } else {
          this.dataBodega = Object.values(res['data']['data']);
        }

        this.lcargando.ctlSpinner(false);

      }, error => {

      });
  }

  getDataTable1(){
    /*this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };*/
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.bodegaService.getEstruture(data)
      .subscribe(res => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.dataBodega1 = res['data']['data'];
        } else {
          this.dataBodega1 = Object.values(res['data']['data']);
        }

        this.lcargando.ctlSpinner(false);

      }, error => {

      });
  }

  modalEncargado(){
    this.bodega.encargado = null;
    this.bodega.encargado_input = null;

    let modal = this.modal_Encargado.open(EncargadoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }
  getSucursal() {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("usuario no tiene permiso para consultar");
    } else {
      this.dataUsers = undefined;
      let data = {
        id_empresa: this.empresaSeleccionado
      }
      this.bodegaService.getSucursales(data).subscribe(res => {
/*       this.lcargando.ctlSpinner(false); */

        this.dataSucursal = res['data'];
        this.disbledSucursal = true;
      }, error => {
      this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }
  }

  obtenerUsuario() {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("usuario no tiene permiso para consultar");
    } else {
      this.dataUsers = undefined;
      let data = {
        id_empresa: this.empresaSeleccionado,
        id_sucursal: this.sucursalSeleccionado
      }
      this.bodegaService.getUser(data).subscribe(res => {
  /*     this.lcargando.ctlSpinner(false); */
        this.dataUsers = res['data'];
        this.disbledUser = true;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }
  }

  newBodega() {
    this.disabledBodega = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    this.deleteCeller();
  }

  newStruct() {
    this.disabledEstructura = true;
    this.vmButtons[5].habilitar = false;
    this.vmButtons[6].habilitar = true;
    this.vmButtons[7].habilitar = false;
    this.deleteStruc();
  }

  deleteCeller() {
    console.log("fffff");
    this.bodega.nombre = "";
    this.bodega.ciudad = "";
    this.bodega.telefono = "";
    this.bodega.encargado_input = "";
    //this.ciudadSeleccionado = "";
    this.bodega.estado = "";
    this.bodega.stock_menor_cero = false;
  }

  deleteStruc() {
    this.bodegaSelect = "";
    this.tipoAlmaSelect = "";
    this.filaEstruc = "";
    this.columnaEstruc = "";
    this.codigoEstruc = "";
    this.dimensionEstruc = "";
  }

  deleteStruc2() {
    this.bodegaSelect = "";
    this.tipoAlmaSelect = "";
    this.filaEstruc = "";
    this.columnaEstruc = "";
    this.codigoEstruc = "";
    this.dimensionEstruc = "";
    this.disabledEstructura = false;
    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;
    this.vmButtons[6].habilitar = true;
    this.vmButtons[7].habilitar = true;
  }

  /*async validaUpdateBodega() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("usuario no tiene permiso para editar");
    } else {
      let resp = await this.validaGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmAction("Seguro desea actualizar el registro?", "UPDATE_BODEGA");
        }
      })
    }
  }*/

  async validaSaveBodega() {

      console.log('aaaaaa');
      let resp = await this.validaGlobal().then(respuesta => {
        if (respuesta) {
          console.log('ssssssssss');
          this.confirmAction("Seguro desea guardar el registro?", "ADD_BODEGA");
        }
      })

  }

  async validaUpdateStruc() {
    console.log(this.permisions);
    if (this.permisions[0].editar == "0") {
      this.toastr.info("usuario no tiene permiso para editar");
    } else {
      let resp = await this.validaGlobalStruc().then(respuesta => {
        if (respuesta) {
          this.confirmAction("Seguro desea actualizar el registro?", "UPDATE_STRUCT");
        }
      })
    }
  }
  validateCode() {
    let data = {
      codigo: this.codigoEstruc
    }
    this.bodegaService.validaCodeStruture(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      if (res['data'].length > 0) {
        this.valida_code = true;
      } else {
        this.valida_code = false;
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  async validaSaveStruc() {
    this.validateCode();

      let resp = await this.validaGlobalStruc().then(respuesta => {
        setTimeout(() => {
          if (!this.valida_code) {
            if (respuesta) {
              this.confirmAction("Seguro desea guardar el registro?", "ADD_STRUC");
            }
          } else {
            this.toastr.info("Código ya se existe");
          }
        }, 1000);
      })

  }


  validaGlobalStruc() {
    return new Promise((resolve, reject) => {
      if (this.bodegaSelect == undefined || this.bodegaSelect == "") {
        this.toastr.info("Seleccione una bodega");
      } else if (this.tipoAlmaSelect == undefined || this.tipoAlmaSelect == "") {
        this.toastr.info("Seleccione un tipo de almacenamiento");
      } else if (this.filaEstruc == "" || this.filaEstruc == undefined) {
        this.toastr.info("Ingrese una fila");
        document.getElementById('IdFilaEs').focus();
      } else if (this.columnaEstruc == "" || this.columnaEstruc == undefined) {
        this.toastr.info("Ingrese una columna");
        document.getElementById('IdColumnaEs').focus();
      } else if (this.codigoEstruc == "" || this.codigoEstruc == undefined) {
        this.toastr.info("Ingrese un codigo");
        document.getElementById('IdCodigoEs').focus();
      } else {
        resolve(true);
      }
    });
  }

  updateBodega1(dt){
    this.commonServices.setDataStruc.next(dt);
  }








}
