import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../global';
import { CommonService } from '../../../../app/services/commonServices';
import { CommonVarService } from '../../../../app/services/common-var.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductosService } from './productos.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ValidacionesFactory } from '../../../config/custom/utils/ValidacionesFactory';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  processing: any;
  dataUser: any;
  permissions: any;
  arrayProductos: any;
  arrayUDM: any;
  producto: any = { claseSelect: 'PROV', stock: 0, stock_minimo: 0, fk_grupo: 0, udm: 0 };
  dataDT: any = [];
  validaDt: any = false;
  randomGenerate: any;
  actions:any = {btnSave:true, btnUpdated:false};

  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private prvSrv: ProductosService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnPrdInvProv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnPrdInvProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: true },
      { orig: "btnPrdInvProv", paramAccion: "", boton: { icon: "fa fa-ban", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);
    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateNewProduct();
        break;
      case "MODIFICAR":
        this.validateUpdate();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fProveeduriaProductos,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permissions = res['data'][0];
      if (this.permissions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de productos de proveeduria");
        this.vmButtons = [];
      } else {
        this.getTypesProductProve();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTypesProductProve() {
    this.prvSrv.getTypesProductProve().subscribe(res => {
      this.arrayProductos = res['data'];
      this.getUDM();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUDM() {
    this.prvSrv.getUDM().subscribe(res => {
      this.arrayUDM = res['data'];
      this.getDataTableGlobals();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }


  getDataTableGlobals() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.prvSrv.getProductProve().subscribe(res => {
      this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.validaDt = true;
        this.dataDT = res['data'];
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
        this.toastr.info(error.error.message);
      });
  }

  generatedCode() {
    this.rand_code('ActivoFijo', 10);
  }

  rand_code(chars, lon) {
    let code = "";
    let x = 0;
    for (x = 0; x < lon; x++) {
      let rand = Math.floor(Math.random() * chars.length);
      code += chars.substr(rand, 1);
    }
    this.randomGenerate = code;
    let data = {
      codigo: this.randomGenerate
    }
    this.mensajeSppiner = "Cargando datos...";
    this.lcargando.ctlSpinner(true);
    this.prvSrv.validateSecuencial(data).subscribe(res => {
      this.producto.codigo = this.producto.claseSelect.substring(0, 3) + "-" + code;
      this.producto.codigo = this.producto.codigo.toUpperCase();
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.producto.codigo = "";
      this.toastr.info(error.error.message);
    })
  }

  cancel(){
    this.producto = { claseSelect: 'PROV', stock: 0, stock_minimo: 0, fk_grupo: 0, udm: 0 };
    this.actions = {btnSave:true, btnUpdated:false};
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
  }

  validateDataGlobal() {
    return new Promise((resolve, reject) => {
      if (this.producto.fk_grupo == 0) {
        this.toastr.info("Seleccione un tipo de suministro");
      } else if (this.producto.udm == 0) {
        this.toastr.info("Seleccione una unidad de medida");
      } else if (this.producto.nombre == "" || this.producto.nombre == undefined || this.producto.nombre == null) {
        this.toastr.info("Ingrese un nombre");
      } else {
        resolve(true);
      }
    });
  }

  async validateNewProduct() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar el producto?", "ADD_PRODUCT");
        }
      })
    }
  }

  async confirmSave(message, action, data?) {
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
        if (action == "ADD_PRODUCT") {
          this.saveNewProduct();
        }else if(action == "DELETE_PRODUCT"){
          this.deleteProduct(data);
        }else if(action == "UPDATED_PRODUCT"){
          this.updatedProduct();
        }
      }
    })
  }


  

  deleteProduct(dt){
    dt['ip'] = this.commonServices.getIpAddress(),
    dt['id_controlador'] = myVarGlobals.fProveeduriaProductos
    dt['accion'] = `Eliminación de producto ${this.producto.nombre}`;
    this.mensajeSppiner = "Eliminando...";
    this.lcargando.ctlSpinner(true);
    this.prvSrv.deleteProduct(dt).subscribe(res =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
      this.rerender();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  rerender(): void {
    this.dataDT = [];
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getDataTableGlobals();
    });
  }

  saveNewProduct() {
    this.producto['ip'] = this.commonServices.getIpAddress(),
    this.producto['id_controlador'] = myVarGlobals.fProveeduriaProductos
    this.producto['accion'] = `Creación de nuevo suministro de proveeeduria ${this.producto.nombre}`;
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.prvSrv.saveProduct(this.producto).subscribe(res =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
      this.rerender();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  updatedProduct() {
    this.producto['ip'] = this.commonServices.getIpAddress(),
    this.producto['id_controlador'] = myVarGlobals.fProveeduriaProductos
    this.producto['accion'] = `Actualización de suministro de proveeeduria ${this.producto.nombre}`;
    this.mensajeSppiner = "Modificando...";
    this.lcargando.ctlSpinner(true);
    this.prvSrv.updateProduct(this.producto).subscribe(res =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
      this.rerender();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  deleteItems(dt){
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.confirmSave("Seguro desea eliminar el producto?", "DELETE_PRODUCT",dt);
    }
  }

  async validateUpdate(){
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar el producto?", "UPDATED_PRODUCT");
        }
      })
    }
  }

  updatedItems(dt){   
    this.producto = dt;
    this.actions.btnSave = false; 
    this.actions.btnUpdated = true;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
  }
}
